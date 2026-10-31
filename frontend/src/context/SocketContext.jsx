import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';
import { Bell, Trophy, Zap, Shield, CheckCircle2, X } from 'lucide-react';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [activeToast, setActiveToast] = useState(null);

  // Subtle Web Audio API chime (no external mp3 files needed)
  const playNotificationChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Dual tone pleasant chime
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.setValueAtTime(880, now + 0.12); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now);
      osc2.frequency.setValueAtTime(1174.66, now + 0.12); // D6

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch {
      // Audio playback restrictions fallback
    }
  };

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // Connect to current origin (uses Vite proxy in dev, direct origin in prod)
    const newSocket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });

    newSocket.on('connect', () => {
      setConnected(true);
      // Join user room for targeted notifications
      newSocket.emit('join_user', user._id);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    // Listen for real-time notification push
    newSocket.on('new_notification', (notification) => {
      setActiveToast(notification);
      playNotificationChime();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      setActiveToast(null);
    }, 5500);
    return () => clearTimeout(timer);
  }, [activeToast]);

  return (
    <SocketContext.Provider value={{ socket, connected, activeToast, setActiveToast }}>
      {children}

      {/* Real-time Floating Glassmorphic Toast Notification */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-[100] max-w-sm w-full animate-bounce-in transition-all duration-300">
          <div className="glass-panel p-4 rounded-2xl border border-indigo-500/40 shadow-2xl shadow-indigo-500/20 bg-gray-950/90 backdrop-blur-xl flex items-start gap-3.5 relative overflow-hidden">
            {/* Top glowing accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse" />

            {/* Icon */}
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shrink-0 mt-0.5">
              {activeToast.type === 'achievement' ? (
                <Trophy className="h-5 w-5 text-amber-400" />
              ) : activeToast.type === 'level_up' ? (
                <Zap className="h-5 w-5 text-indigo-400" />
              ) : activeToast.type === 'system' ? (
                <Shield className="h-5 w-5 text-rose-400" />
              ) : (
                <Bell className="h-5 w-5 text-indigo-400" />
              )}
            </div>

            {/* Text details */}
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">
                  Live Alert
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h4 className="text-sm font-bold text-white truncate">{activeToast.title}</h4>
              <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">{activeToast.message}</p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setActiveToast(null)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800/60 transition-colors shrink-0 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
