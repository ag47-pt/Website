'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Monitor, 
  Grid, 
  Image as ImageIcon, 
  Sliders, 
  Layers, 
  X,
  Presentation,
  Sparkles,
  FileText
} from 'lucide-react';
import { playClickSound } from '@/lib/audio/sound-fx';

export type BackgroundMode = 'grid' | 'image' | 'oled';

interface Universo2DFloatingDockProps {
  // Sound
  soundEnabled: boolean;
  onToggleSound: () => void;
  // Background
  backgroundMode: BackgroundMode;
  onChangeBackgroundMode: (mode: BackgroundMode) => void;
  // Pitch Deck Mode
  isPitchDeckMode: boolean;
  onTogglePitchDeck: () => void;
  currentSlideIndex: number;
  totalSlides: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  isSpeakerNotesOpen?: boolean;
  onToggleSpeakerNotes?: () => void;
  // Scroll to Top
  showScrollTop: boolean;
  onScrollToTop: () => void;
  // Scroll percentage (normal mode)
  scrollPercent: number;
}

export function Universo2DFloatingDock({
  soundEnabled,
  onToggleSound,
  backgroundMode,
  onChangeBackgroundMode,
  isPitchDeckMode,
  onTogglePitchDeck,
  currentSlideIndex,
  totalSlides,
  onPrevSlide,
  onNextSlide,
  isSpeakerNotesOpen,
  onToggleSpeakerNotes,
  showScrollTop,
  onScrollToTop,
  scrollPercent,
}: Universo2DFloatingDockProps) {
  const { theme } = useTheme();

  const cycleBackgroundMode = () => {
    playClickSound();
    if (backgroundMode === 'grid') onChangeBackgroundMode('image');
    else if (backgroundMode === 'image') onChangeBackgroundMode('oled');
    else onChangeBackgroundMode('grid');
  };

  const handleTogglePitchDeck = () => {
    playClickSound();
    onTogglePitchDeck();
  };

  const handleToggleSound = () => {
    playClickSound();
    onToggleSound();
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 z-50 flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-zinc-950/90 border border-white/10 backdrop-blur-2xl shadow-2xl font-mono text-xs max-w-[95vw]">
      {/* PITCH DECK MODE CONTROLS */}
      {isPitchDeckMode ? (
        <>
          {/* Active Pitch Deck Indicator */}
          <button
            onClick={handleTogglePitchDeck}
            className="px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 shadow-lg active:scale-95"
            style={{
              backgroundColor: `${theme.colors.primary}20`,
              borderColor: `${theme.colors.primary}60`,
              color: theme.colors.primary,
              boxShadow: `0 0 16px ${theme.colors.primary}30`,
            }}
            title="Sair do Modo Pitch Deck (ESC)"
          >
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: theme.colors.primary }} />
            <span>PITCH DECK</span>
            <X className="w-3 h-3 ml-0.5" />
          </button>

          {/* Slide Navigation Buttons */}
          <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-xl border border-white/10">
            <button
              onClick={() => {
                playClickSound();
                onPrevSlide();
              }}
              disabled={currentSlideIndex === 0}
              className={`p-1.5 rounded-lg transition-all ${
                currentSlideIndex === 0 
                  ? 'text-zinc-600 cursor-not-allowed' 
                  : 'text-zinc-300 hover:text-white hover:bg-white/10 active:scale-95'
              }`}
              title="Slide Anterior (←)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2 text-[11px] font-bold text-zinc-200">
              {currentSlideIndex + 1} / {totalSlides}
            </span>

            <button
              onClick={() => {
                playClickSound();
                onNextSlide();
              }}
              disabled={currentSlideIndex === totalSlides - 1}
              className={`p-1.5 rounded-lg transition-all ${
                currentSlideIndex === totalSlides - 1 
                  ? 'text-zinc-600 cursor-not-allowed' 
                  : 'text-zinc-300 hover:text-white hover:bg-white/10 active:scale-95'
              }`}
              title="Próximo Slide (→)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Speaker Notes Toggle Button in Dock */}
          {onToggleSpeakerNotes && (
            <button
              onClick={() => {
                playClickSound();
                onToggleSpeakerNotes();
              }}
              className={`px-2.5 py-1.5 rounded-xl font-mono text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                isSpeakerNotesOpen
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
              title="Anotações do Apresentador & Timer (P)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">NOTAS</span>
              <kbd className="text-[9px] bg-white/10 px-1 rounded text-zinc-400">P</kbd>
            </button>
          )}
        </>
      ) : (
        <>
          {/* Normal Mode: Pitch Deck Launcher */}
          <button
            onClick={handleTogglePitchDeck}
            className="px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold border transition-all cursor-pointer bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300 hover:text-white flex items-center gap-1.5 active:scale-95"
            title="Ativar Modo Apresentação / Pitch Deck por Slides"
          >
            <Presentation className="w-3.5 h-3.5" style={{ color: theme.colors.primary }} />
            <span>PITCH DECK</span>
          </button>
        </>
      )}

      {/* BACKGROUND MODE CYCLER */}
      <button
        onClick={cycleBackgroundMode}
        className="px-2.5 py-1.5 rounded-xl font-mono text-[11px] font-medium border transition-all cursor-pointer bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300 hover:text-white flex items-center gap-1.5 active:scale-95"
        title={`Alternar visual de fundo (Atual: ${backgroundMode.toUpperCase()})`}
      >
        {backgroundMode === 'grid' && (
          <>
            <Grid className="w-3.5 h-3.5" style={{ color: theme.colors.primary }} />
            <span className="hidden sm:inline">GRID</span>
          </>
        )}
        {backgroundMode === 'image' && (
          <>
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">MAP EDGE</span>
          </>
        )}
        {backgroundMode === 'oled' && (
          <>
            <Monitor className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">OLED PURE</span>
          </>
        )}
      </button>

      {/* SOUND FX TOGGLE */}
      <button
        onClick={handleToggleSound}
        className={`p-2 rounded-xl font-mono text-xs border transition-all cursor-pointer active:scale-95 ${
          soundEnabled 
            ? 'bg-white/10 border-white/20 text-white shadow-sm' 
            : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
        }`}
        title={soundEnabled ? 'Desativar Sons da Interface' : 'Ativar Sons Sintetizados (Web Audio)'}
      >
        {soundEnabled ? (
          <Volume2 className="w-3.5 h-3.5" style={{ color: theme.colors.primary }} />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
        )}
      </button>

      {/* SCROLL PERCENT OR TOP (Normal Mode Only) */}
      {!isPitchDeckMode && (
        <div className="flex items-center gap-1 pl-1 border-l border-white/10">
          <div className="flex items-baseline gap-0.5 px-1 font-mono text-xs">
            <span className="font-black text-white tabular-nums">
              {Math.min(100, Math.max(0, scrollPercent))}
            </span>
            <span style={{ color: theme.colors.primary }} className="text-[10px] font-bold">
              %
            </span>
          </div>

          {showScrollTop && (
            <button
              onClick={() => {
                playClickSound();
                onScrollToTop();
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all active:scale-90"
              title="Voltar ao topo"
            >
              <ChevronUp className="w-3.5 h-3.5" style={{ color: theme.colors.primary }} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
