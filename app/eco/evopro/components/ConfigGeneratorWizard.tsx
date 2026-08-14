'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  Sliders, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Code2, 
  ShieldCheck, 
  Layers,
  Terminal,
  Settings2
} from 'lucide-react';

type ProjectStack = 'python' | 'typescript' | 'rust' | 'go';

const STACK_PRESETS: Record<ProjectStack, {
  name: string;
  testCmd: string;
  buildCmd: string;
  lintCmd: string;
  typecheckCmd: string;
  forbiddenPaths: string[];
}> = {
  python: {
    name: 'Python (Pytest / FastAPI / Django)',
    testCmd: 'pytest -q',
    buildCmd: 'python -m build',
    lintCmd: 'flake8 .',
    typecheckCmd: 'mypy src/',
    forbiddenPaths: ['**/__pycache__/**', '**/*.pyc']
  },
  typescript: {
    name: 'TypeScript (Next.js / Node.js / React)',
    testCmd: 'npm test',
    buildCmd: 'npm run build',
    lintCmd: 'npm run lint',
    typecheckCmd: 'npx tsc --noEmit',
    forbiddenPaths: ['.next/**', 'node_modules/**', 'dist/**']
  },
  rust: {
    name: 'Rust (Cargo / WebAssembly)',
    testCmd: 'cargo test --quiet',
    buildCmd: 'cargo build --release',
    lintCmd: 'cargo clippy -- -D warnings',
    typecheckCmd: 'cargo check',
    forbiddenPaths: ['target/**']
  },
  go: {
    name: 'Go (Golang CLI / Microservices)',
    testCmd: 'go test ./...',
    buildCmd: 'go build -o bin/app ./...',
    lintCmd: 'golangci-lint run',
    typecheckCmd: 'go vet ./...',
    forbiddenPaths: ['bin/**', 'vendor/**']
  }
};

export function ConfigGeneratorWizard() {
  const { theme } = useTheme();
  const [selectedStack, setSelectedStack] = useState<ProjectStack>('python');
  const [harnessName, setHarnessName] = useState<string>('Claude Code / Antigravity');
  const [enableSecurityCritic, setEnableSecurityCritic] = useState(true);
  const [enableScopeCritic, setEnableScopeCritic] = useState(true);
  const [enableAstGraph, setEnableAstGraph] = useState(true);
  const [maxFilesDelta, setMaxFilesDelta] = useState(4);
  const [maxLinesDelta, setMaxLinesDelta] = useState(180);
  const [copied, setCopied] = useState(false);

  const preset = STACK_PRESETS[selectedStack];

  const generatedConfig = {
    schema_version: '0.3.0',
    host_contract: {
      stack: selectedStack,
      primary_harness: harnessName,
      commands: {
        test: preset.testCmd,
        build: preset.buildCmd,
        lint: preset.lintCmd,
        typecheck: preset.typecheckCmd
      },
      protected_paths: [
        '.evolution/**',
        '.git/**',
        ...preset.forbiddenPaths
      ],
      critics: [
        enableScopeCritic && 'scope',
        enableSecurityCritic && 'security',
        enableAstGraph && 'dependency_impact',
        'regression',
        'architecture',
        'historical_failure'
      ].filter(Boolean),
      limits: {
        max_files_per_sprint: maxFilesDelta,
        max_lines_delta_per_sprint: maxLinesDelta,
        max_revision_cycles_per_sprint: 3,
        no_progress_threshold: 3
      }
    }
  };

  const jsonString = JSON.stringify(generatedConfig, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'evolution.config.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-3xl bg-zinc-950/90 border border-zinc-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl font-mono mb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <Settings2 className="w-4 h-4" />
            <span>WIZARD DE CONFIGURAÇÃO INTERATIVO</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Gerador de <code className="text-emerald-400">evolution.config.json</code>
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs border border-zinc-700 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar JSON'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-black font-bold text-xs transition-transform hover:scale-105 cursor-pointer shadow-lg"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descarregar Ficheiro</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controles de Configuração */}
        <div className="lg:col-span-5 space-y-6 text-xs font-mono">
          {/* Seleção de Stack */}
          <div>
            <label className="text-zinc-400 font-bold uppercase tracking-wider block mb-2 text-[11px]">
              1. Stack Tecnológica do Host:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(STACK_PRESETS) as ProjectStack[]).map((stack) => (
                <button
                  key={stack}
                  onClick={() => setSelectedStack(stack)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedStack === stack
                      ? 'bg-zinc-800 text-white font-bold border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  <span className="capitalize block">{stack}</span>
                  <span className="text-[10px] text-zinc-500 font-sans">{STACK_PRESETS[stack].name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Seleção de Critics Ativos */}
          <div>
            <label className="text-zinc-400 font-bold uppercase tracking-wider block mb-2 text-[11px]">
              2. Critics de Segurança & Gauntlet:
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableSecurityCritic}
                  onChange={(e) => setEnableSecurityCritic(e.target.checked)}
                  className="accent-emerald-400 w-4 h-4 rounded"
                />
                <span className="text-zinc-300">SecurityCritic (Scan de Vulnerabilidades & Secrets)</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableScopeCritic}
                  onChange={(e) => setEnableScopeCritic(e.target.checked)}
                  className="accent-emerald-400 w-4 h-4 rounded"
                />
                <span className="text-zinc-300">ScopeCritic (Proteção de Diretórios Críticos)</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableAstGraph}
                  onChange={(e) => setEnableAstGraph(e.target.checked)}
                  className="accent-emerald-400 w-4 h-4 rounded"
                />
                <span className="text-zinc-300">AST Graph Impact Critic (Mapeamento de Efeitos)</span>
              </label>
            </div>
          </div>

          {/* Sliders de Limites de Mutação */}
          <div className="space-y-4 pt-2">
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex justify-between items-center mb-1 text-[11px]">
                <span className="text-zinc-400">Teto de Arquivos por Sprint:</span>
                <span className="text-emerald-400 font-bold">{maxFilesDelta} arquivos</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={maxFilesDelta}
                onChange={(e) => setMaxFilesDelta(Number(e.target.value))}
                className="w-full accent-emerald-400 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex justify-between items-center mb-1 text-[11px]">
                <span className="text-zinc-400">Teto de Linhas (Delta) por Sprint:</span>
                <span className="text-cyan-400 font-bold">+{maxLinesDelta} linhas</span>
              </div>
              <input
                type="range"
                min="30"
                max="500"
                step="10"
                value={maxLinesDelta}
                onChange={(e) => setMaxLinesDelta(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Live JSON Preview */}
        <div className="lg:col-span-7 rounded-2xl bg-black border border-zinc-800 overflow-hidden shadow-2xl">
          <div className="bg-zinc-900/80 px-4 py-3 border-b border-zinc-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">evolution.config.json</span>
            </div>
            <span className="text-[10px] text-zinc-500">Auto-gerado</span>
          </div>

          <pre className="p-4 sm:p-6 text-xs text-emerald-300/90 font-mono leading-relaxed overflow-x-auto max-h-[460px] overflow-y-auto">
            <code>{jsonString}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
