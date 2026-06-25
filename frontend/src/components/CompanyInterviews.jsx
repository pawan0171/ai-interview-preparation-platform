import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { Building2, ChevronRight, ArrowLeft, Code, Cpu, Laptop, Network, Layout } from 'lucide-react';

const CompanyInterviews = () => {
  const [selectedCompany, setSelectedCompany] = useState('Google');
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const companies = [
    {
      name: 'Google',
      desc: 'Focuses on Advanced Data Structures, Algorithms, Scale, and System Design.',
      color: 'from-blue-500 via-red-500 to-yellow-500',
      textColor: 'text-blue-400'
    },
    {
      name: 'Amazon',
      desc: 'Emphasizes Leadership Principles, System Architecture, and Coding speed.',
      color: 'from-orange-500 to-amber-600',
      textColor: 'text-orange-400'
    },
    {
      name: 'Microsoft',
      desc: 'Covers Object-Oriented Design, System Design, and Low-Level Architecture.',
      color: 'from-teal-500 to-blue-600',
      textColor: 'text-teal-400'
    },
    {
      name: 'Meta',
      desc: 'High focus on Product Architecture, System Design, and fast-paced coding.',
      color: 'from-indigo-500 to-blue-500',
      textColor: 'text-indigo-400'
    },
    {
      name: 'Netflix',
      desc: 'Focus on Resiliency, High Throughput Architecture, and Cultural Fit.',
      color: 'from-red-600 to-rose-700',
      textColor: 'text-red-500'
    }
  ];

  const roles = [
    { name: 'Software Engineer', icon: Code, desc: 'Algorithms, complexity analysis, and programming logic.' },
    { name: 'Frontend Developer', icon: Layout, desc: 'CSS engines, framework rendering, optimization, state trees.' },
    { name: 'Backend Developer', icon: Cpu, desc: 'Concurrency pipelines, API designs, databases, worker queues.' },
    { name: 'Full Stack Developer', icon: Laptop, desc: 'End-to-end applications, devops scripts, general systems.' },
    { name: 'Systems Architect', icon: Network, desc: 'High availability layouts, database replication, CDN, load balancers.' }
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleStart = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/interviews/company/generate', {
        company: selectedCompany,
        role: selectedRole,
        difficulty: selectedDifficulty
      });

      if (response.data.success) {
        // Redirect to interview live session and pass details via state
        navigate('/interview-session', {
          state: {
            category: `${selectedCompany} (${selectedRole})`,
            difficulty: selectedDifficulty,
            questions: response.data.questions,
            company: selectedCompany,
            role: selectedRole
          }
        });
      } else {
        setError('Could not generate company questions. Please try again.');
      }
    } catch (err) {
      console.error('Error generating company questions:', err);
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
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
            <div className="absolute inset-3 rounded-full bg-indigo-600/30 border border-indigo-500/40 animate-pulse"></div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Assembling Board Assessments</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Gemini is compiling custom {selectedDifficulty}-level {selectedRole} questions tailored to {selectedCompany}'s interview standards...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Back Link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-gray-400 hover:text-indigo-400 text-sm font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-extrabold text-white mb-2 text-shimmer">
          Company-wise Mock Interviews
        </h1>
        <p className="text-gray-400 mb-8">
          Face targeted technical assessments custom-tailored to the specific hiring profiles of top tech giants.
        </p>

        {error && (
          <div className="bg-red-950/20 border border-red-800/30 text-red-300 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {/* Step 1: Select Company */}
          <div>
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Step 1: Choose Target Company
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {companies.map((comp) => {
                const isSelected = selectedCompany === comp.name;
                return (
                  <button
                    key={comp.name}
                    onClick={() => setSelectedCompany(comp.name)}
                    className={`glass-panel p-5 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/20 shadow-lg shadow-indigo-600/10 scale-[1.02]'
                        : 'border-gray-800 hover:border-gray-700 hover:bg-gray-900/10'
                    }`}
                  >
                    {/* Visual gradient accent line */}
                    {isSelected && (
                      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${comp.color}`} />
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Building2 className={`h-5 w-5 ${isSelected ? comp.textColor : 'text-gray-500'}`} />
                        <span className="font-extrabold text-white text-lg">{comp.name}</span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{comp.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Role */}
          <div>
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Step 2: Choose Target Role
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {roles.map((r) => {
                const RoleIcon = r.icon;
                const isSelected = selectedRole === r.name;
                return (
                  <button
                    key={r.name}
                    onClick={() => setSelectedRole(r.name)}
                    className={`glass-panel p-5 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/20 shadow-md shadow-indigo-600/10'
                        : 'border-gray-800 hover:border-gray-700 hover:bg-gray-900/10'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-4 ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-400/30 text-indigo-400'
                          : 'bg-gray-950 border-gray-800 text-gray-400'
                      }`}
                    >
                      <RoleIcon className="h-5 w-5" />
                    </div>
                    <span className="block font-bold text-white text-sm">{r.name}</span>
                    <span className="block text-xs text-gray-400 mt-1 leading-relaxed">{r.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Select Difficulty */}
          <div>
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Step 3: Choose Difficulty Level
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
            Launch {selectedCompany} Mock Interview
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyInterviews;
