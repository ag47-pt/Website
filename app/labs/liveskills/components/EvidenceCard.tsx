'use client';

import React from 'react';
import {
  Braces,
  Code2,
  Container,
  Cpu,
  ExternalLink,
  FileCheck,
  FileText,
  GitBranch,
  Globe,
  Layers,
  Route,
  Settings2,
  TestTube,
} from 'lucide-react';
import Link from 'next/link';
import type { Evidence, EvidenceSource, EvidenceSourceKind } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';

const SOURCE_ICON: Record<EvidenceSourceKind, React.ComponentType<{ className?: string }>> = {
  code: Code2,
  config: Settings2,
  schema: Braces,
  test: TestTube,
  route: Route,
  component: Layers,
  api: Cpu,
  deploy: Container,
  ci: GitBranch,
  repository: GitBranch,
  doc: FileText,
  product: Globe,
  runtime: FileCheck,
};

function SourceRow({ source }: { source: EvidenceSource }) {
  const Icon = SOURCE_ICON[source.kind] ?? Code2;
  const isInternal = source.url?.startsWith('/');

  const label = (
    <span className="font-mono text-[11px] leading-relaxed text-[var(--ls-text)] break-words">
      {source.label}
    </span>
  );

  return (
    <li className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/40" aria-hidden="true" />
      <span className="min-w-0">
        {source.url ? (
          isInternal ? (
            <Link
              href={source.url}
              className="rounded-sm underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {label}
            </Link>
          ) : (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-sm underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {label}
              <ExternalLink className="h-2.5 w-2.5 shrink-0 text-white/40" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )
        ) : (
          label
        )}
        {source.detail ? (
          <span className="mt-0.5 block text-[11px] leading-relaxed text-[var(--ls-dim)]">
            {source.detail}
          </span>
        ) : null}
      </span>
    </li>
  );
}

/**
 * Componente reutilizável do motor: representa uma unidade de evidência.
 * Usado por capacidades, casos de projeto e matriz de requisitos.
 */
export function EvidenceCard({ evidence, compact = false }: { evidence: Evidence; compact?: boolean }) {
  return (
    <article
      className={`rounded-xl border border-white/10 bg-white/5 ${compact ? 'p-4' : 'p-5'}`}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <ConfidenceBadge level={evidence.confidence} size={compact ? 'xs' : 'sm'} />
        {evidence.observedOn ? (
          <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--ls-dim)]">
            observed {evidence.observedOn}
          </span>
        ) : null}
      </div>

      <p className={`leading-relaxed text-[var(--ls-text)] ${compact ? 'text-xs' : 'text-sm'}`}>
        {evidence.claim}
      </p>

      <ul className="mt-4 space-y-2 border-t border-white/5 pt-3">
        {evidence.sources.map((source) => (
          <SourceRow key={`${evidence.id}-${source.label}`} source={source} />
        ))}
      </ul>

      {evidence.caveat ? (
        <p className="mt-3 border-t border-white/5 pt-3 text-[11px] leading-relaxed text-amber-300/90">
          <span className="font-mono uppercase tracking-widest text-amber-400/90">Caveat — </span>
          {evidence.caveat}
        </p>
      ) : null}
    </article>
  );
}
