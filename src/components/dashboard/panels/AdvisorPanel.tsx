'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, DollarSign, ShieldAlert, Globe, Leaf, Sparkles, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AdvisorReport, AdvisorReportsResponse } from '@/lib/ai/groq';

interface AdvisorPanelProps {
  countryName: string;
  advisorsJson: string;
}

export const AdvisorPanel: React.FC<AdvisorPanelProps> = ({ countryName, advisorsJson }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'finance' | 'defense' | 'foreign' | 'environment'>('all');

  let reports: AdvisorReportsResponse | null = null;
  try {
    reports = JSON.parse(advisorsJson);
  } catch (err) {
    console.error('Failed to parse advisor reports:', err);
  }

  const advisorList = reports ? [
    { key: 'finance', type: 'Economic Intelligence', icon: <DollarSign className="w-5 h-5 text-cyan-400" />, data: reports.finance, border: 'border-cyan-500/40', bg: 'bg-cyan-500/10' },
    { key: 'defense', type: 'Defense & Strategic Command', icon: <ShieldAlert className="w-5 h-5 text-rose-400" />, data: reports.defense, border: 'border-rose-500/40', bg: 'bg-rose-500/10' },
    { key: 'foreign', type: 'Diplomacy & Trade Corps', icon: <Globe className="w-5 h-5 text-violet-400" />, data: reports.foreign, border: 'border-violet-500/40', bg: 'bg-violet-500/10' },
    { key: 'environment', type: 'Environmental & Energy Security', icon: <Leaf className="w-5 h-5 text-emerald-400" />, data: reports.environment, border: 'border-emerald-500/40', bg: 'bg-emerald-500/10' },
  ] : [];

  const filteredAdvisors = activeTab === 'all' ? advisorList : advisorList.filter((a) => a.key === activeTab);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Optimal':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> OPTIMAL</span>;
      case 'Stable':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">STABLE</span>;
      case 'Caution':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> CAUTION</span>;
      case 'Critical':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse flex items-center gap-1"><AlertCircle className="w-3 h-3" /> CRITICAL</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-800 text-slate-300">STABLE</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <Cpu className="w-4 h-4 animate-pulse" />
            <span>Groq AI Neural Council • Real-Time Telemetry</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">AI Advisory Cabinet & Strategic Recommendations</h2>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 font-mono text-xs">
          <button onClick={() => setActiveTab('all')} className={`px-3 py-1 rounded-lg transition-all ${activeTab === 'all' ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'text-slate-400 hover:text-white'}`}>All</button>
          <button onClick={() => setActiveTab('finance')} className={`px-3 py-1 rounded-lg transition-all ${activeTab === 'finance' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}>Finance</button>
          <button onClick={() => setActiveTab('defense')} className={`px-3 py-1 rounded-lg transition-all ${activeTab === 'defense' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'}`}>Defense</button>
          <button onClick={() => setActiveTab('foreign')} className={`px-3 py-1 rounded-lg transition-all ${activeTab === 'foreign' ? 'bg-violet-500 text-white font-bold' : 'text-slate-400 hover:text-white'}`}>Foreign</button>
          <button onClick={() => setActiveTab('environment')} className={`px-3 py-1 rounded-lg transition-all ${activeTab === 'environment' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}>Eco</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAdvisors.map((advisor) => (
          <motion.div
            key={advisor.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-6 rounded-3xl glass-panel border ${advisor.border} flex flex-col justify-between shadow-lg relative overflow-hidden group hover:shadow-2xl transition-all`}
          >
            <div className={`absolute top-0 right-0 w-48 h-48 ${advisor.bg} rounded-full blur-3xl pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity`} />

            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-inner">
                    {advisor.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {advisor.data?.name || `Advisor (${advisor.type})`}
                    </h3>
                    <div className="text-xs font-mono text-slate-400">{advisor.data?.role || advisor.type}</div>
                  </div>
                </div>
                {getStatusBadge(advisor.data?.status)}
              </div>

              {/* Assessment Summary */}
              <div className="mb-6">
                <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  Quarterly Situational Analysis
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-sans bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
                  "{advisor.data?.summary || 'Telemetry normal. Continuing real-time monitoring of ministry indicators.'}"
                </p>
              </div>

              {/* Recommendation */}
              <div>
                <h4 className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Strategic Decree Recommendation
                </h4>
                <p className="text-sm font-semibold text-white leading-relaxed bg-gradient-to-r from-slate-900/90 to-cyan-950/40 p-4 rounded-2xl border border-cyan-500/30 shadow-inner">
                  "{advisor.data?.recommendation || 'No immediate emergency overrides required this quarter.'}"
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>GROQ LLAMA-3.3-70B INFERENCE</span>
              <span className="text-cyan-400">TELEMETRY SYNCED</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
