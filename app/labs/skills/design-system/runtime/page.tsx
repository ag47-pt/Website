'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { parseDesignSystemMarkdown } from '@/lib/design-system/parser';
import { normalizeDesignSystem } from '@/lib/design-system/normalizer';
import { NormalizedDesignSystem } from '@/lib/design-system/types';
import { DesignSystemRuntime } from '../../components/runtime/DesignSystemRuntime';
import { Sun, Moon, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

function LiveRuntimeContent() {
  const searchParams = useSearchParams();
  const presetParam = searchParams.get('preset') || 'lima';
  const modeParam = searchParams.get('mode') as 'light' | 'dark' | null;

  const [spec, setSpec] = useState<NormalizedDesignSystem | null>(null);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(modeParam || 'dark');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSpec() {
      setLoading(true);
      setError(null);

      try {
        let markdownContent = '';

        // Check if there is custom session markdown
        const sessionMd = sessionStorage.getItem('ag47_ds_custom_markdown');
        if (presetParam === 'custom' && sessionMd) {
          markdownContent = sessionMd;
        } else {
          // Preset files mapping
          let sampleUrl = '/examples/lima-design-system-sample.md';
          if (presetParam === 'agmenu') sampleUrl = '/examples/agmenu-clean-sample.md';
          if (presetParam === 'saas-dark') sampleUrl = '/examples/saas-dark-sample.md';
          if (presetParam === 'fintech') sampleUrl = '/examples/fintech-minimal-sample.md';
          if (presetParam === 'ecommerce') sampleUrl = '/examples/ecommerce-vibrant-sample.md';
          if (presetParam === 'lima') sampleUrl = '/examples/lima-design-system-sample.md';

          const res = await fetch(sampleUrl);
          if (!res.ok) throw new Error(`Falha ao carregar preset: ${presetParam}`);
          markdownContent = await res.text();
        }

        const parsed = parseDesignSystemMarkdown(markdownContent);
        const normalized = normalizeDesignSystem(parsed);

        if (!normalized.normalized) {
          throw new Error(
            normalized.errors[0]?.message || 'Falha na validação do Design System.'
          );
        }

        setSpec(normalized.normalized);
      } catch (err: any) {
        setError(err.message || 'Erro inesperado ao renderizar runtime.');
      } finally {
        setLoading(false);
      }
    }

    loadSpec();
  }, [presetParam]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white space-y-4 font-mono">
        <Loader2 className="w-8 h-8 text-lime-400 animate-spin" />
        <span className="text-xs text-zinc-400">INICIALIZANDO LIVE RUNTIME ISOLADO...</span>
      </div>
    );
  }

  if (error || !spec) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white p-6 text-center space-y-4 font-mono">
        <div className="text-red-400 font-bold text-sm">ERRO NO RUNTIME VISUAL</div>
        <p className="text-xs text-zinc-400 max-w-md">{error}</p>
        <Link
          href="/labs/skills"
          className="px-4 py-2 text-xs bg-zinc-900 border border-white/20 rounded-xl text-white hover:bg-zinc-800"
        >
          Voltar ao Design System Lab
        </Link>
      </div>
    );
  }

  const supportsBoth = spec.meta.supported_modes === 'both';

  return (
    <div className="relative min-h-screen w-full">
      {/* Floating Control Bar for Open Live Mode */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-black/80 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full shadow-2xl">
        <Link
          href="/labs/skills"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors pr-2 border-r border-white/10"
          title="Voltar ao Lab"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="font-mono text-[11px] hidden sm:inline">Lab</span>
        </Link>

        <span className="font-mono text-[11px] text-zinc-300 font-bold px-1">
          {spec.meta.name}
        </span>

        {supportsBoth && (
          <button
            onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
            className="p-1 text-zinc-300 hover:text-white transition-colors"
            title="Alternar Modo Claro / Escuro"
          >
            {themeMode === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
            )}
          </button>
        )}
      </div>

      {/* Standalone Full-screen Runtime */}
      <DesignSystemRuntime spec={spec} themeMode={themeMode} viewportMode="desktop" />
    </div>
  );
}

export default function LiveRuntimePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white space-y-4 font-mono">
          <Loader2 className="w-8 h-8 text-lime-400 animate-spin" />
          <span className="text-xs text-zinc-400">CARREGANDO RUNTIME...</span>
        </div>
      }
    >
      <LiveRuntimeContent />
    </Suspense>
  );
}
