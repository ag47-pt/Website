'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  Laptop, 
  Cpu, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  Check, 
  Bot,
  Zap
} from 'lucide-react';

interface CompatibilityItem {
  id: string;
  name: string;
  category: 'harness' | 'model';
  type: string;
  status: 'VERIFIED' | 'SUPPORTED';
  badgeColor: string;
  features: {
    stateABaseline: boolean;
    astGraphSupport: boolean;
    gauntletCritics: boolean;
    zeroContextHandoff: boolean;
    offlineCliExecution: boolean;
  };
  notes: string;
}

const COMPATIBILITY_ITEMS: CompatibilityItem[] = [
  {
    id: 'claude-code',
    name: 'Claude Code (Anthropic CLI)',
    category: 'harness',
    type: 'Agentic Terminal Harness',
    status: 'VERIFIED',
    badgeColor: '#10b981',
    features: {
      stateABaseline: true,
      astGraphSupport: true,
      gauntletCritics: true,
      zeroContextHandoff: true,
      offlineCliExecution: true
    },
    notes: 'Compatibilidade nativa total. Lê .evolution/ e executa comandos do kernel em sub-shell.'
  },
  {
    id: 'antigravity',
    name: 'Google Antigravity IDE',
    category: 'harness',
    type: 'Advanced Agentic IDE',
    status: 'VERIFIED',
    badgeColor: '#10b981',
    features: {
      stateABaseline: true,
      astGraphSupport: true,
      gauntletCritics: true,
      zeroContextHandoff: true,
      offlineCliExecution: true
    },
    notes: 'Integração de primeira classe com ferramentas de filesystem e subagentes paralelos.'
  },
  {
    id: 'cursor',
    name: 'Cursor AI & VS Code',
    category: 'harness',
    type: 'AI-Powered Editor',
    status: 'VERIFIED',
    badgeColor: '#10b981',
    features: {
      stateABaseline: true,
      astGraphSupport: true,
      gauntletCritics: true,
      zeroContextHandoff: true,
      offlineCliExecution: true
    },
    notes: 'Opera via terminal integrado e leitura de .evolution/CONTINUITY.md.'
  },
  {
    id: 'gemini-pro',
    name: 'Google Gemini 2.5 Pro / Flash',
    category: 'model',
    type: 'Frontier Reasoning LLM',
    status: 'VERIFIED',
    badgeColor: '#3b82f6',
    features: {
      stateABaseline: true,
      astGraphSupport: true,
      gauntletCritics: true,
      zeroContextHandoff: true,
      offlineCliExecution: true
    },
    notes: 'Excelente compreensão de AST subgraphs e raciocínio de evidências com zero alucinação.'
  },
  {
    id: 'claude-sonnet',
    name: 'Claude 3.5 Sonnet / 3.7',
    category: 'model',
    type: 'Coding Specialist LLM',
    status: 'VERIFIED',
    badgeColor: '#a855f7',
    features: {
      stateABaseline: true,
      astGraphSupport: true,
      gauntletCritics: true,
      zeroContextHandoff: true,
      offlineCliExecution: true
    },
    notes: 'Alta precisão em mutações pontuais e respeito rigoroso aos limites de scope do Gauntlet.'
  },
  {
    id: 'gpt4o',
    name: 'OpenAI GPT-4o / Codex',
    category: 'model',
    type: 'Multimodal Frontier Model',
    status: 'VERIFIED',
    badgeColor: '#06b6d4',
    features: {
      stateABaseline: true,
      astGraphSupport: true,
      gauntletCritics: true,
      zeroContextHandoff: true,
      offlineCliExecution: true
    },
    notes: 'Gera patches limpos que cumprem contratos do host e testes unitários.'
  },
  {
    id: 'ollama-local',
    name: 'Modelos Locais (Llama 3 / DeepSeek via Ollama)',
    category: 'model',
    type: 'Local On-Premise LLM',
    status: 'SUPPORTED',
    badgeColor: '#f59e0b',
    features: {
      stateABaseline: true,
      astGraphSupport: true,
      gauntletCritics: true,
      zeroContextHandoff: true,
      offlineCliExecution: true
    },
    notes: 'Execução 100% offline em ambientes restritos (Air-gapped) com o kernel do EvoPro.'
  }
];

export function CompatibilityMatrixInteractive() {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<'all' | 'harness' | 'model'>('all');

  const filteredItems = activeCategory === 'all' 
    ? COMPATIBILITY_ITEMS 
    : COMPATIBILITY_ITEMS.filter(i => i.category === activeCategory);

  return (
    <div className="rounded-3xl bg-zinc-950/90 border border-zinc-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl font-mono mb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <Laptop className="w-4 h-4" />
            <span>MATRIZ DE COMPATIBILIDADE DE HARNESSES & MODELOS</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Compatibilidade Agnostica Verificada
          </h3>
        </div>

        {/* Filter Toggle Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 rounded-2xl border border-zinc-800 text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-zinc-800 text-white font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Todos ({COMPATIBILITY_ITEMS.length})
          </button>
          <button
            onClick={() => setActiveCategory('harness')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeCategory === 'harness'
                ? 'bg-zinc-800 text-white font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Harnesses & IDEs
          </button>
          <button
            onClick={() => setActiveCategory('model')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeCategory === 'model'
                ? 'bg-zinc-800 text-white font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Modelos de IA
          </button>
        </div>
      </div>

      {/* Grid de Cards de Compatibilidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all shadow-md group"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80 mb-3">
                <span className="text-[10px] text-zinc-500 uppercase">{item.type}</span>
                <span 
                  className="px-2 py-0.5 rounded text-[10px] font-bold border uppercase"
                  style={{
                    color: item.badgeColor,
                    borderColor: `${item.badgeColor}40`,
                    backgroundColor: `${item.badgeColor}15`
                  }}
                >
                  ✓ {item.status}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                {item.name}
              </h4>

              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed mb-4">
                {item.notes}
              </p>
            </div>

            {/* Checklist de Recursos Suportados */}
            <div className="space-y-1.5 pt-3 border-t border-zinc-800 text-[11px] text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Baseline State A/B & Juiz</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Indexação AST Code Graph</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Handoff de Continuidade em Disco</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
