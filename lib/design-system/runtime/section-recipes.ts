import { Archetype } from '../types';

export type SectionType =
  | 'navbar'
  | 'hero'
  | 'metrics'
  | 'features'
  | 'showcase'
  | 'pricing'
  | 'cta'
  | 'footer';

export interface SectionRecipe {
  archetype: Archetype;
  sections: SectionType[];
  show_pricing: boolean;
  show_showcase: boolean;
  show_metrics: boolean;
}

/**
 * Deterministic section composition recipes per archetype.
 */
export const ARCHETYPE_SECTION_RECIPES: Record<Archetype, SectionRecipe> = {
  editorial: {
    archetype: 'editorial',
    sections: ['navbar', 'hero', 'showcase', 'features', 'cta', 'footer'],
    show_pricing: false,
    show_showcase: true,
    show_metrics: false,
  },
  saas: {
    archetype: 'saas',
    sections: ['navbar', 'hero', 'metrics', 'features', 'pricing', 'cta', 'footer'],
    show_pricing: true,
    show_showcase: false,
    show_metrics: true,
  },
  commerce: {
    archetype: 'commerce',
    sections: ['navbar', 'hero', 'showcase', 'features', 'cta', 'footer'],
    show_pricing: false,
    show_showcase: true,
    show_metrics: false,
  },
  fintech: {
    archetype: 'fintech',
    sections: ['navbar', 'hero', 'metrics', 'showcase', 'features', 'cta', 'footer'],
    show_pricing: false,
    show_showcase: true,
    show_metrics: true,
  },
  restaurant: {
    archetype: 'restaurant',
    sections: ['navbar', 'hero', 'showcase', 'features', 'cta', 'footer'],
    show_pricing: false,
    show_showcase: true,
    show_metrics: false,
  },
  service: {
    archetype: 'service',
    sections: ['navbar', 'hero', 'metrics', 'features', 'pricing', 'cta', 'footer'],
    show_pricing: true,
    show_showcase: false,
    show_metrics: true,
  },
  minimal: {
    archetype: 'minimal',
    sections: ['navbar', 'hero', 'features', 'cta', 'footer'],
    show_pricing: false,
    show_showcase: false,
    show_metrics: false,
  },
  generic: {
    archetype: 'generic',
    sections: ['navbar', 'hero', 'features', 'cta', 'footer'],
    show_pricing: false,
    show_showcase: false,
    show_metrics: false,
  },
};

export function resolveSectionRecipe(archetype: Archetype): SectionRecipe {
  return ARCHETYPE_SECTION_RECIPES[archetype] || ARCHETYPE_SECTION_RECIPES.saas;
}
