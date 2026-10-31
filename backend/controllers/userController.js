const User = require('../models/User');
const { getCache, setCache } = require('../utils/redis');

// @desc    Get top users ranked by XP
// @route   GET /api/users/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    const cacheKey = 'leaderboard:top';
    const cachedLeaderboard = await getCache(cacheKey);

    if (cachedLeaderboard) {
      return res.json({
        success: true,
        data: cachedLeaderboard,
        cached: true
      });
    }

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

    // Cache in Redis for 60 seconds
    await setCache(cacheKey, formattedLeaderboard, 60);

    res.json({
      success: true,
      data: formattedLeaderboard,
      cached: false
    });
  } catch (error) {
    console.error(`[Leaderboard Fetch Error] ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getLeaderboard
};
