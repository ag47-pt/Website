'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { usePageScroll } from '@/hooks/usePageScroll';
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar';
import { isSoundEnabled, setSoundEnabled, playClickSound } from '@/lib/audio/sound-fx';

import { Universo2DNavbar } from './components/Universo2DNavbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { AdvantagesComparison } from './components/AdvantagesComparison';
import { ServicesBentoGrid } from './components/ServicesBentoGrid';
import { PortfolioShowcase } from './components/PortfolioShowcase';
import { InteractiveLabsEngine } from './components/InteractiveLabsEngine';
import { PricingSection } from './components/PricingSection';
import { SocialProofSection } from './components/SocialProofSection';
import { QuickStartExport } from './components/QuickStartExport';
import { Universo2DFooter } from './components/Universo2DFooter';
import { Universo2DFloatingDock, BackgroundMode } from './components/Universo2DFloatingDock';
import { SpeakerNotesOverlay } from './components/SpeakerNotesOverlay';

import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Presentation, 
  Sparkles,
  FileText,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Grid,
  Monitor,
  Image as ImageIcon
} from 'lucide-react';

export default function Universo2DClient() {
  const { theme } = useTheme();
  const scrollOffset = usePageScroll();
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const isManualScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Estados dos Recursos
  const [soundActive, setSoundActive] = useState<boolean>(false);
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('grid');
  const [isPitchDeckMode, setIsPitchDeckMode] = useState<boolean>(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isSpeakerNotesOpen, setIsSpeakerNotesOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Inicializa estado de som do localStorage
  useEffect(() => {
    setSoundActive(isSoundEnabled());
  }, []);

  const toggleSound = () => {
    const nextState = !soundActive;
    setSoundActive(nextState);
    setSoundEnabled(nextState);
  };

  const cycleBackgroundMode = () => {
    playClickSound();
    if (backgroundMode === 'grid') setBackgroundMode('image');
    else if (backgroundMode === 'image') setBackgroundMode('oled');
    else setBackgroundMode('grid');
  };

  const toggleFullscreen = () => {
    playClickSound();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const sections = useMemo(() => [
    { id: 'overview', shortName: 'Visão Geral', title: '01. VISÃO GERAL & ARQUITETURA' },
    { id: 'manifesto', shortName: 'Manifesto', title: '02. QUEM SOMOS & MANIFESTO' },
    { id: 'vantagens', shortName: 'Vantagens', title: '03. VANTAGENS & PERFORMANCE' },
    { id: 'servicos', shortName: 'Serviços', title: '04. SERVIÇOS & SOLUÇÕES' },
    { id: 'portfolio', shortName: 'Portfólio', title: '05. PORTFÓLIO & ECOSSISTEMA' },
    { id: 'demo-engine', shortName: 'Motor Labs', title: '06. MOTOR LABS INTERATIVO' },
    { id: 'precos', shortName: 'Planos', title: '07. PLANOS & INVESTIMENTO' },
    { id: 'metricas', shortName: 'Resultados', title: '08. PROVA SOCIAL & IMPACTO' },
    { id: 'faq', shortName: 'FAQ', title: '09. FAQ & EXPORTAÇÃO' },
  ], []);

  const sectionIds = useMemo(() => sections.map(s => s.id), [sections]);

  // ScrollSpy para detectar com precisão a secção visível (quando em modo Scroll normal)
  useEffect(() => {
    if (isPitchDeckMode) return;

    const handleScrollSpy = () => {
      setShowScrollTop(window.scrollY > 400);

      if (isManualScrollingRef.current) return;

      const scrollPosition = window.scrollY + 160;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          if (elementTop <= scrollPosition) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [sectionIds, isPitchDeckMode]);

  // Navegação por clique na Navbar ou Links
  const handleSectionClick = (id: string) => {
    setActiveSection(id);

    if (isPitchDeckMode) {
      const targetIndex = sectionIds.indexOf(id);
      if (targetIndex !== -1) {
        setCurrentSlideIndex(targetIndex);
      }
      return;
    }

    isManualScrollingRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    const el = document.getElementById(id);
    if (el) {
      const navOffset = 70;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      });
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isManualScrollingRef.current = false;
    }, 850);
  };

  const scrollToTop = () => {
    handleSectionClick('overview');
  };

  // Alternância do Modo Pitch Deck
  const handleTogglePitchDeck = () => {
    if (!isPitchDeckMode) {
      const currentIndex = sectionIds.indexOf(activeSection);
      const targetIdx = currentIndex !== -1 ? currentIndex : 0;
      setCurrentSlideIndex(targetIdx);
      setIsPitchDeckMode(true);
    } else {
      setIsPitchDeckMode(false);
      setIsSpeakerNotesOpen(false);
      setTimeout(() => {
        handleSectionClick(sectionIds[currentSlideIndex]);
      }, 100);
    }
  };

  // Navegação do Pitch Deck (Próximo / Anterior)
  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      const nextIndex = currentSlideIndex - 1;
      setCurrentSlideIndex(nextIndex);
      setActiveSection(sectionIds[nextIndex]);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < sections.length - 1) {
      const nextIndex = currentSlideIndex + 1;
      setCurrentSlideIndex(nextIndex);
      setActiveSection(sectionIds[nextIndex]);
    }
  };

  // Atalhos de teclado no modo Pitch Deck
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPitchDeckMode) return;

      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        playClickSound();
        setIsSpeakerNotesOpen(prev => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevSlide();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (isSpeakerNotesOpen) {
          setIsSpeakerNotesOpen(false);
        } else {
          setIsPitchDeckMode(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPitchDeckMode, currentSlideIndex, sections.length, isSpeakerNotesOpen]);

  // Cálculo da porcentagem de scroll da página (Começa na assinatura de 47% da Agência 47 e vai até 100%)
  const startingPercent = theme?.branding?.startingPercent ?? 47;
  const scrollPercent = useMemo(() => {
    if (isPitchDeckMode) {
      const slideFraction = sections.length > 1 ? currentSlideIndex / (sections.length - 1) : 0;
      return Math.round(startingPercent + slideFraction * (100 - startingPercent));
    }
    const clampedOffset = Math.min(1, Math.max(0, scrollOffset || 0));
    return Math.round(startingPercent + clampedOffset * (100 - startingPercent));
  }, [isPitchDeckMode, currentSlideIndex, sections.length, startingPercent, scrollOffset]);

  return (
    <div 
      className="min-h-screen bg-[#070708] text-white font-sans selection:bg-[var(--primary-color)] selection:text-black relative"
      style={{
        '--primary-color': theme.colors.primary,
        '--secondary-color': theme.colors.secondary,
        '--accent-color': theme.colors.accent,
        '--highlight-color': theme.colors.highlight,
      } as React.CSSProperties}
    >
      {/* Scrollbar and Global Reset */}
      <style>{`
        html {
          height: auto !important;
          min-height: 0 !important;
          overflow-x: hidden !important;
          overflow-y: ${isPitchDeckMode ? 'hidden' : 'scroll'} !important;
          display: block !important;
          scroll-behavior: smooth;
        }
        body {
          height: auto !important;
          min-height: auto !important;
          overflow: ${isPitchDeckMode ? 'hidden' : 'visible'} !important;
          display: block !important;
          margin: 0;
          padding: 0;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        body::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
        }
        html::-webkit-scrollbar {
          width: 8px;
        }
        html::-webkit-scrollbar-track {
          background: #070708;
        }
        html::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 9999px;
          border: 2px solid #070708;
        }
        html::-webkit-scrollbar-thumb:hover {
          background: var(--primary-color);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* AJUSTE DE ALTURA E RESPIRO ESPECÍFICO PARA OS SLIDES DO PITCH DECK */
        .pitch-deck-stage section {
          padding-top: 1.25rem !important;
          padding-bottom: 2.5rem !important;
          min-height: auto !important;
        }
        @media (min-width: 640px) {
          .pitch-deck-stage section {
            padding-top: 1.75rem !important;
            padding-bottom: 3rem !important;
          }
        }
      `}</style>

      {/* BACKGROUND MODES: Grid, Image/Map, or Pure OLED */}
      {backgroundMode === 'grid' && (
        <div className="fixed inset-0 z-0 opacity-20 pointer-events-none transition-opacity duration-700">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808025_1px,transparent_1px),linear-gradient(to_bottom,#80808025_1px,transparent_1px)] bg-[size:200px_200px] border-l border-t border-zinc-800/40" />
        </div>
      )}

      {backgroundMode === 'image' && (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-35 transition-opacity duration-700">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1)_0,transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
      )}

      {/* Ambient Glow Dinâmico vinculado ao tema ativo */}
      {backgroundMode !== 'oled' && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-700">
          <div
            className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full opacity-20 blur-[140px] transition-colors duration-700"
            style={{ backgroundColor: theme.colors.primary }}
          />
          <div
            className="absolute top-[35%] right-[-15%] w-[40%] h-[40%] rounded-full opacity-15 blur-[150px] transition-colors duration-700"
            style={{ backgroundColor: theme.colors.secondary || theme.colors.primary }}
          />
          <div
            className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full opacity-10 blur-[160px] transition-colors duration-700"
            style={{ backgroundColor: theme.colors.primary }}
          />
          <div className="absolute inset-0 opacity-[0.025] mix-blend-overlay bg-[url('/noise.png')]" />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODO 1: PITCH DECK APRESENTAÇÃO DE SLIDES PROFISSIONAL (COM TOP E BOTTOM BAR) */}
      {/* ========================================================================= */}
      {isPitchDeckMode ? (
        <div className="fixed inset-0 z-50 bg-[#070708] flex flex-col overflow-hidden text-white font-sans select-none">
          {/* BARRA SUPERIOR DO PITCH DECK (HEADER BAR) */}
          <header className="flex-shrink-0 h-14 sm:h-16 px-4 sm:px-8 bg-zinc-950/95 border-b border-white/10 flex items-center justify-between backdrop-blur-2xl z-40 relative">
            {/* Linha Fina de Progresso no Topo do Header */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10">
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${((currentSlideIndex + 1) / sections.length) * 100}%`,
                  backgroundColor: theme.colors.primary,
                  boxShadow: `0 0 8px ${theme.colors.primary}`
                }}
              />
            </div>

            {/* Lado Esquerdo: Tag do Slide e Título */}
            <div className="flex items-center gap-2 sm:gap-4 font-mono">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: theme.colors.primary }} />
                <span className="text-[11px] font-bold tracking-wider" style={{ color: theme.colors.primary }}>
                  PITCH DECK
                </span>
                <span className="text-zinc-600">|</span>
                <span className="text-[11px] font-bold text-zinc-200">
                  SLIDE {currentSlideIndex + 1} / {sections.length}
                </span>
              </div>

              <h1 className="text-xs sm:text-sm font-bold text-zinc-300 hidden md:inline truncate max-w-md">
                {sections[currentSlideIndex].title}
              </h1>
            </div>

            {/* Lado Direito: Ações Rápidas (Notas, Fullscreen, Fechar) */}
            <div className="flex items-center gap-2 font-mono text-xs">
              {/* Botão Speaker Notes */}
              <button
                onClick={() => {
                  playClickSound();
                  setIsSpeakerNotesOpen(prev => !prev);
                }}
                className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                  isSpeakerNotesOpen
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                    : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'
                }`}
                title="Anotações do Apresentador & Timer (P)"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold hidden sm:inline">NOTAS</span>
                <kbd className="text-[9px] bg-zinc-800 px-1 rounded text-zinc-400">P</kbd>
              </button>

              {/* Botão Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-all cursor-pointer active:scale-95 hidden sm:flex items-center justify-center"
                title={isFullscreen ? 'Sair da Tela Cheia (F)' : 'Tela Cheia de Apresentação (F)'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              {/* Botão Fechar Pitch Deck */}
              <button
                onClick={handleTogglePitchDeck}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-zinc-300 hover:text-red-300 border border-white/10 hover:border-red-500/30 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                title="Sair do Pitch Deck (ESC)"
              >
                <span className="text-[11px] font-bold">FECHAR</span>
                <kbd className="text-[9px] bg-zinc-800 px-1 rounded text-zinc-400">ESC</kbd>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </header>

          {/* PALCO CENTRAL DO SLIDE (SLIDE CANVAS STAGE) */}
          <main className="flex-1 overflow-y-auto no-scrollbar relative p-2 sm:p-6 pitch-deck-stage flex flex-col items-center">
            <div 
              key={currentSlideIndex} 
              className="w-full max-w-7xl animate-in fade-in zoom-in-[0.99] duration-200"
            >
              {currentSlideIndex === 0 && (
                <HeroSection
                  onExploreClick={() => handleSectionClick('servicos')}
                  onDemoClick={() => handleSectionClick('demo-engine')}
                />
              )}
              {currentSlideIndex === 1 && <AboutSection />}
              {currentSlideIndex === 2 && <AdvantagesComparison />}
              {currentSlideIndex === 3 && <ServicesBentoGrid />}
              {currentSlideIndex === 4 && <PortfolioShowcase />}
              {currentSlideIndex === 5 && <InteractiveLabsEngine />}
              {currentSlideIndex === 6 && <PricingSection />}
              {currentSlideIndex === 7 && <SocialProofSection />}
              {currentSlideIndex === 8 && <QuickStartExport />}
            </div>
          </main>

          {/* BARRA INFERIOR DO PITCH DECK (BOTTOM BAR / CONTROLS) */}
          <footer className="flex-shrink-0 h-14 sm:h-16 px-4 sm:px-8 bg-zinc-950/95 border-t border-white/10 flex items-center justify-between backdrop-blur-2xl z-40">
            {/* Pílulas de Navegação Rápida entre os 9 Slides */}
            <div className="hidden lg:flex items-center gap-1.5 font-mono text-[11px]">
              {sections.map((sec, idx) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    playClickSound();
                    setCurrentSlideIndex(idx);
                    setActiveSection(sec.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    currentSlideIndex === idx
                      ? 'border-transparent font-bold shadow-md'
                      : 'border-white/5 bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                  style={
                    currentSlideIndex === idx
                      ? {
                          backgroundColor: `${theme.colors.primary}25`,
                          borderColor: `${theme.colors.primary}60`,
                          color: theme.colors.primary,
                        }
                      : {}
                  }
                  title={`Ir para ${sec.title}`}
                >
                  <span>{idx + 1}. {sec.shortName}</span>
                </button>
              ))}
            </div>

            {/* Controles Centrais de Navegação (Anterior / Próximo) */}
            <div className="flex items-center gap-2 mx-auto lg:mx-0">
              <button
                onClick={() => {
                  playClickSound();
                  handlePrevSlide();
                }}
                disabled={currentSlideIndex === 0}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                  currentSlideIndex === 0
                    ? 'border-transparent text-zinc-600 cursor-not-allowed bg-transparent'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 text-zinc-200 active:scale-95'
                }`}
                title="Slide Anterior (← ou PageUp)"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">ANTERIOR</span>
                <kbd className="hidden sm:inline text-[9px] bg-zinc-800 px-1 rounded text-zinc-400">←</kbd>
              </button>

              <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-mono text-xs font-bold text-zinc-200">
                <span>{currentSlideIndex + 1}</span>
                <span className="text-zinc-500 mx-1">/</span>
                <span>{sections.length}</span>
              </div>

              <button
                onClick={() => {
                  playClickSound();
                  handleNextSlide();
                }}
                disabled={currentSlideIndex === sections.length - 1}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                  currentSlideIndex === sections.length - 1
                    ? 'border-transparent text-zinc-600 cursor-not-allowed bg-transparent'
                    : 'text-black active:scale-95 shadow-lg'
                }`}
                style={
                  currentSlideIndex !== sections.length - 1
                    ? {
                        backgroundColor: theme.colors.primary,
                        borderColor: theme.colors.primary,
                      }
                    : {}
                }
                title="Próximo Slide (→ ou Espaço ou PageDown)"
              >
                <span className="hidden sm:inline">PRÓXIMO</span>
                <kbd className="hidden sm:inline text-[9px] bg-black/20 px-1 rounded text-black font-mono">→</kbd>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Controles de Utilidade da Direita (Sound & Background) */}
            <div className="flex items-center gap-2">
              <button
                onClick={cycleBackgroundMode}
                className="px-2.5 py-1.5 rounded-xl font-mono text-[11px] font-medium border transition-all cursor-pointer bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300 hover:text-white flex items-center gap-1.5 active:scale-95"
                title={`Alternar visual de fundo (Atual: ${backgroundMode.toUpperCase()})`}
              >
                {backgroundMode === 'grid' && (
                  <>
                    <Grid className="w-3.5 h-3.5" style={{ color: theme.colors.primary }} />
                    <span className="hidden xl:inline">GRID</span>
                  </>
                )}
                {backgroundMode === 'image' && (
                  <>
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden xl:inline">MAP EDGE</span>
                  </>
                )}
                {backgroundMode === 'oled' && (
                  <>
                    <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden xl:inline">OLED PURE</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  toggleSound();
                }}
                className={`p-2 rounded-xl font-mono text-xs border transition-all cursor-pointer active:scale-95 ${
                  soundActive 
                    ? 'bg-white/10 border-white/20 text-white shadow-sm' 
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
                title={soundActive ? 'Desativar Sons' : 'Ativar Sons'}
              >
                {soundActive ? (
                  <Volume2 className="w-3.5 h-3.5" style={{ color: theme.colors.primary }} />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                )}
              </button>
            </div>
          </footer>

          {/* PAINEL LATERAL DE NOTAS DO APRESENTADOR & TIMER */}
          <SpeakerNotesOverlay
            isOpen={isSpeakerNotesOpen}
            onClose={() => setIsSpeakerNotesOpen(false)}
            currentSlideId={sectionIds[currentSlideIndex]}
            currentSlideIndex={currentSlideIndex}
            totalSlides={sections.length}
            onNextSlide={handleNextSlide}
            onPrevSlide={handlePrevSlide}
          />
        </div>
      ) : (
        /* ========================================================================= */
        /* MODO 2: WEB PAGE COM ROLAGEM NORMAL VERTICAL CONTÍNUA */
        /* ========================================================================= */
        <>
          {/* Navbar Labs / Eco Design */}
          <Universo2DNavbar
            activeSection={activeSection}
            onSectionClick={handleSectionClick}
          />

          <main className="relative z-10">
            <HeroSection
              onExploreClick={() => handleSectionClick('servicos')}
              onDemoClick={() => handleSectionClick('demo-engine')}
            />

            <AboutSection />

            <AdvantagesComparison />

            <ServicesBentoGrid />

            <PortfolioShowcase />

            <InteractiveLabsEngine />

            <PricingSection />

            <SocialProofSection />

            <QuickStartExport />

            {/* Footer Canónico */}
            <Universo2DFooter />
          </main>

          {/* DOCK FLUTUANTE INFERIOR DA PÁGINA */}
          <Universo2DFloatingDock
            soundEnabled={soundActive}
            onToggleSound={toggleSound}
            backgroundMode={backgroundMode}
            onChangeBackgroundMode={setBackgroundMode}
            isPitchDeckMode={isPitchDeckMode}
            onTogglePitchDeck={handleTogglePitchDeck}
            currentSlideIndex={currentSlideIndex}
            totalSlides={sections.length}
            onPrevSlide={handlePrevSlide}
            onNextSlide={handleNextSlide}
            showScrollTop={showScrollTop}
            onScrollToTop={scrollToTop}
            scrollPercent={scrollPercent}
          />
        </>
      )}
    </div>
  );
}
