'use client';

import React from 'react';
import { Blocks, Bot, Target, Workflow } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import type { CapabilityIconName, LiveSkillPresentation } from '../types';
import { resolveEvidence } from '../lib/metrics';
import { ConfidenceBadge } from './ConfidenceBadge';
import { Disclosure } from './Disclosure';
import { EvidenceCard } from './EvidenceCard';
import { Reveal } from './SectionShell';

const GROUP_ICON: Record<CapabilityIconName, React.ComponentType<{ className?: string }>> = {
  blocks: Blocks,
  workflow: Workflow,
  bot: Bot,
  target: Target,
};

/**
 * "What I build" — capacidades aplicadas, cada uma ancorada em evidência.
 * Nenhuma capability é renderizada sem pelo menos uma evidência resolvida.
 */
export function CapabilityGroups({ presentation }: { presentation: LiveSkillPresentation }) {
  const { theme } = useTheme();

  return (
    <div className="space-y-10">
      {presentation.capabilityGroups.map((group, groupIndex) => {
        const capabilities = presentation.capabilities.filter(
          (capability) => capability.group === group.id,
        );
        if (capabilities.length === 0) return null;

        const Icon = GROUP_ICON[group.iconName];

        return (
          <Reveal key={group.id} delay={groupIndex * 0.04}>
            <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:gap-10">
              {/* Group label */}
              <div className="lg:sticky lg:top-28 lg:self-start">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black"
                    aria-hidden="true"
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-base font-black tracking-tight text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.9)]">{group.label}</h3>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/70 [text-shadow:0_2px_14px_rgba(0,0,0,0.9)]">
                      {capabilities.length} {capabilities.length === 1 ? 'capability' : 'capabilities'}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/80 [text-shadow:0_2px_14px_rgba(0,0,0,0.9)]">{group.caption}</p>
              </div>

              {/* Capabilities */}
              <ul className="space-y-3">
                {capabilities.map((capability) => {
                  const evidence = resolveEvidence(presentation, capability.evidenceIds);
                  const strongest = evidence[0]?.confidence;

                  return (
                    <li
                      key={capability.id}
                      className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-5 transition-colors hover:border-white/20"
                    >
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-sm font-bold tracking-tight text-white">
                          {capability.label}
                        </h4>
                        {strongest ? <ConfidenceBadge level={strongest} size="xs" /> : null}
                      </div>

                      <p className="text-sm leading-relaxed text-[var(--ls-text)]">{capability.summary}</p>

                      {capability.projectIds?.length ? (
                        <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[var(--ls-text)]">
                          <span style={{ color: theme.colors.primary }}>seen in</span>{' '}
                          {capability.projectIds
                            .map(
                              (id) =>
                                presentation.projects.find((project) => project.id === id)?.name ?? id,
                            )
                            .join(' · ')}
                        </p>
                      ) : null}

                      {evidence.length > 0 ? (
                        <div className="mt-4">
                          <Disclosure label="Show evidence" count={evidence.length} tone="subtle">
                            <div className="space-y-3">
                              {evidence.map((item) => (
                                <EvidenceCard key={item.id} evidence={item} compact />
                              ))}
                            </div>
                          </Disclosure>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
