const express = require('express');
const router = express.Router();
const {
  generateInterviewQuestions,
  evaluateAndSaveInterview,
  getUserInterviewHistory,
  getInterviewDetails,
  getDashboardStats,
  generateCompanyInterviewQuestions
} = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateInterviewQuestions);
router.post('/company/generate', protect, generateCompanyInterviewQuestions);
router.post('/evaluate', protect, evaluateAndSaveInterview);
router.get('/history', protect, getUserInterviewHistory);
router.get('/stats/dashboard', protect, getDashboardStats);
router.get('/:id', protect, getInterviewDetails);

module.exports = router;
