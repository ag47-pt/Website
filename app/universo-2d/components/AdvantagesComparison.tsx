'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { UNIVERSO_2D_DATA } from '@/data/universo-2d';
import { 
  Check, 
  X, 
  ShieldAlert, 
  Sparkles, 
  Trophy, 
  MoveHorizontal, 
  Gauge, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Layers,
  ArrowRight,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

interface ComparisonPreset {
  id: string;
  label: string;
  before: {
    title: string;
    score: number;
    scoreColor: string;
    fcp: string;
    lcp: string;
    payload: string;
    stack: string;
    bullet: string;
  };
  after: {
    title: string;
    score: number;
    fcp: string;
    lcp: string;
    payload: string;
    stack: string;
    bullet: string;
  };
}

const COMPARISON_PRESETS: ComparisonPreset[] = [
  {
    id: 'performance',
    label: '⚡ Performance & Core Web Vitals',
    before: {
      title: 'Site Tradicional (WordPress / Construtores)',
      score: 34,
      scoreColor: '#f43f5e',
      fcp: '4.2s (Lento)',
      lcp: '7.8s (Crítico)',
      payload: '12.8 MB',
      stack: '28 Plugins + Temas Pesados',
      bullet: 'Perde até 68% dos visitantes por lentidão no mobile.'
    },
    after: {
      title: 'Engenharia Agência 47 (Next.js 15 Edge)',
      score: 100,
      fcp: '0.28s (Instantâneo)',
      lcp: '0.65s (Perfeito)',
      payload: '180 KB (Otimizado)',
      stack: 'Next.js 15 + React 19 + Edge CDN',
      bullet: 'Carregamento sub-segundo em qualquer rede 4G/5G.'
    }
  },
  {
    id: 'architecture',
    label: '🛡️ Arquitetura & Segurança',
    before: {
      title: 'Servidor Compartilhado Tradicional',
      score: 42,
      scoreColor: '#f59e0b',
      fcp: 'Queda em picos de tráfego',
      lcp: 'Vulnerabilidades em PHP/SQL',
      payload: 'Sem CDN Global',
      stack: 'Cpanel / Hospedagem Básica',
      bullet: 'Servidor cai durante campanhas de anúncios ou picos de tráfego.'
    },
    after: {
      title: 'Zero-Trust Cloud (Google Cloud / Edge)',
      score: 99,
      fcp: 'Escala Infinita Automática',
      lcp: 'WAF + DDoS + SSL Strict',
      payload: '310+ Pontos Globais (Edge)',
      stack: 'Serverless Edge + Google Cloud',
      bullet: 'Suporta 1M+ requisições simultâneas sem oscilação.'
    }
  },
  {
    id: 'conversion',
    label: '📈 Taxa de Conversão & Retenção',
    before: {
      title: 'Estrutura Genérica de Agência',
      score: 28,
      scoreColor: '#ef4444',
      fcp: '1.1% Taxa de Conversão Média',
      lcp: 'Checkout Lento (4 etapas)',
      payload: 'Sem Rastreamento de IA',
      stack: 'Formulários Estáticos',
      bullet: 'Abandono massivo antes de concluir o formulário ou compra.'
    },
    after: {
      title: 'Arquitetura de Alta Conversão (+EV)',
      score: 98,
      fcp: '3.6% a 5.2% Conversão Média',
      lcp: '1-Click Checkout & WhatsApp IA',
      payload: 'Agentes Neurais 24/7',
      stack: 'CRO Estrutural + IA Integrada',
      bullet: 'Triplica o retorno gerado por cada euro investido em tráfego.'
    }
  }
];

function BeforeAfterSlider() {
  const { theme } = useTheme();
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [activePreset, setActivePreset] = useState<string>('performance');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedPreset = COMPARISON_PRESETS.find(p => p.id === activePreset) || COMPARISON_PRESETS[0];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging && e.buttons !== 1) return;
    handleMove(e.clientX);
  };

  return (
    <div className="mb-16 rounded-3xl border border-white/10 bg-zinc-950/90 overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Top Controls: Preset selector */}
      <div className="p-4 sm:p-6 bg-white/[0.03] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1">
            <MoveHorizontal className="w-3.5 h-3.5" style={{ color: theme.colors.primary }} />
            <span>Comparador Interativo Split-View</span>
          </div>
          <p className="text-xs text-zinc-400 font-mono">
            Arraste o cursor central para comparar a anatomia de um site convencional vs a engenharia da AG47.
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {COMPARISON_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setActivePreset(preset.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                activePreset === preset.id
                  ? 'font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5'
              }`}
              style={
                activePreset === preset.id
                  ? {
                      backgroundColor: `${theme.colors.primary}20`,
                      borderColor: `${theme.colors.primary}50`,
                      color: theme.colors.primary,
                      border: `1px solid ${theme.colors.primary}60`,
                    }
                  : {}
              }
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Split-View Canvas Area */}
      <div 
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[380px] sm:h-[340px] select-none cursor-ew-resize overflow-hidden bg-black"
      >
        {/* AFTER PANEL (AG47 Engine - Full Canvas underneath) */}
        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between bg-zinc-950">
          <div 
            className="absolute top-0 right-0 w-96 h-96 blur-[120px] rounded-full pointer-events-none opacity-20 transition-colors duration-700"
            style={{ backgroundColor: theme.colors.primary }}
          />

          <div className="relative z-10 flex items-start justify-between">
            <div className="text-right ml-auto">
              <span 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider shadow-lg border"
                style={{
                  backgroundColor: `${theme.colors.primary}20`,
                  borderColor: `${theme.colors.primary}60`,
                  color: theme.colors.primary,
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Padrão Agência 47</span>
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-2">
                {selectedPreset.after.title}
              </h3>
            </div>

            <div className="text-right hidden sm:block">
              <div 
                className="text-4xl font-black font-mono"
                style={{ color: theme.colors.primary }}
              >
                {selectedPreset.after.score}/100
              </div>
              <div className="text-[10px] font-mono text-zinc-400">Google Lighthouse Score</div>
            </div>
          </div>

          {/* Key Metrics Grid (Right / AG47) */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg ml-auto text-right">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-mono text-zinc-400">Velocidade (FCP)</div>
              <div className="text-sm font-bold font-mono" style={{ color: theme.colors.primary }}>
                {selectedPreset.after.fcp}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-mono text-zinc-400">Tempo de Carga (LCP)</div>
              <div className="text-sm font-bold font-mono text-cyan-300">
                {selectedPreset.after.lcp}
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-mono text-zinc-400">Payload / Stack</div>
              <div className="text-xs font-bold font-mono text-emerald-400">
                {selectedPreset.after.payload}
              </div>
            </div>
          </div>

          <div className="relative z-10 text-right text-xs font-mono text-zinc-300 flex items-center justify-end gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: theme.colors.primary }} />
            <span>{selectedPreset.after.bullet}</span>
          </div>
        </div>

        {/* BEFORE PANEL (Traditional Way - Clipped Over Top) */}
        <div 
          className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between bg-zinc-900 border-r border-rose-500/40"
          style={{
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
          }}
        >
          {/* Danger Ambient Glow */}
          <div className="absolute top-0 left-0 w-80 h-80 blur-[100px] rounded-full pointer-events-none opacity-20 bg-rose-600" />

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-rose-500/15 border border-rose-500/40 text-rose-400 shadow-lg">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Agência Tradicional</span>
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-zinc-200 mt-2">
                {selectedPreset.before.title}
              </h3>
            </div>

            <div className="hidden sm:block">
              <div className="text-4xl font-black font-mono text-rose-500">
                {selectedPreset.before.score}/100
              </div>
              <div className="text-[10px] font-mono text-zinc-500">Google Lighthouse Score</div>
            </div>
          </div>

          {/* Key Metrics Grid (Left / Traditional) */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg">
            <div className="p-3 rounded-xl bg-black/40 border border-rose-500/20 backdrop-blur-md">
              <div className="text-[10px] font-mono text-zinc-400">Velocidade (FCP)</div>
              <div className="text-sm font-bold font-mono text-rose-400">
                {selectedPreset.before.fcp}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-rose-500/20 backdrop-blur-md">
              <div className="text-[10px] font-mono text-zinc-400">Tempo de Carga (LCP)</div>
              <div className="text-sm font-bold font-mono text-rose-300">
                {selectedPreset.before.lcp}
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-black/40 border border-rose-500/20 backdrop-blur-md">
              <div className="text-[10px] font-mono text-zinc-400">Payload / Stack</div>
              <div className="text-xs font-bold font-mono text-amber-400">
                {selectedPreset.before.payload}
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs font-mono text-rose-300 flex items-center gap-2">
            <X className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{selectedPreset.before.bullet}</span>
          </div>
        </div>

        {/* THE SLIDER HANDLE DIVIDER */}
        <div 
          className="absolute top-0 bottom-0 w-1 z-30 pointer-events-none transition-transform"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Vertical Neon Laser Line */}
          <div 
            className="w-0.5 h-full mx-auto shadow-2xl"
            style={{
              backgroundColor: theme.colors.primary,
              boxShadow: `0 0 15px ${theme.colors.primary}, 0 0 30px ${theme.colors.primary}`,
            }}
          />

          {/* Central Grip Knob */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-zinc-950 border-2 flex items-center justify-center shadow-2xl backdrop-blur-xl"
            style={{
              borderColor: theme.colors.primary,
              boxShadow: `0 0 20px ${theme.colors.primary}80`,
            }}
          >
            <MoveHorizontal className="w-4 h-4" style={{ color: theme.colors.primary }} />
          </div>
        </div>
      </div>

      {/* Footer Helper */}
      <div className="px-5 py-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
        <span className="flex items-center gap-1.5 text-rose-400">
          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
          <span>Esquerda: Solução Convencional</span>
        </span>
        <span className="text-zinc-500 hidden sm:inline">↔ Arraste horizontalmente para inspecionar</span>
        <span className="flex items-center gap-1.5" style={{ color: theme.colors.primary }}>
          <span>Direita: Engenharia Agência 47</span>
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: theme.colors.primary }} />
        </span>
      </div>
    </div>
  );
}

export function AdvantagesComparison() {
  const { theme } = useTheme();
  const { advantagesComparison } = UNIVERSO_2D_DATA;

  return (
    <section id="vantagens" className="py-20 px-4 sm:px-6 relative border-t border-white/10 bg-black/40">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-bold uppercase tracking-wider mb-3 transition-colors duration-500"
            style={{
              backgroundColor: `${theme.colors.primary}12`,
              borderColor: `${theme.colors.primary}40`,
              color: theme.colors.primary,
            }}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>03. VANTAGENS & BASELINES</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4 uppercase">
            A Diferença Entre Engenharia Real e Soluções Genéricas
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-mono">
            Veja como a nossa abordagem elimina gargalos e supera agências convencionais em todos os indicadores críticos.
          </p>
        </div>

        {/* Interactive Before/After Split-View Comparator */}
        <BeforeAfterSlider />

        {/* Comparison Table / Cards for Mobile & Desktop */}
        <div className="rounded-3xl border border-white/10 bg-zinc-950/80 overflow-hidden shadow-2xl backdrop-blur-xl">
          {/* Header Row (Desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-5 bg-white/5 border-b border-white/10 text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            <div className="col-span-3">Critério Técnico</div>
            <div 
              className="col-span-4 flex items-center gap-1.5 font-bold transition-colors duration-500"
              style={{ color: theme.colors.primary }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Padrão Agência 47</span>
            </div>
            <div className="col-span-3 text-zinc-500 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-zinc-500" />
              <span>Agências Tradicionais</span>
            </div>
            <div className="col-span-2 text-right">Impacto Real</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {advantagesComparison.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 p-5 items-center hover:bg-white/5 transition-colors"
              >
                {/* Metric Title */}
                <div className="md:col-span-3 font-semibold text-sm text-white flex items-center justify-between md:block">
                  <span>{row.metric}</span>
                  <span 
                    className="md:hidden text-[10px] font-mono px-2 py-0.5 rounded border"
                    style={{
                      backgroundColor: `${theme.colors.primary}12`,
                      borderColor: `${theme.colors.primary}30`,
                      color: theme.colors.primary,
                    }}
                  >
                    VANTAGEM AG47
                  </span>
                </div>

                {/* AG47 Way */}
                <div 
                  className="md:col-span-4 flex items-start gap-2.5 p-3 md:p-0 rounded-xl md:bg-transparent border md:border-none"
                  style={{
                    backgroundColor: `${theme.colors.primary}08`,
                    borderColor: `${theme.colors.primary}20`,
                  }}
                >
                  <div 
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-500"
                    style={{
                      backgroundColor: `${theme.colors.primary}25`,
                      color: theme.colors.primary,
                    }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <div 
                      className="text-xs font-mono font-semibold md:hidden mb-0.5"
                      style={{ color: theme.colors.primary }}
                    >
                      Agência 47:
                    </div>
                    <div className="text-xs sm:text-sm text-zinc-100 font-medium leading-snug">
                      {row.ag47Way}
                    </div>
                  </div>
                </div>

                {/* Traditional Way */}
                <div className="md:col-span-3 flex items-start gap-2.5 p-3 md:p-0 rounded-xl bg-white/5 md:bg-transparent border border-white/10 md:border-none">
                  <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-400/80 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-semibold text-zinc-500 md:hidden mb-0.5">
                      Agência Tradicional:
                    </div>
                    <div className="text-xs sm:text-sm text-zinc-400 font-light leading-snug">
                      {row.traditionalWay}
                    </div>
                  </div>
                </div>

                {/* Impact */}
                <div className="md:col-span-2 md:text-right">
                  <div 
                    className="inline-block md:block px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono font-medium"
                    style={{ color: theme.colors.secondary || theme.colors.primary }}
                  >
                    {row.impact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
