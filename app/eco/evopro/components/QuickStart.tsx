'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { EVOPRO_CONFIG } from '@/data/evopro';
import { 
  Play, 
  Copy, 
  Check, 
  Terminal, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  Download
} from 'lucide-react';

export function QuickStart() {
  const { theme } = useTheme();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const steps = [
    {
      num: '01',
      title: 'Instalar o Protocolo',
      desc: 'Instale o pacote EvoPro via pip diretamente do repositório oficial.',
      cmd: 'pip install git+https://github.com/ag47-pt/ag47-evolution-protocol.git'
    },
    {
      num: '02',
      title: 'Verificar Saúde do Ambiente',
      desc: 'Valide a instalação, integridade dos schemas JSON e dependências.',
      cmd: 'evolution doctor'
    },
    {
      num: '03',
      title: 'Inicializar o Host',
      desc: 'Navegue para o seu projeto e inicialize a árvore .evolution/ e o contrato.',
      cmd: 'evolution init'
    },
    {
      num: '04',
      title: 'Diagnosticar e Mapear Realidade',
      desc: 'Execute o Observer e o spec engine para mapear arquivos, gaps e scope.',
      cmd: 'evolution inspect && evolution spec --regenerate'
    },
    {
      num: '05',
      title: 'Definir o Global Goal',
      desc: 'Estabeleça o objetivo mensurável com critérios verificáveis derivados do host.',
      cmd: 'evolution goal set "Construir a primeira versão estável deste serviço"'
    },
    {
      num: '06',
      title: 'Iniciar Evolução Governada',
      desc: 'Execute o loop no modo desejado a partir do terminal ou do seu agente de IA.',
      cmd: 'evolution run --mode goal-driven'
    }
  ];

  const playCopySound = () => {
    try {
      if (typeof localStorage !== 'undefined' && localStorage.getItem('evopro_sound_muted') === 'true') return;
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Ignora silenciosamente se o navegador proibir áudio automático
    }
  };

  const handleCopy = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    playCopySound();
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadDocs = () => {
    const markdownContent = `# Evolution Protocol (EvoPro) v0.3.0 — Executive Spec & Guide
    
Repository-native, harness-agnostic, model-agnostic, goal-driven and evidence-based governance protocol for software evolution assisted by AI coding agents.

## Quick Installation
\`\`\`bash
pip install git+https://github.com/ag47-pt/ag47-evolution-protocol.git
evolution doctor
evolution init
\`\`\`

## Core CLI Commands
- \`evolution status\`: Inspection of active state and Global Goal progress
- \`evolution inspect\`: Observer diagnosis of workspace structure and gaps
- \`evolution goal set "<objective>"\`: Set measurable Global Goal
- \`evolution baseline measure\`: Capture State A baseline metrics
- \`evolution gauntlet run\`: Execute 12 adversarial critics
- \`evolution judge\`: Evaluate deterministic verdicts (ACCEPT, REVISE, ROLLBACK, BLOCKED)
- \`evolution run --mode goal-driven\`: Run autonomous goal-driven loop

-- Developed by Agência 47 Labs (https://ag47.pt/eco/evopro)
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'evopro-spec-v0.3.0.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="quickstart" className="py-16 md:py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
            <Play className="w-3.5 h-3.5" />
            COMEÇAR EM MENOS DE 2 MINUTOS
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Quick Start Guide
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans mb-6">
            Do primeiro comando ao primeiro ciclo governado pelo Judge em qualquer repositório.
          </p>

          <button
            onClick={downloadDocs}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono border border-zinc-700/80 transition-all active:scale-95 cursor-pointer shadow"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Descarregar Specs (.md)</span>
          </button>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className={`p-6 rounded-3xl bg-zinc-950/80 backdrop-blur-xl flex flex-col justify-between shadow-xl transition-all duration-300 ${
                copiedIndex === idx 
                  ? 'border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.35)] scale-[1.02]' 
                  : 'border border-zinc-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-white/20">{step.num}</span>
                  <span className="text-[10px] text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-semibold">
                    Passo {idx + 1}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                  {step.desc}
                </p>
              </div>

              {/* Code Snippet */}
              <div className="pt-3 border-t border-zinc-800">
                <div className={`flex items-center justify-between rounded-xl p-3 border transition-all ${
                  copiedIndex === idx 
                    ? 'bg-emerald-950/40 border-emerald-500/50' 
                    : 'bg-zinc-900/90 border-zinc-700/80'
                }`}>
                  <code className="text-xs text-emerald-400 truncate max-w-[200px] sm:max-w-[240px]">
                    {step.cmd}
                  </code>
                  <button
                    onClick={() => handleCopy(step.cmd, idx)}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer shrink-0 ml-2 ${
                      copiedIndex === idx 
                        ? 'bg-emerald-500 text-black font-bold shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white'
                    }`}
                    title="Copiar comando"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
