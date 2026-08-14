'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { UNIVERSO_2D_DATA, PricingTier } from '@/data/universo-2d';
import { 
  Check, 
  Sparkles, 
  ArrowUpRight, 
  ShieldCheck, 
  DollarSign, 
  Zap,
  Layers
} from 'lucide-react';

export function PricingSection() {
  const { theme, themeContrast } = useTheme();
  const { pricingTiers } = UNIVERSO_2D_DATA;
  const [pricingMode, setPricingMode] = useState<'project' | 'monthly'>('project');

  return (
    <section id="precos" className="py-20 px-4 sm:px-6 relative border-t border-white/10 bg-black/40">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-bold uppercase tracking-wider mb-3 transition-colors duration-500"
            style={{
              backgroundColor: `${theme.colors.primary}12`,
              borderColor: `${theme.colors.primary}40`,
              color: theme.colors.primary,
            }}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>07. PREÇOS & INVESTIMENTO TRANSPARENTE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4 uppercase">
            Investimento Claro. Retorno Mensurável.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-mono">
            Zero taxas ocultas. 100% de propriedade do código-fonte e infraestrutura em seu nome.
          </p>

          {/* Pricing Mode Switcher */}
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-white/5 border border-white/10 mt-6 shadow-inner backdrop-blur-xl">
            <button
              onClick={() => setPricingMode('project')}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all font-semibold ${
                pricingMode === 'project'
                  ? 'font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
              style={
                pricingMode === 'project'
                  ? {
                      backgroundColor: theme.colors.primary,
                      color: themeContrast || '#000000',
                      boxShadow: `0 0 14px ${theme.colors.primary}35`,
                    }
                  : {}
              }
            >
              Projeto Completo (Setup & Entrega)
            </button>
            <button
              onClick={() => setPricingMode('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all font-semibold ${
                pricingMode === 'monthly'
                  ? 'font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
              style={
                pricingMode === 'monthly'
                  ? {
                      backgroundColor: theme.colors.primary,
                      color: themeContrast || '#000000',
                      boxShadow: `0 0 14px ${theme.colors.primary}35`,
                    }
                  : {}
              }
            >
              Recorrência & Evolução Mensal
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {pricingTiers.map((tier) => {
            const displayPrice = pricingMode === 'project' ? tier.priceProject : (tier.priceMonthly || tier.priceProject);
            const periodText = pricingMode === 'project' ? 'pagamento único' : 'por mês';

            return (
              <div
                key={tier.id}
                className={`p-6 rounded-3xl bg-zinc-950/80 border transition-all duration-300 flex flex-col justify-between relative overflow-hidden group shadow-2xl backdrop-blur-xl ${
                  tier.isPopular
                    ? 'border-white/20'
                    : 'border-white/10 hover:border-white/20'
                }`}
                style={
                  tier.isPopular
                    ? {
                        borderColor: `${theme.colors.primary}60`,
                        boxShadow: `0 0 30px ${theme.colors.primary}20`,
                      }
                    : {}
                }
              >
                {/* Popular Glow Accent */}
                {tier.isPopular && (
                  <div 
                    className="absolute top-0 right-0 left-0 h-1 transition-colors duration-500" 
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                )}

                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span 
                      className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border transition-colors duration-500"
                      style={
                        tier.isPopular
                          ? {
                              backgroundColor: `${theme.colors.primary}20`,
                              color: theme.colors.primary,
                              borderColor: `${theme.colors.primary}40`,
                            }
                          : {
                              backgroundColor: 'rgba(255,255,255,0.05)',
                              color: '#a1a1aa',
                              borderColor: 'rgba(255,255,255,0.1)',
                            }
                      }
                    >
                      {tier.badge}
                    </span>
                  </div>

                  {/* Name & Tagline */}
                  <h3 className="text-lg font-bold text-white mb-1">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed mb-4 min-h-[36px]">
                    {tier.tagline}
                  </p>

                  {/* Price */}
                  <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div 
                      className="text-2xl sm:text-3xl font-black font-mono tracking-tight transition-colors duration-500"
                      style={{ color: tier.isPopular ? theme.colors.primary : '#ffffff' }}
                    >
                      {displayPrice}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-500 mt-0.5">
                      {periodText} • {tier.targetAudience}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 mb-6">
                    <div className="text-[11px] font-mono uppercase font-bold text-zinc-400 tracking-wider">
                      O que está incluído:
                    </div>
                    {tier.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 font-light leading-snug">
                        <Check 
                          className="w-3.5 h-3.5 shrink-0 mt-0.5 transition-colors duration-500" 
                          style={{ color: theme.colors.primary }}
                        />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href={tier.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                  style={
                    tier.isPopular
                      ? {
                          backgroundColor: theme.colors.primary,
                          color: themeContrast || '#000000',
                          boxShadow: `0 0 16px ${theme.colors.primary}35`,
                        }
                      : {
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          color: '#ffffff',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }
                  }
                >
                  <span>{tier.ctaText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Security & Warranty Banner */}
        <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors duration-500"
              style={{
                backgroundColor: `${theme.colors.primary}15`,
                borderColor: `${theme.colors.primary}30`,
                color: theme.colors.primary,
              }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Garantia de Performance & SLA Contratual</h4>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Pontuação mínima de 90+ no Google PageSpeed garantida em contrato ou o seu dinheiro de volta.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/351912345678?text=Olá!%20Gostaria%20de%20tirar%20dúvidas%20sobre%20os%20planos%20da%20Agência%2047."
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-zinc-300 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 transition-colors shrink-0"
          >
            Falar com Consultor
          </a>
        </div>
      </div>
    </section>
  );
}
