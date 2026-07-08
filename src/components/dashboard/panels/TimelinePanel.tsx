'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, ShieldAlert, Zap, Award, Clock } from 'lucide-react';

interface TimelineEventItem {
  id?: string;
  year: number;
  turn: number;
  title: string;
  description: string;
  impact?: string | null;
  createdAt?: string;
}

interface TimelinePanelProps {
  countryName: string;
  timeline: TimelineEventItem[];
}

export const TimelinePanel: React.FC<TimelinePanelProps> = ({ countryName, timeline }) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Alternate History Chronicle & Historical Archives</h2>
          <p className="text-xs text-slate-400">Chronological record of state decrees, constitutional milestones, and global events.</p>
        </div>
        <span className="text-xs font-mono text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-800/60">
          ARCHIVES: {timeline.length} ENTRIES
        </span>
      </div>

      <div className="relative pl-6 md:pl-10 space-y-8 before:absolute before:left-3 md:before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-emerald-500 before:to-slate-800">
        {timeline.map((event, index) => (
          <motion.div
            key={event.id || index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="relative group"
          >
            {/* Timeline Node Bullet */}
            <div className="absolute -left-[27px] md:-left-[35px] top-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.6)] group-hover:scale-125 transition-transform">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
            </div>

            {/* Content Card */}
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 hover:border-cyan-500/40 transition-all shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 w-fit">
                  YEAR {event.year} • QUARTER Q{event.turn}
                </span>

                {event.createdAt && (
                  <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>LOGGED: {new Date(event.createdAt).toLocaleDateString()}</span>
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                {event.title}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {event.description}
              </p>

              {event.impact && (
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono text-emerald-400 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block mb-0.5 text-[10px] uppercase tracking-wider">Geopolitical Consequences & Telemetry Delta</span>
                    <span>{event.impact}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {timeline.length === 0 && (
          <div className="p-12 rounded-3xl glass-panel border border-slate-800 text-center text-slate-500 font-mono">
            No historical milestones recorded yet. Advance the quarterly simulation to forge new alternate history.
          </div>
        )}
      </div>
    </div>
  );
};
