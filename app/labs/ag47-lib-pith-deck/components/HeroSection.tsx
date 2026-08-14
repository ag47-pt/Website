"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, Flame, FileText, Compass } from "lucide-react";

interface HeroSectionProps {
  totalDecks: number;
  onExploreClick: () => void;
  onFeaturedClick: () => void;
}

export function HeroSection({
  totalDecks,
  onExploreClick,
  onFeaturedClick,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-[rgba(245,242,235,0.08)] bg-gradient-to-b from-[#090a0d] via-[#0d0f15] to-[#090a0d] py-14 sm:py-20 lg:py-24">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ff5722]/10 via-[#d97706]/5 to-transparent blur-3xl pointer-events-none" />

      {/* Atmospheric Abstract Layers */}
      <div className="absolute -right-16 top-12 hidden h-96 w-96 opacity-20 pointer-events-none xl:block">
        <div className="absolute inset-0 rotate-12 border border-[rgba(245,242,235,0.15)] bg-[#12141a]/60 backdrop-blur-sm" />
        <div className="absolute inset-4 -rotate-6 border border-[#ff5722]/30 bg-[#161922]/70 backdrop-blur-sm" />
        <div className="absolute inset-8 rotate-3 border border-[rgba(245,242,235,0.2)] bg-[#1a1d27]/80" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Main Typography */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2.5 border border-[rgba(245,242,235,0.1)] bg-[#12141a]/90 px-3.5 py-1.5 backdrop-blur-md"
            >
              <span className="flex h-2 w-2 items-center justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff5722]" />
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-[#c7c3ba]">
                Mural Editorial // Pitch Deck Library
              </span>
              <span className="text-[rgba(245,242,235,0.2)]">•</span>
              <span className="font-mono text-xs text-[#ff7043]">
                {totalDecks} decks selecionados
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl font-normal tracking-tight text-[#f5f2eb] sm:text-6xl lg:text-7xl leading-[1.08]"
            >
              Ideias que merecem{" "}
              <span className="italic text-[#ff5722] underline decoration-[rgba(255,87,34,0.35)] underline-offset-8">
                virar realidade.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-2xl text-base text-[#9e9a91] sm:text-lg leading-relaxed font-normal"
            >
              Uma biblioteca visual e curadoria estratégica de pitch decks,
              arquiteturas de produto e teses de negócio desenvolvidas para
              encantar investidores e transformar indústrias.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6"
            >
              <button
                onClick={onExploreClick}
                className="group relative flex items-center gap-2.5 overflow-hidden border border-[#ff5722] bg-[#ff5722] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(255,87,34,0.25)] transition-all duration-300 hover:bg-[#ff7043]"
              >
                <Compass className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                <span>Explorar Decks</span>
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>

              <button
                onClick={onFeaturedClick}
                className="group flex items-center gap-2 border border-[rgba(245,242,235,0.14)] bg-[#12141a]/90 px-6 py-3.5 text-sm font-medium text-[#f5f2eb] transition-all duration-300 hover:border-[#ff5722]/50 hover:bg-[#181b22] hover:text-white"
              >
                <Flame className="h-4 w-4 text-[#ff5722] transition-transform group-hover:scale-110" />
                <span>Ver Destaques</span>
              </button>
            </motion.div>
          </div>

          {/* Curatorial Feature Widget */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="relative border border-[rgba(245,242,235,0.1)] bg-[#111318]/90 p-6 backdrop-blur-xl shadow-2xl"
            >
              <div className="absolute -top-1 -left-1 h-2.5 w-2.5 border-t-2 border-l-2 border-[#ff5722]" />
              <div className="absolute -bottom-1 -right-1 h-2.5 w-2.5 border-b-2 border-r-2 border-[#ff5722]" />

              <div className="flex items-center justify-between border-b border-[rgba(245,242,235,0.08)] pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#ff5722]" />
                  <span className="font-mono text-xs uppercase tracking-wider text-[#f5f2eb]">
                    Guia da Coleção
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#8c877d]">
                  ARCHIVE // 47
                </span>
              </div>

              <div className="mt-4 space-y-3.5 text-xs text-[#9e9a91]">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-[11px] font-semibold text-[#ff5722]">
                    01
                  </span>
                  <p>
                    <strong className="text-[#f5f2eb]">Navegue por tópicos:</strong>{" "}
                    Startups, IA, Marketing, Web3 e Estratégia de Marca.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono text-[11px] font-semibold text-[#ff5722]">
                    02
                  </span>
                  <p>
                    <strong className="text-[#f5f2eb]">Simulador de slides:</strong>{" "}
                    Abra qualquer deck para folhear os slides da tese em alta resolução.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono text-[11px] font-semibold text-[#ff5722]">
                    03
                  </span>
                  <p>
                    <strong className="text-[#f5f2eb]">Métricas e modelos:</strong>{" "}
                    Insights de unit economics, mercado endereçável e tração.
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-[rgba(245,242,235,0.08)] pt-4 flex items-center justify-between text-[11px] text-[#8c877d]">
                <span>Status da Base:</span>
                <span className="flex items-center gap-1.5 text-[#10b981] font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                  Online & Atualizada
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
