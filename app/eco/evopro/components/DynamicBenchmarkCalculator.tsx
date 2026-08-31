'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  Calculator, 
  TrendingUp, 
  Zap, 
  Clock, 
  Coins, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Sliders,
  AlertCircle
} from 'lucide-react';

export function DynamicBenchmarkCalculator() {
  const { theme } = useTheme();

  // Estados dos Sliders
  const [filesCount, setFilesCount] = useState<number>(120);
  const [sprintsPerMonth, setSprintsPerMonth] = useState<number>(24);
  const [teamSize, setTeamSize] = useState<number>(6);

  // Cálculos Dinâmicos (Classificação Epistemológica: ESTIMATED)
  const tokensWithout = filesCount * sprintsPerMonth * 1450;
  const tokensWithEvo = Math.round(tokensWithout * 0.28);
  const tokensSaved = tokensWithout - tokensWithEvo;

  const hoursSavedPerMonth = Math.round(((sprintsPerMonth * 25) - (sprintsPerMonth * 1.5)) / 60);
  const financialSavings = Math.round((hoursSavedPerMonth * 45) + ((tokensSaved / 1000) * 0.0035));
  const regressionsCaught = Math.round(sprintsPerMonth * 0.35 * teamSize);

  return (
    <div className="rounded-3xl bg-zinc-950/90 border border-zinc-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl font-mono">
      {/* Header do Módulo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <Calculator className="w-4 h-4" />
            <span>SIMULAÇÃO DE AMORTIZAÇÃO COGNITIVA & ROI</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Simulador de Eficiência Operacional Estimada
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Status Epistêmico: ESTIMATED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Coluna dos Controles (Sliders) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Slider 1: Ficheiros no Repositório */}
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
            <div className="flex justify-between items-center mb-2 text-xs">
              <span className="text-zinc-400 font-sans">Tamanho do Repositório (Arquivos de Código)</span>
              <span className="text-white font-bold px-2 py-0.5 rounded bg-zinc-800 text-cyan-300">
                {filesCount} arquivos
              </span>
            </div>
            <input 
              type="range"
              min="20"
              max="1000"
              step="10"
              value={filesCount}
              onChange={(e) => setFilesCount(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-600 mt-1 font-mono">
              <span>20 (Micro-app)</span>
              <span>500 (Médio)</span>
              <span>1000+ (Monolito)</span>
            </div>
          </div>

          {/* Slider 2: Sprints de Evolução / Mês */}
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
            <div className="flex justify-between items-center mb-2 text-xs">
              <span className="text-zinc-400 font-sans">Ciclos de Mutação / Mês (Intervenções de Agentes)</span>
              <span className="text-white font-bold px-2 py-0.5 rounded bg-zinc-800 text-emerald-300">
                {sprintsPerMonth} ciclos/mês
              </span>
            </div>
            <input 
              type="range"
              min="5"
              max="200"
              step="5"
              value={sprintsPerMonth}
              onChange={(e) => setSprintsPerMonth(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-600 mt-1 font-mono">
              <span>5 (Ocasional)</span>
              <span>100 (Diário)</span>
              <span>200 (Autónomo 24/7)</span>
            </div>
          </div>

          {/* Slider 3: Engenheiros / Agentes Concorrentes */}
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
            <div className="flex justify-between items-center mb-2 text-xs">
              <span className="text-zinc-400 font-sans">Agentes / Desenvolvedores no Repositório</span>
              <span className="text-white font-bold px-2 py-0.5 rounded bg-zinc-800 text-purple-300">
                {teamSize} instâncias
              </span>
            </div>
            <input 
              type="range"
              min="1"
              max="30"
              step="1"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="w-full accent-purple-400 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-600 mt-1 font-mono">
              <span>1 (Solo)</span>
              <span>10 (Equipa)</span>
              <span>30 (Enterprise Grid)</span>
            </div>
          </div>
        </div>

        {/* Coluna dos Resultados Dinâmicos */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          {/* Card 1: Tokens Poupados */}
          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-cyan-500/30 shadow-lg relative overflow-hidden group">
            <div className="flex items-center gap-2 text-cyan-400 text-xs mb-1">
              <Zap className="w-4 h-4" />
              <span>Tokens Poupados (ESTIMATED)</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white my-2 tracking-tight">
              -{(tokensSaved / 1000).toFixed(0)}k
            </div>
            <p className="text-[11px] text-zinc-400 font-sans leading-tight">
              Redução estimada de <strong>72% no context bloat</strong> via Context Router seletivo.
            </p>
          </div>

          {/* Card 2: Horas de Engenharia */}
          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-emerald-500/30 shadow-lg relative overflow-hidden group">
            <div className="flex items-center gap-2 text-emerald-400 text-xs mb-1">
              <Clock className="w-4 h-4" />
              <span>Horas Salvas/Mês (ESTIMATED)</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white my-2 tracking-tight">
              +{hoursSavedPerMonth}h
            </div>
            <p className="text-[11px] text-zinc-400 font-sans leading-tight">
              Redução de inspeção manual e reversões de código quebrado via Gauntlet A/B.
            </p>
          </div>

          {/* Card 3: Regressões Bloqueadas */}
          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-purple-500/30 shadow-lg relative overflow-hidden group">
            <div className="flex items-center gap-2 text-purple-400 text-xs mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Regressões Evitadas (ESTIMATED)</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white my-2 tracking-tight">
              ~{regressionsCaught}
            </div>
            <p className="text-[11px] text-zinc-400 font-sans leading-tight">
              Barradas antes do commit pelos Gauntlet Critics e vereditos do Judge.
            </p>
          </div>

          {/* Card 4: Economia Financeira Estimada */}
          <div 
            className="p-5 rounded-2xl border shadow-xl relative overflow-hidden"
            style={{ 
              backgroundColor: `${theme.colors.primary}15`,
              borderColor: `${theme.colors.primary}40`
            }}
          >
            <div className="flex items-center gap-2 text-xs mb-1" style={{ color: theme.colors.primary }}>
              <Coins className="w-4 h-4" />
              <span>Valor Gerado/Mês (ESTIMATED)</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white my-2 tracking-tight">
              €{financialSavings.toLocaleString()}
            </div>
            <p className="text-[11px] text-zinc-300 font-sans leading-tight">
              Economia direta em refatoração e infraestrutura de LLM (base calculada declarada).
            </p>
          </div>
        </div>
      </div>

      {/* Epistemic Note */}
      <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-500 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0" />
        <span>
          <strong>Nota de Rigor:</strong> Valores simulados possuem status epistêmico <code>ESTIMATED</code> baseado em modelos de referência. O EvoPro não transforma estimativas em benchmarks universais de produção.
        </span>
      </div>
    </div>
  );
}
