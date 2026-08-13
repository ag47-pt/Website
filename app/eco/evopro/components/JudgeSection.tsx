'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { JUDGE_VERDICTS } from '@/data/evopro';
import { 
  Scale, 
  CheckCircle2, 
  RotateCcw, 
  RefreshCw, 
  Ban, 
  ArrowRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

export function JudgeSection() {
  const { theme } = useTheme();

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'ACCEPT': return CheckCircle2;
      case 'REVISE': return RefreshCw;
      case 'ROLLBACK': return RotateCcw;
      case 'BLOCKED': return Ban;
      default: return Scale;
    }
  };

  return (
    <section id="judge" className="py-16 md:py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
            <Scale className="w-3.5 h-3.5" />
            DECISÃO DETERMINÍSTICA E ORDENADA
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            O Judge
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Enquanto o Validador pergunta <em>&ldquo;o executor disse a verdade?&rdquo;</em>, o Judge responde <em>&ldquo;esta mutação deve sobreviver?&rdquo;</em>. As regras são ordenadas e determinísticas: as mesmas evidências geram o mesmo veredito em qualquer harness.
          </p>
        </div>

        {/* 4 Verdict Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {JUDGE_VERDICTS.map((item) => {
            const Icon = getVerdictIcon(item.verdict);

            return (
              <motion.div
                key={item.verdict}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-zinc-800 backdrop-blur-xl flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/80">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${item.badgeClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className={`text-xs font-mono px-2.5 py-0.5 rounded font-bold border ${item.badgeClass}`}>
                          {item.verdict}
                        </span>
                        <h3 className="text-lg font-bold text-white tracking-tight mt-1">{item.title}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 font-mono text-xs mb-6">
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase tracking-wider block mb-0.5">Condição Disparadora:</span>
                      <p className="text-zinc-300 font-sans text-xs leading-relaxed bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                        {item.when}
                      </p>
                    </div>

                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase tracking-wider block mb-0.5">Ação Subsequente do Kernel:</span>
                      <p className="text-zinc-300 font-sans text-xs leading-relaxed bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                        {item.action}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>Regra Ordenada</span>
                  <span className="text-zinc-400">Veredito com justificativa & evidências</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Rule Invariant Highlight */}
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 font-mono text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong>Imparcialidade Garantida:</strong> Uma mutação sem revisão do Gauntlet gera <code className="text-blue-400">BLOCKED</code> imediato. O Judge nunca concede aprovações por omissão.
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 shrink-0">
            <code>evolution judge</code>
          </div>
        </div>
      </div>
    </section>
  );
}
