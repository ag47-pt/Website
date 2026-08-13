'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { USE_CASES } from '@/data/evopro';
import { 
  Layers, 
  Sparkles, 
  GitCompare, 
  FlaskConical, 
  Cpu, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export function UseCasesSection() {
  const { theme } = useTheme();

  const getIcon = (title: string) => {
    if (title.includes('Existentes')) return Layers;
    if (title.includes('Novos')) return Sparkles;
    if (title.includes('Handoff')) return GitCompare;
    if (title.includes('Laboratórios')) return FlaskConical;
    return Cpu;
  };

  return (
    <section id="use-cases" className="py-16 md:py-24 border-t border-white/5 relative bg-zinc-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
            <Layers className="w-3.5 h-3.5" />
            CENÁRIOS REAIS DE APLICAÇÃO
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Casos de Uso
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Desde repositórios em produção até protótipos e laboratórios de investigação em auto-evolução governada.
          </p>
        </div>

        {/* 5 Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs mb-12">
          {USE_CASES.map((uc, idx) => {
            const Icon = getIcon(uc.title);
            const isSelfHosting = uc.title.includes('Self-Hosting');

            return (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`p-6 sm:p-8 rounded-3xl border flex flex-col justify-between backdrop-blur-xl shadow-xl ${
                  isSelfHosting 
                    ? 'bg-zinc-950 border-purple-500/40 shadow-2xl' 
                    : 'bg-zinc-950/80 border-zinc-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-emerald-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelfHosting && (
                      <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 font-bold">
                        Experimental / Lab
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight mb-2">
                    {uc.title}
                  </h3>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                    {uc.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-zinc-800 text-[11px] text-zinc-500 flex items-center justify-between">
                  <span>Pronto para governar</span>
                  <span className="text-emerald-400 font-bold">Host Compatível</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
