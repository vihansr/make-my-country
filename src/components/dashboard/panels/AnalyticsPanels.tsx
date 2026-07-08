'use client';

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, AreaChart, Area } from 'recharts';
import { InitialNationStats } from '@/lib/data/countries';
import { TrendingUp, Activity, Shield, Heart } from 'lucide-react';

interface AnalyticsPanelsProps {
  stats: InitialNationStats;
  historicalData?: { turn: string; gdp: number; approval: number; stability: number; readiness: number }[];
}

export const AnalyticsPanels: React.FC<AnalyticsPanelsProps> = ({ stats, historicalData }) => {
  // Generate simulated trend data if historicalData is minimal
  const chartData = historicalData && historicalData.length > 1 ? historicalData : [
    { turn: 'Q1 Base', gdp: Math.round(stats.economy.gdp * 0.94), approval: Math.round(stats.politics.approvalRating * 0.95), stability: Math.round(stats.politics.stability * 0.96), readiness: Math.round(stats.military.readiness * 0.95) },
    { turn: 'Q2', gdp: Math.round(stats.economy.gdp * 0.97), approval: Math.round(stats.politics.approvalRating * 0.98), stability: Math.round(stats.politics.stability * 0.98), readiness: Math.round(stats.military.readiness * 0.98) },
    { turn: 'Current Q', gdp: Math.round(stats.economy.gdp), approval: Math.round(stats.politics.approvalRating), stability: Math.round(stats.politics.stability), readiness: Math.round(stats.military.readiness) },
  ];

  const radarData = [
    { metric: 'Economy', val: Math.min(100, Math.round(stats.economy.currencyStrength)) },
    { metric: 'Society', val: Math.min(100, Math.round(stats.society.happiness)) },
    { metric: 'Approval', val: Math.min(100, Math.round(stats.politics.approvalRating)) },
    { metric: 'Stability', val: Math.min(100, Math.round(stats.politics.stability)) },
    { metric: 'Defense', val: Math.min(100, Math.round(stats.military.readiness)) },
    { metric: 'Eco Health', val: Math.min(100, Math.round(100 - stats.environment.pollution)) },
  ];

  const factionBarData = stats.factions.map((f) => ({
    name: f.name.split(' ')[0],
    Support: Math.round(f.support),
    Influence: Math.round(f.influence),
  }));

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">National Telemetry & Systems Analytics</h2>
          <p className="text-xs text-slate-400">Deep mathematical modeling of state capacity, faction influence, and historical trajectories.</p>
        </div>
        <span className="text-xs font-mono text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-800/60">
          LIVE RECHARTS TELEMETRY
        </span>
      </div>

      {/* Top 2 Charts: GDP/Trend & State Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: GDP & Stability Area Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl glass-panel border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase font-mono">Macroeconomic & Stability Trajectory</h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
                GDP ($B)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                Stability (%)
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGdp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorStab" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="turn" stroke="#64748b" fontSize={11} />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f1527', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="gdp" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorGdp)" />
                <Area yAxisId="right" type="monotone" dataKey="stability" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorStab)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 5 Cols: Multi-Variable Radar Chart */}
        <div className="lg:col-span-5 p-6 rounded-3xl glass-panel border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-violet-400" />
            <h3 className="text-sm font-bold text-white uppercase font-mono">National Capacity Radar</h3>
          </div>

          <div className="h-[280px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
                <Radar name="National Score" dataKey="val" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.4} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f1527', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Faction Influence vs Support Bar Chart */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono">Faction Support vs Political Influence</h3>
            <p className="text-xs text-slate-400">Comparing public sentiment against institutional legislative leverage.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
              Support (%)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
              Influence (%)
            </span>
          </div>
        </div>

        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={factionBarData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f1527', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="Support" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Influence" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
