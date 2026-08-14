'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { usePageScroll } from '@/hooks/usePageScroll';

interface ScrollToTopButtonProps {
  threshold?: number;
  className?: string;
}

export function ScrollToTopButton({
  threshold = 280,
  className = '',
}: ScrollToTopButtonProps) {
  const { theme } = useTheme();
  const scrollOffset = usePageScroll();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // SVG Circle parameters
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - scrollOffset * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 15 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className={`fixed bottom-12 right-6 sm:right-8 z-40 ${className}`}
        >
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Voltar ao topo da página"
            title="Voltar ao Topo e Filtros"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-black/80 hover:bg-black/95 border border-white/15 hover:border-white/30 text-gray-300 hover:text-white shadow-[0_4px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-300 hover:scale-110 active:scale-95"
          >
            {/* SVG Circular Progress Track & Fill */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
              viewBox="0 0 44 44"
            >
              {/* Background Track Circle */}
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="stroke-white/10 fill-none"
                strokeWidth="2.5"
              />
              {/* Animated Progress Circle */}
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="fill-none transition-[stroke-dashoffset] duration-150"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  stroke: theme.colors.primary,
                  filter: `drop-shadow(0 0 6px ${theme.colors.primary}80)`,
                }}
              />
            </svg>

            {/* Inner Arrow Icon */}
            <ArrowUp
              className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5"
              style={{ color: theme.colors.primary }}
            />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
