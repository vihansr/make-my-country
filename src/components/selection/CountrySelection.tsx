'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, Landmark, Users, Crown, ShieldAlert, ArrowLeft, Play, Sparkles, Check, Trash2, Calendar, Clock } from 'lucide-react';
import { WORLD_COUNTRIES, ROLE_OPTIONS, CountryInfo } from '@/lib/data/countries';

interface CountrySelectionProps {
  onBack: () => void;
  onSimulationStarted: (gameSaveId: string) => void;
}

export const CountrySelection: React.FC<CountrySelectionProps> = ({ onBack, onSimulationStarted }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(WORLD_COUNTRIES[0]);
  const [selectedRole, setSelectedRole] = useState<string>('President');
  const [saveName, setSaveName] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const regions = ['All', 'North America', 'Europe', 'Asia', 'South America', 'Middle East', 'Oceania'];

  const filteredCountries = WORLD_COUNTRIES.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.governmentType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || c.region.includes(selectedRegion);
    return matchesSearch && matchesRegion;
  });

  const getRoleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Landmark': return <Landmark className="w-5 h-5 text-cyan-400" />;
      case 'Users': return <Users className="w-5 h-5 text-emerald-400" />;
      case 'Crown': return <Crown className="w-5 h-5 text-amber-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      default: return <Landmark className="w-5 h-5 text-cyan-400" />;
    }
  };

  const handleStart = async () => {
    if (!selectedCountry) return;
    setIsStarting(true);
    setError(null);
    try {
      const res = await fetch('/api/simulation/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countryId: selectedCountry.id,
          roleName: selectedRole,
          saveName: saveName.trim() || `${selectedCountry.name} (${selectedRole})`,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to initialize simulation');
      }
      onSimulationStarted(data.gameSave.id);
    } catch (err: any) {
      setError(err.message || 'Error starting simulation');
      setIsStarting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-grid-pattern text-slate-100 p-4 md:p-8 flex flex-col">
      {/* Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl glass-panel-interactive border border-slate-700 flex items-center gap-2 text-slate-300 hover:text-white transition-all text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back to Command Desk</span>
        </button>

        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
          <h2 className="text-xl md:text-2xl font-bold tracking-wide">
            Select Sovereign State & Leadership Role
          </h2>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1.5 rounded-full border border-cyan-800/50">
          <Sparkles className="w-3.5 h-3.5" />
          <span>YEAR 2026 GEOPOLITICAL GRID</span>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto w-full mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      {/* Main Grid: Left List (Countries), Right Panel (Role & Confirmation) */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Left Column: Search & Country Grid */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search nation by name or government structure..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-panel border border-slate-700 bg-slate-900/60 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-sans"
              />
            </div>
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap gap-2 pb-2">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedRegion === reg
                    ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'glass-panel text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Country Cards List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-[620px] pr-1">
            {filteredCountries.map((country) => {
              const isSelected = selectedCountry?.id === country.id;
              return (
                <motion.div
                  key={country.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedCountry(country)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-slate-900/90 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                      : 'glass-panel-interactive border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl" role="img" aria-label={country.name}>{country.flag}</span>
                      <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {country.region}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-1.5">
                      {country.name}
                      {isSelected && <Check className="w-4 h-4 text-cyan-400 inline" />}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                      {country.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-[11px] font-mono">
                    <div>
                      <div className="text-slate-500">POPULATION</div>
                      <div className="text-slate-200 font-semibold">{country.population}M</div>
                    </div>
                    <div>
                      <div className="text-slate-500">GDP</div>
                      <div className="text-cyan-400 font-semibold">${country.gdp}B</div>
                    </div>
                    <div>
                      <div className="text-slate-500">GOVT TYPE</div>
                      <div className="text-slate-300 font-semibold truncate">{country.governmentType.split(' ')[0]}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Country Details, Role Selection & Launch */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {selectedCountry ? (
            <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 flex flex-col justify-between h-full shadow-2xl">
              <div>
                {/* Header info */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-800">
                  <span className="text-5xl">{selectedCountry.flag}</span>
                  <div>
                    <h2 className="text-2xl font-extrabold text-white">{selectedCountry.name}</h2>
                    <span className="text-xs font-mono text-cyan-400">{selectedCountry.governmentType}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                  {selectedCountry.description}
                </p>

                {/* Baseline Metrics Radar/Grid */}
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">
                  National Baseline Metrics
                </h4>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                    <span className="text-xs text-slate-400">GDP Growth Base</span>
                    <span className="text-sm font-bold text-cyan-400">${selectedCountry.gdp}B</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                    <span className="text-xs text-slate-400">National Debt</span>
                    <span className="text-sm font-bold text-amber-400">{selectedCountry.initialStats.economy.debt}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                    <span className="text-xs text-slate-400">Military Power</span>
                    <span className="text-sm font-bold text-emerald-400">{selectedCountry.initialStats.military.readiness}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                    <span className="text-xs text-slate-400">Civic Approval</span>
                    <span className="text-sm font-bold text-violet-400">{selectedCountry.initialStats.politics.approvalRating}%</span>
                  </div>
                </div>

                {/* Role Selection */}
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">
                  Select Leadership Authority & Role
                </h4>
                <div className="grid grid-cols-1 gap-2.5 mb-6">
                  {ROLE_OPTIONS.map((role) => {
                    const isRoleSelected = selectedRole === role.name;
                    return (
                      <div
                        key={role.id}
                        onClick={() => setSelectedRole(role.name)}
                        className={`p-3.5 rounded-xl cursor-pointer transition-all border flex items-start gap-3 ${
                          isRoleSelected
                            ? 'bg-gradient-to-r from-slate-900 to-cyan-950/60 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                            : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-slate-800/80 mt-0.5">
                          {getRoleIcon(role.icon)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-bold text-white">{role.name}</h5>
                            {isRoleSelected && <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500 text-black font-bold">SELECTED</span>}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{role.description}</p>
                          <div className="text-[11px] text-emerald-400 font-mono mt-1.5 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 flex-shrink-0" />
                            <span>{role.perk}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Save Game Name Input */}
                <div className="mb-6">
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                    Simulation File Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder={`${selectedCountry.name} (${selectedRole}) - Year 2026`}
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-sans"
                  />
                </div>
              </div>

              {/* Start Simulation Launch Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isStarting}
                onClick={handleStart}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-400 text-black font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all disabled:opacity-50"
              >
                {isStarting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Initializing World Grid...
                  </span>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-black" />
                    <span>Inaugurate {selectedRole} & Launch</span>
                  </>
                )}
              </motion.button>
            </div>
          ) : (
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 flex items-center justify-center h-full text-slate-500 text-center font-mono">
              Select a world nation from the list to preview geopolitical intelligence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
