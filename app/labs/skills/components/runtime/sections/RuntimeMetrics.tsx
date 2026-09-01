'use client';

import React from 'react';
import { NormalizedDesignSystem } from '@/lib/design-system/types';

interface RuntimeMetricsProps {
  spec: NormalizedDesignSystem;
  themeMode: 'light' | 'dark';
}

export function RuntimeMetrics({ spec, themeMode }: RuntimeMetricsProps) {
  const { colors, radius, typography, spacing, presentation } = spec;
  const isDark = themeMode === 'dark';

  const primaryColor = isDark ? (colors.primary.dark_value || colors.primary.value) : colors.primary.value;
  const secondaryColor = isDark ? (colors.secondary.dark_value || colors.secondary.value) : colors.secondary.value;
  const surfaceColor = isDark ? (colors.surface.dark_value || colors.surface.value) : colors.surface.value;
  const textPrimary = isDark ? (colors.text_primary.dark_value || colors.text_primary.value) : colors.text_primary.value;
  const textSecondary = isDark ? (colors.text_secondary.dark_value || colors.text_secondary.value) : colors.text_secondary.value;
  const textMuted = isDark ? (colors.text_muted.dark_value || colors.text_muted.value) : colors.text_muted.value;
  const borderColor = isDark ? (colors.border.dark_value || colors.border.value) : colors.border.value;

  const metrics = [
    { value: '99.99%', label: 'Disponibilidade Global', sub: 'SLA contratual em mais de 30 regiões' },
    { value: '< 80ms', label: 'Latência de Inferência', sub: 'Tempo de síntese neural em tempo real' },
    { value: '40+', label: 'Idiomas Suportados', sub: 'Modelos acústicos multilíngues com prosódia' },
    { value: '100%', label: 'Fidelidade de Tokens', sub: 'Contrato determinístico sem interpretação livre' },
  ];

  return (
    <section
      className="py-12 md:py-16 border-b"
      style={{
        borderColor: borderColor,
        backgroundColor: `${surfaceColor}60`,
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="p-6 border text-left space-y-2 transition-transform hover:-translate-y-0.5"
              style={{
                backgroundColor: surfaceColor,
                borderColor: borderColor,
                borderRadius: radius.md || '12px',
              }}
            >
              <div
                className="text-2xl md:text-4xl font-bold font-mono tracking-tight"
                style={{
                  color: idx % 2 === 0 ? primaryColor : secondaryColor,
                  fontFamily: typography.display.font_family,
                }}
              >
                {m.value}
              </div>
              <div className="text-xs md:text-sm font-bold" style={{ color: textPrimary }}>
                {m.label}
              </div>
              <div className="text-[11px] leading-tight" style={{ color: textMuted }}>
                {m.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
