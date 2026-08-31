'use client';

import React, { useState } from 'react';
import { NormalizedDesignSystem } from '@/lib/design-system/types';
import { Copy, Check, FileCode, CheckCircle2, XCircle } from 'lucide-react';

interface SpecInspectorProps {
  spec: NormalizedDesignSystem;
}

export function SpecInspector({ spec }: SpecInspectorProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'tokens' | 'identity' | 'raw'>('tokens');

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(spec, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white">Especificação Normalizada</h3>
          <p className="text-xs text-zinc-400">
            Estrutura tipada resultante do parsing determinístico e validação de schema.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-zinc-900 border border-white/10 rounded-xl p-1 text-xs">
            <button
              onClick={() => setActiveTab('tokens')}
              className={`px-3 py-1 font-semibold rounded-lg transition-all ${
                activeTab === 'tokens' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Tokens & Regras
            </button>
            <button
              onClick={() => setActiveTab('identity')}
              className={`px-3 py-1 font-semibold rounded-lg transition-all ${
                activeTab === 'identity' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Identidade & DOs
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-3 py-1 font-semibold rounded-lg transition-all ${
                activeTab === 'raw' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              JSON Contrato
            </button>
          </div>

          <button
            onClick={handleCopyJson}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-900 border border-white/10 rounded-xl text-zinc-300 hover:text-white transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>
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
        <div className="p-4 bg-black border border-white/10 rounded-2xl overflow-x-auto">
          <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed">
            {JSON.stringify(spec, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
