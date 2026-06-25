const Interview = require('../models/Interview');
const Notification = require('../models/Notification');
const gemini = require('../utils/gemini');

// @desc    Generate questions for a new interview session
// @route   POST /api/interviews/generate
// @access  Private
const generateInterviewQuestions = async (req, res) => {
  try {
    const { category, difficulty } = req.body;

    if (!category || !difficulty) {
      return res.status(400).json({ success: false, message: 'Please provide category and difficulty' });
    }

    const validCategories = ['JavaScript', 'React', 'Node.js', 'DBMS', 'OOP', 'HR'];
    const validDifficulties = ['Easy', 'Medium', 'Hard'];

    if (!validCategories.includes(category) || !validDifficulties.includes(difficulty)) {
      return res.status(400).json({ success: false, message: 'Invalid category or difficulty selection' });
    }

    const questions = await gemini.generateQuestions(category, difficulty);
    
    res.json({
      success: true,
      category,
      difficulty,
      questions
    });
  } catch (error) {
    console.error(`Error generating questions: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to generate interview questions' });
  }
};

// @desc    Submit interview answers for evaluation and save session
// @route   POST /api/interviews/evaluate
// @access  Private
const evaluateAndSaveInterview = async (req, res) => {
  try {
    const { category, difficulty, questions } = req.body;

    if (!category || !difficulty || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ success: false, message: 'Missing required fields or invalid format' });
    }

    // Format list for Gemini evaluation
    const questionsAndAnswers = questions.map(q => ({
      questionText: q.questionText,
      userAnswer: q.userAnswer || ''
    }));

    // Call Gemini API evaluation
    const evaluation = await gemini.evaluateAnswers(category, difficulty, questionsAndAnswers);

    // Save full session to MongoDB
    const interview = await Interview.create({
      userId: req.user._id,
      category,
      difficulty,
      questions: evaluation.evaluations,
      overallScore: evaluation.overallScore,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      summary: evaluation.summary
    });

    // Trigger notification milestones
    const completedCount = await Interview.countDocuments({ userId: req.user._id });
    if (completedCount === 1) {
      await Notification.create({
        userId: req.user._id,
        title: 'First Step Completed!',
        message: `Congratulations! You finished your first mock assessment in ${category}.`,
        type: 'achievement'
      });
    }

    if (evaluation.overallScore >= 80) {
      await Notification.create({
        userId: req.user._id,
        title: 'Outstanding Performance!',
        message: `You scored an excellent ${evaluation.overallScore}% in ${category} (${difficulty}).`,
        type: 'achievement'
      });
    }

    res.status(201).json({
      success: true,
      data: interview
    });
  } catch (error) {
    console.error(`Error in evaluation: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to evaluate interview answers' });
  }
};

// @desc    Get all interview sessions for the logged-in user
// @route   GET /api/interviews/history
// @access  Private
const getUserInterviewHistory = async (req, res) => {
  try {
    const history = await Interview.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('category difficulty overallScore createdAt');

    res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get detailed review of a specific interview session
// @route   GET /api/interviews/:id
// @access  Private
const getInterviewDetails = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview record not found' });
    }

    // Ensure user owns this interview record
    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to view this record' });
    }

    res.json({
      success: true,
      data: interview
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Interview record not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get aggregated stats for dashboard
// @route   GET /api/interviews/stats/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total interviews
    const totalInterviews = await Interview.countDocuments({ userId });

    if (totalInterviews === 0) {
      return res.json({
        success: true,
        data: {
          totalInterviews: 0,
          averageScore: 0,
          performanceByCategory: [],
          recentAttempts: []
        }
      });
    }

    // Calculate overall average score
    const avgScoreAgg = await Interview.aggregate([
      { $match: { userId } },
      { $group: { _id: null, avgScore: { $avg: '$overallScore' } } }
    ]);
    const averageScore = Math.round(avgScoreAgg[0]?.avgScore || 0);

    // Group by category and compute counts + average scores
    const categoryStatsAgg = await Interview.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgScore: { $avg: '$overallScore' }
        }
      },
      { $sort: { avgScore: -1 } }
    ]);

    const performanceByCategory = categoryStatsAgg.map(stat => ({
      category: stat._id,
      count: stat.count,
      averageScore: Math.round(stat.avgScore)
    }));

    // Fetch the 5 most recent attempts
    const recentAttempts = await Interview.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('category difficulty overallScore createdAt');

    res.json({
      success: true,
      data: {
        totalInterviews,
        averageScore,
        performanceByCategory,
        recentAttempts
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Generate company-specific interview questions
// @route   POST /api/interviews/company/generate
// @access  Private
const generateCompanyInterviewQuestions = async (req, res) => {
  try {
    const { company, role, difficulty } = req.body;

    if (!company || !role || !difficulty) {
      return res.status(400).json({ success: false, message: 'Please provide company, role, and difficulty' });
    }

    const questions = await gemini.generateCompanyQuestions(company, role, difficulty);

    res.json({
      success: true,
      company,
      role,
      difficulty,
      questions
    });
  } catch (error) {
    console.error(`Error generating company questions: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to generate company questions' });
  }
};

module.exports = {
  generateInterviewQuestions,
  evaluateAndSaveInterview,
  getUserInterviewHistory,
  getInterviewDetails,
  getDashboardStats,
  generateCompanyInterviewQuestions
};
