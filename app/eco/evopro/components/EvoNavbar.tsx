'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { EVOPRO_CONFIG } from '@/data/evopro';
import { 
  Terminal, 
  Layers, 
  ShieldAlert, 
  GitBranch, 
  Play, 
  BookOpen, 
  Menu, 
  X,
  Compass,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

interface EvoNavbarProps {
  activeSection: string;
}

export function EvoNavbar({ activeSection }: EvoNavbarProps) {
  const { theme, themeName, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'overview', label: 'Visão Geral', icon: Compass },
    { id: 'problem', label: 'Comparativo', icon: Layers },
    { id: 'lifecycle', label: 'Ciclo 10 Etapas', icon: Layers },
    { id: 'baseline', label: 'Baseline & Judge', icon: ShieldAlert },
    { id: 'gauntlet', label: 'Gauntlet Critics', icon: ShieldAlert },
    { id: 'goal', label: 'Global Goal', icon: Compass },
    { id: 'architecture', label: 'Arquitetura Core', icon: GitBranch },
    { id: 'host-model', label: 'Host Model', icon: GitBranch },
    { id: 'harnesses', label: 'Harness Agnostic', icon: Terminal },
    { id: 'continuity', label: 'Continuity Flow', icon: Play },
    { id: 'modes', label: 'Modos de Execução', icon: Terminal },
    { id: 'graph', label: 'Graph Intel', icon: Terminal },
    { id: 'quickstart', label: 'Quick Start', icon: Play },
    { id: 'terminal-demo', label: 'Terminal Interativo', icon: Terminal },
    { id: 'ide-chat', label: 'IDE Chat Flow', icon: BookOpen },
    { id: 'cli', label: 'CLI Reference', icon: BookOpen },
    { id: 'capabilities', label: 'Matriz de Capacidades', icon: Layers },
    { id: 'guardrails', label: 'Guardrails', icon: ShieldAlert },
    { id: 'observability', label: 'Auditoria & Ledger', icon: BookOpen },
    { id: 'use-cases', label: 'Casos de Uso', icon: Compass },
    { id: 'status', label: 'Status & Roadmap', icon: Layers },
    { id: 'ecosystem', label: 'Ecossistema AG47', icon: GitBranch }
  ];

  // Centraliza o botão ativo no carrossel quando muda a secção ativa
  useEffect(() => {
    centerActiveButton(activeSection);
  }, [activeSection]);

  const centerActiveButton = (id: string) => {
    const container = carouselRef.current;
    const btn = buttonRefs.current[id];
    if (container && btn) {
      const btnLeft = btn.offsetLeft;
      const btnWidth = btn.offsetWidth;
      const containerWidth = container.offsetWidth;
      const targetScroll = btnLeft - containerWidth / 2 + btnWidth / 2;
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    centerActiveButton(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -180 : 180;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl py-2.5' 
          : 'bg-black/40 backdrop-blur-md border-b border-white/5 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="group flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-black text-xs tracking-tighter transition-transform group-hover:scale-105 shadow-md"
              style={{ backgroundColor: theme.colors.primary }}
            >
              AG
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white tracking-wider">EVOPRO</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  v{EVOPRO_CONFIG.version}
                </span>
              </div>
              <span className="text-[9px] font-mono text-zinc-400 tracking-widest leading-none">
                AG47 / ECO / EVOPRO
              </span>
            </div>
          </Link>

          <div className="hidden md:block h-6 w-[1px] bg-white/10 mx-0.5" />
          
          <div className="hidden md:flex items-center p-1 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-inner">
            <ThemeSwitcher themeName={themeName} onToggle={toggleTheme} />
          </div>
        </div>

        {/* Desktop Carousel Navigation */}
        <div className="hidden lg:flex items-center gap-1 flex-1 max-w-2xl mx-2 relative group">
          {/* Scroll Left Button */}
          <button
            onClick={() => scrollCarousel('left')}
            className="p-1.5 rounded-lg bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800 transition-colors shrink-0 cursor-pointer hover:bg-zinc-800"
            title="Anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Carousel Viewport */}
          <div 
            ref={carouselRef}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl flex-1"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  ref={(el) => { buttonRefs.current[link.id] = el; }}
                  onClick={() => scrollTo(link.id)}
                  className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'text-black font-bold shadow-lg scale-105' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                  style={isActive ? { backgroundColor: theme.colors.primary } : {}}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => scrollCarousel('right')}
            className="p-1.5 rounded-lg bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800 transition-colors shrink-0 cursor-pointer hover:bg-zinc-800"
            title="Próximo"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <a
            href={EVOPRO_CONFIG.gitHubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono border border-zinc-700/60 transition-all active:scale-95 shadow-sm"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          <button
            onClick={() => scrollTo('quickstart')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-black font-bold text-xs font-mono transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Quick Start</span>
          </button>
        </div>

        {/* Mobile menu controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex md:hidden items-center p-0.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <ThemeSwitcher themeName={themeName} onToggle={toggleTheme} />
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-all"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full bg-zinc-950/95 border-b border-zinc-800 backdrop-blur-2xl p-4 shadow-2xl animate-in slide-in-from-top-2 duration-200 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-mono transition-all ${
                    isActive 
                      ? 'text-black font-bold shadow' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                  }`}
                  style={isActive ? { backgroundColor: theme.colors.primary } : {}}
                >
                  <Icon className="w-3.5 h-3.5 opacity-80" />
                  <span className="truncate">{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-zinc-800/80">
            <a
              href={EVOPRO_CONFIG.gitHubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-900 text-xs font-mono text-zinc-300 border border-zinc-700/80 font-medium"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <button
              onClick={() => scrollTo('quickstart')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-black font-bold text-xs font-mono shadow"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Quick Start</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
