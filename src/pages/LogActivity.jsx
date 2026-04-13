import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Clock, 
  Tag, 
  MessageSquare, 
  Zap, 
  Calendar,
  Save,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Target,
  Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';
import activityService from '../services/activityService';

const LogActivity = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    taskName: '',
    category: 'work',
    timeSpentMin: 30,
    expectedTimeMin: 30,
    stressLevel: 5,
    notes: '',
    loggedAt: new Date().toISOString().slice(0, 16)
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    if (name === 'timeSpentMin' || name === 'expectedTimeMin' || name === 'stressLevel') {
      processedValue = value === '' ? '' : Number(value);
    }

    setFormData({ 
      ...formData, 
      [name]: processedValue 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await activityService.create(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to save activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 font-sans relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cyan-500/[0.04] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/[0.03] rounded-full blur-[100px]"></div>
      </div>

      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20 relative z-10">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 font-bold text-sm mb-10 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="glass-card rounded-2xl overflow-hidden flex flex-col md:flex-row">
          {/* Left Side - Info/Tips */}
          <div className="w-full md:w-1/3 bg-gradient-to-br from-navy-700 to-navy-800 p-10 text-white relative overflow-hidden border-r border-white/[0.06]">
             <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -mr-10 -mt-10 blur-[60px]"></div>
             
             <div className="relative z-10">
               <div className="inline-flex bg-white/[0.08] border border-white/[0.08] p-3 rounded-2xl mb-6">
                 <Zap className="text-cyan-400 w-6 h-6" />
               </div>
               <h2 className="text-2xl font-extrabold mb-4 leading-tight text-white">Identify Your Mismatches</h2>
               <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                 Logging your perceived stress vs actual time spent helps STMA predict your future energy levels and prevent burnout.
               </p>
               
               <div className="space-y-6">
                 <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 border border-white/[0.08]">
                     <Target size={14} className="text-cyan-400" />
                   </div>
                   <p className="text-xs font-medium text-slate-500 leading-snug">Be honest with your stress level (1-10). Low stress doesn't always mean high performance.</p>
                 </div>
                 <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 border border-white/[0.08]">
                     <Sparkles size={14} className="text-violet-400" />
                   </div>
                   <p className="text-xs font-medium text-slate-500 leading-snug">Categorizing your work helps us find which areas of your life drain you the most.</p>
                 </div>
               </div>
             </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-2/3 p-10 lg:p-12">
            <h1 className="text-2xl font-extrabold text-white mb-8">Log Activity</h1>

            {error && (
              <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm font-semibold">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Task Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">What did you do?</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                    <Activity size={20} />
                  </div>
                  <input
                    type="text"
                    name="taskName"
                    required
                    placeholder="E.g. Project presentation, Deep work..."
                    className="w-full pl-12 pr-4 py-4 glass-input rounded-xl font-medium"
                    value={formData.taskName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Category & Time Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Category</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                      <Tag size={18} />
                    </div>
                    <select
                      name="category"
                      className="w-full pl-12 pr-4 py-4 glass-input rounded-xl font-bold appearance-none cursor-pointer"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="work" className="bg-slate-900 text-white">Work</option>
                      <option value="personal" className="bg-slate-900 text-white">Personal</option>
                      <option value="health" className="bg-slate-900 text-white">Health</option>
                      <option value="learning" className="bg-slate-900 text-white">Learning</option>
                      <option value="social" className="bg-slate-900 text-white">Social</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Log Time</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                      <Calendar size={18} />
                    </div>
                    <input
                      type="datetime-local"
                      name="loggedAt"
                      className="w-full pl-12 pr-4 py-4 glass-input rounded-xl font-medium [color-scheme:dark]"
                      value={formData.loggedAt}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Durations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Actual Time (min)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                      <Clock size={18} />
                    </div>
                    <input
                      type="number"
                      name="timeSpentMin"
                      min="1"
                      className="w-full pl-12 pr-4 py-4 glass-input rounded-xl font-medium"
                      value={formData.timeSpentMin}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Expected Time (min)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                      <Clock size={18} />
                    </div>
                    <input
                      type="number"
                      name="expectedTimeMin"
                      min="1"
                      className="w-full pl-12 pr-4 py-4 glass-input rounded-xl font-medium"
                      value={formData.expectedTimeMin}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Stress Level Slider */}
              <div className="space-y-6">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Perceived Stress Level</label>
                  <span className={`px-4 py-1 rounded-full text-sm font-extrabold ${
                    formData.stressLevel > 8 ? 'bg-rose-500/15 text-rose-400' : 
                    formData.stressLevel > 5 ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'
                  }`}>
                    {formData.stressLevel} / 10
                  </span>
                </div>
                <div className="relative px-2">
                   <input
                    type="range"
                    name="stressLevel"
                    min="1"
                    max="10"
                    step="1"
                    className="w-full h-2 bg-white/[0.06] rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    value={formData.stressLevel}
                    onChange={handleChange}
                  />
                  <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-600 uppercase">
                    <span>Calm (1)</span>
                    <span>Moderate (5)</span>
                    <span>Extreme (10)</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Quick Notes (Optional)</label>
                <div className="relative group">
                  <div className="absolute top-4 left-4 pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                    <MessageSquare size={18} />
                  </div>
                  <textarea
                    name="notes"
                    rows="3"
                    placeholder="Any specific triggers or context?"
                    className="w-full pl-12 pr-4 py-4 glass-input rounded-xl font-medium resize-none"
                    value={formData.notes}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 btn-accent disabled:opacity-50 rounded-xl text-xl flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Save size={20} />
                    Log Activity
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LogActivity;
