'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Boxes, FileSearch, GitBranch, ShieldCheck } from 'lucide-react';
import { LabHero } from '@/app/labs/components';
import { useTheme } from '@/context/ThemeContext';
import type { PresentationSummary } from './types';
import { PresentationCard, Reveal } from './components';
import { ConfidenceBadge } from './components/ConfidenceBadge';

const PIPELINE = [
  { label: 'Capability', detail: 'What the person can actually do' },
  { label: 'Project', detail: 'Where it was done' },
  { label: 'Implementation', detail: 'The files, routes and schemas involved' },
  { label: 'Evidence', detail: 'The artefact that proves it' },
  { label: 'Confidence', detail: 'How strong that proof is' },
];

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: 'No claim without evidence',
    body: 'A capability that cannot point to code, config, a schema, a test or a running deployment does not get published as a professional claim.',
  },
  {
    icon: FileSearch,
    title: 'Documentation is not implementation',
    body: 'If the docs describe it but the code does not confirm it, the claim is labelled DOCUMENTED. If only memory supports it, REPORTED. The distinction is kept visible.',
  },
  {
    icon: Boxes,
    title: 'One engine, many presentations',
    body: 'The evidence catalog is shared. Each opportunity is a configuration file that selects from it, adds its own narrative and maps requirements to proof.',
  },
  {
    icon: GitBranch,
    title: 'Built inside AG47, not beside it',
    body: 'LiveSkills is a Labs mini-app on the existing Next.js codebase, layout and design system. No parallel application, no new infrastructure.',
  },
];

/**
 * LiveSkills Lab — índice do mini app.
 * Explica o conceito e lista as apresentações existentes com números
 * derivados dos dados reais (nunca escritos à mão).
 */
