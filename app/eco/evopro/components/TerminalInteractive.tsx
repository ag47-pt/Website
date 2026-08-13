'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { EVOPRO_CONFIG, EVOPRO_VERSION_LABEL } from '@/data/evopro';
import {
  Terminal, 
  Copy, 
  Check, 
  Play, 
  Layers, 
  Activity, 
  ShieldCheck, 
  Network,
  FileText
} from 'lucide-react';

interface TerminalTab {
  id: string;
  title: string;
  command: string;
  output: string;
}

export function TerminalInteractive() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('status');
  const [copied, setCopied] = useState(false);

  const tabs: TerminalTab[] = [
    {
      id: 'status',
      title: 'Status Geral',
      command: 'evolution status',
      output: `{
  "project": "billing-service",
  "workspace_type": "HOST",
  "protocol_version": "${EVOPRO_CONFIG.version}",
  "state": "READY_FOR_CYCLES",
  "active_cycle": "cycle-95e53157",
  "last_snapshot": "snapshot-20260813T201300Z.json",
  "intent_confirmed": true,
  "global_goal": {
    "objective": "Transformar este host num SaaS pronto para produção",
    "status": "ACTIVE",
    "progress": 0.75,
    "satisfied": 3,
    "total": 4
  },
  "active_sprint": {
    "sprint_id": "sprint-014-a3f9c1",
    "status": "ACTIVE",
    "objective": "Integrar webhooks de faturamento e testes de carga"
  },
  "run": {
    "status": "RUNNING",
    "mode": "goal-driven",
    "paused": false
  },
  "stop_condition": null
}`
    },
    {
      id: 'goal',
      title: 'Avaliação de Goal',
      command: 'evolution goal evaluate',
      output: `{
  "goal_id": "goal-1f11bb4f",
  "objective": "Transformar este host num SaaS pronto para produção",
  "evaluated_at": "2026-08-13T07:15:00.412903+00:00",
  "achieved": false,
  "progress": 0.75,
  "commands_executed": true,
  "satisfied_count": 3,
  "total_count": 4,
  "results": [
    {
      "criterion_id": "CRIT-TEST",
      "description": "All host tests pass",
      "kind": "command",
      "outcome": "SATISFIED",
      "evidence": "\`npm run test\` exited 0"
    },
    {
      "criterion_id": "CRIT-BUILD",
      "description": "Host build succeeds",
      "kind": "command",
      "outcome": "SATISFIED",
      "evidence": "\`npm run build\` exited 0"
    },
    {
      "criterion_id": "CRIT-NO-CRITICAL-FINDINGS",
      "description": "No open critical findings",
      "kind": "no_findings_above",
      "outcome": "SATISFIED",
      "evidence": "0 finding(s) of severity 'critical'"
    },
    {
      "criterion_id": "CRIT-HUMAN-UX",
      "description": "Fluxo de checkout validado por um humano",
      "kind": "human_confirmed",
      "outcome": "UNSATISFIED",
      "evidence": "awaiting human confirmation"
    }
  ]
}`
    },
    {
      id: 'baseline',
      title: 'Baseline Compare',
      command: 'evolution baseline compare --before before --after after',
      output: `{
  "before_id": "baseline-a1573770",
  "after_id": "baseline-2c59af44",
  "compared_at": "2026-08-13T20:42:35.030536+00:00",
  "is_improvement": true,
  "regression_count": 0,
  "improvement_count": 1,
  "uncomparable_count": 0,
  "deltas": [
    {
      "dimension": "test",
      "kind": "command",
      "verdict": "IMPROVEMENT",
      "before": "failed",
      "after": "passed",
      "detail": "exit 1 -> exit 0"
    },
    {
      "dimension": "source_lines",
      "kind": "structure",
      "verdict": "UNCHANGED",
      "before": 4218,
      "after": 4358,
      "detail": ""
    }
  ]
}`
    },
    {
      id: 'gauntlet',
      title: 'Gauntlet Run',
      command: 'evolution gauntlet run',
      output: `{
  "gauntlet_id": "gauntlet-4c2baecb",
  "strategy": "sequential_role_separation",
  "started_at": "2026-08-13T17:11:20.612049+00:00",
  "completed_at": "2026-08-13T17:11:24.881203+00:00",
  "passed": true,
  "critical_count": 0,
  "error_count": 0,
  "warning_count": 1,
  "critics": [
    { "critic": "scope", "status": "ran", "reason": "", "finding_count": 0 },
    { "critic": "security", "status": "ran", "reason": "", "finding_count": 0 },
    { "critic": "dependency_impact", "status": "ran", "reason": "", "finding_count": 1 },
    {
      "critic": "performance",
      "status": "unavailable",
      "reason": "host declares no performance profile",
      "finding_count": 0
    }
  ],
  "findings": [
    {
      "critic": "dependency_impact",
      "code": "AFFECTED_COMPONENTS_UNTESTED",
      "severity": "warning",
      "message": "2 dependent components have no covering test"
    }
  ]
}`
    },
    {
      id: 'graph',
      title: 'Graph Impact',
      command: 'evolution graph impact src/service.py --depth 3',
      output: `{
  "target": "file:src/service.py",
  "traversal_depth": 3,
  "nodes_reached": 14,
  "direct_dependents": [
    "file:src/api/routes.py",
    "file:src/handlers/webhook.py"
  ],
  "affected_test_suites": [
    "file:tests/test_service.py",
    "file:tests/test_api_integration.py"
  ],
  "impact_confidence": 1.0,
  "provenance": "AST OBSERVED"
}`
    }
  ];

  // Atalho de teclado (Teclas 1 a 5) para alternar abas do terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora se o utilizador estiver a digitar num input ou textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= tabs.length) {
        setActiveTab(tabs[keyNum - 1].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

  const playCopySound = () => {
    try {
      if (typeof localStorage !== 'undefined' && localStorage.getItem('evopro_sound_muted') === 'true') return;
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Ignora silenciosamente se o navegador proibir áudio automático
    }
  };

  const copyCommand = () => {
    navigator.clipboard.writeText(currentTab.command);
    playCopySound();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="terminal-demo" className="py-16 md:py-24 border-t border-white/5 relative bg-zinc-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
            <Terminal className="w-3.5 h-3.5" />
            DEMONSTRAÇÃO INTERATIVA DA CLI
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Terminal em Ação
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Inspecione saídas reais geradas pelos comandos determinísticos do EvoPro. Pressione as teclas <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-zinc-700 font-mono text-xs">1</kbd> a <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-zinc-700 font-mono text-xs">5</kbd> para alternar abas rapidamente.
          </p>
        </div>

        {/* Terminal Window Box com efeito de Glow ao copiar */}
        <div 
          className={`max-w-4xl mx-auto rounded-3xl bg-black border shadow-2xl overflow-hidden font-mono text-xs backdrop-blur-2xl transition-all duration-500 ${
            copied 
              ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.35)] scale-[1.005]' 
              : 'border-zinc-800'
          }`}
        >
          {/* Terminal Titlebar & Tabs */}
          <div className="bg-zinc-900/90 px-4 py-3 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-[11px] text-zinc-500 ml-2 hidden sm:inline">bash — evopro-host</span>
            </div>

            {/* Tabs com números de atalho */}
            <div className="flex flex-wrap items-center gap-1">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1 rounded-lg text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-zinc-800 text-emerald-400 font-bold border border-zinc-700 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                >
                  <span className="text-[9px] opacity-60 font-mono text-zinc-500">[{idx + 1}]</span>
                  <span>{tab.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Command Line */}
          <div className="p-4 sm:p-6 bg-zinc-950 flex items-center justify-between border-b border-zinc-900">
            <div className="flex items-center gap-2 text-sm text-zinc-200 overflow-x-auto">
              <span className="text-emerald-400 select-none font-bold">$</span>
              <span className="text-white font-semibold">{currentTab.command}</span>
            </div>
            <button
              onClick={copyCommand}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono border transition-all cursor-pointer shrink-0 ml-2 ${
                copied 
                  ? 'bg-emerald-500 text-black font-bold border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-800'
              }`}
              title="Copiar comando"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>

          {/* Terminal Output Area */}
          <div className="p-4 sm:p-6 bg-zinc-950/95 overflow-x-auto max-h-[380px] overflow-y-auto">
            <pre className="text-zinc-300 text-xs sm:text-[13px] leading-relaxed font-mono">
              <code>{currentTab.output}</code>
            </pre>
          </div>

          {/* Terminal Footer Info */}
          <div className="bg-zinc-900/60 px-4 py-2 border-t border-zinc-800/80 text-[10px] text-zinc-500 flex items-center justify-between">
            <span>Saída real do CLI {EVOPRO_VERSION_LABEL} — stdout é sempre JSON</span>
            <span>Atalhos: Teclas 1 a 5 para navegar</span>
          </div>
        </div>
      </div>
    </section>
  );
}
