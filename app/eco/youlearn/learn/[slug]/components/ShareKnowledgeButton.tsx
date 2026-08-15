'use client';

import React, { useState, useRef, useEffect } from 'react';
import { KnowledgeObject } from '@/eco/youlearn/schema/types';
import { formatDurationHuman } from '@/eco/youlearn/lib/provenance';
import { downloadKnowledgeBadgePng } from '@/eco/youlearn/lib/generateKnowledgeCard';
import { Share2, Copy, Check, Sparkles, X, MessageCircle, Send, Zap, Clock, TrendingUp, Download, Image as ImageIcon } from 'lucide-react';

interface ShareKnowledgeButtonProps {
  knowledge: KnowledgeObject;
}

export function ShareKnowledgeButton({ knowledge }: ShareKnowledgeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const { title, learning, source, category } = knowledge;
  const originalDuration = formatDurationHuman(learning.originalDurationMinutes);
  const compressedDuration = formatDurationHuman(learning.estimatedLearningMinutes);
  const efficiency = learning.compressionRatioPercent;

  // Fecha com clique fora ou tecla ESC
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const getPageUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return `https://ag47.pt/eco/youlearn/learn/${knowledge.slug}`;
  };

  const shareMessage = `⚡ Economize ${efficiency}% do seu tempo de estudo!\n\nAcabei de destilar "${title}" (${source.author.name}) no AG47 YouLearn: de ${originalDuration} para apenas ~${compressedDuration}.\n\nExplore o mapa mental e transcrição completa em:`;

  const handleCopy = async () => {
    try {
      const url = getPageUrl();
      const textToCopy = `${shareMessage}\n${url}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      try {
        const url = getPageUrl();
        const textToCopy = `${shareMessage}\n${url}`;
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (fallbackErr) {
        console.error('Failed to copy to clipboard:', fallbackErr);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  const handleShareTwitter = () => {
    const url = getPageUrl();
    const tweetText = `Estudei "${title}" em ~${compressedDuration} com o YouLearn (de ${originalDuration} originais - ${efficiency}% de ganho de tempo)! 🧠⚡`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}&hashtags=YouLearn,AG47,AI,Learning`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const url = getPageUrl();
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = () => {
    const url = getPageUrl();
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareMessage}\n${url}`)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareTelegram = () => {
    const url = getPageUrl();
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareMessage)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadPng = async () => {
    try {
      setIsGeneratingPng(true);
      await downloadKnowledgeBadgePng(knowledge);
    } catch (err) {
      console.error('Failed to generate PNG badge:', err);
    } finally {
      setIsGeneratingPng(false);
    }
  };

  return (
    <>
      {/* Botão de Disparo */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-[#D1FF00]/30 bg-[#D1FF00]/10 px-3.5 py-2 text-xs font-semibold text-[#D1FF00] backdrop-blur-md hover:bg-[#D1FF00] hover:text-black hover:border-[#D1FF00] transition-all shadow-lg shadow-black/40 group"
        title="Compartilhar Knowledge Badge"
      >
        <Share2 className="h-3.5 w-3.5 text-[#D1FF00] group-hover:text-black transition-colors" />
        <span>Compartilhar</span>
      </button>

      {/* Modal de Compartilhamento */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            ref={modalRef}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-zinc-950 p-5 sm:p-6 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-150"
          >
            {/* Botão Fechar */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Cabeçalho */}
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#D1FF00]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Compartilhar Conhecimento</span>
            </div>
            <h3 className="mt-1 text-lg font-bold text-white leading-snug">
              Knowledge Badge
            </h3>
            <p className="mt-0.5 text-xs text-zinc-400">
              Compartilhe a eficiência desta aula nas suas redes sociais ou baixe o card em HD.
            </p>

            {/* Visual Badge Preview */}
            <div className="mt-4 rounded-xl border border-white/15 bg-black/60 p-3.5 sm:p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-16 w-16 bg-[#D1FF00]/10 blur-xl rounded-full pointer-events-none" />
              
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D1FF00] bg-[#D1FF00]/10 px-2 py-0.5 rounded border border-[#D1FF00]/30">
                  {category}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  AG47 YOULEARN
                </span>
              </div>

              <div className="mt-2.5">
                <h4 className="text-xs sm:text-sm font-semibold text-white line-clamp-2">
                  {title}
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Por {source.author.name}
                </p>
              </div>

              {/* Metrics Pill Grid */}
              <div className="mt-3 grid grid-cols-3 gap-2 pt-2.5 border-t border-white/10 text-center">
                <div className="rounded-lg bg-white/[0.03] border border-white/5 p-1.5">
                  <div className="text-[9px] font-mono text-zinc-400 uppercase">Original</div>
                  <div className="text-xs font-mono font-bold text-white mt-0.5">{originalDuration}</div>
                </div>
                <div className="rounded-lg bg-[#D1FF00]/[0.05] border border-[#D1FF00]/20 p-1.5">
                  <div className="text-[9px] font-mono text-[#D1FF00] uppercase">YouLearn</div>
                  <div className="text-xs font-mono font-bold text-[#D1FF00] mt-0.5">~{compressedDuration}</div>
                </div>
                <div className="rounded-lg bg-emerald-500/[0.05] border border-emerald-500/20 p-1.5">
                  <div className="text-[9px] font-mono text-emerald-400 uppercase">Economia</div>
                  <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">{efficiency}%</div>
                </div>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="mt-5">
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2.5 font-semibold">
                Compartilhar em 1 clique
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* Twitter / X */}
                <button
                  onClick={handleShareTwitter}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-xs text-zinc-300 hover:border-white/30 hover:bg-white/10 hover:text-white transition-all active:scale-95"
                  title="Compartilhar no X (Twitter)"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="text-[10px] font-mono">X (Twitter)</span>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={handleShareLinkedIn}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-blue-500/20 bg-blue-500/[0.05] p-2.5 text-xs text-blue-300 hover:border-blue-500/40 hover:bg-blue-500/15 hover:text-white transition-all active:scale-95"
                  title="Compartilhar no LinkedIn"
                >
                  <svg className="h-4 w-4 text-blue-400 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2m1.4 9.74V9.93H5.06v8.57h2.8z" />
                  </svg>
                  <span className="text-[10px] font-mono">LinkedIn</span>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={handleShareWhatsApp}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-2.5 text-xs text-emerald-300 hover:border-emerald-500/40 hover:bg-emerald-500/15 hover:text-white transition-all active:scale-95"
                  title="Compartilhar no WhatsApp"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-[10px] font-mono">WhatsApp</span>
                </button>

                {/* Telegram */}
                <button
                  onClick={handleShareTelegram}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.05] p-2.5 text-xs text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-500/15 hover:text-white transition-all active:scale-95"
                  title="Compartilhar no Telegram"
                >
                  <Send className="h-4 w-4 text-cyan-400" />
                  <span className="text-[10px] font-mono">Telegram</span>
                </button>
              </div>
            </div>

            {/* Quick Actions (Download PNG & Copy Summary) */}
            <div className="mt-5 pt-3 border-t border-white/10 space-y-2">
              {/* Action 1: Download PNG Image Card */}
              <button
                onClick={handleDownloadPng}
                disabled={isGeneratingPng}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold font-mono uppercase tracking-wider bg-white/10 text-white border border-white/15 hover:bg-white/20 hover:border-[#D1FF00]/50 hover:text-[#D1FF00] transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                {isGeneratingPng ? (
                  <>
                    <div className="h-3.5 w-3.5 rounded-full border-2 border-[#D1FF00] border-t-transparent animate-spin" />
                    <span>Gerando Imagem HD...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5 text-[#D1FF00]" />
                    <span>Baixar Knowledge Badge (PNG)</span>
                  </>
                )}
              </button>

              {/* Action 2: Copy Summary & Link */}
              <button
                onClick={handleCopy}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold font-mono uppercase tracking-wider transition-all active:scale-95 ${
                  copied
                    ? 'bg-emerald-500 text-black border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : 'bg-[#D1FF00] text-black border border-[#D1FF00] hover:bg-lime-400 hover:shadow-[0_0_20px_rgba(209,255,0,0.3)]'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copiado com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copiar Resumo & Link</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
