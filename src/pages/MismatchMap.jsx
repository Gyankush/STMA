import React, { useState, useEffect } from 'react';
import { Target, AlertCircle, Loader2, Info } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell } from 'recharts';
import Navbar from '../components/Navbar';
import analyticsService from '../services/analyticsService';

const MismatchMap = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMismatch = async () => {
      try {
        const response = await analyticsService.getMismatch(30);
        const mismatchesList = response.activities || [];
        const formattedData = mismatchesList.map(item => {
          const degree = item.expected_time_min > 0 
            ? item.time_spent_min / item.expected_time_min 
            : 1.0;
          return {
            ...item,
            mismatch_degree: degree,
            mismatch_score: degree
          };
        });
        setData(formattedData);
      } catch (err) {
        setError(err.message || 'Failed to load mismatch analysis.');
      } finally {
        setLoading(false);
      }
    };

    fetchMismatch();
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-4 rounded-xl border border-white/10 z-50">
          <p className="font-extrabold text-white mb-1">{data.task_name}</p>
          <div className="space-y-1 mt-3">
            <p className="text-sm font-bold text-slate-300"><span className="text-slate-500">Stress Level: </span>{data.stress_level}/10</p>
            <p className="text-sm font-bold text-slate-300"><span className="text-slate-500">Expected Time: </span>{data.expected_time_min}m</p>
            <p className="text-sm font-bold text-cyan-400"><span className="text-slate-500 shrink-0">Actual Time: </span>{data.time_spent_min}m</p>
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
             <span className="text-xs font-bold text-slate-500 uppercase">Degree</span>
             <span className="text-sm font-extrabold text-rose-400">{Number(data.mismatch_degree).toFixed(2)}x</span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center">
        <Navbar />
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full animate-pulse-slow"></div>
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4 relative z-10" />
        </div>
        <p className="text-slate-400 font-bold animate-pulse mt-4">Analyzing Mismatches...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 font-sans pb-20 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-rose-500/[0.03] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-amber-500/[0.03] rounded-full blur-[100px]"></div>
      </div>

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 relative z-10">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 mb-6 border border-rose-500/20 shadow-lg shadow-rose-500/10">
            <Target size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Time-Stress Mismatch</h1>
          <p className="text-slate-400 font-medium text-lg leading-relaxed">
            Spot when a task takes far longer than expected while pushing your stress levels high. Values outside the diagonal represent cognitive or physical friction.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 font-semibold max-w-2xl mx-auto">
            <AlertCircle size={24} />
            <span>{error}</span>
          </div>
        )}

        <div className="glass-card rounded-2xl p-6 lg:p-12">
          <div className="flex flex-col md:flex-row items-center gap-4 bg-white/[0.03] p-6 rounded-xl mb-8 border border-white/[0.06]">
            <Info size={24} className="text-cyan-400 shrink-0" />
            <p className="text-sm font-medium text-slate-400">
              <strong className="text-slate-200">How to read this graph:</strong> The higher an item is on the Y-Axis, the more stress it generated. The further right it is, the longer it took than expected. Large red circles indicate severe mismatches that lead to burnout.
            </p>
          </div>

          <div className="h-[600px] w-full">
            {data.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    type="number" 
                    dataKey="expected_time_min" 
                    name="Expected Time" 
                    unit="m" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748B', fontWeight: 600}} 
                    label={{ value: "Expected Time (min)", position: "insideBottom", offset: -10, fontWeight: "bold", fill: "#475569" }} 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="stress_level" 
                    name="Stress Level" 
                    domain={[0, 10]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748B', fontWeight: 600}} 
                    label={{ value: "Stress Level (1-10)", angle: -90, position: "insideLeft", fontWeight: "bold", fill: "#475569" }}
                  />
                  <ZAxis type="number" dataKey="mismatch_score" range={[100, 1000]} name="Mismatch" />
                  <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.1)' }} />
                  
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold', color: '#94A3B8' }} />
                  <Scatter name="Activities" data={data}>
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.mismatch_degree > 1.5 ? '#FB7185' : entry.mismatch_degree > 1.2 ? '#FBBF24' : '#34D399'} 
                        fillOpacity={0.7}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
               <div className="w-full h-full flex flex-col items-center justify-center bg-white/[0.02] rounded-2xl border-2 border-dashed border-white/[0.06]">
                <Target className="w-16 h-16 text-slate-700 mb-4" />
                <p className="text-slate-400 font-bold text-lg">Not enough data to map mismatches.</p>
                <p className="text-slate-500 mt-2 text-sm font-medium">Log more activities with varying expected vs actual times to see results.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MismatchMap;
