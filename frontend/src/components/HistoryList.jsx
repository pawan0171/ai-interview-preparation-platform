import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Eye, Calendar, Award, BookOpen, Clock, AlertTriangle } from 'lucide-react';

const HistoryList = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/api/interviews/history');
        if (response.data.success) {
          setHistory(response.data.data);
        } else {
          setError('Failed to load history.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch interview history from server.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20';
    if (score >= 50) return 'text-yellow-400 border-yellow-500/20 bg-yellow-950/20';
    return 'text-red-400 border-red-500/20 bg-red-950/20';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] pt-24 px-6 md:px-12 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-400 font-medium">Retrieving history logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b0f19] pt-28 px-6 md:px-12">
        <div className="glass-panel p-6 rounded-xl border border-red-950/30 max-w-xl mx-auto flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-red-400 shrink-0" />
          <div>
            <h3 className="font-bold text-red-200">History Load Failure</h3>
            <p className="text-sm text-red-300/80 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white mb-2">Practice History Logs</h1>
        <p className="text-gray-400 mb-8">Review your past practice assessments and monitor your performance gains.</p>

        {history.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center flex flex-col items-center">
            <div className="bg-indigo-950/30 p-4 rounded-full border border-indigo-500/20 mb-6">
              <Clock className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No History Logged</h3>
            <p className="text-gray-400 max-w-md text-sm leading-relaxed mb-6">
              You haven't completed any mock interviews yet. Start your first session to save records and track statistics.
            </p>
            <Link
              to="/interview-setup"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all"
            >
              Start Interview
            </Link>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-950/30">
                    <th className="py-4 px-6">Domain Topic</th>
                    <th className="py-4 px-6">Difficulty</th>
                    <th className="py-4 px-6">Attempt Date</th>
                    <th className="py-4 px-6">Score</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/40 text-sm">
                  {history.map((session) => (
                    <tr key={session._id} className="hover:bg-gray-950/15 group">
                      <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-indigo-400" />
                        {session.category}
                      </td>
                      <td className="py-4 px-6 text-gray-400 font-medium">
                        {session.difficulty}
                      </td>
                      <td className="py-4 px-6 text-gray-400">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(session.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5">
                          <Award className="h-4 w-4 text-indigo-400" />
                          <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${getScoreColor(session.overallScore)}`}>
                            {session.overallScore}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/history/${session._id}`}
                          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold text-xs border border-indigo-900/30 group-hover:border-indigo-500/50 bg-indigo-950/10 px-3 py-2 rounded-lg transition-all"
                        >
                          <Eye className="h-3 w-3" />
                          View Report
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryList;
