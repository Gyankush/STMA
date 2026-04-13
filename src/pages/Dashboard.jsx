import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Clock, Map, Zap, Plus, AlertCircle, Loader2, BarChart3, Brain, Sparkles, Target, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import Navbar from '../components/Navbar';
import analyticsService from '../services/analyticsService';
import activityService from '../services/activityService';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashboardData, activitiesData] = await Promise.all([
          analyticsService.getDashboard(7),
          activityService.list({ limit: 5 })
        ]);
        setData({
          ...dashboardData,
          recent_activities: activitiesData?.activities || []
        });
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    const fetchAIInsights = async () => {
      try {
        const insights = await analyticsService.getAIInsights();
        setAiInsights(insights);
      } catch (err) {
        console.error('AI Insights error:', err);
      } finally {
        setAiLoading(false);
      }
    };

    fetchDashboard();
    fetchAIInsights();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center">
        <Navbar />
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full animate-pulse-slow"></div>
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4 relative z-10" />
        </div>
        <p className="text-slate-400 font-bold animate-pulse mt-4">Loading Analytics...</p>
      </div>
    );
  }

  const summary = { 
    total_activities: data?.total_activities || 0, 
    average_stress: data?.avg_score || 0, 
    total_time_spent_min: data?.total_time_min || 0 
  };
  const chartData = data?.stress_trend || [];
  const recentActivities = data?.recent_activities || [];

  const kpiCards = [
    {
      title: 'Total Activities',
      value: summary.total_activities,
      icon: <Activity size={24} />,
      gradient: 'from-cyan-500/20 to-cyan-500/5',
      iconColor: 'text-cyan-400',
      glowColor: 'shadow-cyan-500/10',
    },
    {
      title: 'Avg Stress Level',
      value: `${Number(summary.average_stress).toFixed(1)}`,
      suffix: '/100',
      icon: <Zap size={24} />,
      gradient: 'from-amber-500/20 to-amber-500/5',
      iconColor: 'text-amber-400',
      glowColor: 'shadow-amber-500/10',
    },
    {
      title: 'Actual Time Logged',
      value: `${Math.floor(summary.total_time_spent_min / 60)}h ${summary.total_time_spent_min % 60}m`,
      icon: <Clock size={24} />,
      gradient: 'from-emerald-500/20 to-emerald-500/5',
      iconColor: 'text-emerald-400',
      glowColor: 'shadow-emerald-500/10',
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card rounded-xl p-4 border border-white/10">
          <p className="text-sm font-bold text-slate-300 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-navy-950 font-sans pb-20 relative overflow-hidden">
      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/[0.04] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/[0.04] rounded-full blur-[120px]"></div>
      </div>

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-slate-400 font-medium">Your physiological footprint over the last 7 days.</p>
          </div>
          <button 
            onClick={() => navigate('/log-activity')}
            className="btn-accent px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
          >
            <Plus size={20} />
            Log Activity
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 glass-card rounded-2xl flex items-center gap-3 text-rose-400 font-semibold border-rose-500/20">
            <AlertCircle size={24} />
            <span>{error}</span>
          </div>
        )}

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {kpiCards.map((card, i) => (
            <div key={i} className="glass-card glass-card-hover rounded-2xl p-8 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 cursor-default">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} ${card.iconColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <h3 className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-1">{card.title}</h3>
              <div className="text-4xl font-extrabold text-white">
                {card.value}
                {card.suffix && <span className="text-lg text-slate-500 font-medium">{card.suffix}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Activity Stream Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Chart Section */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-extrabold text-white">Time & Stress by Day</h2>
            </div>
            
            {chartData.length > 0 ? (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontWeight: 600}} dy={10} />
                    <YAxis yAxisId="left" orientation="left" stroke="#22D3EE" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#64748B'}} />
                    <YAxis yAxisId="right" orientation="right" stroke="#FBBF24" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#64748B'}} domain={[0, 10]} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold', fontSize: '14px', color: '#94A3B8' }} />
                    <Bar yAxisId="left" name="Time Logged (min)" dataKey="total_time" fill="#22D3EE" radius={[6, 6, 0, 0]} barSize={40} fillOpacity={0.85} />
                    <Bar yAxisId="right" name="Avg Stress" dataKey="avg_stress" fill="#FBBF24" radius={[6, 6, 0, 0]} barSize={40} fillOpacity={0.7} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center bg-white/[0.02] rounded-2xl border-2 border-dashed border-white/[0.06]">
                <BarChart3 className="w-12 h-12 text-slate-600 mb-4" />
                <p className="text-slate-500 font-bold">No data for the last 7 days.</p>
                <button onClick={() => navigate('/log-activity')} className="mt-4 text-cyan-400 font-bold text-sm tracking-wide uppercase hover:text-cyan-300 transition-colors">Start Logging</button>
              </div>
            )}
          </div>

          {/* Recent Activities */}
          <div className="glass-card rounded-2xl p-8 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-extrabold text-white">Recent Logs</h2>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all flex justify-between items-center group">
                    <div>
                      <h4 className="font-bold text-slate-200 text-sm">{activity.task_name}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">{activity.category || 'Work'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        activity.stress_level > 7 ? 'bg-rose-500/15 text-rose-400' :
                        activity.stress_level > 4 ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'
                      }`}>
                        Stress: {activity.stress_level}
                      </span>
                      <span className="text-xs font-bold text-slate-500">{activity.time_spent_min}m</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-slate-500 font-medium text-sm">No recent activities.</p>
                </div>
              )}
            </div>
            
            <button onClick={() => navigate('/mismatch-map')} className="w-full mt-6 py-4 bg-white/[0.04] hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 rounded-xl font-bold flex justify-center items-center gap-2 transition-all border border-white/[0.06]">
              <Map size={18} />
              View Mismatch Map
            </button>
          </div>

        </div>

        {/* AI Insights Section */}
        <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/[0.06] rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/[0.04] rounded-full blur-[60px] pointer-events-none"></div>

          <div className="flex items-center gap-3 mb-8 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/10 flex items-center justify-center">
              <Brain className="text-violet-400 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">AI Stress Insights</h2>
              <p className="text-sm text-slate-500 font-medium">Powered by Gemini</p>
            </div>
          </div>

          {aiLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/[0.03] rounded-xl p-6 border border-white/[0.06] animate-pulse">
                  <div className="h-4 bg-white/[0.06] rounded-full w-1/3 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-white/[0.04] rounded-full w-full"></div>
                    <div className="h-3 bg-white/[0.04] rounded-full w-5/6"></div>
                    <div className="h-3 bg-white/[0.04] rounded-full w-4/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : aiInsights ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {/* Stress Triggers */}
              <div className="bg-white/[0.03] rounded-xl p-6 border border-white/[0.06] hover:bg-white/[0.05] transition-all group">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/15 flex items-center justify-center">
                    <Target size={16} className="text-rose-400" />
                  </div>
                  <h3 className="font-bold text-rose-400 text-sm uppercase tracking-wider">Stress Triggers</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed font-medium">{aiInsights.stress_triggers}</p>
              </div>

              {/* Reduction Strategies */}
              <div className="bg-white/[0.03] rounded-xl p-6 border border-white/[0.06] hover:bg-white/[0.05] transition-all group">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <TrendingDown size={16} className="text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-emerald-400 text-sm uppercase tracking-wider">Reduction Plan</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed font-medium">{aiInsights.reduction_strategies}</p>
              </div>

              {/* Optimal Flow */}
              <div className="bg-white/[0.03] rounded-xl p-6 border border-white/[0.06] hover:bg-white/[0.05] transition-all group">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
                    <Sparkles size={16} className="text-violet-400" />
                  </div>
                  <h3 className="font-bold text-violet-400 text-sm uppercase tracking-wider">Flow State Tips</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed font-medium">{aiInsights.optimal_flow}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 relative z-10">
              <p className="text-slate-500 font-medium">Could not load AI insights. Please try again later.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
