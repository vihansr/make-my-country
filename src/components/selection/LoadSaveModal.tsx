'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, ArrowLeft, Trash2, Calendar, Clock, Globe, ShieldAlert, Play } from 'lucide-react';

interface SaveGameItem {
  id: string;
  saveName: string;
  countryName: string;
  leaderRole: string;
  currentYear: number;
  currentTurn: number;
  updatedAt: string;
  nationState?: {
    gdp: number;
    approvalRating: number;
    stability: number;
  };
}

interface LoadSaveModalProps {
  onBack: () => void;
  onSaveSelected: (gameSaveId: string) => void;
}

export const LoadSaveModal: React.FC<LoadSaveModalProps> = ({ onBack, onSaveSelected }) => {
  const [saves, setSaves] = useState<SaveGameItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSaves = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/simulation/save');
      const data = await res.json();
      if (data.success) {
        setSaves(data.saves || []);
      } else {
        setError(data.error || 'Failed to load saves');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching saves');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaves();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to permanently delete this simulation save?')) return;
    try {
      await fetch(`/api/simulation/save?id=${id}`, { method: 'DELETE' });
      setSaves((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to delete save:', err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-grid-pattern text-slate-100 p-4 md:p-8 flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl glass-panel-interactive border border-slate-700 flex items-center gap-2 text-slate-300 hover:text-white transition-all text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back to Command Desk</span>
        </button>

        <div className="flex items-center gap-3">
          <FolderOpen className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl md:text-2xl font-bold tracking-wide">
            Load Strategic Simulation Archives
          </h2>
        </div>

        <div className="text-xs font-mono text-slate-400">
          ARCHIVES: <span className="text-cyan-400 font-bold">{saves.length}</span> SAVED STATES
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full flex-1">
        {loading ? (
          <div className="p-12 rounded-3xl glass-panel border border-slate-800 flex flex-col items-center justify-center gap-4">
            <span className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-mono text-slate-400">Retrieving intelligence archives from database...</span>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
            Error loading archives: {error}
          </div>
        ) : saves.length === 0 ? (
          <div className="p-12 rounded-3xl glass-panel border border-slate-800 flex flex-col items-center justify-center text-center max-w-lg mx-auto my-12">
            <FolderOpen className="w-12 h-12 text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-300 mb-2">No Saved Simulations Found</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              You haven't initiated any geopolitical simulations yet. Return to the command desk and inaugurate a new sovereign administration.
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold text-sm hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              Start New Simulation
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {saves.map((save) => (
              <motion.div
                key={save.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSaveSelected(save.id)}
                className="p-5 rounded-2xl glass-panel-interactive border border-slate-800 cursor-pointer flex flex-col justify-between group hover:border-cyan-500/50"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                        <span>{save.saveName}</span>
                      </h3>
                      <div className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{save.countryName} • <strong className="text-slate-200">{save.leaderRole}</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDelete(save.id, e)}
                      title="Delete Save"
                      className="p-2 rounded-lg bg-slate-900/80 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {save.nationState && (
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80 my-3 text-[11px] font-mono">
                      <div>
                        <div className="text-slate-500">GDP</div>
                        <div className="text-cyan-400 font-bold">${Math.round(save.nationState.gdp)}B</div>
                      </div>
                      <div>
                        <div className="text-slate-500">APPROVAL</div>
                        <div className="text-emerald-400 font-bold">{Math.round(save.nationState.approvalRating)}%</div>
                      </div>
                      <div>
                        <div className="text-slate-500">STABILITY</div>
                        <div className="text-violet-400 font-bold">{Math.round(save.nationState.stability)}%</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Year {save.currentYear} • Q{save.currentTurn}</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(save.updatedAt).toLocaleDateString()}</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
