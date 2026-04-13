import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import analyticsService from '../services/analyticsService';

const StressLag = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStressLag = async () => {
      try {
        const response = await analyticsService.getStressLag(7);
        setData(response.lag_chains || []);
      } catch (err) {
        setError(err.message || 'Failed to load stress lag analysis.');
      } finally {
        setLoading(false);
      }
    };

    fetchStressLag();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center">
        <Navbar />
        <div className="relative">
          <div className="absolute inset-0 bg-violet-500/20 blur-2xl rounded-full animate-pulse-slow"></div>
          <Loader2 className="w-12 h-12 text-violet-400 animate-spin mb-4 relative z-10" />
        </div>
        <p className="text-slate-400 font-bold animate-pulse mt-4">Detecting Stress Lag Patterns...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 font-sans pb-20 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-violet-500/[0.04] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/[0.03] rounded-full blur-[100px]"></div>
      </div>

      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-32 relative z-10">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-violet-400 text-sm font-bold mb-6 border border-violet-500/20">
            <Activity size={16} />
            <span>Carry-over Analysis</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Stress Lag Chains</h1>
          <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-3xl">
            Stress doesn't always dissipate immediately. These chains show instances where a high-stress activity caused subsequent activities to be more stressful and take longer than expected.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 font-semibold">
            <AlertCircle size={24} />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-8">
          {data.length > 0 ? (
            data.map((chain, index) => (
              <div key={index} className="glass-card rounded-2xl p-8 mb-8">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-6 mb-6">
                  <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-violet-500 shadow-lg shadow-violet-500/30"></span>
                    Detected Chain {index + 1}
                  </h3>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {chain.length} Events Linked
                  </span>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-stretch overflow-x-auto pb-4 pt-2">
                  {chain.map((activity, i) => (
                    <React.Fragment key={activity.id}>
                      <div className={`p-5 rounded-xl border flex flex-col justify-between shrink-0 min-w-[200px] md:min-w-[220px] max-w-full relative transition-all hover:scale-[1.02] ${
                        i === 0 
                          ? 'bg-rose-500/10 border-rose-500/20' 
                          : 'bg-white/[0.03] border-white/[0.06]'
                      }`}>
                        {i === 0 && (
                          <div className="absolute -top-3 left-4 bg-rose-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg shadow-rose-500/30 uppercase tracking-wider">
                            Trigger Event
                          </div>
                        )}
                        <h4 className="font-bold text-slate-200 mb-4">{activity.task_name}</h4>
                        <div className="flex justify-between items-center text-sm font-medium mt-auto">
                           <span className={`${i===0 ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>Stress: {activity.stress_level}/10</span>
                           <span className="text-slate-500">{activity.time_spent_min}m</span>
                        </div>
                      </div>
                      
                      {i < chain.length - 1 && (
                        <div className="text-slate-600 md:rotate-0 rotate-90 my-2 md:my-0 flex-shrink-0 flex items-center justify-center">
                          <ArrowRight size={24} />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card rounded-2xl p-12 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
                <Activity className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-extrabold text-white mb-2">No Stress Lag Detected</h3>
              <p className="text-slate-400 font-medium max-w-md">
                You are recovering well between activities! We haven't found any significant stress carrying over from one task to the next in the last 7 days.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StressLag;
