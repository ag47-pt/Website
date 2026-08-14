'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FilterCategory } from './SitemapSearchFilter';
import { useTheme } from '@/context/ThemeContext';
import { playClickSound } from '@/lib/audio/sound-fx';

interface InteractiveStatsBarProps {
  totalCount: number;
  labsCoreCount: number;
  ecosystemCount: number;
  liveCount: number;
  betaCount: number;
  activeFilter: FilterCategory;
  onSelectFilter: (filter: FilterCategory) => void;
  buildVersion?: string;
  uptime?: string;
  latency?: string;
}

export function InteractiveStatsBar({
  totalCount,
  labsCoreCount,
  ecosystemCount,
  liveCount,
  betaCount,
  activeFilter,
  onSelectFilter,
  buildVersion = '0.47.0-PRO',
  uptime = '99.98%',
  latency = '12ms',
}: InteractiveStatsBarProps) {
  const { theme } = useTheme();

  const handleStatClick = (filter: FilterCategory) => {
    playClickSound();
    onSelectFilter(filter);
    const searchSection = document.getElementById('sitemap-controls');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const statCards: {
    label: string;
    value: string | number;
    sublabel: string;
    filterTarget?: FilterCategory;
  }[] = [
    {
      label: 'PROJETOS_ATIVOS',
      value: totalCount,
      sublabel: 'Todos os módulos',
      filterTarget: 'all',
    },
    {
      label: 'LABS_CORE',
      value: labsCoreCount,
      sublabel: 'Módulos internos',
      filterTarget: 'labs_core',
    },
    {
      label: 'ECOSSISTEMA',
      value: ecosystemCount,
      sublabel: 'Apps & Produtos',
      filterTarget: 'ecosystem',
    },
    {
      label: 'LIVE_PRODUCAO',
      value: liveCount,
      sublabel: 'Serviços ao vivo',
      filterTarget: 'live',
    },
    {
      label: 'BETA_SANDBOX',
      value: betaCount,
      sublabel: 'MVPs & Testes',
      filterTarget: 'beta',
    },
    {
      label: 'GATEWAY_METRICS',
      value: latency,
      sublabel: `Uptime: ${uptime}`,
    },
  ];

  return (
    <section className="pt-8 border-t border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-gray-500 uppercase">
          Estatísticas_Interativas // Clique para filtrar
        </span>
        <span className="text-[9px] font-mono text-gray-600 uppercase">
          Build: {buildVersion}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((stat, idx) => {
          const isClickable = !!stat.filterTarget;
          const isActive = stat.filterTarget && activeFilter === stat.filterTarget;

          return (
            <motion.div
              key={stat.label}
              whileHover={{ y: isClickable ? -2 : 0 }}
              whileTap={{ scale: isClickable ? 0.98 : 1 }}
              onClick={() => stat.filterTarget && handleStatClick(stat.filterTarget)}
              className={`p-4 rounded-2xl border transition-all duration-300 ${
                isClickable ? 'cursor-pointer' : 'cursor-default'
              } ${
                isActive
                  ? 'bg-white/15 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                  : 'bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-white/20'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">
                    {stat.label}
                  </span>
                  {isActive && (
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                  )}
                </div>
                <div className="text-2xl font-black tracking-tight text-white font-mono">
                  {stat.value}
                </div>
                <div className="text-[9px] font-mono text-gray-400 truncate">
                  {stat.sublabel}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
