'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LandingPage } from '@/components/landing/LandingPage';
import { CountrySelection } from '@/components/selection/CountrySelection';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Globe } from 'lucide-react';

type ScreenState = 'landing' | 'select_country' | 'dashboard';

export default function Home() {
  const [screen, setScreen] = useState<ScreenState>('landing');
  const [gameSave, setGameSave] = useState<any | null>(null);
  const [hasActiveSave, setHasActiveSave] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingTurn, setIsProcessingTurn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('geopolis_save');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.nationState) {
          setHasActiveSave(true);
        }
      }
    } catch (e) {
      console.error('Error scanning for saved session:', e);
    }
  }, []);

  const handleResume = () => {
    try {
      const savedSession = localStorage.getItem('geopolis_save');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        setGameSave(parsed);
        setScreen('dashboard');
      }
    } catch (e) {
      setError('Could not resume saved session');
    }
  };

  const handleSimulationStarted = (save: any) => {
    setGameSave(save);
    setHasActiveSave(true);
    try {
      localStorage.setItem('geopolis_save', JSON.stringify(save));
    } catch (e) {
      console.error('Failed to cache session locally:', e);
    }
    setScreen('dashboard');
  };

  const handleAdvanceTurn = async (selectedPolicyIds: string[], customPrompt?: string) => {
    if (!gameSave) return;
    setIsProcessingTurn(true);
    setError(null);
    try {
      const res = await fetch('/api/simulation/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameSave,
          selectedPolicyIds,
          customDecisionPrompt: customPrompt,
        }),
      });
      const data = await res.json();
      if (data.success && data.gameSave) {
        setGameSave(data.gameSave);
        try {
          localStorage.setItem('geopolis_save', JSON.stringify(data.gameSave));
        } catch (e) {
          console.error('Failed to cache session locally:', e);
        }
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
              hasActiveSave={hasActiveSave}
              onResume={handleResume}
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
