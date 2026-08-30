'use client';

import React from 'react';
import { CornerDownRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import type { LiveSkillPresentation } from '../types';
import { resolveEvidence } from '../lib/metrics';
import { ConfidenceBadge } from './ConfidenceBadge';
import { Disclosure } from './Disclosure';
import { EvidenceCard } from './EvidenceCard';
import { Reveal } from './SectionShell';

/**
 * Componente reutilizável do motor — será central em qualquer apresentação futura:
 *
 *   Opportunity requirement → Candidate capability → Project evidence
 *
 * Sem percentagens de match. Sem keyword stuffing. Uma linha pode ser um gap
 * declarado em vez de uma correspondência.
 */
export function RequirementMatchList({ presentation }: { presentation: LiveSkillPresentation }) {
  const { theme } = useTheme();

  return (
    <ul className="space-y-3">
      {presentation.requirementMatches.map((match, index) => {
        const evidence = resolveEvidence(presentation, match.evidenceIds);
        const projects = match.projectIds
          .map((id) => presentation.projects.find((project) => project.id === id))
          .filter(Boolean);
        const isGap = match.projectIds.length === 0;

        return (
          <Reveal key={match.id} delay={Math.min(index * 0.03, 0.2)}>
            <li
              className={`rounded-2xl border bg-black/60 backdrop-blur-xl p-5 transition-all duration-500 sm:p-6 ${
                isGap
                  ? 'border-amber-500/25 hover:border-amber-500/40'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="grid gap-5 lg:grid-cols-[1fr_1.35fr] lg:gap-8">
                {/* Requirement */}
                <div>
                  <p
                    className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: isGap ? '#fbbf24' : theme.colors.primary }}
                  >
                    {isGap ? 'Stated gap' : `${presentation.target.organization} needs`}
                  </p>
                  <h3 className="text-sm font-bold leading-snug tracking-tight text-white sm:text-base">
                    {match.requirement}
                  </h3>
                </div>

                {/* Capability + evidence */}
                <div className="lg:border-l lg:border-white/10 lg:pl-8">
                  <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ls-dim)]">
                    <CornerDownRight className="h-3 w-3" aria-hidden="true" />
                    {isGap ? 'Where I actually am' : 'What I can show'}
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--ls-text)]">{match.capability}</p>

                  {projects.length > 0 ? (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {projects.map((project) => (
                        <li
                          key={project!.id}
                          className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[var(--ls-text)]"
                        >
                          {project!.name}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {match.caveat ? (
                    <p className="mt-3 text-[13px] leading-relaxed text-amber-300/90">
                      {match.caveat}
                    </p>
                  ) : null}

                  {evidence.length > 0 ? (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Disclosure label="Evidence" count={evidence.length} tone="subtle">
                        <div className="grid gap-3 sm:grid-cols-2">
                          {evidence.map((item) => (
                            <EvidenceCard key={item.id} evidence={item} compact />
                          ))}
                        </div>
                      </Disclosure>
                      {evidence[0] ? <ConfidenceBadge level={evidence[0].confidence} size="xs" /> : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </li>
          </Reveal>
        );
      })}
    </ul>
  );
}
