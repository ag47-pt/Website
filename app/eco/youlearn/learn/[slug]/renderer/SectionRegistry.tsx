'use client';

import React from 'react';
import { Section, SectionType, Source } from '@/eco/youlearn/schema/types';
import { LearningOverviewSection } from '../sections/LearningOverviewSection';
import { LearningTimelineSection } from '../sections/LearningTimelineSection';
import { ConceptSection } from '../sections/ConceptSection';
import { ProcessSection } from '../sections/ProcessSection';
import { ComparisonSection } from '../sections/ComparisonSection';
import { VisualEvidenceSection } from '../sections/VisualEvidenceSection';
import { InsightSection } from '../sections/InsightSection';
import { QuizSection } from '../sections/QuizSection';
import { TakeawaysSection } from '../sections/TakeawaysSection';
import { SourceProvenanceSection } from '../sections/SourceProvenanceSection';
import { AlertCircle } from 'lucide-react';

export type SectionRendererProps<T = any> = {
  section: Section;
  source: Source;
};

export const SECTION_REGISTRY: Record<
  string,
  React.ComponentType<SectionRendererProps>
> = {
  overview: LearningOverviewSection as React.ComponentType<SectionRendererProps>,
  timeline: LearningTimelineSection as React.ComponentType<SectionRendererProps>,
  concept: ConceptSection as React.ComponentType<SectionRendererProps>,
  process: ProcessSection as React.ComponentType<SectionRendererProps>,
  comparison: ComparisonSection as React.ComponentType<SectionRendererProps>,
  visual: VisualEvidenceSection as React.ComponentType<SectionRendererProps>,
  insight: InsightSection as React.ComponentType<SectionRendererProps>,
  quiz: QuizSection as React.ComponentType<SectionRendererProps>,
  takeaways: TakeawaysSection as React.ComponentType<SectionRendererProps>,
  provenance: SourceProvenanceSection as React.ComponentType<SectionRendererProps>,
};

/**
 * Fallback renderer when an unmapped section type is encountered
 */
export function UnknownSectionFallback({ section }: { section: Section }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="rounded-2xl border border-dashed border-amber-500/30 bg-amber-500/5 p-6 text-xs text-amber-300">
        <div className="flex items-center gap-2 font-mono font-bold uppercase mb-2">
          <AlertCircle className="h-4 w-4 text-amber-400" />
          <span>Dynamic / Unregistered Section Type: [{section.type}]</span>
        </div>
        <p className="text-zinc-300 mb-2">{section.title}</p>
        <pre className="overflow-x-auto rounded bg-black/60 p-3 font-mono text-[11px] text-zinc-400">
          {JSON.stringify(section.content, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export function renderSection(section: Section, source: Source): React.ReactNode {
  const Component = SECTION_REGISTRY[section.type];
  if (!Component) {
    return <UnknownSectionFallback key={section.id} section={section} />;
  }
  return <Component key={section.id} section={section} source={source} />;
}
