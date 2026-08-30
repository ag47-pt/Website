'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Boxes } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import type { LiveSkillPresentation } from '../types';
import { Reveal } from './SectionShell';

/**
 * "This application is also a small product."
 * Explica o motor LiveSkills e assume a página como evidência de engenharia.
 */
export function MetaSection({ presentation }: { presentation: LiveSkillPresentation }) {
  const { theme } = useTheme();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
      {/* Engine diagram */}
      <Reveal>
        <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-6 sm:p-8">
          <h3 className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ls-dim)]">
            <Boxes className="h-3 w-3" aria-hidden="true" />
            How this page is generated
          </h3>

          <ol className="space-y-2 font-mono text-[11px] sm:text-xs">
            {[
              { label: 'Evidence catalog', detail: 'data/candidate.ts — shared across presentations' },
              { label: 'Presentation config', detail: `data/${presentation.slug}.ts — this opportunity only` },
              { label: 'Registry', detail: 'lib/registry.ts — slug → presentation' },
              { label: 'Engine', detail: 'components/ — typed, reusable sections' },
              { label: 'Route', detail: `/labs/liveskills/[slug] → /labs/liveskills/${presentation.slug}` },
            ].map((row, index, rows) => (
              <li key={row.label}>
                <div className="flex items-baseline gap-3 rounded-lg border border-white/5 bg-black/60 px-3.5 py-2.5">
                  <span className="tabular-nums text-[var(--ls-dim)]">{index + 1}</span>
                  <span className="min-w-0">
                    <span className="block font-bold text-white">{row.label}</span>
                    <span className="block break-words text-[var(--ls-dim)]">{row.detail}</span>
                  </span>
                </div>
                {index < rows.length - 1 ? (
                  <div className="py-0.5 pl-[26px] text-white/25" aria-hidden="true">
                    ↓
                  </div>
                ) : null}
              </li>
            ))}
          </ol>

          <p className="mt-5 border-t border-white/5 pt-4 text-sm leading-relaxed text-[var(--ls-text)]">
            A presentation for another company is a new data file and one registry entry. The
            engine, the components and the evidence catalog stay untouched — which is the actual
            test of whether the abstraction was worth building.
          </p>
        </div>
      </Reveal>

      {/* Proof list */}
      <Reveal delay={0.06}>
        <ul className="space-y-2.5">
          {presentation.metaProof.map((item) => (
            <li
              key={item.label}
              className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-5"
            >
              <h3 className="text-sm font-bold tracking-tight text-white">{item.label}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--ls-text)]">{item.detail}</p>
            </li>
          ))}
        </ul>

        <Link
          href="/labs/liveskills"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          style={{ color: theme.colors.primary, borderColor: `${theme.colors.primary}40` }}
        >
          See the LiveSkills lab
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </Reveal>
    </div>
  );
}
