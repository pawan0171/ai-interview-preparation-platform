const User = require('../models/User');
const Interview = require('../models/Interview');
const ResumeReport = require('../models/ResumeReport');
const { notifyUser } = require('../utils/notificationService');
const { getCache, setCache, delCache } = require('../utils/redis');

// @desc    Get aggregated system KPI statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getSystemStats = async (req, res) => {
  try {
    const cacheKey = 'admin:stats';
    const cachedStats = await getCache(cacheKey);

    if (cachedStats) {
      return res.json({
        success: true,
        data: cachedStats,
        cached: true
      });
    }

    const totalUsers = await User.countDocuments({});
    const totalInterviews = await Interview.countDocuments({});
    const totalResumes = await ResumeReport.countDocuments({});

    // Compute average score across all interview attempts
    const avgScoreAgg = await Interview.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$overallScore' } } }
    ]);
    const systemAverageScore = Math.round(avgScoreAgg[0]?.avgScore || 0);

    const statsData = {
      totalUsers,
      totalInterviews,
      totalResumes,
      systemAverageScore
    };

    // Cache in Redis for 60 seconds
    await setCache(cacheKey, statsData, 60);

    res.json({
      success: true,
      data: statsData,
      cached: false
    });
  } catch (error) {
    console.error(`[Admin Stats Error] ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get list of all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).select('name email level xp streak isAdmin createdAt');
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Toggle user administrative privileges
// @route   PUT /api/admin/users/:id/toggle-admin
// @access  Private/Admin
const toggleUserAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent removing admin rights from yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot revoke your own admin permissions' });
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    // Invalidate cached admin stats
    await delCache('admin:stats');

    // Push real-time notification to the target user
    await notifyUser({
      userId: user._id,
      title: 'Administrative Role Updated',
      message: user.isAdmin
        ? 'Congratulations! You have been granted Administrator permissions.'
        : 'Your Administrator privileges have been revoked by the system administrator.',
      type: 'system'
    });

    res.json({
      success: true,
      message: `User administrative status toggled to: ${user.isAdmin}`,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getSystemStats,
  getAllUsers,
  toggleUserAdmin
};
