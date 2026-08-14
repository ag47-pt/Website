'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { ALT_RADAR_CONFIG, CliCommandItem } from '@/data/alt-radar';
import { 
  BookOpen, 
  Search, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  Tag, 
  ShieldCheck, 
  Zap, 
  Radio, 
  Cpu 
} from 'lucide-react';

const playSynthSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1040, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Fallback
  }
};

export function CliReference() {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCommand, setExpandedCommand] = useState<string | null>(
    ALT_RADAR_CONFIG.cliCommands[0]?.name || null
  );
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Todos os Comandos' },
    { id: 'discovery', label: 'Discovery' },
    { id: 'security', label: 'Security' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'system', label: 'System' }
  ];

  const filteredCommands = ALT_RADAR_CONFIG.cliCommands.filter((cmd) => {
    const matchesSearch = 
      cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.syntax.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copySyntax = (cmd: CliCommandItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cmd.syntax);
    playSynthSound();
    setCopiedName(cmd.name);
    setTimeout(() => setCopiedName(null), 2000);
  };

  return (
    <section id="cli" className="relative py-20 md:py-32 overflow-hidden border-t border-zinc-900">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold mb-4 border"
            style={{ 
              backgroundColor: `${theme.colors.primary}10`,
              borderColor: `${theme.colors.primary}30`,
              color: theme.colors.primary 
            }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            REFERÊNCIA DE COMANDOS CLI & API
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Comandos Determinísticos para Automação
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Consulte a sintaxe de todas as operações do daemon do Alt Radar, com suporte a filtros de rede, simulações em sandbox e exportação em formato estruturado.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Pesquisar por comando, flag ou palavra-chave (ex: scan, audit, webhook)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-2xl text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 font-mono transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-zinc-950 border border-zinc-800/80">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-zinc-800 text-white shadow-sm' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  style={{
                    color: isSelected ? theme.colors.primary : undefined
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Commands List Accordion */}
        <div className="max-w-4xl mx-auto space-y-3">
          {filteredCommands.map((cmd) => {
            const isExpanded = expandedCommand === cmd.name;
            return (
              <div 
                key={cmd.name}
                className="rounded-2xl bg-zinc-950/90 border border-zinc-800/80 backdrop-blur-xl overflow-hidden transition-all hover:border-zinc-700"
              >
                {/* Accordion Header */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setExpandedCommand(isExpanded ? null : cmd.name)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setExpandedCommand(isExpanded ? null : cmd.name);
                    }
                  }}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-emerald-400 shrink-0">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-bold text-white">
                          ag47-alt-radar {cmd.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800 uppercase">
                          {cmd.category}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">
                        {cmd.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => copySyntax(cmd, e)}
                      className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                      title="Copiar sintaxe"
                    >
                      {copiedName === cmd.name ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <div className="p-1 text-zinc-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Accordion Body */}
                {isExpanded && (
                  <div className="p-5 border-t border-zinc-900 bg-black/40 space-y-4">
                    {/* Syntax Box */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                        Sintaxe do Comando:
                      </span>
                      <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 font-mono text-xs text-emerald-300">
                        <code>{cmd.syntax}</code>
                      </div>
                    </div>

                    {/* Flags Table */}
                    {cmd.flags && cmd.flags.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                          Flags & Parâmetros Suportados:
                        </span>
                        <div className="rounded-xl border border-zinc-800/80 overflow-hidden">
                          <table className="w-full text-left font-mono text-xs">
                            <thead className="bg-zinc-900/80 text-zinc-400">
                              <tr>
                                <th className="p-2.5">Flag</th>
                                <th className="p-2.5">Descrição</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900 text-zinc-300">
                              {cmd.flags.map((flag, fIdx) => (
                                <tr key={fIdx} className="hover:bg-zinc-900/30">
                                  <td className="p-2.5 font-bold text-cyan-300">{flag.flag}</td>
                                  <td className="p-2.5 text-zinc-400">{flag.desc}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
