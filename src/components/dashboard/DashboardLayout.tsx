'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Shield, Activity, Cpu, Calendar, Clock, LogOut, Zap, Bell, ChevronRight, Newspaper, Users, BarChart3, History, Award, AlertCircle } from 'lucide-react';
import { OverviewPanel } from './panels/OverviewPanel';
import { AnalyticsPanels } from './panels/AnalyticsPanels';
import { AdvisorPanel } from './panels/AdvisorPanel';
import { TimelinePanel } from './panels/TimelinePanel';
import { DecisionModal } from './DecisionModal';
import { InitialNationStats } from '@/lib/data/countries';

interface DashboardLayoutProps {
  gameSave: any;
  onAdvanceTurn: (selectedPolicyIds: string[], customPrompt?: string) => Promise<void>;
  onExitToMenu: () => void;
  isProcessingTurn: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  gameSave,
  onAdvanceTurn,
  onExitToMenu,
  isProcessingTurn,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'advisors' | 'timeline'>('overview');
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  if (!gameSave || !gameSave.nationState) return null;

  const ns = gameSave.nationState;
  const stats: InitialNationStats = {
    economy: {
      gdp: ns.gdp,
      inflation: ns.inflation,
      unemployment: ns.unemployment,
      debt: ns.debt,
      currencyStrength: ns.currencyStrength,
      foreignInvestment: ns.foreignInvestment,
    },
    society: {
      happiness: ns.happiness,
      literacy: ns.literacy,
      healthcare: ns.healthcare,
      crimeRate: ns.crimeRate,
      inequality: ns.inequality,
    },
    politics: {
      approvalRating: ns.approvalRating,
      corruption: ns.corruption,
      stability: ns.stability,
      polarization: ns.polarization,
    },
    military: {
      readiness: ns.readiness,
      manpower: ns.manpower,
      technology: ns.technology,
      nuclearCapability: ns.nuclearCapability,
    },
    environment: {
      pollution: ns.pollution,
      energySecurity: ns.energySecurity,
      climateRisk: ns.climateRisk,
    },
    factions: gameSave.factions.map((f: any) => ({
      name: f.name,
      support: f.support,
      influence: f.influence,
    })),
  };

  const handleEnactPolicies = async (selectedIds: string[], customPrompt?: string) => {
    setIsDecisionModalOpen(false);
    await onAdvanceTurn(selectedIds, customPrompt);
    const msg = customPrompt ? `AI evaluated executive directive: "${customPrompt.slice(0, 60)}..."` : `Quarterly simulation updated! Enacted ${selectedIds.length} strategic decrees.`;
    setNotification(msg);
    setTimeout(() => setNotification(null), 7000);
  };

