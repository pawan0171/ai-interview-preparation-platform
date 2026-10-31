import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Terminal,
  LogOut,
  LayoutDashboard,
  History,
  User,
  FileText,
  Compass,
  Trophy,
  Zap,
  Bell,
  Sun,
  Moon,
  Shield,
  Building2,
  Radio
} from 'lucide-react';
import api from '../utils/api';
import { useSocket } from '../context/SocketContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { socket, connected } = useSocket();
  const navigate = useNavigate();

  // Theme support
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  
  // Notifications support
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Apply theme on load
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [theme]);

  // Initial fetch of notifications
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const response = await api.get('/api/notifications');
        if (response.data.success) {
          setNotifications(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();
  }, [user]);

  // Real-time WebSocket event listener (replaces 20s polling!)
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      setNotifications(prev => [notification, ...prev]);
    };

    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, [socket]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const markAllNotificationsRead = async () => {
    try {
      await api.put('/api/notifications/read');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking notifications read:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-gray-800 py-4 px-6 md:px-12 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-indigo-600/20 p-2 rounded-lg border border-indigo-500/30 group-hover:border-indigo-500/80 transition-all duration-300">
          <Terminal className="h-5 w-5 text-indigo-400 group-hover:scale-110 transition-transform" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          Prep<span className="text-indigo-400">AI</span>
        </span>
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <div className="hidden md:flex items-center gap-5">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-gray-300 hover:text-indigo-400 font-medium transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/company-interviews"
                className="flex items-center gap-1.5 text-gray-300 hover:text-indigo-400 font-medium transition-colors"
              >
                <Building2 className="h-4 w-4 text-emerald-400" />
                Company Prep
              </Link>
              <Link
                to="/resume-checker"
                className="flex items-center gap-1.5 text-gray-300 hover:text-indigo-400 font-medium transition-colors"
              >
                <FileText className="h-4 w-4" />
                Resume Checker
              </Link>
              <Link
                to="/daily-challenge"
                className="flex items-center gap-1.5 text-gray-300 hover:text-indigo-400 font-medium transition-colors"
              >
                <Zap className="h-4 w-4 text-orange-400" />
                Quest
              </Link>
              <Link
                to="/roadmap"
                className="flex items-center gap-1.5 text-gray-300 hover:text-indigo-400 font-medium transition-colors"
              >
                <Compass className="h-4 w-4 text-purple-400" />
                Roadmap
              </Link>
              <Link
                to="/leaderboard"
                className="flex items-center gap-1.5 text-gray-300 hover:text-indigo-400 font-medium transition-colors"
              >
                <Trophy className="h-4 w-4 text-amber-400" />
                Leaderboard
              </Link>
              <Link
                to="/history"
                className="flex items-center gap-1.5 text-gray-300 hover:text-indigo-400 font-medium transition-colors"
              >
                <History className="h-4 w-4" />
                History
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {/* Admin Dashboard */}
              {user.isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 bg-rose-950/20 hover:bg-rose-900/40 text-rose-300 border border-rose-900/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  title="Admin Dashboard"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 cursor-pointer"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 cursor-pointer relative"
                  title="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 glass-panel border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-[100] max-h-96 flex flex-col">
                    <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-indigo-950/40">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-200">Notifications ({unreadCount} new)</span>
                        <span 
                          title={connected ? "WebSockets Connected (Real-time)" : "Connecting to WebSockets..."}
                          className={`inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                            connected 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                          {connected ? 'Live' : 'Offline'}
                        </span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="overflow-y-auto flex-1 max-h-64">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-gray-500">No notifications yet</div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n._id}
                            className={`p-3 border-b border-gray-800/40 flex items-start gap-2.5 transition-colors ${
                              n.read ? 'bg-transparent' : 'bg-indigo-600/5'
                            }`}
                          >
                            <div className="mt-0.5 flex-shrink-0">
                              {n.type === 'achievement' ? (
                                <Trophy className="h-3.5 w-3.5 text-amber-400" />
                              ) : n.type === 'level_up' ? (
                                <Zap className="h-3.5 w-3.5 text-indigo-400" />
                              ) : (
                                <Bell className="h-3.5 w-3.5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-white truncate">{n.title}</p>
                              <p className="text-[11px] text-gray-400 leading-normal mt-0.5">{n.message}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 bg-indigo-950/40 px-3 py-1.5 rounded-full border border-indigo-800/30">
                <User className="h-3.5 w-3.5 text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-200">{user.name}</span>
              </div>
              
              {/* Mobile links shown as icons */}
              <Link
                to="/dashboard"
                className="md:hidden p-1.5 text-gray-400 hover:text-white"
                title="Dashboard"
              >
                <LayoutDashboard className="h-5 w-5" />
              </Link>
              <Link
                to="/company-interviews"
                className="md:hidden p-1.5 text-gray-400 hover:text-white"
                title="Company Prep"
              >
                <Building2 className="h-5 w-5" />
              </Link>
              <Link
                to="/resume-checker"
                className="md:hidden p-1.5 text-gray-400 hover:text-white"
                title="Resume Checker"
              >
                <FileText className="h-5 w-5" />
              </Link>
              <Link
                to="/daily-challenge"
                className="md:hidden p-1.5 text-gray-400 hover:text-white"
                title="Daily Quest"
              >
                <Zap className="h-5 w-5" />
              </Link>
              <Link
                to="/roadmap"
                className="md:hidden p-1.5 text-gray-400 hover:text-white"
                title="Study Roadmap"
              >
                <Compass className="h-5 w-5" />
              </Link>
              <Link
                to="/leaderboard"
                className="md:hidden p-1.5 text-gray-400 hover:text-white"
                title="Leaderboard"
              >
                <Trophy className="h-5 w-5" />
              </Link>
              <Link
                to="/history"
                className="md:hidden p-1.5 text-gray-400 hover:text-white"
                title="History"
              >
                <History className="h-5 w-5" />
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-red-950/20 hover:bg-red-900/40 text-red-300 border border-red-900/30 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 cursor-pointer mr-2"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link
              to="/login"
              className="text-gray-300 hover:text-white font-medium text-sm transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-md shadow-indigo-600/20 border border-indigo-500/20 cursor-pointer"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
