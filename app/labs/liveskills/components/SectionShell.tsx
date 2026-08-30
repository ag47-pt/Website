'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import type { PresentationSectionCopy } from '../types';

/**
 * Chrome partilhado de todas as secções do motor LiveSkills.
 * Garante hierarquia semântica (section + aria-labelledby + h2) e
 * âncoras com offset correto face ao header fixo do layout /labs.
 */
export function SectionShell({
  id,
  copy,
  children,
  align = 'left',
}: {
  id: string;
  copy: PresentationSectionCopy;
  children: React.ReactNode;
  align?: 'left' | 'center';
}) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="scroll-mt-28"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`mb-6 sm:mb-8 ${align === 'center' ? 'text-center max-w-3xl mx-auto' : 'max-w-3xl'}`}
      >
        <p
          className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] mb-3 [text-shadow:0_2px_14px_rgba(0,0,0,0.9)]"
          style={{ color: theme.colors.primary }}
        >
          {copy.eyebrow}
        </p>
        <h2
          id={headingId}
          className="text-2xl sm:text-4xl font-black tracking-tight text-white text-balance [text-shadow:0_2px_14px_rgba(0,0,0,0.9)]"
        >
          {copy.title}
        </h2>
        {copy.description ? (
          <p className="mt-4 text-base leading-relaxed text-white/85 [text-shadow:0_2px_14px_rgba(0,0,0,0.9)]">
            {copy.description}
          </p>
        ) : null}
      </motion.div>

      {children}
    </section>
  );
}

/** Wrapper de reveal reutilizável, já preparado para prefers-reduced-motion. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
