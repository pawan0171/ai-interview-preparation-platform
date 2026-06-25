import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Brain, Code, Cpu, Database, HeartHandshake, ShieldCheck, ArrowRight, Star } from 'lucide-react';

const Landing = () => {
  const { user } = useContext(AuthContext);

  const categories = [
    { name: 'JavaScript', icon: Code, desc: 'Closures, scope, event loops, and ES6+ features.' },
    { name: 'React.js', icon: Cpu, desc: 'Lifecycle, state management, hooks, and Fiber reconciliation.' },
    { name: 'Node.js', icon: Brain, desc: 'Asynchronous event-driven runtimes, streams, and cluster scaling.' },
    { name: 'DBMS & SQL', icon: Database, desc: 'ACID properties, normalization, indexing, and NoSQL architecture.' },
    { name: 'OOP Concepts', icon: ShieldCheck, desc: 'SOLID principles, design patterns, and polymorphic mappings.' },
    { name: 'HR Behavioral', icon: HeartHandshake, desc: 'Conflict resolution, mentoring, engineering culture, and career goals.' }
  ];

  return (
    <div className="relative min-h-screen bg-[#0b0f19] pt-24 overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 animate-pulse-glow"></div>
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 flex flex-col items-center text-center">
        {/* Banner Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-950/40 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6">
          <Star className="h-4 w-4 text-indigo-400 fill-indigo-400" />
          <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">Powered by Google Gemini 1.5</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
          Master Your Next Tech Interview with{' '}
          <span className="text-shimmer">Personalized AI Coaching</span>
        </h1>

        <p className="mt-6 text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
          Simulate real-world technical assessments, receive detailed feedback on your answers, identify weak spots, and learn from perfect model answers.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            to={user ? '/dashboard' : '/register'}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] cursor-pointer"
          >
            {user ? 'Go to Dashboard' : 'Start Preparing Free'}
            <ArrowRight className="h-5 w-5" />
          </Link>
          {!user && (
            <Link
              to="/login"
              className="flex items-center justify-center bg-gray-900/40 hover:bg-gray-800/60 text-gray-200 border border-gray-800 px-8 py-4 rounded-xl font-bold transition-all cursor-pointer"
            >
              Sign In to Your Account
            </Link>
          )}
        </div>

        {/* Grid Categories */}
        <div className="mt-24 w-full text-left">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl font-bold">Choose From Core Technical Domains</h2>
            <p className="mt-2 text-gray-400 max-w-lg">Tailored evaluation matrices mapping concepts from basic questions to architect-level queries.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => {
              const IconComponent = cat.icon;
              return (
                <div key={idx} className="glass-panel glass-panel-hover p-6 rounded-2xl">
                  <div className="bg-indigo-600/10 w-12 h-12 flex items-center justify-center rounded-xl border border-indigo-500/20 mb-4">
                    <IconComponent className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Row */}
        <div className="mt-32 w-full grid grid-cols-1 lg:grid-cols-3 gap-8 text-left border-t border-gray-800/60 pt-20">
          <div>
            <h4 className="text-indigo-400 text-sm font-bold uppercase tracking-wider mb-2">01. Live Assessments</h4>
            <h3 className="text-2xl font-bold mb-3">Vetted Question Bank</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Gemini dynamically generates highly contextual questions fitting your requested seniority and framework topic, preventing rote response patterns.
            </p>
          </div>
          <div>
            <h4 className="text-indigo-400 text-sm font-bold uppercase tracking-wider mb-2">02. Instant Assessment</h4>
            <h3 className="text-2xl font-bold mb-3">Nuanced Score Report</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Get an overall percentage score and specific ratings from 1-10 on each reply. The AI measures vocabulary correctness, missing concepts, and structural gaps.
            </p>
          </div>
          <div>
            <h4 className="text-indigo-400 text-sm font-bold uppercase tracking-wider mb-2">03. Career Growth</h4>
            <h3 className="text-2xl font-bold mb-3">Model Answer Comparison</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Compare your replies directly with production-grade senior examples. Review recommendations highlighting strengths and weaknesses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
