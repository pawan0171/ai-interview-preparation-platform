const Interview = require('../models/Interview');
const ResumeReport = require('../models/ResumeReport');
const gemini = require('../utils/gemini');

// @desc    Get user's progress metrics, score trends, and weak topics
// @route   GET /api/analytics/stats
// @access  Private
const getAnalyticsStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Get past interviews sorted chronologically to map trends
    const interviews = await Interview.find({ userId }).sort({ createdAt: 1 });
    const resumeReports = await ResumeReport.find({ userId }).sort({ createdAt: -1 });

    // Map score history (limit to last 10 attempts for charts)
    const scoreHistory = interviews.slice(-10).map((attempt, index) => {
      const date = new Date(attempt.createdAt);
      return {
        attemptNumber: index + 1,
        date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        score: attempt.overallScore,
        category: attempt.category
      };
    });

    // 2. Compute category counts and average scores
    const categoryMap = {};
    interviews.forEach(attempt => {
      if (!categoryMap[attempt.category]) {
        categoryMap[attempt.category] = { totalScore: 0, count: 0 };
      }
      categoryMap[attempt.category].totalScore += attempt.overallScore;
      categoryMap[attempt.category].count += 1;
    });

    const categoryStats = Object.keys(categoryMap).map(key => ({
      category: key,
      attempts: categoryMap[key].count,
      averageScore: Math.round(categoryMap[key].totalScore / categoryMap[key].count)
    }));

    // 3. Aggregate weak topics from interview reports and missing skills from resume reports
    const weakTopics = [];
    const missingSkills = [];

    // Aggregate unique weakness notes from interviews
    interviews.forEach(attempt => {
      attempt.weaknesses.forEach(weakness => {
        if (!weakTopics.includes(weakness)) {
          weakTopics.push(weakness);
        }
      });
    });

    // Aggregate missing skills from recent resume
    if (resumeReports.length > 0) {
      resumeReports[0].missingSkills.forEach(skill => {
        if (!missingSkills.includes(skill)) {
          missingSkills.push(skill);
        }
      });
    }

    res.json({
      success: true,
      data: {
        scoreHistory,
        categoryStats,
        weakTopics: weakTopics.slice(0, 6), // top 6
        missingSkills: missingSkills.slice(0, 6), // top 6
        statsSummary: {
          totalInterviews: interviews.length,
          totalResumes: resumeReports.length
        }
      }
    });
  } catch (error) {
    console.error(`[Analytics Stats Error] ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to retrieve analytics.' });
  }
};

// @desc    Generate personalized AI study roadmap based on weaknesses
// @route   POST /api/analytics/roadmap
// @access  Private
const getUserRoadmap = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user's interview history and resume reports
    const interviews = await Interview.find({ userId });
    const resumeReports = await ResumeReport.find({ userId }).sort({ createdAt: -1 });

    const weakTopics = [];
    const missingSkills = [];

    interviews.forEach(attempt => {
      attempt.weaknesses.forEach(w => {
        if (!weakTopics.includes(w)) weakTopics.push(w);
      });
    });

    if (resumeReports.length > 0) {
      resumeReports[0].missingSkills.forEach(s => {
        if (!missingSkills.includes(s)) missingSkills.push(s);
      });
    }

    // Call Gemini utility to compile a customized study timeline roadmap
    const roadmap = await gemini.generateRoadmap(
      weakTopics.slice(0, 8),
      missingSkills.slice(0, 8)
    );

    res.json({
      success: true,
      data: roadmap
    });
  } catch (error) {
    console.error(`[Analytics Roadmap Error] ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to compile AI learning roadmap.' });
  }
};

module.exports = {
  getAnalyticsStats,
  getUserRoadmap
};
