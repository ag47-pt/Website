'use client';

import React from 'react';
import { TimelineSectionContent, BaseSection, Source } from '@/eco/youlearn/schema/types';
import { buildTimestampedSourceUrl } from '@/eco/youlearn/lib/provenance';
import { Clock, Play, ExternalLink, Milestone, CheckCircle2 } from 'lucide-react';

interface LearningTimelineSectionProps {
  section: BaseSection<TimelineSectionContent>;
  source: Source;
}

export function LearningTimelineSection({ section, source }: LearningTimelineSectionProps) {
  const { introText, chapters } = section.content;

  return (
    <section id={section.id} className="py-12 border-b border-white/10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 text-xs font-mono text-[#D1FF00] border border-white/10">
            <Milestone className="h-3.5 w-3.5" />
            <span>02 / Learning Timeline</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="mt-1 text-sm text-zinc-400">{section.subtitle}</p>
          )}
          {introText && (
            <p className="mt-3 text-sm text-zinc-300 leading-relaxed max-w-3xl">
              {introText}
            </p>
          )}
        </div>

        {/* Vertical Timeline Track */}
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#D1FF00] before:via-zinc-700 before:to-zinc-800">
          {chapters.map((chapter, index) => {
            const timestampUrl = chapter.timestampSeconds !== undefined
              ? buildTimestampedSourceUrl(source.url, chapter.timestampSeconds)
              : buildTimestampedSourceUrl(source.url, chapter.timestampDisplay);

            return (
              <div
                key={chapter.id || index}
                className="group relative rounded-2xl border border-white/10 bg-zinc-950/70 p-5 backdrop-blur-md transition-all hover:border-[#D1FF00]/40 hover:bg-zinc-900/60"
              >
                {/* Timeline Node Bullet */}
                <div className="absolute -left-[27px] sm:-left-[35px] top-6 flex h-6 w-6 items-center justify-center rounded-full border border-[#D1FF00] bg-black text-[10px] font-mono font-bold text-[#D1FF00] shadow-[0_0_10px_rgba(209,255,0,0.3)]">
                  {index + 1}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {chapter.badge && (
                      <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-mono uppercase text-zinc-300">
                        {chapter.badge}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-white group-hover:text-[#D1FF00] transition-colors">
                      {chapter.title}
                    </h3>
                  </div>

                  {/* Timestamp Jump Link */}
                  {chapter.timestampDisplay && (
                    <div className="flex items-center gap-1.5 self-start sm:self-auto">
                      <button
                        onClick={() => {
                          if (chapter.timestampSeconds !== undefined) {
                            window.dispatchEvent(new CustomEvent('youlearn:seek', {
                              detail: { timeSeconds: chapter.timestampSeconds, autoplay: true }
                            }));
                          } else {
                            window.open(timestampUrl, '_blank');
                          }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1FF00]/30 bg-[#D1FF00]/10 px-2.5 py-1 text-xs font-mono text-[#D1FF00] hover:border-[#D1FF00]/60 hover:bg-[#D1FF00]/20 transition-all shadow-[0_0_10px_rgba(209,255,0,0.1)]"
                        title={`Sincronizar vídeo para ${chapter.timestampDisplay}`}
                      >
                        <Play className="h-3 w-3 fill-current" />
                        <span>Ir para {chapter.timestampDisplay}</span>
                      </button>
                      <a
                        href={timestampUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-[26px] w-[26px] items-center justify-center rounded-lg border border-white/10 bg-black/60 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="Abrir no YouTube"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed mb-3">
                  {chapter.summary}
                </p>

                {/* Key Concepts Tags */}
                {chapter.keyConcepts && chapter.keyConcepts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                    <span className="text-[11px] font-mono text-zinc-500 mr-1 self-center">Key Concepts:</span>
                    {chapter.keyConcepts.map((concept, i) => (
                      <span
                        key={i}
                        className="rounded-md border border-white/5 bg-zinc-900 px-2 py-0.5 text-[11px] font-mono text-zinc-400"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
