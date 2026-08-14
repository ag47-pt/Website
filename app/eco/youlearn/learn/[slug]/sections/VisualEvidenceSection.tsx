'use client';

import React, { useState } from 'react';
import { VisualSectionContent, BaseSection, Source } from '@/eco/youlearn/schema/types';
import { buildTimestampedSourceUrl } from '@/eco/youlearn/lib/provenance';
import { Image as ImageIcon, Play, ExternalLink, Tag, Maximize2, X, ZoomIn } from 'lucide-react';

interface VisualEvidenceSectionProps {
  section: BaseSection<VisualSectionContent>;
  source?: Source;
}

export function VisualEvidenceSection({ section, source }: VisualEvidenceSectionProps) {
  const { overviewText, items } = section.content;
  const [activeModalImage, setActiveModalImage] = useState<any | null>(null);

  return (
    <section id={section.id} className="py-12 border-b border-white/10 relative">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 text-xs font-mono text-[#D1FF00] border border-white/10">
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Visual Evidence & Architectural Frames</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="mt-1 text-sm text-zinc-400">{section.subtitle}</p>
          )}
          {overviewText && (
            <p className="mt-3 text-sm text-zinc-300 leading-relaxed max-w-3xl">
              {overviewText}
            </p>
          )}
        </div>

        {/* Visual Cards Grid (2 cols on md+) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => {
            const itemUrl =
              item.provenance && source
                ? buildTimestampedSourceUrl(
                    item.provenance.sourceUrl || source.url,
                    item.provenance.timestampSeconds || item.provenance.timestampDisplay
                  )
                : null;

            return (
              <div
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-black/50"
              >
                {/* Visual Image Header / Frame */}
                <div className="relative aspect-video w-full overflow-hidden bg-black cursor-pointer" onClick={() => setActiveModalImage(item)}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

                  {/* Zoom Indicator Icon on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-xs pointer-events-none">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/70 border border-white/20 text-[#D1FF00]">
                      <ZoomIn className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Badges on image */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="rounded-md border border-white/20 bg-black/70 px-2 py-0.5 text-[10px] font-mono uppercase font-bold text-white backdrop-blur-md">
                      {item.visualType}
                    </span>
                  </div>

                  {itemUrl && (
                    <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={itemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/80 px-2 py-1 text-[11px] font-mono text-white hover:text-[#D1FF00] backdrop-blur-md transition-all"
                      >
                        <Play className="h-2.5 w-2.5 text-red-400 fill-current" />
                        <span>{item.provenance?.timestampDisplay}</span>
                        <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                      </a>
                    </div>
                  )}

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-[11px] text-zinc-300 backdrop-blur-md bg-black/70 p-2 rounded-lg border border-white/10 line-clamp-2">
                    {item.caption}
                  </div>
                </div>

                {/* Analysis Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">{item.analysis}</p>
                  </div>

                  {/* Annotations */}
                  {item.annotations && item.annotations.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2">
                      {item.annotations.map((ann, aIdx) => (
                        <div
                          key={aIdx}
                          className="rounded-lg border border-white/5 bg-zinc-900/60 p-2 text-xs"
                        >
                          <div className="flex items-center gap-1 font-mono font-bold text-[#D1FF00] text-[11px] mb-0.5">
                            <Tag className="h-2.5 w-2.5" />
                            <span>{ann.label}</span>
                          </div>
                          <div className="text-zinc-400 text-[11px] leading-normal">{ann.description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeModalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModalImage(null)}
        >
          <div
            className="relative max-w-4xl w-full overflow-hidden rounded-2xl border border-white/20 bg-zinc-950 p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModalImage(null)}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90 border border-white/20"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
              <img
                src={activeModalImage.imageUrl}
                alt={activeModalImage.title}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-[#D1FF00]/10 border border-[#D1FF00]/30 px-2 py-0.5 text-xs font-mono font-bold text-[#D1FF00]">
                  {activeModalImage.visualType}
                </span>
                <h3 className="text-lg font-bold text-white">{activeModalImage.title}</h3>
              </div>
              <p className="mt-2 text-sm text-zinc-300">{activeModalImage.analysis}</p>
              <p className="mt-1 text-xs text-zinc-400 italic">{activeModalImage.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
