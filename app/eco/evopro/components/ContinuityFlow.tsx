'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { CONTINUITY_QUESTIONS } from '@/data/evopro';
import { 
  FileText, 
  Calendar, 
  ArrowRight, 
  HelpCircle, 
  Sparkles,
  Bot,
  Laptop,
  Terminal,
  Cpu
} from 'lucide-react';

export function ContinuityFlow() {
  const { theme } = useTheme();

  return (
    <section id="continuity" className="py-16 md:py-24 border-t border-white/5 relative bg-zinc-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
            <FileText className="w-3.5 h-3.5" />
            ZERO-CONTEXT HANDOFF
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Continuidade e Agent Handoff
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Nenhum agente precisa partilhar a mesma conversa de chat. Qualquer novo modelo lê o ficheiro <code className="text-emerald-400 font-mono">.evolution/CONTINUITY.md</code> e obtém respostas exatas e imediatas para as 9 perguntas vitais de continuidade.
          </p>
        </div>

        {/* Day 1 -> Day 2 -> Day 3 Timeline Visual */}
        <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch font-mono text-xs mb-8">
            {/* Day 1 */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-zinc-500 font-bold uppercase">Dia 01</span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px]">Codex / OpenAI</span>
                </div>
                <div className="text-sm font-bold text-white mb-2">Executa Sprint #12</div>
                <p className="text-zinc-400 font-sans text-xs mb-4">
                  Cria modelos de base de dados e valida suite inicial de testes com o Judge.
                </p>
              </div>
              <div className="p-2 rounded bg-black/60 text-emerald-400 text-[11px] border border-zinc-800">
                Grava: CONTINUITY.md atualizado
              </div>
            </div>

            {/* Day 2 */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-zinc-500 font-bold uppercase">Dia 02</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px]">Claude Code</span>
                </div>
                <div className="text-sm font-bold text-white mb-2">Assume Sprint #13</div>
                <p className="text-zinc-400 font-sans text-xs mb-4">
                  Abre o repositório a frio. Lê o CONTINUITY.md e continua exatamente onde o Dia 1 parou.
                </p>
              </div>
              <div className="p-2 rounded bg-black/60 text-emerald-400 text-[11px] border border-zinc-800">
                Grava: CONTINUITY.md atualizado
              </div>
            </div>

            {/* Day 3 */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-emerald-500/30 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-zinc-500 font-bold uppercase">Dia 03</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px]">Antigravity / Local</span>
                </div>
                <div className="text-sm font-bold text-white mb-2">Avança Sprint #14</div>
                <p className="text-zinc-400 font-sans text-xs mb-4">
                  Conclui os critérios pendentes do Global Goal sem perdas de decisões passadas.
                </p>
              </div>
              <div className="p-2 rounded bg-black/60 text-emerald-400 text-[11px] border border-zinc-800">
                Grava: CONTINUITY.md atualizado
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 font-mono text-xs text-center text-zinc-400">
            Todos os agentes operam sobre a mesma autoridade de disco: <code className="text-emerald-400">.evolution/CONTINUITY.md</code>
          </div>
        </div>

        {/* The 9 Continuity Questions Accordion/Grid */}
        <div>
          <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4 text-center">
            As 9 Perguntas Essenciais Respondidas Automaticamente pelo Repositório
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {CONTINUITY_QUESTIONS.map((item, idx) => (
              <div 
                key={item.q}
                className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
                  <span className="text-zinc-500 text-[10px]">0{idx + 1}.</span>
                  <span>{item.q}</span>
                </div>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
