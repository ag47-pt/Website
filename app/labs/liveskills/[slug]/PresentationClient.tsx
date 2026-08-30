'use client';

import React, { useMemo } from 'react';
import { useTheme } from '@/context/ThemeContext';
import type { LiveSkillPresentation } from '../types';
import { countByConfidence, getReferencedEvidence } from '../lib/metrics';
import { CANDIDATE, AUDIT_DATE } from '../data/candidate';
import {
  AiNativeSection,
  CapabilityGroups,
  CapabilityMapGrid,
  EngineeringWorkflow,
  EvidenceContract,
  MetaSection,
  PresentationCta,
  PresentationHero,
  PresentationNav,
  ProjectCaseCard,
  RequirementMatchList,
  Reveal,
  SectionShell,
  type NavSection,
} from '../components';

const NAV_SECTIONS: NavSection[] = [
  { id: 'capabilities', label: 'What I build' },
  { id: 'workflow', label: 'How I engineer' },
  { id: 'work', label: 'Selected work' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'stack', label: 'Stack' },
  { id: 'ai-native', label: 'AI-native' },
  { id: 'about-this-page', label: 'This page' },
  { id: 'contact', label: 'Contact' },
];

/**
 * Renderizador do motor LiveSkills.
 * Recebe uma apresentação inteira e monta as secções. Não sabe nada
 * sobre a empresa concreta — tudo vem da configuração.
 */
export function PresentationClient({ presentation }: { presentation: LiveSkillPresentation }) {
  const { theme } = useTheme();

  const referenced = useMemo(() => getReferencedEvidence(presentation), [presentation]);
  const counts = useMemo(() => countByConfidence(referenced), [referenced]);

  const heroStats = useMemo(
    () => [
      { label: 'Evidence items', value: String(referenced.length) },
      { label: 'Verified', value: String(counts.VERIFIED) },
      { label: 'Systems shown', value: String(presentation.projects.length) },
      { label: 'Requirements addressed', value: String(presentation.requirementMatches.length) },
    ],
    [referenced.length, counts.VERIFIED, presentation.projects.length, presentation.requirementMatches.length],
  );

  return (
    <div
      className="space-y-8 pb-8 sm:space-y-10"
      /* O texto do LiveSkills segue o tema ativo do portal, como as restantes rotas /labs. */
      style={
        {
          '--ls-text': theme.colors.textSecondary,
          '--ls-dim': 'rgba(255,255,255,0.72)',
          '--ls-accent': theme.colors.primary,
        } as React.CSSProperties
      }
    >
      <PresentationHero presentation={presentation} stats={heroStats} />

      <PresentationNav sections={NAV_SECTIONS} />

      {/* Narrative + evidence contract */}
      <section aria-labelledby="narrative-heading">
        <h2 id="narrative-heading" className="sr-only">
          Positioning
        </h2>
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <Reveal>
            <div className="h-full rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur-xl sm:p-7">
              <p
                className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em]"
                style={{ color: theme.colors.primary }}
              >
                {CANDIDATE.positioning} · {CANDIDATE.discipline}
              </p>
              <div className="space-y-4">
                {presentation.narrative.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 32)}
                    className="text-base leading-relaxed text-[var(--ls-text)] sm:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <EvidenceContract counts={counts} auditDate={AUDIT_DATE} />
          </Reveal>
        </div>
      </section>

      <SectionShell id="capabilities" copy={presentation.sections.capabilities}>
        <CapabilityGroups presentation={presentation} />
      </SectionShell>

      <SectionShell id="workflow" copy={presentation.sections.workflow}>
        <EngineeringWorkflow
          steps={presentation.workflow}
          principle={presentation.sections.workflow.principle}
        />
      </SectionShell>

      <SectionShell id="work" copy={presentation.sections.projects}>
        <div className="space-y-5">
          {presentation.projects.map((project, index) => (
            <ProjectCaseCard
              key={project.id}
              project={project}
              presentation={presentation}
              order={index}
            />
          ))}
        </div>
      </SectionShell>

      <SectionShell id="requirements" copy={presentation.sections.requirements}>
        <RequirementMatchList presentation={presentation} />
      </SectionShell>

      <SectionShell id="stack" copy={presentation.sections.capabilityMap}>
        <CapabilityMapGrid entries={presentation.capabilityMap} />
      </SectionShell>

      <SectionShell id="ai-native" copy={presentation.sections.aiNative}>
        <AiNativeSection
          presentation={presentation}
          principle={presentation.sections.aiNative.principle}
        />
      </SectionShell>

      <SectionShell id="about-this-page" copy={presentation.sections.meta}>
        <MetaSection presentation={presentation} />
      </SectionShell>

      <PresentationCta cta={presentation.cta} pendingConfirmation={CANDIDATE.pendingConfirmation} />
    </div>
  );
}
