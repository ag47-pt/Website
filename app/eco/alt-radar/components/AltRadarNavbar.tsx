'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { ALT_RADAR_CONFIG } from '@/data/alt-radar';
import { 
  Radar, 
  Layers, 
  ShieldCheck, 
  GitBranch, 
  Play, 
  BookOpen, 
  Menu, 
  X,
  Compass,
  ChevronLeft,
  ChevronRight,
  Radio,
  Cpu,
  Zap,
  Gauge,
  Activity
} from 'lucide-react';

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

interface AltRadarNavbarProps {
  activeSection: string;
}

export function AltRadarNavbar({ activeSection }: AltRadarNavbarProps) {
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
    { id: 'pipeline', label: 'Pipeline 6 Etapas', icon: GitBranch },
    { id: 'security', label: 'Auditoria Zero-Trust', icon: ShieldCheck },
    { id: 'scoring', label: 'Score Explicável', icon: Cpu },
    { id: 'terminal-demo', label: 'Terminal Interativo', icon: Zap },
    { id: 'stream-feed', label: 'Stream & Telemetria', icon: Radio },
    { id: 'cli', label: 'CLI & API Reference', icon: BookOpen },
    { id: 'capabilities', label: 'Matriz Comparativa', icon: Layers },
    { id: 'architecture', label: 'Arquitetura Core', icon: Activity },
    { id: 'quickstart', label: 'Quick Start', icon: Play },
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
      const yOffset = -90;
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
          <Link 
            href="/" 
            className="flex items-center gap-2 group transition-transform hover:scale-105"
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-black text-sm tracking-wider shadow-lg transition-all duration-300"
              style={{ backgroundColor: theme.colors.primary }}
            >
              AG
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono font-bold tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                AG47 / ECO
              </span>
              <span className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                ALT RADAR
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE
                </span>
              </span>
            </div>
          </Link>
        </div>

        {/* 1-Line Carrossel com Auto-Center e Setas de Navegação (Desktop & Tablet) */}
        <div className="hidden lg:flex items-center relative flex-1 max-w-2xl xl:max-w-3xl mx-2 bg-zinc-950/80 p-1 rounded-full border border-zinc-800/80 backdrop-blur-md shadow-inner">
          {/* Seta Esquerda */}
          <button 
            onClick={() => scrollCarousel('left')}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors shrink-0 z-10"
            title="Rolar menu para a esquerda"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Container do Carrossel de 1 Linha */}
          <div 
            ref={carouselRef}
            className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap px-1 w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  ref={(el) => {
                    buttonRefs.current[link.id] = el;
                  }}
                  onClick={() => scrollTo(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 shrink-0 cursor-pointer ${
                    isActive 
                      ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700 font-semibold scale-105' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                  style={{
                    borderColor: isActive ? theme.colors.primary : undefined,
                    color: isActive ? '#ffffff' : undefined
                  }}
                >
                  <Icon 
                    className="w-3.5 h-3.5 shrink-0" 
                    style={{ color: isActive ? theme.colors.primary : undefined }}
                  />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Seta Direita */}
          <button 
            onClick={() => scrollCarousel('right')}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors shrink-0 z-10"
            title="Rolar menu para a direita"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Ações / Botões Rápidos */}
        <div className="flex items-center gap-2 shrink-0">
          <ThemeSwitcher onToggle={toggleTheme} themeName={themeName} />

          <a 
            href={ALT_RADAR_CONFIG.gitHubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          <Link 
            href="/eco/alt-radar?tab=dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-black transition-all duration-200 shadow-md hover:scale-105 cursor-pointer"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Abrir Dashboard</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950/98 border-b border-zinc-800 px-4 py-6 space-y-4 backdrop-blur-2xl animate-in slide-in-from-top duration-300 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium text-left transition-colors ${
                    isActive 
                      ? 'bg-zinc-800 text-white font-bold border border-zinc-700' 
                      : 'bg-zinc-900/60 text-zinc-400 hover:text-white'
                  }`}
                  style={{
                    borderColor: isActive ? theme.colors.primary : undefined
                  }}
                >
                  <Icon 
                    className="w-4 h-4 shrink-0" 
                    style={{ color: isActive ? theme.colors.primary : undefined }}
                  />
                  <span className="truncate">{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3">
            <a 
              href={ALT_RADAR_CONFIG.gitHubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-mono font-medium bg-zinc-900 text-zinc-300 border border-zinc-800"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Ver no GitHub</span>
            </a>
            <Link 
              href="/eco/alt-radar?tab=dashboard"
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-mono font-bold text-black"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Gauge className="w-4 h-4" />
              <span>Abrir Dashboard</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
