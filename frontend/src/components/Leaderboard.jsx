import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Trophy, Flame, Star, Award, AlertCircle, Sparkles } from 'lucide-react';

const Leaderboard = () => {
  const { user } = useContext(AuthContext);
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/api/users/leaderboard');
        if (response.data.success) {
          setBoard(response.data.data);
        } else {
          setError('Failed to fetch ranking metrics.');
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to establish connection to server.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <div className="bg-amber-500/20 border border-amber-500/40 p-2 rounded-xl text-amber-400 flex items-center justify-center shrink-0">
          <Trophy className="h-5 w-5 fill-amber-500/20" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="bg-slate-400/20 border border-slate-400/40 p-2 rounded-xl text-slate-300 flex items-center justify-center shrink-0">
          <Trophy className="h-5 w-5 fill-slate-400/20" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="bg-amber-700/25 border border-amber-700/40 p-2 rounded-xl text-amber-600 flex items-center justify-center shrink-0">
          <Trophy className="h-5 w-5 fill-amber-700/20" />
        </div>
      );
    }
    return (
      <div className="bg-gray-900 border border-gray-800 w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold text-gray-400 shrink-0">
        {rank}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] pt-24 px-6 md:px-12 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-400 font-medium">Assembling community rankings...</p>
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

  return (
    <div className="min-h-screen bg-[#0b0f19] pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Banner header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-950/40 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">Community Standings</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">PrepAI Leaderboard</h1>
          <p className="text-gray-400 mt-2 max-w-md mx-auto">
            Compete with candidates globally, maintain streaks, solve daily challenges, and level up.
          </p>
        </div>

        {/* Board table card */}
        <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-950/30">
                  <th className="py-4 px-6 text-center w-20">Rank</th>
                  <th className="py-4 px-6">User Profile</th>
                  <th className="py-4 px-6 text-center">Level</th>
                  <th className="py-4 px-6 text-center">Streak</th>
                  <th className="py-4 px-6 text-right pr-8">Total XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40 text-sm">
                {board.map((candidate) => {
                  const isSelf = user && user._id === candidate._id;
                  return (
                    <tr
                      key={candidate._id}
                      className={`transition-colors hover:bg-gray-950/15 ${
                        isSelf
                          ? 'bg-indigo-950/10 border-y border-indigo-500/20 font-bold text-white shadow-inner'
                          : 'text-gray-300'
                      }`}
                    >
                      <td className="py-4 px-6 flex justify-center">
                        {getRankBadge(candidate.rank)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <span className={`${isSelf ? 'text-indigo-400 font-extrabold' : 'text-white font-semibold'}`}>
                            {candidate.name}
                          </span>
                          {isSelf && (
                            <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold px-2 py-0.5 rounded-full uppercase">
                              You
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center font-bold">
                        <div className="inline-flex items-center gap-1 bg-gray-900 border border-gray-800 px-2.5 py-1 rounded-lg text-xs">
                          <Award className="h-3.5 w-3.5 text-indigo-400" />
                          Lv {candidate.level}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex items-center gap-1 text-orange-400 font-bold">
                          <Flame className="h-4 w-4 fill-orange-500/10" />
                          {candidate.streak}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right pr-8 font-extrabold text-indigo-300">
                        <div className="inline-flex items-center gap-1 justify-end">
                          <Star className="h-3.5 w-3.5 text-indigo-400 fill-indigo-400" />
                          {candidate.xp.toLocaleString()} XP
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;
