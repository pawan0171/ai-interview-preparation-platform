import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Flame, Star, Send, Award, AlertCircle, CheckCircle, RefreshCw, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const DailyChallenge = () => {
  const { user, setUser } = useContext(AuthContext);
  const [challenge, setChallenge] = useState(null);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [attemptData, setAttemptData] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [rewardData, setRewardData] = useState(null);

  useEffect(() => {
    const fetchDailyChallenge = async () => {
      try {
        const response = await api.get('/api/challenges/daily');
        if (response.data.success) {
          setChallenge(response.data.challenge);
          setHasAttempted(response.data.hasAttempted);
          setAttemptData(response.data.attemptData);
        } else {
          setError('Failed to load today\'s challenge.');
        }
      } catch (err) {
        console.error('Error fetching challenge:', err);
        setError('Could not connect to server.');
      } finally {
        setLoading(false);
      }
    };

    fetchDailyChallenge();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (userAnswer.trim() === '') {
      setError('Please provide an answer response before submitting.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post('/api/challenges/daily/submit', {
        userAnswer
      });

      if (response.data.success) {
        const { attempt, xpGained, totalXp, currentLevel, currentStreak, leveledUp } = response.data.data;
        setAttemptData(attempt);
        setHasAttempted(true);
        setRewardData({ xpGained, leveledUp });
        
        // Dynamically update the global user profile in AuthContext
        setUser((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            xp: totalXp,
            level: currentLevel,
            streak: currentStreak
          };
        });
      } else {
        setError('Submission failed.');
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 'Server error occurred during evaluation.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20';
    if (score >= 5) return 'text-yellow-400 border-yellow-500/20 bg-yellow-950/20';
    return 'text-red-400 border-red-500/20 bg-red-950/20';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] pt-24 px-6 md:px-12 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-400 font-medium">Assembling today's challenge workspace...</p>
        </div>
      </div>
    );
  }

  if (error && !challenge) {
    return (
      <div className="min-h-screen bg-[#0b0f19] pt-28 px-6 md:px-12">
        <div className="glass-panel p-6 rounded-xl border border-red-950/30 max-w-xl mx-auto flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-400 shrink-0" />
          <div>
            <h3 className="font-bold text-red-200">Load Error</h3>
            <p className="text-sm text-red-300/80 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Banner badges */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-950/40 border border-orange-500/20 rounded-full px-4 py-1 mb-3">
              <Zap className="h-4 w-4 text-orange-400 fill-orange-500/10" />
              <span className="text-xs font-semibold text-orange-200 uppercase tracking-wider">Daily Challenge</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Daily Code Quest</h1>
            <p className="text-gray-400 text-sm mt-1">One question, once a day. Push your limits and extend your streak.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-orange-950/20 border border-orange-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-400 fill-orange-500/10" />
              <div>
                <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider">Active Streak</span>
                <span className="text-sm font-extrabold text-orange-400">{user?.streak} Days</span>
              </div>
            </div>
            <div className="bg-indigo-950/20 border border-indigo-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
              <Star className="h-5 w-5 text-indigo-400 fill-indigo-500/10" />
              <div>
                <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider">Total XP</span>
                <span className="text-sm font-extrabold text-indigo-400">{user?.xp.toLocaleString()} XP</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-800/40 text-red-300 p-4 rounded-xl mb-6 flex items-start gap-2 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Challenge Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          
          {/* Main workspace (3 columns equivalent) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-indigo-400 bg-indigo-950/40 border border-indigo-900/30 px-3 py-1 rounded-full uppercase">
                  {challenge.category}
                </span>
                <span className="text-xs text-gray-400 font-semibold uppercase bg-gray-900 border border-gray-800 px-3 py-1 rounded-full">
                  {challenge.difficulty}
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed">
                {challenge.questionText}
              </h3>
            </div>

            {!hasAttempted ? (
              /* Answering Form */
              <form onSubmit={handleSubmit} className="flex flex-col justify-between flex-grow glass-panel p-6 rounded-2xl border border-gray-800">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Submit Your Answer
                  </label>
                  <textarea
                    placeholder="Provide your response. To maximize your score, explain the mechanisms, logic flow, and outline edge case optimizations."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full bg-gray-950/60 border border-gray-850 focus:border-indigo-500 rounded-xl p-4 text-white placeholder-gray-650 text-sm focus:outline-none min-h-[200px] resize-y transition-all leading-relaxed"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      AI Score Evaluation Running...
                    </>
                  ) : (
                    <>
                      Submit Quest Answer
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Attempt scorecard */
              <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-850 pb-4">
                  <h4 className="font-bold text-white text-base">Your Assessment Report</h4>
                  <div className={`text-xs font-bold px-3 py-1.5 rounded-full border ${getScoreColor(attemptData.score)}`}>
                    Score: {attemptData.score}/10
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Your Response
                  </span>
                  <div className="bg-gray-950 border border-gray-850 p-4 rounded-xl text-sm leading-relaxed text-gray-300 max-h-[160px] overflow-y-auto whitespace-pre-wrap">
                    {attemptData.userAnswer}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    AI Evaluation Summary
                  </span>
                  <div className="text-sm text-gray-350 leading-relaxed bg-indigo-950/15 border border-indigo-900/20 p-4 rounded-xl flex items-start gap-2.5">
                    <Award className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                    <p>{attemptData.feedback}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Quest Details & Streak Info (2 columns equivalent) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* XP and level up rewards visual */}
            {rewardData && (
              <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 bg-indigo-950/10 text-center flex flex-col items-center animate-pulse-glow">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-white text-base">Quest Complete!</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-[200px] leading-relaxed">
                  You successfully gained <span className="font-extrabold text-indigo-400">+{rewardData.xpGained} XP</span> and kept your streak alive.
                </p>
                {rewardData.leveledUp && (
                  <div className="mt-4 bg-purple-500/15 border border-purple-500/40 text-purple-300 font-extrabold text-xs px-3 py-1.5 rounded-full animate-bounce">
                    🎉 Level Up! Level {user?.level}
                  </div>
                )}
              </div>
            )}

            {/* Daily rules list */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-800">
              <h3 className="text-base font-bold text-white mb-4">Rules of the Quest</h3>
              <ul className="space-y-3.5 text-xs text-gray-450 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>A fresh interview challenge releases every 24 hours at local midnight.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Completing the challenge awards a baseline 100 XP + (15 XP * AI Score out of 10).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Failing to answer within a calendar day will reset your streak indicator.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Compare your responses with model answers to study optimal keywords.</span>
                </li>
              </ul>
            </div>

            {hasAttempted && attemptData && (
              /* Recommended response */
              <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex-grow h-fit">
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Recommended Model Response
                </span>
                <div className="bg-emerald-950/10 border border-emerald-900/20 p-4 rounded-xl text-xs leading-relaxed text-emerald-200/90 whitespace-pre-wrap">
                  {attemptData.modelAnswer}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DailyChallenge;
