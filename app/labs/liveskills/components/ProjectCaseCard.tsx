'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, CircleDot, Layers, Lightbulb, Wrench } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import type { LiveSkillPresentation, ProjectCase, ProjectStatus } from '../types';
import { resolveEvidence } from '../lib/metrics';
import { ConfidenceBadge } from './ConfidenceBadge';
import { Disclosure } from './Disclosure';
import { EvidenceCard } from './EvidenceCard';
import { Reveal } from './SectionShell';

const STATUS_STYLE: Record<ProjectStatus, string> = {
  live: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  production: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  beta: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  experimental: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  internal: 'border-white/20 bg-white/10 text-[var(--ls-text)]',
};

function Block({
  icon: Icon,
  title,
  items,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h4 className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ls-dim)]">
        <Icon className="h-3 w-3" aria-hidden="true" />
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-[var(--ls-text)]">
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-white/25" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Componente reutilizável do motor: um caso de engenharia completo.
 * Problem → What I built → Architecture → Stack → Evidence → What it demonstrates.
 * Deliberadamente não é um card "imagem + título + stack".
 */
export function ProjectCaseCard({
  project,
  presentation,
  order,
}: {
  project: ProjectCase;
  presentation: LiveSkillPresentation;
  order: number;
}) {
  const { theme } = useTheme();
  const evidence = resolveEvidence(presentation, project.evidenceIds);

  return (
    <Reveal delay={Math.min(order * 0.05, 0.2)}>
      <article className="overflow-hidden rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl">
        {/* Head */}
        <div className="border-b border-white/10 p-6 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] font-black tabular-nums tracking-widest text-[var(--ls-dim)]">
              {String(order + 1).padStart(2, '0')}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest ${STATUS_STYLE[project.status]}`}
            >
              <CircleDot className="h-2.5 w-2.5" aria-hidden="true" />
              {project.status}
            </span>
            <ConfidenceBadge level={project.confidence} size="xs" />
          </div>

          <h3 className="text-xl font-black tracking-tight text-white sm:text-3xl">{project.name}</h3>
          <p className="mt-1.5 text-sm text-[var(--ls-dim)]">{project.kicker}</p>

          {project.metrics?.length ? (
            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-4">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="bg-white/5 px-3 py-3">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--ls-text)]">
                    {metric.label}
                  </dt>
                  <dd className="mt-1 text-base font-black tabular-nums text-white">
                    {metric.value}
                  </dd>
                  <dd className="mt-0.5 font-mono text-[9px] leading-tight text-[var(--ls-dim)]">
                    {metric.source}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        {/* Problem */}
        <div className="border-b border-white/10 p-6 sm:p-8">
          <h4 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ls-dim)]">
            Problem
          </h4>
          <p className="max-w-3xl text-sm leading-relaxed text-[var(--ls-text)] sm:text-base">
            {project.problem}
          </p>
        </div>

        {/* Built + Architecture */}
        <div className="grid gap-8 border-b border-white/10 p-6 sm:p-8 lg:grid-cols-2 lg:gap-12">
          <Block icon={Wrench} title="What I built" items={project.built} />
          <Block icon={Layers} title="Architecture" items={project.architecture} />
        </div>

        {/* Stack */}
        <div className="border-b border-white/10 p-6 sm:p-8">
          <h4 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ls-dim)]">
            Stack
          </h4>
          <ul className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-[var(--ls-text)]"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>

        {/* Demonstrates */}
        <div className="p-6 sm:p-8">
          <h4 className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ls-dim)]">
            <Lightbulb className="h-3 w-3" aria-hidden="true" />
            What it demonstrates
          </h4>
          <ul className="grid gap-2 sm:grid-cols-2">
            {project.demonstrates.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm leading-relaxed text-[var(--ls-text)]"
              >
                {item}
              </li>
            ))}
          </ul>

          {project.caveat ? (
            <p className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] px-4 py-3 text-[13px] leading-relaxed text-amber-300/90">
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400/90">
                Honest limit —{' '}
              </span>
              {project.caveat}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {evidence.length > 0 ? (
              <Disclosure label="Evidence behind this case" count={evidence.length}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {evidence.map((item) => (
                    <EvidenceCard key={item.id} evidence={item} />
                  ))}
                </div>
              </Disclosure>
            ) : null}

            {project.links?.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  style={{ color: theme.colors.primary, borderColor: `${theme.colors.primary}40` }}
                >
                  {link.label}
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  style={{ color: theme.colors.primary, borderColor: `${theme.colors.primary}40` }}
                >
                  {link.label}
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              ),
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}
