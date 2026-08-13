'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { GAUNTLET_CRITICS, CriticInfo } from '@/data/evopro';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Bot, 
  Layers, 
  GitBranch, 
  Lock,
  Cpu
} from 'lucide-react';

export function GauntletSection() {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<'all' | 'implemented' | 'unavailable'>('all');

  const filteredCritics = GAUNTLET_CRITICS.filter(c => {
    if (filter === 'implemented') return c.status === 'implemented';
    if (filter === 'unavailable') return c.status === 'registered_unavailable';
    return true;
  });

  return (
    <section id="gauntlet" className="py-16 md:py-24 border-t border-white/5 relative bg-zinc-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-4">
            <ShieldAlert className="w-3.5 h-3.5" />
            PRESSÃO ADVERSARIAL INDEPENDENTE
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            O Gauntlet
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Nenhum autor valida o seu próprio trabalho. O Gauntlet submete a mutação a um conjunto de críticos especializados e independentes que procuram falhas com base em evidências verificáveis, não em opiniões.
          </p>

          {/* Filter Pills */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800 mt-6 font-mono text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'all' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Todos ({GAUNTLET_CRITICS.length})
            </button>
            <button
              onClick={() => setFilter('implemented')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'implemented' ? 'bg-emerald-950/80 text-emerald-300 font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Implementados ({GAUNTLET_CRITICS.filter(c => c.status === 'implemented').length})
            </button>
            <button
              onClick={() => setFilter('unavailable')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'unavailable' ? 'bg-zinc-800 text-amber-300 font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Registados / Indisponíveis ({GAUNTLET_CRITICS.filter(c => c.status === 'registered_unavailable').length})
            </button>
          </div>
        </div>

        {/* Critics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {filteredCritics.map((critic) => {
            const isImplemented = critic.status === 'implemented';

            return (
              <motion.div
                key={critic.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`p-6 rounded-3xl border flex flex-col justify-between backdrop-blur-xl transition-all ${
                  isImplemented 
                    ? 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700' 
                    : 'bg-zinc-950/40 border-dashed border-zinc-800/80 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs ${
                        isImplemented ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {isImplemented ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
                      </div>
                      <h3 className="font-bold text-sm text-white tracking-tight">{critic.name}</h3>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      isImplemented 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {isImplemented ? 'Disponível' : 'Declarado / Indisponível'}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 font-sans leading-relaxed mb-4">
                    {critic.description}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-zinc-800/80 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-zinc-500">Evidência:</span>
                    <span className="text-zinc-300">{critic.evidenceType}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 leading-tight">
                    {critic.details}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Execution Strategy: Subagents vs Sequential Role Separation */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 backdrop-blur-xl">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-mono flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <span>Estratégia de Execução Adaptativa</span>
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans mb-6">
            O Gauntlet seleciona a sua estratégia de acordo com as capacidades descobertas no ambiente:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-purple-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-purple-400">independent_critics</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Subagentes Disponíveis
                </span>
              </div>
              <p className="text-zinc-300 font-sans leading-relaxed text-xs">
                Pedidos de revisão são gerados para execução em instâncias/subagentes totalmente isolados com contexto limpo e fresco, prevenindo contaminação de contexto.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-cyan-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-cyan-400">sequential_role_separation</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  Subagentes Indisponíveis (Padrão)
                </span>
              </div>
              <p className="text-zinc-300 font-sans leading-relaxed text-xs">
                Os mesmos críticos determinísticos executam em processo sequencialmente, restritos estritamente ao seu slice específico de evidências.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
