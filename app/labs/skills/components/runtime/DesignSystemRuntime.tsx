'use client';

import React from 'react';
import { NormalizedDesignSystem } from '@/lib/design-system/types';
import { resolveSectionRecipe } from '@/lib/design-system/runtime/section-recipes';
import { RuntimeNavbar } from './sections/RuntimeNavbar';
import { RuntimeHero } from './sections/RuntimeHero';
import { RuntimeFeatures } from './sections/RuntimeFeatures';
import { RuntimeShowcaseGrid } from './sections/RuntimeShowcaseGrid';
import { RuntimeMetrics } from './sections/RuntimeMetrics';
import { RuntimePricing } from './sections/RuntimePricing';
import { RuntimeCta } from './sections/RuntimeCta';
import { RuntimeFooter } from './sections/RuntimeFooter';

interface DesignSystemRuntimeProps {
  spec: NormalizedDesignSystem;
  themeMode?: 'light' | 'dark';
  viewportMode?: 'desktop' | 'tablet' | 'mobile';
}

export function DesignSystemRuntime({
  spec,
  themeMode = 'dark',
  viewportMode = 'desktop',
}: DesignSystemRuntimeProps) {
  const isDark = themeMode === 'dark';
  const { colors, typography, radius, spacing, presentation } = spec;

  // Resolve active theme colors
  const primaryColor = isDark ? (colors.primary.dark_value || colors.primary.value) : colors.primary.value;
  const secondaryColor = isDark ? (colors.secondary.dark_value || colors.secondary.value) : colors.secondary.value;
  const accentColor = isDark ? (colors.accent.dark_value || colors.accent.value) : colors.accent.value;
  const bgColor = isDark ? (colors.background.dark_value || colors.background.value) : colors.background.value;
  const surfaceColor = isDark ? (colors.surface.dark_value || colors.surface.value) : colors.surface.value;
  const surfaceElevated = isDark ? (colors.surface_elevated.dark_value || colors.surface_elevated.value) : colors.surface_elevated.value;
  const textPrimary = isDark ? (colors.text_primary.dark_value || colors.text_primary.value) : colors.text_primary.value;
  const textSecondary = isDark ? (colors.text_secondary.dark_value || colors.text_secondary.value) : colors.text_secondary.value;
  const textMuted = isDark ? (colors.text_muted.dark_value || colors.text_muted.value) : colors.text_muted.value;
  const borderColor = isDark ? (colors.border.dark_value || colors.border.value) : colors.border.value;

  const recipe = resolveSectionRecipe(presentation.archetype);

  // Viewport width constraints for internal preview
  const getViewportWidth = () => {
    switch (viewportMode) {
      case 'mobile':
        return 'max-w-[390px] mx-auto shadow-2xl my-6 border rounded-[36px] overflow-hidden';
      case 'tablet':
        return 'max-w-[768px] mx-auto shadow-2xl my-6 border rounded-[24px] overflow-hidden';
      default:
        return 'w-full';
    }
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors ${getViewportWidth()}`}
      style={{
        backgroundColor: bgColor,
        color: textPrimary,
        fontFamily: typography.body.font_family || 'sans-serif',
        borderColor: borderColor,
      }}
      data-theme={themeMode}
    >
      {/* 1. Navbar */}
      <RuntimeNavbar spec={spec} themeMode={themeMode} />

      {/* 2. Dynamic Sections based on Archetype Recipe */}
      <main className="w-full">
        {recipe.sections.map((section, idx) => {
          switch (section) {
            case 'hero':
              return <RuntimeHero key={idx} spec={spec} themeMode={themeMode} />;
            case 'metrics':
              return recipe.show_metrics ? (
                <RuntimeMetrics key={idx} spec={spec} themeMode={themeMode} />
              ) : null;
            case 'features':
              return <RuntimeFeatures key={idx} spec={spec} themeMode={themeMode} />;
            case 'showcase':
              return recipe.show_showcase ? (
                <RuntimeShowcaseGrid key={idx} spec={spec} themeMode={themeMode} />
              ) : null;
            case 'pricing':
              return recipe.show_pricing ? (
                <RuntimePricing key={idx} spec={spec} themeMode={themeMode} />
              ) : null;
            case 'cta':
              return <RuntimeCta key={idx} spec={spec} themeMode={themeMode} />;
            default:
              return null;
          }
        })}
      </main>

      {/* 3. Footer */}
      <RuntimeFooter spec={spec} themeMode={themeMode} />
    </div>
  );
}
