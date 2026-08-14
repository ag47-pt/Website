'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Zap, ArrowUpRight, Video, BookOpen, FileText, CheckCircle2, User, Sparkles } from 'lucide-react';
import { LibraryEntry } from '@/eco/youlearn/schema/types';
import { formatDurationHuman, extractYoutubeId, formatSecondsToTimestamp } from '@/eco/youlearn/lib/provenance';

interface KnowledgeCardProps {
  entry: LibraryEntry;
  featured?: boolean;
  progressPercent?: number;
  isCompleted?: boolean;
  resumeSeconds?: number;
}

export function KnowledgeCard({ entry, featured, progressPercent = 0, isCompleted = false, resumeSeconds = 0 }: KnowledgeCardProps) {
  const sourceIcon = () => {
    switch (entry.sourceType) {
      case 'youtube':
        return (
          <svg className="h-3.5 w-3.5 text-red-500 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        );
      case 'pdf':
      case 'document':
        return <FileText className="h-3.5 w-3.5 text-blue-400" />;
      default:
        return <Video className="h-3.5 w-3.5 text-emerald-400" />;
    }
  };

  const difficultyColor = {
    beginner: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
    intermediate: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
    advanced: 'text-rose-400 border-rose-500/20 bg-rose-500/10',
  }[entry.difficulty] || 'text-zinc-400 border-zinc-500/20 bg-zinc-500/10';

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#D1FF00]/40 hover:shadow-[0_12px_30px_-10px_rgba(209,255,0,0.15)] ${
        featured
          ? 'border-[#D1FF00]/30 shadow-[0_4px_24px_-4px_rgba(209,255,0,0.1)] lg:col-span-2'
          : 'border-white/10'
      }`}
    >
      {/* Top Header Row: Source attribution + Badges */}
      <div>
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[11px] font-medium text-zinc-300">
              {sourceIcon()}
              <span className="capitalize">{entry.sourceType}</span>
            </span>
            <span className="text-zinc-600">·</span>
            <span className="truncate text-xs text-zinc-400" title={entry.authorName}>
              {entry.authorName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {entry.featured && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#D1FF00]/40 bg-[#D1FF00]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#D1FF00]">
                <Sparkles className="h-3 w-3" />
                Featured
              </span>
            )}
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${difficultyColor}`}
            >
              {entry.difficulty}
            </span>
          </div>
        </div>

        {/* Thumbnail + Compression Badge Overlay */}
        <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950">
          <img
            src={entry.thumbnail}
            alt={entry.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Centered Play Button on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D1FF00]/40 bg-black/60 text-[#D1FF00] shadow-lg shadow-black/80 backdrop-blur-md">
              <svg className="h-5 w-5 fill-[#D1FF00] translate-x-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Time Compression Badge */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between rounded-lg border border-white/10 bg-black/80 px-3 py-1.5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-400 line-through decoration-zinc-500">
                {formatDurationHuman(entry.originalDurationMinutes)}
              </span>
              <span className="text-zinc-500">→</span>
              <span className="font-semibold text-[#D1FF00] flex items-center gap-1">
                <Zap className="h-3 w-3 fill-[#D1FF00]" />
                ~{formatDurationHuman(entry.estimatedLearningMinutes)}
              </span>
            </div>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold font-mono text-emerald-400 border border-emerald-500/30">
              {entry.compressionRatioPercent}% faster
            </span>
          </div>

          {/* Progress Bar Overlay */}
          {progressPercent > 0 && (
            <div 
              className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-10 group/progress cursor-default"
              title={isCompleted ? 'Concluído ✓' : `Parou em ${formatSecondsToTimestamp(resumeSeconds)}`}
            >
              <div 
                className={`h-full transition-all duration-300 ${isCompleted ? 'bg-emerald-400' : 'bg-[#D1FF00]'}`} 
                style={{ width: `${progressPercent}%` }} 
              />
              {/* Tooltip */}
              <div className="opacity-0 group-hover/progress:opacity-100 transition-opacity duration-200 absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/90 border border-white/10 px-2.5 py-1 text-[10px] font-mono text-zinc-200 shadow-lg pointer-events-none backdrop-blur-sm z-20">
                {isCompleted ? '✓ Concluído' : `⏸ Parou em ${formatSecondsToTimestamp(resumeSeconds)}`}
              </div>
            </div>
          )}
        </div>

        {/* Title and Description */}
        <div className="mb-3">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="rounded bg-white/5 px-2 py-0.5 text-[11px] font-medium text-zinc-400 border border-white/5">
              {entry.category}
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">
              {entry.sectionCount} Visual Sections
            </span>
          </div>

          <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-[#D1FF00] transition-colors line-clamp-2">
            {entry.title}
          </h3>

          {entry.subtitle && (
            <p className="mt-1 text-xs text-zinc-400 line-clamp-1">{entry.subtitle}</p>
          )}
        </div>

        {/* Short Takeaway Quote */}
        {entry.shortTakeaway && (
          <div className="mb-4 rounded-xl border border-white/5 bg-black/40 p-3 text-xs leading-relaxed text-zinc-300">
            <span className="text-[#D1FF00] font-serif font-bold text-sm mr-1">“</span>
            <span className="italic line-clamp-2">{entry.shortTakeaway}</span>
            <span className="text-[#D1FF00] font-serif font-bold text-sm ml-1">”</span>
          </div>
        )}

        {/* Topic Badges */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {entry.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="rounded-md border border-white/5 bg-zinc-800/60 px-2 py-0.5 text-[11px] text-zinc-300 font-mono"
            >
              #{topic}
            </span>
          ))}
          {entry.topics.length > 4 && (
            <span className="rounded-md px-1.5 py-0.5 text-[10px] text-zinc-500 font-mono">
              +{entry.topics.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Bottom Footer CTA */}
      <div className="border-t border-white/10 pt-4 mt-2 flex items-center justify-between">
        {isCompleted ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold font-mono uppercase tracking-wide">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Concluído</span>
          </div>
        ) : progressPercent > 0 ? (
          <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-mono">
            <span className="h-2 w-2 rounded-full bg-[#D1FF00] animate-pulse" />
            <span>{progressPercent}% Assistido</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
            <span>Não iniciado</span>
          </div>
        )}

        <Link
          href={`/eco/youlearn/learn/${entry.slug}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#D1FF00] px-3.5 py-1.5 text-xs font-bold text-black shadow-[0_0_15px_rgba(209,255,0,0.2)] hover:bg-[#b8e000] hover:shadow-[0_0_20px_rgba(209,255,0,0.4)] transition-all"
        >
          <span>Explore</span>
          <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
        </Link>
      </div>
    </div>
  );
}
