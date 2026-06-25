const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUserNotifications, markAllAsRead } = require('../controllers/notificationController');

router.get('/', protect, getUserNotifications);
router.put('/read', protect, markAllAsRead);

module.exports = router;
