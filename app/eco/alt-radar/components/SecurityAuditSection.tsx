'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { ALT_RADAR_CONFIG } from '@/data/alt-radar';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Check, 
  X, 
  AlertTriangle, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  Sparkles,
  Zap
} from 'lucide-react';

interface SimulationScenario {
  id: string;
  name: string;
  type: 'SAFE' | 'HONEYPOT' | 'MINT_EXPLOIT';
  chain: string;
  honeypot: boolean;
  mintRevoked: boolean;
  freezeRevoked: boolean;
  lpBurned: boolean;
  topHoldersPct: number;
  score: number;
  verdict: string;
}

const SCENARIOS: SimulationScenario[] = [
  {
    id: 'safe-token',
    name: 'AGAI ($AGAI) - Token Modelo',
    type: 'SAFE',
    chain: 'Solana SPL',
    honeypot: false,
    mintRevoked: true,
    freezeRevoked: true,
    lpBurned: true,
    topHoldersPct: 12.4,
    score: 96,
    verdict: 'APROVADO - RISCO BAIXO'
  },
  {
    id: 'honeypot-token',
    name: 'MOONX ($MNX) - Armadilha Sell Tax',
    type: 'HONEYPOT',
    chain: 'Base ERC-20',
    honeypot: true,
    mintRevoked: false,
    freezeRevoked: false,
    lpBurned: false,
    topHoldersPct: 68.2,
    score: 18,
    verdict: 'BLOQUEADO - HONEYPOT (Sell Tax 99%)'
  },
  {
    id: 'mint-token',
    name: 'FLASHGEM ($FGEM) - Mint Ativo',
    type: 'MINT_EXPLOIT',
    chain: 'Solana SPL',
    honeypot: false,
    mintRevoked: false,
    freezeRevoked: true,
    lpBurned: true,
    topHoldersPct: 45.1,
    score: 34,
    verdict: 'ALERTA - MINT AUTHORITY ATIVA'
  }
];

export function SecurityAuditSection() {
  const { theme } = useTheme();
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario>(SCENARIOS[0]);

  return (
    <section id="security" className="relative py-20 md:py-32 overflow-hidden border-t border-zinc-900">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold mb-4 border"
            style={{ 
              backgroundColor: `${theme.colors.primary}10`,
              borderColor: `${theme.colors.primary}30`,
              color: theme.colors.primary 
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            MOTOR DE RISCO ZERO-TRUST
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Auditoria profunda em cada byte de código
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            O Alt Radar inspeciona a estrutura das pools, simula execuções de swap e verifica os guardrails on-chain para garantir que o investidor nunca fique preso numa armadilha.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {ALT_RADAR_CONFIG.securityCategories.map((cat, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-xl flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-zinc-400">Pilar 0{idx + 1}</span>
                  <span 
                    className="px-2 py-0.5 rounded-full font-bold"
                    style={{ 
                      backgroundColor: `${theme.colors.primary}15`,
                      color: theme.colors.primary 
                    }}
                  >
                    Peso {cat.weight}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{cat.category}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">{cat.description}</p>
              </div>

              <div className="space-y-2 pt-3 border-t border-zinc-900">
                {cat.checks.map((chk, cIdx) => (
                  <div key={cIdx} className="flex items-start gap-2 text-[11px] text-zinc-300">
                    <CheckCircle2 
                      className="w-3.5 h-3.5 shrink-0 mt-0.5" 
                      style={{ color: theme.colors.primary }}
                    />
                    <span>{chk}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Sandbox Simulator Card */}
        <div 
          className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border backdrop-blur-2xl shadow-2xl space-y-6"
          style={{ borderColor: `${theme.colors.primary}30` }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
            <div>
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                Simulador de Bytecode em Sandbox
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                Teste de Vulnerabilidade em Tempo Real
              </h3>
            </div>

            {/* Scenario Selector */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
              {SCENARIOS.map((scen) => {
                const isSelected = selectedScenario.id === scen.id;
                return (
                  <button
                    key={scen.id}
                    onClick={() => setSelectedScenario(scen)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                    style={{
                      borderColor: isSelected ? theme.colors.primary : undefined
                    }}
                  >
                    {scen.type === 'SAFE' && '✅ '}
                    {scen.type === 'HONEYPOT' && '🚫 '}
                    {scen.type === 'MINT_EXPLOIT' && '⚠️ '}
                    {scen.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Simulation Output Body */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Checks Overview */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-2">
                <span>Alvo: {selectedScenario.name}</span>
                <span className="text-zinc-300 font-bold">Rede: {selectedScenario.chain}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  !selectedScenario.honeypot ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                }`}>
                  <span className="text-xs font-mono">Honeypot (Sell Simulation)</span>
                  <span className="font-bold font-mono text-xs">
                    {!selectedScenario.honeypot ? 'PASS (0% Tax)' : 'FAIL (100% Tax)'}
                  </span>
                </div>

                <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  selectedScenario.mintRevoked ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                }`}>
                  <span className="text-xs font-mono">Mint Authority</span>
                  <span className="font-bold font-mono text-xs">
                    {selectedScenario.mintRevoked ? 'REVOKED' : 'ACTIVE (UNSAFE)'}
                  </span>
                </div>

                <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  selectedScenario.freezeRevoked ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                }`}>
                  <span className="text-xs font-mono">Freeze Authority</span>
                  <span className="font-bold font-mono text-xs">
                    {selectedScenario.freezeRevoked ? 'REVOKED' : 'ACTIVE'}
                  </span>
                </div>

                <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  selectedScenario.lpBurned ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                }`}>
                  <span className="text-xs font-mono">LP Token Burn / Lock</span>
                  <span className="font-bold font-mono text-xs">
                    {selectedScenario.lpBurned ? '100% BURNED' : 'UNLOCKED (RISK)'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Concentração Top 10 Holders:</span>
                <span className={`font-bold ${
                  selectedScenario.topHoldersPct < 20 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {selectedScenario.topHoldersPct}% {selectedScenario.topHoldersPct < 20 ? '(Descentralizado)' : '(Alto Risco de Dump)'}
                </span>
              </div>
            </div>

            {/* Verdict Box */}
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between text-center space-y-4">
              <div>
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  Score de Auditoria Sintética
                </span>
                <div 
                  className="text-5xl font-mono font-black my-2"
                  style={{
                    color: selectedScenario.score >= 80 
                      ? theme.colors.primary 
                      : selectedScenario.score >= 50 
                        ? '#f59e0b' 
                        : '#f43f5e'
                  }}
                >
                  {selectedScenario.score}
                  <span className="text-xl text-zinc-500">/100</span>
                </div>
              </div>

              <div className={`p-3 rounded-xl font-mono text-xs font-bold border ${
                selectedScenario.type === 'SAFE'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : selectedScenario.type === 'HONEYPOT'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {selectedScenario.verdict}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
