import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, Award, FileText, CheckCircle, AlertCircle, Sparkles, PlusCircle } from 'lucide-react';

const ResumeReportView = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const response = await api.get(`/api/resume/${id}`);
        if (response.data.success) {
          setReport(response.data.data);
        } else {
          setError('Failed to fetch resume scorecard.');
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || 'Failed to establish connection to server.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetails();
  }, [id]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20';
    if (score >= 50) return 'text-yellow-400 border-yellow-500/20 bg-yellow-950/20';
    return 'text-red-400 border-red-500/20 bg-red-950/20';
  };

  const getScoreCategory = (score) => {
    if (score >= 80) return 'EXCELLENT MATCH';
    if (score >= 50) return 'AVERAGE MATCH';
    return 'WEAK MATCH';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] pt-24 px-6 md:px-12 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-400 font-medium">Retrieving ATS scorecard report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b0f19] pt-28 px-6 md:px-12">
        <div className="glass-panel p-6 rounded-xl border border-red-950/30 max-w-xl mx-auto flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-400 shrink-0" />
          <div>
            <h3 className="font-bold text-red-200">Load Failure</h3>
            <p className="text-sm text-red-300/80 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const {
    fileName,
    resumeUrl,
    atsScore,
    extractedSkills,
    missingSkills,
    suggestions,
    recommendedTech,
    createdAt
  } = report;

  // Resolve download link: prefix with backend host if it's a local upload
  const documentLink = resumeUrl.startsWith('/') ? `http://localhost:5000${resumeUrl}` : resumeUrl;

  return (
    <div className="min-h-screen bg-[#0b0f19] pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/resume-checker"
            className="inline-flex items-center gap-1 text-gray-400 hover:text-indigo-400 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Resume Checker
          </Link>

          <a
            href={documentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            View Original PDF
          </a>
        </div>

        {/* Header summary panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Circular ATS Gauge */}
          <div className="md:col-span-1 glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-center items-center text-center">
            <div className="relative w-24 h-24 flex items-center justify-center mb-3">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-950"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-indigo-500 animate-pulse-glow"></div>
              <span className="text-3xl font-extrabold text-white">{atsScore}%</span>
            </div>
            <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">ATS Score</span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border mt-2 block ${getScoreColor(atsScore)}`}>
              {getScoreCategory(atsScore)}
            </span>
          </div>

          {/* Details Metadata */}
          <div className="md:col-span-3 glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider bg-indigo-950/40 px-3 py-1 rounded-full border border-indigo-800/20">
                  ATS Scorecard
                </span>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-900 border border-gray-800 px-3 py-1 rounded-full">
                  PDF Format
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 truncate max-w-full">{fileName}</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Applicant tracking systems parse keywords to filter candidates. Below is Gemini's assessment of your resume's search visibility, missing skill vocabulary, and structure.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800/40 text-xs text-gray-500">
              Analyzed on {new Date(createdAt).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </div>
          </div>
        </div>

        {/* Skills metrics (Extracted vs Missing) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Extracted Skills */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800">
            <h3 className="text-emerald-400 font-bold text-lg mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              Extracted Skills
            </h3>
            {extractedSkills && extractedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {extractedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold text-emerald-300 border border-emerald-900/30 bg-emerald-950/20 px-2.5 py-1.5 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">No technical skills detected. Try adding a dedicated skills directory.</p>
            )}
          </div>

          {/* Missing Skills */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800">
            <h3 className="text-red-400 font-bold text-lg mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              Missing Skills
            </h3>
            {missingSkills && missingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold text-red-300 border border-red-950/25 bg-red-950/20 px-2.5 py-1.5 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">Excellent skill density! No key missing technical keywords detected.</p>
            )}
          </div>
        </div>

        {/* Actionable items and recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Improvement Suggestions (3 Columns) */}
          <div className="md:col-span-3 glass-panel p-6 rounded-2xl border border-gray-800">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              Improvement Suggestions
            </h3>
            {suggestions && suggestions.length > 0 ? (
              <ul className="space-y-3.5 text-sm text-gray-300">
                {suggestions.map((sug, idx) => (
                  <li key={idx} className="flex items-start gap-3 leading-relaxed">
                    <span className="bg-indigo-950/40 border border-indigo-900/30 text-indigo-400 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm italic">No improvement suggestions required.</p>
            )}
          </div>

          {/* Recommended Tech (2 Columns) */}
          <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
            <div>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-purple-400" />
                Recommended Technologies
              </h3>
              {recommendedTech && recommendedTech.length > 0 ? (
                <ul className="space-y-3 text-sm text-gray-300">
                  {recommendedTech.map((tech, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-purple-400 font-bold">•</span>
                      <span>{tech}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm italic">No recommendation list generated.</p>
              )}
            </div>

            <Link
              to="/interview-setup"
              className="mt-6 w-full text-center bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-800/40 font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
            >
              Start Practicing Domain Mock
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResumeReportView;
