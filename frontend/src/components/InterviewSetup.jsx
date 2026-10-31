import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import {
  Code,
  Cpu,
  Brain,
  Database,
  ShieldCheck,
  HeartHandshake,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Network,
  Terminal,
  Lock,
  Server,
  Zap,
  Smartphone
} from 'lucide-react';

const InterviewSetup = () => {
  const [selectedCategory, setSelectedCategory] = useState('JavaScript');
  const [customInput, setCustomInput] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const curatedDomains = [
    // Web & Fullstack
    { name: 'JavaScript', tag: 'Web', icon: Code, desc: 'Scope, closures, async/await, event loop, prototypes.' },
    { name: 'React', tag: 'Web', icon: Cpu, desc: 'Lifecycle, hooks, virtual DOM, memoization, state management.' },
    { name: 'Node.js', tag: 'Web', icon: Brain, desc: 'Event loop, streams, clusters, Express middlewares, worker threads.' },
    { name: 'Next.js & Fullstack', tag: 'Web', icon: Layers, desc: 'App Router, SSR, SSG, Server Components, API routes.' },

    // Cloud & Systems
    { name: 'System Design & Cloud', tag: 'Cloud', icon: Network, desc: 'Microservices, caching, load balancing, CAP theorem, distributed databases.' },
    { name: 'DevOps & Kubernetes', tag: 'Cloud', icon: Server, desc: 'Docker, CI/CD pipelines, container orchestration, AWS/GCP architecture.' },
    { name: 'DBMS & SQL', tag: 'Cloud', icon: Database, desc: 'SQL vs NoSQL, ACID transactions, indexing, query optimization, sharding.' },
    { name: 'Cybersecurity & Web Security', tag: 'Cloud', icon: Lock, desc: 'OWASP Top 10, JWT, OAuth2, XSS/CSRF prevention, encryption.' },

    // Core CS & AI
    { name: 'Data Structures & Algorithms', tag: 'Core CS', icon: Terminal, desc: 'Big-O complexity, binary trees, dynamic programming, graphs, sorting.' },
    { name: 'Python & AI / Machine Learning', tag: 'Core CS', icon: Sparkles, desc: 'Python internals, NumPy, pandas, model evaluation, LLMs & neural nets.' },
    { name: 'Mobile Dev (Flutter / React Native)', tag: 'Web', icon: Smartphone, desc: 'Cross-platform native bridges, mobile lifecycle, animations, performance.' },
    { name: 'OOP & System Patterns', tag: 'Core CS', icon: ShieldCheck, desc: 'SOLID principles, design patterns (Factory, Singleton, Observer), abstraction.' },
    { name: 'HR & Behavioral Leadership', tag: 'Core CS', icon: HeartHandshake, desc: 'STAR technique, conflict resolution, technical trade-offs, team culture.' }
  ];

  const popularQuickPicks = [
    'Golang',
    'Rust',
    'Spring Boot (Java)',
    'FastAPI',
    'GraphQL',
    'Apache Kafka',
    'Microservices Architecture',
    'Blockchain & Solidity',
    'iOS (Swift)',
    'Data Engineering'
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const filteredDomains = activeTab === 'All'
    ? curatedDomains
    : curatedDomains.filter(d => d.tag === activeTab);

  const handleSelectDomain = (domainName) => {
    setSelectedCategory(domainName);
    setCustomInput('');
  };

  const handleCustomInputChange = (e) => {
    const val = e.target.value;
    setCustomInput(val);
    if (val.trim()) {
      setSelectedCategory(val.trim());
    }
  };

  const handleSelectQuickPick = (pick) => {
    setCustomInput(pick);
    setSelectedCategory(pick);
  };

  const handleStart = async () => {
    if (!selectedCategory || !selectedCategory.trim()) {
      setError('Please choose or enter a subject domain to begin.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/interviews/generate', {
        category: selectedCategory.trim(),
        difficulty: selectedDifficulty
      });

      if (response.data.success) {
        // Redirect to interview live session and pass details via state
        navigate('/interview-session', {
          state: {
            category: selectedCategory.trim(),
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
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
            <div className="absolute inset-3 rounded-full bg-indigo-600/30 border border-indigo-500/40 animate-pulse"></div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Generating Technical Assessment</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Google Gemini is configuring custom {selectedDifficulty}-level interview questions tailored specifically for <span className="text-indigo-400 font-semibold">{selectedCategory}</span>...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Link */}
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-gray-400 hover:text-indigo-400 text-sm font-semibold mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Configure Mock Interview</h1>
            <p className="text-gray-400">
              Pick from our comprehensive engineering curriculum, or enter <strong className="text-indigo-400">any custom topic</strong> you want to learn.
            </p>
          </div>

          {/* Active Selection Pill */}
          <div className="glass-panel px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-950/30 self-start md:self-auto flex items-center gap-2">
            <span className="text-xs text-gray-400">Target:</span>
            <span className="text-sm font-extrabold text-indigo-400">{selectedCategory}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs font-bold text-emerald-400">{selectedDifficulty}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/20 border border-red-800/30 text-red-300 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-8">
          
          {/* Custom Domain Input Section */}
          <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/20 via-purple-950/10 to-transparent relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
              <h2 className="text-base font-extrabold text-white">
                Learn Any Domain of Your Choice
              </h2>
            </div>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Want to prepare for a niche framework, specific language, or advanced specialization? Type it below and Gemini will generate custom questions for it!
            </p>

            <div className="relative mb-3">
              <input
                type="text"
                value={customInput}
                onChange={handleCustomInputChange}
                placeholder="e.g. Golang, Rust, Apache Kafka, GraphQL, Spring Boot, Blockchain, Cybersecurity..."
                className="w-full bg-gray-950/80 border border-gray-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
              />
              {customInput && (
                <button
                  onClick={() => setCustomInput('')}
                  className="absolute right-3 top-3 text-xs text-gray-500 hover:text-gray-300 font-semibold cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Pick Chips */}
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Popular Student Suggestions:
              </span>
              <div className="flex flex-wrap gap-2">
                {popularQuickPicks.map((pick) => {
                  const isSelected = selectedCategory.toLowerCase() === pick.toLowerCase();
                  return (
                    <button
                      key={pick}
                      onClick={() => handleSelectQuickPick(pick)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-semibold ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 scale-105'
                          : 'bg-gray-900/80 text-gray-300 border-gray-800 hover:border-gray-700 hover:bg-gray-800/60'
                      }`}
                    >
                      {pick}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Curated Catalog Section */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Or Choose from Pre-built Curated Domains:
              </span>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-gray-950 p-1 rounded-xl border border-gray-800 self-start sm:self-auto">
                {['All', 'Web', 'Cloud', 'Core CS'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === tab
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Domains */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDomains.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.name && !customInput;
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleSelectDomain(cat.name)}
                    className={`glass-panel p-5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/20 shadow-md shadow-indigo-600/20 ring-1 ring-indigo-500'
                        : 'border-gray-800 hover:border-gray-700 hover:bg-gray-900/10'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-400/30 text-indigo-400'
                            : 'bg-gray-950 border-gray-800 text-gray-400'
                        }`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-gray-900 text-gray-400 border border-gray-800">
                          {cat.tag}
                        </span>
                      </div>
                      <span className="block font-bold text-white text-base mb-1">{cat.name}</span>
                      <span className="block text-xs text-gray-400 leading-relaxed">{cat.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div>
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Step 2: Choose Difficulty Level
            </span>
            <div className="flex gap-4">
              {difficulties.map((diff) => {
                const isSelected = selectedDifficulty === diff;
                return (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`flex-1 glass-panel py-3.5 rounded-xl border text-center font-bold text-sm transition-all cursor-pointer ${
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
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 hover:scale-[1.01] cursor-pointer text-base"
          >
            Start Assessment for {selectedCategory} ({selectedDifficulty})
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
