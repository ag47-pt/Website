'use client';

import React from 'react';
import { Terminal } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import type { LiveSkillPresentation } from '../types';
import { resolveEvidence } from '../lib/metrics';
import { ConfidenceBadge } from './ConfidenceBadge';
import { Reveal } from './SectionShell';

/**
 * AI-native engineering. O uso de IA não é escondido nem inflacionado:
 * cada ferramenta é descrita pelo papel que desempenha na engenharia.
 */
export function AiNativeSection({
  presentation,
  principle,
}: {
  presentation: LiveSkillPresentation;
  principle: string;
}) {
  const { theme } = useTheme();

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {presentation.aiNativeTools.map((tool, index) => {
          const evidence = resolveEvidence(presentation, tool.evidenceIds);

          return (
            <Reveal key={tool.name} delay={Math.min(index * 0.04, 0.16)}>
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-5">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2 text-sm font-bold tracking-tight text-white">
                    <Terminal className="h-3.5 w-3.5 text-white/40" aria-hidden="true" />
                    {tool.name}
                  </h3>
                  {evidence[0] ? <ConfidenceBadge level={evidence[0].confidence} size="xs" /> : null}
                </div>
                <p className="text-sm leading-relaxed text-[var(--ls-text)]">{tool.usage}</p>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.08}>
        <div
          className="mt-6 rounded-2xl border border-white/10 border-l-2 bg-white/5 backdrop-blur-xl p-6 sm:p-8"
          style={{ borderLeftColor: theme.colors.primary }}
        >
          <p className="text-base font-bold leading-snug tracking-tight text-white text-balance sm:text-xl">
            “{principle}”
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--ls-dim)]">
            The label that fits is software engineer using AI-native development workflows — not an
            AI tools user. The judgement about what to build, what to reject and what to keep stays
            human; the throughput is where the models help.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
