'use client';

import React, { useState, useEffect } from 'react';
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

function ConfettiEffect() {
  const colors = ['#D1FF00', '#FF007F', '#00F0FF', '#FFB700', '#A020F0'];
  const particles = Array.from({ length: 80 }).map((_, i) => {
    const left = Math.random() * 100; // %
    const delay = Math.random() * 3; // s
    const duration = 2.5 + Math.random() * 2.5; // s
    const size = 6 + Math.random() * 8; // px
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = Math.random() > 0.5 ? 'rounded-full' : 'rotate-45';
    
    return { id: i, left, delay, duration, size, color, shape };
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute top-[-20px] ${p.shape} animate-fall opacity-80`}
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            animationIterationCount: 1,
            animationFillMode: 'forwards',
          }}
        />
      ))}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}} />
    </div>
  );
}

export function LearningPageClient({ knowledge }: LearningPageClientProps) {
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const videoId = extractYoutubeId(knowledge.source.url);
  const maxresBg = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : knowledge.thumbnail;
  const hqBg = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : knowledge.thumbnail;
  const [bgSrc, setBgSrc] = useState(maxresBg);

  useEffect(() => {
    const handleCourseCompleted = (e: CustomEvent<{ videoId: string }>) => {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 6000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('youlearn:course-completed' as any, handleCourseCompleted);
    return () => window.removeEventListener('youlearn:course-completed' as any, handleCourseCompleted);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-[#D1FF00] selection:text-black">
      {showConfetti && <ConfettiEffect />}
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
