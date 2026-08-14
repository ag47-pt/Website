'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Copy, Check, Eye } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { renderFormattedText } from './utils';

interface LabListRowProps {
  title: string;
  description: string;
  path: string;
  icon?: React.ReactNode;
  status?: string;
  category?: 'labs_core' | 'ecosystem';
  onOpenPreview?: () => void;
}

export function LabListRow({
  title,
  description,
  path,
  icon,
  status,
  category,
  onOpenPreview,
}: LabListRowProps) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const fullUrl = `${window.location.origin}${path}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.(50);
      }
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenPreview?.();
  };

  return (
    <Link
      href={path}
      className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 backdrop-blur-md overflow-hidden"
      style={{ '--hover-color': theme.colors.primary } as any}
    >
      {/* Subtle shine highlight */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* Left: Icon & Info */}
      <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
        <div
          className="p-2.5 bg-black/60 border border-white/10 rounded-xl shrink-0 transition-transform group-hover:scale-110"
          style={{ color: theme.colors.primary }}
        >
          {icon}
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-base font-bold text-white tracking-tight group-hover:text-white transition-colors truncate">
              {renderFormattedText(title, 'title', theme)}
            </h4>
            <span className="text-[10px] font-mono text-gray-500 tracking-wider">
              {path}
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-1 max-w-3xl">
            {renderFormattedText(description, 'description', theme)}
          </p>
        </div>
      </div>

      {/* Right: Category, Status, Copy, Preview & Action */}
      <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
        {category && (
          <span className="hidden lg:inline-block text-[9px] font-mono text-gray-500 uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 border border-white/5">
            {category === 'labs_core' ? 'LABS_CORE' : 'ECOSYSTEM'}
          </span>
        )}

        {status && (
          <span
            className="text-[9px] font-mono px-2.5 py-1 rounded-md border tracking-widest uppercase"
            style={{
              color: theme.colors.primary,
              borderColor: `${theme.colors.primary}40`,
              backgroundColor: `${theme.colors.primary}10`,
            }}
          >
            {status}
          </span>
        )}

        {onOpenPreview && (
          <button
            type="button"
            onClick={handlePreview}
            title="Visualizar Preview Rápido"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-gray-400 hover:text-white transition-all backdrop-blur-md"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={handleCopy}
          title={copied ? "Copiado!" : "Copiar Rota / Share"}
          className={`p-2 rounded-xl border transition-all backdrop-blur-md ${
            copied
              ? 'bg-green-500/20 border-green-500/40 text-green-400'
              : 'bg-white/5 hover:bg-white/15 border-white/10 text-gray-400 hover:text-white'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        <div
          className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:border-white/20 transition-all"
          style={{ color: theme.colors.primary }}
        >
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
