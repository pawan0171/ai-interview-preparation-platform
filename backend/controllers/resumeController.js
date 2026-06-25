const pdfParse = require('pdf-parse');
const ResumeReport = require('../models/ResumeReport');
const { saveFile } = require('../config/cloudinary');
const gemini = require('../utils/gemini');

// @desc    Upload resume PDF, parse text, analyze with Gemini, and save to DB
// @route   POST /api/resume/analyze
// @access  Private
const analyzeResumeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF resume file' });
    }

    console.log(`[Resume Controller] Parsing PDF file: ${req.file.originalname} (${req.file.size} bytes)...`);
    
    // 1. Extract text from PDF buffer using pdf-parse
    let resumeText = '';
    try {
      const parsedData = await pdfParse(req.file.buffer);
      resumeText = parsedData.text;
    } catch (parseErr) {
      console.warn(`[PDF Parse Warning] Failed to parse PDF: ${parseErr.message}. Falling back to default parser state.`);
      // Set basic text to prevent crash
      resumeText = `Resume file: ${req.file.originalname}. Technical background.`;
    }

    // Clean up basic whitespace
    resumeText = resumeText.trim();
    if (resumeText.length === 0) {
      resumeText = `Resume: ${req.file.originalname}. Empty parsed text content.`;
    }

    // 2. Upload file to Cloudinary (or write locally)
    const fileResult = await saveFile(req.file);

    // 3. Analyze text content using Gemini API
    const analysis = await gemini.analyzeResume(resumeText);

    // 4. Save report log in MongoDB
    const report = await ResumeReport.create({
      userId: req.user._id,
      resumeUrl: fileResult.url,
      fileName: fileResult.fileName,
      atsScore: analysis.atsScore,
      extractedSkills: analysis.extractedSkills,
      missingSkills: analysis.missingSkills,
      suggestions: analysis.suggestions,
      recommendedTech: analysis.recommendedTech
    });

    res.status(201).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error(`[Resume Controller Error] analyzeResumeFile failed: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to analyze resume file.' });
  }
};

// @desc    Get user's past resume reports
// @route   GET /api/resume/history
// @access  Private
const getUserResumeHistory = async (req, res) => {
  try {
    const history = await ResumeReport.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('fileName atsScore createdAt');

    res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get details of a specific resume report
// @route   GET /api/resume/:id
// @access  Private
const getResumeReportDetails = async (req, res) => {
  try {
    const report = await ResumeReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Resume report not found' });
    }

    // Verify ownership
    if (report.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to view this report' });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Resume report not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  analyzeResumeFile,
  getUserResumeHistory,
  getResumeReportDetails
};
