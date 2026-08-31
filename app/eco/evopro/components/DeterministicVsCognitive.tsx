'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { COGNITIVE_PHASES } from '@/data/evopro';
import { 
  ShieldCheck, 
  BrainCircuit, 
  ArrowRight,
  Cpu, 
  Database,
  Layers,
  Sparkles,
  Lock,
  Compass,
  FileCheck2,
  FolderGit2
} from 'lucide-react';

export function DeterministicVsCognitive() {
  const { theme } = useTheme();

  return (
    <section id="cognitive-architecture" className="py-16 md:py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
            <BrainCircuit className="w-3.5 h-3.5" />
            COGNITIVE ARCHITECTURE & GLASS-BOX KERNEL
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Second Brain & Separação Estrita de Memória
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            O EvoPro combina duas camadas complementares: a <strong>Arquitetura Cognitiva (Second Brain)</strong>, que compreende, indexa e preserva a verdade do host; e o <strong>Evolution Engine</strong>, que governa mutações, baselines e julgamentos determinísticos.
          </p>
        </div>

        {/* 3-Tier Memory Architecture Card */}
        <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl mb-12">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base font-mono">
              <FolderGit2 className="w-5 h-5 text-cyan-400" />
              <span>Separação Canónica das Camadas de Memória</span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Zero Competição de Verdade
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs mb-8">
            {/* Tier 1: Host Canonical Memory */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-cyan-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-cyan-400 font-bold uppercase text-[11px]">01. Memória Soberana do Host</span>
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <code className="text-white text-sm font-bold block mb-2">evolution/</code>
                <div className="inline-block px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[10px] mb-3 border border-cyan-500/20 font-bold">
                  HOST_CANONICAL_READ_ONLY
                </div>
                <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                  Documentação arquitetural e especificações pré-existentes pertencentes ao repositório. O EvoPro indexa e adota em modo leitura estrita — <strong>nunca sobrescreve nem apaga</strong>.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] text-zinc-500">
                Propriedade: Host Soberano
              </div>
            </div>

            {/* Tier 2: EvoPro Ephemeral Runtime */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-purple-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-purple-400 font-bold uppercase text-[11px]">02. Runtime Efêmero EvoPro</span>
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <code className="text-white text-sm font-bold block mb-2">.evolution/runtime/</code>
                <div className="inline-block px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[10px] mb-3 border border-purple-500/20 font-bold">
                  EPHEMERAL_STATE
                </div>
                <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                  Snapshots temporários, índices do Context Router, relatórios do Gauntlet, baselines A/B e logs de telemetria fail-open. Isolado da documentação canónica.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] text-zinc-500">
                Propriedade: EvoPro Kernel Runtime
              </div>
            </div>

            {/* Tier 3: Curated Knowledge */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-emerald-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-emerald-400 font-bold uppercase text-[11px]">03. Conhecimento Curado</span>
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <code className="text-white text-sm font-bold block mb-2">.evolution/knowledge/</code>
                <div className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] mb-3 border border-emerald-500/20 font-bold">
                  CURATED_PROTOCOL_MEMORY
                </div>
                <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                  Decisões validadas (ADRs), lições comprovadas pelo Judge, ledger imutável de ciclos e o ficheiro <code className="text-zinc-300">CONTINUITY.md</code> para handoff limpo entre modelos.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] text-zinc-500">
                Propriedade: Protocol Memory Persistente
              </div>
            </div>
          </div>

          {/* Epistemic Evidence Progression Bar */}
          <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800 font-mono text-xs">
            <span className="text-zinc-400 text-[11px] uppercase block mb-3 font-bold">
              Taxonomia Epistemológica de Promoção da Verdade:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px]">
              <span className="px-2.5 py-1 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                OBSERVED (Evidência Bruta)
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
              <span className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                INFERRED (Hipótese de Agente)
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
              <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                VALIDATED (Comprovado por Testes)
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                CURATED (Promovido a Memória)
              </span>
            </div>
          </div>
        </div>

        {/* 7 Macro Phases of Second Brain Initiation */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-mono">
              Fluxo de Iniciação Cognitiva do Second Brain
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans mt-1">
              O Second Brain constrói um modelo profundo do host através de 17 fases estruturadas, sem inventar informações e sem modificar o código de produção.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 font-mono text-xs">
            {COGNITIVE_PHASES.map((phase) => (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 backdrop-blur-xl flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800">
                    <span 
                      className="font-bold text-sm tracking-wider"
                      style={{ color: phase.accent }}
                    >
                      PHASE {phase.number}
                    </span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: phase.accent }} />
                  </div>
                  <h4 className="font-bold text-white text-xs mb-2">{phase.name}</h4>
                  <p className="text-zinc-400 text-[11px] font-sans leading-relaxed">
                    {phase.description}
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-zinc-900 text-[10px] text-zinc-500">
                  Artefato: <span className="text-zinc-300">{phase.evidenceProduced}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
