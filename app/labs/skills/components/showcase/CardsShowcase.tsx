'use client';

import React from 'react';
import { NormalizedDesignSystem } from '@/lib/design-system/types';
import { Sparkles, ArrowUpRight, Star } from 'lucide-react';

interface CardsShowcaseProps {
  spec: NormalizedDesignSystem;
}

export function CardsShowcase({ spec }: CardsShowcaseProps) {
  const cardBasic = spec.components['card.basic'];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold tracking-tight mb-2">Bancada de Cards & Contêineres</h3>
        <p className="text-sm opacity-70">
          Superfícies de cards aplicadas com tokens de padding, border radius, elevação e micro-interações de hover.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Basic Content Card */}
        <div
          className="p-6 border border-[var(--ds-border)] bg-[var(--ds-surface)] flex flex-col justify-between transition-all hover:border-[var(--ds-primary)]/50"
          style={{
            borderRadius: cardBasic?.radius || 'var(--ds-radius-lg)',
            boxShadow: 'var(--ds-shadow-sm)',
          }}
        >
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--ds-primary)]/10 text-[var(--ds-primary)] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-[var(--ds-text-primary)]">Card Informativo</h4>
            <p className="text-xs text-[var(--ds-text-secondary)] leading-relaxed">
              Superfície limpa para exibição de recursos, métricas ou metadados da aplicação com bordas e contrastes refinados.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-[var(--ds-border)] flex items-center justify-between text-[11px] text-[var(--ds-text-muted)] font-mono">
            <span>STATUS: ATIVO</span>
            <span>TOKEN: card.basic</span>
          </div>
        </div>

        {/* 2. Interactive Product / Dish Card */}
        <div
          className="p-6 border border-[var(--ds-border)] bg-[var(--ds-surface)] flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group"
          style={{
            borderRadius: cardBasic?.radius || 'var(--ds-radius-lg)',
            boxShadow: 'var(--ds-shadow-md)',
          }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-[var(--ds-accent)]/15 text-[var(--ds-accent)]">
                Especial do Chef
              </span>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>4.9</span>
              </div>
            </div>

            <div>
              <h4 className="text-base font-bold text-[var(--ds-text-primary)] group-hover:text-[var(--ds-primary)] transition-colors">
                Risotto de Trufas Negras
              </h4>
              <p className="text-xs text-[var(--ds-text-secondary)] mt-1 line-clamp-2">
                Arroz carnaroli, cogumelos porcini frescos, azeite trufado e lascas de parmesão reggiano 24 meses.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[var(--ds-border)] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[var(--ds-text-muted)] block font-mono">VALOR</span>
              <span className="text-base font-extrabold text-[var(--ds-text-primary)]">€ 24.50</span>
            </div>
            <button
              className="px-3.5 py-1.5 text-xs font-bold bg-[var(--ds-primary)] text-[var(--ds-bg)] rounded-lg flex items-center gap-1 shadow-sm hover:brightness-110 transition-all"
              style={{ borderRadius: 'var(--ds-radius-sm)' }}
            >
              <span>Pedir</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 3. Metric / Summary Card */}
        <div
          className="p-6 border border-[var(--ds-border)] bg-[var(--ds-surface-elevated)] flex flex-col justify-between"
          style={{
            borderRadius: cardBasic?.radius || 'var(--ds-radius-lg)',
            boxShadow: 'var(--ds-shadow-lg)',
          }}
        >
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--ds-text-muted)]">Performance Geral</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[var(--ds-text-primary)] tracking-tight">99.8%</span>
              <span className="text-xs font-bold text-[var(--ds-success)]">+4.2%</span>
            </div>
            <p className="text-xs text-[var(--ds-text-secondary)]">Disponibilidade e velocidade média de resposta do motor.</p>
          </div>

          <div className="w-full bg-[var(--ds-border)] h-1.5 rounded-full overflow-hidden mt-6">
            <div className="bg-[var(--ds-primary)] h-full w-[94%]" />
          </div>
        </div>
      </div>
    </div>
  );
}
