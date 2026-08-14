'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { ALT_RADAR_CONFIG } from '@/data/alt-radar';
import { Layers, CheckCircle2, XCircle, Sparkles, HelpCircle } from 'lucide-react';

export function CapabilityMatrix() {
  const { theme } = useTheme();

  return (
    <section id="capabilities" className="relative py-20 md:py-32 overflow-hidden border-t border-zinc-900 bg-zinc-950/40">
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
            <Layers className="w-3.5 h-3.5" />
            MATRIZ COMPARATIVA DE CAPACIDADES
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Como o Alt Radar se compara ao mercado
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Uma avaliação técnica objetiva entre o motor determinístico do AG47 e as principais ferramentas analíticas e de execução do ecossistema crypto.
          </p>
        </div>

        {/* Table Container */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/90 backdrop-blur-2xl shadow-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60 font-mono text-xs text-zinc-400">
                <th className="p-4 sm:p-5 font-bold text-white w-2/5">Capacidade Técnica</th>
                <th 
                  className="p-4 sm:p-5 font-black text-center border-x"
                  style={{ 
                    color: theme.colors.primary,
                    borderColor: `${theme.colors.primary}30`,
                    backgroundColor: `${theme.colors.primary}08`
                  }}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AG47 Alt Radar</span>
                  </div>
                </th>
                <th className="p-4 sm:p-5 text-center text-zinc-300">DexScreener</th>
                <th className="p-4 sm:p-5 text-center text-zinc-300">Photon / BullX</th>
                <th className="p-4 sm:p-5 text-center text-zinc-300">GMGN</th>
                <th className="p-4 sm:p-5 text-center text-zinc-300">Arkham</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 font-mono text-xs text-zinc-300">
              {ALT_RADAR_CONFIG.capabilities.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                  {/* Feature Title */}
                  <td className="p-4 sm:p-5 font-semibold text-white">
                    {row.feature}
                  </td>

                  {/* AG47 Column (Highlighted) */}
                  <td 
                    className="p-4 sm:p-5 text-center font-bold border-x"
                    style={{ 
                      color: theme.colors.primary,
                      borderColor: `${theme.colors.primary}20`,
                      backgroundColor: `${theme.colors.primary}05`
                    }}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{String(row.ag47Radar)}</span>
                    </div>
                  </td>

                  {/* DexScreener */}
                  <td className="p-4 sm:p-5 text-center text-zinc-400">
                    {String(row.dexScreener)}
                  </td>

                  {/* Photon */}
                  <td className="p-4 sm:p-5 text-center text-zinc-400">
                    {String(row.photon)}
                  </td>

                  {/* GMGN */}
                  <td className="p-4 sm:p-5 text-center text-zinc-400">
                    {String(row.gmgn)}
                  </td>

                  {/* Arkham */}
                  <td className="p-4 sm:p-5 text-center text-zinc-400">
                    {String(row.arkham)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
