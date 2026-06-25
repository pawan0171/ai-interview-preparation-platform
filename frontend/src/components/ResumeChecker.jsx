import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { Upload, FileText, Calendar, Award, Eye, Trash2, AlertCircle } from 'lucide-react';

const ResumeChecker = () => {
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const navigate = useNavigate();

  const loadingTexts = [
    'Parsing PDF text strings...',
    'Uploading document file...',
    'Analyzing structural design schema...',
    'Extracting technical skill nodes...',
    'Scanning for modern industry keywords...',
    'Calculating ATS compatibility index...'
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/api/resume/history');
        if (response.data.success) {
          setHistory(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching resume history:', err);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    setError('');

    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    setError('');
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      setError('Only PDF files are supported for resume analysis.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit.');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await api.post('/api/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 90000 // 90 seconds timeout for large PDFs + Gemini analysis
      });

      if (response.data.success) {
        navigate(`/resume-report/${response.data.data._id}`);
      } else {
        setError('Analysis failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error uploading resume:', err);
      setError(
        err.response?.data?.message || 'Server error occurred during analysis.'
      );
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20';
    if (score >= 50) return 'text-yellow-400 border-yellow-500/20 bg-yellow-950/20';
    return 'text-red-400 border-red-500/20 bg-red-950/20';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] pt-24 px-6 flex justify-center items-center">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full border border-gray-800 text-center flex flex-col items-center animate-pulse-glow">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
            <div className="absolute inset-3 rounded-full bg-indigo-600/30 border border-indigo-500/40 animate-pulse"></div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Analyzing Resume ATS Fit</h3>
          <p className="text-sm text-indigo-400 font-semibold mb-2">
            {loadingTexts[loadingTextIndex]}
          </p>
          <p className="text-xs text-gray-400 leading-relaxed mt-2">
            Google Gemini is scoring formatting, parsing technical skills, and compiling missing keyword vectors. This will take about 15-20 seconds.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white mb-2">Resume ATS Checker</h1>
        <p className="text-gray-400 mb-8">
          Upload your PDF resume to compute its ATS match score, extract skills, and find optimization keywords.
        </p>

        {error && (
          <div className="bg-red-950/30 border border-red-800/40 text-red-300 p-4 rounded-xl mb-6 flex items-start gap-2 text-sm max-w-2xl">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          
          {/* Left Side: Upload Panel (3 Columns) */}
          <div className="lg:col-span-3 flex flex-col justify-between glass-panel p-6 md:p-8 rounded-2xl border border-gray-800">
            <div>
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                Upload Document
              </span>

              {/* Drag Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all min-h-[220px] ${
                  isDragOver
                    ? 'border-indigo-500 bg-indigo-950/10 scale-[1.01]'
                    : file
                    ? 'border-indigo-500/50 bg-indigo-950/5'
                    : 'border-gray-800 hover:border-gray-700 bg-gray-950/20'
                }`}
              >
                <div className={`p-4 rounded-full border mb-4 ${
                  file
                    ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400'
                    : 'bg-gray-900 border-gray-800 text-gray-400'
                }`}>
                  <Upload className="h-8 w-8" />
                </div>

                {file ? (
                  <div>
                    <span className="block font-bold text-white max-w-[280px] truncate">{file.name}</span>
                    <span className="block text-xs text-gray-400 mt-1">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
                    </span>
                    <button
                      onClick={() => setFile(null)}
                      className="mt-4 text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider underline cursor-pointer"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="block font-semibold text-white">Drag and drop your PDF resume here</span>
                    <span className="block text-xs text-gray-400 mt-2">or select it from your files</span>
                    <label className="mt-4 inline-flex bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-800/40 text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer">
                      Browse Files
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={!file}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:pointer-events-none text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              Analyze ATS Score
              <FileText className="h-4 w-4" />
            </button>
          </div>

          {/* Right Side: Upload History (2 Columns) */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col h-full min-h-[380px]">
            <h3 className="text-lg font-bold text-white mb-6">Recent ATS Reports</h3>

            {historyLoading ? (
              <div className="flex-grow flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : history.length === 0 ? (
              <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
                <FileText className="h-8 w-8 text-gray-600 mb-3" />
                <span className="block text-sm font-semibold text-gray-400">No reports logged</span>
                <span className="block text-xs text-gray-500 mt-1 max-w-[200px]">
                  Upload a PDF resume to generate your first feedback report.
                </span>
              </div>
            ) : (
              <div className="flex-grow overflow-y-auto space-y-4 max-h-[350px] pr-1">
                {history.map((report) => (
                  <div
                    key={report._id}
                    className="bg-gray-950/30 border border-gray-850 p-4 rounded-xl flex items-center justify-between hover:border-gray-700 transition-all group"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="block font-bold text-white text-xs truncate max-w-[140px]">
                        {report.fileName}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 mt-1.5 font-medium">
                        <Calendar className="h-3 w-3" />
                        {new Date(report.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${getScoreColor(report.atsScore)}`}>
                        {report.atsScore}%
                      </span>
                      <Link
                        to={`/resume-report/${report._id}`}
                        className="p-1.5 text-gray-400 hover:text-indigo-400 hover:border-indigo-900 border border-transparent bg-gray-900/60 rounded-lg transition-all"
                        title="Review Report"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResumeChecker;
