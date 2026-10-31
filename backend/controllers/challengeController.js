const DailyChallenge = require('../models/DailyChallenge');
const ChallengeAttempt = require('../models/ChallengeAttempt');
const User = require('../models/User');
const { notifyUser } = require('../utils/notificationService');
const { getCache, setCache, delCache } = require('../utils/redis');
const gemini = require('../utils/gemini');

// Helper to get today's date string (YYYY-MM-DD)
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to check if dates are consecutive (yesterday vs today)
const isYesterday = (lastDate) => {
  if (!lastDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const last = new Date(lastDate);
  last.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(today - last);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays === 1;
};

// @desc    Get today's daily challenge question and completion status
// @route   GET /api/challenges/daily
// @access  Private
const getDailyChallenge = async (req, res) => {
  try {
    const todayStr = getTodayDateString();
    const cacheKey = `challenge:today:${todayStr}`;

    // Check Redis cache first
    let challenge = await getCache(cacheKey);

    if (!challenge) {
      // Find today's challenge in DB
      challenge = await DailyChallenge.findOne({ date: todayStr });

      // If not found, generate one dynamically using rotating topics
      if (!challenge) {
        const categories = ['JavaScript', 'React', 'Node.js', 'DBMS', 'OOP', 'HR'];
        const dayIndex = new Date().getDate() % categories.length;
        const category = categories[dayIndex];
        const difficulty = 'Medium';

        console.log(`[Challenge Service] Creating daily challenge for: ${todayStr} (Category: ${category})...`);
        const questionText = await gemini.generateDailyChallenge(category);

        challenge = await DailyChallenge.create({
          date: todayStr,
          questionText,
          category,
          difficulty
        });
      }

      // Store in Redis cache for 24 hours
      await setCache(cacheKey, challenge, 86400);
    }

    // Check if user has already attempted this challenge today
    const attempt = await ChallengeAttempt.findOne({
      userId: req.user._id,
      date: todayStr
    });

    res.json({
      success: true,
      challenge: {
        _id: challenge._id,
        date: challenge.date,
        questionText: challenge.questionText,
        category: challenge.category,
        difficulty: challenge.difficulty
      },
      hasAttempted: !!attempt,
      attemptData: attempt || null
    });
  } catch (error) {
    console.error(`[Daily Challenge Fetch Error] ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to retrieve daily challenge.' });
  }
};

// @desc    Submit daily challenge answer, run AI check, update user XP, levels, and streaks
// @route   POST /api/challenges/daily/submit
// @access  Private
const submitDailyChallengeAnswer = async (req, res) => {
  try {
    const { userAnswer } = req.body;
    const todayStr = getTodayDateString();

    if (!userAnswer || userAnswer.trim() === '') {
      return res.status(400).json({ success: false, message: 'Answer response cannot be blank' });
    }

    // 1. Verify user hasn't already attempted today
    const existingAttempt = await ChallengeAttempt.findOne({
      userId: req.user._id,
      date: todayStr
    });

    if (existingAttempt) {
      return res.status(400).json({ success: false, message: 'You have already completed today\'s challenge.' });
    }

    // 2. Fetch challenge question text
    const challenge = await DailyChallenge.findOne({ date: todayStr });
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Today\'s challenge not loaded yet.' });
    }

    // 3. Call AI evaluation on single question
    console.log(`[Challenge Service] Evaluating answer response...`);
    const evaluation = await gemini.evaluateChallengeAnswer(challenge.questionText, userAnswer);

    // 4. Save attempt
    const attempt = await ChallengeAttempt.create({
      userId: req.user._id,
      date: todayStr,
      userAnswer,
      score: evaluation.score,
      feedback: evaluation.feedback,
      modelAnswer: evaluation.modelAnswer
    });

    // 5. Update user gamified stats: XP, Level, and Streak
    const user = await User.findById(req.user._id);

    // Award logic: +100 XP baseline + (AI score * 15 XP). Max score: 250 XP
    const xpGained = 100 + (evaluation.score * 15);
    user.xp += xpGained;

    // Check level upgrades (500 XP threshold per level)
    const oldLevel = user.level;
    const newLevel = Math.floor(user.xp / 500) + 1;
    let leveledUp = false;
    if (newLevel > oldLevel) {
      user.level = newLevel;
      leveledUp = true;
    }

    // Streak logic
    const lastChallenge = user.lastChallengeDate;
    if (!lastChallenge) {
      user.streak = 1;
    } else if (isYesterday(lastChallenge)) {
      user.streak += 1;
    } else {
      // Re-start streak if days skipped
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const last = new Date(lastChallenge);
      last.setHours(0, 0, 0, 0);
      
      if (today.getTime() !== last.getTime()) {
        user.streak = 1;
      }
    }

    user.lastChallengeDate = new Date();
    await user.save();

    // Trigger Notification rewards
    if (leveledUp) {
      await notifyUser({
        userId: req.user._id,
        title: 'Leveled Up!',
        message: `Congratulations! You reached Level ${newLevel}! Keep practicing to build XP.`,
        type: 'level_up'
      });
    }

    if (user.streak > 0 && user.streak % 3 === 0) {
      await notifyUser({
        userId: req.user._id,
        title: 'Streak Milestone!',
        message: `Outstanding! You hit a consecutive practice streak of ${user.streak} days.`,
        type: 'quest'
      });
    }

    // Invalidate cached leaderboard since user XP changed
    await delCache('leaderboard:top');

    res.status(201).json({
      success: true,
      data: {
        attempt,
        xpGained,
        totalXp: user.xp,
        currentLevel: user.level,
        currentStreak: user.streak,
        leveledUp
      }
    });
  } catch (error) {
    console.error(`[Challenge Submit Error] ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to submit challenge evaluation.' });
  }
};

module.exports = {
  getDailyChallenge,
  submitDailyChallengeAnswer
};
