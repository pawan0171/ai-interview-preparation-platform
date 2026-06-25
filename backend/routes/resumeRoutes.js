const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');
const {
  analyzeResumeFile,
  getUserResumeHistory,
  getResumeReportDetails
} = require('../controllers/resumeController');

router.post('/analyze', protect, upload.single('resume'), analyzeResumeFile);
router.get('/history', protect, getUserResumeHistory);
router.get('/:id', protect, getResumeReportDetails);

module.exports = router;
