import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Calendar, CheckCircle2, ChevronRight, Compass, Sparkles, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';

const Roadmap = () => {
  // Pull from local storage to persist checklist states across page reloads
  const [roadmap, setRoadmap] = useState(() => {
    const saved = localStorage.getItem('user_roadmap');
    return saved ? JSON.parse(saved) : null;
  });

  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem('completed_roadmap_topics');
    return saved ? JSON.parse(saved) : {};
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/analytics/roadmap');
      if (response.data.success) {
        const data = response.data.data;
        setRoadmap(data);
        localStorage.setItem('user_roadmap', JSON.stringify(data));
      } else {
        setError('Failed to compile your custom roadmap.');
      }
    } catch (err) {
      console.error('Error compiling roadmap:', err);
      setError(
        err.response?.data?.message || 'Server error. Failed to compile roadmap.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTopic = (phaseIdx, topic) => {
    const key = `${phaseIdx}-${topic}`;
    const updated = {
      ...completedTopics,
      [key]: !completedTopics[key]
    };
    setCompletedTopics(updated);
    localStorage.setItem('completed_roadmap_topics', JSON.stringify(updated));
  };

  // Clear current roadmap to regenerate
  const handleRegenerate = () => {
    if (window.confirm('Are you sure you want to regenerate? Your current topic checks will be reset.')) {
      setRoadmap(null);
      setCompletedTopics({});
      localStorage.removeItem('user_roadmap');
      localStorage.removeItem('completed_roadmap_topics');
    }
  };

  // Calculate overall progress percentage
  const calculateProgress = () => {
    if (!roadmap || !roadmap.phases) return 0;
    
    let totalTopics = 0;
    let completedCount = 0;

    roadmap.phases.forEach((phase, phaseIdx) => {
      phase.topics.forEach(topic => {
        totalTopics += 1;
        if (completedTopics[`${phaseIdx}-${topic}`]) {
          completedCount += 1;
        }
      });
    });

    if (totalTopics === 0) return 0;
    return Math.round((completedCount / totalTopics) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] pt-24 px-6 md:px-12 flex justify-center items-center">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full border border-gray-800 text-center flex flex-col items-center">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
            <div className="absolute inset-3 rounded-full bg-indigo-600/30 border border-indigo-500/40 animate-pulse"></div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Analyzing Skill Gaps</h3>
          <p className="text-sm text-indigo-400 font-semibold mb-2 animate-pulse">
            Compiling performance history...
          </p>
          <p className="text-xs text-gray-400 leading-relaxed mt-2">
            Google Gemini is scanning your weak topics from interviews and missing skills from your resume to compile an optimized 8-week syllabus. Please wait...
          </p>
        </div>
      </div>
    );
  }

  const progressPercent = calculateProgress();

  return (
    <div className="min-h-screen bg-[#0b0f19] pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header summary info */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-950/40 border border-purple-500/20 rounded-full px-4 py-1 mb-3">
              <Compass className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-semibold text-purple-200 uppercase tracking-wider">Custom learning path</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">AI Study Roadmap</h1>
            <p className="text-gray-400 text-sm mt-1">Structured 8-week timeline generated specifically for your profile.</p>
          </div>

          {roadmap && (
            <button
              onClick={handleRegenerate}
              className="inline-flex items-center gap-1 bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerate Roadmap
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-800/40 text-red-300 p-4 rounded-xl mb-6 flex items-start gap-2 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!roadmap ? (
          /* Landing/Generate action panel */
          <div className="glass-panel p-10 md:p-16 rounded-2xl border border-gray-800 text-center flex flex-col items-center max-w-2xl mx-auto shadow-xl">
            <div className="bg-indigo-960/40 p-4 rounded-full border border-indigo-500/20 mb-6">
              <Sparkles className="h-10 w-10 text-indigo-400 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-white">Compile Personalized Study Plan</h2>
            <p className="text-gray-400 mt-4 text-sm leading-relaxed max-w-md">
              PrepAI evaluates all weaknesses logged during your practice interviews, combined with missing keyword tags from your resume checker, to compile a custom 8-week curriculum.
            </p>
            <button
              onClick={handleGenerate}
              className="mt-8 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-md shadow-indigo-600/20 hover:scale-[1.01] cursor-pointer"
            >
              Build AI Study Roadmap
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ) : (
          /* Roadmap Timeline Grid */
          <div className="space-y-8">
            
            {/* Target Role & Progress Header */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
              <div className="sm:col-span-2 glass-panel p-5 rounded-xl border border-gray-800 flex flex-col justify-center">
                <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Target Role Alignment</span>
                <span className="text-xl font-bold text-white block">{roadmap.targetRole}</span>
              </div>
              <div className="glass-panel p-5 rounded-xl border border-gray-800 flex flex-col justify-center text-center sm:text-left">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Progress</span>
                  <span className="text-sm font-extrabold text-indigo-400">{progressPercent}%</span>
                </div>
                <div className="w-full bg-gray-950 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Vertical timeline tree */}
            <div className="relative border-l-2 border-indigo-950 pl-6 ml-4 space-y-10 py-2">
              {roadmap.phases.map((phase, phaseIdx) => (
                <div key={phaseIdx} className="relative">
                  {/* Timeline bullet dot */}
                  <div className="absolute -left-10 top-1.5 w-8 h-8 rounded-full border border-indigo-500/30 bg-[#0b0f19] flex items-center justify-center text-xs font-bold text-indigo-400">
                    {phaseIdx + 1}
                  </div>

                  {/* Phase card panel */}
                  <div className="glass-panel p-6 rounded-2xl border border-gray-800">
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-4 border-b border-gray-850 pb-3">
                      <div>
                        <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-wider block mb-1">
                          {phase.duration}
                        </span>
                        <h3 className="text-lg font-bold text-white leading-relaxed">
                          {phase.phaseName}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 leading-relaxed mb-6">
                      {phase.description}
                    </p>

                    {/* Topics Checklist */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                          Core Concepts
                        </span>
                        <div className="space-y-2.5">
                          {phase.topics.map((topic, idx) => {
                            const isChecked = !!completedTopics[`${phaseIdx}-${topic}`];
                            return (
                              <button
                                key={idx}
                                onClick={() => handleToggleTopic(phaseIdx, topic)}
                                className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-colors cursor-pointer ${
                                  isChecked
                                    ? 'bg-emerald-950/10 border-emerald-900/35 text-gray-300'
                                    : 'bg-gray-950/20 border-gray-850 text-gray-400 hover:border-gray-800'
                                }`}
                              >
                                <CheckCircle2 className={`h-5 w-5 shrink-0 ${isChecked ? 'text-emerald-400 fill-emerald-950/20' : 'text-gray-700'}`} />
                                <span className="text-xs truncate block">{topic}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Phase Resources */}
                      <div>
                        <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                          Study Resources
                        </span>
                        <div className="bg-gray-950/30 border border-gray-850 p-4 rounded-xl h-full flex flex-col gap-3 justify-center min-h-[120px]">
                          {phase.resources.map((res, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-indigo-300">
                              <BookOpen className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                              <span>{res}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Roadmap;
