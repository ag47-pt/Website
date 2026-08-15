'use client';

import React from 'react';
import { KnowledgeObject } from '@/eco/youlearn/schema/types';
import { formatDurationHuman, buildTimestampedSourceUrl, extractYoutubeId } from '@/eco/youlearn/lib/provenance';
import { Clock, Zap, ExternalLink, Play, Sparkles, BookOpen, Layers, Film, Home, Network, TrendingUp } from 'lucide-react';
import { CinematicHeroPlayer } from '../components/CinematicHeroPlayer';
import { ExportKnowledgeButton } from '../components/ExportKnowledgeButton';
import { ShareKnowledgeButton } from '../components/ShareKnowledgeButton';
import { GlobalBreadcrumb } from '@/components/ui/GlobalBreadcrumb';
import { CountUp } from '@/components/ui/CountUp';

interface LearningHeroSectionProps {
  knowledge: KnowledgeObject;
}

export function LearningHeroSection({ knowledge }: LearningHeroSectionProps) {
  const { title, subtitle, description, source, learning, topics, category, thumbnail } = knowledge;
  const originalUrl = buildTimestampedSourceUrl(source.url, 0);
  const videoId = extractYoutubeId(source.url);

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-transparent pt-4 pb-8 sm:pt-6 sm:pb-12">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-[#D1FF00]/10 blur-[180px] pointer-events-none z-0" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb Navigation Tag */}
        <div className="mb-5 flex items-center justify-start">
          <GlobalBreadcrumb
            items={[
              { label: 'HOME', href: '/', icon: <Home className="w-3 h-3" /> },
              { label: 'ECO HUB', href: '/eco', icon: <Network className="w-3 h-3" /> },
              { label: 'YOULEARN ACADEMY', href: '/eco/youlearn', icon: <BookOpen className="w-3 h-3" /> },
              { label: knowledge.title.toUpperCase(), icon: <Sparkles className="w-3 h-3" /> }
            ]}
          />
        </div>

        {/* Top Header Bar: Category, Source Attribution & Export/Share Actions */}
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

          <div className="flex items-center gap-2.5">
            <ShareKnowledgeButton knowledge={knowledge} />
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

          {/* Compression & Metric Banner (Balanced 4-Column Responsive Deck) */}
          <div className="mt-8 rounded-2xl border border-white/15 bg-zinc-950/80 p-3 sm:p-4 shadow-2xl backdrop-blur-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
              
              {/* Stat 1: Original Lecture */}
              <div className="flex items-center gap-3.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-colors hover:border-white/10 hover:bg-white/[0.04]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-zinc-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    Original Lecture
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white font-mono truncate">
                    {formatDurationHuman(learning.originalDurationMinutes)}
                  </div>
                </div>
              </div>

              {/* Stat 2: YouLearn Time */}
              <div className="flex items-center gap-3.5 rounded-xl border border-[#D1FF00]/20 bg-[#D1FF00]/[0.03] p-3 transition-colors hover:border-[#D1FF00]/40 hover:bg-[#D1FF00]/[0.06]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D1FF00]/40 bg-[#D1FF00]/10 text-[#D1FF00]">
                  <Zap className="h-5 w-5 fill-[#D1FF00]" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#D1FF00] font-semibold">
                    YouLearn Time
                  </div>
                  <div className="text-base sm:text-lg font-bold text-[#D1FF00] font-mono truncate">
                    ~<CountUp value={formatDurationHuman(learning.estimatedLearningMinutes)} duration={1.6} />
                  </div>
                </div>
              </div>

              {/* Stat 3: Efficiency Gain */}
              <div className="flex items-center gap-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-3 transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/[0.06]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                    Efficiency Gain
                  </div>
                  <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono truncate">
                    <CountUp value={`${learning.compressionRatioPercent}%`} duration={1.8} /> faster
                  </div>
                </div>
              </div>

              {/* Action 4: Assistir no YouTube */}
              <div className="flex items-center">
                <a
                  href={originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn flex h-full min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold font-mono uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:border-[#D1FF00] hover:bg-[#D1FF00] hover:text-black hover:shadow-[0_0_20px_rgba(209,255,0,0.25)] active:scale-95"
                >
                  <svg className="h-4 w-4 text-red-500 group-hover/btn:text-black fill-current transition-colors shrink-0" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  <span className="whitespace-nowrap">Assistir no YouTube</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-70 group-hover/btn:opacity-100 shrink-0" />
                </a>
              </div>

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
