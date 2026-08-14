'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { ALT_RADAR_CONFIG, PipelineStage } from '@/data/alt-radar';
import { 
  GitBranch, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Cpu, 
  Radio, 
  ShieldCheck, 
  Network, 
  Database,
  Zap 
} from 'lucide-react';

export function RadarPipelineCycle() {
  const { theme } = useTheme();
  const [selectedStage, setSelectedStage] = useState<PipelineStage>(
    ALT_RADAR_CONFIG.pipelineStages[0]
  );

  const icons = [Database, Zap, ShieldCheck, Network, Cpu, Radio];

  return (
    <section id="pipeline" className="relative py-20 md:py-32 overflow-hidden border-t border-zinc-900 bg-zinc-950/40">
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
            <GitBranch className="w-3.5 h-3.5" />
            PIPELINE AUTÔNOMO DE EXECUÇÃO
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Do bloco na blockchain ao alerta qualificado
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Cada novo par de negociação passa determinística e sequencialmente pelas 6 etapas de validação antes de receber a chancela de oportunidade AG47.
          </p>
        </div>

        {/* Horizontal Pipeline Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {ALT_RADAR_CONFIG.pipelineStages.map((stage, idx) => {
            const isSelected = selectedStage.id === stage.id;
            const Icon = icons[idx] || Cpu;
            return (
              <div
                key={stage.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedStage(stage)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedStage(stage);
                  }
                }}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 relative group select-none ${
                  isSelected 
                    ? 'bg-zinc-900 text-white shadow-xl scale-[1.03]' 
                    : 'bg-zinc-950/80 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/60'
                }`}
                style={{
                  borderColor: isSelected ? theme.colors.primary : undefined
                }}
              >
                <div className="flex items-center justify-between">
                  <span 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold"
                    style={{
                      backgroundColor: isSelected ? theme.colors.primary : '#27272a',
                      color: isSelected ? '#000000' : '#a1a1aa'
                    }}
                  >
                    0{stage.step}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {stage.latency}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon 
                      className="w-4 h-4 shrink-0" 
                      style={{ color: isSelected ? theme.colors.primary : undefined }}
                    />
                    <h3 className="text-xs font-bold text-white truncate">
                      {stage.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {stage.shortDesc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Stage Deep-Dive Card */}
        <div 
          className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border backdrop-blur-2xl shadow-2xl space-y-6"
          style={{ borderColor: `${theme.colors.primary}30` }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-black text-xl text-black shadow-lg"
                style={{ backgroundColor: theme.colors.primary }}
              >
                0{selectedStage.step}
              </div>
              <div>
                <span className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                  Etapa {selectedStage.step} de 06 • Latência: {selectedStage.latency}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {selectedStage.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Status: {selectedStage.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                Objetivo Operacional
              </h4>
              <p className="text-sm text-zinc-300 leading-relaxed p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                {selectedStage.shortDesc}
              </p>
            </div>

            <div className="space-y-3">
              <h4 
                className="text-xs font-mono font-bold uppercase tracking-wider"
                style={{ color: theme.colors.primary }}
              >
                Especificação Técnica de Baixo Nível
              </h4>
              <p className="text-sm text-zinc-300 leading-relaxed p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 font-mono text-xs">
                {selectedStage.technicalDetails}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
