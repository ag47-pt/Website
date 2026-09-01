'use client';

import React from 'react';
import { NormalizedDesignSystem } from '@/lib/design-system/types';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

interface RuntimePricingProps {
  spec: NormalizedDesignSystem;
  themeMode: 'light' | 'dark';
}

export function RuntimePricing({ spec, themeMode }: RuntimePricingProps) {
  const { colors, radius, typography, spacing } = spec;
  const isDark = themeMode === 'dark';

  const primaryColor = isDark ? (colors.primary.dark_value || colors.primary.value) : colors.primary.value;
  const secondaryColor = isDark ? (colors.secondary.dark_value || colors.secondary.value) : colors.secondary.value;
  const surfaceColor = isDark ? (colors.surface.dark_value || colors.surface.value) : colors.surface.value;
  const surfaceElevated = isDark ? (colors.surface_elevated.dark_value || colors.surface_elevated.value) : colors.surface_elevated.value;
  const textPrimary = isDark ? (colors.text_primary.dark_value || colors.text_primary.value) : colors.text_primary.value;
  const textSecondary = isDark ? (colors.text_secondary.dark_value || colors.text_secondary.value) : colors.text_secondary.value;
  const textMuted = isDark ? (colors.text_muted.dark_value || colors.text_muted.value) : colors.text_muted.value;
  const borderColor = isDark ? (colors.border.dark_value || colors.border.value) : colors.border.value;

  const plans = [
    {
      name: 'Starter Developer',
      price: '€ 0',
      period: '/mês',
      desc: 'Ideal para experimentação e prototipagem local de produtos.',
      features: ['Até 5.000 requisições / mês', '1 Projeto ativo', 'Exportação de tokens CSS', 'Suporte comunitário'],
      cta: 'Começar Grátis',
      highlight: false,
    },
    {
      name: 'Professional Pro',
      price: '€ 49',
      period: '/mês',
      desc: 'Para equipes e produtos em produção com tráfego contínuo.',
      features: [
        'Até 500.000 requisições / mês',
        'Projetos ilimitados',
        'Exportação Tailwind & Shadcn',
        'Latência garantida sub-100ms',
        'Suporte prioritário 24/7',
      ],
      cta: 'Assinar Plano Pro',
      highlight: true,
    },
    {
      name: 'Enterprise Custom',
      price: 'Sob Consulta',
      period: '',
      desc: 'Infraestrutura dedicada, SLAs contratuais e suporte arquitetural.',
      features: [
        'Volume ilimitado com isolamento VPC',
        'SSO corporativo & SAML',
        'Modelos acústicos dedicados',
        'Engenheiro de soluções dedicado',
      ],
      cta: 'Falar com Vendas',
      highlight: false,
    },
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
        {/* Section Heading */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-wider border select-none mx-auto"
            style={{
              backgroundColor: `${primaryColor}10`,
              borderColor: `${primaryColor}30`,
              color: primaryColor,
              borderRadius: radius.full || '999px',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>PLANOS E PREÇOS</span>
          </div>

          <h2
            className="text-2xl md:text-4xl font-bold tracking-tight"
            style={{
              color: textPrimary,
              fontFamily: typography.h2.font_family,
            }}
          >
            Transparência Total sem Custos Ocultos
          </h2>

          <p className="text-sm md:text-base leading-relaxed" style={{ color: textSecondary }}>
            Escolha o nível de capacidade que melhor atende à escala da sua operação.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`p-8 border flex flex-col justify-between space-y-6 relative transition-all ${
                p.highlight ? 'ring-2 shadow-xl' : ''
              }`}
              style={{
                backgroundColor: p.highlight ? surfaceElevated : surfaceColor,
                borderColor: p.highlight ? primaryColor : borderColor,
                borderRadius: radius.lg || '18px',
              }}
            >
              {p.highlight && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 text-[11px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: primaryColor,
                    color: '#0A0A0A',
                    borderRadius: radius.full || '999px',
                  }}
                >
                  MAIS POPULAR
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold" style={{ color: textPrimary }}>
                    {p.name}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: textSecondary }}>
                    {p.desc}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 py-2">
                  <span
                    className="text-3xl md:text-4xl font-bold font-mono tracking-tight"
                    style={{ color: textPrimary }}
                  >
                    {p.price}
                  </span>
                  <span className="text-xs" style={{ color: textMuted }}>
                    {p.period}
                  </span>
                </div>

                <div className="space-y-2.5 pt-4 border-t" style={{ borderColor: borderColor }}>
                  {p.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-2.5 text-xs" style={{ color: textSecondary }}>
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: primaryColor }} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  className="w-full inline-flex items-center justify-center gap-2 py-3 text-xs md:text-sm font-bold transition-transform active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: p.highlight ? primaryColor : surfaceElevated,
                    color: p.highlight ? '#0A0A0A' : textPrimary,
                    borderColor: borderColor,
                    borderWidth: p.highlight ? 0 : '1px',
                    borderRadius: radius.md || '12px',
                  }}
                >
                  <span>{p.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
