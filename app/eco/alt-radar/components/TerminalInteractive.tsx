'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { ALT_RADAR_CONFIG, TerminalTabItem } from '@/data/alt-radar';
import { 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  Layers, 
  Activity, 
  ShieldCheck, 
  Network, 
  Sparkles,
  Zap
} from 'lucide-react';

const playSynthSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Fallback
  }
};

export function TerminalInteractive() {
  const { theme } = useTheme();
  const [activeTabId, setActiveTabId] = useState<string>('scan');
  const [copied, setCopied] = useState(false);

  const tabs = ALT_RADAR_CONFIG.terminalTabs;
  const currentTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // Atalhos de Teclado 1-5
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora se estiver digitando em input ou textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (tabs[idx]) {
          setActiveTabId(tabs[idx].id);
          playSynthSound();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tabs]);

  const copyOutput = () => {
    navigator.clipboard.writeText(currentTab.output);
    playSynthSound();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="terminal-demo" className="relative py-20 md:py-32 overflow-hidden border-t border-zinc-900">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold mb-4 border"
            style={{ 
              backgroundColor: `${theme.colors.primary}10`,
              borderColor: `${theme.colors.primary}30`,
              color: theme.colors.primary 
            }}
          >
            <Terminal className="w-3.5 h-3.5" />
            CLI DE BAIXO NÍVEL & LIVE RUNTIME
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Terminal Interativo do Alt Radar
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Experimente as saídas reais geradas pelos módulos de auditoria e scanning. Use as teclas numéricas <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-white font-mono text-xs">1</code> a <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-white font-mono text-xs">5</code> no teclado para alternar instantaneamente.
          </p>
        </div>

        {/* Terminal Window Container */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden backdrop-blur-2xl">
          {/* Terminal Title Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-zinc-900/90 border-b border-zinc-800/80">
            {/* macOS Dots */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/50" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/50" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/50" />
              <span className="ml-2 text-xs font-mono text-zinc-400 font-bold hidden sm:inline">
                ag47-alt-radar-daemon v1.0.0
              </span>
            </div>

            {/* Terminal Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {tabs.map((tab, idx) => {
                const isActive = tab.id === activeTabId;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTabId(tab.id);
                      playSynthSound();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer ${
                      isActive 
                        ? 'bg-zinc-800 text-white font-bold border border-zinc-700 shadow-sm' 
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                    }`}
                    style={{
                      borderColor: isActive ? theme.colors.primary : undefined,
                      color: isActive ? theme.colors.primary : undefined
                    }}
                  >
                    <span className="opacity-60 mr-1.5 font-bold">[{idx + 1}]</span>
                    <span>{tab.title.split('. ')[1]}</span>
                  </button>
                );
              })}
            </div>

            {/* Copy Output Button */}
            <button
              onClick={copyOutput}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors shrink-0 cursor-pointer"
              title="Copiar saída do terminal"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copiar Saída</span>
                </>
              )}
            </button>
          </div>

          {/* Active Command Prompt */}
          <div className="px-6 py-3 bg-black/60 border-b border-zinc-900 flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span className="text-emerald-400 font-bold">$</span>
            <span className="text-zinc-200 font-bold">{currentTab.command}</span>
          </div>

          {/* Terminal Console Output */}
          <div className="p-6 bg-[#04080c] font-mono text-xs sm:text-sm text-zinc-300 overflow-x-auto min-h-[300px] leading-relaxed select-text">
            <pre className="whitespace-pre font-mono">
              {currentTab.output}
            </pre>
          </div>

          {/* Terminal Footer Bar */}
          <div className="px-6 py-2.5 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Process ID: #PID-8491 (Online)</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              IPC Stream Sync: 240 fps
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
