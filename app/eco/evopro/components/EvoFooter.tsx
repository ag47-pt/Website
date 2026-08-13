'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { EVOPRO_CONFIG } from '@/data/evopro';
import { Terminal, ArrowUp, Volume2, VolumeX } from 'lucide-react';

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function EvoFooter() {
  const { theme } = useTheme();
  const [soundMuted, setSoundMuted] = useState(false);

  useEffect(() => {
    const isMuted = localStorage.getItem('evopro_sound_muted') === 'true';
    setSoundMuted(isMuted);
  }, []);

  const toggleSound = () => {
    const nextState = !soundMuted;
    setSoundMuted(nextState);
    localStorage.setItem('evopro_sound_muted', String(nextState));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-black pt-12 pb-16 relative z-10 text-zinc-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-black text-xs tracking-tighter"
                style={{ backgroundColor: theme.colors.primary }}
              >
                AG
              </div>
              <span className="font-bold text-white text-sm tracking-wider">EVOPRO — EVOLUTION PROTOCOL</span>
            </div>
            <p className="text-zinc-400 text-xs font-sans max-w-md leading-relaxed">
              O protocolo determinístico para software que sabe como continuar a evoluir. Desenvolvido pelo setor de investigação e engenharia da <strong>Agência 47 Labs</strong>.
            </p>
            <div className="text-[11px] text-zinc-500">
              MIT License • Copyright © {EVOPRO_CONFIG.copyright}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <span className="text-white font-bold text-[11px] uppercase tracking-wider block mb-3">Protocolo</span>
            <div><a href="#lifecycle" className="hover:text-white transition-colors">Lifecycle Pipeline</a></div>
            <div><a href="#baseline" className="hover:text-white transition-colors">Baseline & Judge</a></div>
            <div><a href="#gauntlet" className="hover:text-white transition-colors">Gauntlet Critics</a></div>
            <div><a href="#graph" className="hover:text-white transition-colors">Code Graph (AST)</a></div>
            <div><a href="#cli" className="hover:text-white transition-colors">CLI Reference</a></div>
          </div>

          {/* Col 3: Ecosystem Links */}
          <div className="space-y-2">
            <span className="text-white font-bold text-[11px] uppercase tracking-wider block mb-3">Ecossistema AG47</span>
            <div><Link href="/" className="hover:text-white transition-colors">Página Principal (AG47)</Link></div>
            <div><Link href="/labs" className="hover:text-white transition-colors">Agência 47 Labs</Link></div>
            <div><Link href="/rest" className="hover:text-white transition-colors">Rest.AG Ecosystem</Link></div>
            <div><Link href="/servicos" className="hover:text-white transition-colors">Serviços Digitais</Link></div>
            <div><a href={EVOPRO_CONFIG.gitHubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5"><GithubIcon className="w-3.5 h-3.5" /> <span>GitHub Oficial</span></a></div>
          </div>
        </div>

        {/* Bottom HUD Bar */}
        <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-zinc-500">
          <div className="flex flex-wrap items-center gap-4">
            <span>KERNEL_VERSION: v{EVOPRO_CONFIG.version}</span>
            <span>STATUS: GOAL_DRIVEN_ACTIVE</span>
            <span>HOST: AG47_OFFICIAL_WEBSITE</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleSound}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer"
              title={soundMuted ? 'Ativar Efeitos Sonoros' : 'Mutar Efeitos Sonoros'}
            >
              {soundMuted ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
              <span>{soundMuted ? 'SOUND: OFF' : 'SOUND: ON'}</span>
            </button>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Voltar ao topo</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
