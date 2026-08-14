'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { ALT_RADAR_CONFIG } from '@/data/alt-radar';
import { Compass, CheckCircle2, TrendingUp, Cpu, ShieldCheck, Landmark } from 'lucide-react';

export function UseCasesSection() {
  const { theme } = useTheme();

  const icons = [TrendingUp, Cpu, ShieldCheck, Landmark];

  return (
    <section id="use-cases" className="relative py-20 md:py-32 overflow-hidden border-t border-zinc-900">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold mb-4 border"
            style={{ 
              backgroundColor: `${theme.colors.primary}10`,
              borderColor: `${theme.colors.primary}30`,
              color: theme.colors.primary 
            }}
          >
            <Compass className="w-3.5 h-3.5" />
            CASOS DE USO & APLICAÇÕES
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Projetado para diferentes perfis de execução
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Seja você um trader manual em busca de alpha, um arquiteto de bots autônomos ou uma tesouraria gerenciando exposição a risco.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ALT_RADAR_CONFIG.useCases.map((uc, idx) => {
            const Icon = icons[idx] || Compass;
            return (
              <div 
                key={uc.id}
                className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-xl hover:border-zinc-700 transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div 
                      className="p-3 rounded-2xl border"
                      style={{ 
                        backgroundColor: `${theme.colors.primary}10`,
                        borderColor: `${theme.colors.primary}30`,
                        color: theme.colors.primary 
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span 
                      className="text-xs font-mono px-3 py-1 rounded-full font-bold border"
                      style={{ 
                        backgroundColor: `${theme.colors.primary}15`,
                        borderColor: `${theme.colors.primary}30`,
                        color: theme.colors.primary 
                      }}
                    >
                      {uc.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{uc.title}</h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {uc.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-900">
                    {uc.benefits.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2 text-xs text-zinc-300">
                        <CheckCircle2 
                          className="w-3.5 h-3.5 shrink-0" 
                          style={{ color: theme.colors.primary }}
                        />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Impacto Mensurado:</span>
                  <span 
                    className="font-black"
                    style={{ color: theme.colors.primary }}
                  >
                    {uc.metrics}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
