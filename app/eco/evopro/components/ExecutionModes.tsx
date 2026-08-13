'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { EXECUTION_MODES } from '@/data/evopro';
import { 
  Play, 
  RotateCw, 
  Target, 
  Check, 
  Terminal, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export function ExecutionModes() {
  const { theme } = useTheme();

  const getModeIcon = (id: string) => {
    switch (id) {
      case 'one-shot': return Play;
      case 'continuous': return RotateCw;
      case 'goal-driven': return Target;
      default: return Play;
    }
  };

  return (
    <section id="modes" className="py-16 md:py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
            <Play className="w-3.5 h-3.5" />
            GOVERNED RUN MODES
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Modos de Execução
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Escolha o nível de autonomia adequado à sua necessidade através da flag <code className="text-emerald-400 font-mono">--mode</code> da CLI.
          </p>
        </div>

        {/* 3 Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 font-mono">
          {EXECUTION_MODES.map((mode) => {
            const Icon = getModeIcon(mode.id);
            const isGoalDriven = mode.id === 'goal-driven';

            return (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`p-6 sm:p-8 rounded-3xl border flex flex-col justify-between backdrop-blur-xl shadow-xl relative overflow-hidden ${
                  isGoalDriven 
                    ? 'bg-zinc-950/90 border-emerald-500/40 shadow-2xl' 
                    : 'bg-zinc-950/70 border-zinc-800'
                }`}
              >
                {isGoalDriven && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/20 border-b border-l border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-bl-xl">
                    RECOMENDADO
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-xl border ${
                      isGoalDriven 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-zinc-900 text-zinc-300 border-zinc-700'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">{mode.name}</h3>
                      <code className="text-xs text-zinc-400">{mode.flag}</code>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 font-sans leading-relaxed mb-6">
                    {mode.description}
                  </p>

                  <div className="space-y-3 text-xs mb-6">
                    <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Comportamento</span>
                      <p className="text-zinc-300 font-sans text-xs">{mode.behavior}</p>
                    </div>

                    <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Ideal Para</span>
                      <p className="text-zinc-400 font-sans text-xs">{mode.idealFor}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-zinc-500 text-[11px]">Comando:</span>
                  <code className="text-emerald-400 text-xs font-bold">evolution run {mode.flag}</code>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
