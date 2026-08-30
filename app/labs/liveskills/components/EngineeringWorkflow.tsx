'use client';

import React from 'react';
import { Bot, Hand } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import type { WorkflowStep } from '../types';
import { Reveal } from './SectionShell';

/**
 * "How I engineer" — o loop real de desenvolvimento.
 * O sinal principal é o contraste: que etapas são assistidas por agentes
 * e quais são deliberadamente humanas.
 */
export function EngineeringWorkflow({
  steps,
  principle,
}: {
  steps: WorkflowStep[];
  principle: string;
}) {
  const { theme } = useTheme();

  return (
    <div>
      <ol className="relative space-y-px">
        {steps.map((step, index) => (
          <Reveal key={step.id} delay={Math.min(index * 0.03, 0.24)}>
            <li className="group relative flex gap-4 rounded-xl border border-transparent bg-white/[0.03] p-4 transition-colors hover:border-white/10 sm:gap-6">
              {/* Rail + index */}
              <div className="flex shrink-0 flex-col items-center">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-black font-mono text-[10px] font-black tabular-nums text-[var(--ls-text)]"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                {index < steps.length - 1 ? (
                  <span className="mt-1 w-px grow bg-white/10" aria-hidden="true" />
                ) : null}
              </div>

              <div className="min-w-0 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold tracking-tight text-white">{step.label}</h3>
                  {step.aiAssisted ? (
                    <span
                      className="inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest"
                      style={{
                        color: theme.colors.primary,
                        borderColor: `${theme.colors.primary}40`,
                        backgroundColor: `${theme.colors.primary}12`,
                      }}
                    >
                      <Bot className="h-2.5 w-2.5" aria-hidden="true" />
                      agent-assisted
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-[var(--ls-dim)]">
                      <Hand className="h-2.5 w-2.5" aria-hidden="true" />
                      not delegated
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--ls-text)]">{step.detail}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={0.1}>
        <blockquote
          className="mt-10 rounded-2xl border border-white/10 border-l-2 bg-white/5 backdrop-blur-xl p-6 sm:p-8"
          style={{ borderLeftColor: theme.colors.primary }}
        >
          <p className="text-lg font-bold leading-snug tracking-tight text-white text-balance sm:text-2xl">
            “{principle}”
          </p>
        </blockquote>
      </Reveal>
    </div>
  );
}
