'use client';

import React, { useState } from 'react';
import { KnowledgeObject } from '@/eco/youlearn/schema/types';
import { extractYoutubeId } from '@/eco/youlearn/lib/provenance';
import { YouLearnNavbar } from '../../components/YouLearnNavbar';
import { LearningPageRenderer } from './renderer/LearningPageRenderer';
import { LearningProgressTracker } from './components/LearningProgressTracker';
import { StickyFloatingMiniPlayer } from './components/StickyFloatingMiniPlayer';
import { FlashcardReviewModal } from './components/FlashcardReviewModal';
import Link from 'next/link';
import { BookOpen, ArrowLeft, Layers, Zap } from 'lucide-react';

interface LearningPageClientProps {
  knowledge: KnowledgeObject;
}

export function LearningPageClient({ knowledge }: LearningPageClientProps) {
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false);

  const videoId = extractYoutubeId(knowledge.source.url);
  const maxresBg = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : knowledge.thumbnail;
  const hqBg = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : knowledge.thumbnail;
  const [bgSrc, setBgSrc] = useState(maxresBg);

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-[#D1FF00] selection:text-black">
      {/* Full-Page Fixed Background Thumbnail with Crisp Backdrop */}
      {bgSrc && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={bgSrc}
            alt=""
            onError={() => setBgSrc(hqBg)}
            className="h-full w-full object-cover object-center filter blur-sm opacity-35 scale-105 transition-opacity duration-700"
          />
          {/* Dark gradient overlay to preserve high text contrast while keeping background artwork crisp */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/75 to-black/90" />
        </div>
      )}

      {/* Relative wrapper for all interactive page layers */}
      <div className="relative z-10">
        {/* Dynamic Navbar */}
        <YouLearnNavbar
          isLearningPage
          currentSlug={knowledge.slug}
          learningTitle={knowledge.title}
        />

        {/* Reading / Section Progress Tracker */}
        <LearningProgressTracker sections={knowledge.sections} />

        {/* Sticky Floating Mini-Player (Picture-in-Picture) */}
        <StickyFloatingMiniPlayer
          videoUrl={knowledge.source.url}
          thumbnailUrl={knowledge.thumbnail}
          title={knowledge.title}
          authorName={knowledge.source.author.name}
        />

        {/* Main Declarative Section Engine */}
        <main>
          <LearningPageRenderer knowledge={knowledge} />
        </main>

        {/* Flashcard Trigger Button */}
        <button
          onClick={() => setIsFlashcardModalOpen(true)}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-zinc-900 border border-[#D1FF00]/30 hover:border-[#D1FF00] hover:bg-[#D1FF00]/10 text-white px-5 py-3 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all hover:scale-105 group"
        >
          <Zap className="w-5 h-5 text-[#D1FF00] group-hover:animate-pulse" />
          <span className="font-semibold text-sm">Revisão Rápida</span>
        </button>

        {/* Flashcard Modal */}
        <FlashcardReviewModal 
          isOpen={isFlashcardModalOpen} 
          onClose={() => setIsFlashcardModalOpen(false)} 
          sections={knowledge.sections} 
        />

        {/* Footer Navigation */}
        <footer className="border-t border-white/10 bg-zinc-950/90 backdrop-blur-md py-12 text-center text-xs text-zinc-500">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#D1FF00]" />
              <span className="font-bold text-white">YouLearn</span>
              <span>· Knowledge Experience Completed</span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/eco/youlearn"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900 px-3.5 py-2 text-zinc-300 hover:text-white hover:border-[#D1FF00]/40 transition-all shadow-md"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Voltar para a Biblioteca</span>
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
