'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { GUARDRAILS_LIST } from '@/data/evopro';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Sliders, 
  RotateCcw, 
  Lock, 
  Activity,
  Flame
} from 'lucide-react';

export function GuardrailsSection() {
  const { theme } = useTheme();

  return (
    <section id="guardrails" className="py-16 md:py-24 border-t border-white/5 relative bg-zinc-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-4">
            <ShieldAlert className="w-3.5 h-3.5" />
            SAFETY LIMITS & STOP CONDITIONS
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Guardrails e Condições de Paragem
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans font-medium">
            &ldquo;Autonomy without stop conditions is just an expensive infinite loop.&rdquo;
          </p>
          <p className="text-zinc-500 text-xs sm:text-sm font-sans mt-2">
            O EvoPro monitoriza continuamente o progresso real e interrompe a autonomia de forma segura perante qualquer indício de oscilação, estagnação ou crescimento descontrolado.
          </p>
        </div>

        {/* 8 Guardrails Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 font-mono text-xs">
          {GUARDRAILS_LIST.map((g) => (
            <motion.div
              key={g.condition}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800 backdrop-blur-xl flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{g.condition}</span>
                  </div>
                  {g.configurable ? (
                    <span className="text-[9px] text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                      Configurável
                    </span>
                  ) : (
                    <span className="text-[9px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                      Invariante
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Dispara Quando:</span>
                    <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">{g.tripsWhen}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-zinc-800/80 text-[10px] text-zinc-400">
                <span className="text-zinc-500">Ação: </span>
                <span className="text-zinc-300 font-sans">{g.action}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fingerprinting & Repeat Attempt Protection */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 backdrop-blur-xl font-mono text-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">
                Deteção de Tentativas Repetidas
              </span>
              <h3 className="text-lg font-bold text-white mb-2">
                Fingerprinting por Intenção e Caminhos Modificados
              </h3>
              <p className="text-zinc-400 font-sans text-xs leading-relaxed">
                As hipóteses de mutação são identificadas pela assinatura da sua intenção e caminhos tocados, e não apenas pelo ID gerado. Se um agente tentar repropor a mesma solução falhada sob um novo ID, o EvoPro deteta a repetição e rejeita imediatamente.
              </p>
            </div>

            <div className="px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 shrink-0">
              <code>evolution guardrails show</code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
