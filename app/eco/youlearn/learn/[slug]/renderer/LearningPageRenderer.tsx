'use client';

import React from 'react';
import { KnowledgeObject } from '@/eco/youlearn/schema/types';
import { LearningHeroSection } from '../sections/LearningHeroSection';
import { renderSection } from './SectionRegistry';

interface LearningPageRendererProps {
  knowledge: KnowledgeObject;
}

export function LearningPageRenderer({ knowledge }: LearningPageRendererProps) {
  return (
    <article className="min-h-screen bg-transparent text-white selection:bg-[#D1FF00] selection:text-black">
      {/* 1. Declarative Hero */}
      <LearningHeroSection knowledge={knowledge} />

      {/* 2. Dynamic Section Stream from Declarative Schema */}
      <div className="divide-y divide-white/10">
        {knowledge.sections.map((section) => renderSection(section, knowledge.source))}
      </div>
    </article>
  );
}
