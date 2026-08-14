'use client';

import React from 'react';
import { ProcessSectionContent, BaseSection, Source } from '@/eco/youlearn/schema/types';
import { buildTimestampedSourceUrl } from '@/eco/youlearn/lib/provenance';
import { ListOrdered, CheckCircle2, AlertCircle, ArrowDown, Play, ExternalLink } from 'lucide-react';

interface ProcessSectionProps {
  section: BaseSection<ProcessSectionContent>;
  source?: Source;
}

export function ProcessSection({ section, source }: ProcessSectionProps) {
  const { summary, steps, outcomeSummary } = section.content;

  return (
    <section id={section.id} className="py-12 border-b border-white/10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 text-xs font-mono text-[#D1FF00] border border-white/10">
            <ListOrdered className="h-3.5 w-3.5" />
            <span>Process & Execution Workflow</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="mt-1 text-sm text-zinc-400">{section.subtitle}</p>
          )}
          {summary && (
            <p className="mt-3 text-sm text-zinc-300 leading-relaxed max-w-3xl">
              {summary}
            </p>
          )}
        </div>

        {/* Sequential Steps List */}
        <div className="space-y-4">
          {steps.map((step, idx) => {
            const stepUrl =
              step.provenanceTimestamp && source
                ? buildTimestampedSourceUrl(source.url, step.provenanceTimestamp)
                : null;

            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-white/10 bg-zinc-950/80 p-5 backdrop-blur-md transition-all hover:border-[#D1FF00]/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#D1FF00]/10 border border-[#D1FF00]/30 font-mono text-xs font-bold text-[#D1FF00]">
                      {step.stepNumber}
                    </div>

                    <div>
                      {step.badge && (
                        <span className="mr-2 rounded bg-white/5 px-2 py-0.5 text-[10px] font-mono uppercase text-zinc-400 border border-white/5">
                          {step.badge}
                        </span>
                      )}
                      <span className="text-base font-bold text-white group-hover:text-[#D1FF00] transition-colors">
                        {step.title}
                      </span>
                    </div>
                  </div>

                  {stepUrl && (
                    <a
                      href={stepUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 px-2.5 py-1 text-xs font-mono text-zinc-400 hover:text-[#D1FF00] transition-all self-start sm:self-auto"
                    >
                      <Play className="h-3 w-3 text-red-400 fill-current" />
                      <span>{step.provenanceTimestamp}</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  )}
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed pl-0 sm:pl-11">
                  {step.description}
                </p>

                {/* Substeps */}
                {step.substeps && step.substeps.length > 0 && (
                  <div className="mt-3 sm:ml-11 rounded-xl bg-black/50 p-3 border border-white/5 space-y-1.5">
                    {step.substeps.map((substep, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 text-xs text-zinc-400">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>{substep}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Step Warning */}
                {step.warning && (
                  <div className="mt-3 sm:ml-11 flex items-start gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-xs text-amber-300">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                    <span>{step.warning}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Process Outcome Summary */}
        {outcomeSummary && (
          <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs sm:text-sm text-emerald-300 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <span className="font-bold font-mono uppercase mr-1">Result:</span>
              {outcomeSummary}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
