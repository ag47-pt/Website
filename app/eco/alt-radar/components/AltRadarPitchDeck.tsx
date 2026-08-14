'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { ALT_RADAR_CONFIG } from '@/data/alt-radar';
import { X, ChevronLeft, ChevronRight, Sparkles, CheckCircle2, Presentation } from 'lucide-react';

interface AltRadarPitchDeckProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AltRadarPitchDeck({ isOpen, onClose }: AltRadarPitchDeckProps) {
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = ALT_RADAR_CONFIG.pitchDeckSlides;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
      if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, slides.length]);

  if (!isOpen) return null;

  const slide = slides[currentSlide];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-4xl rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between min-h-[480px]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Presentation 
                className="w-5 h-5" 
                style={{ color: theme.colors.primary }}
              />
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                Pitch Deck Executivo • Slide {currentSlide + 1} de {slides.length}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Slide Content Body */}
          <div className="py-8 space-y-6">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {slide.title}
            </h2>
            <p 
              className="text-base sm:text-lg font-mono font-medium"
              style={{ color: theme.colors.primary }}
            >
              {slide.subtitle}
            </p>

            <div className="space-y-3 pt-4">
              {slide.points.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm sm:text-base text-zinc-300">
                  <CheckCircle2 
                    className="w-5 h-5 shrink-0 mt-0.5" 
                    style={{ color: theme.colors.primary }}
                  />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
            <div className="flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className="w-2.5 h-2.5 rounded-full transition-all cursor-pointer"
                  style={{
                    backgroundColor: idx === currentSlide ? theme.colors.primary : '#3f3f46',
                    width: idx === currentSlide ? '24px' : '10px'
                  }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Slide Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                className="p-2.5 rounded-xl text-black font-bold transition-all hover:scale-105 cursor-pointer shadow-lg"
                style={{ backgroundColor: theme.colors.primary }}
                title="Próximo Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
