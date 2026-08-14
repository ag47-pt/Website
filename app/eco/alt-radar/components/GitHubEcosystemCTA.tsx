'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { ALT_RADAR_CONFIG } from '@/data/alt-radar';
import { 
  GitBranch, 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Terminal,
  ExternalLink
} from 'lucide-react';

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

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
    // Fallback
  }
};

export function GitHubEcosystemCTA() {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const cloneCommand = `git clone ${ALT_RADAR_CONFIG.gitHubUrl}.git`;

  const copyClone = () => {
    navigator.clipboard.writeText(cloneCommand);
    playSynthSound();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="ecosystem" className="relative py-20 md:py-32 overflow-hidden border-t border-zinc-900">
      {/* Background Cosmic Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div 
          className="w-[700px] h-[350px] blur-[160px] rounded-full opacity-20"
          style={{ backgroundColor: theme.colors.primary }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div 
          className="p-8 sm:p-14 rounded-3xl bg-zinc-950 border backdrop-blur-2xl shadow-2xl relative overflow-hidden"
          style={{ borderColor: `${theme.colors.primary}40` }}
        >
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border"
              style={{ 
                backgroundColor: `${theme.colors.primary}15`,
                borderColor: `${theme.colors.primary}30`,
                color: theme.colors.primary 
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              INTEGRAÇÃO NATIVA NO ECOSSISTEMA AG47
            </span>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Pronto para elevar o seu nível de inteligência on-chain?
            </h2>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
              Clone o repositório, rode o scanner localmente ou conecte suas aplicações via Webhooks e WebSockets.
            </p>

            {/* Copyable Git Clone Box */}
            <div className="w-full max-w-xl p-3 sm:p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between gap-3 font-mono text-xs shadow-inner">
              <div className="flex items-center gap-2 overflow-hidden">
                <Terminal className="w-4 h-4 text-zinc-500 shrink-0" />
                <code className="text-zinc-300 truncate select-all">{cloneCommand}</code>
              </div>
              <button
                onClick={copyClone}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors shrink-0 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href={ALT_RADAR_CONFIG.gitHubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-mono text-sm font-bold text-black shadow-lg transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <GithubIcon className="w-4 h-4" />
                <span>Explorar no GitHub</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/eco/evopro"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-mono text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-all duration-200"
              >
                <GitBranch className="w-4 h-4 text-cyan-400" />
                <span>Conhecer o EvoPro</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
