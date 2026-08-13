'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { LIFECYCLE_STAGES, LifecycleStage } from '@/data/evopro';
import { 
  Layers, 
  ArrowDown, 
  ArrowRight, 
  Activity, 
  CheckCircle, 
  RefreshCw, 
  FileText, 
  Terminal,
  Shield,
  Scale,
  Brain,
  Database,
  Info,
  Sparkles
} from 'lucide-react';

export function EvolutionCycle() {
  const { theme } = useTheme();
  const [selectedStage, setSelectedStage] = useState<LifecycleStage>(LIFECYCLE_STAGES[0]);

  const getStageIcon = (id: string) => {
    switch(id) {
      case 'goal': return Activity;
      case 'observe': return FileText;
      case 'diagnose': return Brain;
      case 'plan': return Layers;
      case 'baseline_a': return Scale;
      case 'build': return Terminal;
      case 'baseline_b': return Scale;
      case 'gauntlet': return Shield;
      case 'judge': return CheckCircle;
      case 'learn': return Database;
      default: return Activity;
    }
  };

  return (
    <section id="lifecycle" className="py-16 md:py-24 border-t border-white/5 relative bg-zinc-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
            <RefreshCw className="w-3.5 h-3.5" />
            GOVERNED EVOLUTIONARY PIPELINE
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            O Ciclo de Evolução
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Cada estágio do ciclo é um módulo autónomo com contrato formal e responsabilidades isoladas. Nenhum ator valida o seu próprio código e nenhuma mutação avança sem evidências comprovadas.
          </p>
        </div>

        {/* Interactive Lifecycle Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Stage Nodes Pipeline */}
          <div className="lg:col-span-7 flex flex-col gap-2.5">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest px-2 mb-1 flex items-center justify-between">
              <span>Etapas do Pipeline (Clique para inspecionar)</span>
              <span className="text-[10px] text-zinc-600">10 Módulos Determinísticos</span>
            </div>

            {LIFECYCLE_STAGES.map((stage, idx) => {
              const isSelected = selectedStage.id === stage.id;
              const Icon = getStageIcon(stage.id);

              return (
                <div key={stage.id} className="relative">
                  <button
                    onClick={() => setSelectedStage(stage)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                      isSelected 
                        ? 'bg-zinc-900/90 border-white/30 shadow-xl' 
                        : 'bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-900/40 hover:border-zinc-700'
                    }`}
                    style={isSelected ? { borderColor: `${stage.accent}60`, boxShadow: `0 0 20px ${stage.accent}15` } : {}}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Number badge */}
                      <span className="text-[11px] font-mono text-zinc-500 font-bold w-6">
                        {stage.number}
                      </span>

                      {/* Icon */}
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                        style={{ 
                          backgroundColor: `${stage.accent}15`, 
                          borderColor: `${stage.accent}30`,
                          borderWidth: '1px',
                          color: stage.accent
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white tracking-tight">
                            {stage.name}
                          </span>
                          {stage.id === 'baseline_a' && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              STATE A
                            </span>
                          )}
                          {stage.id === 'baseline_b' && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              STATE B
                            </span>
                          )}
                          {stage.id === 'gauntlet' && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              ADVERSARIAL
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-zinc-400 block truncate max-w-[280px] sm:max-w-md">
                          {stage.responsibility}
                        </span>
                      </div>
                    </div>

                    <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-white translate-x-1' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                  </button>

                  {/* Flow Connector Arrow */}
                  {idx < LIFECYCLE_STAGES.length - 1 && (
                    <div className="w-full flex justify-center py-1">
                      <div className="h-2 w-[1px] bg-zinc-800" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loop Decision Block */}
            <div className="mt-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 font-mono text-xs text-center flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-zinc-300">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>O Global Goal foi atingido?</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  SIM → Concluir & Parar
                </span>
                <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                  NÃO → Próximo Sprint
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Stage Deep Dive Drawer */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedStage.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden"
              >
                {/* Glow Accent */}
                <div 
                  className="absolute top-0 right-0 w-48 h-48 opacity-15 blur-3xl pointer-events-none rounded-full" 
                  style={{ backgroundColor: selectedStage.accent }}
                />

                <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
                  <div>
                    <span className="text-[11px] font-mono font-bold tracking-widest text-zinc-500 block mb-1">
                      ESTÁGIO #{selectedStage.number}
                    </span>
                    <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                      <span>{selectedStage.name}</span>
                    </h3>
                  </div>
                  <span 
                    className="text-xs font-mono px-3 py-1 rounded-full font-semibold"
                    style={{ 
                      backgroundColor: `${selectedStage.accent}20`,
                      color: selectedStage.accent,
                      border: `1px solid ${selectedStage.accent}40`
                    }}
                  >
                    Ativo
                  </span>
                </div>

                {/* Module Path */}
                <div className="mb-6 font-mono text-xs">
                  <span className="text-zinc-500 block text-[10px] uppercase tracking-wider mb-1">Módulo Interno</span>
                  <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300">
                    <code className="text-emerald-400">src/evolution_kernel/{selectedStage.module}</code>
                  </div>
                </div>

                {/* Responsibility */}
                <div className="mb-6">
                  <span className="text-zinc-500 block text-[10px] uppercase font-mono tracking-wider mb-1">Responsabilidade Central</span>
                  <p className="text-sm text-zinc-200 leading-relaxed font-sans bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-800/80">
                    {selectedStage.responsibility}
                  </p>
                </div>

                {/* Inputs & Outputs */}
                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase tracking-wider mb-1">Entradas Necessárias</span>
                    <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-zinc-300">
                      {selectedStage.inputs}
                    </div>
                  </div>

                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase tracking-wider mb-1">Artefatos / Saídas Produzidas</span>
                    <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-cyan-300">
                      <code>{selectedStage.outputs}</code>
                    </div>
                  </div>
                </div>

                {/* Invariant Alert */}
                <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-400 flex items-start gap-2">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Regra Invariante:</strong> Nenhum estágio assume que a execução anterior foi honesta; todas as saídas são validadas contra schemas JSON estritos.
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
