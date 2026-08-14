'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { ALT_RADAR_CONFIG } from '@/data/alt-radar';
import { Layers, CheckCircle2, Clock, Activity, Zap, ShieldAlert, Cpu } from 'lucide-react';

export function StatusAndRoadmap() {
  const { theme } = useTheme();

  return (
    <section id="status" className="relative py-20 md:py-32 overflow-hidden border-t border-zinc-900 bg-zinc-950/40">
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
            <Layers className="w-3.5 h-3.5" />
            STATUS DE OPERAÇÃO & ROADMAP
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Evolução Contínua & Expansão Multi-Chain
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Monitoramento de saúde dos nós e entregas planejadas para as próximas iterações do protocolo.
          </p>
        </div>

        {/* Live Nodes Health Bar */}
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl mb-12 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              Saúde dos Nós RPC em Produção
            </span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              99.98% Uptime Geral
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[11px] font-mono text-zinc-400">Solana (Jito MEV)</span>
              <div className="text-sm font-bold text-white flex items-center justify-between">
                <span className="text-emerald-400">28ms</span>
                <span className="text-[10px] text-zinc-500 font-mono">100% OK</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[11px] font-mono text-zinc-400">Solana (Helius)</span>
              <div className="text-sm font-bold text-white flex items-center justify-between">
                <span className="text-emerald-400">32ms</span>
                <span className="text-[10px] text-zinc-500 font-mono">100% OK</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[11px] font-mono text-zinc-400">Base (Alchemy)</span>
              <div className="text-sm font-bold text-white flex items-center justify-between">
                <span className="text-emerald-400">44ms</span>
                <span className="text-[10px] text-zinc-500 font-mono">100% OK</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[11px] font-mono text-zinc-400">Ethereum (Geth)</span>
              <div className="text-sm font-bold text-white flex items-center justify-between">
                <span className="text-emerald-400">12ms</span>
                <span className="text-[10px] text-zinc-500 font-mono">100% OK</span>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ALT_RADAR_CONFIG.roadmap.map((stage, idx) => (
            <div 
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-xl hover:border-zinc-700 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400 font-bold">
                    {stage.quarter}
                  </span>
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                    stage.status === 'in_progress' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}>
                    {stage.status === 'in_progress' ? 'EM EXECUÇÃO' : 'PLANEJADO'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">{stage.title}</h3>

                <div className="space-y-2.5 pt-2 border-t border-zinc-900">
                  {stage.items.map((it, iIdx) => (
                    <div key={iIdx} className="flex items-start gap-2 text-xs text-zinc-300">
                      <CheckCircle2 
                        className="w-3.5 h-3.5 shrink-0 mt-0.5" 
                        style={{ color: stage.status === 'in_progress' ? theme.colors.primary : '#71717a' }}
                      />
                      <span>{it}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[11px] font-mono text-zinc-500 border-t border-zinc-900 pt-3">
                Sprint Tracking AG47
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
