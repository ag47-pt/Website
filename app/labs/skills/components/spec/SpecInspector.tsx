'use client';

import React, { useState } from 'react';
import { NormalizedDesignSystem } from '@/lib/design-system/types';
import { generateCssTokens, generateTailwindConfig } from '@/lib/design-system/exporters';
import { Copy, Check, FileCode, CheckCircle2, XCircle, Download, Code2, Palette } from 'lucide-react';

interface SpecInspectorProps {
  spec: NormalizedDesignSystem;
}

type SpecTab = 'tokens' | 'css' | 'tailwind' | 'identity' | 'raw';

export function SpecInspector({ spec }: SpecInspectorProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SpecTab>('tokens');

  const cssTokensCode = generateCssTokens(spec);
  const tailwindConfigCode = generateTailwindConfig(spec);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadFile = (content: string, filename: string, mimeType: string = 'text/plain') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white">Especificação & Exportação de Código</h3>
          <p className="text-xs text-zinc-400">
            Exporte variáveis CSS prontas para colar, arquivo <code className="text-zinc-200">tailwind.config.ts</code> ou contrato JSON.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap bg-zinc-900 border border-white/10 rounded-xl p-1 text-xs">
            <button
              onClick={() => setActiveTab('tokens')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'tokens' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Tokens & Resumo
            </button>

            <button
              onClick={() => setActiveTab('css')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'css' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>tokens.css</span>
            </button>

            <button
              onClick={() => setActiveTab('tailwind')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'tailwind' ? 'bg-cyan-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>tailwind.config.ts</span>
            </button>

            <button
              onClick={() => setActiveTab('identity')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'identity' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Identidade & DOs
            </button>

            <button
              onClick={() => setActiveTab('raw')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'raw' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              JSON Contrato
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'tokens' && (
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="p-5 bg-zinc-950 border border-white/10 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-zinc-500 block text-[10px]">SPEC_VERSION</span>
              <span className="text-white font-bold">{spec.meta.spec_version}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">PLATFORM</span>
              <span className="text-white font-bold">{spec.meta.platform}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">THEME_MODES</span>
              <span className="text-white font-bold">{spec.meta.supported_modes}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">AUTHOR</span>
              <span className="text-white font-bold truncate">{spec.meta.author || 'N/A'}</span>
            </div>
          </div>

          {/* Tokens Summary Table */}
          <div className="border border-white/10 rounded-2xl overflow-hidden bg-zinc-950/70">
            <div className="px-5 py-3 border-b border-white/10 bg-zinc-900/50 flex items-center justify-between text-xs font-bold text-zinc-300">
              <span>Token Key</span>
              <span>Light Value</span>
              <span>Dark Value</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-white/5 text-xs font-mono">
              {Object.entries(spec.colors).map(([key, tok]) => {
                if (key === 'custom') return null;
                const token = tok as any;
                return (
                  <div key={key} className="px-5 py-2.5 flex items-center justify-between">
                    <span className="text-zinc-300 font-bold">{key}</span>
                    <span className="text-zinc-400">{token.value}</span>
                    <span className="text-zinc-400">{token.dark_value || '—'}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">{token.status}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: CSS Tokens */}
      {activeTab === 'css' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-zinc-950 border border-white/10 rounded-2xl">
            <div>
              <h4 className="text-sm font-bold text-white font-mono">tokens.css</h4>
              <p className="text-xs text-zinc-400">
                Variáveis CSS padronizadas para modo claro e escuro (compatível com Next.js, Vite, HTML e CSS puro).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(cssTokensCode, 'css')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-900 border border-white/10 rounded-xl text-zinc-200 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
              >
                {copiedKey === 'css' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'css' ? 'Copiado!' : 'Copiar CSS'}</span>
              </button>
              <button
                onClick={() => handleDownloadFile(cssTokensCode, 'tokens.css', 'text/css')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar tokens.css</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-black/90 border border-white/10 rounded-2xl overflow-x-auto max-h-[500px]">
            <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed whitespace-pre">
              {cssTokensCode}
            </pre>
          </div>
        </div>
      )}

      {/* Tab: Tailwind Config */}
      {activeTab === 'tailwind' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-zinc-950 border border-white/10 rounded-2xl">
            <div>
              <h4 className="text-sm font-bold text-white font-mono">tailwind.config.ts</h4>
              <p className="text-xs text-zinc-400">
                Configuração pronta para estender o Tailwind CSS com tokens de cores, raios, espaçamentos e fontes.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(tailwindConfigCode, 'tailwind')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-900 border border-white/10 rounded-xl text-zinc-200 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
              >
                {copiedKey === 'tailwind' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'tailwind' ? 'Copiado!' : 'Copiar Config'}</span>
              </button>
              <button
                onClick={() => handleDownloadFile(tailwindConfigCode, 'tailwind.config.ts', 'application/typescript')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar config.ts</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-black/90 border border-white/10 rounded-2xl overflow-x-auto max-h-[500px]">
            <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed whitespace-pre">
              {tailwindConfigCode}
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'identity' && (
        <div className="space-y-6">
          <div className="p-6 bg-zinc-950 border border-white/10 rounded-2xl space-y-4">
            <h4 className="text-sm font-bold text-white">Direção Visual & Princípios</h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {spec.identity.visual_direction || 'Nenhuma direção visual descrita.'}
            </p>

            {spec.identity.principles.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">Princípios:</span>
                <ul className="list-disc list-inside space-y-1 text-xs text-zinc-300">
                  {spec.identity.principles.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* DOs & DON'Ts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DO */}
            <div className="p-6 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>BOAS PRÁTICAS (DO)</span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-300">
                {spec.identity.dos.length > 0 ? (
                  spec.identity.dos.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <span className="text-zinc-500 italic">Nenhum DO declarado.</span>
                )}
              </ul>
            </div>

            {/* DON'T */}
            <div className="p-6 bg-red-950/20 border border-red-500/20 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold font-mono">
                <XCircle className="w-4 h-4" />
                <span>O QUE EVITAR (DON'T)</span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-300">
                {spec.identity.donts.length > 0 ? (
                  spec.identity.donts.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <span className="text-zinc-500 italic">Nenhum DON'T declarado.</span>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'raw' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-zinc-950 border border-white/10 rounded-2xl">
            <div>
              <h4 className="text-sm font-bold text-white font-mono">contract.json</h4>
              <p className="text-xs text-zinc-400">
                Estrutura de dados normalizada do Design System no formato Zod Contract v1.0.
              </p>
            </div>
            <button
              onClick={() => handleCopy(JSON.stringify(spec, null, 2), 'raw')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-900 border border-white/10 rounded-xl text-zinc-200 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
            >
              {copiedKey === 'raw' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'raw' ? 'Copiado!' : 'Copiar JSON'}</span>
            </button>
          </div>

          <div className="p-4 bg-black border border-white/10 rounded-2xl overflow-x-auto max-h-[500px]">
            <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed">
              {JSON.stringify(spec, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
