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
import { DesignSystemRuntime } from './components/runtime/DesignSystemRuntime';
import { FoundationsShowcase } from './components/showcase/FoundationsShowcase';
import { TypographyShowcase } from './components/showcase/TypographyShowcase';
import { ComponentShowcase } from './components/showcase/ComponentShowcase';
import { CardsShowcase } from './components/showcase/CardsShowcase';
import { PatternsShowcase } from './components/showcase/PatternsShowcase';
import { AuditPanel } from './components/audit/AuditPanel';
import { SpecInspector } from './components/spec/SpecInspector';

import {
  Layers,
  FileCode2,
  ShieldAlert,
  Sparkles,
  Box,
  Eye,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  Sun,
  Moon,
} from 'lucide-react';

export function DesignSystemLabClient() {
  const [state, setState] = useState<LabState>('EMPTY');
  const [spec, setSpec] = useState<NormalizedDesignSystem | null>(null);
  const [audit, setAudit] = useState<AuditReport | null>(null);
  const [errors, setErrors] = useState<ValidationErrorItem[]>([]);
  const [warnings, setWarnings] = useState<ValidationErrorItem[]>([]);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const [rawMarkdown, setRawMarkdown] = useState<string>('');
  const [activePresetId, setActivePresetId] = useState<PresetId | null>(null);

  const [activeTab, setActiveTab] = useState<LabTabMode>('preview');
  const [componentCategory, setComponentCategory] = useState<
    'all' | 'foundations' | 'typography' | 'components' | 'cards' | 'patterns'
  >('all');
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const handleProcessMarkdown = (markdown: string, filename: string) => {
    setState('PARSING');
    setErrors([]);
    setWarnings([]);
    setRawMarkdown(markdown);

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

        // Store custom markdown in session storage for Open Live standalone route
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('ag47_ds_custom_markdown', markdown);
        }
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
    lima: { file: '/examples/lima-design-system-sample.md', name: 'lima-design-system-sample.md' },
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
    setRawMarkdown('');
    setActivePresetId(null);
    setActiveTab('preview');
  };

  // Open Live URL
  const getOpenLiveUrl = () => {
    const preset = activePresetId || 'custom';
    const mode = isDarkMode ? 'dark' : 'light';
    return `/labs/skills/design-system/runtime?preset=${preset}&mode=${mode}`;
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
          {/* Main 4 Lab Modes */}
          <div className="flex items-center gap-2">
            <div className="inline-flex p-1 bg-zinc-950 border border-white/10 rounded-2xl gap-1">
              {/* TAB 1: PREVIEW (Live Website Real) */}
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'preview'
                    ? 'bg-lime-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Live Website</span>
              </button>

              {/* TAB 2: COMPONENTS (Technical Workbench) */}
              <button
                onClick={() => setActiveTab('components')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'components'
                    ? 'bg-white text-black shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Box className="w-4 h-4" />
                <span>Componentes</span>
              </button>

              {/* TAB 3: SPEC (Specification & Exporters) */}
              <button
                onClick={() => setActiveTab('spec')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'spec'
                    ? 'bg-white text-black shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileCode2 className="w-4 h-4" />
                <span>Spec & Exporters</span>
              </button>

              {/* TAB 4: AUDIT (Coverage & Health Check) */}
              <button
                onClick={() => setActiveTab('audit')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'audit'
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Auditoria</span>
                {audit && (
                  <span className="text-[10px] font-mono font-black px-1.5 py-0.2 bg-black/20 rounded">
                    {audit.coverage.overallPercentage}%
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Action: Open Live Button (When in Preview) */}
          {activeTab === 'preview' && (
            <div className="flex items-center gap-3">
              <a
                href={getOpenLiveUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-zinc-900 border border-white/20 text-white rounded-xl hover:bg-zinc-800 transition-all shadow-md cursor-pointer"
                title="Abrir o website em tela cheia isolado do AG47"
              >
                <ExternalLink className="w-3.5 h-3.5 text-lime-400" />
                <span>Open Live (Nova Aba)</span>
              </a>
            </div>
          )}

          {/* Subcategory Filters (Components Mode Only) */}
          {activeTab === 'components' && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
              {[
                { id: 'all', label: 'Tudo' },
                { id: 'foundations', label: 'Foundations' },
                { id: 'typography', label: 'Tipografia' },
                { id: 'components', label: 'Botões & Inputs' },
                { id: 'cards', label: 'Cards' },
                { id: 'patterns', label: 'Padrões' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setComponentCategory(sub.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    componentCategory === sub.id
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

      {/* 3. Main Workspace Container */}
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
                onClick={() => handleLoadPreset('lima')}
                className="px-4 py-2 text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl hover:text-white hover:bg-zinc-800 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                <span>Carregar Lima Design System (v1.2)</span>
              </button>
            </div>
          </div>
        )}

        {/* State 1: LIVE WEBSITE PREVIEW */}
        {spec && (activeTab === 'preview' || activeTab === 'runtime') && (
          <div className="w-full overflow-x-hidden">
            <DesignSystemRuntime
              spec={spec}
              themeMode={isDarkMode ? 'dark' : 'light'}
              viewportMode={viewport}
            />
          </div>
        )}

        {/* State 2: TECHNICAL COMPONENTS WORKBENCH */}
        {spec && activeTab === 'components' && (
          <div className="space-y-14 p-4 md:p-8">
            {(componentCategory === 'all' || componentCategory === 'foundations') && (
              <FoundationsShowcase spec={spec} isDarkMode={isDarkMode} />
            )}

            {(componentCategory === 'all' || componentCategory === 'typography') && (
              <TypographyShowcase spec={spec} />
            )}

            {(componentCategory === 'all' || componentCategory === 'components') && (
              <ComponentShowcase spec={spec} />
            )}

            {(componentCategory === 'all' || componentCategory === 'cards') && (
              <CardsShowcase spec={spec} />
            )}

            {(componentCategory === 'all' || componentCategory === 'patterns') && (
              <PatternsShowcase spec={spec} />
            )}
          </div>
        )}

        {/* State 3: SPEC & EXPORTERS */}
        {spec && activeTab === 'spec' && <SpecInspector spec={spec} />}

        {/* State 4: AUDIT MODE */}
        {spec && activeTab === 'audit' && audit && <AuditPanel audit={audit} />}
      </IsolatedPreviewCanvas>
    </div>
  );
}
