'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { GRAPH_BENCHMARK_DATA } from '@/data/evopro';
import { 
  Network, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export function GraphIntelligence() {
  const { theme } = useTheme();

  return (
    <section id="graph" className="py-16 md:py-24 border-t border-white/5 relative bg-zinc-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
            <Network className="w-3.5 h-3.5" />
            NOVIDADE NA V0.3.0 — GRAPH INTELLIGENCE
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Code Graph & Evolution Graph
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            <em>&ldquo;Graph-enhanced, not graph-dependent.&rdquo;</em> O EvoPro v0.3.0 adiciona indexação AST nativa sem dependências pesadas, permitindo mapear o raio de impacto de dependências e testes afetados com precisão cirúrgica.
          </p>
        </div>

        {/* 2 Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 font-mono text-xs">
          <div className="p-6 rounded-3xl bg-zinc-950 border border-cyan-500/30 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-3">
              <Zap className="w-4 h-4" />
              <span>1. Graph-Enhanced, Not Dependent</span>
            </div>
            <p className="text-xs text-zinc-300 font-sans leading-relaxed mb-4">
              Se o grafo estiver disponível, ele potencializa o raciocínio. Se não estiver, o kernel opera normalmente via filesystem e inspeção estática determinística. O <code className="text-cyan-400 font-mono">NullGraphProvider</code> garante resiliência total.
            </p>
            <div className="text-[11px] text-zinc-500 bg-black/60 p-3 rounded-xl border border-zinc-800">
              <code>GRAPH AVAILABLE → Enhanced Reasoning</code><br />
              <code>GRAPH UNAVAILABLE → Safe Deterministic Fallback</code>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-950 border border-purple-500/30 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>2. Graph Data is Evidence, Not Magic</span>
            </div>
            <p className="text-xs text-zinc-300 font-sans leading-relaxed mb-4">
              Cada aresta do grafo carrega proveniência e confiança (<code className="text-purple-300 font-mono">OBSERVED</code> a 1.0 para AST Python, <code className="text-purple-300 font-mono">INFERRED</code> a 0.5 para JS/TS regex). O grafo é combinado com evidências reais de testes, nunca confiado cegamente.
            </p>
            <div className="text-[11px] text-zinc-500 bg-black/60 p-3 rounded-xl border border-zinc-800">
              <code>Provenance: &quot;src/service.py:1&quot; • Confidence: 1.0 (OBSERVED)</code>
            </div>
          </div>
        </div>

        {/* Benchmark Results (Measured & Proven) */}
        <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-zinc-800 gap-2 font-mono">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Validação Empírica no Kernel</span>
              <h3 className="text-xl font-bold text-white">Benchmark Real: A/B Context Testing</h3>
            </div>
            <div className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Reproduzível: <code>evolution benchmark graph</code>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 font-mono text-center">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block mb-1">Nós Indexados</span>
              <span className="text-xl font-black text-white">{GRAPH_BENCHMARK_DATA.nodes}</span>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block mb-1">Arestas Mapeadas</span>
              <span className="text-xl font-black text-white">{GRAPH_BENCHMARK_DATA.edges}</span>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block mb-1">Build Completo</span>
              <span className="text-xl font-black text-emerald-400">{GRAPH_BENCHMARK_DATA.buildTime}</span>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block mb-1">Update Incremental</span>
              <span className="text-xl font-black text-cyan-400">{GRAPH_BENCHMARK_DATA.updateTime}</span>
            </div>
          </div>

          {/* Detailed Metric Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 uppercase text-[10px]">
                  <th className="pb-3 font-semibold">Métrica de Qualidade</th>
                  <th className="pb-3 font-semibold">A: Sem Grafo (Heurística)</th>
                  <th className="pb-3 font-semibold text-emerald-400">B: Com Code Graph (AST)</th>
                  <th className="pb-3 font-semibold text-right">Ganho Medido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {GRAPH_BENCHMARK_DATA.metrics.map((m, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 font-medium text-white">{m.label}</td>
                    <td className="py-3 text-zinc-400">{m.withoutGraph}</td>
                    <td className="py-3 text-emerald-400 font-bold">{m.withGraph}</td>
                    <td className="py-3 text-right text-cyan-300 font-semibold">{m.gain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800 text-[11px] font-mono text-zinc-500 flex items-center justify-between">
            <span>Zero dependências compiladas: Construído com stdlib Python <code>ast</code>.</span>
            <span className="text-zinc-400">Impact analysis em tempo real.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
