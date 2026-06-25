const mongoose = require('mongoose');

const ResumeReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeUrl: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  atsScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  extractedSkills: {
    type: [String],
    default: []
  },
  missingSkills: {
    type: [String],
    default: []
  },
  suggestions: {
    type: [String],
    default: []
  },
  recommendedTech: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ResumeReport', ResumeReportSchema);
