'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  FolderTree, 
  FileCode, 
  Sliders, 
  Copy, 
  Check, 
  Folder, 
  FileJson, 
  FileText,
  Shield,
  Layers
} from 'lucide-react';
import { ConfigGeneratorWizard } from './ConfigGeneratorWizard';

export function HostModelSection() {
  const { theme } = useTheme();
  const [copiedConfig, setCopiedConfig] = useState(false);

  const sampleConfig = `{
  "host_contract": {
    "commands": {
      "test": "pytest -q",
      "build": "npm run build",
      "lint": "eslint .",
      "typecheck": "tsc --noEmit"
    },
    "protected_paths": [
      ".evolution/**",
      ".git/**"
    ],
    "critics": ["architecture", "security", "dependency_impact"],
    "architecture": {
      "forbidden_paths": []
    },
    "limits": {
      "max_revision_cycles": 3,
      "max_sprints": 25,
      "no_progress_threshold": 3
    }
  }
}`;

  const copyConfig = () => {
    navigator.clipboard.writeText(sampleConfig);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  return (
    <section id="host-model" className="py-16 md:py-24 border-t border-white/5 relative bg-zinc-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
            <FolderTree className="w-3.5 h-3.5" />
            THE REPOSITORY IS THE HOST
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Arquitetura do Host
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            O seu projeto de software atua como o <strong>Host</strong>. O EvoPro instala-se de forma limpa numa pasta dedicada <code className="text-emerald-400 font-mono">.evolution/</code> e governa a evolução através do <code className="text-zinc-300 font-mono">evolution.config.json</code>.
          </p>
        </div>

        {/* Wizard Interativo de Configuração */}
        <ConfigGeneratorWizard />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* File Tree Visualizer */}
          <div className="lg:col-span-5 rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 font-mono text-xs shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
              <span className="text-zinc-400 font-bold uppercase tracking-wider text-[11px]">Estrutura no Repositório</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Instalado</span>
            </div>

            <div className="space-y-1.5 text-zinc-300 font-mono leading-relaxed">
              <div className="flex items-center gap-2 text-white font-bold">
                <Folder className="w-4 h-4 text-amber-400" />
                <span>your-project/</span>
              </div>
              <div className="pl-4 flex items-center gap-2 text-zinc-400">
                <Folder className="w-3.5 h-3.5 text-zinc-500" />
                <span>src/</span>
              </div>
              <div className="pl-4 flex items-center gap-2 text-zinc-400">
                <Folder className="w-3.5 h-3.5 text-zinc-500" />
                <span>tests/</span>
              </div>
              <div className="pl-4 flex items-center gap-2 text-cyan-300 font-semibold">
                <FileJson className="w-3.5 h-3.5 text-cyan-400" />
                <span>evolution.config.json</span>
                <span className="text-[10px] text-zinc-500 font-normal">← Host Contract</span>
              </div>
              <div className="pl-4 flex items-center gap-2 text-emerald-400 font-bold pt-1">
                <Folder className="w-4 h-4 text-emerald-400" />
                <span>.evolution/</span>
              </div>
              <div className="pl-8 flex items-center gap-2 text-zinc-400">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-purple-300 font-semibold">CONTINUITY.md</span>
                <span className="text-[10px] text-zinc-500">← Memória viva</span>
              </div>
              <div className="pl-8 flex items-center gap-2 text-zinc-400">
                <Folder className="w-3.5 h-3.5 text-zinc-500" />
                <span>goal/</span>
                <span className="text-[10px] text-zinc-500">(global-goal.json)</span>
              </div>
              <div className="pl-8 flex items-center gap-2 text-zinc-400">
                <Folder className="w-3.5 h-3.5 text-zinc-500" />
                <span>sprints/</span>
                <span className="text-[10px] text-zinc-500">(active-sprint.json)</span>
              </div>
              <div className="pl-8 flex items-center gap-2 text-zinc-400">
                <Folder className="w-3.5 h-3.5 text-zinc-500" />
                <span>runtime/</span>
                <span className="text-[10px] text-zinc-500">(baselines, gauntlet, judge)</span>
              </div>
              <div className="pl-8 flex items-center gap-2 text-zinc-400">
                <Folder className="w-3.5 h-3.5 text-zinc-500" />
                <span>knowledge/</span>
                <span className="text-[10px] text-zinc-500">(ledger, learnings)</span>
              </div>
              <div className="pl-8 flex items-center gap-2 text-zinc-400">
                <Folder className="w-3.5 h-3.5 text-zinc-500" />
                <span>graph/</span>
                <span className="text-[10px] text-zinc-500">(code-graph.json)</span>
              </div>
              <div className="pl-8 flex items-center gap-2 text-zinc-400">
                <FileJson className="w-3.5 h-3.5 text-zinc-500" />
                <span>schema-lock.json</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 text-[11px] text-zinc-500">
              Tudo o que é necessário para continuar o desenvolvimento reside dentro do próprio repositório.
            </div>
          </div>

          {/* Configuration File & Host Contract */}
          <div className="lg:col-span-7 rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span className="text-white font-bold text-xs font-mono">evolution.config.json</span>
              </div>
              <button
                onClick={copyConfig}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] font-mono border border-zinc-700/60 transition-all cursor-pointer"
              >
                {copiedConfig ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedConfig ? 'Copiado' : 'Copiar Config'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed max-h-[340px] overflow-y-auto">
              <code>{sampleConfig}</code>
            </pre>

            <div className="mt-4 text-xs text-zinc-400 font-sans leading-relaxed">
              <strong>Inferência Automática:</strong> Se os comandos não forem explicitamente declarados, o EvoPro infere a partir do <code className="text-zinc-300 font-mono">package.json</code> ou <code className="text-zinc-300 font-mono">pyproject.toml</code> e anota a evidência utilizada.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
