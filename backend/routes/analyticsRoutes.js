const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAnalyticsStats, getUserRoadmap } = require('../controllers/analyticsController');

router.get('/stats', protect, getAnalyticsStats);
router.post('/roadmap', protect, getUserRoadmap);

module.exports = router;
