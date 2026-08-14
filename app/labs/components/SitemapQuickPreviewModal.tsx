'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  X,
  Copy,
  Check,
  ArrowUpRight,
  Cpu,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { SitemapItem } from '@/data/ecosystem-sitemap';
import { useTheme } from '@/context/ThemeContext';
import { renderFormattedText } from './utils';

interface SitemapQuickPreviewModalProps {
  item: SitemapItem | null;
  onClose: () => void;
}

export function SitemapQuickPreviewModal({
  item,
  onClose,
}: SitemapQuickPreviewModalProps) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    if (item) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [item, onClose]);

  const handleCopyUrl = async () => {
    if (!item) return;
    const url = `${window.location.origin}${item.path}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.(50);
      }
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (!item) return null;

  const Icon = item.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0e0e0e]/95 border border-white/15 p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl space-y-6 text-white"
        >
          {/* Top Bar / Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="p-3.5 bg-black/70 border border-white/10 rounded-2xl shrink-0"
                style={{ color: theme.colors.primary }}
              >
                <Icon className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 border border-white/10">
                    {item.category === 'labs_core' ? 'LABS_CORE' : 'ECOSYSTEM'}
                  </span>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded border tracking-widest uppercase"
                    style={{
                      color: theme.colors.primary,
                      borderColor: `${theme.colors.primary}40`,
                      backgroundColor: `${theme.colors.primary}10`,
                    }}
                  >
                    {item.status}
                  </span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-white">
                  {renderFormattedText(item.title, 'title', theme)}
                </h3>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-gray-400 hover:text-white transition-all"
              aria-label="Fechar preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-sm sm:text-base text-gray-300 leading-relaxed">
            {renderFormattedText(item.description, 'description', theme)}
          </div>

          {/* Technical Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 uppercase">
                <Cpu className="w-3.5 h-3.5" />
                <span>Node ID</span>
              </div>
              <div className="text-xs font-mono font-bold text-white tracking-wider truncate">
                {item.nodeId || `NODE_0x47_${item.id.toUpperCase()}`}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 uppercase">
                <Calendar className="w-3.5 h-3.5" />
                <span>Lançamento</span>
              </div>
              <div className="text-xs font-mono font-bold text-white tracking-wider">
                {item.releaseDate || '2026.Q3'}
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 uppercase">
                <Layers className="w-3.5 h-3.5" />
                <span>Rota Canonical</span>
              </div>
              <div className="text-xs font-mono text-gray-400 truncate">
                {item.path}
              </div>
            </div>
          </div>

          {/* Tech Stack Chips */}
          {item.techStack && item.techStack.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Stack de Tecnologias & Arquitetura</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Features Highlights */}
          {item.features && item.features.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Principais Capacidades</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {item.features.map((feat, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300 font-mono"
                  >
                    <CheckCircle2
                      className="w-4 h-4 shrink-0"
                      style={{ color: theme.colors.primary }}
                    />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons Footer */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <button
              onClick={handleCopyUrl}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono tracking-wider uppercase text-gray-300 hover:text-white transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-bold">URL Copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Rota / Share</span>
                </>
              )}
            </button>

            <Link
              href={item.path}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase text-black transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-105"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <span>Acessar Módulo</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
