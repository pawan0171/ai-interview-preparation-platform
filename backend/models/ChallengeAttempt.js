const mongoose = require('mongoose');

const ChallengeAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  userAnswer: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  feedback: {
    type: String,
    required: true
  },
  modelAnswer: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound unique index to prevent a user from submitting twice for the same day
ChallengeAttemptSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('ChallengeAttempt', ChallengeAttemptSchema);
