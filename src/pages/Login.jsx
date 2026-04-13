import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-slate-200 bg-navy-950 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-cyan-500/[0.06] rounded-full blur-[120px]"></div>
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-indigo-500/[0.05] rounded-full blur-[120px]"></div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-10">
            <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
              <div className="bg-gradient-to-br from-cyan-400 to-indigo-500 p-3 rounded-2xl group-hover:rotate-12 transition-transform shadow-lg shadow-cyan-500/20">
                <Activity className="text-white w-8 h-8" />
              </div>
              <span className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">STMA</span>
            </Link>
          </div>

          <div className="glass-card p-10 rounded-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-white mb-2">Welcome Back</h1>
              <p className="text-slate-400 font-medium">Log your activities and track your stress.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm font-semibold">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-4 glass-input rounded-xl font-medium"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 glass-input rounded-xl font-medium"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-4 btn-accent disabled:opacity-50 rounded-xl text-lg flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Log In'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-500 font-medium">
                Don't have an account?{' '}
                <Link to="/signup" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
