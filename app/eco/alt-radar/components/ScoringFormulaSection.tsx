'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { Cpu, Calculator, Sliders, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

export function ScoringFormulaSection() {
  const { theme } = useTheme();
  
  const [contractScore, setContractScore] = useState<number>(95);
  const [liquidityScore, setLiquidityScore] = useState<number>(90);
  const [holdersScore, setHoldersScore] = useState<number>(85);
  const [marketScore, setMarketScore] = useState<number>(92);

  const [hasMintPenalty, setHasMintPenalty] = useState<boolean>(false);
  const [hasLpPenalty, setHasLpPenalty] = useState<boolean>(false);

  // Cálculo da pontuação base ponderada
  const baseScore = 
    contractScore * 0.35 + 
    liquidityScore * 0.30 + 
    holdersScore * 0.20 + 
    marketScore * 0.15;

  // Penalidades determinísticas
  let penalty = 0;
  if (hasMintPenalty) penalty += 25;
  if (hasLpPenalty) penalty += 35;

  const finalScore = Math.max(0, Math.min(100, Math.round(baseScore - penalty)));

  const getTier = (score: number) => {
    if (score >= 90) return { label: 'SAFE ALPHA (Tier 1)', color: theme.colors.primary, bg: 'bg-emerald-500/10' };
    if (score >= 75) return { label: 'QUALIFIED OPPORTUNITY (Tier 2)', color: '#06b6d4', bg: 'bg-cyan-500/10' };
    if (score >= 50) return { label: 'MODERATE RISK (Tier 3)', color: '#f59e0b', bg: 'bg-amber-500/10' };
    return { label: 'HIGH DANGER / REJECTED', color: '#f43f5e', bg: 'bg-rose-500/10' };
  };

  const tier = getTier(finalScore);

  const resetValues = () => {
    setContractScore(95);
    setLiquidityScore(90);
    setHoldersScore(85);
    setMarketScore(92);
    setHasMintPenalty(false);
    setHasLpPenalty(false);
  };

  return (
    <section id="scoring" className="relative py-20 md:py-32 overflow-hidden border-t border-zinc-900 bg-zinc-950/60">
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
            <Calculator className="w-3.5 h-3.5" />
            FÓRMULA DETERMINÍSTICA DE SCORING
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Calculadora Interativa de Score AG47
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Experimente os 4 vetores ponderados da nossa fórmula de risco e descubra como o motor reage a variações de liquidez, contratos e concentração de carteiras.
          </p>
        </div>

        {/* Calculator Card */}
        <div 
          className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border backdrop-blur-2xl shadow-2xl space-y-8"
          style={{ borderColor: `${theme.colors.primary}30` }}
        >
          {/* Header Formula Math Box */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="text-zinc-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Score = (C × 0.35) + (L × 0.30) + (H × 0.20) + (M × 0.15) - Penalidades</span>
            </div>
            <button
              onClick={resetValues}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Redefinir Valores</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Controls (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Slider 1: Contrato */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-300 font-bold">1. Integridade do Contrato (Peso 35%)</span>
                  <span className="font-bold text-white px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                    {contractScore}/100 → {(contractScore * 0.35).toFixed(1)} pts
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={contractScore}
                  onChange={(e) => setContractScore(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-zinc-800 rounded-lg h-2 cursor-pointer"
                />
              </div>

              {/* Slider 2: Liquidez */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-300 font-bold">2. Estrutura de Liquidez (Peso 30%)</span>
                  <span className="font-bold text-white px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                    {liquidityScore}/100 → {(liquidityScore * 0.30).toFixed(1)} pts
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={liquidityScore}
                  onChange={(e) => setLiquidityScore(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-zinc-800 rounded-lg h-2 cursor-pointer"
                />
              </div>

              {/* Slider 3: Holders */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-300 font-bold">3. Distribuição de Holders (Peso 20%)</span>
                  <span className="font-bold text-white px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                    {holdersScore}/100 → {(holdersScore * 0.20).toFixed(1)} pts
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={holdersScore}
                  onChange={(e) => setHoldersScore(Number(e.target.value))}
                  className="w-full accent-purple-400 bg-zinc-800 rounded-lg h-2 cursor-pointer"
                />
              </div>

              {/* Slider 4: Mercado */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-300 font-bold">4. Dinâmica de Mercado (Peso 15%)</span>
                  <span className="font-bold text-white px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                    {marketScore}/100 → {(marketScore * 0.15).toFixed(1)} pts
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={marketScore}
                  onChange={(e) => setMarketScore(Number(e.target.value))}
                  className="w-full accent-amber-400 bg-zinc-800 rounded-lg h-2 cursor-pointer"
                />
              </div>

              {/* Penalties Flags */}
              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Simular Penalidades de Risco:
                </span>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-xs font-mono text-zinc-300 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={hasMintPenalty}
                      onChange={(e) => setHasMintPenalty(e.target.checked)}
                      className="accent-rose-500 rounded cursor-pointer"
                    />
                    <span>Mint Authority Ativa (-25 pts)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-mono text-zinc-300 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={hasLpPenalty}
                      onChange={(e) => setHasLpPenalty(e.target.checked)}
                      className="accent-rose-500 rounded cursor-pointer"
                    />
                    <span>LP Unlocked / Sem Bloqueio (-35 pts)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Live Result Gauge (1 col) */}
            <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between items-center text-center space-y-6">
              <div>
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Score Sintético Resultante
                </span>
                <div 
                  className="text-6xl font-mono font-black my-4"
                  style={{ color: tier.color }}
                >
                  {finalScore}
                  <span className="text-2xl text-zinc-500">/100</span>
                </div>
              </div>

              <div 
                className="w-full p-3.5 rounded-2xl border font-mono text-xs font-bold"
                style={{ 
                  backgroundColor: `${tier.color}15`,
                  borderColor: `${tier.color}40`,
                  color: tier.color 
                }}
              >
                {tier.label}
              </div>

              <div className="w-full space-y-1.5 text-left text-[11px] font-mono text-zinc-400 border-t border-zinc-800 pt-4">
                <div className="flex justify-between">
                  <span>Contribuição Base:</span>
                  <span className="text-white font-bold">{baseScore.toFixed(1)} pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Penalidades Aplicadas:</span>
                  <span className={penalty > 0 ? 'text-rose-400 font-bold' : 'text-zinc-500'}>
                    -{penalty} pts
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
