'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { UNIVERSO_2D_DATA, PortfolioProject } from '@/data/universo-2d';
import { 
  Layers, 
  ExternalLink, 
  Sparkles, 
  ArrowUpRight, 
  Activity, 
  Filter,
  Flame,
  LayoutGrid,
  Eye,
  X,
  Maximize2,
  RefreshCw,
  Globe2,
  CheckCircle2,
  Cpu
} from 'lucide-react';

interface SpotlightPortfolioCardProps {
  project: PortfolioProject;
  openPreview: (project: PortfolioProject) => void;
}

function SpotlightPortfolioCard({ project, openPreview }: SpotlightPortfolioCardProps) {
  const { theme } = useTheme();
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
      className="p-6 rounded-3xl bg-zinc-950/80 border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between group shadow-xl relative overflow-hidden backdrop-blur-xl"
    >
      {/* Dynamic Cursor Follower Spotlight Radial Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isHovered
            ? `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, ${theme.colors.primary}22, transparent 75%)`
            : 'none',
        }}
      />
      {/* Cursor Follower Border Shimmer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          border: `1px solid ${theme.colors.primary}60`,
          maskImage: isHovered
            ? `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent 80%)`
            : 'none',
          WebkitMaskImage: isHovered
            ? `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent 80%)`
            : 'none',
        }}
      />

      <div className="relative z-10">
        {/* Visual Project Thumbnail Banner */}
        {project.imageUrl && (
          <div 
            onClick={() => openPreview(project)}
            className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-5 border border-white/10 bg-black/80 group/pimg cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover object-center group-hover/pimg:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent pointer-events-none" />

            {/* Quick Preview Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/pimg:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="px-3 py-1.5 rounded-xl bg-black/80 border border-white/20 text-xs font-mono text-white flex items-center gap-1.5 backdrop-blur-md shadow-xl">
                <Eye className="w-3.5 h-3.5" style={{ color: theme.colors.primary }} />
                <span>Abrir Prévia Live</span>
              </div>
            </div>

            {/* Top Floating Badge */}
            <div className="absolute top-2.5 left-2.5">
              <span 
                className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border backdrop-blur-md transition-colors duration-500 shadow-md"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.75)',
                  borderColor: `${theme.colors.primary}50`,
                  color: theme.colors.primary,
                }}
              >
                {project.badgeText}
              </span>
            </div>

            {/* Bottom Right Metric */}
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 text-[10px] font-mono text-zinc-200 px-2.5 py-0.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10">
              <span className="text-zinc-400">{project.featuredMetric.label}:</span>
              <span className="font-bold" style={{ color: theme.colors.primary }}>
                {project.featuredMetric.value}
              </span>
            </div>
          </div>
        )}

        {/* Title & Subtitle */}
        <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors mb-1 leading-snug">
          {project.title}
        </h3>
        <p className="text-xs font-mono text-cyan-400 mb-3">
          {project.subtitle}
        </p>

        {/* Description */}
        <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed mb-5">
          {project.description}
        </p>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.techStack.map((tech, tIdx) => (
            <span
              key={tIdx}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons: Live Preview + Direct Link */}
      <div className="relative z-10 pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
        <button
          onClick={() => openPreview(project)}
          className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-mono font-medium text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          title="Pré-visualizar ao vivo no modal"
        >
          <Eye 
            className="w-3.5 h-3.5 transition-colors duration-500" 
            style={{ color: theme.colors.primary }}
          />
          <span>Prévia Live</span>
        </button>

        <Link
          href={project.path}
          className="py-2.5 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
          style={{
            backgroundColor: `${theme.colors.primary}18`,
            border: `1px solid ${theme.colors.primary}40`,
            color: theme.colors.primary,
          }}
        >
          <span>Abrir App</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export function PortfolioShowcase() {
  const { theme, themeContrast } = useTheme();
  const { portfolio } = UNIVERSO_2D_DATA;
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [previewProject, setPreviewProject] = useState<PortfolioProject | null>(null);
  const [iframeLoading, setIframeLoading] = useState<boolean>(true);

  const categories = [
    { id: 'all', label: 'Todos os Projetos' },
    { id: 'ai_engine', label: 'IA & Engines' },
    { id: 'fintech', label: 'Fintech & Quant' },
    { id: 'hospitality', label: 'Hospitality Tech' },
    { id: 'editorial', label: 'Editorial & Growth' },
    { id: 'core', label: 'Core Platform' },
  ];

  const filteredProjects = activeCategory === 'all'
    ? portfolio
    : portfolio.filter((p) => p.category === activeCategory);

  // Close preview on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewProject(null);
      }
    };
    if (previewProject) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [previewProject]);

  const openPreview = (project: PortfolioProject) => {
    setIframeLoading(true);
    setPreviewProject(project);
  };

  return (
    <section id="portfolio" className="py-20 px-4 sm:px-6 relative border-t border-white/10 bg-black/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-bold uppercase tracking-wider mb-3 transition-colors duration-500"
              style={{
                backgroundColor: `${theme.colors.primary}12`,
                borderColor: `${theme.colors.primary}40`,
                color: theme.colors.primary,
              }}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>05. PORTFÓLIO & ECOSSISTEMA VIVO</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              Sistemas e Produtos em Produção
            </h2>
          </div>
          <p className="text-sm sm:text-base text-zinc-400 max-w-md font-mono">
            Explore aplicações reais desenvolvidas com a nossa infraestrutura e disponíveis para teste imediato.
          </p>
        </div>

        {/* Category Filter Tabs (Labs / Eco Style) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'font-bold shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
                style={
                  activeCategory === cat.id
                    ? {
                        backgroundColor: theme.colors.primary,
                        color: themeContrast || '#000000',
                        boxShadow: `0 0 14px ${theme.colors.primary}35`,
                      }
                    : {}
                }
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid with Cursor Spotlight Follower */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <SpotlightPortfolioCard
              key={project.id}
              project={project}
              openPreview={openPreview}
            />
          ))}
        </div>
      </div>

      {/* Interactive Live Embed Preview Modal */}
      {previewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-5xl h-[88vh] bg-zinc-950 border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl animate-in zoom-in-95 duration-200"
            style={{
              boxShadow: `0 0 50px ${theme.colors.primary}25`,
            }}
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-zinc-900/90 border-b border-white/10 text-xs font-mono">
              {/* Left: Traffic light dots & live tag */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="hidden sm:flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-zinc-300">
                  <Globe2 className="w-3 h-3 text-cyan-400" />
                  <span className="truncate max-w-[240px]">ag47.pt{previewProject.path}</span>
                </div>
              </div>

              {/* Center: Title */}
              <div className="text-center font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                {previewProject.title}
              </div>

              {/* Right: Refresh, Fullscreen Link & Close */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIframeLoading(true);
                    const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
                    if (iframe) iframe.src = iframe.src;
                  }}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                  title="Recarregar Pré-visualização"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                <Link
                  href={previewProject.path}
                  target="_blank"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all shadow-sm"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: themeContrast || '#000000',
                  }}
                >
                  <span>Abrir em Nova Aba</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => setPreviewProject(null)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors"
                  title="Fechar Prévia (ESC)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Iframe Viewport Container */}
            <div className="relative flex-1 bg-black overflow-hidden flex flex-col">
              {iframeLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950 gap-3">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                    style={{
                      borderColor: `${theme.colors.primary}30`,
                      borderTopColor: theme.colors.primary,
                    }}
                  />
                  <div className="text-xs font-mono text-zinc-400">
                    Carregando ambiente ao vivo de <span className="text-white font-bold">{previewProject.title}</span>...
                  </div>
                </div>
              )}

              <iframe
                id="preview-iframe"
                src={previewProject.path}
                className="w-full h-full border-0"
                onLoad={() => setIframeLoading(false)}
                title={`Pré-visualização de ${previewProject.title}`}
              />
            </div>

            {/* Modal Bottom Bar */}
            <div className="px-4 sm:px-6 py-3 bg-zinc-900/90 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-3">
                <span 
                  className="font-bold uppercase text-[11px]"
                  style={{ color: theme.colors.primary }}
                >
                  {previewProject.categoryLabel}
                </span>
                <span className="hidden sm:inline text-zinc-600">•</span>
                <span className="hidden sm:inline text-zinc-300">
                  {previewProject.featuredMetric.label}: <strong style={{ color: theme.colors.primary }}>{previewProject.featuredMetric.value}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={previewProject.path}
                  className="px-4 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: themeContrast || '#000000',
                  }}
                >
                  <span>Navegar para a Aplicação</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
