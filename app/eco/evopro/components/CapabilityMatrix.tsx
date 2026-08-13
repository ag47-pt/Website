'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  Cpu, 
  CheckCircle2, 
  HelpCircle, 
  XCircle, 
  Sliders, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export function CapabilityMatrix() {
  const { theme } = useTheme();

  const discoveredCaps = [
    { name: 'filesystem', source: 'Inspeção do Host', status: 'Descoberto', desc: 'Acesso a ficheiros do projeto e diretório .evolution/' },
    { name: 'terminal', source: 'Ambiente de Execução', status: 'Descoberto', desc: 'Capacidade de rodar processos e comandos do sistema' },
    { name: 'git', source: 'Repositório', status: 'Descoberto', desc: 'Criação de branches de isolamento e tracking de histórico' },
    { name: 'test_runner', source: 'pyproject / package.json', status: 'Descoberto', desc: 'Suites de teste detetadas no host' },
    { name: 'build_system', source: 'package.json / setup.py', status: 'Descoberto', desc: 'Comandos de compilação/build detetados' },
    { name: 'scheduler', source: 'Sistema Operacional', status: 'Descoberto', desc: 'Capacidade de agendamento de ticks periódicos' }
  ];

  const declaredCaps = [
    { name: 'subagents', source: 'EVOLUTION_CAPABILITIES="subagents=true"', status: 'Declarado / Env', desc: 'Execução de críticos em contextos limpos e independentes' },
    { name: 'browser', source: 'Harness Adapter', status: 'Declarado / Env', desc: 'Inspeção visual e navegação para UX critic' },
    { name: 'mcp', source: 'Harness Adapter', status: 'Declarado / Env', desc: 'Conectores de ferramentas Model Context Protocol' },
    { name: 'background_execution', source: 'Ambiente', status: 'Declarado / Env', desc: 'Processos assíncronos e jobs em background' },
    { name: 'screenshots', source: 'Ambiente', status: 'Declarado / Env', desc: 'Captura de ecrã para auditoria de frontend' },
    { name: 'network', source: 'Harness Adapter', status: 'Declarado / Env', desc: 'Acesso externo a APIs ou registos remotos' }
  ];

  return (
    <section id="capabilities" className="py-16 md:py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
            <Cpu className="w-3.5 h-3.5" />
            DISCOVERY & ADAPTIVE STRATEGY
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Descoberta de Capacidades
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Diferentes ambientes e agentes possuem diferentes capacidades. O EvoPro adapta a sua estratégia às capacidades comprovadas e trata <code className="text-cyan-400 font-mono">UNKNOWN</code> estritamente como indisponível.
          </p>
        </div>

        {/* 2 Grid Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 font-mono text-xs">
          {/* Discovered by Inspection */}
          <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
              <span className="font-bold text-white uppercase text-xs">Prováveis por Inspeção (Offline)</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">
                Descoberta Automática
              </span>
            </div>

            <div className="space-y-3">
              {discoveredCaps.map((cap) => (
                <div key={cap.name} className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <code className="font-bold text-white">{cap.name}</code>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-sans mt-1">{cap.desc}</p>
                  </div>
                  <span className="text-[10px] text-zinc-500 shrink-0">{cap.source}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Declared by Environment */}
          <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
              <span className="font-bold text-white uppercase text-xs">Não Comprováveis por Inspeção</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] border border-purple-500/20">
                Requerem Declaração
              </span>
            </div>

            <div className="space-y-3">
              {declaredCaps.map((cap) => (
                <div key={cap.name} className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sliders className="w-3.5 h-3.5 text-purple-400" />
                      <code className="font-bold text-white">{cap.name}</code>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-sans mt-1">{cap.desc}</p>
                  </div>
                  <span className="text-[10px] text-zinc-500 shrink-0">UNKNOWN por omissão</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fallback Principle Box */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 font-mono text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>
              <strong>Otimismo não é evidência:</strong> Quando uma capacidade não pode ser provada ou declarada, o kernel assume indisponibilidade e executa a estratégia de fallback compatível sem falhas catastróficas.
            </span>
          </div>
          <code className="text-zinc-300 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800 shrink-0">
            evolution capabilities
          </code>
        </div>
      </div>
    </section>
  );
}
