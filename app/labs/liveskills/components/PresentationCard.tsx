'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, MapPin } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import type { PresentationSummary } from '../types';
import { PRESENTATION_TYPE_LABEL } from '../lib/metrics';
import { Reveal } from './SectionShell';

const STATUS_STYLE: Record<string, string> = {
  active: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  draft: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  archived: 'border-white/20 bg-white/10 text-[var(--ls-text)]',
};

/**
 * Card do índice do lab. Todos os números são derivados dos dados reais
 * da apresentação (`lib/metrics.ts`) — nenhum é escrito à mão.
 */
export function PresentationCard({ summary, order }: { summary: PresentationSummary; order: number }) {
  const { theme } = useTheme();
  const href = `/labs/liveskills/${summary.slug}`;

  const stats = [
    { label: 'Evidence', value: String(summary.evidenceCount) },
    { label: 'Verified', value: String(summary.verifiedCount) },
    { label: 'Projects', value: String(summary.projectCount) },
    { label: 'Requirements', value: String(summary.requirementCount) },
  ];

  return (
    <Reveal delay={Math.min(order * 0.05, 0.2)}>
      <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl transition-colors hover:border-white/25">
        <div className="p-6 sm:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]">
            <span
              className="rounded px-2 py-0.5 font-black text-black"
              style={{ backgroundColor: theme.colors.primary }}
            >
              {summary.index}
            </span>
            <span className="text-[var(--ls-dim)]">
              {PRESENTATION_TYPE_LABEL[summary.type] ?? summary.type}
            </span>
            <span
              className={`rounded border px-2 py-0.5 ${STATUS_STYLE[summary.status] ?? STATUS_STYLE.archived}`}
            >
              {summary.status}
            </span>
            <span className="text-[var(--ls-dim)]">updated {summary.updatedAt}</span>
          </div>

          <h3 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-white sm:text-3xl">
            <Building2 className="h-5 w-5 text-white/40" aria-hidden="true" />
            {summary.organization}
          </h3>

          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--ls-text)]">
            {summary.role ? <span className="font-bold text-[var(--ls-text)]">{summary.role}</span> : null}
            {summary.location ? (
              <>
                <span aria-hidden="true" className="text-white/25">
                  ·
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  {summary.location}
                </span>
              </>
            ) : null}
          </p>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--ls-dim)]">{summary.objective}</p>

          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/5 px-3 py-3">
                <dt className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--ls-text)]">
                  {stat.label}
                </dt>
                <dd className="mt-0.5 text-xl font-black tabular-nums text-white">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <Link
            href={href}
            className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-black transition-transform hover:scale-[1.03] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            style={{ backgroundColor: theme.colors.primary }}
          >
            Open presentation
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
            <span className="sr-only">
              for {summary.organization}
              {summary.role ? ` — ${summary.role}` : ''}
            </span>
          </Link>
        </div>
      </article>
    </Reveal>
  );
}
