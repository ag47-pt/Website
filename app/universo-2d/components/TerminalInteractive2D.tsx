'use client';

import React, { useState, useEffect } from 'react';
import { UNIVERSO_2D_DATA } from '@/data/universo-2d';
import { 
  Terminal, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Play, 
  CornerDownLeft 
} from 'lucide-react';

interface TerminalInteractive2DProps {
  onCopyFeedback?: () => void;
}

export function TerminalInteractive2D({ onCopyFeedback }: TerminalInteractive2DProps) {
  const { terminalCommands } = UNIVERSO_2D_DATA;
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Som sintético Web Audio API (EvoPro Standard)
  const playSound = (freq = 440, type: OscillatorType = 'sine') => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Fallback silencioso
    }
  };

  // Atalhos de teclado 1-5
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Não disparar se o usuário estiver digitando em um input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (terminalCommands[idx]) {
          setActiveIdx(idx);
          playSound(520 + idx * 80);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMuted, terminalCommands]);

  const currentCmd = terminalCommands[activeIdx] || terminalCommands[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCmd.command);
    setCopied(true);
    playSound(880, 'triangle');
    if (onCopyFeedback) onCopyFeedback();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="terminal" className="py-20 px-4 sm:px-6 relative border-t border-zinc-800/60">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Terminal className="w-3.5 h-3.5" />
              <span>06. TERMINAL INTERATIVO CLI</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Console de Comando do Ecossistema
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
              Dica: Use as teclas [1-5] do teclado
            </span>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title={isMuted ? 'Ativar Efeitos Sonoros' : 'Mutar Efeitos Sonoros'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Terminal Window Container */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Terminal Window Top Bar */}
          <div className="flex items-center justify-between px-5 py-3 bg-zinc-900/90 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-zinc-400 ml-2 font-medium">
                ag47-cli — zsh — 80x24
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Terminal Tabs (Teclas 1 a 5) */}
          <div className="flex items-center gap-1 p-2 bg-zinc-900/50 border-b border-zinc-800/80 overflow-x-auto no-scrollbar">
            {terminalCommands.map((cmd, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveIdx(idx);
                    playSound(500 + idx * 70);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80 border border-transparent'
                  }`}
                >
                  <span className="w-4 h-4 rounded bg-zinc-950 flex items-center justify-center text-[10px] text-zinc-500 font-bold border border-zinc-800">
                    {cmd.shortcut}
                  </span>
                  <span>{cmd.command}</span>
                </button>
              );
            })}
          </div>

          {/* Terminal Body */}
          <div className="p-6 sm:p-8 font-mono text-xs sm:text-sm bg-black/90 min-h-[280px] flex flex-col justify-between">
            <div>
              {/* Command Input Prompt */}
              <div className="flex items-center gap-2 text-zinc-300 mb-4 pb-3 border-b border-zinc-900">
                <span className="text-emerald-400 font-bold">visitor@ag47.pt:~$</span>
                <span className="text-white font-bold">{currentCmd.command}</span>
                <span className="w-2 h-4 bg-emerald-400 animate-pulse ml-1 inline-block" />
              </div>

              {/* Output Lines */}
              <div className="space-y-1.5 text-zinc-300 font-mono">
                {currentCmd.outputLines.map((line, lIdx) => (
                  <div key={lIdx} className="leading-relaxed">
                    {line.startsWith('⚡') || line.startsWith('📦') || line.startsWith('🪐') || line.startsWith('💎') || line.startsWith('🔍') ? (
                      <span className="text-emerald-400 font-bold">{line}</span>
                    ) : line.includes('[+]') || line.includes('PASSED') ? (
                      <span className="text-teal-300">{line}</span>
                    ) : line.includes('STARTER') || line.includes('GROWTH') || line.includes('SCALE') ? (
                      <span className="text-cyan-300 font-semibold">{line}</span>
                    ) : (
                      <span className="text-zinc-400">{line}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Description Footer */}
            <div className="mt-6 pt-3 border-t border-zinc-900 text-[11px] text-zinc-500 flex items-center justify-between">
              <span>{currentCmd.description}</span>
              <span className="text-zinc-600 font-mono">Pressione [1-5] para alternar</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
