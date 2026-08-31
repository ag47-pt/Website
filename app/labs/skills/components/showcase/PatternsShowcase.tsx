'use client';

import React from 'react';
import { NormalizedDesignSystem } from '@/lib/design-system/types';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface PatternsShowcaseProps {
  spec: NormalizedDesignSystem;
}

export function PatternsShowcase({ spec }: PatternsShowcaseProps) {
  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-xl font-bold tracking-tight mb-2">Composição de Padrões & Layouts</h3>
        <p className="text-sm opacity-70">
          Estruturas compostas construídas unicamente a partir dos tokens normalizados do Design System.
        </p>
      </div>

      {/* 1. Hero Pattern */}
      <div className="space-y-3">
        <span className="text-xs font-mono font-bold tracking-widest uppercase opacity-60">1. Hero Section Pattern</span>
        <div
          className="p-8 sm:p-12 border border-[var(--ds-border)] bg-[var(--ds-surface)] space-y-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8"
          style={{
            borderRadius: 'var(--ds-radius-lg)',
            boxShadow: 'var(--ds-shadow-sm)',
          }}
        >
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-[var(--ds-primary)]/15 text-[var(--ds-primary)]">
              <Zap className="w-3.5 h-3.5" />
              <span>Nova Especificação v1.0</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--ds-text-primary)] leading-tight">
              Transforme Design em Contrato Executável
            </h2>
            <p className="text-sm text-[var(--ds-text-secondary)] leading-relaxed">
              Elimine ambiguidades visuais e alinhe desenvolvedores, designers e agentes autônomos em um único schema determinístico.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
              <button
                className="px-5 py-2.5 text-xs font-bold bg-[var(--ds-primary)] text-[var(--ds-bg)] flex items-center gap-2 shadow-md hover:brightness-110 transition-all"
                style={{ borderRadius: 'var(--ds-radius-md)' }}
              >
                <span>Explorar Bancada</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                className="px-5 py-2.5 text-xs font-semibold border border-[var(--ds-border)] text-[var(--ds-text-primary)] hover:bg-white/5 transition-all"
                style={{ borderRadius: 'var(--ds-radius-md)' }}
              >
                Ver Documentação
              </button>
            </div>
          </div>

          <div
            className="w-full sm:w-72 h-48 border border-[var(--ds-border)] bg-[var(--ds-bg)] flex flex-col items-center justify-center p-6 text-center shrink-0 shadow-inner"
            style={{ borderRadius: 'var(--ds-radius-md)' }}
          >
            <ShieldCheck className="w-10 h-10 text-[var(--ds-primary)] mb-2" />
            <span className="text-xs font-bold text-[var(--ds-text-primary)]">Validação 100% Determinística</span>
            <span className="text-[10px] text-[var(--ds-text-muted)] mt-1 font-mono">Zero Alucinação // Zero LLM</span>
          </div>
        </div>
      </div>

      {/* 2. Feature Grid */}
      <div className="space-y-3">
        <span className="text-xs font-mono font-bold tracking-widest uppercase opacity-60">2. Feature Section Grid</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Parsing Seguro',
              desc: 'Leitura de markdown estruturado sem eval, interpretando metadados e tabelas com tipagem forte.',
            },
            {
              title: 'Cálculo de Cobertura',
              desc: 'Score matemático exato por categoria, descontando elementos não aplicáveis do denominador.',
            },
            {
              title: 'Isolamento de Estilo',
              desc: 'Superfície de renderização blindada com CSS Scoped, protegida contra estilos globais.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 border border-[var(--ds-border)] bg-[var(--ds-surface)] space-y-3"
              style={{
                borderRadius: 'var(--ds-radius-md)',
                boxShadow: 'var(--ds-shadow-sm)',
              }}
            >
              <div className="w-7 h-7 rounded bg-[var(--ds-primary)]/10 text-[var(--ds-primary)] flex items-center justify-center font-bold text-xs">
                0{idx + 1}
              </div>
              <h4 className="text-sm font-bold text-[var(--ds-text-primary)]">{item.title}</h4>
              <p className="text-xs text-[var(--ds-text-secondary)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CTA Section */}
      <div className="space-y-3">
        <span className="text-xs font-mono font-bold tracking-widest uppercase opacity-60">3. Call to Action (CTA) Section</span>
        <div
          className="p-8 border border-[var(--ds-primary)]/30 bg-[var(--ds-primary)]/10 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{
            borderRadius: 'var(--ds-radius-lg)',
          }}
        >
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-[var(--ds-text-primary)]">Pronto para validar seu Design System?</h4>
            <p className="text-xs text-[var(--ds-text-secondary)]">Baixe o modelo oficial .md e passe para sua equipe ou agente de IA.</p>
          </div>
          <button
            className="px-6 py-3 text-xs font-bold bg-[var(--ds-primary)] text-[var(--ds-bg)] shrink-0 shadow-lg hover:brightness-110 transition-all"
            style={{ borderRadius: 'var(--ds-radius-md)' }}
          >
            Baixar Template Oficial
          </button>
        </div>
      </div>
    </div>
  );
}
