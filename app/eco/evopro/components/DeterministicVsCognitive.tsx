'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  ShieldCheck, 
  BrainCircuit, 
  ArrowDown, 
  ArrowUp, 
  ArrowRight,
  FileJson, 
  Cpu, 
  Layers,
  Sparkles
} from 'lucide-react';

export function DeterministicVsCognitive() {
  const { theme } = useTheme();

  return (
    <section id="architecture" className="py-16 md:py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
            <Cpu className="w-3.5 h-3.5" />
            COGNITIVE BOUNDARY & SEPARATION OF POWERS
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Core Determinístico vs. Camada Cognitiva
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            O Core do EvoPro é código determinístico tradicional — não finge ser uma LLM. O agente de IA atua como motor de raciocínio externo, mas não possui autoridade arbitrária sobre o estado do projeto.
          </p>
        </div>

        {/* Boundary Diagram Card */}
        <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Box 1: Deterministic Core */}
            <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/90 border border-cyan-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <ShieldCheck className="w-6 h-6 text-cyan-400" />
                  <div>
                    <h3 className="font-bold text-lg text-white">DETERMINISTIC CORE (Kernel)</h3>
                    <span className="text-xs font-mono text-cyan-400">Regras • Estado • Evidência • Judge • Guardrails</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed mb-6">
                  Implementado em Python com zero dependências externas pesadas (apenas <code className="text-cyan-400 font-mono">jsonschema</code> e stdlib <code className="text-cyan-400 font-mono">ast</code>). Responsável por:
                </p>

                <ul className="space-y-2 font-mono text-xs text-zinc-300 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Validação estrita de schemas JSON</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Medição de baseline State A e State B</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Execução determinística do Gauntlet & Judge</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Stop conditions e contadores de segurança</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-[11px] text-zinc-400">
                <strong>O que o kernel NÃO faz:</strong> Nunca inventa código ou mutações para &ldquo;parecer ocupado&rdquo;.
              </div>
            </div>

            {/* Box 2: Cognitive Layer */}
            <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/90 border border-purple-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <BrainCircuit className="w-6 h-6 text-purple-400" />
                  <div>
                    <h3 className="font-bold text-lg text-white">COGNITIVE LAYER (AI / Harness)</h3>
                    <span className="text-xs font-mono text-purple-400">Raciocínio • Proposta de Código • Revisão</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed mb-6">
                  Qualquer LLM ou harness (Claude Code, Codex, Antigravity, modelos locais). Responsável por:
                </p>

                <ul className="space-y-2 font-mono text-xs text-zinc-300 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>Compreender a intenção e formular hipóteses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>Escrever a mutação de código proposta</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>Satisfazer pedidos cognitivos pendentes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>Corrigir findings reportados pelo Gauntlet</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-[11px] text-zinc-400">
                <strong>Subordinação ao Contrato:</strong> A proposta do agente só é aceite se sobreviver ao Judge.
              </div>
            </div>
          </div>

          {/* Contract Handoff File Box */}
          <div className="mt-8 pt-8 border-t border-zinc-800 text-center font-mono">
            <div className="text-xs text-zinc-400 uppercase tracking-widest mb-3">
              Fronteira Formal de Handoff via Arquivos no Disco
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
              <div className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-cyan-300">
                <code>03_cognitive_request.json</code> (Kernel solicita)
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-500 hidden sm:inline" />
              <ArrowDown className="w-4 h-4 text-zinc-500 sm:hidden" />
              <div className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-purple-300">
                <code>03_proposed_changeset.json</code> (Agente entrega)
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-500 hidden sm:inline" />
              <ArrowDown className="w-4 h-4 text-zinc-500 sm:hidden" />
              <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                <code>evolution tick</code> (Kernel avalia)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
