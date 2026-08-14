'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  ShieldCheck, 
  ArrowRight, 
  Flame, 
  Cpu, 
  Radio, 
  Layers 
} from 'lucide-react';

export function ProblemComparison() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'matrix' | 'metrics'>('matrix');

  const comparisons = [
    {
      topic: 'Detecção de Novos Pools',
      traditional: 'Notificações manuais em canais de Telegram com atraso de 15 a 45 segundos.',
      radar: 'Ingestão sub-segundo (< 1.4s) direta nos logs dos nós RPC de Solana e EVM.',
      impact: 'Entrada antecipada antes da saturação de volume.'
    },
    {
      topic: 'Auditoria de Segurança & Honeypot',
      traditional: 'Checagem visual rápida no DexScreener ou sem verificação formal (alta taxa de perda).',
      radar: 'Simulação de venda em sandbox bytecode zero-trust antes de liberar o sinal.',
      impact: 'Eliminação de 99.4% de armadilhas de liquidez e sell taxes ocultas.'
    },
    {
      topic: 'Critério de Decisão de Entrada',
      traditional: 'FOMO irracional, gráficos manipulados e volume falso inflado por wash trading.',
      radar: 'Score Sintético Explicável de 0 a 100 com decomposição auditável dos 4 pilares.',
      impact: 'Tomada de decisão baseada em evidência determinística.'
    },
    {
      topic: 'Rastreio de Insiders & Smart Money',
      traditional: 'Incapacidade de correlacionar carteiras que receberam fundos da mesma origem.',
      radar: 'Análise de grafos on-chain que agrupa clusters de sniper wallets e carteiras dev.',
      impact: 'Detecção precoce de esquemas coordenados de pump & dump.'
    },
    {
      topic: 'Integração para Automação',
      traditional: 'APIs pagas caras, com restrições rígidas de rate-limit e sem WebSocket dedicado.',
      radar: 'Broker Redis Pub/Sub integrado, WebSocket streaming e webhooks imediatos.',
      impact: 'Execução instantânea conectada a bots de copy-trade.'
    }
  ];

  return (
    <section id="problem" className="relative py-20 md:py-32 overflow-hidden border-t border-zinc-900">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold mb-4 border"
            style={{ 
              backgroundColor: `${theme.colors.primary}10`,
              borderColor: `${theme.colors.primary}30`,
              color: theme.colors.primary 
            }}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            PARADIGMA TRADICIONAL VS ALGO-RADAR
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Por que o trading cego destrói capital?
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Mais de 90% dos novos tokens criados diariamente em AMMs descentralizados contêm armadilhas de contrato, drenagem de liquidez ou manipulação de insiders.
          </p>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 mt-6 p-1 rounded-xl bg-zinc-950 border border-zinc-800">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeTab === 'matrix' 
                  ? 'bg-zinc-800 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Matriz Lado a Lado
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeTab === 'metrics' 
                  ? 'bg-zinc-800 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Métricas de Impacto
            </button>
          </div>
        </div>

        {/* Matrix View */}
        {activeTab === 'matrix' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Card: Traditional */}
            <div className="rounded-3xl bg-zinc-950/80 border border-rose-500/20 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-rose-500/15">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Trading Cego / Manual</h3>
                    <p className="text-xs font-mono text-rose-400">Alto Risco & Assimetria Negativa</p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  Vulnerável
                </span>
              </div>

              <div className="space-y-4">
                {comparisons.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-zinc-900/40 border border-rose-500/10 space-y-1.5">
                    <div className="text-xs font-mono font-bold text-rose-300 flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{item.topic}</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed pl-5">
                      {item.traditional}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card: AG47 Alt Radar */}
            <div 
              className="rounded-3xl bg-zinc-950/90 border p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden space-y-6 shadow-2xl"
              style={{ borderColor: `${theme.colors.primary}40` }}
            >
              <div 
                className="flex items-center justify-between pb-4 border-b"
                style={{ borderColor: `${theme.colors.primary}20` }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2.5 rounded-2xl border"
                    style={{ 
                      backgroundColor: `${theme.colors.primary}15`,
                      borderColor: `${theme.colors.primary}40`,
                      color: theme.colors.primary 
                    }}
                  >
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">AG47 Alt Radar</h3>
                    <p 
                      className="text-xs font-mono font-semibold"
                      style={{ color: theme.colors.primary }}
                    >
                      Autônomo, Zero-Trust & Explicável
                    </p>
                  </div>
                </div>
                <span 
                  className="text-xs font-mono px-2.5 py-1 rounded-full border font-bold"
                  style={{ 
                    backgroundColor: `${theme.colors.primary}15`,
                    borderColor: `${theme.colors.primary}30`,
                    color: theme.colors.primary 
                  }}
                >
                  Protegido
                </span>
              </div>

              <div className="space-y-4">
                {comparisons.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-2xl bg-zinc-900/60 border space-y-1.5 transition-all hover:bg-zinc-900/90"
                    style={{ borderColor: `${theme.colors.primary}20` }}
                  >
                    <div className="text-xs font-mono font-bold text-white flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 
                          className="w-3.5 h-3.5 shrink-0" 
                          style={{ color: theme.colors.primary }}
                        />
                        <span>{item.topic}</span>
                      </div>
                      <span 
                        className="text-[10px] px-2 py-0.5 rounded font-mono"
                        style={{ 
                          backgroundColor: `${theme.colors.primary}15`,
                          color: theme.colors.primary 
                        }}
                      >
                        {item.impact}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed pl-5">
                      {item.radar}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Metrics View */}
        {activeTab === 'metrics' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>Prevenção de Rugpulls</span>
              </div>
              <div className="text-4xl font-black font-mono text-white">
                99.4%
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                De todas as tentativas de scam e honeypot identificadas e filtradas antes de qualquer prejuízo ao usuário.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Velocidade de Ingestão</span>
              </div>
              <div 
                className="text-4xl font-black font-mono"
                style={{ color: theme.colors.primary }}
              >
                &lt; 1.4s
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Latência média entre a transação de criação do pool no bloco e a geração do score sintético.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>Alertas Validados / Dia</span>
              </div>
              <div className="text-4xl font-black font-mono text-white">
                3,850+
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Disparos em canais de alta fidelidade com metadados completos de liquidez, score e smart money.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
