'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { UNIVERSO_2D_DATA } from '@/data/universo-2d';
import { GlobalBreadcrumb } from '@/components/ui/GlobalBreadcrumb';
import { 
  ArrowUpRight, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Sparkles,
  ArrowRight,
  Terminal,
  Activity
} from 'lucide-react';
import Link from 'next/link';

interface HeroSectionProps {
  onExploreClick: () => void;
  onDemoClick: () => void;
}

export function HeroSection({ onExploreClick, onDemoClick }: HeroSectionProps) {
  const { theme, themeContrast, themeName } = useTheme();
  const { brand } = UNIVERSO_2D_DATA;

  return (
    <section id="overview" className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 overflow-hidden">
      {/* Ambient Glow dinâmico acoplado ao tema ativo */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] blur-[140px] rounded-full pointer-events-none opacity-20 transition-all duration-700"
        style={{ backgroundColor: theme.colors.primary }}
      />
      <div 
        className="absolute top-1/3 right-10 w-[400px] h-[300px] blur-[130px] rounded-full pointer-events-none opacity-15 transition-all duration-700"
        style={{ backgroundColor: theme.colors.secondary || '#06b6d4' }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="flex justify-center mb-6">
          <GlobalBreadcrumb />
        </div>

        {/* Top Badges — Padrão Labs / Eco */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-md text-xs font-mono transition-all duration-500 shadow-sm"
            style={{
              backgroundColor: `${theme.colors.primary}12`,
              borderColor: `${theme.colors.primary}40`,
              color: theme.colors.primary,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-bold tracking-wider uppercase">AG47 LABS & ECOSYSTEM</span>
            <span className="opacity-40">•</span>
            <span className="text-zinc-300 font-normal">Universo 2D</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-400">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>Next.js 15 App Router</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-400">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Engenharia de Alta Conversão</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto mb-6">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] mb-6 uppercase">
            O Hub Definitivo de{' '}
            <span 
              className="transition-colors duration-500"
              style={{ color: theme.colors.primary }}
            >
              Engenharia Digital
            </span>
            , IA & Conversão
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-zinc-300 font-light leading-relaxed max-w-3xl mx-auto mb-6">
            Construímos websites ultra-rápidos em Next.js 15, aplicações SaaS escaláveis e agentes de inteligência artificial sob medida para multiplicar os resultados do seu negócio.
          </p>

          <div className="inline-block px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm font-mono text-zinc-400 backdrop-blur-md">
            {brand.mantra}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-10">
          <a
            href="https://wa.me/351912345678?text=Olá!%20Gostaria%20de%20solicitar%20um%20briefing%20estratégico%20com%20a%20Agência%2047."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl text-sm font-bold font-mono flex items-center gap-2 active:scale-95 transition-all duration-500 shadow-xl"
            style={{
              backgroundColor: theme.colors.primary,
              color: themeContrast || '#000000',
              boxShadow: `0 0 24px ${theme.colors.primary}40`,
            }}
          >
            <span>Solicitar Briefing Estratégico</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <button
            onClick={onExploreClick}
            className="px-5 py-3.5 rounded-xl text-sm font-mono text-zinc-200 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 flex items-center gap-2 active:scale-95 transition-all"
          >
            <Layers 
              className="w-4 h-4 transition-colors duration-500" 
              style={{ color: theme.colors.primary }}
            />
            <span>Explorar Serviços & Portfólio</span>
          </button>

          <button
            onClick={onDemoClick}
            className="px-5 py-3.5 rounded-xl text-sm font-mono text-zinc-300 hover:text-white bg-black/60 hover:bg-zinc-900 border border-white/10 flex items-center gap-2 active:scale-95 transition-all"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Motor de Engenharia</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
          </button>
        </div>

        {/* Hero Interactive Dashboard Visual Showcase */}
        <div className="max-w-5xl mx-auto mb-14 relative group">
          {/* Subtle Ambient Glow around Dashboard */}
          <div 
            className="absolute -inset-1 rounded-3xl opacity-30 blur-2xl transition-all duration-700 group-hover:opacity-60"
            style={{ backgroundColor: `${theme.colors.primary}30` }}
          />

          <div className="relative rounded-2xl sm:rounded-3xl bg-zinc-950/90 border border-white/15 overflow-hidden shadow-2xl backdrop-blur-2xl">
            {/* Top Browser / System Header */}
            <div className="px-4 py-3 bg-zinc-900/80 border-b border-white/10 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-zinc-400 ml-2 font-mono text-[11px] hidden sm:inline">ag47.pt/telemetry — live-engine</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  PROD ACTIVE
                </span>
                <span className="text-zinc-500 text-[11px] hidden md:inline">Edge: 310+ Nodes</span>
              </div>
            </div>

            {/* Dashboard Visual Frame */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/imgs/universo_hero_dashboard.webp"
                alt="Agência 47 Engineering Dashboard Telemetry"
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
              />

              {/* Gradient overlay on bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60 pointer-events-none" />

              {/* Floating Badges */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                <div className="px-3 py-1.5 rounded-xl bg-black/80 border border-white/15 backdrop-blur-md text-xs font-mono text-zinc-200 flex items-center gap-2 shadow-lg">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Next.js 15 App Router + Edge SSR</span>
                </div>
                <div 
                  className="px-3 py-1.5 rounded-xl border backdrop-blur-md text-xs font-mono font-bold flex items-center gap-2 shadow-lg"
                  style={{
                    backgroundColor: `${theme.colors.primary}20`,
                    borderColor: `${theme.colors.primary}60`,
                    color: theme.colors.primary,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>99% Core Web Vitals Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Metrics Strip (Labs Bento Format) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          {UNIVERSO_2D_DATA.heroMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all group"
            >
              <div 
                className="text-2xl sm:text-3xl font-black font-mono mb-1 transition-colors duration-500"
                style={{ color: theme.colors.primary }}
              >
                {metric.value}
              </div>
              <div className="text-xs font-bold text-zinc-200 mb-1">
                {metric.label}
              </div>
              <div className="text-[11px] text-zinc-500 font-light leading-snug">
                {metric.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
