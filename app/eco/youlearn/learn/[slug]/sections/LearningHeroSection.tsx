'use client';

import React from 'react';
import { KnowledgeObject } from '@/eco/youlearn/schema/types';
import { formatDurationHuman, buildTimestampedSourceUrl, extractYoutubeId } from '@/eco/youlearn/lib/provenance';
import { Clock, Zap, ExternalLink, Play, Sparkles, BookOpen, Layers, Film } from 'lucide-react';
import { CinematicHeroPlayer } from '../components/CinematicHeroPlayer';
import { ExportKnowledgeButton } from '../components/ExportKnowledgeButton';

interface LearningHeroSectionProps {
  knowledge: KnowledgeObject;
}

export function LearningHeroSection({ knowledge }: LearningHeroSectionProps) {
  const { title, subtitle, description, source, learning, topics, category, thumbnail } = knowledge;
  const originalUrl = buildTimestampedSourceUrl(source.url, 0);
  const videoId = extractYoutubeId(source.url);

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-transparent py-8 sm:py-12">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-[#D1FF00]/10 blur-[180px] pointer-events-none z-0" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Bar: Category, Source Attribution & Export Action */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-[#D1FF00]/30 bg-[#D1FF00]/10 px-2.5 py-0.5 text-xs font-mono font-semibold text-[#D1FF00]">
              {category}
            </span>
            <span className="text-zinc-600">/</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-300">
              <span className="text-zinc-500">Source:</span>
              <span className="font-semibold text-white">{source.author.name}</span>
              {source.author.channelOrOrg && (
                <span className="text-zinc-400 font-mono text-[11px]">({source.author.channelOrOrg})</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ExportKnowledgeButton knowledge={knowledge} />
          </div>
        </div>

        {/* TOP CINEMATIC VIDEO PLAYER (Adjustable Size & Responsive) */}
        <div className="mb-10 w-full">
          <CinematicHeroPlayer
            videoUrl={source.url}
            thumbnailUrl={thumbnail}
            title={title}
            initialTimeSeconds={0}
          />
        </div>

        {/* Main Content Deck below the Video Player */}
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="mt-3.5 text-base sm:text-lg font-medium text-zinc-300">
              {subtitle}
            </p>
          )}

          {/* Description */}
          <p className="mt-3.5 text-sm sm:text-base text-zinc-400 leading-relaxed">
            {description}
          </p>

          {/* Compression & Metric Banner */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border border-white/15 bg-zinc-950/80 p-4 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-zinc-400">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Original Lecture</div>
                <div className="text-base font-bold text-white font-mono">
                  {formatDurationHuman(learning.originalDurationMinutes)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D1FF00]/40 bg-[#D1FF00]/10 text-[#D1FF00]">
                <Zap className="h-5 w-5 fill-[#D1FF00]" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-[#D1FF00] uppercase tracking-wider">YouLearn Time</div>
                <div className="text-base font-bold text-[#D1FF00] font-mono">
                  ~{formatDurationHuman(learning.estimatedLearningMinutes)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 sm:border-l sm:border-white/10 sm:pl-4">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Efficiency Gain</div>
                <div className="text-base font-bold text-emerald-400 font-mono">
                  {learning.compressionRatioPercent}% faster
                </div>
              </div>

              <a
                href={originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/15 px-4 py-2 text-xs font-semibold text-white hover:bg-[#D1FF00] hover:text-black hover:border-[#D1FF00] transition-all w-full sm:w-auto justify-center shadow-lg"
              >
                <svg className="h-4 w-4 text-red-500 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>Assistir no YouTube</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-70" />
              </a>
            </div>
          </div>

          {/* Topics Row */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-zinc-500">Tópicos:</span>
            {topics.map((topic) => (
              <span
                key={topic}
                className="rounded-lg border border-white/10 bg-zinc-900/80 px-2.5 py-1 text-xs font-mono text-zinc-300 backdrop-blur-md hover:border-[#D1FF00]/40 transition-colors"
              >
                #{topic}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
