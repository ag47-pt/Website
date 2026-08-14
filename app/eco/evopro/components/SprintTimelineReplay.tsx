'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Bot, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  GitCommit,
  Clock
} from 'lucide-react';

interface SprintEvent {
  sprintNumber: number;
  id: string;
  goal: string;
  agent: string;
  agentBadgeColor: string;
  locDelta: string;
  testsDelta: string;
  verdict: 'ACCEPTED' | 'REJECTED';
  verdictReason: string;
  goalProgress: number;
  timestamp: string;
}

const SPRINT_HISTORY: SprintEvent[] = [
  {
    sprintNumber: 1,
    id: 'SPRINT-001',
    goal: 'Inicializar repositório e contrato base do host',
    agent: 'Codex / CLI',
    agentBadgeColor: '#3b82f6',
    locDelta: '+180 LOC',
    testsDelta: '4/4 passed',
    verdict: 'ACCEPTED',
    verdictReason: 'Árvore .evolution/ inicializada e schemas validados com sucesso.',
    goalProgress: 10,
    timestamp: 'Dia 01 • 09:14'
  },
  {
    sprintNumber: 2,
    id: 'SPRINT-002',
    goal: 'Criar modelos ORM de utilizador e base de dados PostgreSQL',
    agent: 'Claude Code',
    agentBadgeColor: '#a855f7',
    locDelta: '+240 LOC',
    testsDelta: '12/12 passed',
    verdict: 'ACCEPTED',
    verdictReason: 'Migrações geradas e testes de integridade relacionais aprovados.',
    goalProgress: 22,
    timestamp: 'Dia 01 • 14:30'
  },
  {
    sprintNumber: 3,
    id: 'SPRINT-003',
    goal: 'Implementar rotas de autenticação e sessão segura',
    agent: 'Cursor (GPT-4o)',
    agentBadgeColor: '#06b6d4',
    locDelta: '+195 LOC',
    testsDelta: '24/24 passed',
    verdict: 'ACCEPTED',
    verdictReason: 'Módulos de sessão com cookies HttpOnly implementados.',
    goalProgress: 35,
    timestamp: 'Dia 02 • 10:00'
  },
  {
    sprintNumber: 4,
    id: 'SPRINT-004',
    goal: 'Tentativa de atalho com chave de API hardcoded no frontend',
    agent: 'Autonomous LLM',
    agentBadgeColor: '#f43f5e',
    locDelta: '+12 LOC',
    testsDelta: '0 novos testes',
    verdict: 'REJECTED',
    verdictReason: 'SecurityCritic barrou token de acesso estático em código público.',
    goalProgress: 35,
    timestamp: 'Dia 02 • 11:45'
  },
  {
    sprintNumber: 5,
    id: 'SPRINT-005',
    goal: 'Correção de Auth com variáveis de ambiente e hash HMAC',
    agent: 'Antigravity (Gemini 2.5 Pro)',
    agentBadgeColor: '#10b981',
    locDelta: '+85 LOC',
    testsDelta: '32/32 passed',
    verdict: 'ACCEPTED',
    verdictReason: 'Secrets isolados no vault e zero vulnerabilidades detectadas.',
    goalProgress: 48,
    timestamp: 'Dia 02 • 15:20'
  },
  {
    sprintNumber: 6,
    id: 'SPRINT-006',
    goal: 'Integrar webhooks de faturamento Stripe e eventos de cobrança',
    agent: 'Claude 3.5 Sonnet',
    agentBadgeColor: '#a855f7',
    locDelta: '+160 LOC',
    testsDelta: '44/44 passed',
    verdict: 'ACCEPTED',
    verdictReason: 'Testes de idempotência e assinaturas criptográficas validados.',
    goalProgress: 60,
    timestamp: 'Dia 03 • 08:30'
  },
  {
    sprintNumber: 7,
    id: 'SPRINT-007',
    goal: 'Agente tentou alterar os critérios de aceite do Global Goal',
    agent: 'AI Subagent',
    agentBadgeColor: '#f59e0b',
    locDelta: '-4 LOC',
    testsDelta: 'N/A',
    verdict: 'REJECTED',
    verdictReason: 'ScopeCritic impediu modificação não-autorizada em .evolution/goal/.',
    goalProgress: 60,
    timestamp: 'Dia 03 • 12:10'
  },
  {
    sprintNumber: 8,
    id: 'SPRINT-008',
    goal: 'Indexação AST Code Graph e análise de blast radius',
    agent: 'Antigravity IDE',
    agentBadgeColor: '#10b981',
    locDelta: '+310 LOC',
    testsDelta: '52/52 passed',
    verdict: 'ACCEPTED',
    verdictReason: 'Grafo AST ativo com 270 nós indexados sem dependências externas.',
    goalProgress: 75,
    timestamp: 'Dia 03 • 17:45'
  }
];

