'use client';

import React from 'react';
import { NormalizedDesignSystem } from '@/lib/design-system/types';

interface FoundationsShowcaseProps {
  spec: NormalizedDesignSystem;
  isDarkMode: boolean;
}

export function FoundationsShowcase({ spec, isDarkMode }: FoundationsShowcaseProps) {
  const c = spec.colors;
  const s = spec.spacing;
  const r = spec.radius;
  const sh = spec.shadows;

  const colorGroups = [
    {
      title: 'BRAND & ACCENTS',
      tokens: [
        { id: 'primary', token: c.primary, label: 'Primary Brand' },
        { id: 'secondary', token: c.secondary, label: 'Secondary' },
        { id: 'accent', token: c.accent, label: 'Accent' },
      ],
    },
    {
      title: 'SURFACES & BACKGROUNDS',
      tokens: [
        { id: 'background', token: c.background, label: 'Background' },
        { id: 'surface', token: c.surface, label: 'Surface Card' },
        { id: 'surface_elevated', token: c.surface_elevated, label: 'Surface Elevated' },
      ],
    },
    {
      title: 'TEXT & BORDERS',
      tokens: [
        { id: 'text_primary', token: c.text_primary, label: 'Text Primary' },
        { id: 'text_secondary', token: c.text_secondary, label: 'Text Secondary' },
        { id: 'text_muted', token: c.text_muted, label: 'Text Muted' },
        { id: 'border', token: c.border, label: 'Border' },
      ],
    },
    {
      title: 'SEMANTIC & STATUS',
      tokens: [
        { id: 'success', token: c.success, label: 'Success' },
        { id: 'warning', token: c.warning, label: 'Warning' },
        { id: 'error', token: c.error, label: 'Error' },
        { id: 'info', token: c.info, label: 'Info' },
      ],
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-xl font-bold tracking-tight mb-2">Foundations & Tokens</h3>
        <p className="text-sm opacity-70">
          Paleta de cores normalizada, espaçamentos matemáticos, raios de curvatura e elevação de superfícies.
        </p>
      </div>

      {/* 1. Colors Showcase */}
      <div className="space-y-6">
        <h4 className="text-xs font-mono font-bold tracking-widest uppercase opacity-60">1. Color Palette</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {colorGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <span className="text-[11px] font-mono font-bold tracking-wider opacity-50 block">{group.title}</span>
              <div className="space-y-3">
                {group.tokens.map(({ id, token, label }) => {
                  const activeColor = isDarkMode && token.dark_value ? token.dark_value : token.value;
                  const isDefined = token.status === 'DEFINED';

                  return (
                    <div
                      key={id}
                      className="p-3 rounded-xl border border-white/10 bg-[var(--ds-surface)] flex items-center gap-3 transition-transform hover:scale-[1.01]"
                      style={{
                        boxShadow: 'var(--ds-shadow-sm)',
                        borderRadius: 'var(--ds-radius-md)',
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg border border-black/10 shrink-0 shadow-inner flex items-center justify-center font-mono text-[9px] font-bold"
                        style={{
                          backgroundColor: activeColor,
                          borderRadius: 'var(--ds-radius-sm)',
                        }}
                      >
                        {!isDefined && <span className="text-red-500 bg-white/90 px-1 rounded">N/D</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold truncate">{label}</span>
                          <span className="text-[10px] font-mono opacity-60">{activeColor}</span>
                        </div>
                        <p className="text-[11px] opacity-60 truncate mt-0.5">{token.usage || `Token ${id}`}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Spacing & Radius Foundations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/10">
        {/* Spacing */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold tracking-widest uppercase opacity-60">2. Spacing Scale</h4>
          <div className="p-5 rounded-xl border border-white/10 bg-[var(--ds-surface)] space-y-3" style={{ borderRadius: 'var(--ds-radius-md)' }}>
            {[
              { token: 'xs', val: s.xs, label: 'Extra Small' },
              { token: 'sm', val: s.sm, label: 'Small' },
              { token: 'md', val: s.md, label: 'Medium' },
              { token: 'lg', val: s.lg, label: 'Large' },
              { token: 'xl', val: s.xl, label: 'Extra Large' },
            ].map(({ token, val, label }) => (
              <div key={token} className="flex items-center gap-4">
                <span className="text-xs font-mono w-10 font-bold opacity-70">{token}</span>
                <div className="flex-1 flex items-center gap-3">
                  <div
                    className="h-4 bg-[var(--ds-primary)] rounded opacity-80"
                    style={{ width: val }}
                  />
                  <span className="text-[11px] font-mono opacity-60">{val} ({label})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Radius */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold tracking-widest uppercase opacity-60">3. Border Radius</h4>
          <div className="p-5 rounded-xl border border-white/10 bg-[var(--ds-surface)] grid grid-cols-3 gap-4" style={{ borderRadius: 'var(--ds-radius-md)' }}>
            {[
              { token: 'xs', val: r.xs },
              { token: 'sm', val: r.sm },
              { token: 'md', val: r.md },
              { token: 'lg', val: r.lg },
              { token: 'full', val: r.full },
            ].map(({ token, val }) => (
              <div
                key={token}
                className="h-20 border-2 border-[var(--ds-primary)] bg-[var(--ds-primary)]/10 flex flex-col items-center justify-center p-2 text-center"
                style={{ borderRadius: val }}
              >
                <span className="text-xs font-bold">{token}</span>
                <span className="text-[10px] font-mono opacity-70">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Shadows & Elevation */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h4 className="text-xs font-mono font-bold tracking-widest uppercase opacity-60">4. Elevation & Shadows</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div
            className="p-5 bg-[var(--ds-surface-elevated)] border border-[var(--ds-border)] flex flex-col items-center justify-center min-h-[100px] text-center"
            style={{
              boxShadow: sh.sm,
              borderRadius: 'var(--ds-radius-md)',
            }}
          >
            <span className="text-xs font-bold">Shadow SM</span>
            <span className="text-[10px] font-mono opacity-50 mt-1">{sh.sm}</span>
          </div>

          <div
            className="p-5 bg-[var(--ds-surface-elevated)] border border-[var(--ds-border)] flex flex-col items-center justify-center min-h-[100px] text-center"
            style={{
              boxShadow: sh.md,
              borderRadius: 'var(--ds-radius-md)',
            }}
          >
            <span className="text-xs font-bold">Shadow MD</span>
            <span className="text-[10px] font-mono opacity-50 mt-1">{sh.md}</span>
          </div>

          <div
            className="p-5 bg-[var(--ds-surface-elevated)] border border-[var(--ds-border)] flex flex-col items-center justify-center min-h-[100px] text-center"
            style={{
              boxShadow: sh.lg,
              borderRadius: 'var(--ds-radius-md)',
            }}
          >
            <span className="text-xs font-bold">Shadow LG</span>
            <span className="text-[10px] font-mono opacity-50 mt-1">{sh.lg}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
