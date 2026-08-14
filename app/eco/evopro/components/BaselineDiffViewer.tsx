'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  GitCompare, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  FileCode2,
  Lock,
  Zap,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface DiffScenario {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  file: string;
  stateABaseline: {
    tests: string;
    errors: string;
    security: string;
  };
  stateBBaseline: {
    tests: string;
    errors: string;
    security: string;
  };
  verdict: {
    status: 'ACCEPTED' | 'REJECTED';
    critic: string;
    reason: string;
  };
  diffLines: Array<{ type: 'context' | 'add' | 'del'; content: string }>;
}

const SCENARIOS: DiffScenario[] = [
  {
    id: 'valid-improvement',
    title: '1. Mutação Válida (Melhoria Comprovada)',
    badge: 'ACEITE DETERMINÍSTICO',
    badgeColor: '#10b981',
    file: 'src/services/payment_webhook.py',
    stateABaseline: {
      tests: '48 passed (100%)',
      errors: '0 syntax errors',
      security: '0 critical findings'
    },
    stateBBaseline: {
      tests: '52 passed (+4 novos testes)',
      errors: '0 syntax errors',
      security: '0 critical findings'
    },
    verdict: {
      status: 'ACCEPTED',
      critic: 'Judge & 12 Gauntlet Critics',
      reason: 'Novos testes executados com sucesso, hash HMAC validado e zero regressões detectadas.'
    },
    diffLines: [
      { type: 'context', content: ' def handle_stripe_webhook(payload: bytes, sig_header: str) -> bool:' },
      { type: 'context', content: '     """Valida assinatura do webhook de pagamentos."""' },
      { type: 'del', content: '-    # TODO: implementar validação de assinatura' },
      { type: 'del', content: '-    return True' },
      { type: 'add', content: '+    secret = os.environ.get("STRIPE_WEBHOOK_SECRET")' },
      { type: 'add', content: '+    if not hmac.compare_digest(compute_hmac(payload, secret), sig_header):' },
      { type: 'add', content: '+        raise SecurityException("Invalid webhook signature")' },
      { type: 'add', content: '+    return True' }
    ]
  },
  {
    id: 'security-violation',
    title: '2. Violação de Segurança (Vulnerabilidade Injetada)',
    badge: 'BLOQUEIO POR SECURITY CRITIC',
    badgeColor: '#f43f5e',
    file: 'src/handlers/query_executor.py',
    stateABaseline: {
      tests: '48 passed',
      errors: '0 syntax errors',
      security: '0 critical findings'
    },
    stateBBaseline: {
      tests: '49 passed',
      errors: '0 syntax errors',
      security: '1 CRITICAL FINDING (eval() detected)'
    },
    verdict: {
      status: 'REJECTED',
      critic: 'SecurityCritic',
      reason: 'Tentativa de usar eval() dinâmico em entrada do utilizador. Rejeição imediata antes do commit.'
    },
    diffLines: [
      { type: 'context', content: ' def execute_dynamic_filter(filter_expr: str, data: dict) -> bool:' },
      { type: 'del', content: '-    return safe_ast_eval(filter_expr, data)' },
      { type: 'add', content: '+    # Agente de IA tentou atalho perigoso:' },
      { type: 'add', content: '+    return eval(f"data.{filter_expr}")  # ALERTA DE SEGURANÇA' },
      { type: 'context', content: ' ' }
    ]
  },
  {
    id: 'scope-violation',
    title: '3. Violação de Scope (Arquivo Protegido)',
    badge: 'BLOQUEIO POR SCOPE CRITIC',
    badgeColor: '#f59e0b',
    file: '.evolution/goal/global-goal.json',
    stateABaseline: {
      tests: '48 passed',
      errors: '0 syntax errors',
      security: '0 critical findings'
    },
    stateBBaseline: {
      tests: '48 passed',
      errors: '0 syntax errors',
      security: 'Protected Scope Tampering'
    },
    verdict: {
      status: 'REJECTED',
      critic: 'ScopeCritic',
      reason: 'Agente tentou alterar os próprios critérios de aceitação do Goal para forçar aprovação.'
    },
    diffLines: [
      { type: 'context', content: ' "criteria": [' },
      { type: 'context', content: '   {"id": "CRIT-TEST", "exit_code": 0},' },
      { type: 'del', content: '-  {"id": "CRIT-HUMAN-UX", "human_confirmed": true}' },
      { type: 'add', content: '+  {"id": "CRIT-HUMAN-UX", "human_confirmed": false} // Agente removeu exigência' },
      { type: 'context', content: ' ]' }
    ]
  }
];

