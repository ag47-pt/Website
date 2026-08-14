'use client';

import React from 'react';
import { InsightSectionContent, BaseSection, Source } from '@/eco/youlearn/schema/types';
import { Sparkles, AlertTriangle, Lightbulb, Compass, Quote } from 'lucide-react';

interface InsightSectionProps {
  section: BaseSection<InsightSectionContent>;
  source?: Source;
}

export function InsightSection({ section }: InsightSectionProps) {
  const { items } = section.content;

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      case 'mental_model':
        return <Compass className="h-5 w-5 text-[#D1FF00]" />;
      case 'pro_tip':
        return <Sparkles className="h-5 w-5 text-cyan-400" />;
      default:
        return <Lightbulb className="h-5 w-5 text-emerald-400" />;
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
      case 'mental_model':
        return 'border-[#D1FF00]/30 bg-[#D1FF00]/10 text-[#D1FF00]';
      case 'pro_tip':
        return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300';
      default:
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
    }
  };

  return (
    <section id={section.id} className="py-12 border-b border-white/10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 text-xs font-mono text-[#D1FF00] border border-white/10">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Key Insights & Mental Models</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="mt-1 text-sm text-zinc-400">{section.subtitle}</p>
          )}
        </div>

        {/* Insight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-zinc-950/80 p-6 backdrop-blur-md transition-all hover:border-white/20"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`rounded-md border px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider font-semibold ${getBadgeStyle(
                      item.type
                    )}`}
                  >
                    {item.type.replace('_', ' ')}
                  </span>
                  <div className="p-1 rounded-lg bg-zinc-900 border border-white/5">
                    {getIcon(item.type)}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {item.description}
                </p>

                {item.quote && (
                  <div className="mt-3 rounded-xl border border-white/5 bg-black/50 p-3 text-xs italic text-zinc-300">
                    <Quote className="h-3.5 w-3.5 text-[#D1FF00] inline mr-1 opacity-80" />
                    <span>“{item.quote.text}”</span>
                    <span className="block mt-1 font-mono not-italic text-[10px] text-[#D1FF00]">
                      — {item.quote.author}
                    </span>
                  </div>
                )}
              </div>

              {item.actionableAdvice && (
                <div className="mt-4 pt-3 border-t border-white/10 text-xs text-emerald-400 flex items-center gap-1.5 font-mono">
                  <span className="font-bold uppercase">Heuristic:</span>
                  <span className="text-zinc-300">{item.actionableAdvice}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
