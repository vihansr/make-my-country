'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, TrendingUp, Shield, Heart, Zap, Award, Users, AlertTriangle, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { InitialNationStats } from '@/lib/data/countries';

interface OverviewPanelProps {
  countryName: string;
  leaderRole: string;
  stats: InitialNationStats;
  onOpenDecisions: () => void;
}

export const OverviewPanel: React.FC<OverviewPanelProps> = ({ countryName, leaderRole, stats, onOpenDecisions }) => {
  const getStatusColor = (val: number, reverse = false) => {
    const isGood = reverse ? val < 40 : val > 65;
    const isBad = reverse ? val > 70 : val < 35;
    if (isGood) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (isBad) return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Banner: Country Greeting & Immediate Action Call */}
      <div className="p-6 rounded-3xl glass-panel border border-cyan-500/40 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Sovereign Executive Office • {leaderRole}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Republic of {countryName}
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            All ministry telemetry streams are live. National approval stands at <strong className="text-emerald-400">{Math.round(stats.politics.approvalRating)}%</strong> with civic stability index tracking at <strong className="text-cyan-400">{Math.round(stats.politics.stability)}</strong>.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenDecisions}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] whitespace-nowrap z-10"
        >
          <Zap className="w-4 h-4 fill-black" />
          <span>Issue Strategic Decrees</span>
        </motion.button>
      </div>

      {/* Grid: Interactive World Map & Vital Systems */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Interactive Geopolitical Grid Map */}
        <div className="lg:col-span-8 p-6 rounded-3xl glass-panel border border-slate-800 flex flex-col justify-between min-h-[380px] relative overflow-hidden">
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                Global Strategic Theater & Sphere of Influence
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400">
              SATELLITE LINK: ACTIVE
            </span>
          </div>

          {/* Stylized World Map Visuals */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[85%] h-[75%] border border-cyan-500/20 rounded-3xl relative flex items-center justify-center bg-slate-950/40">
              {/* Radar sweeps and pulsing nodes */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute w-72 h-72 border border-dashed border-cyan-500/30 rounded-full opacity-60"
              />
              <div className="absolute w-44 h-44 border border-dotted border-emerald-500/30 rounded-full animate-pulse" />

              {/* Simulated Map Nodes */}
              <div className="absolute top-1/3 left-1/4 flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/90 border border-cyan-500/50 text-[10px] font-mono text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>{countryName.toUpperCase()} (HOME COMM)</span>
              </div>

              <div className="absolute bottom-1/3 right-1/4 flex items-center gap-1 px-2 py-1 rounded bg-slate-900/80 border border-slate-700 text-[9px] font-mono text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>ALLIED SECTOR 7</span>
              </div>

              <div className="absolute top-1/4 right-1/3 flex items-center gap-1 px-2 py-1 rounded bg-slate-900/80 border border-rose-500/40 text-[9px] font-mono text-rose-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>DISPUTED CORRIDOR</span>
              </div>
            </div>
          </div>

          {/* Bottom telemetry overlay */}
          <div className="z-10 grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 bg-slate-900/50 p-3 rounded-2xl backdrop-blur-md">
            <div>
              <div className="text-[10px] font-mono text-slate-400">FOREIGN INVESTMENT</div>
              <div className="text-sm font-bold text-cyan-400 font-mono">${Math.round(stats.economy.foreignInvestment)}B</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400">CURRENCY STRENGTH</div>
              <div className="text-sm font-bold text-emerald-400 font-mono">{Math.round(stats.economy.currencyStrength)} / 100</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400">NUCLEAR CAPABILITY</div>
              <div className="text-sm font-bold text-amber-400 font-mono">{Math.round(stats.military.nuclearCapability)} / 100</div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Vital National Pillars */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest px-1">
            Core National Telemetry
          </h3>

          {/* Economy Pillar */}
          <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Economic Output</div>
                <div className="text-[11px] text-slate-400">Inflation: {stats.economy.inflation.toFixed(1)}%</div>
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-base font-bold text-cyan-400">${Math.round(stats.economy.gdp)}B</div>
              <div className="text-[10px] text-emerald-400 flex items-center justify-end gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                <span>+4.2%</span>
              </div>
            </div>
          </div>

          {/* Society Pillar */}
          <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Civic Society</div>
                <div className="text-[11px] text-slate-400">Healthcare: {Math.round(stats.society.healthcare)}%</div>
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-base font-bold text-emerald-400">{Math.round(stats.society.happiness)} / 100</div>
              <div className="text-[10px] text-slate-400">Happiness Index</div>
            </div>
          </div>

          {/* Military Pillar */}
          <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Defense Command</div>
                <div className="text-[11px] text-slate-400">Personnel: {stats.military.manpower}K</div>
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-base font-bold text-rose-400">{Math.round(stats.military.readiness)}%</div>
              <div className="text-[10px] text-slate-400">Readiness Score</div>
            </div>
          </div>

          {/* Environment Pillar */}
          <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Ecological Health</div>
                <div className="text-[11px] text-slate-400">Pollution: {Math.round(stats.environment.pollution)}%</div>
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-base font-bold text-amber-400">{Math.round(stats.environment.energySecurity)}%</div>
              <div className="text-[10px] text-slate-400">Energy Security</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Factions Influence & Support */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Internal Political Faction Telemetry</span>
          </h3>
          <span className="text-xs font-mono text-slate-500">POLARIZATION: <strong className="text-amber-400">{Math.round(stats.politics.polarization)}%</strong></span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.factions.map((faction, idx) => {
            const supportClass = getStatusColor(faction.support);
            return (
              <div key={idx} className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white truncate">{faction.name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${supportClass}`}>
                    {faction.support > 65 ? 'LOYAL' : faction.support < 35 ? 'UNREST' : 'NEUTRAL'}
                  </span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                      <span>Support Level</span>
                      <span className="font-bold text-slate-200">{Math.round(faction.support)}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${clamp(faction.support, 0, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                      <span>Political Influence</span>
                      <span className="font-bold text-cyan-400">{Math.round(faction.influence)}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 transition-all duration-500"
                        style={{ width: `${clamp(faction.influence, 0, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}
