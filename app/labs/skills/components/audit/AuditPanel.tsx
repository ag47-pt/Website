'use client';

import React, { useState } from 'react';
import { AuditReport } from '@/lib/design-system/types';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface AuditPanelProps {
  audit: AuditReport;
}

export function AuditPanel({ audit }: AuditPanelProps) {
  const [copied, setCopied] = useState(false);
  const { coverage, missingSpecifications } = audit;

  const handleCopyReport = () => {
    navigator.clipboard.writeText(JSON.stringify(audit, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(audit, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `audit-${audit.specName.toLowerCase().replace(/\s+/g, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-10">
      {/* Header with Overall Score Gauge */}
      <div className="p-6 sm:p-8 bg-zinc-950/90 border border-white/10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Auditoria Determinística de Contrato</span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">{audit.specName}</h3>
          <p className="text-xs text-zinc-400 max-w-lg">
            Avaliação matemática de cobertura baseada no schema oficial v{audit.specVersion}. Elementos declarados como
            <code className="text-zinc-200 mx-1">NOT_APPLICABLE</code> são excluídos do denominador.
          </p>
        </div>

        {/* Score Radial / Badge */}
        <div className="flex items-center gap-4 shrink-0 bg-zinc-900/80 p-4 rounded-2xl border border-white/5">
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">Score Geral</span>
            <span className="text-xs font-bold text-emerald-400">
              {audit.passedTests} de {audit.totalTests} itens
            </span>
          </div>
          <div className="w-20 h-20 rounded-full border-4 border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center">
            <span className="text-2xl font-black text-emerald-400">{coverage.overallPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown Bars */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-zinc-400">Cobertura por Categoria</h4>
          <span className="text-[11px] font-mono text-zinc-500">8 Dimensões Auditadas</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coverage.categories.map((cat) => (
            <div
              key={cat.category}
              className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl space-y-2 hover:border-white/15 transition-all"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-200">{cat.category}</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[11px] text-zinc-400">
                    {cat.defined + cat.inherited} / {cat.effectiveTotal}
                  </span>
                  <span
                    className={`font-black ${
                      cat.percentage >= 90
                        ? 'text-emerald-400'
                        : cat.percentage >= 70
                        ? 'text-amber-400'
                        : 'text-red-400'
                    }`}
                  >
                    {cat.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    cat.percentage >= 90
                      ? 'bg-emerald-400'
                      : cat.percentage >= 70
                      ? 'bg-amber-400'
                      : 'bg-red-400'
                  }`}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>

              {cat.not_applicable > 0 && (
                <span className="text-[10px] font-mono text-zinc-500 block">
                  ({cat.not_applicable} itens marcados como NOT_APPLICABLE)
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Missing Specifications / Audit Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-zinc-400">
            Itens Pendentes ou Recomendados ({missingSpecifications.length})
          </h4>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyReport}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-zinc-900 border border-white/10 rounded-lg text-zinc-300 hover:text-white transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar JSON'}</span>
            </button>
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-zinc-900 border border-white/10 rounded-lg text-zinc-300 hover:text-white transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Relatório</span>
            </button>
          </div>
        </div>

        {missingSpecifications.length === 0 ? (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Nenhuma especificação ausente detectada. Todas as fundações e estados estão 100% preenchidos!</span>
          </div>
        ) : (
          <div className="border border-white/10 rounded-xl overflow-hidden bg-zinc-950/60 divide-y divide-white/5">
            {missingSpecifications.map((item, idx) => (
              <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-200">{item.name}</span>
                    <span className="font-mono text-[10px] text-zinc-500">({item.elementId})</span>
                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        item.severity === 'critical'
                          ? 'bg-red-500/20 text-red-400'
                          : item.severity === 'warning'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">{item.suggestion}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">{item.section}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