export function LiveSkillsLabClient({ summaries }: { summaries: PresentationSummary[] }) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();

  const totals = summaries.reduce(
    (accumulator, summary) => ({
      evidence: accumulator.evidence + summary.evidenceCount,
      verified: accumulator.verified + summary.verifiedCount,
      projects: accumulator.projects + summary.projectCount,
    }),
    { evidence: 0, verified: 0, projects: 0 },
  );

  const fade = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 16 },
    animate: reduceMotion ? undefined : { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <div
      className="space-y-8 pb-10 sm:space-y-10"
      style={
        {
          '--ls-text': theme.colors.textSecondary,
          '--ls-dim': 'rgba(255,255,255,0.72)',
          '--ls-accent': theme.colors.primary,
        } as React.CSSProperties
      }
    >
      {/* Hero — LabHero é o componente do próprio portal: garante breadcrumb,
          tipografia, status tags e ritmo idênticos às restantes rotas /labs. */}
      <LabHero
        overline="EVIDENCE_DRIVEN_PRESENTATION_ENGINE"
        overlineIcon={BadgeCheck}
        title="Prova antes da"
        highlight="Promessa"
        description="Motor que transforma **capacidades**, **projetos** e **evidências reais** numa apresentação personalizada por oportunidade. Cada afirmação carrega o *artefacto* que a sustenta e o seu nível de confiança."
        statusTags={[
          { label: `${summaries.length} Apresentacao_Ativa`, color: 'main', pulse: true },
          { label: `${totals.verified} Evidencias_Verificadas`, color: 'lime' },
          { label: 'MVP_v0.1', color: 'orange', pulse: true },
        ]}
      />

      {/* Evidence pipeline + números agregados */}
      <section aria-labelledby="engine-heading" className="space-y-6">
        <h2 id="engine-heading" className="sr-only">
          How the engine works
        </h2>

        <motion.ol
          {...fade(0)}
          className="flex flex-wrap items-stretch gap-2"
          aria-label="Evidence pipeline"
        >
          {PIPELINE.map((step, index) => (
            <li key={step.label} className="flex items-stretch gap-2">
              <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5">
                <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-white">
                  {step.label}
                </span>
                <span className="mt-0.5 block text-[11px] leading-tight text-[var(--ls-dim)]">
                  {step.detail}
                </span>
              </div>
              {index < PIPELINE.length - 1 ? (
                <span className="self-center font-mono text-white/25" aria-hidden="true">
                  →
                </span>
              ) : null}
            </li>
          ))}
        </motion.ol>

        <motion.dl
          {...fade(0.06)}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4"
        >
          {[
            { label: 'Presentations', value: String(summaries.length) },
            { label: 'Evidence items', value: String(totals.evidence) },
            { label: 'Verified', value: String(totals.verified) },
            { label: 'Systems referenced', value: String(totals.projects) },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 px-4 py-5">
              <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ls-text)]">
                {stat.label}
              </dt>
              <dd className="mt-1.5 text-2xl font-black tabular-nums text-white sm:text-3xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </section>

      {/* Presentations */}
      <section
        id="presentations"
        aria-labelledby="presentations-heading"
        className="scroll-mt-28"
      >
        <Reveal>
          <div className="mb-8 max-w-3xl">
            <p
              className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] [text-shadow:0_2px_14px_rgba(0,0,0,0.9)]"
              style={{ color: theme.colors.primary }}
            >
              Presentations
            </p>
            <h2 id="presentations-heading" className="text-2xl font-black tracking-tight text-white sm:text-4xl [text-shadow:0_2px_14px_rgba(0,0,0,0.9)]">
              {summaries.length === 1 ? 'One live presentation' : `${summaries.length} live presentations`}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-white/85 [text-shadow:0_2px_14px_rgba(0,0,0,0.9)]">
              Counts below are derived from the presentation data at build time, not written by hand.
            </p>
          </div>
        </Reveal>

        {summaries.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center font-mono text-[11px] uppercase tracking-widest text-white/40">
            No public presentations yet
          </p>
        ) : (
          <div className="space-y-4">
            {summaries.map((summary, index) => (
              <PresentationCard key={summary.slug} summary={summary} order={index} />
            ))}
          </div>
        )}
      </section>

      {/* Principles */}
      <section
        id="principles"
        aria-labelledby="principles-heading"
        className="scroll-mt-28"
      >
        <Reveal>
          <div className="mb-8 max-w-3xl">
            <p
              className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] [text-shadow:0_2px_14px_rgba(0,0,0,0.9)]"
              style={{ color: theme.colors.primary }}
            >
              How it works
            </p>
            <h2 id="principles-heading" className="text-2xl font-black tracking-tight text-white sm:text-4xl [text-shadow:0_2px_14px_rgba(0,0,0,0.9)]">
              Four rules the engine enforces
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-3 sm:grid-cols-2">
          {PRINCIPLES.map((principle, index) => (
            <Reveal key={principle.title} delay={Math.min(index * 0.04, 0.16)}>
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-5">
                <principle.icon className="mb-3 h-4 w-4 text-white/40" aria-hidden="true" />
                <h3 className="text-sm font-bold tracking-tight text-white">{principle.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ls-text)]">{principle.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-5">
            <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ls-dim)]">
              Confidence vocabulary
            </h3>
            <ul className="flex flex-wrap gap-2">
              {(['VERIFIED', 'DOCUMENTED', 'REPORTED', 'UNVERIFIED'] as const).map((level) => (
                <li key={level}>
                  <ConfidenceBadge level={level} />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13px] leading-relaxed text-[var(--ls-dim)]">
              The same four levels are used in the data model, in the UI and in the delivery report.
              Anything that would land on <span className="font-mono text-[var(--ls-text)]">UNVERIFIED</span>{' '}
              is either labelled or left off the page entirely.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Roadmap — honesto sobre o que ainda não existe */}
      <section
        id="status"
        aria-labelledby="status-heading"
        className="scroll-mt-28"
      >
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
            <div>
              <p
                className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] [text-shadow:0_2px_14px_rgba(0,0,0,0.9)]"
                style={{ color: theme.colors.primary }}
              >
                Status
              </p>
              <h2 id="status-heading" className="text-2xl font-black tracking-tight text-white sm:text-4xl [text-shadow:0_2px_14px_rgba(0,0,0,0.9)]">
                MVP — deliberately small
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/85 [text-shadow:0_2px_14px_rgba(0,0,0,0.9)]">
                This version proves one thing: that a presentation can be data, that the evidence
                can be traversable, and that a second one costs a file instead of a rebuild. Nothing
                else was built yet.
              </p>
              <a
                href="/labs"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-colors hover:border-white/30 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Back to Labs
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
                <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400/80">
                  In this version
                </h3>
                <ul className="space-y-1.5 text-[13px] leading-relaxed text-[var(--ls-text)]">
                  <li>Typed presentation model</li>
                  <li>Shared evidence catalog</li>
                  <li>Reusable engine components</li>
                  <li>Requirement → evidence matching</li>
                  <li>Dynamic route + per-page metadata</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ls-dim)]">
                  Not built yet
                </h3>
                <ul className="space-y-1.5 text-[13px] leading-relaxed text-[var(--ls-dim)]">
                  <li>Authoring UI or CMS</li>
                  <li>Own database or accounts</li>
                  <li>Job-posting parser</li>
                  <li>Automatic presentation generation</li>
                  <li>Access control beyond the visibility field</li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
