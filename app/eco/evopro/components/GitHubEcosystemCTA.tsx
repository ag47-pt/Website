'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { EVOPRO_CONFIG } from '@/data/evopro';
import { 
  ExternalLink, 
  ArrowRight, 
  Layers, 
  GitBranch, 
  ShieldCheck, 
  Sparkles,
  Cpu,
  Terminal
} from 'lucide-react';

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function GitHubEcosystemCTA() {
  const { theme } = useTheme();

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id="ecosystem" className="py-20 md:py-32 border-t border-white/5 relative overflow-hidden">
      {/* Background glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-15 blur-[120px] rounded-full pointer-events-none"
        style={{ backgroundColor: theme.colors.primary }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* AG47 Eco Context Grid */}
        <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-8 sm:p-12 mb-16 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-zinc-900 text-zinc-300 border border-zinc-800 mb-4">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                AG47 ECOSYSTEM ARCHITECTURE
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4">
                O EvoPro no Ecossistema AG47
              </h3>
              <p className="text-zinc-300 text-sm sm:text-base font-sans leading-relaxed mb-6">
                A <strong>Agência 47</strong> desenvolve software de alta performance, plataformas e inteligência autónoma. Dentro do setor <strong>ECO</strong>, o EvoPro atua como o protocolo estruturante de governança que pode ser instalado em qualquer produto para garantir evolução contínua, continuidade entre agentes e integridade arquitetural.
              </p>

              <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
                <span className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-bold">AG47</span>
                <ArrowRight className="w-4 h-4 text-zinc-600" />
                <span className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400 font-bold">ECO</span>
                <ArrowRight className="w-4 h-4 text-zinc-600" />
                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">EvoPro</span>
              </div>
            </div>

            {/* GitHub Official Card */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-zinc-900/90 border border-zinc-700/80 shadow-xl font-mono text-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <GithubIcon className="w-5 h-5 text-white" />
                  <span className="font-bold text-white text-sm">ag47-evolution-protocol</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Open Source
                </span>
              </div>

              <div className="space-y-2 text-zinc-300 mb-6 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Versão Atual:</span>
                  <span className="font-bold text-white">v{EVOPRO_CONFIG.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Licença:</span>
                  <span>{EVOPRO_CONFIG.license} (Agência 47 Labs)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Target Python:</span>
                  <span>&gt;= 3.10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Dependências do Core:</span>
                  <span>jsonschema &gt;= 4.0.0 (Zero Bloat)</span>
                </div>
              </div>

              <a
                href={EVOPRO_CONFIG.gitHubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider transition-all hover:bg-zinc-200 active:scale-95 shadow-md"
              >
                <span>Aceder ao Repositório</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Final CTA Banner */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Give your repository a way to continue.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans mb-8">
            Instale o Evolution Protocol hoje mesmo e garanta que a evolução do seu software pertence ao seu repositório.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollTo('quickstart')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-black transition-all hover:scale-105 active:scale-95 shadow-2xl cursor-pointer"
              style={{ backgroundColor: theme.colors.primary }}
            >
              Instalar EvoPro
            </button>

            <a
              href={EVOPRO_CONFIG.gitHubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-mono font-semibold text-xs uppercase tracking-wider bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 transition-all hover:scale-105 active:scale-95"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Ver Código-Fonte</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
