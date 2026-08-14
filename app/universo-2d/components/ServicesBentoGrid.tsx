'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { UNIVERSO_2D_DATA, ServiceItem } from '@/data/universo-2d';
import { 
  Globe, 
  Layers, 
  Sparkles, 
  TrendingUp, 
  Brain, 
  Check, 
  ArrowUpRight, 
  Clock, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface SpotlightServiceCardProps {
  service: ServiceItem;
  accent: string;
  icon: React.ReactNode;
  isLarge?: boolean;
}

function SpotlightServiceCard({ service, accent, icon, isLarge }: SpotlightServiceCardProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`p-6 sm:p-7 rounded-3xl bg-zinc-950/80 border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between group shadow-xl relative overflow-hidden backdrop-blur-xl ${
        isLarge ? 'lg:col-span-1' : ''
      }`}
    >
      {/* Dynamic Cursor Follower Spotlight Radial Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isHovered
            ? `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, ${accent}25, transparent 75%)`
            : 'none',
        }}
      />
      {/* Cursor Follower Border Shimmer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          border: `1px solid ${accent}60`,
          maskImage: isHovered
            ? `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent 80%)`
            : 'none',
          WebkitMaskImage: isHovered
            ? `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent 80%)`
            : 'none',
        }}
      />

      {/* Top static ambient glow accent */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 pointer-events-none group-hover:opacity-25 transition-opacity"
        style={{ backgroundColor: accent }}
      />

      <div className="relative z-10">
        {/* Visual Service Preview Banner */}
        {service.imageUrl && (
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-5 border border-white/10 bg-black/60 group/img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={service.imageUrl}
              alt={service.title}
              className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none" />

            {/* Top floating pill */}
            <div className="absolute top-2.5 left-2.5">
              <span 
                className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border backdrop-blur-md transition-colors duration-500 shadow-md"
                style={{
                  color: accent,
                  borderColor: `${accent}50`,
                  backgroundColor: 'rgba(0,0,0,0.75)'
                }}
              >
                {service.tag}
              </span>
            </div>

            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 text-[10px] font-mono text-zinc-300 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-white/10">
              <Clock className="w-3 h-3 text-zinc-400" />
              <span>{service.deliveryTime}</span>
            </div>
          </div>
        )}

        {/* Title & Icon */}
        <div className="flex items-start gap-3 mb-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-500 group-hover:scale-105"
            style={{
              backgroundColor: `${accent}12`,
              borderColor: `${accent}30`,
              color: accent
            }}
          >
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors leading-tight">
              {service.title}
            </h3>
            <div className="text-xs font-mono text-zinc-400 mt-1">
              {service.headline}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed mb-5">
          {service.description}
        </p>

        {/* Features List */}
        <div className="space-y-2 mb-6">
          {service.features.map((feat, fIdx) => (
            <div key={fIdx} className="flex items-start gap-2 text-xs text-zinc-300 font-light leading-snug">
              <Check 
                className="w-3.5 h-3.5 shrink-0 mt-0.5 transition-colors duration-500" 
                style={{ color: accent }}
              />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Banner & CTA */}
      <div className="relative z-10">
        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 mb-4">
          {service.metrics.map((m, mIdx) => (
            <div key={mIdx} className="text-center">
              <div 
                className="text-xs sm:text-sm font-bold font-mono transition-colors duration-500"
                style={{ color: accent }}
              >
                {m.value}
              </div>
              <div className="text-[9px] font-mono text-zinc-500 leading-tight">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        <a
          href="https://wa.me/351912345678?text=Olá!%20Gostaria%20de%20solicitar%20uma%20proposta%20para%20este%20serviço."
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 rounded-xl bg-white/5 group-hover:bg-white/10 border border-white/10 group-hover:border-white/20 text-xs font-mono font-bold text-zinc-200 flex items-center justify-between transition-all"
        >
          <span>Solicitar Proposta Sob Medida</span>
          <ArrowUpRight 
            className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
            style={{ color: accent }}
          />
        </a>
      </div>
    </div>
  );
}

export function ServicesBentoGrid() {
  const { theme } = useTheme();
  const { services } = UNIVERSO_2D_DATA;

  const iconMap: { [key: string]: React.ReactNode } = {
    Globe: <Globe className="w-5 h-5" />,
    Layers: <Layers className="w-5 h-5" />,
    Sparkles: <Sparkles className="w-5 h-5" />,
    TrendingUp: <TrendingUp className="w-5 h-5" />,
    Brain: <Brain className="w-5 h-5" />,
  };

  return (
    <section id="servicos" className="py-20 px-4 sm:px-6 relative border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-bold uppercase tracking-wider mb-3 transition-colors duration-500"
              style={{
                backgroundColor: `${theme.colors.primary}12`,
                borderColor: `${theme.colors.primary}40`,
                color: theme.colors.primary,
              }}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>04. SERVIÇOS ESPECIALIZADOS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              Soluções Construídas para Escala Máxima
            </h2>
          </div>
          <p className="text-sm sm:text-base text-zinc-400 max-w-md font-mono">
            Cada serviço é executado com foco cirúrgico em retorno sobre o investimento, velocidade técnica e sustentabilidade.
          </p>
        </div>

        {/* Bento Grid (Labs / Eco Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, idx) => {
            const isLarge = idx === 0 || idx === 1;
            const accent = idx === 0 ? theme.colors.primary : idx === 1 ? (theme.colors.secondary || '#06b6d4') : idx === 2 ? theme.colors.primary : '#10b981';

            return (
              <SpotlightServiceCard
                key={service.id}
                service={service}
                accent={accent}
                icon={iconMap[service.iconName] || <Layers className="w-5 h-5" />}
                isLarge={isLarge}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
