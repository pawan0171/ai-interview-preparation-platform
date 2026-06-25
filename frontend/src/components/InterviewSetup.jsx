import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { Code, Cpu, Brain, Database, ShieldCheck, HeartHandshake, ChevronRight, ArrowLeft } from 'lucide-react';

const InterviewSetup = () => {
  const [selectedCategory, setSelectedCategory] = useState('JavaScript');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const categories = [
    { name: 'JavaScript', icon: Code, desc: 'Scope, closures, async, promises, event loop.' },
    { name: 'React', icon: Cpu, desc: 'Lifecycle, hooks, virtual DOM, memoization.' },
    { name: 'Node.js', icon: Brain, desc: 'Event loop, streams, clusters, Express middlewares.' },
    { name: 'DBMS', icon: Database, desc: 'SQL vs NoSQL, ACID, normalization, indexing.' },
    { name: 'OOP', icon: ShieldCheck, desc: 'SOLID principles, abstract classes, design patterns.' },
    { name: 'HR', icon: HeartHandshake, desc: 'Conflict resolution, leadership, communication.' }
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleStart = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/interviews/generate', {
        category: selectedCategory,
        difficulty: selectedDifficulty
      });

      if (response.data.success) {
        // Redirect to interview live session and pass details via state
        navigate('/interview-session', {
          state: {
            category: selectedCategory,
            difficulty: selectedDifficulty,
            questions: response.data.questions
          }
        });
      } else {
        setError('Could not generate questions. Please try again.');
      }
    } catch (err) {
      console.error('Error generating questions:', err);
      setError(
        err.response?.data?.message || 'Server connection timed out. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] pt-24 px-6 md:px-12 flex justify-center items-center">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full border border-gray-800 text-center flex flex-col items-center">
          <div className="relative w-16 h-16 mb-6">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
            {/* Inner pulsing orb */}
            <div className="absolute inset-3 rounded-full bg-indigo-600/30 border border-indigo-500/40 animate-pulse"></div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Generating Technical Assessment</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Google Gemini is configuring custom {selectedDifficulty}-level interview questions for {selectedCategory}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Link */}
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-gray-400 hover:text-indigo-400 text-sm font-semibold mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-extrabold text-white mb-2">Configure Mock Interview</h1>
        <p className="text-gray-400 mb-8">Select your target technology stack and test difficulty level to begin.</p>

        {error && (
          <div className="bg-red-950/20 border border-red-800/30 text-red-300 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {/* Categories Grid Selection */}
          <div>
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Step 1: Choose Domain Category
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`glass-panel p-5 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/20 shadow-md shadow-indigo-600/10'
                        : 'border-gray-800 hover:border-gray-700 hover:bg-gray-900/10'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-4 ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-400/30 text-indigo-400'
                        : 'bg-gray-950 border-gray-800 text-gray-400'
                    }`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <span className="block font-bold text-white">{cat.name}</span>
                    <span className="block text-xs text-gray-400 mt-1 leading-relaxed">{cat.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div>
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Step 2: Choose Difficulty Level
            </span>
            <div className="flex gap-4">
              {difficulties.map((diff) => {
                const isSelected = selectedDifficulty === diff;
                return (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`flex-1 glass-panel py-4 rounded-xl border text-center font-bold text-sm transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/20 text-indigo-400 shadow-md shadow-indigo-600/10'
                        : 'border-gray-800 hover:border-gray-700 text-gray-400'
                    }`}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start CTA */}
          <button
            onClick={handleStart}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 hover:scale-[1.01] cursor-pointer"
          >
            Generate & Start Interview
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
