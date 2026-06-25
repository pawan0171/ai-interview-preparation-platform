const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getDailyChallenge, submitDailyChallengeAnswer } = require('../controllers/challengeController');

router.get('/daily', protect, getDailyChallenge);
router.post('/daily/submit', protect, submitDailyChallengeAnswer);

module.exports = router;
