'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  Activity, 
  FileCheck, 
  History, 
  Search, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  Database
} from 'lucide-react';

export function ObservabilitySection() {
  const { theme } = useTheme();

  return (
    <section id="observability" className="py-16 md:py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
            <Activity className="w-3.5 h-3.5" />
            EVIDENCE-BASED AUDITABILITY
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Observabilidade & Ledger Imutável
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Cada ciclo de evolução deixa uma trilha de evidências gravada no disco. Um auditor ou developer consegue responder a qualquer momento: <em>o que mudou, porquê, como foi testado, o que falhou e por que razão foi aceite.</em>
          </p>
        </div>

        {/* Ledger Event Visualizer */}
        <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl mb-12 font-mono text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-zinc-800 gap-2">
            <div className="flex items-center gap-2 text-white font-bold">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Registo Estruturado de Ciclo (#014)</span>
            </div>
            <div className="text-[11px] text-zinc-500">
              Persistido em: <code className="text-zinc-400">.evolution/knowledge/ledger.jsonl</code>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">Global Goal & Sprint</span>
                <div className="text-zinc-200 font-semibold mb-1">SPRINT-014 (SaaS Production)</div>
                <div className="text-zinc-400 text-[11px] font-sans">Foco: Integração de webhooks & idempotência</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">Baseline Comparison</span>
                <div className="text-emerald-400 font-semibold mb-1">is_improvement = True</div>
                <div className="text-zinc-400 text-[11px] font-sans">Zero regressões em 52 suites de testes</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">Veredito do Judge</span>
                <div className="text-emerald-400 font-semibold mb-1">ACCEPT (Verdict #014)</div>
                <div className="text-zinc-400 text-[11px] font-sans">9 críticos adversariais concluídos sem findings</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/80 border border-zinc-800 text-zinc-300 text-[11px] leading-relaxed">
              <div className="text-zinc-500 text-[10px] uppercase mb-1">Evidências Indexadas no Ledger:</div>
              <div className="text-zinc-400">
                • Changeset Hash: <code className="text-cyan-300">0x47e9a8...</code><br />
                • Gauntlet Report: <code className="text-cyan-300">.evolution/runtime/gauntlet/report.json</code> (Zero blocking findings)<br />
                • Learnings Promovidos: <code className="text-cyan-300">.evolution/knowledge/learnings.json</code> (Idempotência confirmada via redis lock)
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Comando de auditoria: <code>evolution audit</code></span>
            <span>Histórico completo: <code>evolution history --limit 50</code></span>
          </div>
        </div>
      </div>
    </section>
  );
}