export function BaselineDiffViewer() {
  const { theme } = useTheme();
  const [activeScenarioId, setActiveScenarioId] = useState<string>('valid-improvement');

  const activeScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  return (
    <div className="rounded-3xl bg-zinc-950/90 border border-zinc-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl font-mono mb-12">
      {/* Header do Módulo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <GitCompare className="w-4 h-4" />
            <span>DIFF VIEWER DETERMINÍSTICO • STATE A VS STATE B</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Inspeção Comparativa de Mutações
          </h3>
        </div>
        <span className="text-[11px] text-zinc-500 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
          Simule a análise dos 12 Gauntlet Critics
        </span>
      </div>

      {/* Seletor de Cenários */}
      <div className="flex flex-wrap gap-2 mb-8">
        {SCENARIOS.map((sc) => {
          const isSelected = activeScenarioId === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => setActiveScenarioId(sc.id)}
              className={`px-4 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-zinc-800 text-white font-bold border border-zinc-600 shadow-md scale-105'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-zinc-800/80'
              }`}
            >
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: sc.badgeColor }} 
              />
              <span>{sc.title}</span>
            </button>
          );
        })}
      </div>

      {/* Grid de Inspeção: Métricas State A/B + Diff Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Painel do Código (Git Diff Viewer) */}
        <div className="lg:col-span-8 rounded-2xl bg-black border border-zinc-800 overflow-hidden shadow-xl">
          {/* Diff Header */}
          <div className="bg-zinc-900/80 px-4 py-3 border-b border-zinc-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <FileCode2 className="w-4 h-4 text-amber-400" />
              <span className="font-bold">{activeScenario.file}</span>
            </div>
            <span 
              className="text-[10px] font-bold px-2 py-0.5 rounded border uppercase"
              style={{
                color: activeScenario.badgeColor,
                borderColor: `${activeScenario.badgeColor}40`,
                backgroundColor: `${activeScenario.badgeColor}15`
              }}
            >
              {activeScenario.badge}
            </span>
          </div>

          {/* Diff Code Lines */}
          <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed divide-y divide-zinc-900">
            {activeScenario.diffLines.map((line, idx) => (
              <div 
                key={idx}
                className={`py-1 px-2 rounded flex items-start gap-2 ${
                  line.type === 'add'
                    ? 'bg-emerald-500/10 text-emerald-300'
                    : line.type === 'del'
                    ? 'bg-rose-500/10 text-rose-300 line-through'
                    : 'text-zinc-400'
                }`}
              >
                <span className="w-4 select-none font-bold text-zinc-600">
                  {line.type === 'add' ? '+' : line.type === 'del' ? '-' : ' '}
                </span>
                <span className="whitespace-pre">{line.content}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Painel do Veredito & Baselines */}
        <div className="lg:col-span-4 space-y-4 text-xs">
          {/* Card State A */}
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-1.5">
            <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase font-bold">
              <span>STATE A (Antes)</span>
              <span>BASELINE CONGELADA</span>
            </div>
            <div className="text-zinc-300 space-y-1 text-[11px]">
              <div>• Testes: <span className="text-white">{activeScenario.stateABaseline.tests}</span></div>
              <div>• Sintaxe: <span className="text-white">{activeScenario.stateABaseline.errors}</span></div>
              <div>• Segurança: <span className="text-white">{activeScenario.stateABaseline.security}</span></div>
            </div>
          </div>

          {/* Card State B */}
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-1.5">
            <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase font-bold">
              <span>STATE B (Depois)</span>
              <span>RESULTADO DA MUTAÇÃO</span>
            </div>
            <div className="text-zinc-300 space-y-1 text-[11px]">
              <div>• Testes: <span className="text-white">{activeScenario.stateBBaseline.tests}</span></div>
              <div>• Sintaxe: <span className="text-white">{activeScenario.stateBBaseline.errors}</span></div>
              <div>• Segurança: <span className="text-white">{activeScenario.stateBBaseline.security}</span></div>
            </div>
          </div>

          {/* Veredito Final do Gauntlet */}
          <div 
            className="p-4 rounded-2xl border space-y-2 shadow-lg"
            style={{
              backgroundColor: `${activeScenario.badgeColor}10`,
              borderColor: `${activeScenario.badgeColor}40`
            }}
          >
            <div className="flex items-center gap-2 font-bold" style={{ color: activeScenario.badgeColor }}>
              {activeScenario.verdict.status === 'ACCEPTED' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span>VEREDITO: {activeScenario.verdict.status}</span>
            </div>
            <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">
              <strong>{activeScenario.verdict.critic}:</strong> {activeScenario.verdict.reason}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
