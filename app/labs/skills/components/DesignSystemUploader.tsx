'use client';

import React, { useRef, useState } from 'react';
import { Upload, Download, Sparkles, FileText, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { ValidationErrorItem, LabState } from '@/lib/design-system/types';

export type PresetId = 'lima' | 'agmenu' | 'saas-dark' | 'fintech' | 'ecommerce';

interface DesignSystemUploaderProps {
  onFileUpload: (content: string, filename: string) => void;
  onLoadPreset: (presetId: PresetId) => void;
  onReset: () => void;
  state: LabState;
  errors: ValidationErrorItem[];
  warnings: ValidationErrorItem[];
  currentFileName?: string;
  activePresetId?: PresetId | null;
}

export function DesignSystemUploader({
  onFileUpload,
  onLoadPreset,
  onReset,
  state,
  errors,
  warnings,
  currentFileName,
  activePresetId,
}: DesignSystemUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith('.md')) {
      alert('Por favor, selecione um arquivo Markdown (.md).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onFileUpload(content, file.name);
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDownloadTemplate = () => {
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', '/templates/design-system-template.md');
    downloadAnchor.setAttribute('download', 'design-system-template.md');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const PRESETS: { id: PresetId; name: string; tag: string; color: string; desc: string }[] = [
    {
      id: 'lima',
      name: 'Lima Design System',
      tag: 'High Contrast & Energy',
      color: '#C2F500',
      desc: 'Benchmark Oficial v1.2',
    },
    {
      id: 'agmenu',
      name: 'AGMenu Clean',
      tag: 'OLED & Lime',
      color: '#D1FF00',
      desc: 'Cardápios & Gastronomia',
    },
    {
      id: 'saas-dark',
      name: 'SaaS Dark',
      tag: 'Obsidian & Indigo',
      color: '#6366F1',
      desc: 'B2B & Dashboards',
    },
    {
      id: 'fintech',
      name: 'Fintech Minimal',
      tag: 'Precision Emerald',
      color: '#10B981',
      desc: 'Bancos & Tesouraria',
    },
    {
      id: 'ecommerce',
      name: 'E-Commerce Vibrant',
      tag: 'Coral Sunset',
      color: '#FF5941',
      desc: 'Varejo & Moda',
    },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".md"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Main Entry Hero / Action Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
          isDragging
            ? 'border-emerald-400 bg-emerald-950/20 scale-[1.01]'
            : 'border-white/10 bg-zinc-950/80 hover:border-white/20'
        } backdrop-blur-xl space-y-6`}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Text */}
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-zinc-300">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Design System Lab v1.0</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Como você quer começar?
            </h2>
            <p className="text-xs text-zinc-400 max-w-lg">
              Envie um arquivo <code className="text-zinc-200">.md</code> estruturado, escolha um dos presets oficiais ou baixe o modelo oficial.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 text-xs font-bold bg-white text-black rounded-xl hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Enviar Arquivo .md</span>
            </button>

            <button
              onClick={handleDownloadTemplate}
              className="px-4 py-2.5 text-xs font-bold bg-zinc-900 border border-white/15 text-white rounded-xl hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Modelo .md</span>
            </button>

            {state !== 'EMPTY' && (
              <button
                onClick={onReset}
                className="p-2.5 text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                title="Limpar e voltar ao estado neutro"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Preset Selector Bar */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Presets Prontos para Teste Instantâneo:</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PRESETS.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onLoadPreset(preset.id)}
                  className={`group relative p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white/10 border-white/30 shadow-lg scale-[1.02]'
                      : 'bg-zinc-900/60 border-white/5 hover:border-white/20 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white group-hover:text-white transition-colors">
                      {preset.name}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-sm"
                      style={{ backgroundColor: preset.color }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-zinc-400">{preset.desc}</span>
                    <span
                      className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/40 border border-white/5"
                      style={{ color: preset.color }}
                    >
                      {preset.tag}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Validation Status & Error Feedback Banners */}
      {state === 'INVALID' && errors.length > 0 && (
        <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl space-y-2 text-xs text-red-300">
          <div className="flex items-center gap-2 font-bold text-red-400 font-mono">
            <AlertCircle className="w-4 h-4" />
            <span>Documento Inválido — Foram encontrados {errors.length} erro(s) de schema:</span>
          </div>
          <ul className="space-y-1 list-disc list-inside font-mono text-[11px]">
            {errors.map((err, i) => (
              <li key={i}>
                <span className="font-bold text-white">{err.path}:</span> {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {state === 'VALID_WITH_WARNINGS' && warnings.length > 0 && (
        <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl space-y-2 text-xs text-amber-300">
          <div className="flex items-center gap-2 font-bold text-amber-400 font-mono">
            <AlertCircle className="w-4 h-4" />
            <span>Avisos de Especificação ({warnings.length}):</span>
          </div>
          <ul className="space-y-1 list-disc list-inside font-mono text-[11px]">
            {warnings.map((w, i) => (
              <li key={i}>
                <span className="font-bold text-white">{w.path}:</span> {w.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {currentFileName && state !== 'INVALID' && state !== 'EMPTY' && (
        <div className="flex items-center justify-between px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Arquivo carregado: <strong>{currentFileName}</strong></span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider">Status: {state}</span>
        </div>
      )}
    </div>
  );
}
