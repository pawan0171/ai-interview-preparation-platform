import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import InterviewSetup from './components/InterviewSetup';
import InterviewSession from './components/InterviewSession';
import InterviewEvaluation from './components/InterviewEvaluation';
import HistoryList from './components/HistoryList';
import HistoryDetail from './components/HistoryDetail';
import ResumeChecker from './components/ResumeChecker';
import ResumeReportView from './components/ResumeReportView';
import Leaderboard from './components/Leaderboard';
import DailyChallenge from './components/DailyChallenge';
import Roadmap from './components/Roadmap';
import CompanyInterviews from './components/CompanyInterviews';
import AdminPanel from './components/AdminPanel';

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, []);

  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="min-h-screen bg-[#0b0f19] text-gray-100 selection:bg-indigo-500 selection:text-white">
            <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company-interviews"
              element={
                <ProtectedRoute>
                  <CompanyInterviews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview-setup"
              element={
                <ProtectedRoute>
                  <InterviewSetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview-session"
              element={
                <ProtectedRoute>
                  <InterviewSession />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview-evaluation"
              element={
                <ProtectedRoute>
                  <InterviewEvaluation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history/:id"
              element={
                <ProtectedRoute>
                  <HistoryDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume-checker"
              element={
                <ProtectedRoute>
                  <ResumeChecker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume-report/:id"
              element={
                <ProtectedRoute>
                  <ResumeReportView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/daily-challenge"
              element={
                <ProtectedRoute>
                  <DailyChallenge />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roadmap"
              element={
                <ProtectedRoute>
                  <Roadmap />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </SocketProvider>
  </AuthProvider>
);
}

export default App;
