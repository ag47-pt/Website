'use client';

import React, { useState } from 'react';
import { ProvenanceSectionContent, BaseSection, Source } from '@/eco/youlearn/schema/types';
import { buildTimestampedSourceUrl } from '@/eco/youlearn/lib/provenance';
import { ShieldCheck, Play, ExternalLink, Copy, Check, BookOpen, GitFork, FileCode, Award } from 'lucide-react';

interface SourceProvenanceSectionProps {
  section: BaseSection<ProvenanceSectionContent>;
  source: Source;
}

export function SourceProvenanceSection({ section, source }: SourceProvenanceSectionProps) {
  const { sourceTitle, sourceUrl, author, license, citationText, keyTimestamps, references } =
    section.content;
  const [copiedCitation, setCopiedCitation] = useState(false);

  const handleCopyCitation = () => {
    if (citationText) {
      navigator.clipboard.writeText(citationText);
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2000);
    }
  };

  return (
    <section id={section.id} className="py-12 border-b border-white/10 bg-zinc-950/60">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 text-xs font-mono text-[#D1FF00] border border-white/10">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Provenance & Source Integrity</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="mt-1 text-sm text-zinc-400">{section.subtitle}</p>
          )}
        </div>

        {/* Creator Attribution Card */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {author.avatarUrl ? (
                <img
                  src={author.avatarUrl}
                  alt={author.name}
                  className="h-12 w-12 rounded-full border border-white/20 object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 border border-white/10 text-lg font-bold text-white font-mono">
                  {author.name[0]}
                </div>
              )}
              <div>
                <h3 className="text-base font-bold text-white">{author.name}</h3>
                {author.roleOrBio && (
                  <p className="text-xs text-zinc-400 mt-0.5">{author.roleOrBio}</p>
                )}
                {author.channelOrOrg && (
                  <span className="text-xs font-mono text-[#D1FF00]">{author.channelOrOrg}</span>
                )}
              </div>
            </div>

            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all self-start sm:self-auto"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Open Original Material</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-60" />
            </a>
          </div>

          {license && (
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <Award className="h-3.5 w-3.5 text-zinc-500" />
              <span>License / Distribution: {license}</span>
            </div>
          )}
        </div>

        {/* Citation Copy Box */}
        {citationText && (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase text-zinc-400">
                Academic & Reference Citation
              </span>
              <button
                onClick={handleCopyCitation}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#D1FF00] hover:underline"
              >
                {copiedCitation ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Citation</span>
                  </>
                )}
              </button>
            </div>
            <p className="font-mono text-xs text-zinc-300 bg-black/60 p-3 rounded-lg border border-white/5">
              {citationText}
            </p>
          </div>
        )}

        {/* Key Timestamps Directory */}
        {keyTimestamps && keyTimestamps.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 mb-6">
            <h4 className="text-xs font-mono font-bold uppercase text-zinc-400 mb-3">
              Direct Source Index & Timestamps
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {keyTimestamps.map((ts, idx) => {
                const tsUrl = buildTimestampedSourceUrl(sourceUrl, ts.timestampSeconds);
                return (
                  <a
                    key={idx}
                    href={tsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-zinc-900/60 p-2.5 text-xs hover:border-[#D1FF00]/40 transition-all"
                  >
                    <span className="text-zinc-300">{ts.label}</span>
                    <span className="font-mono text-[#D1FF00] flex items-center gap-1">
                      <Play className="h-2.5 w-2.5 fill-current text-red-400" />
                      {ts.timestampDisplay}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Connected External References */}
        {references && references.length > 0 && (
          <div>
            <h4 className="text-xs font-mono font-bold uppercase text-zinc-400 mb-3">
              External Papers, GitHub Repositories & Docs
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {references.map((ref, idx) => (
                <a
                  key={idx}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-white/10 bg-zinc-900/40 p-3.5 hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#D1FF00] uppercase mb-1">
                      <span>{ref.type}</span>
                      <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                    </div>
                    <div className="text-xs font-bold text-white group-hover:text-[#D1FF00] transition-colors">
                      {ref.label}
                    </div>
                    {ref.description && (
                      <p className="text-[11px] text-zinc-400 mt-1 leading-normal">
                        {ref.description}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
