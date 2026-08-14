'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Activity, Radio, Cpu, Network } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import {
  LABS_CORE_ITEMS,
  ECOSYSTEM_ITEMS,
  ALL_SITEMAP_ITEMS,
  SitemapItem,
} from '@/data/ecosystem-sitemap';

interface SitemapHoverPopoverProps {
  target: 'labs' | 'eco';
  children: React.ReactNode;
}

export function SitemapHoverPopover({ target, children }: SitemapHoverPopoverProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const isLabs = target === 'labs';
  const previewItems: SitemapItem[] = isLabs
    ? LABS_CORE_ITEMS.slice(0, 4)
    : ALL_SITEMAP_ITEMS.slice(0, 4);

  const totalCount = isLabs ? LABS_CORE_ITEMS.length : ALL_SITEMAP_ITEMS.length;
  const title = isLabs ? 'LABS_CORE_TOPOLOGY' : 'ECO_MESH_TOPOLOGY';
  const subtitle = isLabs ? 'Hub de Inovação & Experimentos' : 'Ecossistema Integrado Ag47';

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 bg-zinc-950/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 pointer-events-none text-left space-y-3"
          >
            {/* Popover Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <span className="text-[9px] font-mono font-bold tracking-widest text-white uppercase">
                  {title}
                </span>
              </div>
              <span className="text-[8px] font-mono text-gray-500 uppercase">
                {totalCount} MÓDULOS
              </span>
            </div>

            <div className="text-[10px] text-gray-400 font-mono">
              {subtitle}
            </div>

            {/* Mini Nodes Grid */}
            <div className="grid grid-cols-2 gap-2">
              {previewItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2"
                  >
                    <Icon
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: theme.colors.primary }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] font-bold text-white truncate">
                        {item.title}
                      </div>
                      <div className="text-[7px] font-mono text-gray-500 uppercase truncate">
                        {item.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Telemetry Footer */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[8px] font-mono text-gray-500">
              <div className="flex items-center gap-1">
                <Radio className="w-3 h-3 text-green-400" />
                <span>SYNC: 99.98%</span>
              </div>
              <div className="flex items-center gap-1" style={{ color: theme.colors.primary }}>
                <span>EXPLORAR SITEMAP</span>
                <ArrowUpRight className="w-2.5 h-2.5" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
