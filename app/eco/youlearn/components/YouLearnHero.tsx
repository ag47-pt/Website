'use client';

import React from 'react';
import { Search, Sparkles, Zap, Clock, ShieldCheck, ArrowRight, Play, Compass } from 'lucide-react';
import { LibraryEntry } from '@/eco/youlearn/schema/types';
import { getLibraryStats } from '@/eco/youlearn/lib/library';

interface YouLearnHeroProps {
  entries: LibraryEntry[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export function YouLearnHero({ entries, searchQuery, onSearchChange }: YouLearnHeroProps) {
  const stats = getLibraryStats(entries);

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-black via-zinc-950 to-black py-12 sm:py-16">
      {/* Background Decorative Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(209,255,0,0.12),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#D1FF00]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Tagline Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D1FF00]/30 bg-[#D1FF00]/10 px-3.5 py-1 text-xs font-mono font-medium text-[#D1FF00] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Structured Visual Knowledge Engine</span>
          </div>

          {/* Main Title */}
          <h1 className="max-w-4xl text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
            Learn 2-hour deep dives in <span className="text-[#D1FF00] underline decoration-[#D1FF00]/40 decoration-wavy underline-offset-8">~10 minutes</span>.
          </h1>

          {/* Subtitle */}
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-zinc-400 leading-relaxed">
            YouLearn transforms hours of unstructured lectures, technical talks, and papers into rich, interactive visual learning pages with timelines, diagrams, and code.
          </p>

          {/* Real-time Search Input */}
          <div className="mt-8 w-full max-w-2xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by topic, author, concept, category (e.g. Karpathy, Transformers, RAG, Loops)..."
                className="w-full rounded-2xl border border-white/15 bg-zinc-900/90 py-3.5 pl-12 pr-10 text-sm text-white placeholder-zinc-500 shadow-2xl backdrop-blur-xl focus:border-[#D1FF00] focus:outline-none focus:ring-1 focus:ring-[#D1FF00] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-4 text-xs font-mono text-zinc-400 hover:text-white"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Quick Suggestions Chips */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400">
              <span className="font-mono text-[11px] text-zinc-500">Try searching:</span>
              {['Transformers', 'Karpathy', 'LangGraph', 'Systems Thinking', 'RAG'].map((item) => (
                <button
                  key={item}
                  onClick={() => onSearchChange(item)}
                  className="rounded-md border border-white/5 bg-zinc-800/40 px-2 py-0.5 text-zinc-300 hover:border-[#D1FF00]/40 hover:text-[#D1FF00] transition-all"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Value Metrics Grid */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 w-full max-w-4xl">
            <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-3.5 text-center backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">{stats.totalEntries}</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Structured Modules</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-3.5 text-center backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-extrabold text-zinc-300 font-mono">{stats.totalOriginalHours}h</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Original Lectures</div>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-center backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">{stats.totalHoursSaved}h</div>
              <div className="text-[11px] text-emerald-400/80 mt-0.5">Time Saved</div>
            </div>

            <div className="rounded-xl border border-[#D1FF00]/20 bg-[#D1FF00]/5 p-3.5 text-center backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-extrabold text-[#D1FF00] font-mono">
                {stats.avgCompressionPercent}%
              </div>
              <div className="text-[11px] text-[#D1FF00]/80 mt-0.5">Avg Compression</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
