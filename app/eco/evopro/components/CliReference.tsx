'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { CLI_COMMANDS, CliCommand, EVOPRO_VERSION_LABEL } from '@/data/evopro';
import { 
  BookOpen, 
  Search, 
  Copy, 
  Check, 
  Terminal, 
  ChevronDown, 
  ChevronUp,
  Sliders
} from 'lucide-react';

export function CliReference() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCommand, setExpandedCommand] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'bootstrap', label: 'Bootstrap & Init' },
    { id: 'lifecycle', label: 'Diagnosis & Spec' },
    { id: 'goal_sprint', label: 'Goals & Sprints' },
    { id: 'verification', label: 'Baseline & Gauntlet' },
    { id: 'runtime', label: 'Runtime Loop' },
    { id: 'intelligence', label: 'Graph & Context' },
    { id: 'audit', label: 'Audit & Continuity' }
  ];

  const filteredCommands = CLI_COMMANDS.filter((cmd) => {
    const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory;
    const matchesSearch = 
      cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (cmdStr: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cmdStr);
    setCopiedCmd(cmdStr);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const toggleExpand = (cmdStr: string) => {
    setExpandedCommand(expandedCommand === cmdStr ? null : cmdStr);
  };

  return (
    <section id="cli" className="py-16 md:py-24 border-t border-white/5 relative bg-zinc-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            REFERÊNCIA DA LINHA DE COMANDOS
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            CLI Reference
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Os {CLI_COMMANDS.length} comandos publicados pelo protocolo na versão {EVOPRO_VERSION_LABEL}, lidos diretamente da sua árvore de parsers via <code className="text-emerald-400">evolution manifest</code>. Clique em qualquer comando para ver flags, argumentos e exemplos.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4 font-mono">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar comando (ex: goal, baseline, gauntlet, graph, continuity)..."
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl py-3.5 pl-11 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-zinc-800 text-emerald-400 font-bold border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Commands List Accordion */}
        <div className="max-w-4xl mx-auto space-y-3 font-mono">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs">
              Nenhum comando encontrado para &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            filteredCommands.map((cmd) => {
              const isExpanded = expandedCommand === cmd.command;

              return (
                <div
                  key={cmd.command}
                  className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-sm transition-all"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleExpand(cmd.command)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleExpand(cmd.command); } }}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-900/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white tracking-tight">
                          {cmd.command}
                        </div>
                        <span className="text-[11px] text-zinc-400 font-sans block mt-0.5">
                          {cmd.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <button
                        onClick={(e) => handleCopy(cmd.command, e)}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700/60 transition-all"
                        title="Copiar comando base"
                      >
                        {copiedCmd === cmd.command ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-zinc-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-500" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Details Drawer */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-zinc-900/50 border-t border-zinc-800/80 space-y-3 text-xs">
                      {cmd.flags && cmd.flags.length > 0 && (
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1.5">
                            Flags & Opções Disponíveis:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {cmd.flags.map((flag, fIdx) => (
                              <span
                                key={fIdx}
                                className="px-2 py-0.5 rounded bg-zinc-950 text-cyan-300 text-[11px] border border-zinc-800"
                              >
                                {flag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {cmd.example && (
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
                            Exemplo de Uso:
                          </span>
                          <div className="p-2.5 rounded-xl bg-black/80 text-emerald-300 border border-zinc-800 flex items-center justify-between">
                            <code>{cmd.example}</code>
                            <button
                              onClick={(e) => handleCopy(cmd.example!, e)}
                              className="text-[10px] text-zinc-400 hover:text-white ml-2 shrink-0"
                            >
                              Copiar
                            </button>
                          </div>
                        </div>
                      )}

                      {cmd.outputExample && (
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
                            Exemplo de Resposta:
                          </span>
                          <pre className="p-3 rounded-xl bg-black/90 text-zinc-300 text-[11px] border border-zinc-800/80 overflow-x-auto whitespace-pre-wrap">
                            <code>{cmd.outputExample}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
