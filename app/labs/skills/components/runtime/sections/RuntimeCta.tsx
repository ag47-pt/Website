'use client';

import React from 'react';
import { NormalizedDesignSystem } from '@/lib/design-system/types';
import { ArrowRight, Sparkles } from 'lucide-react';

interface RuntimeCtaProps {
  spec: NormalizedDesignSystem;
  themeMode: 'light' | 'dark';
}

export function RuntimeCta({ spec, themeMode }: RuntimeCtaProps) {
  const { demo_content, colors, radius, typography, spacing } = spec;
  const isDark = themeMode === 'dark';

  const primaryColor = isDark ? (colors.primary.dark_value || colors.primary.value) : colors.primary.value;
  const secondaryColor = isDark ? (colors.secondary.dark_value || colors.secondary.value) : colors.secondary.value;
  const surfaceColor = isDark ? (colors.surface.dark_value || colors.surface.value) : colors.surface.value;
  const textPrimary = isDark ? (colors.text_primary.dark_value || colors.text_primary.value) : colors.text_primary.value;
  const textSecondary = isDark ? (colors.text_secondary.dark_value || colors.text_secondary.value) : colors.text_secondary.value;
  const borderColor = isDark ? (colors.border.dark_value || colors.border.value) : colors.border.value;

  return (
    <section
      className="py-20 md:py-28 border-b relative overflow-hidden"
      style={{
        borderColor: borderColor,
        paddingTop: spacing.section_spacing || '96px',
        paddingBottom: spacing.section_spacing || '96px',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div
          className="p-10 md:p-16 border text-center space-y-8 relative overflow-hidden shadow-2xl"
          style={{
            backgroundColor: surfaceColor,
            borderColor: borderColor,
            borderRadius: radius.lg || '24px',
          }}
        >
          {/* Subtle background glow */}
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
            style={{ backgroundColor: primaryColor }}
          />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-wider border select-none mx-auto"
              style={{
                backgroundColor: `${primaryColor}15`,
                borderColor: `${primaryColor}40`,
                color: primaryColor,
                borderRadius: radius.full || '999px',
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>EXPERIMENTE HOJE</span>
            </div>

            <h2
              className="text-2xl md:text-5xl font-bold tracking-tight leading-tight"
              style={{
                color: textPrimary,
                fontFamily: typography.h2.font_family,
              }}
            >
              Pronto para Dar Vida à Sua Próxima Grande Ideia?
            </h2>

            <p className="text-sm md:text-base leading-relaxed" style={{ color: textSecondary }}>
              Junte-se a milhares de engenheiros, designers e líderes de produto que constroem com alto rigor e velocidade.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-2">
            <button
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm md:text-base font-bold shadow-lg transition-transform active:scale-95 cursor-pointer"
              style={{
                backgroundColor: primaryColor,
                color: '#0A0A0A',
                borderRadius: radius.md || '12px',
                fontFamily: typography.button.font_family,
              }}
            >
              <span>{demo_content.cta_primary || 'Começar Gratuitamente'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
