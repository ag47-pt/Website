'use client';

import React, { useRef, useState } from 'react';
import { Upload, Download, Sparkles, FileText, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { ValidationErrorItem, LabState } from '@/lib/design-system/types';

interface DesignSystemUploaderProps {
  onFileUpload: (content: string, filename: string) => void;
  onLoadSample: () => void;
  onReset: () => void;
  state: LabState;
  errors: ValidationErrorItem[];
  warnings: ValidationErrorItem[];
  currentFileName?: string;
}

export function DesignSystemUploader({
  onFileUpload,
  onLoadSample,
  onReset,
  state,
  errors,
  warnings,
  currentFileName,
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
        } backdrop-blur-xl`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Text */}
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-zinc-300">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Design System Lab v1.0</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Como você quer começar?
            </h2>
            <p className="text-xs text-zinc-400 max-w-lg">
              Envie um arquivo <code className="text-zinc-200">.md</code> estruturado ou baixe o modelo oficial para preencher com seu time ou agente de IA.
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

            <button
              onClick={onLoadSample}
              className="px-4 py-2.5 text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl hover:bg-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Carregar AGMenu Clean</span>
            </button>

            {state !== 'EMPTY' && (
              <button
                onClick={onReset}
                className="p-2.5 text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                title="Limpar e voltar ao estado neutro"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
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
