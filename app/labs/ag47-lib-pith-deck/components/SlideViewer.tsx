"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { DeckSlide, PitchDeck } from "../types";

interface SlideViewerProps {
  deck: PitchDeck;
}

export function SlideViewer({ deck }: SlideViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const totalSlides = deck.slides.length;
  const currentSlide: DeckSlide = deck.slides[currentSlideIndex] || {
    id: 1,
    slideNumber: "01",
    title: deck.title,
    subtitle: deck.subtitle,
    contentSnippet: deck.longDescription,
    visualType: "kpi",
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  return (
    <div className="flex flex-col overflow-hidden border border-[rgba(245,242,235,0.1)] bg-[#0d0f14]">
      {/* Slide Topbar */}
      <div className="flex items-center justify-between border-b border-[rgba(245,242,235,0.08)] bg-[#12141a] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#ff5722]">
            SLIDE {currentSlide.slideNumber || `0${currentSlideIndex + 1}`}
          </span>
          <span className="text-[rgba(245,242,235,0.2)]">/</span>
          <span className="font-mono text-xs text-[#8c877d]">
            0{totalSlides}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#8c877d]">
          <span>Modo de Apresentação Interativa</span>
        </div>

        {/* Slide Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            aria-label="Slide anterior"
            className="flex h-7 w-7 items-center justify-center border border-[rgba(245,242,235,0.1)] bg-[#161922] text-[#f5f2eb] hover:border-[#ff5722] hover:text-[#ff7043] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Próximo slide"
            className="flex h-7 w-7 items-center justify-center border border-[rgba(245,242,235,0.1)] bg-[#161922] text-[#f5f2eb] hover:border-[#ff5722] hover:text-[#ff7043] transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Canvas (16:9 aspect look) */}
      <div className="relative min-h-[300px] sm:min-h-[360px] p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#12151c] via-[#0e1017] to-[#090a0d] overflow-hidden">
        {/* Subtle Watermark */}
        <div className="absolute top-4 right-4 font-mono text-[60px] sm:text-[90px] font-extrabold text-[rgba(245,242,235,0.02)] pointer-events-none select-none">
          {currentSlide.slideNumber}
        </div>

        {/* Slide Content with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id || currentSlideIndex}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#ff5722]" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#ff7043]">
                {deck.title} // Tese Estratégica
              </span>
            </div>

            <h4 className="font-serif text-2xl sm:text-3xl font-normal text-[#f5f2eb] leading-tight max-w-2xl">
              {currentSlide.title}
            </h4>

            <p className="mt-2 text-sm text-[#9e9a91] font-mono leading-normal max-w-xl">
              {currentSlide.subtitle}
            </p>

            {/* Slide Body: Dynamic Graphic or Bullet Layout */}
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-12 sm:items-center">
              {/* Text Snippet & Bullets */}
              <div className="sm:col-span-7 space-y-3">
                <p className="text-xs sm:text-sm text-[#c7c3ba] leading-relaxed">
                  {currentSlide.contentSnippet}
                </p>

                {currentSlide.bullets && currentSlide.bullets.length > 0 && (
                  <ul className="mt-3 space-y-2 pt-2 border-t border-[rgba(245,242,235,0.06)]">
                    {currentSlide.bullets.map((b, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-[#9e9a91]"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#ff5722] mt-0.5 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Graphic Feature Box */}
              <div className="sm:col-span-5">
                {currentSlide.highlightMetric ? (
                  <div className="border border-[rgba(255,87,34,0.25)] bg-[#191516]/80 p-5 backdrop-blur-sm text-center">
                    <span className="font-mono text-3xl sm:text-4xl font-bold text-[#ff5722]">
                      {currentSlide.highlightMetric}
                    </span>
                    <p className="mt-1 font-mono text-[11px] text-[#c7c3ba]">
                      {currentSlide.highlightLabel || "Métrica Chave do Projeto"}
                    </p>
                  </div>
                ) : (
                  <div className="border border-[rgba(245,242,235,0.08)] bg-[#12141a]/80 p-4 text-xs font-mono text-[#8c877d] space-y-2">
                    <div className="flex items-center justify-between text-[#c7c3ba] border-b border-[rgba(245,242,235,0.06)] pb-1.5">
                      <span>CATEGORIA:</span>
                      <span className="text-[#ff5722]">{deck.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>ESTÁGIO:</span>
                      <span className="text-[#f5f2eb]">{deck.status}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>AUTORIA:</span>
                      <span className="text-[#f5f2eb]">{deck.author.name}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Progress Dots */}
        <div className="relative z-10 mt-6 pt-4 border-t border-[rgba(245,242,235,0.06)] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {deck.slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                aria-label={`Ir para slide ${idx + 1}`}
                className={`h-1.5 transition-all ${
                  currentSlideIndex === idx
                    ? "w-8 bg-[#ff5722]"
                    : "w-2 bg-[rgba(245,242,235,0.15)] hover:bg-[rgba(245,242,235,0.3)]"
                }`}
              />
            ))}
          </div>

          <span className="font-mono text-[11px] text-[#8c877d]">
            Pressione ← / → no teclado para navegar
          </span>
        </div>
      </div>
    </div>
  );
}
