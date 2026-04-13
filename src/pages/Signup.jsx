import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, AlertCircle, Loader2, User, Target, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({ 
    username: '', 
    displayName: '', 
    email: '', 
    password: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await register(formData.username, formData.email, formData.password, formData.displayName);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans flex flex-col md:flex-row bg-navy-950">
      {/* Left Side - Info */}
      <div className="w-full md:w-5/12 bg-gradient-to-br from-navy-800 to-navy-900 p-10 text-white relative overflow-hidden flex flex-col justify-center border-r border-white/[0.05]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/[0.08] rounded-full -mr-20 -mt-20 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/[0.08] rounded-full -ml-20 -mb-20 blur-[100px]"></div>
        
        <div className="relative z-10 max-w-sm mx-auto w-full">
          <Link to="/" className="flex items-center gap-2.5 mb-16 cursor-pointer">
            <Activity className="text-cyan-400 w-8 h-8" />
            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">STMA</span>
          </Link>

          <h2 className="text-4xl font-extrabold mb-6 leading-tight text-white">Master Your Stress Cycles</h2>
          <p className="text-slate-400 text-lg font-medium leading-relaxed mb-12">
            Join the platform that analyzes your physiological response to time and workload. Predict your burnout before it happens.
          </p>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0 border border-white/[0.08]">
                <Target size={20} className="text-cyan-400" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Time-Stress Mismatch</h4>
                <p className="text-sm font-medium text-slate-500">See exactly when high effort doesn't align with actual time spent.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0 border border-white/[0.08]">
                <Zap size={20} className="text-amber-400" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Stress Lag Prediction</h4>
                <p className="text-sm font-medium text-slate-500">Anticipate exhaustion hours after high-intensity tasks complete.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-7/12 flex items-center justify-center p-6 md:p-12 relative">
        <div className="absolute top-20 right-20 w-[300px] h-[300px] bg-cyan-500/[0.04] rounded-full blur-[100px]"></div>
        
        <div className="w-full max-w-md glass-card p-10 rounded-2xl relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2">Create Account</h1>
            <p className="text-slate-400 font-medium">Start optimizing your workflow today.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm font-semibold">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="username"
                    required
                    placeholder="johndoe"
                    className="w-full pl-11 pr-4 py-3.5 glass-input rounded-xl font-medium text-sm"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Display Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="displayName"
                    required
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3.5 glass-input rounded-xl font-medium text-sm"
                    value={formData.displayName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3.5 glass-input rounded-xl font-medium text-sm"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 glass-input rounded-xl font-medium text-sm"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-6 btn-accent disabled:opacity-50 rounded-xl text-lg flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