  return (
    <div className="min-h-screen w-full bg-grid-pattern text-slate-100 flex flex-col overflow-hidden">
      {/* Top Navigation / Vital Telemetry Bar */}
      <header className="h-16 px-4 md:px-6 border-b border-slate-800 glass-panel flex items-center justify-between z-30 sticky top-0">
        
        {/* Left: Branding & Current Administration */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-cyan-400 animate-spin" style={{ animationDuration: '16s' }} />
            <h1 className="text-lg font-extrabold tracking-tight hidden sm:inline">
              <span className="text-white">Geo</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Polis</span>
            </h1>
          </div>
          <span className="h-5 w-px bg-slate-800 hidden sm:inline" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300">
              {gameSave.countryName}
            </span>
            <span className="text-xs font-mono text-slate-400 hidden md:inline">
              Role: <strong className="text-slate-200">{gameSave.leaderRole}</strong>
            </span>
          </div>
        </div>

        {/* Center: Live Vital Telemetry Tickers */}
        <div className="hidden lg:flex items-center gap-6 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">GDP:</span>
            <span className="font-bold text-cyan-400">${Math.round(stats.economy.gdp)}B</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">APPROVAL:</span>
            <span className="font-bold text-emerald-400">{Math.round(stats.politics.approvalRating)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">STABILITY:</span>
            <span className="font-bold text-violet-400">{Math.round(stats.politics.stability)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">MILITARY:</span>
            <span className="font-bold text-rose-400">{Math.round(stats.military.readiness)}%</span>
          </div>
        </div>

        {/* Right: Turn Counter, Advance Turn Button & Exit */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>YEAR <strong className="text-white">{gameSave.currentYear}</strong> • Q{gameSave.currentTurn}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsDecisionModalOpen(true)}
            disabled={isProcessingTurn}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 fill-black" />
            <span>Issue Decrees / Advance Qtr</span>
          </motion.button>

          <button
            onClick={onExitToMenu}
            title="Exit to Main Menu"
            className="p-2 rounded-xl glass-panel text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body Grid: Left Navigation, Center Workspace, Right Live News / Notifications */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: Navigation Tabs */}
        <aside className="w-16 md:w-64 border-r border-slate-800 glass-panel flex flex-col justify-between py-6 px-2 md:px-4 z-20">
          <div className="space-y-2">
            <div className="hidden md:block text-[11px] font-mono text-slate-500 uppercase tracking-widest px-3 mb-3">
              Command Modules
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all text-sm font-semibold ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-transparent border-l-4 border-cyan-500 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <Globe className="w-5 h-5 flex-shrink-0 text-cyan-400" />
              <span className="hidden md:inline">Strategic Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all text-sm font-semibold ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-transparent border-l-4 border-emerald-500 text-emerald-300 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <BarChart3 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
              <span className="hidden md:inline">Telemetry Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('advisors')}
              className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all text-sm font-semibold ${
                activeTab === 'advisors'
                  ? 'bg-gradient-to-r from-violet-500/20 to-transparent border-l-4 border-violet-500 text-violet-300 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <Cpu className="w-5 h-5 flex-shrink-0 text-violet-400 animate-pulse" />
              <span className="hidden md:inline">AI Advisory Cabinet</span>
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all text-sm font-semibold ${
                activeTab === 'timeline'
                  ? 'bg-gradient-to-r from-amber-500/20 to-transparent border-l-4 border-amber-500 text-amber-300 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <History className="w-5 h-5 flex-shrink-0 text-amber-400" />
              <span className="hidden md:inline">History & Timeline</span>
            </button>
          </div>

          <div className="hidden md:block p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Activity className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
              <span>SYSTEM STATUS: NORMAL</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              All ministries reporting within quarterly drift parameters.
            </p>
          </div>
        </aside>

        {/* Center Main Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-cyan-950/80 to-emerald-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono flex items-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
            >
              <Bell className="w-4 h-4 text-cyan-400 animate-bounce" />
              <span>{notification}</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <OverviewPanel
                  countryName={gameSave.countryName}
                  leaderRole={gameSave.leaderRole}
                  stats={stats}
                  onOpenDecisions={() => setIsDecisionModalOpen(true)}
                />
              </motion.div>
            )}
            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AnalyticsPanels stats={stats} />
              </motion.div>
            )}
            {activeTab === 'advisors' && (
              <motion.div key="advisors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AdvisorPanel
                  countryName={gameSave.countryName}
                  advisorsJson={gameSave.nationState.advisorReportsJson || '{}'}
                />
              </motion.div>
            )}
            {activeTab === 'timeline' && (
              <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <TimelinePanel
                  countryName={gameSave.countryName}
                  timeline={gameSave.timeline || []}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Right Sidebar: Live Global News Feed */}
        <aside className="hidden xl:flex w-80 border-l border-slate-800 glass-panel flex-col p-4 z-20">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
              <Newspaper className="w-4 h-4 text-cyan-400" />
              <span>Global Intelligence Feed</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {(gameSave.newsItems || []).map((news: any, idx: number) => (
              <div key={news.id || idx} className="p-3.5 rounded-2xl glass-panel-interactive border border-slate-800/80 hover:border-cyan-500/40 transition-all text-xs">
                <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 mb-1.5">
                  <span className={`px-2 py-0.5 rounded-full ${
                    news.category === 'International' ? 'bg-violet-500/10 text-violet-400 border border-violet-500/30' :
                    news.category === 'Crisis' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold' :
                    'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {news.category || 'Domestic'}
                  </span>
                  <span>Y{news.year} • Q{news.turn}</span>
                </div>
                <h4 className="font-bold text-white mb-1 leading-snug">{news.headline}</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-3">{news.summary}</p>
              </div>
            ))}

            {(gameSave.newsItems || []).length === 0 && (
              <div className="p-6 text-center text-slate-500 font-mono text-xs">
                No intelligence broadcasts logged.
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Decision Enactment Modal */}
      <DecisionModal
        isOpen={isDecisionModalOpen}
        onClose={() => setIsDecisionModalOpen(false)}
        stats={stats}
        onEnactPolicies={handleEnactPolicies}
        isProcessing={isProcessingTurn}
      />
    </div>
  );
};
