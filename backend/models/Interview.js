const mongoose = require('mongoose');

const InterviewQuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  userAnswer: {
    type: String,
    default: ''
  },
  score: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  feedback: {
    type: String,
    default: ''
  },
  modelAnswer: {
    type: String,
    default: ''
  }
});

const InterviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  questions: [InterviewQuestionSchema],
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  strengths: {
    type: [String],
    default: []
  },
  weaknesses: {
    type: [String],
    default: []
  },
  summary: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Interview', InterviewSchema);