export function SprintTimelineReplay() {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(SPRINT_HISTORY.length - 1);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentSprint = SPRINT_HISTORY[currentIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev < SPRINT_HISTORY.length - 1 ? prev + 1 : 0));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="rounded-3xl bg-zinc-950/90 border border-zinc-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl font-mono mb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
            <Clock className="w-4 h-4" />
            <span>TIMELINE REPLAY • AUDITORIA HISTÓRICA DO PROJETO</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Simulador de Linha do Tempo dos Sprints
          </h3>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs border border-zinc-700 transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isPlaying ? 'Pausar Replay' : 'Reproduzir'}</span>
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentIndex((prev) => (prev > 0 ? prev - 1 : SPRINT_HISTORY.length - 1));
            }}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentIndex((prev) => (prev < SPRINT_HISTORY.length - 1 ? prev + 1 : 0));
            }}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrubber Timeline Bar */}
      <div className="grid grid-cols-8 gap-2 mb-8">
        {SPRINT_HISTORY.map((sp, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={sp.id}
              onClick={() => {
                setIsPlaying(false);
                setCurrentIndex(idx);
              }}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                isActive
                  ? 'bg-zinc-800 border-white text-white font-bold scale-105 shadow-lg'
                  : sp.verdict === 'ACCEPTED'
                  ? 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                  : 'bg-rose-950/20 border-rose-800/40 text-rose-400 hover:text-rose-300'
              }`}
            >
              <span className="text-[10px] block opacity-60">#{String(sp.sprintNumber).padStart(2, '0')}</span>
              <span className={`text-xs font-bold ${sp.verdict === 'ACCEPTED' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {sp.verdict === 'ACCEPTED' ? '✓ PASS' : '✗ BLOCK'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Sprint Detail Display Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSprint.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
        >
          {/* Coluna Esquerda: Detalhes do Sprint */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-zinc-800 text-white font-bold">
                  {currentSprint.id}
                </span>
                <span 
                  className="px-2.5 py-1 rounded border text-[11px] font-bold"
                  style={{
                    color: currentSprint.agentBadgeColor,
                    borderColor: `${currentSprint.agentBadgeColor}40`,
                    backgroundColor: `${currentSprint.agentBadgeColor}15`
                  }}
                >
                  {currentSprint.agent}
                </span>
              </div>
              <span className="text-zinc-500 text-[11px]">{currentSprint.timestamp}</span>
            </div>

            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
                Objetivo do Sprint:
              </span>
              <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                {currentSprint.goal}
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-black/60 border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase">Delta de Código</span>
                <span className="font-bold text-white">{currentSprint.locDelta}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/60 border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase">Suite de Testes</span>
                <span className="font-bold text-emerald-400">{currentSprint.testsDelta}</span>
              </div>
            </div>

            {/* Veredito do Gauntlet */}
            <div 
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                currentSprint.verdict === 'ACCEPTED'
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}
            >
              {currentSprint.verdict === 'ACCEPTED' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs">
                <span className="font-bold block uppercase mb-0.5">
                  Decisão do Juiz: {currentSprint.verdict}
                </span>
                <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">
                  {currentSprint.verdictReason}
                </p>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Progresso Cumulativo do Goal */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-2">
                Progresso do Global Goal
              </span>
              <div className="flex items-baseline gap-1 text-3xl sm:text-4xl font-black text-white">
                <span>{currentSprint.goalProgress}</span>
                <span style={{ color: theme.colors.primary }} className="text-base">%</span>
              </div>
              <p className="text-xs text-zinc-400 font-sans mt-2 leading-relaxed">
                Avanço verificável derivado estritamente de critérios e testes executados.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500 rounded-full"
                  style={{ 
                    width: `${currentSprint.goalProgress}%`,
                    backgroundColor: theme.colors.primary
                  }}
                />
              </div>
              <div className="text-[10px] text-zinc-500 flex justify-between font-mono">
                <span>Init (0%)</span>
                <span>Production Ready (100%)</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
