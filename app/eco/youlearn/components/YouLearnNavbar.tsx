'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Sparkles, 
  Compass, 
  ExternalLink, 
  ArrowLeft, 
  Layers, 
  Plus, 
  Network, 
  LayoutGrid, 
  Menu, 
  X 
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { IngestVideoModal } from './IngestVideoModal';

interface YouLearnNavbarProps {
  currentSlug?: string;
  isLearningPage?: boolean;
  learningTitle?: string;
  onIngestSuccess?: (slug: string) => void;
}

export function YouLearnNavbar({ currentSlug, isLearningPage, learningTitle, onIngestSuccess }: YouLearnNavbarProps) {
  const { theme, themeName, toggleTheme, themeContrast } = useTheme();
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/85 backdrop-blur-2xl transition-all duration-300 shadow-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-2 sm:gap-4 relative">
        
        {/* Brand & Sector Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 min-w-0">
          <Link
            href="/eco/youlearn"
            className="group flex items-center gap-2.5 transition-transform duration-300 hover:scale-102 shrink-0"
            title="YouLearn Academy - AG47 Eco"
          >
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs tracking-tighter shrink-0 transition-all duration-500 group-hover:scale-105"
              style={{
                backgroundColor: theme.colors.primary,
                color: themeContrast || '#000000',
                boxShadow: `0 0 16px ${theme.colors.primary}40`,
              }}
            >
              ECO
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs sm:text-sm tracking-tight text-white flex items-center gap-1.5 leading-none">
               AG47
                <span 
                  className="text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded border transition-colors duration-500 shrink-0"
                  style={{
                    backgroundColor: `${theme.colors.primary}18`,
                    borderColor: `${theme.colors.primary}45`,
                    color: theme.colors.primary,
                  }}
                >
                  YOULEARN
                </span>
              </span>
              <span className="text-[9px] text-zinc-500 font-mono hidden sm:inline-block mt-0.5">
                ACADEMY & KNOWLEDGE
              </span>
            </div>
          </Link>

          {/* Optional breadcrumb snippet for learning page on large displays */}
          {isLearningPage && learningTitle && (
            <div className="hidden xl:flex items-center gap-2 border-l border-white/10 pl-3">
              <span className="text-zinc-600">/</span>
              <span className="max-w-[200px] truncate text-xs font-mono text-zinc-400 font-medium" title={learningTitle}>
                {learningTitle}
              </span>
            </div>
          )}
        </div>

        {/* Center Actions (Ingest Video CTA on Desktop/Tablet) */}
        <div className="hidden sm:flex items-center justify-center flex-1 max-w-xs mx-2">
          <button
            onClick={() => setIsIngestModalOpen(true)}
            className="group flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold font-mono tracking-wider uppercase transition-all duration-300 hover:scale-102 cursor-pointer shadow-md"
            style={{
              backgroundColor: `${theme.colors.primary}15`,
              borderColor: `${theme.colors.primary}45`,
              color: '#ffffff',
              boxShadow: `0 0 15px ${theme.colors.primary}20`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
              e.currentTarget.style.color = themeContrast || '#000000';
              e.currentTarget.style.borderColor = theme.colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.colors.primary}15`;
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = `${theme.colors.primary}45`;
            }}
          >
            <Plus className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-90 text-[#D1FF00] group-hover:text-inherit" />
            <span>Ingerir Vídeo</span>
          </button>
        </div>

        {/* Right Navigation & Action Links */}
        <nav className="flex items-center gap-2 sm:gap-3 shrink-0 justify-end">
          {/* Mobile Ingest Button */}
          <button
            onClick={() => setIsIngestModalOpen(true)}
            className="sm:hidden flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border transition-all"
            style={{
              backgroundColor: `${theme.colors.primary}18`,
              borderColor: `${theme.colors.primary}45`,
              color: theme.colors.primary,
            }}
            title="Ingerir Vídeo do YouTube"
          >
            <Plus className="h-3 w-3" />
            <span>Ingerir</span>
          </button>

          {isLearningPage ? (
            <Link
              href="/eco/youlearn"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1.5 text-xs font-mono font-medium text-zinc-300 hover:border-white/30 hover:text-white transition-all"
              title="Voltar à Biblioteca YouLearn"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Biblioteca</span>
            </Link>
          ) : (
            <>
              <Link
                href="/eco"
                className="hidden md:flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
                title="Eco Hub"
              >
                <Network className="w-3 h-3 text-cyan-400" />
                <span>Eco</span>
              </Link>

              <Link
                href="/labs"
                className="hidden md:flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
                title="Labs Hub"
              >
                <LayoutGrid className="w-3 h-3 text-emerald-400" />
                <span>Labs</span>
              </Link>

              <Link
                href="/"
                className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/10 hover:border-white/20 hover:text-white transition-all group"
                title="Mudar para Universo 3D"
              >
                <Compass className="w-3 h-3 text-cyan-400 group-hover:rotate-45 transition-transform" />
                <span>Modo 3D</span>
              </Link>
            </>
          )}

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Theme Switcher do AG47 */}
          <ThemeSwitcher themeName={themeName} onToggle={toggleTheme} />

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white"
            aria-label="Menu de Navegação"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </nav>
      </div>

      {/* Decorative Accent Glow Line on bottom border */}
      <div 
        className="absolute -bottom-[1px] left-0 right-0 h-[1px] pointer-events-none transition-opacity duration-500"
        style={{
          background: `linear-gradient(to right, transparent, ${theme.colors.primary}60, transparent)`
        }}
      />

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-zinc-950/95 border-b border-white/10 px-4 py-4 backdrop-blur-2xl animate-in slide-in-from-top-2 duration-200 shadow-2xl">
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
            <Link
              href="/labs"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-center text-zinc-300 hover:text-white flex items-center justify-center gap-1.5"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-purple-400" />
              <span>Labs Hub</span>
            </Link>
            <Link
              href="/eco/youlearn"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-[#D1FF00]/10 border border-[#D1FF00]/30 text-xs font-mono text-center text-[#D1FF00] font-bold flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>YouLearn</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsIngestModalOpen(true);
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              style={{
                backgroundColor: theme.colors.primary,
                color: themeContrast || '#000000',
                boxShadow: `0 0 15px ${theme.colors.primary}30`,
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Ingerir Novo Vídeo</span>
            </button>
          </div>
        </div>
      )}

      {/* Autonomous Ingestion Modal */}
      <IngestVideoModal
        isOpen={isIngestModalOpen}
        onClose={() => setIsIngestModalOpen(false)}
        onSuccess={onIngestSuccess}
      />
    </header>
  );
}
