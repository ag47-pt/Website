'use client';

import React, { useState } from 'react';
import { NormalizedDesignSystem } from '@/lib/design-system/types';
import {
  ArrowRight,
  Search,
  Check,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface ComponentShowcaseProps {
  spec: NormalizedDesignSystem;
}

export function ComponentShowcase({ spec }: ComponentShowcaseProps) {
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [switchActive, setSwitchActive] = useState(true);
  const [sampleInputValue, setSampleInputValue] = useState('Texto de exemplo');

  const btnPrimary = spec.components['button.primary'];
  const btnSecondary = spec.components['button.secondary'];
  const btnGhost = spec.components['button.ghost'];
  const btnDestructive = spec.components['button.destructive'];
  const inputText = spec.components['input.text'];
  const checkboxSpec = spec.components['checkbox'];
  const switchSpec = spec.components['switch'];
  const badgeSpec = spec.components['badge'];
  const alertSpec = spec.components['alert'];

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-xl font-bold tracking-tight mb-2">Bancada de Componentes & Estados</h3>
        <p className="text-sm opacity-70">
          Renderização determinística de cada componente do sistema em seus múltiplos estados operacionais: Default, Hover, Active, Focus, Disabled e Loading.
        </p>
      </div>

      {/* 1. BUTTON SUITE */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h4 className="text-xs font-mono font-bold tracking-widest uppercase opacity-60">1. Buttons Suite</h4>
          <span className="text-[11px] font-mono opacity-50">Multi-State Interactive Sandbox</span>
        </div>

        {/* Primary Button Matrix */}
        <div className="p-5 rounded-xl border border-white/10 bg-[var(--ds-surface)] space-y-4" style={{ borderRadius: 'var(--ds-radius-md)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold">PRIMARY BUTTON</span>
              <span className="text-[10px] font-mono opacity-60">button.primary</span>
            </div>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                btnPrimary?.status === 'DEFINED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              {btnPrimary?.status || 'DEFINED'}
            </span>
          </div>

          {btnPrimary?.status === 'NOT_DEFINED' ? (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 font-mono">
              SPEC NOT_DEFINED: O Design System não define button.primary.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {/* Default */}
              <div className="flex flex-col items-center gap-2 p-3 bg-black/20 rounded-lg">
                <span className="text-[10px] font-mono opacity-50">Default</span>
                <button
                  className="px-4 py-2 font-bold text-xs shadow-sm transition-all text-[var(--ds-bg)] bg-[var(--ds-primary)]"
                  style={{
                    borderRadius: btnPrimary?.radius || 'var(--ds-radius-md)',
                  }}
                >
                  Continuar
                </button>
              </div>

              {/* Hover */}
              <div className="flex flex-col items-center gap-2 p-3 bg-black/20 rounded-lg">
                <span className="text-[10px] font-mono opacity-50">Hover (Simulado)</span>
                <button
                  className="px-4 py-2 font-bold text-xs shadow-md transition-all text-[var(--ds-bg)] bg-[var(--ds-primary)] brightness-110 -translate-y-0.5"
                  style={{
                    borderRadius: btnPrimary?.radius || 'var(--ds-radius-md)',
                  }}
                >
                  Continuar
                </button>
              </div>

              {/* Focus */}
              <div className="flex flex-col items-center gap-2 p-3 bg-black/20 rounded-lg">
                <span className="text-[10px] font-mono opacity-50">Focus Ring</span>
                <button
                  className="px-4 py-2 font-bold text-xs transition-all text-[var(--ds-bg)] bg-[var(--ds-primary)]"
                  style={{
                    borderRadius: btnPrimary?.radius || 'var(--ds-radius-md)',
                    boxShadow: 'var(--ds-focus-ring)',
                  }}
                >
                  Focado
                </button>
              </div>

              {/* Disabled */}
              <div className="flex flex-col items-center gap-2 p-3 bg-black/20 rounded-lg">
                <span className="text-[10px] font-mono opacity-50">Disabled</span>
                <button
                  disabled
                  className="px-4 py-2 font-bold text-xs opacity-50 cursor-not-allowed bg-zinc-600 text-zinc-300"
                  style={{
                    borderRadius: btnPrimary?.radius || 'var(--ds-radius-md)',
                  }}
                >
                  Bloqueado
                </button>
              </div>

              {/* Loading */}
              <div className="flex flex-col items-center gap-2 p-3 bg-black/20 rounded-lg">
                <span className="text-[10px] font-mono opacity-50">Loading</span>
                <button
                  disabled
                  className="px-4 py-2 font-bold text-xs text-[var(--ds-bg)] bg-[var(--ds-primary)] opacity-80 flex items-center gap-1.5 cursor-wait"
                  style={{
                    borderRadius: btnPrimary?.radius || 'var(--ds-radius-md)',
                  }}
                >
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Processando</span>
                </button>
              </div>

              {/* With Icon */}
              <div className="flex flex-col items-center gap-2 p-3 bg-black/20 rounded-lg">
                <span className="text-[10px] font-mono opacity-50">Icon Right</span>
                <button
                  className="px-4 py-2 font-bold text-xs text-[var(--ds-bg)] bg-[var(--ds-primary)] flex items-center gap-1.5 shadow-sm"
                  style={{
                    borderRadius: btnPrimary?.radius || 'var(--ds-radius-md)',
                  }}
                >
                  <span>Avançar</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Secondary & Ghost Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Secondary */}
          <div className="p-5 rounded-xl border border-white/10 bg-[var(--ds-surface)] space-y-4" style={{ borderRadius: 'var(--ds-radius-md)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">SECONDARY BUTTON</span>
              <span className="text-[10px] font-mono opacity-50">button.secondary</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                className="px-4 py-2 text-xs font-semibold border border-[var(--ds-border)] text-[var(--ds-text-primary)] hover:bg-white/5 transition-all"
                style={{ borderRadius: btnSecondary?.radius || 'var(--ds-radius-md)' }}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 text-xs font-semibold border border-[var(--ds-border)] text-[var(--ds-text-primary)] flex items-center gap-1.5"
                style={{ borderRadius: btnSecondary?.radius || 'var(--ds-radius-md)' }}
              >
                <Plus className="w-3 h-3" />
                <span>Adicionar Item</span>
              </button>
            </div>
          </div>

          {/* Ghost & Destructive */}
          <div className="p-5 rounded-xl border border-white/10 bg-[var(--ds-surface)] space-y-4" style={{ borderRadius: 'var(--ds-radius-md)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">GHOST & DESTRUCTIVE</span>
              <span className="text-[10px] font-mono opacity-50">ghost / destructive</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                className="px-4 py-2 text-xs font-semibold text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)] hover:bg-white/5 transition-all"
                style={{ borderRadius: btnGhost?.radius || 'var(--ds-radius-sm)' }}
              >
                Voltar
              </button>
              <button
                className="px-4 py-2 text-xs font-semibold bg-[var(--ds-error)] text-white hover:brightness-110 flex items-center gap-1.5 transition-all"
                style={{ borderRadius: btnDestructive?.radius || 'var(--ds-radius-md)' }}
              >
                <Trash2 className="w-3 h-3" />
                <span>Excluir</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FORM CONTROLS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h4 className="text-xs font-mono font-bold tracking-widest uppercase opacity-60">2. Form Controls & Inputs</h4>
          <span className="text-[11px] font-mono opacity-50">Input, Checkbox & Switch</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Text Input States */}
          <div className="p-5 rounded-xl border border-white/10 bg-[var(--ds-surface)] space-y-4" style={{ borderRadius: 'var(--ds-radius-md)' }}>
            <span className="text-xs font-bold block">Text Input States</span>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold opacity-70 block mb-1">Default Input</label>
                <input
                  type="text"
                  value={sampleInputValue}
                  onChange={(e) => setSampleInputValue(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[var(--ds-border)] bg-[var(--ds-bg)] text-[var(--ds-text-primary)] focus:outline-none transition-all"
                  style={{
                    borderRadius: inputText?.radius || 'var(--ds-radius-md)',
                  }}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold opacity-70 block mb-1">Search Input with Icon</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 opacity-50" />
                  <input
                    type="text"
                    placeholder="Buscar pratos ou termos..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[var(--ds-border)] bg-[var(--ds-bg)] text-[var(--ds-text-primary)] focus:outline-none"
                    style={{
                      borderRadius: inputText?.radius || 'var(--ds-radius-md)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--ds-error)] block mb-1">Error State Input</label>
                <input
                  type="text"
                  defaultValue="email_invalido@dominio"
                  className="w-full px-3 py-2 text-xs border border-[var(--ds-error)] bg-[var(--ds-bg)] text-[var(--ds-text-primary)] focus:outline-none"
                  style={{
                    borderRadius: inputText?.radius || 'var(--ds-radius-md)',
                  }}
                />
                <span className="text-[10px] text-[var(--ds-error)] mt-1 block">Por favor, informe um e-mail válido.</span>
              </div>
            </div>
          </div>

          {/* Checkboxes & Switches */}
          <div className="p-5 rounded-xl border border-white/10 bg-[var(--ds-surface)] space-y-5" style={{ borderRadius: 'var(--ds-radius-md)' }}>
            <span className="text-xs font-bold block">Selection Controls</span>

            {/* Checkbox */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checkboxChecked}
                  onChange={(e) => setCheckboxChecked(e.target.checked)}
                  className="w-4 h-4 rounded border border-[var(--ds-border)] accent-[var(--ds-primary)] cursor-pointer"
                />
                <span className="text-xs font-medium text-[var(--ds-text-primary)]">
                  Aceitar termos de serviço e condições de privacidade
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-not-allowed opacity-50 select-none">
                <input type="checkbox" disabled checked className="w-4 h-4 rounded" />
                <span className="text-xs font-medium text-[var(--ds-text-secondary)]">Opção obrigatória desabilitada</span>
              </label>
            </div>

            {/* Switch */}
            <div className="pt-3 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold block text-[var(--ds-text-primary)]">Notificações em Tempo Real</span>
                  <span className="text-[11px] text-[var(--ds-text-secondary)]">Receber alertas de novos pedidos instantaneamente</span>
                </div>
                <button
                  onClick={() => setSwitchActive(!switchActive)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                    switchActive ? 'bg-[var(--ds-primary)]' : 'bg-zinc-700'
                  }`}
                >
                  <div
                    className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      switchActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BADGES & FEEDBACK */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h4 className="text-xs font-mono font-bold tracking-widest uppercase opacity-60">3. Badges, Tags & Alerts</h4>
          <span className="text-[11px] font-mono opacity-50">Status Badges & Banner Alerts</span>
        </div>

        <div className="space-y-4">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="px-3 py-1 text-[11px] font-semibold border border-[var(--ds-border)] bg-[var(--ds-surface)] text-[var(--ds-text-primary)]"
              style={{ borderRadius: badgeSpec?.radius || 'var(--ds-radius-full)' }}
            >
              Default Tag
            </span>

            <span
              className="px-3 py-1 text-[11px] font-semibold flex items-center gap-1.5 border border-[var(--ds-success)]/40 bg-[var(--ds-success)]/10 text-[var(--ds-success)]"
              style={{ borderRadius: badgeSpec?.radius || 'var(--ds-radius-full)' }}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Disponível</span>
            </span>

            <span
              className="px-3 py-1 text-[11px] font-semibold flex items-center gap-1.5 border border-[var(--ds-warning)]/40 bg-[var(--ds-warning)]/10 text-[var(--ds-warning)]"
              style={{ borderRadius: badgeSpec?.radius || 'var(--ds-radius-full)' }}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Estoque Baixo</span>
            </span>

            <span
              className="px-3 py-1 text-[11px] font-semibold flex items-center gap-1.5 border border-[var(--ds-error)]/40 bg-[var(--ds-error)]/10 text-[var(--ds-error)]"
              style={{ borderRadius: badgeSpec?.radius || 'var(--ds-radius-full)' }}
            >
              <XCircle className="w-3 h-3" />
              <span>Esgotado</span>
            </span>

            <span
              className="px-3 py-1 text-[11px] font-semibold flex items-center gap-1.5 border border-[var(--ds-primary)]/40 bg-[var(--ds-primary)]/10 text-[var(--ds-primary)]"
              style={{ borderRadius: badgeSpec?.radius || 'var(--ds-radius-full)' }}
            >
              <Sparkles className="w-3 h-3" />
              <span>Destaque Chef</span>
            </span>
          </div>

          {/* Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="p-4 border border-[var(--ds-info)]/30 bg-[var(--ds-info)]/10 text-[var(--ds-info)] flex items-start gap-3"
              style={{ borderRadius: alertSpec?.radius || 'var(--ds-radius-md)' }}
            >
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold">Informação do Sistema</h5>
                <p className="text-[11px] opacity-80 mt-0.5">As atualizações de cardápio são sincronizadas a cada 60 segundos.</p>
              </div>
            </div>

            <div
              className="p-4 border border-[var(--ds-warning)]/30 bg-[var(--ds-warning)]/10 text-[var(--ds-warning)] flex items-start gap-3"
              style={{ borderRadius: alertSpec?.radius || 'var(--ds-radius-md)' }}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold">Aviso de Horário de Pico</h5>
                <p className="text-[11px] opacity-80 mt-0.5">Tempo médio de preparo estimado em 35 minutos neste momento.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
