'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { usePageScroll } from '@/hooks/usePageScroll';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { 
  Globe2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  DollarSign, 
  HelpCircle, 
  ArrowUpRight,
  Menu,
  X,
  Compass,
  LayoutGrid,
  Network
} from 'lucide-react';

interface Universo2DNavbarProps {
  activeSection: string;
  onSectionClick: (id: string) => void;
}

export function Universo2DNavbar({ activeSection, onSectionClick }: Universo2DNavbarProps) {
  const { theme, themeName, toggleTheme, themeContrast } = useTheme();
  const scrollOffset = usePageScroll();
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sectionProgress, setSectionProgress] = useState<number>(0);

  const navItems = [
    { id: 'overview', label: 'Visão Geral', icon: <Sparkles className="w-3 h-3" /> },
    { id: 'manifesto', label: 'Manifesto', icon: <Globe2 className="w-3 h-3" /> },
    { id: 'vantagens', label: 'Vantagens', icon: <CheckCircle2 className="w-3 h-3" /> },
    { id: 'servicos', label: 'Serviços', icon: <Layers className="w-3 h-3" /> },
    { id: 'portfolio', label: 'Portfólio', icon: <LayoutGrid className="w-3 h-3" /> },
    { id: 'demo-engine', label: 'Motor Labs', icon: <Cpu className="w-3 h-3" /> },
    { id: 'precos', label: 'Planos', icon: <DollarSign className="w-3 h-3" /> },
    { id: 'metricas', label: 'Resultados', icon: <Sparkles className="w-3 h-3" /> },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle className="w-3 h-3" /> },
  ];

  // Cálculo preciso da porcentagem de leitura da seção ativa (Active Section Reading Tracker)
  useEffect(() => {
    const calculateSectionProgress = () => {
      const el = document.getElementById(activeSection);
      if (!el) {
        setSectionProgress(0);
        return;
      }

      const rect = el.getBoundingClientRect();
      const elementHeight = el.offsetHeight;
      const navOffset = 70;

      // Distância rolada dentro da seção atual
      const scrolled = -rect.top + navOffset;
      const maxScrollable = Math.max(1, elementHeight);
      const progress = Math.min(100, Math.max(0, Math.round((scrolled / maxScrollable) * 100)));
      
      setSectionProgress(progress);
    };

    window.addEventListener('scroll', calculateSectionProgress, { passive: true });
    calculateSectionProgress();
    return () => window.removeEventListener('scroll', calculateSectionProgress);
  }, [activeSection]);

  // Auto-centralização suave e precisa do item ativo no carrossel
  useEffect(() => {
    if (!carouselRef.current || !buttonRefs.current[activeSection]) return;
    const container = carouselRef.current;
    const btn = buttonRefs.current[activeSection];
    if (btn) {
      const btnRect = btn.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const btnRelativeLeft = btnRect.left - containerRect.left + container.scrollLeft;
      const targetScroll = btnRelativeLeft - (container.clientWidth / 2) + (btn.clientWidth / 2);
      
      container.scrollTo({ 
        left: Math.max(0, targetScroll), 
        behavior: 'smooth' 
      });
    }
  }, [activeSection]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Cálculo da barra cometa (18% inicial para não sumir o glow até 100%)
  const widthPercent = 18 + (scrollOffset * 82);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/75 backdrop-blur-2xl shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 relative">
        {/* Brand & Sector Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 group"
            title="Voltar à Home 3D"
          >
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs tracking-tighter transition-all duration-500 group-hover:scale-105"
              style={{
                backgroundColor: theme.colors.primary,
                color: themeContrast || '#000000',
                boxShadow: `0 0 16px ${theme.colors.primary}40`,
              }}
            >
              47
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs sm:text-sm tracking-tight text-white flex items-center gap-1.5">
                AGÊNCIA 47
                <span 
                  className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 rounded border transition-colors duration-500"
                  style={{
                    backgroundColor: `${theme.colors.primary}15`,
                    borderColor: `${theme.colors.primary}40`,
                    color: theme.colors.primary,
                  }}
                >
                  2D HUB
                </span>
              </span>
              <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline-block">
                LABS & ECOSYSTEM
              </span>
            </div>
          </Link>

          {/* Quick Switch to 3D */}
          <Link
            href="/"
            className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/10 hover:border-white/20 hover:text-white transition-all group"
            title="Mudar para Universo 3D Espacial"
          >
            <Compass className="w-3 h-3 text-cyan-400 group-hover:rotate-45 transition-transform" />
            <span>Modo 3D</span>
          </Link>
        </div>

        {/* Center Navigation Links with Active Section Progress */}
        <div className="hidden lg:flex items-center flex-1 max-w-xl mx-3 relative">
          <button
            onClick={() => scrollCarousel('left')}
            className="w-6 h-6 rounded-full bg-zinc-900/90 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white shrink-0 z-10 transition-colors cursor-pointer hover:bg-zinc-800"
            aria-label="Rolar menu para a esquerda"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div
            ref={carouselRef}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth px-2 py-1 flex-1 whitespace-nowrap"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    buttonRefs.current[item.id] = el;
                  }}
                  onClick={() => onSectionClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-300 shrink-0 cursor-pointer relative overflow-hidden ${
                    isActive
                      ? 'font-bold border'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: `${theme.colors.primary}18`,
                          borderColor: `${theme.colors.primary}50`,
                          color: theme.colors.primary,
                          boxShadow: `0 0 14px ${theme.colors.primary}25`,
                        }
                      : {}
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>

                  {/* Active Section Reading Tracker Badge (ex: 45%) */}
                  {isActive && (
                    <span 
                      className="inline-flex items-center px-1.5 py-0.2 rounded-md text-[9px] font-mono font-bold transition-all duration-200"
                      style={{
                        backgroundColor: `${theme.colors.primary}25`,
                        color: theme.colors.primary,
                        border: `1px solid ${theme.colors.primary}40`,
                      }}
                    >
                      {sectionProgress}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => scrollCarousel('right')}
            className="w-6 h-6 rounded-full bg-zinc-900/90 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white shrink-0 z-10 transition-colors cursor-pointer hover:bg-zinc-800"
            aria-label="Rolar menu para a direita"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Actions: ThemeSwitcher + Global Links + CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/eco"
            className="hidden md:flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
          >
            <Network className="w-3 h-3 text-cyan-400" />
            <span>Eco</span>
          </Link>

          <Link
            href="/labs"
            className="hidden md:flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
          >
            <LayoutGrid className="w-3 h-3 text-emerald-400" />
            <span>Labs</span>
          </Link>

          <div className="h-5 w-[1px] bg-white/10 hidden sm:block" />

          {/* Theme Switcher do AG47 */}
          <ThemeSwitcher themeName={themeName} onToggle={toggleTheme} />

          {/* Dynamic CTA */}
          <a
            href="https://wa.me/351912345678?text=Olá!%20Gostaria%20de%20conversar%20sobre%20um%20projeto%20com%20a%20Agência%2047."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono tracking-wide active:scale-95 transition-all duration-500 shadow-md"
            style={{
              backgroundColor: theme.colors.primary,
              color: themeContrast || '#000000',
              boxShadow: `0 0 16px ${theme.colors.primary}35`,
            }}
          >
            <span>Iniciar Projeto</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white"
            aria-label="Menu de Navegação"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Barra de Progresso com Efeito Cometa Integrada no Bordo Inferior */}
      <div 
        className="absolute -bottom-[1px] left-0 h-[2px] transition-all duration-300 ease-out z-[60]" 
        style={{ 
          width: `${widthPercent}%`,
          background: `linear-gradient(to right, transparent, ${theme.colors.comet.via}, ${theme.colors.comet.to})`,
          boxShadow: `0 0 10px ${theme.colors.comet.to}40`
        }} 
      >
        {/* Bolinha Flamejante (Cometa Glow) */}
        <div 
          className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-white rounded-full transition-all duration-300 z-10"
          style={{ 
            boxShadow: `0 0 10px 2px ${theme.colors.comet.to}, 0 0 20px 4px ${theme.colors.comet.via}80`,
          }}
        >
          <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-50" />
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950/95 border-b border-white/10 px-4 py-4 backdrop-blur-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-center text-zinc-300 hover:text-white flex items-center justify-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Universo 3D</span>
            </Link>
            <Link
              href="/eco"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-center text-zinc-300 hover:text-white flex items-center justify-center gap-1.5"
            >
              <Network className="w-3.5 h-3.5 text-emerald-400" />
              <span>Eco Hub</span>
            </Link>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionClick(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between ${
                    isActive
                      ? 'font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                  style={
                    isActive
                      ? {
                          color: theme.colors.primary,
                          backgroundColor: `${theme.colors.primary}15`,
                        }
                      : {}
                  }
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <span 
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold"
                      style={{
                        backgroundColor: `${theme.colors.primary}20`,
                        color: theme.colors.primary,
                      }}
                    >
                      {sectionProgress}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 mt-3 border-t border-white/10">
            <a
              href="https://wa.me/351912345678?text=Olá!%20Gostaria%20de%20solicitar%20um%20briefing%20com%20a%20Agência%2047."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2"
              style={{
                backgroundColor: theme.colors.primary,
                color: themeContrast || '#000000',
              }}
            >
              <span>Solicitar Briefing WhatsApp</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
