const User = require('../models/User');

// @desc    Get top users ranked by XP
// @route   GET /api/users/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    // Fetch users sorted by XP in descending order, limit to top 15
    const leaderboard = await User.find({})
      .sort({ xp: -1 })
      .select('name xp level streak')
      .limit(15);

    // Add rank indexing
    const formattedLeaderboard = leaderboard.map((u, index) => ({
      _id: u._id,
      name: u.name,
      xp: u.xp,
      level: u.level,
      streak: u.streak,
      rank: index + 1
    }));

    res.json({
      success: true,
      data: formattedLeaderboard
    });
  } catch (error) {
    console.error(`[Leaderboard Fetch Error] ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getLeaderboard
};
