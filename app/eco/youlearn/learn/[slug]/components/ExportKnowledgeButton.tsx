'use client';

import React, { useState, useRef, useEffect } from 'react';
import { KnowledgeObject } from '@/eco/youlearn/schema/types';
import { exportKnowledgeObjectToMarkdown } from '@/eco/youlearn/lib/exportMarkdown';
import { Download, Copy, Check, Share2, FileText, ChevronDown, Sparkles } from 'lucide-react';

interface ExportKnowledgeButtonProps {
  knowledge: KnowledgeObject;
}

export function ExportKnowledgeButton({ knowledge }: ExportKnowledgeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedState, setCopiedState] = useState<'none' | 'markdown' | 'link'>('none');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownloadMarkdown = () => {
    const markdown = exportKnowledgeObjectToMarkdown(knowledge);
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${knowledge.slug}-youlearn.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const handleCopyMarkdown = async () => {
    const markdown = exportKnowledgeObjectToMarkdown(knowledge);
    try {
      await navigator.clipboard.writeText(markdown);
      setCopiedState('markdown');
      setTimeout(() => setCopiedState('none'), 2500);
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to copy markdown:', err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedState('link');
      setTimeout(() => setCopiedState('none'), 2500);
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-xs font-semibold text-zinc-200 backdrop-blur-md hover:bg-white/10 hover:border-[#D1FF00]/50 hover:text-white transition-all shadow-lg shadow-black/40"
        title="Exportar material sintetizado"
      >
        <FileText className="h-3.5 w-3.5 text-[#D1FF00]" />
        <span>Exportar</span>
        <ChevronDown className={`h-3 w-3 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-11 z-50 w-64 sm:w-72 overflow-hidden rounded-2xl border border-white/20 bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="border-b border-white/10 px-3 py-2">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#D1FF00]">
              <Sparkles className="h-3 w-3" />
              <span>Exportar Conhecimento</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Compatível com Obsidian, Notion e Markdown padrão.
            </p>
          </div>

          <div className="space-y-1 p-1">
            {/* Action 1: Download .md File */}
            <button
              onClick={handleDownloadMarkdown}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-zinc-200 hover:bg-[#D1FF00]/10 hover:text-[#D1FF00] transition-all group"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/50 group-hover:border-[#D1FF00]/40 group-hover:text-[#D1FF00]">
                <Download className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="font-medium text-white group-hover:text-[#D1FF00]">Baixar .MD (Obsidian)</div>
                <div className="text-[10px] text-zinc-400">Arquivo com frontmatter & callouts</div>
              </div>
            </button>

            {/* Action 2: Copy Markdown */}
            <button
              onClick={handleCopyMarkdown}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-zinc-200 hover:bg-[#D1FF00]/10 hover:text-[#D1FF00] transition-all group"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/50 group-hover:border-[#D1FF00]/40 group-hover:text-[#D1FF00]">
                {copiedState === 'markdown' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </div>
              <div>
                <div className="font-medium text-white group-hover:text-[#D1FF00]">
                  {copiedState === 'markdown' ? 'Copiado para a área de transferência!' : 'Copiar Markdown'}
                </div>
                <div className="text-[10px] text-zinc-400">Cole direto no Notion / Obsidian</div>
              </div>
            </button>

            {/* Action 3: Copy Shareable Link */}
            <button
              onClick={handleCopyLink}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-zinc-200 hover:bg-white/10 hover:text-white transition-all group"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/50 group-hover:border-white/20">
                {copiedState === 'link' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
              </div>
              <div>
                <div className="font-medium text-white">
                  {copiedState === 'link' ? 'Link copiado!' : 'Copiar Link do YouLearn'}
                </div>
                <div className="text-[10px] text-zinc-400">Compartilhar página de estudo</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Copy Notification Toast */}
      {copiedState !== 'none' && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-emerald-500/40 bg-zinc-950/95 px-4 py-2 text-xs font-semibold text-emerald-400 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>
            {copiedState === 'markdown' ? 'Markdown copiado com sucesso!' : 'Link copiado para a área de transferência!'}
          </span>
        </div>
      )}
    </div>
  );
}
