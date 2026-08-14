'use client';

import React, { useState, useEffect } from 'react';
import { Section } from '@/eco/youlearn/schema/types';
import { BookOpen, ChevronUp, List, CheckCircle2 } from 'lucide-react';

interface LearningProgressTrackerProps {
  sections: Section[];
}

export function LearningProgressTracker({ sections }: LearningProgressTrackerProps) {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id || '');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollPercent(Math.round(currentProgress));
      }

      // Scroll spy for sections
      const scrollPos = window.scrollY + 220;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSectionId(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - 80;
      window.scrollTo({ top, behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Thin Progress Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 h-1 bg-black/40">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 via-[#D1FF00] to-cyan-400 transition-all duration-150"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

      {/* Floating Bottom Tracker Pill */}
      <aside aria-label="Navegação da Leitura" className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <div className="flex items-center rounded-2xl border border-white/15 bg-black/80 p-1.5 shadow-2xl backdrop-blur-xl">
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
            title="Table of Contents"
          >
            <List className="h-3.5 w-3.5 text-[#D1FF00]" />
            <span className="hidden sm:inline">Sections</span>
            <span className="rounded bg-[#D1FF00]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#D1FF00]">
              {scrollPercent}%
            </span>
          </button>

          <button
            onClick={scrollToTop}
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
            title="Scroll to top"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        </div>

        {/* Popover Table of Contents */}
        {isMenuOpen && (
          <div className="absolute bottom-14 right-0 w-72 sm:w-80 rounded-2xl border border-white/15 bg-zinc-950 p-4 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
              <span className="text-xs font-mono font-bold uppercase text-zinc-400">
                Table of Contents
              </span>
              <span className="text-xs font-mono text-[#D1FF00]">{scrollPercent}% Complete</span>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
              {sections.map((sec, idx) => {
                const isActive = activeSectionId === sec.id;
                return (
                  <button
                    key={sec.id || idx}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left rounded-lg px-2.5 py-2 text-xs transition-all flex items-center justify-between gap-2 ${
                      isActive
                        ? 'bg-[#D1FF00]/10 text-[#D1FF00] font-semibold border border-[#D1FF00]/30'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[10px] opacity-60">0{idx + 1}</span>
                      <span className="truncate">{sec.title}</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase text-zinc-500 shrink-0">
                      {sec.type}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
