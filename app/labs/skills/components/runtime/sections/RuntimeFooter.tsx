'use client';

import React from 'react';
import { NormalizedDesignSystem } from '@/lib/design-system/types';

interface RuntimeFooterProps {
  spec: NormalizedDesignSystem;
  themeMode: 'light' | 'dark';
}

export function RuntimeFooter({ spec, themeMode }: RuntimeFooterProps) {
  const { demo_content, colors, radius, typography } = spec;
  const isDark = themeMode === 'dark';

  const primaryColor = isDark ? (colors.primary.dark_value || colors.primary.value) : colors.primary.value;
  const surfaceColor = isDark ? (colors.surface.dark_value || colors.surface.value) : colors.surface.value;
  const textPrimary = isDark ? (colors.text_primary.dark_value || colors.text_primary.value) : colors.text_primary.value;
  const textMuted = isDark ? (colors.text_muted.dark_value || colors.text_muted.value) : colors.text_muted.value;
  const borderColor = isDark ? (colors.border.dark_value || colors.border.value) : colors.border.value;

  const brandName = demo_content.brand_name || spec.meta.name;

  return (
    <footer
      className="py-12 md:py-16 transition-colors"
      style={{
        backgroundColor: surfaceColor,
        borderColor: borderColor,
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b" style={{ borderColor: borderColor }}>
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 flex items-center justify-center font-bold text-xs select-none"
                style={{
                  backgroundColor: primaryColor,
                  color: '#0A0A0A',
                  borderRadius: radius.sm || '6px',
                }}
              >
                {brandName.charAt(0)}
              </div>
              <span className="font-bold text-base" style={{ color: textPrimary }}>
                {brandName}
              </span>
            </div>
            <p className="text-xs max-w-sm leading-relaxed" style={{ color: textMuted }}>
              {demo_content.tagline || spec.meta.description}
            </p>
          </div>

          {/* Links 1 */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: textPrimary }}>
              PRODUTO
            </span>
            <ul className="space-y-2 text-xs" style={{ color: textMuted }}>
              <li><a href="#recursos" className="hover:underline">Recursos</a></li>
              <li><a href="#solucoes" className="hover:underline">Soluções</a></li>
              <li><a href="#precos" className="hover:underline">Preços & Planos</a></li>
              <li><a href="#changelog" className="hover:underline">Changelog</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: textPrimary }}>
              LEGAL & PRIVACIDADE
            </span>
            <ul className="space-y-2 text-xs" style={{ color: textMuted }}>
              <li><a href="#termos" className="hover:underline">Termos de Uso</a></li>
              <li><a href="#privacidade" className="hover:underline">Privacidade</a></li>
              <li><a href="#seguranca" className="hover:underline">Segurança</a></li>
              <li><a href="#conformidade" className="hover:underline">Conformidade</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: textMuted }}>
          <div>
            © {new Date().getFullYear()} {brandName}. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <span className="font-bold font-mono" style={{ color: primaryColor }}>
              {spec.meta.name} (v{spec.meta.version})
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
