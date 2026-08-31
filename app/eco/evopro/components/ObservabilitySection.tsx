'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { TELEMETRY_EPISTEMIC_TAXONOMY } from '@/data/evopro';
import { 
  Activity, 
  Database, 
  ShieldCheck, 
  ArrowRight,
  TrendingDown,
  Clock,
  Zap,
  Cpu,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { DynamicBenchmarkCalculator } from './DynamicBenchmarkCalculator';

export function ObservabilitySection() {
  const { theme } = useTheme();

  return (
    <section id="telemetry" className="py-16 md:py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
            <Activity className="w-3.5 h-3.5" />
            FAIL-OPEN COGNITIVE TELEMETRY & AMORTIZATION
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Telemetria de Amortização & Taxonomia Epistêmica
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            O EvoPro instrumenta o custo cognitivo de cada operação de agente no disco (<code className="text-emerald-400 font-mono">.evolution/runtime/telemetry/</code>). Toda a métrica declara a sua origem: fatos reais são <strong className="text-emerald-400">NATIVE</strong>, aproximações são <strong className="text-cyan-400">ESTIMATED</strong> e sinais não expostos permanecem <strong className="text-zinc-400">UNKNOWN</strong>.
          </p>
        </div>

        {/* Epistemic Taxonomy 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 font-mono text-xs">
          {TELEMETRY_EPISTEMIC_TAXONOMY.map((item) => (
            <div 
              key={item.tier}
              className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800/80 backdrop-blur-xl flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
                  <span className={`text-[11px] px-2.5 py-0.5 rounded font-bold border ${item.badgeClass}`}>
                    {item.tier}
                  </span>
                  <span className="text-[10px] text-zinc-500">{item.label}</span>
                </div>
                <p className="text-zinc-300 text-xs font-sans leading-relaxed mb-4">
                  {item.description}
                </p>
                <div className="space-y-1.5">
                  <span className="text-[10px] text-zinc-500 uppercase block font-bold">Exemplos de Métricas:</span>
                  {item.examples.map((ex, i) => (
                    <div key={i} className="flex items-center gap-2 text-zinc-400 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                      <span>{ex}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-900 text-[10px] text-zinc-500">
                Garantia: Nunca inventa métricas
              </div>
            </div>
          ))}
        </div>

        {/* Session Comparison A ↔ B Ledger Sample */}
        <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl mb-12 font-mono text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-zinc-800 gap-2">
            <div className="flex items-center gap-2 text-white font-bold">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Relatório de Comparação de Sessão (Cold Boot vs Warm Memory)</span>
            </div>
            <div className="text-[11px] text-zinc-500">
              Gerado por: <code className="text-cyan-400">evolution second-brain telemetry compare</code>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block mb-1">Sessão A (Cold Boot)</span>
              <div className="text-zinc-200 font-semibold mb-1">sess_20260828_cold</div>
              <div className="text-zinc-400 text-[11px] font-sans">18 ficheiros inspecionados • 4.82s (NATIVE)</div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-emerald-500/30">
              <span className="text-[10px] text-emerald-400 uppercase block mb-1 font-bold">Sessão B (Warm / Context Router)</span>
              <div className="text-emerald-400 font-semibold mb-1">sess_20260828_warm</div>
              <div className="text-zinc-400 text-[11px] font-sans">4 ficheiros delimitados • 1.12s (NATIVE)</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-[10px] text-emerald-400 uppercase block mb-1 font-bold">Amortização de Fases</span>
              <div className="text-emerald-300 font-bold mb-1">-76.8% Duração • 14 re-leituras evitadas</div>
              <div className="text-zinc-300 text-[11px] font-sans">Reuso cognitivo qualitativo validado</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-black/80 border border-zinc-800 text-[11px] text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              <strong>Status de Amortização:</strong> Fases operacionais instrumentadas fail-open. A amortização quantitativa de conversas humanas completas está em validação em múltiplos hosts.
            </span>
            <code className="text-cyan-400 shrink-0">fail-open logging (non-blocking)</code>
          </div>
        </div>

        {/* Dynamic ROI & Amortization Simulator with Explicit ESTIMATED Disclaimer */}
        <DynamicBenchmarkCalculator />
      </div>
    </section>
  );
}
