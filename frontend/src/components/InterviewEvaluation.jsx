import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Award, ChevronDown, ChevronUp, CheckCircle, XCircle, ArrowLeft, RefreshCw, Star } from 'lucide-react';

const InterviewEvaluation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openAccordion, setOpenAccordion] = useState({});

  const interview = location.state?.interview;

  if (!interview) {
    // Redirect if direct navigation
    return (
      <div className="min-h-screen bg-[#0b0f19] pt-24 px-6 md:px-12 flex flex-col justify-center items-center">
        <p className="text-gray-400 mb-4">No evaluation report found.</p>
        <Link to="/dashboard" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const toggleAccordion = (idx) => {
    setOpenAccordion((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-400 border-emerald-500/20 bg-emerald-950/25';
    if (score >= 5) return 'text-yellow-400 border-yellow-500/20 bg-yellow-950/25';
    return 'text-red-400 border-red-500/20 bg-red-950/25';
  };

  const getScoreBarColor = (score) => {
    if (score >= 8) return 'bg-emerald-500';
    if (score >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const overallScore = interview.overallScore;

  return (
    <div className="min-h-screen bg-[#0b0f19] pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation & Header Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-gray-400 hover:text-indigo-400 text-sm font-semibold transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <button
            onClick={() => navigate('/interview-setup')}
            className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg text-sm transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Start Another Session
          </button>
        </div>

        {/* Top Report Header Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          
          {/* Score Badge */}
          <div className="md:col-span-1 glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-center items-center text-center">
            <div className="relative w-24 h-24 flex items-center justify-center mb-3">
              {/* Circular gauge mock using border overlay */}
              <div className="absolute inset-0 rounded-full border-4 border-indigo-950"></div>
              <div className={`absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-indigo-500 animate-pulse-glow`}></div>
              <span className="text-3xl font-extrabold text-white">{overallScore}%</span>
            </div>
            <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Overall Rating</span>
            <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border mt-2 block ${
              overallScore >= 80 ? 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20' :
              overallScore >= 50 ? 'text-yellow-400 border-yellow-500/20 bg-yellow-950/20' :
              'text-red-400 border-red-500/20 bg-red-950/20'
            }`}>
              {overallScore >= 80 ? 'EXCELLENT' : overallScore >= 50 ? 'AVERAGE' : 'NEEDS FOCUS'}
            </span>
          </div>

          {/* Core metadata & Summary */}
          <div className="md:col-span-3 glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider bg-indigo-950/40 px-3 py-1 rounded-full border border-indigo-800/20">
                  {interview.category}
                </span>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-900 border border-gray-800 px-3 py-1 rounded-full">
                  {interview.difficulty}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Technical Assessment Feedback</h2>
              <p className="text-sm text-gray-300 leading-relaxed italic">
                "{interview.summary}"
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800/40 text-xs text-gray-500">
              Completed on {new Date(interview.createdAt).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="glass-panel p-6 rounded-2xl border border-gray-800">
            <h3 className="text-emerald-400 font-bold text-lg mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              Key Strengths
            </h3>
            {interview.strengths && interview.strengths.length > 0 ? (
              <ul className="space-y-2.5 text-sm text-gray-300">
                {interview.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-500 font-bold mt-0.5">•</span>
                    {str}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No specific strengths highlighted.</p>
            )}
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-gray-800">
            <h3 className="text-red-400 font-bold text-lg mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-400" />
              Key Weaknesses
            </h3>
            {interview.weaknesses && interview.weaknesses.length > 0 ? (
              <ul className="space-y-2.5 text-sm text-gray-300">
                {interview.weaknesses.map((weak, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-red-500 font-bold mt-0.5">•</span>
                    {weak}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No specific weaknesses highlighted.</p>
            )}
          </div>
        </div>

        {/* Question by Question Accordion List */}
        <h3 className="text-xl font-bold text-white mb-6">Detailed Answer Review</h3>
        <div className="space-y-4">
          {interview.questions.map((q, idx) => {
            const isOpen = !!openAccordion[idx];
            return (
              <div key={q._id || idx} className="glass-panel rounded-2xl border border-gray-800 overflow-hidden">
                {/* Header Row */}
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-gray-900/10 cursor-pointer"
                >
                  <div className="flex-grow pr-4">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                      Question {idx + 1}
                    </span>
                    <span className="font-bold text-white text-sm md:text-base leading-relaxed">
                      {q.questionText}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className={`text-xs font-bold px-2.5 py-1.5 rounded-full border ${getScoreColor(q.score)}`}>
                      Score: {q.score}/10
                    </div>
                    {isOpen ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                  </div>
                </button>

                {/* Collapsible Details */}
                {isOpen && (
                  <div className="border-t border-gray-800/40 p-5 md:p-6 bg-gray-950/20 space-y-6">
                    {/* User Answer */}
                    <div>
                      <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Your Submission
                      </span>
                      <div className="bg-gray-950 border border-gray-850 p-4 rounded-xl text-sm leading-relaxed text-gray-300 max-h-[200px] overflow-y-auto whitespace-pre-wrap">
                        {q.userAnswer ? q.userAnswer : <span className="text-red-400 italic">No answer provided.</span>}
                      </div>
                    </div>

                    {/* AI Feedback */}
                    <div>
                      <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        AI Score Analysis & Feedback
                      </span>
                      <div className="text-sm text-gray-300 leading-relaxed flex items-start gap-2 bg-indigo-950/15 p-4 rounded-xl border border-indigo-900/20">
                        <Award className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="w-full bg-indigo-950 rounded-full h-1.5 mb-3 max-w-[150px]">
                            <div className={`h-1.5 rounded-full ${getScoreBarColor(q.score)}`} style={{ width: `${q.score * 10}%` }}></div>
                          </div>
                          <p>{q.feedback}</p>
                        </div>
                      </div>
                    </div>

                    {/* Model Answer */}
                    <div>
                      <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Recommended Model Response
                      </span>
                      <div className="bg-emerald-950/10 border border-emerald-900/20 p-4 rounded-xl text-sm leading-relaxed text-emerald-200/90 whitespace-pre-wrap">
                        {q.modelAnswer}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default InterviewEvaluation;
