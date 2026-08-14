'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { UNIVERSO_2D_DATA } from '@/data/universo-2d';
import { Zap, Cpu, Target, ShieldCheck, Code2, Globe2, Sparkles, CheckCircle2 } from 'lucide-react';

export function AboutSection() {
  const { theme } = useTheme();
  const { about } = UNIVERSO_2D_DATA;

  const iconMap: { [key: string]: React.ReactNode } = {
    Zap: <Zap className="w-5 h-5 transition-colors duration-500" style={{ color: theme.colors.primary }} />,
    Cpu: <Cpu className="w-5 h-5 text-cyan-400" />,
    Target: <Target className="w-5 h-5 text-emerald-400" />,
    ShieldCheck: <ShieldCheck className="w-5 h-5 text-teal-300" />,
  };

  return (
    <section id="manifesto" className="py-20 px-4 sm:px-6 relative border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-bold uppercase tracking-wider mb-3 transition-colors duration-500"
              style={{
                backgroundColor: `${theme.colors.primary}12`,
                borderColor: `${theme.colors.primary}40`,
                color: theme.colors.primary,
              }}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>02. QUEM SOMOS & MANIFESTO</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              A Engenharia por Trás do Crescimento
            </h2>
          </div>
          <p className="text-sm sm:text-base text-zinc-400 max-w-md font-mono">
            {about.subtitle}
          </p>
        </div>

        {/* Manifesto Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-white/10 shadow-2xl mb-12 relative overflow-hidden backdrop-blur-xl group">
          {/* Subtle Ambient Glow */}
          <div 
            className="absolute top-0 right-0 w-80 h-80 blur-[120px] rounded-full pointer-events-none opacity-20 transition-colors duration-700"
            style={{ backgroundColor: theme.colors.primary }}
          />
          
          {/* Ambient Global Edge Network Watermark */}
          <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-700 pointer-events-none overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/imgs/mapa-mundi-real-optimized.webp"
              alt="Global Edge Network Agência 47"
              className="w-full h-full object-cover object-center scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-zinc-950/90" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-2.5 h-2.5 rounded-full animate-pulse transition-colors duration-500"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <span 
                className="text-xs font-mono font-bold uppercase tracking-widest transition-colors duration-500"
                style={{ color: theme.colors.primary }}
              >
                Manifesto Agência 47
              </span>
            </div>

            <p className="text-base sm:text-lg text-zinc-200 leading-relaxed font-light mb-6">
              {about.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <CheckCircle2 
                  className="w-5 h-5 shrink-0 transition-colors duration-500" 
                  style={{ color: theme.colors.primary }}
                />
                <span className="text-xs sm:text-sm text-zinc-300 font-mono font-medium">
                  Zero código legado / Zero WordPress
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                <span className="text-xs sm:text-sm text-zinc-300 font-mono font-medium">
                  Next.js 15 & React 19 no Edge
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm text-zinc-300 font-mono font-medium">
                  Modelos de IA Google & Deep Learning
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid (Labs / Eco Bento Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {about.pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {iconMap[pillar.icon] || <Sparkles className="w-5 h-5" style={{ color: theme.colors.primary }} />}
                </div>
                <h3 
                  className="text-base font-bold text-white mb-2 transition-colors duration-300"
                >
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                  {pillar.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                PILAR 0{idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
