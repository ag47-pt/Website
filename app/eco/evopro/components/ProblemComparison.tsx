'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  HardDrive, 
  ArrowRight, 
  HelpCircle,
  Sparkles,
  GitPullRequest
} from 'lucide-react';

export function ProblemComparison() {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<'both' | 'without' | 'with'>('both');

  return (
    <section id="problem" className="py-16 md:py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-4">
            <AlertTriangle className="w-3.5 h-3.5" />
            O PROBLEMA QUE O EVOPRO RESOLVE
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Chat-Native Amnesia vs. <br className="hidden sm:inline" />
            <span 
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(135deg, #ffffff 30%, ${theme.colors.primary} 100%)` }}
            >
              Repository-Native Evolution
            </span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Hoje, agentes de IA perdem o contexto assim que a conversa fecha. O EvoPro move a verdade e o motor evolutivo para dentro do próprio projeto.
          </p>

          {/* Filter Pills for Mobile/Desktop */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800 mt-6 font-mono text-xs">
            <button
              onClick={() => setViewMode('both')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'both' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Lado a Lado
            </button>
            <button
              onClick={() => setViewMode('without')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'without' ? 'bg-rose-950/80 text-rose-300 font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sem EvoPro
            </button>
            <button
              onClick={() => setViewMode('with')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'with' ? 'bg-emerald-950/80 text-emerald-300 font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Com EvoPro
            </button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card: Sem EvoPro */}
          {(viewMode === 'both' || viewMode === 'without') && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl bg-zinc-950/70 border border-rose-500/20 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">Sem EvoPro</h3>
                      <span className="text-xs font-mono text-rose-400">Chat-Bound & Fragile</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    Sessão Efémera
                  </span>
                </div>

                <p className="text-sm text-zinc-300 mb-6 leading-relaxed">
                  Um agente entra no projeto e o contexto vive unicamente no histórico de mensagens da LLM. Quando a janela fecha ou outro programador entra, a investigação recomeça do zero.
                </p>

                <div className="space-y-3 font-mono text-xs text-zinc-400 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 mb-6">
                  <div className="flex items-start gap-2 text-rose-400/90">
                    <span className="text-rose-500">✕</span>
                    <span>O que existe e o que já foi tentado? <em>(Desconhecido)</em></span>
                  </div>
                  <div className="flex items-start gap-2 text-rose-400/90">
                    <span className="text-rose-500">✕</span>
                    <span>Quais decisões arquiteturais foram tomadas? <em>(Presas no chat)</em></span>
                  </div>
                  <div className="flex items-start gap-2 text-rose-400/90">
                    <span className="text-rose-500">✕</span>
                    <span>Quais testes e critérios importam? <em>(Inferidos ad-hoc)</em></span>
                  </div>
                  <div className="flex items-start gap-2 text-rose-400/90">
                    <span className="text-rose-500">✕</span>
                    <span>Qual é o objetivo macro e onde continuar? <em>(Perdido no scroll)</em></span>
                  </div>
                </div>

                <div className="bg-black/60 rounded-xl p-4 border border-zinc-800 font-mono text-xs text-zinc-400">
                  <div className="text-zinc-500 text-[10px] mb-2 uppercase tracking-wider">Fluxo Típico Efémero:</div>
                  <div className="flex flex-col gap-1 text-zinc-400">
                    <div>1. Novo Chat aberto</div>
                    <div className="text-rose-400">2. LLM relê ficheiros aleatórios</div>
                    <div>3. Gera mutação sem baseline</div>
                    <div className="text-rose-400">4. LLM valida a si mesma &ldquo;Parece bom!&rdquo;</div>
                    <div className="text-zinc-600">5. Chat fecha → Contexto desintegrado</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] font-mono text-rose-400/80 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Risco: Regressões silenciosas, retrabalho e dependência do histórico do chat.
              </div>
            </motion.div>
          )}

          {/* Card: Com EvoPro */}
          {(viewMode === 'both' || viewMode === 'with') && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl bg-zinc-950/90 border border-emerald-500/30 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <HardDrive className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">Com EvoPro</h3>
                      <span className="text-xs font-mono text-emerald-400">Repository-Native Kernel</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    Persistente no Disco
                  </span>
                </div>

                <p className="text-sm text-zinc-300 mb-6 leading-relaxed">
                  O projeto carrega a sua própria estrutura evolutiva em <code className="text-emerald-400">.evolution/</code>. Qualquer agente compatível reconstrói o estado imediatamente através do <code className="text-zinc-200">CONTINUITY.md</code>.
                </p>

                <div className="space-y-3 font-mono text-xs text-zinc-300 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-700/60 mb-6">
                  <div className="flex items-start gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Enter Project:</strong> Deteta o kernel EvoPro no repositório.</span>
                  </div>
                  <div className="flex items-start gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Reconstruct State:</strong> Lê o estado real, gaps e histórico do ledger.</span>
                  </div>
                  <div className="flex items-start gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Understand Goal:</strong> Carrega critérios verificáveis do Global Goal.</span>
                  </div>
                  <div className="flex items-start gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Adversarial Pressure:</strong> Baseline State A/B + Gauntlet + Judge.</span>
                  </div>
                </div>

                <div className="bg-black/80 rounded-xl p-4 border border-zinc-800 font-mono text-xs">
                  <div className="text-zinc-500 text-[10px] mb-2 uppercase tracking-wider">Fluxo Governado do EvoPro:</div>
                  <div className="flex items-center gap-1.5 text-zinc-300 text-[11px] overflow-x-auto pb-1">
                    <span className="text-cyan-400 font-bold">ENTER</span>
                    <ArrowRight className="w-3 h-3 text-zinc-600 shrink-0" />
                    <span className="text-purple-400 font-bold">STATE</span>
                    <ArrowRight className="w-3 h-3 text-zinc-600 shrink-0" />
                    <span className="text-amber-400 font-bold">BASELINE</span>
                    <ArrowRight className="w-3 h-3 text-zinc-600 shrink-0" />
                    <span className="text-rose-400 font-bold">GAUNTLET</span>
                    <ArrowRight className="w-3 h-3 text-zinc-600 shrink-0" />
                    <span className="text-emerald-400 font-bold">JUDGE</span>
                    <ArrowRight className="w-3 h-3 text-zinc-600 shrink-0" />
                    <span className="text-white font-bold">PERSIST</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Vantagem: Continuidade garantida entre diferentes modelos, IDEs ou membros da equipa.
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
