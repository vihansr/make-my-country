'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LandingPage } from '@/components/landing/LandingPage';
import { CountrySelection } from '@/components/selection/CountrySelection';
import { LoadSaveModal } from '@/components/selection/LoadSaveModal';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Globe } from 'lucide-react';

type ScreenState = 'landing' | 'select_country' | 'load_save' | 'dashboard';

export default function Home() {
  const [screen, setScreen] = useState<ScreenState>('landing');
  const [activeSaveId, setActiveSaveId] = useState<string | null>(null);
  const [gameSave, setGameSave] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingTurn, setIsProcessingTurn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGameSave = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/simulation/save?id=${id}`);
      const data = await res.json();
      if (data.success && data.gameSave) {
        setGameSave(data.gameSave);
        setActiveSaveId(id);
        setScreen('dashboard');
      } else {
        throw new Error(data.error || 'Could not retrieve simulation data');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching save');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulationStarted = async (gameSaveId: string) => {
    await fetchGameSave(gameSaveId);
  };

  const handleSaveSelected = async (gameSaveId: string) => {
    await fetchGameSave(gameSaveId);
  };

  const handleAdvanceTurn = async (selectedPolicyIds: string[], customPrompt?: string) => {
    if (!activeSaveId) return;
    setIsProcessingTurn(true);
    setError(null);
    try {
      const res = await fetch('/api/simulation/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameSaveId: activeSaveId,
          selectedPolicyIds,
          customDecisionPrompt: customPrompt,
        }),
      });
      const data = await res.json();
      if (data.success && data.gameSave) {
        setGameSave(data.gameSave);
      } else {
        throw new Error(data.error || 'Failed to advance turn');
      }
    } catch (err: any) {
      setError(err.message || 'Error processing quarterly simulation');
    } finally {
      setIsProcessingTurn(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* Global error toast if any */}
      {error && (
        <div className="fixed top-4 right-4 z-50 p-4 rounded-2xl bg-rose-500/90 text-white font-mono text-xs max-w-md shadow-2xl flex items-center justify-between gap-3 border border-rose-400">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold underline">Dismiss</button>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-4 text-center p-6">
          <Globe className="w-16 h-16 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
          <h3 className="text-xl font-bold text-white tracking-wide">Connecting to Global Intelligence Neural Grid...</h3>
          <p className="text-xs font-mono text-slate-400">Loading sovereign ministries, faction sentiment, and diplomatic channels.</p>
        </div>
      )}

      {/* Screen Transitions */}
      <AnimatePresence mode="wait">
        {screen === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LandingPage
              onStart={() => setScreen('select_country')}
              onLoad={() => setScreen('load_save')}
            />
          </motion.div>
        )}

        {screen === 'select_country' && (
          <motion.div
            key="select_country"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <CountrySelection
              onBack={() => setScreen('landing')}
              onSimulationStarted={handleSimulationStarted}
            />
          </motion.div>
        )}

        {screen === 'load_save' && (
          <motion.div
            key="load_save"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <LoadSaveModal
              onBack={() => setScreen('landing')}
              onSaveSelected={handleSaveSelected}
            />
          </motion.div>
        )}

        {screen === 'dashboard' && gameSave && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DashboardLayout
              gameSave={gameSave}
              onAdvanceTurn={handleAdvanceTurn}
              onExitToMenu={() => {
                setActiveSaveId(null);
                setGameSave(null);
                setScreen('landing');
              }}
              isProcessingTurn={isProcessingTurn}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
