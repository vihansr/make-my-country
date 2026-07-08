'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, DollarSign, ShieldAlert, Heart, Globe, Leaf, Check, AlertTriangle, ArrowRight, Sparkles, Send, Lightbulb } from 'lucide-react';
import { POLICIES_CATALOG, PolicyCategory, PolicyOption } from '@/lib/data/policies';
import { InitialNationStats } from '@/lib/data/countries';

interface DecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: InitialNationStats;
  onEnactPolicies: (selectedPolicyIds: string[], customPrompt?: string) => void;
  isProcessing: boolean;
}

export const DecisionModal: React.FC<DecisionModalProps> = ({
  isOpen,
  onClose,
  stats,
  onEnactPolicies,
  isProcessing,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PolicyCategory>('Economic');
  const [selectedPolicyIds, setSelectedPolicyIds] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState<string>('');

  if (!isOpen) return null;

  const categories: PolicyCategory[] = ['Economic', 'Military', 'Social', 'Diplomatic', 'Environmental'];

  const getCategoryIcon = (cat: PolicyCategory) => {
    switch (cat) {
      case 'Economic': return <DollarSign className="w-4 h-4 text-cyan-400" />;
      case 'Military': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'Social': return <Heart className="w-4 h-4 text-emerald-400" />;
      case 'Diplomatic': return <Globe className="w-4 h-4 text-violet-400" />;
      case 'Environmental': return <Leaf className="w-4 h-4 text-amber-400" />;
    }
  };

  const togglePolicy = (id: string) => {
    const policy = POLICIES_CATALOG.find((p) => p.id === id);
    if (selectedPolicyIds.includes(id)) {
      setSelectedPolicyIds(selectedPolicyIds.filter((pId) => pId !== id));
    } else {
      setSelectedPolicyIds([...selectedPolicyIds, id]);
      // If user clicks a preset policy, auto-append to the custom textarea for inspiration!
      if (policy) {
        const addition = `Enact ${policy.name}: ${policy.description}`;
        setCustomPrompt((prev) => (prev ? `${prev}\n\n${addition}` : addition));
      }
    }
  };

  const totalCost = selectedPolicyIds.reduce((sum, id) => {
    const policy = POLICIES_CATALOG.find((p) => p.id === id);
    return sum + (policy?.cost || 0);
  }, 0);

  const handleConfirm = () => {
    onEnactPolicies(selectedPolicyIds, customPrompt);
  };

  const filteredPolicies = POLICIES_CATALOG.filter((p) => p.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-5xl max-h-[92vh] rounded-3xl glass-panel border border-cyan-500/40 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden bg-slate-950/95"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                <span>Executive Command Terminal & Free-Form Decrees</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500 text-black font-extrabold uppercase tracking-widest">AI EVALUATED</span>
              </h2>
              <p className="text-xs text-slate-400">Type any strategic decision or select preset inspiration cards below. Groq AI dynamically calculates numerical consequences across all 16 national telemetry indicators.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Free-Form AI Decision Terminal Input */}
        <div className="p-6 bg-gradient-to-b from-slate-900/80 to-slate-950 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Sovereign Executive Directive (User Prompted AI Command)</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {customPrompt.length > 0 ? `${customPrompt.length} characters active` : 'Type or select presets below'}
            </span>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Invest $50 Billion in nuclear fusion grid expansion, tax luxury imports by 25%, and deploy naval task force to secure international trade corridors..."
              className="w-full p-4 rounded-2xl bg-slate-900/90 border-2 border-cyan-500/50 focus:border-cyan-400 text-sm text-white placeholder-slate-500 focus:outline-none transition-all font-sans shadow-[0_0_20px_rgba(6,182,212,0.15)] resize-none leading-relaxed"
            />
            {customPrompt.length > 0 && (
              <button
                onClick={() => setCustomPrompt('')}
                className="absolute right-3 top-3 text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span><strong>Tip:</strong> You can type any unique law, budget reform, or military action. Click any preset policy below to auto-append it into your directive!</span>
          </div>
        </div>

        {/* Category Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between px-6 py-2.5 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] font-mono text-slate-500 uppercase mr-2 hidden sm:inline">Presets:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'glass-panel text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {getCategoryIcon(cat)}
                <span>{cat}</span>
              </button>
            ))}
          </div>
          <span className="text-xs font-mono text-cyan-400 hidden md:inline">
            Selected Presets: <strong className="text-white">{selectedPolicyIds.length}</strong>
          </span>
        </div>

        {/* Content Body: Left List of Policies, Right Summary Desk */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left 7 Cols: Policy List */}
          <div className="lg:col-span-7 p-6 overflow-y-auto max-h-[340px] space-y-3 border-r border-slate-800/80">
            {filteredPolicies.map((policy) => {
              const isSelected = selectedPolicyIds.includes(policy.id);
              return (
                <motion.div
                  key={policy.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => togglePolicy(policy.id)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                      : 'glass-panel-interactive border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{policy.name}</span>
                        {isSelected ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500 text-black">INCLUDED IN PROMPT</span>
                        ) : (
                          <span className="text-[10px] font-mono text-cyan-400 hover:underline">+ Click to add to prompt</span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1">{policy.description}</p>
                    </div>

                    <div className="text-right flex-shrink-0 font-mono">
                      <div className={`text-sm font-bold ${policy.cost > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {policy.cost > 0 ? `-$${policy.cost}B` : `+$${Math.abs(policy.cost)}B`}
                      </div>
                      <div className="text-[10px] text-slate-500">Quarterly Cost</div>
                    </div>
                  </div>

                  {/* Immediate vs Long Term */}
                  <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-800/60 text-[11px]">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      <span className="font-bold block mb-0.5 text-[10px] uppercase font-mono text-emerald-400">Immediate Impact</span>
                      <ul className="list-disc list-inside space-y-0.5">
                        {policy.immediateConsequences.slice(0, 1).map((c, idx) => (
                          <li key={idx} className="truncate">{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
                      <span className="font-bold block mb-0.5 text-[10px] uppercase font-mono text-amber-400">Long-Term Trade-off</span>
                      <ul className="list-disc list-inside space-y-0.5">
                        {policy.longTermRisks.slice(0, 1).map((r, idx) => (
                          <li key={idx} className="truncate">{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right 5 Cols: Selected Summary & Action Footer */}
          <div className="lg:col-span-5 p-6 flex flex-col justify-between bg-slate-900/40">
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Executive Docket Analysis</span>
              </h3>

              <div className="p-4 rounded-2xl glass-panel border border-slate-800 mb-6 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Custom Prompt Directive:</span>
                  <span className={`font-bold ${customPrompt.length > 0 ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {customPrompt.length > 0 ? 'ACTIVE (AI WILL EVALUATE)' : 'NONE'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Selected Presets:</span>
                  <span className="font-bold text-emerald-400">{selectedPolicyIds.length} Policies</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Preset Fiscal Delta:</span>
                  <span className={`font-bold ${totalCost > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {totalCost > 0 ? `-$${totalCost}B USD / Qtr` : `+$${Math.abs(totalCost)}B USD / Qtr`}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-xs text-slate-300 leading-relaxed font-sans mb-4">
                <div className="font-bold text-cyan-400 font-mono uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>How AI Consequence Evaluation Works:</span>
                </div>
                When you execute your decree, Groq LLM analyzes your text against your GDP, Approval, Stability, and Military stats. It dynamically generates realistic news headlines, foreign diplomatic reactions, and updates numerical telemetry scores!
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isProcessing || (selectedPolicyIds.length === 0 && customPrompt.trim().length === 0)}
                onClick={handleConfirm}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-400 text-black font-bold text-base flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all disabled:opacity-40"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Groq AI Evaluating Consequences...
                  </span>
                ) : (
                  <>
                    <Send className="w-5 h-5 fill-black" />
                    <span>Execute Decree & Advance Quarter</span>
                  </>
                )}
              </motion.button>

              <button
                onClick={onClose}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl glass-panel text-slate-400 hover:text-white text-xs font-semibold transition-colors font-mono"
              >
                Cancel & Return to Command Desk
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
