'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Shield, Handshake, TrendingUp, AlertTriangle, CheckCircle2, Search, Filter, Send, Sparkles, MessageSquare, Award, Lock, FileText, ChevronRight } from 'lucide-react';

export interface DiplomacyRelationItem {
  id?: string;
  targetCountry: string;
  relationScore: number; // -100 to 100
  status: string; // Allied, Friendly, Neutral, Tense, Hostile
  tradeAgreement: boolean;
  defensePact: boolean;
}

interface DiplomacyPanelProps {
  countryName: string;
  diplomacy: DiplomacyRelationItem[];
  onDraftDecree?: (promptText: string) => void;
}

export const DiplomacyPanel: React.FC<DiplomacyPanelProps> = ({
  countryName,
  diplomacy = [],
  onDraftDecree,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Compute stats
  const stats = useMemo(() => {
    const total = diplomacy.length;
    const allied = diplomacy.filter(d => d.status === 'Allied' || d.relationScore >= 50).length;
    const friendly = diplomacy.filter(d => d.status === 'Friendly' || (d.relationScore >= 20 && d.relationScore < 50)).length;
    const hostile = diplomacy.filter(d => d.status === 'Hostile' || d.relationScore <= -30).length;
    const tradeDeals = diplomacy.filter(d => d.tradeAgreement).length;
    const defensePacts = diplomacy.filter(d => d.defensePact).length;
    return { total, allied, friendly, hostile, tradeDeals, defensePacts };
  }, [diplomacy]);

  // Filter diplomacy items
  const filteredDiplomacy = useMemo(() => {
    return diplomacy.filter(item => {
      const matchesSearch = item.targetCountry.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (selectedStatus === 'All') return true;
      if (selectedStatus === 'Allied') return item.status === 'Allied' || item.relationScore >= 50;
      if (selectedStatus === 'Friendly') return item.status === 'Friendly' || (item.relationScore >= 20 && item.relationScore < 50);
      if (selectedStatus === 'Neutral') return item.status === 'Neutral' || (item.relationScore > -20 && item.relationScore < 20);
      if (selectedStatus === 'Tense/Hostile') return item.status === 'Hostile' || item.status === 'Tense' || item.relationScore <= -20;
      return true;
    });
  }, [diplomacy, searchQuery, selectedStatus]);

  const getStatusColor = (score: number, status: string) => {
    if (status === 'Allied' || score >= 50) {
      return {
        badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
        bar: 'from-emerald-500 to-teal-400',
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/5',
        border: 'border-emerald-500/30 hover:border-emerald-500/60',
      };
    }
    if (status === 'Friendly' || score >= 20) {
      return {
        badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
        bar: 'from-cyan-500 to-blue-400',
        text: 'text-cyan-400',
        bg: 'bg-cyan-500/5',
        border: 'border-cyan-500/30 hover:border-cyan-500/60',
      };
    }
    if (status === 'Hostile' || score <= -40) {
      return {
        badge: 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)] animate-pulse',
        bar: 'from-rose-600 to-red-400',
        text: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/40 hover:border-rose-500/80',
      };
    }
    if (status === 'Tense' || score <= -15) {
      return {
        badge: 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
        bar: 'from-amber-500 to-orange-400',
        text: 'text-amber-400',
        bg: 'bg-amber-500/5',
        border: 'border-amber-500/30 hover:border-amber-500/60',
      };
    }
    return {
      badge: 'bg-slate-800 text-slate-300 border-slate-700',
      bar: 'from-slate-600 to-slate-400',
      text: 'text-slate-300',
      bg: 'bg-slate-900/40',
      border: 'border-slate-800 hover:border-slate-700',
    };
  };

  const handleQuickAction = (target: string, actionType: 'trade' | 'defense' | 'sanction' | 'summit') => {
    if (!onDraftDecree) return;
    let text = '';
    switch (actionType) {
      case 'trade':
        text = `Diplomatic Initiative: Propose a bilateral free trade agreement and technology corridor with ${target} to boost economic foreign investment and currency stability.`;
        break;
      case 'defense':
        text = `Defense & Strategic Treaty: Negotiate a mutual defense pact and joint naval exercises with ${target} to increase military readiness and regional deterrence.`;
        break;
      case 'sanction':
        text = `Sanctions & Containment: Impose targeted economic sanctions and trade restrictions on ${target} in response to regional tensions, signaling strong geopolitical resolve.`;
        break;
      case 'summit':
        text = `State Summit & Aid: Dispatch high-level diplomatic delegation and propose cultural exchange and economic aid package to improve relations with ${target}.`;
        break;
    }
    onDraftDecree(text);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header & Global Posture Banner */}
      <div className="p-6 rounded-3xl glass-panel border border-violet-500/40 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_0_35px_rgba(139,92,246,0.15)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-violet-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-violet-400 uppercase tracking-widest mb-1">
            <Globe className="w-4 h-4 animate-spin" style={{ animationDuration: '20s' }} />
            <span>Ministry of Foreign Affairs • Satellite Telemetry Link</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Global Diplomatic Theater</span>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-violet-950/80 border border-violet-500/50 text-violet-300">
              {stats.total} SOVEREIGN NATIONS TRACKED
            </span>
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Manage bilateral treaties, mutual defense pacts, and trade corridors for the Republic of <strong className="text-white font-semibold">{countryName}</strong>. Issue diplomatic decrees to alter global alliances and geopolitical standing.
          </p>
        </div>

        {/* Quick Summary Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto z-10 font-mono text-xs">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex flex-col items-center justify-center min-w-[85px]">
            <span className="text-emerald-400 font-bold text-lg">{stats.allied}</span>
            <span className="text-[10px] text-slate-400">Allied Powers</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-cyan-500/30 flex flex-col items-center justify-center min-w-[85px]">
            <span className="text-cyan-400 font-bold text-lg">{stats.tradeDeals}</span>
            <span className="text-[10px] text-slate-400">Trade Treaties</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-violet-500/30 flex flex-col items-center justify-center min-w-[85px]">
            <span className="text-violet-400 font-bold text-lg">{stats.defensePacts}</span>
            <span className="text-[10px] text-slate-400">Defense Pacts</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-rose-500/30 flex flex-col items-center justify-center min-w-[85px]">
            <span className="text-rose-400 font-bold text-lg">{stats.hostile}</span>
            <span className="text-[10px] text-slate-400">Hostile / Tense</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search sovereign nations (e.g., China, Germany, Brazil)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-mono text-slate-500 uppercase mr-1 flex items-center gap-1 hidden md:inline-flex">
            <Filter className="w-3.5 h-3.5" />
            <span>Stance:</span>
          </span>
          {['All', 'Allied', 'Friendly', 'Neutral', 'Tense/Hostile'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedStatus(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap font-mono ${
                selectedStatus === tab
                  ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-bold shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Diplomatic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {filteredDiplomacy.map((item, idx) => {
            const styles = getStatusColor(item.relationScore, item.status);
            const normalizedScore = Math.max(-100, Math.min(100, item.relationScore));
            const percentage = ((normalizedScore + 100) / 200) * 100; // Map -100..100 to 0..100%

            return (
              <motion.div
                key={item.id || item.targetCountry || idx}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`p-5 rounded-3xl glass-panel border ${styles.border} ${styles.bg} flex flex-col justify-between shadow-lg relative group transition-all duration-300`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center font-bold text-base text-white shadow-inner font-mono">
                        {item.targetCountry.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight">
                          {item.targetCountry}
                        </h3>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                          Bilateral Relation
                        </span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${styles.badge} uppercase tracking-wider`}>
                      {item.status || (normalizedScore > 30 ? 'Friendly' : normalizedScore < -20 ? 'Tense' : 'Neutral')}
                    </span>
                  </div>

                  {/* Relationship Score Meter */}
                  <div className="mb-4 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                    <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                      <span className="text-slate-400">Diplomatic Warmth Index</span>
                      <span className={`font-bold ${styles.text}`}>
                        {normalizedScore > 0 ? `+${Math.round(normalizedScore)}` : Math.round(normalizedScore)} / 100
                      </span>
                    </div>
                    
                    {/* Visual Bar with Center Zero Mark */}
                    <div className="relative w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                      {/* Zero indicator line in middle */}
                      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-600 z-10" />
                      <div
                        className={`h-full bg-gradient-to-r ${styles.bar} transition-all duration-700 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                      <span>-100 (War/Hostile)</span>
                      <span>0 (Neutral)</span>
                      <span>+100 (Allied)</span>
                    </div>
                  </div>

                  {/* Treaties & Pacts Status */}
                  <div className="grid grid-cols-2 gap-2 mb-5 font-mono text-[11px]">
                    <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                      item.tradeAgreement
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 font-semibold'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-500'
                    }`}>
                      <Handshake className={`w-3.5 h-3.5 flex-shrink-0 ${item.tradeAgreement ? 'text-cyan-400' : 'text-slate-600'}`} />
                      <span className="truncate">{item.tradeAgreement ? 'Trade Accord Active' : 'No Trade Treaty'}</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                      item.defensePact
                        ? 'bg-violet-500/10 border-violet-500/30 text-violet-300 font-semibold'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-500'
                    }`}>
                      <Shield className={`w-3.5 h-3.5 flex-shrink-0 ${item.defensePact ? 'text-violet-400' : 'text-slate-600'}`} />
                      <span className="truncate">{item.defensePact ? 'Defense Pact' : 'No Defense Pact'}</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Diplomatic Decrees Launcher */}
                {onDraftDecree && (
                  <div className="pt-3 border-t border-slate-800/80">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>Execute Diplomatic Initiative:</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => handleQuickAction(item.targetCountry, 'trade')}
                        className="p-2 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 border border-slate-700/80 hover:border-cyan-500/50 text-[11px] font-mono text-slate-300 hover:text-cyan-300 transition-all flex items-center justify-center gap-1"
                        title="Propose Trade & Tech Accord"
                      >
                        <Handshake className="w-3 h-3 text-cyan-400" />
                        <span>Trade Deal</span>
                      </button>

                      <button
                        onClick={() => handleQuickAction(item.targetCountry, 'summit')}
                        className="p-2 rounded-xl bg-slate-900/90 hover:bg-violet-500/20 border border-slate-700/80 hover:border-violet-500/50 text-[11px] font-mono text-slate-300 hover:text-violet-300 transition-all flex items-center justify-center gap-1"
                        title="Dispatch State Delegation"
                      >
                        <MessageSquare className="w-3 h-3 text-violet-400" />
                        <span>Summit & Aid</span>
                      </button>

                      <button
                        onClick={() => handleQuickAction(item.targetCountry, 'defense')}
                        className="p-2 rounded-xl bg-slate-900/90 hover:bg-emerald-500/20 border border-slate-700/80 hover:border-emerald-500/50 text-[11px] font-mono text-slate-300 hover:text-emerald-300 transition-all flex items-center justify-center gap-1"
                        title="Negotiate Mutual Defense Pact"
                      >
                        <Shield className="w-3 h-3 text-emerald-400" />
                        <span>Defense Pact</span>
                      </button>

                      <button
                        onClick={() => handleQuickAction(item.targetCountry, 'sanction')}
                        className="p-2 rounded-xl bg-slate-900/90 hover:bg-rose-500/20 border border-slate-700/80 hover:border-rose-500/50 text-[11px] font-mono text-slate-300 hover:text-rose-300 transition-all flex items-center justify-center gap-1"
                        title="Impose Sanctions / Containment"
                      >
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        <span>Sanctions</span>
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredDiplomacy.length === 0 && (
          <div className="col-span-full p-12 rounded-3xl glass-panel border border-slate-800 text-center text-slate-400 font-mono">
            No sovereign nations matched your search query or posture filter.
          </div>
        )}
      </div>
    </div>
  );
};
