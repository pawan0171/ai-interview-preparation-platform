import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import {
  ShieldAlert,
  Users,
  Terminal,
  FileText,
  Percent,
  Search,
  UserCheck,
  UserX,
  ArrowLeft,
  Calendar,
  Zap,
  Award
} from 'lucide-react';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInterviews: 0,
    totalResumes: 0,
    systemAverageScore: 0
  });
  const [usersList, setUsersList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');

  // Protect client side
  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user || !user.isAdmin) return;

    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/api/admin/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await api.get('/api/admin/users');
        if (res.data.success) {
          setUsersList(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch system logs and user records.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
    fetchUsers();
  }, [user]);

  const handleToggleAdmin = async (targetUser) => {
    if (targetUser._id === user._id) {
      alert('You cannot revoke your own admin rights.');
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to ${
          targetUser.isAdmin ? 'REVOKE' : 'GRANT'
        } administrator permissions for ${targetUser.name}?`
      )
    ) {
      return;
    }

    setActionLoading(targetUser._id);
    setError('');

    try {
      const res = await api.put(`/api/admin/users/${targetUser._id}/toggle-admin`);
      if (res.data.success) {
        // Update local state
        setUsersList((prev) =>
          prev.map((u) => (u._id === targetUser._id ? { ...u, isAdmin: res.data.data.isAdmin } : u))
        );
        // Re-fetch system stats
        const statsRes = await api.get('/api/admin/stats');
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
      }
    } catch (err) {
      console.error('Error toggling admin privilege:', err);
      setError(err.response?.data?.message || 'Failed to toggle admin status.');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If not logged in as admin, show unauthorized access
  if (user && !user.isAdmin) {
    return (
      <div className="min-h-screen bg-[#0b0f19] pt-24 px-6 md:px-12 flex justify-center items-center">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full border border-gray-800 text-center flex flex-col items-center">
          <ShieldAlert className="h-12 w-12 text-rose-500 mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-white mb-2">Unauthorized Access</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            You do not have administrative privileges required to view the operations panel.
          </p>
          <Link
            to="/dashboard"
            className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-all"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-gray-400 hover:text-indigo-400 text-sm font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-2">
          System Control Panel
        </h1>
        <p className="text-gray-400 mb-8">
          Manage system administrators, verify platform performance KPIs, and inspect database activity logs.
        </p>

        {error && (
          <div className="bg-red-950/20 border border-red-800/30 text-red-300 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Registered Users
                </span>
                <span className="text-3xl font-black text-white block mt-2">
                  {statsLoading ? '...' : stats.totalUsers}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-gray-800 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Interviews Conducted
                </span>
                <span className="text-3xl font-black text-white block mt-2">
                  {statsLoading ? '...' : stats.totalInterviews}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Terminal className="h-5 w-5" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-gray-800 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Resumes Evaluated
                </span>
                <span className="text-3xl font-black text-white block mt-2">
                  {statsLoading ? '...' : stats.totalResumes}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500" />
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-gray-800 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Global Average Score
                </span>
                <span className="text-3xl font-black text-white block mt-2">
                  {statsLoading ? '...' : `${stats.systemAverageScore}%`}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Percent className="h-5 w-5" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
          </div>
        </div>

        {/* Users Table Panel */}
        <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden flex flex-col">
          {/* Header Row with Search */}
          <div className="p-6 border-b border-gray-800 bg-indigo-950/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-bold text-white">System User Database</h2>
            <div className="relative w-full sm:w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-500" />
              </span>
              <input
                type="text"
                placeholder="Search user name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-3"></div>
                <span className="text-sm text-gray-400">Loading directory...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-sm text-gray-550">
                No matching user profiles found in the registry.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-[10px] uppercase tracking-wider text-gray-400 font-extrabold bg-gray-950/20">
                    <th className="py-4 px-6">User Name</th>
                    <th className="py-4 px-6">Level / XP</th>
                    <th className="py-4 px-6">Streak</th>
                    <th className="py-4 px-6">Joined Date</th>
                    <th className="py-4 px-6 text-center">Auth Role</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-850">
                  {filteredUsers.map((u) => {
                    const isSelf = u._id === user._id;
                    const joinDate = new Date(u.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    });

                    return (
                      <tr
                        key={u._id}
                        className={`hover:bg-indigo-950/5 transition-colors ${
                          isSelf ? 'bg-indigo-600/5' : ''
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-white flex items-center gap-1.5">
                              {u.name}
                              {isSelf && (
                                <span className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                                  You
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5">{u.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-indigo-400 font-extrabold text-sm">
                              <Award className="h-4 w-4 shrink-0" />
                              <span>Lvl {u.level}</span>
                            </div>
                            <span className="text-xs text-gray-400">({u.xp} XP)</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1 font-bold text-orange-400 text-sm">
                            <Zap className="h-4 w-4 shrink-0 text-orange-500 fill-orange-500/25" />
                            <span>{u.streak} days</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Calendar className="h-3.5 w-3.5 text-gray-500" />
                            <span>{joinDate}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          {u.isAdmin ? (
                            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wide bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2.5 py-1 rounded-full">
                              Admin
                            </span>
                          ) : (
                            <span className="inline-block text-[10px] font-semibold uppercase tracking-wide bg-gray-900 text-gray-400 border border-gray-800 px-2.5 py-1 rounded-full">
                              User
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleToggleAdmin(u)}
                            disabled={isSelf || actionLoading === u._id}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border disabled:opacity-40 cursor-pointer ${
                              isSelf
                                ? 'bg-transparent text-gray-600 border-gray-850 cursor-not-allowed'
                                : u.isAdmin
                                ? 'bg-rose-950/20 text-rose-300 border-rose-900/30 hover:bg-rose-900/40'
                                : 'bg-indigo-950/20 text-indigo-300 border-indigo-900/30 hover:bg-indigo-900/40'
                            }`}
                          >
                            {actionLoading === u._id ? (
                              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                            ) : u.isAdmin ? (
                              <>
                                <UserX className="h-3.5 w-3.5" />
                                <span>Demote</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-3.5 w-3.5" />
                                <span>Promote</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
