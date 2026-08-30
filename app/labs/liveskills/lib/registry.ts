/**
 * LiveSkills — Presentation Registry
 * ===================================
 * Ponto único de registo das apresentações do motor.
 *
 * Adicionar uma nova apresentação = criar `data/<slug>.ts` e acrescentar
 * uma entrada aqui. A rota `/labs/liveskills/[slug]` e o índice do lab
 * derivam ambos deste array — nenhuma página nova é necessária.
 */

import type { LiveSkillPresentation } from '../types';
import { YER_PRESENTATION } from '../data/yer';

export const PRESENTATIONS: LiveSkillPresentation[] = [YER_PRESENTATION];

/** Apresentações servidas publicamente. `unlisted` e `private` ficam de fora do índice. */
export const PUBLIC_PRESENTATIONS = PRESENTATIONS.filter(
  (presentation) => presentation.visibility === 'public' && presentation.status !== 'draft',
);

export function getPresentation(slug: string): LiveSkillPresentation | undefined {
  return PRESENTATIONS.find((presentation) => presentation.slug === slug);
}

/**
 * Slugs pré-renderizados. `private` nunca é gerado estaticamente.
 * `unlisted` continua a resolver por URL direto, apenas não aparece no índice.
 */
export function getRenderableSlugs(): string[] {
  return PRESENTATIONS.filter((presentation) => presentation.visibility !== 'private').map(
    (presentation) => presentation.slug,
  );
}
