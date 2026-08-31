'use client';

import React from 'react';
import { NormalizedDesignSystem } from '@/lib/design-system/types';

interface TypographyShowcaseProps {
  spec: NormalizedDesignSystem;
}

export function TypographyShowcase({ spec }: TypographyShowcaseProps) {
  const t = spec.typography;

  const scaleItems = [
    { key: 'display', token: t.display, sample: 'Display Hero Title 48px' },
    { key: 'h1', token: t.h1, sample: 'Heading 1 — Principais Títulos de Página' },
    { key: 'h2', token: t.h2, sample: 'Heading 2 — Títulos de Seção e Módulos' },
    { key: 'h3', token: t.h3, sample: 'Heading 3 — Subtítulos e Grupos de Conteúdo' },
    { key: 'section_title', token: t.section_title, sample: 'Section Title — Destaques de Categoria' },
    { key: 'card_title', token: t.card_title, sample: 'Card Title — Nome do Item ou Produto' },
    { key: 'body', token: t.body, sample: 'Body Text — Texto corrido de alta legibilidade para parágrafos explicativos e descrições detalhadas do sistema.' },
    { key: 'secondary_body', token: t.secondary_body, sample: 'Secondary Body — Texto de apoio e notas complementares para componentes.' },
    { key: 'label', token: t.label, sample: 'FORM INPUT LABEL' },
    { key: 'button', token: t.button, sample: 'BUTTON ACTION LABEL' },
    { key: 'price', token: t.price, sample: 'R$ 149,90 / € 28.50' },
    { key: 'caption', token: t.caption, sample: 'Caption — Legenda descritiva e notas de rodapé' },
    { key: 'metadata', token: t.metadata, sample: 'METADATA_CODE_0x47 // MONOSPACE_TOKEN_VALUE' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold tracking-tight mb-2">Escala Tipográfica & Métricas</h3>
        <p className="text-sm opacity-70">
          Hierarquia de texto tipada com renderização real dos tokens, pesos de fonte, line-height e tracking.
        </p>
      </div>

      <div className="space-y-6">
        {scaleItems.map(({ key, token, sample }) => {
          const isDefined = token.status === 'DEFINED';

          return (
            <div
              key={key}
              className="p-5 rounded-xl border border-white/10 bg-[var(--ds-surface)] space-y-3 transition-all hover:border-[var(--ds-primary)]/40"
              style={{
                borderRadius: 'var(--ds-radius-md)',
              }}
            >
              {/* Header with Technical Metrics */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--ds-primary)]">
                    {key}
                  </span>
                  <span className="text-xs font-semibold opacity-70">({token.name})</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono opacity-60">
                  <span className="px-2 py-0.5 bg-black/20 rounded">Size: {token.size}</span>
                  {token.mobile_size && <span className="px-2 py-0.5 bg-black/20 rounded">Mobile: {token.mobile_size}</span>}
                  <span className="px-2 py-0.5 bg-black/20 rounded">Weight: {token.weight}</span>
                  <span className="px-2 py-0.5 bg-black/20 rounded">LH: {token.line_height}</span>
                  {token.tracking && <span className="px-2 py-0.5 bg-black/20 rounded">Track: {token.tracking}</span>}
                  {!isDefined && (
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 font-bold rounded">
                      {token.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Live Rendered Typography */}
              <div
                style={{
                  fontFamily: token.font_family !== 'inherit' ? token.font_family : 'inherit',
                  fontSize: token.size,
                  fontWeight: token.weight,
                  lineHeight: token.line_height,
                  letterSpacing: token.tracking || 'normal',
                }}
                className="text-[var(--ds-text-primary)]"
              >
                {sample}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
