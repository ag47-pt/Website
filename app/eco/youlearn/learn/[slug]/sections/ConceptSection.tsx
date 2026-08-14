'use client';

import React, { useState } from 'react';
import { ConceptSectionContent, BaseSection, Source } from '@/eco/youlearn/schema/types';
import { buildTimestampedSourceUrl } from '@/eco/youlearn/lib/provenance';
import { Brain, Code, Copy, Check, Quote, AlertTriangle, Lightbulb, Play, ExternalLink } from 'lucide-react';

interface ConceptSectionProps {
  section: BaseSection<ConceptSectionContent>;
  source?: Source;
}

export function ConceptSection({ section, source }: ConceptSectionProps) {
  const { coreIdea, deepDive, keyTakeaways, diagram, codeSnippet, callout } = section.content;
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (codeSnippet?.code) {
      navigator.clipboard.writeText(codeSnippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const provenanceUrl =
    section.provenance && source
      ? buildTimestampedSourceUrl(
          section.provenance.sourceUrl || source.url,
          section.provenance.timestampSeconds || section.provenance.timestampDisplay
        )
      : null;

  return (
    <section id={section.id} className="py-12 border-b border-white/10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 text-xs font-mono text-[#D1FF00] border border-white/10">
              <Brain className="h-3.5 w-3.5" />
              <span>Concept Deep Dive</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {section.title}
            </h2>
            {section.subtitle && (
              <p className="mt-1 text-sm text-zinc-400">{section.subtitle}</p>
            )}
          </div>

          {/* Provenance Badge if present */}
          {provenanceUrl && (
            <a
              href={provenanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:border-[#D1FF00]/40 hover:text-[#D1FF00] transition-all self-start sm:self-auto"
            >
              <Play className="h-3 w-3 text-red-400 fill-current" />
              <span>
                Timestamp · {section.provenance?.timestampDisplay || 'Source'}
              </span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          )}
        </div>

        {/* Core Idea Card */}
        <div className="rounded-2xl border border-[#D1FF00]/20 bg-zinc-950/80 p-6 backdrop-blur-xl">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#D1FF00] mb-2">
            The Core Concept
          </div>
          <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
            {coreIdea}
          </p>

          <div className="mt-4 pt-4 border-t border-white/10 text-sm text-zinc-300 leading-relaxed">
            {deepDive}
          </div>

          {/* Key Takeaways bullets */}
          {keyTakeaways && keyTakeaways.length > 0 && (
            <div className="mt-6 space-y-2 rounded-xl bg-black/50 p-4 border border-white/5">
              <div className="text-xs font-mono font-semibold text-zinc-400 mb-1">Critical Properties:</div>
              {keyTakeaways.map((takeaway, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 leading-normal">
                  <span className="text-[#D1FF00] mt-1 font-mono font-bold">•</span>
                  <span>{takeaway}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ASCII / Architectural Diagram */}
        {diagram && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-950 p-6">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-mono font-semibold text-zinc-200">
                {diagram.title}
              </h4>
              <span className="text-[11px] font-mono text-zinc-500 uppercase">{diagram.type}</span>
            </div>

            {diagram.description && (
              <p className="text-xs text-zinc-400 mb-3">{diagram.description}</p>
            )}

            {diagram.asciiArt && (
              <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/90 p-4 font-mono text-xs text-[#D1FF00] leading-relaxed">
                {diagram.asciiArt.trim()}
              </pre>
            )}

            {diagram.caption && (
              <div className="mt-2 text-right text-[11px] font-mono text-zinc-500 italic">
                {diagram.caption}
              </div>
            )}
          </div>
        )}

        {/* Code Snippet with Copy */}
        {codeSnippet && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-950 overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 bg-zinc-900/90 px-4 py-2.5">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                <Code className="h-3.5 w-3.5 text-[#D1FF00]" />
                <span className="uppercase">{codeSnippet.language}</span>
              </div>

              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-black/60 px-2.5 py-1 text-xs font-mono text-zinc-300 hover:text-white hover:border-white/20 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <pre className="overflow-x-auto p-5 font-mono text-xs sm:text-sm text-zinc-200 leading-relaxed bg-black/80">
              <code>{codeSnippet.code}</code>
            </pre>

            {codeSnippet.explanation && (
              <div className="border-t border-white/10 bg-zinc-900/40 p-3 text-xs text-zinc-400">
                <span className="font-semibold text-zinc-300 font-mono">Code Context: </span>
                {codeSnippet.explanation}
              </div>
            )}
          </div>
        )}

        {/* Callout Quote or Warning */}
        {callout && (
          <div className="mt-6 rounded-xl border border-white/10 bg-gradient-to-r from-zinc-900/60 to-zinc-950 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D1FF00]/10 text-[#D1FF00]">
                {callout.type === 'warning' ? (
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                ) : (
                  <Quote className="h-4 w-4" />
                )}
              </div>
              <div>
                <p className="text-xs sm:text-sm italic text-zinc-200 leading-relaxed">
                  “{callout.text}”
                </p>
                {callout.author && (
                  <div className="mt-1 text-[11px] font-mono text-[#D1FF00]">
                    — {callout.author}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
