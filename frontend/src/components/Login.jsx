import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center pt-20 px-6">
      {/* Decorative Orbs */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl -z-10 animate-pulse-glow"></div>

      <div className="w-full max-w-md glass-panel p-8 md:p-10 rounded-2xl relative shadow-xl border border-gray-800">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-sm text-gray-400 mt-2">Sign in to continue practicing for your interview.</p>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-800/40 text-red-300 p-3 rounded-lg flex items-center gap-2 mb-6 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-950/60 border border-gray-800 hover:border-gray-700 focus:border-indigo-500 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 text-sm focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-950/60 border border-gray-800 hover:border-gray-700 focus:border-indigo-500 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 text-sm focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-indigo-600/20 hover:scale-[1.01] disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Verifying Account...' : 'Sign In'}
            {!isSubmitting && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold underline transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
