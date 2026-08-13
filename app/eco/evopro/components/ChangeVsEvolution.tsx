'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  Scale, 
  ArrowRight, 
  AlertOctagon, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export function ChangeVsEvolution() {
  const { theme } = useTheme();

  return (
    <section id="baseline" className="py-16 md:py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
            <Scale className="w-3.5 h-3.5" />
            MEDICÃO DETERMINÍSTICA DE BASELINE
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Change ≠ Evolution
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Produzir código não significa melhorar software. O EvoPro mede o estado exato antes da mutação (<span className="text-amber-400 font-mono">STATE A</span>) e após a mutação (<span className="text-amber-400 font-mono">STATE B</span>).
          </p>
        </div>

        {/* Visual Pipeline of Measurement */}
        <div className="rounded-3xl bg-zinc-950/80 border border-zinc-800 p-6 sm:p-10 mb-12 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center font-mono">
            {/* Box: State A */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-700/80 text-center">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Ponto de Partida</span>
              <div className="text-lg font-bold text-white mb-2">STATE A</div>
              <div className="text-xs text-zinc-400 space-y-1">
                <div>• Métricas estruturais</div>
                <div>• Testes & Exit codes</div>
                <div>• Baseline antes da mutação</div>
              </div>
            </div>

            {/* Transition: Mutation */}
            <div className="flex flex-col items-center justify-center py-2 text-center">
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest mb-1">Ação do Agente</span>
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                <span>MUTATION</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] text-zinc-500 mt-1">Branch isolado</span>
            </div>

            {/* Box: State B */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-700/80 text-center">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Estado Pós-Execução</span>
              <div className="text-lg font-bold text-white mb-2">STATE B</div>
              <div className="text-xs text-zinc-400 space-y-1">
                <div>• Novas métricas medidas</div>
                <div>• Novos resultados de teste</div>
                <div>• Baseline após a mutação</div>
              </div>
            </div>

            {/* Comparison / Verdict */}
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center">
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest block mb-1">Módulo de Baseline</span>
              <div className="text-lg font-bold text-emerald-400 mb-2">COMPARE A B</div>
              <div className="text-xs text-emerald-300/80 space-y-1">
                <div>• Classificação dimensional</div>
                <div>• Verificação de regressões</div>
                <div>• is_improvement tri-valorado</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Classification Dimensions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 font-mono">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-rose-500/30">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-2">
              <TrendingDown className="w-4 h-4" />
              <span>REGRESSION</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Métrica comportamental piorou, testes quebraram ou o crescimento estrutural excedeu o teto seguro.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>IMPROVEMENT</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Critérios de sucesso adicionais foram satisfeitos e nenhum teste existente regrediu.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-700/80">
            <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm mb-2">
              <Minus className="w-4 h-4" />
              <span>UNCHANGED</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              A dimensão foi medida em ambos os lados e permaneceu estável dentro das tolerâncias do contrato.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-amber-500/30">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>UNCOMPARABLE</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Uma dimensão que não pôde ser medida em ambos os estados. <strong>Nunca é uma aprovação silenciosa</strong>.
            </p>
          </div>
        </div>

        {/* Three-Valued Logic Callout */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest block mb-1">
                Lógica Invariante do Kernel
              </span>
              <h3 className="text-xl font-bold text-white mb-2">
                A variável <code className="text-amber-400">is_improvement</code> é estritamente tri-valorada:
              </h3>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                No EvoPro, a ausência de evidência não é lida como sucesso. Se não for possível provar melhoria ou se houver regressão, o protocolo não finge evolução para agradar ao utilizador.
              </p>
            </div>

            <div className="flex flex-col gap-2 font-mono text-xs w-full md:w-auto shrink-0">
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span><code className="text-emerald-400">True</code> — Melhoria comprovada sem regressão</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span><code className="text-rose-400">False</code> — Regressões foram detetadas</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span><code className="text-amber-400">None</code> — Evidência insuficiente para conclusão</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
