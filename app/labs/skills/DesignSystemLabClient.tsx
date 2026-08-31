'use client';

import React, { useState, useEffect } from 'react';
import {
  NormalizedDesignSystem,
  ViewportMode,
  LabTabMode,
  LabState,
  ValidationErrorItem,
  AuditReport,
} from '@/lib/design-system/types';
import { parseDesignSystemMarkdown } from '@/lib/design-system/parser';
import { normalizeDesignSystem } from '@/lib/design-system/normalizer';
import { calculateCoverageAndAudit } from '@/lib/design-system/coverage';

import { DesignSystemUploader, PresetId } from './components/DesignSystemUploader';
import { IsolatedPreviewCanvas } from './components/IsolatedPreviewCanvas';
import { FoundationsShowcase } from './components/showcase/FoundationsShowcase';
import { TypographyShowcase } from './components/showcase/TypographyShowcase';
import { ComponentShowcase } from './components/showcase/ComponentShowcase';
import { CardsShowcase } from './components/showcase/CardsShowcase';
import { PatternsShowcase } from './components/showcase/PatternsShowcase';
import { AuditPanel } from './components/audit/AuditPanel';
import { SpecInspector } from './components/spec/SpecInspector';

import { Layers, FileCode2, ShieldAlert, Sparkles, Box } from 'lucide-react';

