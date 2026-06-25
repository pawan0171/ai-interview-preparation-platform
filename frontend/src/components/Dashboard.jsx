import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import {
  ClipboardList,
  Award,
  PlayCircle,
  Eye,
  Calendar,
  BookOpen,
  AlertCircle,
  Flame,
  Star,
  Zap,
  TrendingUp,
  FileText,
  Frown
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          api.get('/api/interviews/stats/dashboard'),
          api.get('/api/analytics/stats')
        ]);

        if (statsRes.data.success && analyticsRes.data.success) {
          setStats(statsRes.data.data);
          setAnalytics(analyticsRes.data.data);
        } else {
          setError('Failed to fetch dashboard metrics.');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Could not establish connection to server.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] pt-24 px-6 md:px-12 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-400 font-medium">Assembling dashboard metrics...</p>
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
            <h3 className="font-bold text-red-200">System Error</h3>
            <p className="text-sm text-red-300/80 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const { totalInterviews, averageScore, performanceByCategory, recentAttempts } = stats;
  const { scoreHistory, categoryStats, weakTopics, missingSkills } = analytics;

  // Custom function to return score color classes
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20';
    if (score >= 50) return 'text-yellow-400 border-yellow-500/20 bg-yellow-950/20';
    return 'text-red-400 border-red-500/20 bg-red-950/20';
  };

  const getScoreProgressColor = (score) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Gamification variables
  const currentXp = user?.xp || 0;
  const levelProgress = currentXp % 500;
  const progressPercent = Math.round((levelProgress / 500) * 100);

  // Custom SVG Area Chart for Score Progression Trend
  const renderAreaChart = () => {
    if (!scoreHistory || scoreHistory.length === 0) {
      return (
        <div className="h-[150px] flex flex-col items-center justify-center text-xs text-gray-500 border border-dashed border-gray-850 rounded-xl">
          <TrendingUp className="h-5 w-5 text-gray-600 mb-2" />
          No score history logged. Complete practice sessions to see trends.
        </div>
      );
    }

    const width = 500;
    const height = 150;
    const padding = 20;

    const pointsCount = scoreHistory.length;
    const stepX = pointsCount > 1 ? (width - padding * 2) / (pointsCount - 1) : width - padding * 2;

    const coords = scoreHistory.map((item, idx) => {
      const x = padding + idx * stepX;
      // Flip Y axis: 0 is at bottom (height-padding), 100 is at top (padding)
      const y = height - padding - (item.score / 100) * (height - padding * 2);
      return { x, y, score: item.score, date: item.date };
    });

    let pathD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      pathD += ` L ${coords[i].x} ${coords[i].y}`;
    }

    const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#1e293b" strokeDasharray="3,3" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#1e293b" strokeDasharray="3,3" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#1e293b" />

        {/* Area fill */}
        <path d={areaD} fill="url(#chartGradient)" />

        {/* Line stroke */}
        <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Highlight points */}
        {coords.map((c, idx) => (
          <g key={idx} className="group">
            <circle cx={c.x} cy={c.y} r="3.5" fill="#0b0f19" stroke="#6366f1" strokeWidth="2" />
            <circle cx={c.x} cy={c.y} r="6" fill="#6366f1" opacity="0" className="hover:opacity-20 cursor-pointer" />
          </g>
        ))}

        {/* Labels */}
        <text x={padding} y={height - 6} fill="#475569" fontSize="8" fontWeight="semibold">
          {coords[0].date}
        </text>
        {coords.length > 1 && (
          <text x={width - padding} y={height - 6} fill="#475569" fontSize="8" fontWeight="semibold" textAnchor="end">
            {coords[coords.length - 1].date}
          </text>
        )}
      </svg>
    );
  };

  // Custom SVG Bar Chart for Domain Breakdowns
  const renderBarChart = () => {
    if (!categoryStats || categoryStats.length === 0) {
      return (
        <div className="h-[150px] flex flex-col items-center justify-center text-xs text-gray-500 border border-dashed border-gray-850 rounded-xl">
          <BookOpen className="h-5 w-5 text-gray-600 mb-2" />
          No category breakdowns. Practice concepts to populate.
        </div>
      );
    }

    const width = 500;
    const height = 150;
    const padding = 15;
    const barHeight = 10;
    const gap = 16;
    const barStartX = 90;
    const maxBarWidth = width - barStartX - padding * 2;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {categoryStats.slice(0, 5).map((stat, idx) => {
          const barY = padding + idx * (barHeight + gap);
          const barWidth = (stat.averageScore / 100) * maxBarWidth;

          return (
            <g key={idx}>
              <text x={padding} y={barY + 8} fill="#94a3b8" fontSize="9" fontWeight="semibold">
                {stat.category}
              </text>
              <rect x={barStartX} y={barY} width={maxBarWidth} height={barHeight} rx="3" fill="#0f172a" />
              <rect x={barStartX} y={barY} width={barWidth} height={barHeight} rx="3" fill="#818cf8" />
              <text x={barStartX + barWidth + 6} y={barY + 8} fill="#fff" fontSize="8" fontWeight="bold">
                {stat.averageScore}%
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Top welcome profile & Gamified status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch">
          
          {/* Welcome card */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between lg:col-span-2">
            <div>
              <h1 className="text-3xl font-extrabold text-white">
                Welcome back, <span className="text-indigo-400">{user?.name}</span>
              </h1>
              <p className="text-gray-400 mt-2 text-sm max-w-xl">
                Ready to level up your engineering skills today? Attempt mock interviews, complete the daily quest, and analyze your resume for ATS score optimization.
              </p>
            </div>
            
            {/* XP progress bar */}
            <div className="mt-6 pt-4 border-t border-gray-800/40">
              <div className="flex justify-between items-baseline text-xs mb-2">
                <div className="flex items-center gap-1">
                  <span className="bg-indigo-600 text-white font-extrabold px-2.5 py-0.5 rounded-lg">
                    Level {user?.level}
                  </span>
                  <span className="text-gray-400 font-semibold">{currentXp} XP total</span>
                </div>
                <span className="text-indigo-300 font-bold">{(500 - levelProgress)} XP to Level {user?.level + 1}</span>
              </div>
              <div className="w-full bg-gray-950 rounded-full h-2 border border-gray-850">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Streaks & Quick Action */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between text-center lg:col-span-1">
            <div className="flex justify-around items-center h-full">
              <div className="flex flex-col items-center">
                <div className="p-3.5 bg-orange-950/20 border border-orange-500/20 text-orange-400 rounded-full animate-pulse">
                  <Flame className="h-6 w-6 fill-orange-500/10" />
                </div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-2.5">Streak</span>
                <span className="text-lg font-extrabold text-white mt-1">{user?.streak} Days</span>
              </div>

              <div className="w-[1px] h-12 bg-gray-800"></div>

              <div className="flex flex-col items-center">
                <div className="p-3.5 bg-indigo-950/20 border border-indigo-500/20 text-indigo-400 rounded-full">
                  <Star className="h-6 w-6" />
                </div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-2.5">Level</span>
                <span className="text-lg font-extrabold text-white mt-1">Lv {user?.level}</span>
              </div>
            </div>

            <Link
              to="/interview-setup"
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-indigo-600/10 text-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PlayCircle className="h-4 w-4" />
              Practice Session
            </Link>
          </div>
        </div>

        {/* Daily Challenge Quest active banner */}
        <div className="glass-panel border border-orange-500/20 bg-orange-950/5 p-4 rounded-xl mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/10 p-2 rounded-lg border border-orange-500/35 text-orange-400">
              <Zap className="h-5 w-5 fill-orange-500/5 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-white block text-sm">Today's Daily Code Quest is Active!</span>
              <span className="text-xs text-gray-400 block mt-0.5">
                Answer today's random conceptual question to receive up to +250 XP and expand your streak count.
              </span>
            </div>
          </div>
          <Link
            to="/daily-challenge"
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all cursor-pointer shadow-md shadow-orange-600/10 shrink-0"
          >
            Solve Challenge
          </Link>
        </div>

        {totalInterviews === 0 ? (
          /* Onboarding State */
          <div className="glass-panel p-10 md:p-16 rounded-2xl border border-gray-800 text-center flex flex-col items-center max-w-3xl mx-auto">
            <div className="bg-indigo-950/30 p-4 rounded-full border border-indigo-500/20 mb-6">
              <ClipboardList className="h-10 w-10 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">No mock assessments logged</h2>
            <p className="text-gray-400 mt-3 max-w-md leading-relaxed">
              Launch your first interview or upload your PDF resume to kickstart analytics gauges, identify gaps, and unlock the AI Roadmap.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                to="/interview-setup"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-3 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
              >
                <PlayCircle className="h-5 w-5" />
                Start Mock Interview
              </Link>
              <Link
                to="/resume-checker"
                className="bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 font-bold px-5 py-3 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="h-5 w-5" />
                Upload Resume
              </Link>
            </div>
          </div>
        ) : (
          /* Dashboard Analytics Dashboard */
          <div className="space-y-8 animate-fade-in">
            
            {/* Visual SVG Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Score progression area chart */}
              <div className="glass-panel p-6 rounded-2xl border border-gray-800">
                <span className="block text-xs font-bold text-gray-450 uppercase tracking-wider mb-4">
                  Score progression history
                </span>
                {renderAreaChart()}
              </div>

              {/* Subject breakdown bar chart */}
              <div className="glass-panel p-6 rounded-2xl border border-gray-800">
                <span className="block text-xs font-bold text-gray-450 uppercase tracking-wider mb-4">
                  Category Skill averages
                </span>
                {renderBarChart()}
              </div>
            </div>

            {/* Performance analysis & Recent history */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
              
              {/* Weak topics & Missing skills (2 columns equivalent) */}
              <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white mb-5">Skill Gap Diagnoses</h3>
                  
                  {/* Weak topics */}
                  <div className="mb-6">
                    <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-2">
                      Weak Areas (Interview evaluations)
                    </span>
                    {weakTopics.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {weakTopics.map((topic, idx) => (
                          <span key={idx} className="text-[10px] text-yellow-300 border border-yellow-500/20 bg-yellow-950/20 px-2 py-1 rounded-md max-w-full truncate block" title={topic}>
                            {topic}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 block italic">Practice more to aggregate weak concepts.</span>
                    )}
                  </div>

                  {/* Missing skills */}
                  <div>
                    <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-2">
                      Missing resume keywords
                    </span>
                    {missingSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {missingSkills.map((skill, idx) => (
                          <span key={idx} className="text-[10px] text-red-300 border border-red-500/20 bg-red-950/20 px-2 py-1 rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 block italic">
                        {statsSummary.totalResumes === 0 ? (
                          <Link to="/resume-checker" className="text-indigo-400 hover:text-indigo-300 underline font-semibold">
                            Upload resume PDF
                          </Link>
                        ) : (
                          'No missing skills keywords.'
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  to="/roadmap"
                  className="w-full mt-6 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-900/35 text-xs font-bold py-2.5 rounded-xl text-center transition-all cursor-pointer"
                >
                  Generate Study Roadmap
                </Link>
              </div>

              {/* Recent Activity Table (3 columns equivalent) */}
              <div className="lg:col-span-3 glass-panel p-6 rounded-2xl border border-gray-800">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-base font-bold text-white">Recent Mock Attempts</h3>
                  <Link to="/history" className="text-indigo-400 hover:text-indigo-300 text-xs font-bold uppercase tracking-wider">
                    See All
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        <th className="pb-3 pr-4">Category / Level</th>
                        <th className="pb-3 px-4 text-center">Score</th>
                        <th className="pb-3 px-4">Completion Date</th>
                        <th className="pb-3 pl-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/40 text-sm">
                      {recentAttempts.map((attempt) => (
                        <tr key={attempt._id} className="hover:bg-gray-950/10 group">
                          <td className="py-3 pr-4">
                            <span className="font-bold text-white block text-xs">{attempt.category}</span>
                            <span className="text-[10px] text-gray-400">{attempt.difficulty}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${getScoreColor(attempt.overallScore)}`}>
                              {attempt.overallScore}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-400 text-[10px] whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(attempt.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </td>
                          <td className="py-3 pl-4 text-right">
                            <Link
                              to={`/history/${attempt._id}`}
                              className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold text-xs border border-indigo-900/30 group-hover:border-indigo-500/50 bg-indigo-950/10 px-2.5 py-1 rounded-lg transition-all"
                            >
                              <Eye className="h-3 w-3" />
                              Review
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
