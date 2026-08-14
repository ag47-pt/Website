'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { ALT_RADAR_CONFIG } from '@/data/alt-radar';
import { 
  Radar, 
  ArrowRight, 
  Check, 
  Copy, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Sparkles,
  Radio, 
  Zap, 
  Terminal,
  Activity,
  Gauge
} from 'lucide-react';

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

// Som sintético canónico EvoPro Web Audio API
const playSynthSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1040, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Fallback silencioso
  }
};

export function AltRadarHero() {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText(ALT_RADAR_CONFIG.quickRunCommand);
    playSynthSound();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id="overview" className="relative pt-28 pb-20 md:pt-36 lg:pt-40 md:pb-28 overflow-hidden">
      {/* Grid Pattern Backdrop */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808020_1px,transparent_1px),linear-gradient(to_bottom,#80808020_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] blur-[150px] rounded-full pointer-events-none opacity-25"
          style={{ backgroundColor: theme.colors.primary }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Eyebrow & Version Pill */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-zinc-900/90 text-zinc-300 border border-zinc-800 shadow-sm">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.colors.primary }} />
              AG47 / ECO / ALT-RADAR
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              <Sparkles className="w-3 h-3" />
              v{ALT_RADAR_CONFIG.version} Real-Time & Zero-Trust
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] mb-6"
          >
            Autonomous Altcoin Intelligence.{' '}
            <span 
              className="bg-clip-text text-transparent"
              style={{ 
                backgroundImage: `linear-gradient(135deg, #ffffff 30%, ${theme.colors.primary} 100%)` 
              }}
            >
              Zero-Trust Security.
            </span>
          </motion.h1>

          {/* Core Mantra */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg font-mono text-zinc-300 font-medium tracking-tight mb-6 px-4 py-2 rounded-xl bg-zinc-900/50 border border-white/10 backdrop-blur-sm"
          >
            &ldquo;{ALT_RADAR_CONFIG.tagline}&rdquo;
          </motion.div>

          {/* Subtitle / Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg text-zinc-400 max-w-2xl font-light leading-relaxed mb-8"
          >
            Detecção sub-segundo de novos pools de liquidez em Solana e EVM com simulação transacional de honeypot, clusterização de smart money e pontuação explicável de 0 a 100.
          </motion.p>

          {/* Copyable Quick-Run Terminal Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-xl mb-10"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 bg-zinc-950/90 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-xl group hover:border-zinc-700 transition-all">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Terminal className="w-4 h-4 text-zinc-500 shrink-0" />
                <code className="text-xs sm:text-sm font-mono text-zinc-300 truncate select-all">
                  {ALT_RADAR_CONFIG.quickRunCommand}
                </code>
              </div>
              <button
                onClick={copyCommand}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-all shrink-0 cursor-pointer active:scale-95"
                title="Copiar comando"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/eco/alt-radar?tab=dashboard"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-mono text-sm font-bold text-black shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Gauge className="w-4 h-4" />
              <span>Abrir Dashboard da Plataforma</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => scrollTo('stream-feed')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl font-mono text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 cursor-pointer shadow-sm"
            >
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Stream Telemetria</span>
            </button>

            <a
              href={ALT_RADAR_CONFIG.gitHubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl font-mono text-sm font-medium bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800/80 transition-all duration-200"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Ver no GitHub</span>
            </a>
          </motion.div>

          {/* Stats Ribbon (EvoPro High Density Grid) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 text-left"
          >
            {ALT_RADAR_CONFIG.metrics.map((metric, idx) => (
              <div 
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 backdrop-blur-md hover:border-zinc-700/80 transition-all group"
              >
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                  <span className="truncate">{metric.label}</span>
                  {metric.change && (
                    <span 
                      className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold"
                      style={{ 
                        backgroundColor: `${theme.colors.primary}15`,
                        color: theme.colors.primary 
                      }}
                    >
                      {metric.change}
                    </span>
                  )}
                </div>
                <div 
                  className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight mb-1 group-hover:scale-105 transition-transform origin-left"
                  style={{ color: idx === 0 ? theme.colors.primary : undefined }}
                >
                  {metric.value}
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                  {metric.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