export function DesignSystemLabClient() {
  const [state, setState] = useState<LabState>('EMPTY');
  const [spec, setSpec] = useState<NormalizedDesignSystem | null>(null);
  const [audit, setAudit] = useState<AuditReport | null>(null);
  const [errors, setErrors] = useState<ValidationErrorItem[]>([]);
  const [warnings, setWarnings] = useState<ValidationErrorItem[]>([]);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const [activePresetId, setActivePresetId] = useState<PresetId | null>(null);

  const [activeTab, setActiveTab] = useState<LabTabMode>('runtime');
  const [showcaseCategory, setShowcaseCategory] = useState<'all' | 'foundations' | 'typography' | 'components' | 'cards' | 'patterns'>('all');
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const handleProcessMarkdown = (markdown: string, filename: string) => {
    setState('PARSING');
    setErrors([]);
    setWarnings([]);

    try {
      const parsedAst = parseDesignSystemMarkdown(markdown);
      const validation = normalizeDesignSystem(parsedAst);

      if (!validation.isValid) {
        setState('INVALID');
        setErrors(validation.errors);
        setWarnings(validation.warnings);
        return;
      }

      if (validation.normalized) {
        const auditReport = calculateCoverageAndAudit(validation.normalized);
        setSpec(validation.normalized);
        setAudit(auditReport);
        setCurrentFileName(filename);
        setWarnings(validation.warnings);
        setState(validation.warnings.length > 0 ? 'VALID_WITH_WARNINGS' : 'RENDERED');
      }
    } catch (err: any) {
      setState('INVALID');
      setErrors([
        {
          path: 'root',
          message: `Erro fatal no processamento: ${err?.message || 'Falha desconhecida'}`,
          severity: 'error',
        },
      ]);
    }
  };

  const PRESET_FILES: Record<PresetId, { file: string; name: string }> = {
    agmenu: { file: '/examples/agmenu-clean-sample.md', name: 'agmenu-clean-sample.md' },
    'saas-dark': { file: '/examples/saas-dark-sample.md', name: 'saas-dark-sample.md' },
    fintech: { file: '/examples/fintech-minimal-sample.md', name: 'fintech-minimal-sample.md' },
    ecommerce: { file: '/examples/ecommerce-vibrant-sample.md', name: 'ecommerce-vibrant-sample.md' },
  };

  const handleLoadPreset = async (presetId: PresetId) => {
    const config = PRESET_FILES[presetId];
    if (!config) return;

    try {
      const res = await fetch(config.file);
      if (res.ok) {
        const content = await res.text();
        setActivePresetId(presetId);
        handleProcessMarkdown(content, config.name);
      } else {
        alert(`Não foi possível carregar o preset ${config.name}.`);
      }
    } catch {
      alert('Erro de conexão ao carregar o preset.');
    }
  };

  const handleReset = () => {
    setState('EMPTY');
    setSpec(null);
    setAudit(null);
    setErrors([]);
    setWarnings([]);
    setCurrentFileName('');
    setActivePresetId(null);
    setActiveTab('runtime');
  };

  return (
    <div className="w-full space-y-8">
      {/* 1. Uploader & Entry Hero */}
      <DesignSystemUploader
        onFileUpload={(content, name) => {
          setActivePresetId(null);
          handleProcessMarkdown(content, name);
        }}
        onLoadPreset={handleLoadPreset}
        onReset={handleReset}
        state={state}
        errors={errors}
        warnings={warnings}
        currentFileName={currentFileName}
        activePresetId={activePresetId}
      />

      {/* 2. Main Workbench Navigation (When Spec is Loaded) */}
      {spec && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          {/* Main Lab Modes */}
          <div className="flex items-center gap-2">
            <div className="inline-flex p-1 bg-zinc-950 border border-white/10 rounded-2xl gap-1">
              <button
                onClick={() => setActiveTab('runtime')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'runtime'
                    ? 'bg-white text-black shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Box className="w-4 h-4" />
                <span>Runtime Mode</span>
              </button>

              <button
                onClick={() => setActiveTab('spec')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'spec'
                    ? 'bg-white text-black shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileCode2 className="w-4 h-4" />
                <span>Spec Mode</span>
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'audit'
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Audit Mode</span>
                {audit && (
                  <span className="text-[10px] font-mono font-black px-1.5 py-0.2 bg-black/20 rounded">
                    {audit.coverage.overallPercentage}%
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Subcategory Filters (Runtime Mode Only) */}
          {activeTab === 'runtime' && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
              {[
                { id: 'all', label: 'Tudo' },
                { id: 'foundations', label: 'Foundations' },
                { id: 'typography', label: 'Tipografia' },
                { id: 'components', label: 'Componentes' },
                { id: 'cards', label: 'Cards' },
                { id: 'patterns', label: 'Padrões' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setShowcaseCategory(sub.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    showcaseCategory === sub.id
                      ? 'bg-zinc-800 text-white font-bold border border-white/20'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Isolated Preview Canvas / Neutral State */}
      <IsolatedPreviewCanvas
        spec={spec}
        viewport={viewport}
        onViewportChange={setViewport}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      >
        {/* State: EMPTY (Neutral Hello World Canvas) */}
        {!spec && (
          <div className="w-full min-h-[380px] flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 shadow-inner">
              <Box className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-200">Hello World — Superfície Neutra</h3>
              <p className="text-xs text-zinc-500 max-w-md">
                Nenhum Design System carregado no momento. A bancada permanece em estado neutro isolado para não contaminar visualmente o seu projeto.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => handleLoadPreset('agmenu')}
                className="px-4 py-2 text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl hover:text-white hover:bg-zinc-800 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Carregar exemplo AGMenu Clean para testar</span>
              </button>
            </div>
          </div>
        )}

        {/* State: RUNTIME MODE */}
        {spec && activeTab === 'runtime' && (
          <div className="space-y-14">
            {(showcaseCategory === 'all' || showcaseCategory === 'foundations') && (
              <FoundationsShowcase spec={spec} isDarkMode={isDarkMode} />
            )}

            {(showcaseCategory === 'all' || showcaseCategory === 'typography') && (
              <TypographyShowcase spec={spec} />
            )}

            {(showcaseCategory === 'all' || showcaseCategory === 'components') && (
              <ComponentShowcase spec={spec} />
            )}

            {(showcaseCategory === 'all' || showcaseCategory === 'cards') && (
              <CardsShowcase spec={spec} />
            )}

            {(showcaseCategory === 'all' || showcaseCategory === 'patterns') && (
              <PatternsShowcase spec={spec} />
            )}
          </div>
        )}

        {/* State: SPEC MODE */}
        {spec && activeTab === 'spec' && <SpecInspector spec={spec} />}

        {/* State: AUDIT MODE */}
        {spec && activeTab === 'audit' && audit && <AuditPanel audit={audit} />}
      </IsolatedPreviewCanvas>
    </div>
  );
}
