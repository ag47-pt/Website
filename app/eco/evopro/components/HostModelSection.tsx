'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { REAL_HOST_VALIDATION_DATA } from '@/data/evopro';
import { 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Lock, 
  ArrowRight,
  Sparkles,
  Search,
  Activity,
  AlertTriangle,
  FolderGit2
} from 'lucide-react';

export function HostModelSection() {
  const { theme } = useTheme();

  return (
    <section id="real-host" className="py-16 md:py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
            <Activity className="w-3.5 h-3.5" />
            EMPIRICAL FIELD VALIDATION • 2026-08-28
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Validação Empírica em Host Real (Piloto AG Menu)
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Evidência empírica vale mais do que hipóteses teóricas. O EvoPro concluiu com sucesso o seu primeiro piloto em ambiente real maduro com o resultado <strong className="text-emerald-400 font-mono">PASS</strong>, comprovando viabilidade de ponta a ponta.
          </p>
        </div>

        {/* Validation Scorecard */}
        <div className="rounded-3xl bg-zinc-950 border border-emerald-500/30 p-6 sm:p-10 shadow-2xl backdrop-blur-xl mb-12 font-mono text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-zinc-800 gap-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Relatório de Validação de Host Real: {REAL_HOST_VALIDATION_DATA.hostName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-bold">
                PILOTO: {REAL_HOST_VALIDATION_DATA.verdict}
              </span>
              <span className="text-[11px] text-zinc-500">{REAL_HOST_VALIDATION_DATA.pilotDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block mb-1">Adoção de Memória Canónica</span>
              <div className="text-zinc-200 font-semibold mb-1">evolution/ Adotada</div>
              <div className="text-zinc-400 text-[11px] font-sans">
                Modo HOST_CANONICAL_READ_ONLY sem qualquer mutação na documentação soberana.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block mb-1">Validação Comportamental A/B</span>
              <div className="text-emerald-400 font-semibold mb-1">44/44 Testes Aprovados</div>
              <div className="text-zinc-400 text-[11px] font-sans">
                29 falhas pré-correção demonstrando baseline A/B real e remediação cirúrgica de RBAC.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block mb-1">Reuso Cognitivo Qualitativo</span>
              <div className="text-cyan-400 font-semibold mb-1">Cross-Turn Validado</div>
              <div className="text-zinc-400 text-[11px] font-sans">
                Segunda tarefa reutilizou contexto adquirido sem re-inspeção cega do repositório.
              </div>
            </div>
          </div>

          {/* Key Findings List */}
          <div className="space-y-3">
            <span className="text-[10px] text-zinc-500 uppercase block font-bold">
              Evidências Observadas no Piloto:
            </span>
            {REAL_HOST_VALIDATION_DATA.keyFindings.map((finding, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-black/60 border border-zinc-800/80 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-bold text-xs">{finding.title}: </span>
                  <span className="text-zinc-400 text-[11px] font-sans">{finding.detail}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Document Reference */}
          <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-2">
            <span>Registro completo: <code>{REAL_HOST_VALIDATION_DATA.evidenceDocument}</code></span>
            <span className="text-zinc-400">Status: Validação empírica concluída</span>
          </div>
        </div>

        {/* Boundary Invariant Note */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 font-mono text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FolderGit2 className="w-5 h-5 text-purple-400 shrink-0" />
            <span>
              <strong>Isolamento Universal:</strong> O AG Menu atua estritamente como evidência de validação. Nenhum detalhe ou domínio de restaurante é incorporado ao núcleo do EvoPro.
            </span>
          </div>
          <span className="text-purple-400 font-bold shrink-0">Universal & Host-Agnostic</span>
        </div>
      </div>
    </section>
  );
}
