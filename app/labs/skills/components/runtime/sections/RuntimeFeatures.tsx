'use client';

import React from 'react';
import { NormalizedDesignSystem } from '@/lib/design-system/types';
import { Sparkles, Layers, Cpu, Compass, Globe, ShieldCheck } from 'lucide-react';

interface RuntimeFeaturesProps {
  spec: NormalizedDesignSystem;
  themeMode: 'light' | 'dark';
}

export function RuntimeFeatures({ spec, themeMode }: RuntimeFeaturesProps) {
  const { presentation, demo_content, colors, radius, typography, spacing } = spec;
  const isDark = themeMode === 'dark';

  const primaryColor = isDark ? (colors.primary.dark_value || colors.primary.value) : colors.primary.value;
  const secondaryColor = isDark ? (colors.secondary.dark_value || colors.secondary.value) : colors.secondary.value;
  const surfaceColor = isDark ? (colors.surface.dark_value || colors.surface.value) : colors.surface.value;
  const textPrimary = isDark ? (colors.text_primary.dark_value || colors.text_primary.value) : colors.text_primary.value;
  const textSecondary = isDark ? (colors.text_secondary.dark_value || colors.text_secondary.value) : colors.text_secondary.value;
  const textMuted = isDark ? (colors.text_muted.dark_value || colors.text_muted.value) : colors.text_muted.value;
  const borderColor = isDark ? (colors.border.dark_value || colors.border.value) : colors.border.value;

  const features = demo_content.features_highlight || [];

  const icons = [
    <Cpu key="0" className="w-5 h-5" />,
    <Layers key="1" className="w-5 h-5" />,
    <ShieldCheck key="2" className="w-5 h-5" />,
    <Compass key="3" className="w-5 h-5" />,
    <Globe key="4" className="w-5 h-5" />,
  ];

  return (
    <section
      className="py-16 md:py-24 border-b"
      style={{
        borderColor: borderColor,
        paddingTop: spacing.section_spacing || '80px',
        paddingBottom: spacing.section_spacing || '80px',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 space-y-12">
        {/* Section Header */}
        <div className="max-w-2xl space-y-4 text-left">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-wider border select-none"
            style={{
              backgroundColor: `${primaryColor}10`,
              borderColor: `${primaryColor}30`,
              color: primaryColor,
              borderRadius: radius.full || '999px',
              fontFamily: typography.label?.font_family,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>CAPACIDADES E DIFERENCIAIS</span>
          </div>

          <h2
            className="text-2xl md:text-4xl font-bold tracking-tight"
            style={{
              color: textPrimary,
              fontFamily: typography.h2.font_family,
            }}
          >
            Engenharia Projetada para o Mais Alto Nível de Exigência
          </h2>

          <p
            className="text-sm md:text-base leading-relaxed"
            style={{
              color: textSecondary,
              fontFamily: typography.body.font_family,
            }}
          >
            Cada componente, fluxo e interação segue as diretrizes estruturais definidas neste ecossistema.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 md:p-8 border transition-all hover:-translate-y-1 space-y-4 relative group"
              style={{
                backgroundColor: surfaceColor,
                borderColor: borderColor,
                borderRadius: radius.lg || '18px',
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-xl border"
                  style={{
                    backgroundColor: `${primaryColor}15`,
                    borderColor: `${primaryColor}30`,
                    color: primaryColor,
                  }}
                >
                  {icons[idx % icons.length]}
                </div>

                {feat.tag && (
                  <span
                    className="text-[11px] font-mono font-bold px-2.5 py-0.5 border"
                    style={{
                      backgroundColor: `${secondaryColor}15`,
                      borderColor: `${secondaryColor}30`,
                      color: secondaryColor,
                      borderRadius: radius.full || '999px',
                    }}
                  >
                    {feat.tag}
                  </span>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <h3
                  className="text-lg font-bold"
                  style={{
                    color: textPrimary,
                    fontFamily: typography.h3?.font_family,
                  }}
                >
                  {feat.title}
                </h3>
                <p
                  className="text-xs md:text-sm leading-relaxed"
                  style={{
                    color: textSecondary,
                    fontFamily: typography.body.font_family,
                  }}
                >
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
