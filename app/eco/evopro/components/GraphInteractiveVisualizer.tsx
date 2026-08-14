'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  Network, 
  FileCode2, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Activity,
  CheckCircle2,
  Info,
  Sparkles
} from 'lucide-react';

interface GraphNode {
  id: string;
  name: string;
  type: 'core' | 'agent' | 'gauntlet' | 'graph' | 'runtime';
  x: number;
  y: number;
  confidence: number;
  provenance: string;
  dependencies: string[];
  callers: string[];
  lines: number;
}

const NODES: GraphNode[] = [
  {
    id: 'core-judge',
    name: 'core/judge.py',
    type: 'core',
    x: 50,
    y: 20,
    confidence: 1.0,
    provenance: 'ast.parse() • line 1',
    dependencies: ['gauntlet-engine', 'runtime-state'],
    callers: ['agents-orchestrator'],
    lines: 342
  },
  {
    id: 'graph-indexer',
    name: 'graph/ast_indexer.py',
    type: 'graph',
    x: 20,
    y: 45,
    confidence: 1.0,
    provenance: 'ast.NodeVisitor • line 12',
    dependencies: ['runtime-state'],
    callers: ['core-judge', 'gauntlet-engine'],
    lines: 480
  },
  {
    id: 'gauntlet-engine',
    name: 'gauntlet/engine.py',
    type: 'gauntlet',
    x: 80,
    y: 45,
    confidence: 1.0,
    provenance: 'ast.parse() • line 28',
    dependencies: ['scope-critic', 'regression-critic'],
    callers: ['core-judge'],
    lines: 520
  },
  {
    id: 'agents-orchestrator',
    name: 'agents/observer_v0.py',
    type: 'agent',
    x: 50,
    y: 75,
    confidence: 0.95,
    provenance: 'inferred regex • line 4',
    dependencies: ['core-judge', 'graph-indexer'],
    callers: ['cli-entrypoint'],
    lines: 280
  },
  {
    id: 'runtime-state',
    name: 'runtime/state.py',
    type: 'runtime',
    x: 20,
    y: 85,
    confidence: 1.0,
    provenance: 'ast.parse() • line 8',
    dependencies: [],
    callers: ['core-judge', 'graph-indexer'],
    lines: 190
  },
  {
    id: 'scope-critic',
    name: 'gauntlet/scope_critic.py',
    type: 'gauntlet',
    x: 80,
    y: 85,
    confidence: 1.0,
    provenance: 'ast.parse() • line 15',
    dependencies: [],
    callers: ['gauntlet-engine'],
    lines: 210
  }
];

export function GraphInteractiveVisualizer() {
  const { theme } = useTheme();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('graph-indexer');

  const selectedNode = NODES.find((n) => n.id === selectedNodeId) || NODES[0];

  const getNodeColor = (type: GraphNode['type']) => {
    switch (type) {
      case 'core': return '#3b82f6';
      case 'graph': return '#06b6d4';
      case 'gauntlet': return '#10b981';
      case 'agent': return '#a855f7';
      case 'runtime': return '#f59e0b';
      default: return '#71717a';
    }
  };

  return (
    <div className="rounded-3xl bg-zinc-950/90 border border-zinc-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl font-mono mb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-zinc-800 gap-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <Network className="w-4 h-4" />
            <span>AST CODE GRAPH EXPLORER (INTERATIVO)</span>
          </div>
          <h3 className="text-xl font-bold text-white">Visualizador Dinâmico de Nós & Dependências</h3>
        </div>
        <span className="text-[11px] text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
          Clique nos nós para inspecionar proveniência
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Canvas do Grafo (SVG Interativo) */}
        <div className="lg:col-span-7 relative h-[340px] sm:h-[380px] bg-black/60 rounded-2xl border border-zinc-800/80 p-4 overflow-hidden flex items-center justify-center">
          {/* Fundo de Grade Sutil */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* SVG para Linhas de Conexão */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {NODES.map((node) =>
              node.dependencies.map((depId) => {
                const targetNode = NODES.find((n) => n.id === depId);
                if (!targetNode) return null;
                const isHighlighted = selectedNodeId === node.id || selectedNodeId === targetNode.id;

                return (
                  <line
                    key={`${node.id}-${depId}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${targetNode.x}%`}
                    y2={`${targetNode.y}%`}
                    stroke={isHighlighted ? theme.colors.primary : '#3f3f46'}
                    strokeWidth={isHighlighted ? '2.5' : '1'}
                    strokeDasharray={isHighlighted ? '4 2' : undefined}
                    className="transition-all duration-300"
                  />
                );
              })
            )}
          </svg>

          {/* Render dos Nós Interativos */}
          {NODES.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isConnected = selectedNode.dependencies.includes(node.id) || selectedNode.callers.includes(node.id);
            const color = getNodeColor(node.type);

            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className={`absolute z-10 p-2 sm:p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected 
                    ? 'scale-110 shadow-[0_0_20px_rgba(6,182,212,0.4)] bg-zinc-900 border-white text-white font-bold' 
                    : isConnected
                    ? 'bg-zinc-900/90 border-zinc-600 text-zinc-200'
                    : 'bg-zinc-950/80 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: color, boxShadow: isSelected ? `0 0 8px ${color}` : undefined }}
                />
                <span className="text-[11px] whitespace-nowrap">{node.name.split('/')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Painel Lateral de Metadados do Nó Selecionado */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white">{selectedNode.name}</span>
            </div>
            <span 
              className="px-2 py-0.5 rounded text-[10px] uppercase font-bold border"
              style={{ 
                color: getNodeColor(selectedNode.type),
                borderColor: `${getNodeColor(selectedNode.type)}40`,
                backgroundColor: `${getNodeColor(selectedNode.type)}15`
              }}
            >
              {selectedNode.type}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px] uppercase">Confiança AST</span>
              <span className="font-bold text-emerald-400">
                {(selectedNode.confidence * 100).toFixed(0)}% (OBSERVED)
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px] uppercase">Linhas Totais</span>
              <span className="font-bold text-white">{selectedNode.lines} LOC</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
              Proveniência & Origem:
            </span>
            <div className="p-2 rounded-lg bg-black/70 border border-zinc-800/80 text-cyan-300 text-[11px]">
              <code>{selectedNode.provenance}</code>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
              Dependências Diretas ({selectedNode.dependencies.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedNode.dependencies.length === 0 ? (
                <span className="text-zinc-600 text-[11px]">Nenhuma dependência externa</span>
              ) : (
                selectedNode.dependencies.map((dep) => (
                  <span key={dep} className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[11px] border border-zinc-700/60">
                    {dep}
                  </span>
                ))
              )}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
              Impact Blast Radius (Chamadores):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedNode.callers.map((caller) => (
                <span key={caller} className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 text-[11px] border border-purple-800/40">
                  {caller}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
