'use client';

import React from 'react';
import { OverviewSectionContent, BaseSection } from '@/eco/youlearn/schema/types';
import { Target, Lightbulb, Compass, CheckCircle2, UserCheck } from 'lucide-react';

interface LearningOverviewSectionProps {
  section: BaseSection<OverviewSectionContent>;
}

export function LearningOverviewSection({ section }: LearningOverviewSectionProps) {
  const { executiveSummary, coreThesis, whyItMatters, prerequisites, targetAudience } = section.content;

  return (
    <section id={section.id} className="py-10 border-b border-white/10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 text-xs font-mono text-[#D1FF00] border border-white/10">
            <Compass className="h-3.5 w-3.5" />
            <span>01 / Overview</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="mt-1 text-sm text-zinc-400">{section.subtitle}</p>
          )}
        </div>

        {/* Executive Summary Main Callout */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-amber-400">
                Executive Summary
              </h3>
              <p className="mt-2 text-base text-zinc-200 leading-relaxed">
                {executiveSummary}
              </p>
            </div>
          </div>

          {/* Core Thesis Highlight */}
          <div className="mt-6 rounded-xl border border-[#D1FF00]/30 bg-[#D1FF00]/5 p-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D1FF00]">
              <Target className="h-4 w-4" />
              <span>CORE THESIS</span>
            </div>
            <p className="mt-1.5 text-sm sm:text-base font-semibold text-white leading-snug">
              “{coreThesis}”
            </p>
          </div>

          {/* Why it matters */}
          {whyItMatters && (
            <div className="mt-4 text-xs text-zinc-400 leading-relaxed pl-1">
              <span className="font-semibold text-zinc-300 font-mono">Why this matters: </span>
              {whyItMatters}
            </div>
          )}
        </div>

        {/* Prerequisites & Audience Chips */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {prerequisites && prerequisites.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-300 mb-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Prerequisites</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {prerequisites.map((req, i) => (
                  <span
                    key={i}
                    className="rounded-md border border-white/5 bg-zinc-800/80 px-2.5 py-1 text-xs text-zinc-300"
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>
          )}

          {targetAudience && targetAudience.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-300 mb-2.5">
                <UserCheck className="h-4 w-4 text-[#D1FF00]" />
                <span>Target Audience</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {targetAudience.map((aud, i) => (
                  <span
                    key={i}
                    className="rounded-md border border-white/5 bg-zinc-800/80 px-2.5 py-1 text-xs text-zinc-300"
                  >
                    {aud}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
