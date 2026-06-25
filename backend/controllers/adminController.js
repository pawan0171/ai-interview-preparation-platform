const User = require('../models/User');
const Interview = require('../models/Interview');
const ResumeReport = require('../models/ResumeReport');

// @desc    Get aggregated system KPI statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalInterviews = await Interview.countDocuments({});
    const totalResumes = await ResumeReport.countDocuments({});

    // Compute average score across all interview attempts
    const avgScoreAgg = await Interview.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$overallScore' } } }
    ]);
    const systemAverageScore = Math.round(avgScoreAgg[0]?.avgScore || 0);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalInterviews,
        totalResumes,
        systemAverageScore
      }
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
