'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, MapPin, Radio } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import type { LiveSkillPresentation } from '../types';
import { PRESENTATION_TYPE_LABEL } from '../lib/metrics';

/**
 * Primeira dobra. Objetivo: em segundos, o leitor perceber que esta página
 * foi construída para ele — e que é ela própria um artefacto de engenharia.
 */
export function PresentationHero({
  presentation,
  stats,
}: {
  presentation: LiveSkillPresentation;
  stats: { label: string; value: string }[];
}) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const { hero, target } = presentation;

  const fade = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 18 },
    animate: reduceMotion ? undefined : { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <header className="relative -mx-4 px-4 pt-4 pb-14 sm:-mx-6 sm:px-6 sm:pt-8 sm:pb-20 bg-[radial-gradient(120%_90%_at_15%_25%,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.62)_45%,transparent_78%)]">
      {/* Meta strip — LiveSkills #001 / YER AI Engineer / Personalized application */}
      <motion.div
        {...fade(0)}
        className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ls-dim)]"
      >
        <Link
          href="/labs/liveskills"
          className="rounded px-2 py-1 font-black text-black transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          style={{ backgroundColor: theme.colors.primary }}
        >
          LiveSkills {presentation.index}
        </Link>
        <span aria-hidden="true" className="text-white/25">
          /
        </span>
        <span className="text-[var(--ls-text)]">
          {target.organization} · {target.role}
        </span>
        <span aria-hidden="true" className="text-white/25">
          /
        </span>
        <span>{PRESENTATION_TYPE_LABEL[presentation.type] ?? presentation.type}</span>
        <span
          className="inline-flex items-center gap-1.5 rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-300"
          title={`Status: ${presentation.status}`}
        >
          <Radio className="h-2.5 w-2.5" aria-hidden="true" />
          {presentation.status}
        </span>
      </motion.div>

      {/* Headline */}
      <motion.p
        {...fade(0.06)}
        className="mb-3 text-lg font-bold tracking-tight sm:text-2xl"
        style={{ color: theme.colors.primary }}
      >
        {hero.salutation}
      </motion.p>

      <motion.h1
        {...fade(0.12)}
        className="max-w-4xl text-3xl font-black leading-[1.05] tracking-tight text-white text-balance sm:text-5xl lg:text-6xl"
      >
        {hero.headline}
        <span className="mt-2 block text-white/60">{hero.subheadline}</span>
      </motion.h1>

      <motion.p
        {...fade(0.18)}
        className="mt-7 max-w-2xl text-base leading-relaxed text-white/85"
      >
        {hero.body}
      </motion.p>

      {/* CTAs */}
      <motion.div {...fade(0.24)} className="mt-9 flex flex-wrap items-center gap-3">
        <a
          href={hero.primaryCta.href}
          className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-black transition-transform hover:scale-[1.03] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          style={{ backgroundColor: theme.colors.primary }}
        >
          {hero.primaryCta.label}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </a>
        {hero.secondaryCta ? (
          <a
            href={hero.secondaryCta.href}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-colors hover:border-white/30 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {hero.secondaryCta.label}
          </a>
        ) : null}
      </motion.div>

      {/* Location + brief provenance */}
      <motion.p
        {...fade(0.3)}
        className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-[var(--ls-text)]"
      >
        <MapPin className="h-3 w-3" aria-hidden="true" />
        {target.location ? <span>{target.location}</span> : null}
        <span aria-hidden="true">·</span>
        <span>Brief source: {target.briefSource}</span>
        {target.briefNeedsConfirmation ? (
          <>
            <span aria-hidden="true">·</span>
            <span className="text-amber-300">requirements pending confirmation</span>
          </>
        ) : null}
      </motion.p>

      {/* Derived stats — todos os números vêm dos dados */}
      <motion.dl
        {...fade(0.36)}
        className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl sm:grid-cols-4"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="bg-black/60 px-4 py-5">
            <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ls-text)]">
              {stat.label}
            </dt>
            <dd className="mt-1.5 text-2xl font-black tabular-nums text-white sm:text-3xl">
              {stat.value}
            </dd>
          </div>
        ))}
      </motion.dl>
    </header>
  );
}
