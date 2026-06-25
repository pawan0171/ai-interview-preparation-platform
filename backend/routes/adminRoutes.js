const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminProtect } = require('../middleware/adminMiddleware');
const { getSystemStats, getAllUsers, toggleUserAdmin } = require('../controllers/adminController');

router.get('/stats', protect, adminProtect, getSystemStats);
router.get('/users', protect, adminProtect, getAllUsers);
router.put('/users/:id/toggle-admin', protect, adminProtect, toggleUserAdmin);

module.exports = router;
