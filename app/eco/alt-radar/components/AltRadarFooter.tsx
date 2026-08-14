'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { ALT_RADAR_CONFIG } from '@/data/alt-radar';
import { Radio, ShieldCheck, GitBranch, ArrowUp } from 'lucide-react';

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function AltRadarFooter() {
  const { theme } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-zinc-900 bg-black text-zinc-400 font-mono text-xs pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-zinc-900">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div 
                className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-black text-xs"
                style={{ backgroundColor: theme.colors.primary }}
              >
                AG
              </div>
              <span className="text-white font-bold tracking-tight text-sm">
                AG47 ALT RADAR
              </span>
            </div>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              Mecanismo determinístico de inteligência, descoberta de oportunidades e auditoria autônoma de smart contracts.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Nós RPC: 99.98% Operacionais</span>
            </div>
          </div>

          {/* Col 2: Ecossistema AG47 */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Ecossistema ECO
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/eco/alt-radar" className="hover:text-white transition-colors">
                  Alt Radar (Current)
                </Link>
              </li>
              <li>
                <Link href="/eco/evopro" className="hover:text-white transition-colors">
                  EvoPro Protocol
                </Link>
              </li>
              <li>
                <Link href="/labs" className="hover:text-white transition-colors">
                  Labs Experimental
                </Link>
              </li>
              <li>
                <Link href="/nexus" className="hover:text-white transition-colors">
                  Nexus Intelligence
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Documentação & API */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Recursos Técnicos
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a href="#cli" className="hover:text-white transition-colors">
                  CLI Reference
                </a>
              </li>
              <li>
                <a href="#scoring" className="hover:text-white transition-colors">
                  Fórmula de Score
                </a>
              </li>
              <li>
                <a href="#pipeline" className="hover:text-white transition-colors">
                  Pipeline 6 Etapas
                </a>
              </li>
              <li>
                <a href="#quickstart" className="hover:text-white transition-colors">
                  Guia Quick Start
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Links Externos */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Código & Comunidade
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a 
                  href={ALT_RADAR_CONFIG.gitHubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://ag47.pt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Agência 47 Official Website
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} Agência 47. Todos os direitos reservados.
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
