'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  Layers, 
  Activity, 
  ShieldCheck, 
  Network,
  FileText,
  Sparkles,
  BrainCircuit,
  Database
} from 'lucide-react';

interface TerminalTab {
  id: string;
  title: string;
  command: string;
  output: string;
}

export function TerminalInteractive() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('assess');
  const [copied, setCopied] = useState(false);

  const tabs: TerminalTab[] = [
    {
      id: 'assess',
      title: 'Second Brain Assess',
      command: 'evolution second-brain assess',
      output: `# AG47.pt 🧠 EvoPro • Repository Assessment

• Workspace: WORKSPACE_HOST (Python 3.13 / Next.js)
• Memória Soberana: evolution/ (Adotada: HOST_CANONICAL_READ_ONLY)
• Context Router: Auto-indexed (14 domínios, 8 contratos, 3 ADRs)
• Status de Telemetria: Fail-open ativo (.evolution/runtime/telemetry/)
• Riscos Detectados: 2 candidatos (RBAC Firestore, Webhook signature)

🧭 Próxima Ação Recomendada:
Executar auditoria de contratos em src/auth/ e validar testes de RBAC.`
    },
    {
      id: 'route',
      title: 'Context Route',
      command: 'evolution second-brain route "melhorar autenticação de funcionários"',
      output: `{
  "task": "melhorar autenticação de funcionários",
  "routing_mode": "ADOPTED_MEMORY",
  "indices_ready": true,
  "relevant_domains": [
    "Domain: Employees",
    "Domain: Authentication",
    "Domain: Permissions"
  ],
  "contracts": [
    "Contract: firestore.rules",
    "Contract: src/lib/auth.ts"
  ],
  "associated_risks": [
    "RISK-001: Leitura irrestrita de coleções de colaboradores"
  ],
  "primary_evidence_files": [
    "firestore.rules",
    "tests/test_firestore_rules.py"
  ],
  "token_saving_estimated_percent": 74.2
}`
    },
    {
      id: 'telemetry',
      title: 'Telemetry Compare',
      command: 'evolution second-brain telemetry compare --session-a sess_cold --session-b sess_warm --format markdown',
      output: `# AG47.pt 📊 EvoPro • Cognitive Telemetry Comparison

| Dimensão | Sessão A (Cold Boot) | Sessão B (Warm Router) | Delta / Ganho |
|---|---|---|---|
| Duração da Fase (NATIVE) | 4.82s | 1.12s | **-76.8% (3.70s poupados)** |
| Ficheiros Inspecionados (NATIVE) | 18 arquivos | 4 arquivos | **-77.8% (14 leituras evitadas)** |
| Context Tokens (ESTIMATED) | ~28.4k tokens | ~7.2k tokens | **-74.6% context load** |
| Routing Mode (NATIVE) | COLD_BOOT | ADOPTED_MEMORY | Readiness comprovada |

✅ Reuso cognitivo qualitativo observado em host real.`
    },
    {
      id: 'run',
      title: 'Autonomous Run',
      command: 'evolution run --mode goal-driven',
      output: `[EVOPRO] Invocando loop de evolução governada (Mode: GOAL_DRIVEN)...
[CYCLE-014] SPRINT-014: "Idempotência de Webhooks e Isolamento de Tenants"
  ├─ Baseline A: 44 passed, 0 errors (State A capturado)
  ├─ Proposed Mutation: 2 files modified in evolution/exec_47a8
  ├─ Baseline B: 44 passed, 0 errors (State B capturado)
  ├─ Gauntlet: 9 Critics evaluated → 0 blocking findings
  ├─ Judge: ACCEPT (Veredito emitido)
  └─ Learn: Lições persistidas em CONTINUITY.md e telemetry ledger

[GLOBAL GOAL] 4/4 Critérios Aprovados com Evidências.
[EVOPRO] Objetivo alcançado. Execução concluída.`
    },
    {
      id: 'doctor',
      title: 'Doctor Check',
      command: 'evolution doctor',
      output: `✓ Protocol Version: 0.3.1 (Supported)
✓ Workspace: WORKSPACE_HOST (/host/project)
✓ Memory Adoption: evolution/ detected (HOST_CANONICAL_READ_ONLY)
✓ Runtime Storage: .evolution/runtime/ ready
✓ Context Router: Readiness verified (all candidate indices ready)
✓ Telemetry: Fail-open ledger active
✓ Ast Indexer: Ready (stdlib ast available)
✓ Status: PROTOCOL READY FOR AGENT-FIRST SESSIONS`
    }
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    } catch {}
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
            SIMULADOR INTERATIVO DA CLI EM TEMPO REAL
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Terminal e Ações do Second Brain
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Inspecione saídas reais geradas pelo Second Brain, Context Router, telemetria fail-open e loop determinístico do EvoPro.
          </p>
        </div>

        {/* Terminal Window Box */}
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
              <span className="text-[11px] text-zinc-500 ml-2 hidden sm:inline">bash — evopro-v0.3.1</span>
            </div>

            {/* Tabs */}
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

          {/* Preset Command Line */}
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

          {/* Preset Output Area */}
          <div className="p-4 sm:p-6 bg-zinc-950/95 overflow-x-auto max-h-[380px] overflow-y-auto">
            <pre className="text-zinc-300 text-xs sm:text-[13px] leading-relaxed font-mono">
              <code>{currentTab.output}</code>
            </pre>
          </div>

          {/* Terminal Footer Info */}
          <div className="bg-zinc-900/60 px-4 py-2 border-t border-zinc-800/80 text-[10px] text-zinc-500 flex items-center justify-between">
            <span>EvoPro Kernel v0.3.1 • Real-Host Verified</span>
            <span>Atalhos: Teclas 1 a 5 para abas</span>
          </div>
        </div>
      </div>
    </section>
  );
}
