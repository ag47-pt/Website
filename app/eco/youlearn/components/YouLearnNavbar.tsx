'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles, Search, Compass, ExternalLink, ArrowLeft, Layers, Plus } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { IngestVideoModal } from './IngestVideoModal';

interface YouLearnNavbarProps {
  currentSlug?: string;
  isLearningPage?: boolean;
  learningTitle?: string;
}

export function YouLearnNavbar({ currentSlug, isLearningPage, learningTitle }: YouLearnNavbarProps) {
  const { theme } = useTheme();
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <Link
            href="/eco/youlearn"
            className="group flex items-center gap-2.5 transition-transform hover:scale-102"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D1FF00]/10 border border-[#D1FF00]/30 text-[#D1FF00] shadow-[0_0_15px_rgba(209,255,0,0.15)] group-hover:border-[#D1FF00] group-hover:shadow-[0_0_20px_rgba(209,255,0,0.3)] transition-all">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-semibold tracking-wider text-zinc-400">AG47 / ECO</span>
                <span className="text-zinc-600">/</span>
                <span className="font-bold text-white tracking-tight flex items-center gap-1">
                  YouLearn
                  <span className="rounded bg-[#D1FF00]/20 px-1.5 py-0.2 text-[10px] font-mono font-medium text-[#D1FF00] border border-[#D1FF00]/30">
                    v1.0
                  </span>
                </span>
              </div>
            </div>
          </Link>

          {isLearningPage && learningTitle && (
            <div className="hidden xl:flex items-center gap-2 border-l border-white/10 pl-3">
              <span className="text-zinc-500">/</span>
              <span className="max-w-[180px] truncate text-xs font-medium text-zinc-300" title={learningTitle}>
                {learningTitle}
              </span>
            </div>
          )}
        </div>

        {/* Center Actions (Ingest Video) */}
        <div className="flex items-center justify-center flex-1 mx-4">
          <button
            onClick={() => setIsIngestModalOpen(true)}
            className="group flex items-center gap-2 rounded-full border border-[#D1FF00]/30 bg-[#D1FF00]/5 px-4 sm:px-5 py-2 text-xs font-bold text-white hover:bg-[#D1FF00]/10 hover:border-[#D1FF00] transition-all hover:scale-102 hover:shadow-[0_0_15px_rgba(209,255,0,0.15)] shadow-md"
          >
            <Plus className="h-4 w-4 text-[#D1FF00] group-hover:rotate-90 transition-transform duration-300" />
            <span>Ingerir Vídeo</span>
          </button>
        </div>

        {/* Navigation & Action Links */}
        <nav className="flex items-center gap-3 sm:gap-4 min-w-[200px] justify-end">
          {isLearningPage ? (
            <Link
              href="/eco/youlearn"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-[#D1FF00]/50 hover:text-white transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Back to Library</span>
              <span className="sm:hidden">Voltar</span>
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-400 border border-emerald-500/20 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Structured Knowledge Engine
              </span>
            </div>
          )}

          <Link
            href="/"
            className="hidden md:inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <span>AG47 Main</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </Link>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Eco Directory Link */}
          <Link
            href="/eco/evopro"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1FF00]/20 bg-[#D1FF00]/5 px-3 py-1.5 text-xs font-semibold text-[#D1FF00] hover:bg-[#D1FF00]/15 hover:border-[#D1FF00]/40 transition-all"
          >
            <Layers className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ecosystem</span>
          </Link>
        </nav>
      </div>

      {/* Autonomous Ingestion Modal */}
      <IngestVideoModal
        isOpen={isIngestModalOpen}
        onClose={() => setIsIngestModalOpen(false)}
      />
    </header>
  );
}
