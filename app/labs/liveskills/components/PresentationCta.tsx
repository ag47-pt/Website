'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldQuestion } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import type { PresentationCta as PresentationCtaModel } from '../types';
import { Reveal } from './SectionShell';

/**
 * CTA final + transparência.
 * As `disclosures` são parte do produto: dizem o que a página não prova.
 */
export function PresentationCta({
  cta,
  pendingConfirmation,
}: {
  cta: PresentationCtaModel;
  pendingConfirmation: readonly string[];
}) {
  const { theme } = useTheme();

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-28 space-y-4"
    >
      <Reveal>
        <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-7 sm:p-12">
          <p
            className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em]"
            style={{ color: theme.colors.primary }}
          >
            {cta.eyebrow}
          </p>
          <h2
            id="contact-heading"
            className="max-w-2xl text-2xl font-black tracking-tight text-white text-balance sm:text-4xl"
          >
            {cta.title}
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--ls-text)] sm:text-base">
            {cta.body}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {cta.actions.map((action, index) =>
              action.external ? (
                <a
                  key={action.href}
                  href={action.href}
                  {...(action.href.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className={
                    index === 0
                      ? 'group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-black transition-transform hover:scale-[1.03] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
                      : 'inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-colors hover:border-white/30 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
                  }
                  style={index === 0 ? { backgroundColor: theme.colors.primary } : undefined}
                >
                  {action.label}
                  {index === 0 ? (
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  ) : null}
                </a>
              ) : (
                <Link
                  key={action.href}
                  href={action.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-colors hover:border-white/30 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {action.label}
                </Link>
              ),
            )}
          </div>
        </div>
      </Reveal>

      {/* Transparency */}
      <Reveal delay={0.06}>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {cta.disclosures?.length ? (
            <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-6">
              <h3 className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ls-dim)]">
                <ShieldQuestion className="h-3 w-3" aria-hidden="true" />
                What this page does not prove
              </h3>
              <ul className="space-y-3">
                {cta.disclosures.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[13px] leading-relaxed text-[var(--ls-text)]">
                    <span
                      className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-white/25"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {pendingConfirmation.length ? (
            <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-6">
              <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ls-dim)]">
                Pending confirmation
              </h3>
              <ul className="space-y-3">
                {pendingConfirmation.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[13px] leading-relaxed text-[var(--ls-text)]">
                    <span
                      className="mt-[3px] shrink-0 font-mono text-[10px] uppercase tracking-widest text-amber-400/90"
                      aria-hidden="true"
                    >
                      TODO
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-white/5 pt-3 text-[11px] leading-relaxed text-[var(--ls-dim)]">
                Listed rather than invented. Anything here is shared directly in a conversation.
              </p>
            </div>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
