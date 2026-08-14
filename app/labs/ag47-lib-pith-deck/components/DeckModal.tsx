"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Check,
  Flame,
  Clock,
  Layers,
  Sparkles,
} from "lucide-react";
import { PitchDeck } from "../types";
import { SlideViewer } from "./SlideViewer";

interface DeckModalProps {
  deck: PitchDeck | null;
  onClose: () => void;
  onPrevDeck: () => void;
  onNextDeck: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function DeckModal({
  deck,
  onClose,
  onPrevDeck,
  onNextDeck,
}: DeckModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!deck) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        onPrevDeck();
      } else if (e.key === "ArrowRight") {
        onNextDeck();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [deck, onClose, onPrevDeck, onNextDeck]);

  if (!deck) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#090a0d]/90 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden border border-[rgba(245,242,235,0.15)] bg-[#101217] shadow-2xl"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-[rgba(245,242,235,0.09)] bg-[#13161d] px-5 py-3.5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#ff5722]">
                {deck.code}
              </span>
              <span className="text-[rgba(245,242,235,0.2)]">/</span>
              <span className="font-mono text-xs text-[#8c877d]">
                {deck.category}
              </span>
              {deck.featured && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(255,87,34,0.35)] bg-[#ff5722]/10 px-2 py-0.5 text-[10px] font-medium text-[#ff7043]">
                  <Flame className="h-2.5 w-2.5" />
                  Destaque
                </span>
              )}
            </div>

            {/* Close Button */}
            <div className="flex items-center gap-3">
              <span className="hidden font-mono text-[11px] text-[#8c877d] sm:inline">
                ESC para fechar
              </span>
              <button
                onClick={onClose}
                aria-label="Fechar modal"
                className="flex h-8 w-8 items-center justify-center border border-[rgba(245,242,235,0.1)] bg-[#181b24] text-[#f5f2eb] hover:border-[#ff5722] hover:text-[#ff7043] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2 font-mono text-xs text-[#ff5722]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AG47 LABS // CURATED PITCH DECK</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#f5f2eb] leading-tight">
                {deck.title}
              </h2>
              <p className="mt-2 text-base sm:text-lg text-[#c7c3ba] font-normal leading-relaxed">
                {deck.subtitle}
              </p>
            </div>

            {/* Slide Viewer Component */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-[#f5f2eb]">
                  Visão de Slides // Apresentação
                </span>
                <span className="font-mono text-xs text-[#8c877d]">
                  {deck.slideCount} SLIDES NA APRESENTAÇÃO
                </span>
              </div>
              <SlideViewer deck={deck} />
            </div>

            {/* Context & Sidebar */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <h3 className="font-serif text-xl text-[#f5f2eb] border-b border-[rgba(245,242,235,0.08)] pb-2 mb-3">
                    Tese do Projeto & Contexto
                  </h3>
                  <p className="text-sm text-[#c7c3ba] leading-relaxed">
                    {deck.longDescription}
                  </p>
                </div>

                {deck.metrics && deck.metrics.length > 0 && (
                  <div>
                    <h3 className="font-serif text-lg text-[#f5f2eb] mb-3">
                      Métricas & Destaques de Negócio
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {deck.metrics.map((metric, idx) => (
                        <div
                          key={idx}
                          className="border border-[rgba(245,242,235,0.08)] bg-[#13161e] p-4 text-center"
                        >
                          <span className="font-mono text-2xl font-bold text-[#ff5722]">
                            {metric.value}
                          </span>
                          <p className="mt-1 font-mono text-[11px] text-[#8c877d]">
                            {metric.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-serif text-lg text-[#f5f2eb] border-b border-[rgba(245,242,235,0.08)] pb-2 mb-3">
                    Sumário dos Slides
                  </h3>
                  <div className="space-y-2">
                    {deck.slides.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between border border-[rgba(245,242,235,0.05)] bg-[#12141a] px-3.5 py-2 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-[#ff5722]">
                            {s.slideNumber}
                          </span>
                          <span className="text-[#f5f2eb] font-medium">
                            {s.title}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-[#8c877d] hidden sm:inline">
                          {s.visualType?.toUpperCase() || "GERAL"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div className="border border-[rgba(245,242,235,0.08)] bg-[#13161e] p-5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#8c877d]">
                    Curadoria & Autoria
                  </span>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center border border-[rgba(245,242,235,0.1)] bg-[#1c202a] font-mono text-sm font-bold text-[#ff5722]">
                      {deck.author.avatarText}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#f5f2eb]">
                        {deck.author.name}
                      </h4>
                      <p className="text-xs text-[#8c877d]">
                        {deck.author.role}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-[rgba(245,242,235,0.06)] pt-3 space-y-2 text-xs font-mono text-[#8c877d]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Leitura:
                      </span>
                      <span className="text-[#f5f2eb]">{deck.readTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Layers className="h-3 w-3" /> Slides:
                      </span>
                      <span className="text-[#f5f2eb]">{deck.slideCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Ano de Edição:</span>
                      <span className="text-[#f5f2eb]">{deck.year}</span>
                    </div>
                  </div>
                </div>

                <div className="border border-[rgba(245,242,235,0.08)] bg-[#13161e] p-5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#8c877d]">
                    Tags & Metadados
                  </span>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {deck.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-[rgba(245,242,235,0.08)] bg-[#090a0d] px-2.5 py-1 font-mono text-xs text-[#c7c3ba]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 border border-[#ff5722] bg-[#ff5722] py-3 text-xs font-semibold text-white transition-all hover:bg-[#ff7043]"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>
                      {downloading
                        ? "Gerando PDF do Deck..."
                        : "Download do Pitch Deck"}
                    </span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 border border-[rgba(245,242,235,0.12)] bg-[#13161e] py-3 text-xs font-medium text-[#f5f2eb] transition-all hover:border-[#ff5722]/50 hover:bg-[#181b25]"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#10b981]" />
                        <span className="text-[#10b981]">Link Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="h-3.5 w-3.5 text-[#8c877d]" />
                        <span>Compartilhar Projeto</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[rgba(245,242,235,0.09)] bg-[#13161d] px-5 py-3.5">
            <button
              onClick={onPrevDeck}
              className="flex items-center gap-1.5 text-xs font-mono text-[#c7c3ba] hover:text-[#ff5722] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Deck Anterior</span>
            </button>

            <span className="font-mono text-xs text-[#8c877d] hidden sm:inline">
              Navegue pelos projetos com ← e →
            </span>

            <button
              onClick={onNextDeck}
              className="flex items-center gap-1.5 text-xs font-mono text-[#c7c3ba] hover:text-[#ff5722] transition-colors"
            >
              <span>Próximo Deck</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
