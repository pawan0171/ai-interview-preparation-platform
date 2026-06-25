const mongoose = require('mongoose');

const DailyChallengeSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true // Ensure only one challenge per calendar day
  },
  questionText: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DailyChallenge', DailyChallengeSchema);
