'use client';

import React from 'react';
import { BadgeCheck, BookOpen, CircleHelp, FileText } from 'lucide-react';
import type { EvidenceConfidence } from '../types';

/**
 * Representação visual do nível de confiança de uma evidência.
 * O mesmo vocabulário é usado em todo o motor — UI, dados e relatório.
 */
const CONFIDENCE_STYLE: Record<
  EvidenceConfidence,
  { classes: string; Icon: React.ComponentType<{ className?: string }>; description: string }
> = {
  VERIFIED: {
    classes: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    Icon: BadgeCheck,
    description: 'Read directly from code, config, schema, tests or a running deployment.',
  },
  DOCUMENTED: {
    classes: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    Icon: BookOpen,
    description: 'Solid documentation exists; the implementation was not audited in this pass.',
  },
  REPORTED: {
    classes: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    Icon: FileText,
    description: 'Self-reported working practice, recorded but not independently measured.',
  },
  UNVERIFIED: {
    classes: 'bg-white/10 text-[var(--ls-text)] border-white/20',
    Icon: CircleHelp,
    description: 'Not enough evidence. Never published as a professional claim.',
  },
};

export function ConfidenceBadge({
  level,
  size = 'sm',
}: {
  level: EvidenceConfidence;
  size?: 'sm' | 'xs';
}) {
  const { classes, Icon } = CONFIDENCE_STYLE[level];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-mono font-bold uppercase tracking-widest ${classes} ${
        size === 'xs' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]'
      }`}
    >
      <Icon className={size === 'xs' ? 'h-2.5 w-2.5' : 'h-3 w-3'} />
      {level}
    </span>
  );
}

/**
 * Contrato de evidência: explica o vocabulário antes de o leitor o encontrar.
 * É a secção que distingue o LiveSkills de um portfólio.
 */
export function EvidenceContract({
  counts,
  auditDate,
}: {
  counts: Record<EvidenceConfidence, number>;
  auditDate: string;
}) {
  const levels: EvidenceConfidence[] = ['VERIFIED', 'DOCUMENTED', 'REPORTED'];

  return (
    <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-5 sm:p-7">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--ls-text)]">
          Evidence contract
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--ls-dim)]">
          Repositories audited {auditDate}
        </p>
      </div>

      <p className="mb-6 max-w-3xl text-sm leading-relaxed text-[var(--ls-text)]">
        Every claim on this page carries a confidence level. Nothing is stated as fact because it
        sounds good in an application — it is stated because there is an artefact behind it, and the
        strength of that artefact is labelled.
      </p>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {levels.map((level) => (
          <div
            key={level}
            className="rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <dt className="mb-2 flex items-center gap-2">
              <ConfidenceBadge level={level} />
              <span className="font-mono text-lg font-black tabular-nums text-white">
                {counts[level]}
              </span>
            </dt>
            <dd className="text-xs leading-relaxed text-[var(--ls-dim)]">
              {CONFIDENCE_STYLE[level].description}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
