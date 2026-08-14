'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TakeawaysSectionContent, BaseSection, Source } from '@/eco/youlearn/schema/types';
import { CheckSquare, Square, CheckCircle2, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface TakeawaysSectionProps {
  section: BaseSection<TakeawaysSectionContent>;
  source?: Source;
}

export function TakeawaysSection({ section }: TakeawaysSectionProps) {
  const { mainPoints, actionableChecklist, nextSteps, recommendedFollowUps } = section.content;
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <section id={section.id} className="py-12 border-b border-white/10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 text-xs font-mono text-[#D1FF00] border border-white/10">
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Synthesis & Action Plan</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="mt-1 text-sm text-zinc-400">{section.subtitle}</p>
          )}
        </div>

        {/* Main Points Summary Grid */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 backdrop-blur-xl mb-8">
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#D1FF00] mb-4">
            Key Synthesis Points
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mainPoints.map((point, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-white/5 bg-zinc-900/60 p-4"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#D1FF00]/10 font-mono text-xs font-bold text-[#D1FF00]">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Interactive Checklist */}
        {actionableChecklist && actionableChecklist.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 backdrop-blur-xl mb-8">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-emerald-400 mb-4">
              Actionable Implementation Checklist
            </h3>
            <div className="space-y-2.5">
              {actionableChecklist.map((item, idx) => {
                const isDone = Boolean(checkedItems[idx]);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`w-full text-left rounded-xl border p-3.5 text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${
                      isDone
                        ? 'border-emerald-500/30 bg-emerald-500/5 text-zinc-400 line-through'
                        : 'border-white/5 bg-zinc-900/40 text-zinc-200 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isDone ? (
                        <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="h-4 w-4 text-zinc-500 shrink-0" />
                      )}
                      <span>{item.text}</span>
                    </div>

                    {item.category && (
                      <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-mono text-zinc-400 shrink-0">
                        {item.category}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Next Steps & Recommended Follow-ups */}
        {recommendedFollowUps && recommendedFollowUps.length > 0 && (
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Recommended Connected Knowledge
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedFollowUps.map((rec, idx) => (
                <Link
                  key={idx}
                  href={rec.linkOrSlug}
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900/60 p-4 transition-all hover:border-[#D1FF00]/40 hover:bg-zinc-900"
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#D1FF00]">
                      {rec.type}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#D1FF00] transition-colors mt-0.5">
                      {rec.title}
                    </h4>
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-[#D1FF00] group-hover:translate-x-1 transition-all shrink-0 ml-3" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
