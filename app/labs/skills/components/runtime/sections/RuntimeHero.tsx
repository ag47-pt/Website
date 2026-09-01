'use client';

import React from 'react';
import { NormalizedDesignSystem } from '@/lib/design-system/types';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Activity,
  Terminal,
  Clock,
  Star,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface RuntimeHeroProps {
  spec: NormalizedDesignSystem;
  themeMode: 'light' | 'dark';
}

export function RuntimeHero({ spec, themeMode }: RuntimeHeroProps) {
  const { presentation, demo_content, colors, radius, typography, spacing } = spec;
  const isDark = themeMode === 'dark';

  const primaryColor = isDark ? (colors.primary.dark_value || colors.primary.value) : colors.primary.value;
  const secondaryColor = isDark ? (colors.secondary.dark_value || colors.secondary.value) : colors.secondary.value;
  const surfaceColor = isDark ? (colors.surface.dark_value || colors.surface.value) : colors.surface.value;
  const surfaceElevated = isDark ? (colors.surface_elevated.dark_value || colors.surface_elevated.value) : colors.surface_elevated.value;
  const textPrimary = isDark ? (colors.text_primary.dark_value || colors.text_primary.value) : colors.text_primary.value;
  const textSecondary = isDark ? (colors.text_secondary.dark_value || colors.text_secondary.value) : colors.text_secondary.value;
  const textMuted = isDark ? (colors.text_muted.dark_value || colors.text_muted.value) : colors.text_muted.value;
  const borderColor = isDark ? (colors.border.dark_value || colors.border.value) : colors.border.value;

  const isSplit = presentation.hero_style === 'split';
  const isEditorial = presentation.hero_style === 'editorial' || presentation.archetype === 'editorial';
  const isCentered = presentation.hero_style === 'centered' || presentation.archetype === 'minimal';

  return (
    <section
      className="relative overflow-hidden py-16 md:py-24 border-b"
      style={{
        borderColor: borderColor,
        paddingTop: spacing.section_spacing || '80px',
        paddingBottom: spacing.section_spacing || '80px',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div
          className={`grid gap-12 items-center ${
            isSplit ? 'grid-cols-1 lg:grid-cols-12' : 'max-w-3xl mx-auto text-center'
          }`}
        >
          {/* Main Hero Column */}
          <div className={isSplit ? 'lg:col-span-7 space-y-6 text-left' : 'space-y-6'}>
            {/* Eyebrow Badge */}
            {demo_content.eyebrow && (
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1 text-xs font-bold uppercase tracking-wider border select-none ${
                  isCentered ? 'mx-auto' : ''
                }`}
                style={{
                  backgroundColor: `${primaryColor}15`,
                  borderColor: `${primaryColor}40`,
                  color: primaryColor,
                  borderRadius: radius.full || '999px',
                  fontFamily: typography.label?.font_family || typography.body.font_family,
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{demo_content.eyebrow}</span>
              </div>
            )}

            {/* Main Headline */}
            <h1
              className="font-bold tracking-tight leading-[1.08]"
              style={{
                color: textPrimary,
                fontFamily: typography.display.font_family,
                fontSize: 'clamp(32px, 5vw, 56px)',
                letterSpacing: typography.display.tracking || '-0.03em',
              }}
            >
              {demo_content.headline || demo_content.brand_name}
            </h1>

            {/* Sub-headline Description */}
            <p
              className="leading-relaxed"
              style={{
                color: textSecondary,
                fontFamily: typography.body.font_family,
                fontSize: typography.body.size || '16px',
                maxWidth: isSplit ? '95%' : '80%',
                margin: isCentered ? '0 auto' : undefined,
              }}
            >
              {demo_content.description || demo_content.tagline}
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-wrap items-center gap-4 pt-4 ${
                isCentered ? 'justify-center' : 'justify-start'
              }`}
            >
              <button
                className="inline-flex items-center gap-2.5 font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: primaryColor,
                  color: '#0A0A0A',
                  padding: spec.components.button_primary?.padding || '14px 28px',
                  borderRadius: radius.md || '12px',
                  fontFamily: typography.button.font_family || typography.body.font_family,
                  fontSize: typography.button.size || '14px',
                }}
              >
                <span>{demo_content.cta_primary || 'Começar Agora'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {demo_content.cta_secondary && (
                <button
                  className="inline-flex items-center gap-2 font-semibold border transition-all hover:opacity-90 active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: surfaceElevated,
                    borderColor: borderColor,
                    color: textPrimary,
                    padding: spec.components.button_secondary?.padding || '14px 24px',
                    borderRadius: radius.md || '12px',
                    fontFamily: typography.button.font_family || typography.body.font_family,
                    fontSize: typography.button.size || '14px',
                  }}
                >
                  <span>{demo_content.cta_secondary}</span>
                </button>
              )}
            </div>

            {/* Trust / Social Proof Sub-bar */}
            <div
              className={`flex items-center gap-6 pt-4 text-xs ${
                isCentered ? 'justify-center' : 'justify-start'
              }`}
              style={{ color: textMuted }}
            >
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4" style={{ color: primaryColor }} />
                <span>Zero Latência</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" style={{ color: primaryColor }} />
                <span>100% Determinístico</span>
              </div>
            </div>
          </div>

          {/* Right Column / Interactive Mockup Showcase */}
          {isSplit && (
            <div className="lg:col-span-5">
              {/* SaaS Terminal & Neural Audio Simulation */}
              {presentation.archetype === 'saas' && (
                <div
                  className="border p-6 shadow-2xl space-y-4"
                  style={{
                    backgroundColor: surfaceColor,
                    borderColor: borderColor,
                    borderRadius: radius.lg || '18px',
                  }}
                >
                  {/* Mock Window Header */}
                  <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: borderColor }}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <div
                      className="text-[11px] font-mono font-bold px-2 py-0.5 border rounded"
                      style={{
                        color: primaryColor,
                        borderColor: `${primaryColor}40`,
                        backgroundColor: `${primaryColor}10`,
                      }}
                    >
                      LIVE NODE · 0.08ms
                    </div>
                  </div>

                  {/* Neural Audio / Synthesizer Waveform Visual */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span style={{ color: textSecondary }}>VOICE_SYNTHESIS: Active</span>
                      <span style={{ color: primaryColor }}>48.0 kHz · FLAC</span>
                    </div>

                    <div
                      className="h-20 flex items-center justify-between gap-1 p-3 border rounded-xl"
                      style={{ backgroundColor: surfaceElevated, borderColor: borderColor }}
                    >
                      {[40, 75, 90, 45, 80, 100, 60, 30, 85, 95, 50, 70, 90, 65, 40, 85, 95, 30, 60, 80].map((h, i) => (
                        <div
                          key={i}
                          className="w-1.5 transition-all duration-300 rounded-full"
                          style={{
                            height: `${h}%`,
                            backgroundColor: i % 3 === 0 ? primaryColor : secondaryColor,
                            opacity: 0.85,
                          }}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-3 border rounded-xl" style={{ borderColor: borderColor, backgroundColor: surfaceElevated }}>
                        <span className="text-[10px] uppercase font-mono block" style={{ color: textMuted }}>LATENCY</span>
                        <span className="text-sm font-bold font-mono" style={{ color: textPrimary }}>74 ms</span>
                      </div>
                      <div className="p-3 border rounded-xl" style={{ borderColor: borderColor, backgroundColor: surfaceElevated }}>
                        <span className="text-[10px] uppercase font-mono block" style={{ color: textMuted }}>MOS SCORE</span>
                        <span className="text-sm font-bold font-mono" style={{ color: primaryColor }}>4.92 / 5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Restaurant Culinary Highlight Card */}
              {presentation.archetype === 'restaurant' && (
                <div
                  className="border p-6 shadow-2xl space-y-4"
                  style={{
                    backgroundColor: surfaceColor,
                    borderColor: borderColor,
                    borderRadius: radius.lg || '18px',
                  }}
                >
                  <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: borderColor }}>
                    <span className="text-xs font-bold tracking-wider uppercase" style={{ color: primaryColor }}>
                      ★ ESPECIAL DO DIA
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>4.9 (184 avaliações)</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold" style={{ color: textPrimary, fontFamily: typography.h3?.font_family }}>
                      Polvo Grelhado com Emulsão Cítrica
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: textSecondary }}>
                      Tentáculos crocantes acompanhados de purê de batata-doce roxa e azeite perfumado com ervas da serra.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-[10px] uppercase block" style={{ color: textMuted }}>PREÇO</span>
                      <span className="text-2xl font-bold font-mono" style={{ color: primaryColor }}>€ 24.50</span>
                    </div>
                    <button
                      className="px-4 py-2 text-xs font-bold border"
                      style={{
                        backgroundColor: primaryColor,
                        color: '#0A0A0A',
                        borderRadius: radius.sm || '8px',
                      }}
                    >
                      Reservar Mesa
                    </button>
                  </div>
                </div>
              )}

              {/* Fintech Liquidity Ledger Card */}
              {presentation.archetype === 'fintech' && (
                <div
                  className="border p-6 shadow-2xl space-y-4 font-mono"
                  style={{
                    backgroundColor: surfaceColor,
                    borderColor: borderColor,
                    borderRadius: radius.lg || '18px',
                  }}
                >
                  <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: borderColor }}>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" style={{ color: primaryColor }} />
                      <span className="text-xs font-bold" style={{ color: textPrimary }}>PORTFÓLIO INSTITUCIONAL</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">
                      AUDITADO
                    </span>
                  </div>

                  <div className="p-4 border rounded-xl space-y-1" style={{ backgroundColor: surfaceElevated, borderColor: borderColor }}>
                    <span className="text-[10px] uppercase" style={{ color: textMuted }}>SALDO TOTAL CUSTODIADO</span>
                    <div className="text-2xl font-bold" style={{ color: textPrimary }}>€ 14,892,400.00</div>
                    <div className="text-xs text-emerald-400 font-semibold">+8.42% no trimestre</div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b" style={{ borderColor: borderColor }}>
                      <span style={{ color: textSecondary }}>Custódia Segregada</span>
                      <span style={{ color: textPrimary }}>100% MPC Co-Sign</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b" style={{ borderColor: borderColor }}>
                      <span style={{ color: textSecondary }}>Liquidação Média</span>
                      <span style={{ color: primaryColor }}>340 ms</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Commerce Showcase Card */}
              {presentation.archetype === 'commerce' && (
                <div
                  className="border p-6 shadow-2xl space-y-4"
                  style={{
                    backgroundColor: surfaceColor,
                    borderColor: borderColor,
                    borderRadius: radius.lg || '18px',
                  }}
                >
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-xs font-bold px-2.5 py-1 text-white uppercase rounded-full" style={{ backgroundColor: secondaryColor }}>
                      NOVA COLEÇÃO
                    </span>
                    <span className="text-xs font-semibold" style={{ color: textMuted }}>Edição 2026</span>
                  </div>

                  <div
                    className="h-44 border rounded-xl flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: surfaceElevated, borderColor: borderColor }}
                  >
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center font-bold text-lg" style={{ backgroundColor: primaryColor, color: '#0A0A0A' }}>
                        ★
                      </div>
                      <span className="text-xs font-bold block" style={{ color: textPrimary }}>Luminária Arc Minimal</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-xl font-bold font-mono" style={{ color: primaryColor }}>€ 189.00</span>
                      <span className="text-xs line-through ml-2" style={{ color: textMuted }}>€ 240.00</span>
                    </div>
                    <button
                      className="px-4 py-2 text-xs font-bold"
                      style={{
                        backgroundColor: primaryColor,
                        color: '#0A0A0A',
                        borderRadius: radius.full || '999px',
                      }}
                    >
                      Adicionar à Sacola
                    </button>
                  </div>
                </div>
              )}

              {/* Generic/Editorial Right Column */}
              {(presentation.archetype === 'editorial' || presentation.archetype === 'service' || presentation.archetype === 'generic') && (
                <div
                  className="border p-6 shadow-2xl space-y-4"
                  style={{
                    backgroundColor: surfaceColor,
                    borderColor: borderColor,
                    borderRadius: radius.lg || '18px',
                  }}
                >
                  <span className="text-xs font-bold font-mono uppercase" style={{ color: primaryColor }}>
                    MANIFESTO DE ENGENHARIA
                  </span>
                  <blockquote
                    className="text-sm italic leading-relaxed border-l-2 pl-4"
                    style={{ color: textPrimary, borderColor: primaryColor }}
                  >
                    "Um Design System é um contrato rigoroso onde cada espaçamento, hierarquia tipográfica e intenção visual ganham vida de forma determinística."
                  </blockquote>
                  <div className="pt-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: secondaryColor, color: '#FFFFFF' }}>
                      47
                    </div>
                    <div>
                      <span className="text-xs font-bold block" style={{ color: textPrimary }}>Agência 47 Labs</span>
                      <span className="text-[10px]" style={{ color: textMuted }}>Laboratório de Design e Engenharia</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
