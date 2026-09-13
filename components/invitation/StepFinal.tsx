'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WhatsAppConfig } from '@/lib/invitations/types'
import { ArrowRight, Sparkles } from 'lucide-react'

interface StepFinalProps {
  title: string
  subtitle: string
  subtext: string
  whatsapp: WhatsAppConfig
  onComplete?: (ctaChosen: string) => void
}

// Generate radiant micro-particles for celebration burst
const PARTICLES = Array.from({ length: 20 }, (_, i) => {
  const angle = (i / 20) * Math.PI * 2 + (Math.sin(i) * 0.2)
  const distance = 55 + (i % 4) * 22
  const colors = ['#F43F5E', '#BE123C', '#FDA4AF', '#FDE047', '#FFFFFF']
  return {
    id: i,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    color: colors[i % colors.length],
    size: 3 + (i % 3) * 1.5,
  }
})

export function StepFinal({
  title,
  subtitle,
  subtext,
  whatsapp,
  onComplete,
}: StepFinalProps) {
  const [isBursting, setIsBursting] = useState(false)

  const getWhatsAppUrl = (message: string) => {
    const cleanPhone = whatsapp.phone.replace(/[^\d]/g, '')
    const encodedMessage = encodeURIComponent(message)
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`
  }

  const handleOpenWhatsApp = (message: string, label: string, withCelebration = false) => {
    onComplete?.(label)
    const url = getWhatsAppUrl(message)

    if (withCelebration) {
      setIsBursting(true)
      // Subtle mobile haptics if supported
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([30, 40, 50])
        } catch {
          // ignore
        }
      }
      setTimeout(() => {
        window.open(url, '_blank', 'noopener,noreferrer')
        setIsBursting(false)
      }, 650)
    } else {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="flex flex-col justify-between h-full max-w-md mx-auto w-full px-6 py-10">
      {/* Top spacer */}
      <div className="h-4" />

      {/* Center Climax Statements */}
      <div className="my-auto py-6 flex flex-col gap-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-3xl sm:text-4xl font-normal leading-[1.2] text-white tracking-tight"
        >
          {title}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="font-serif text-2xl sm:text-3xl font-light italic text-rose-400 drop-shadow-[0_2px_14px_rgba(190,18,60,0.4)] leading-relaxed"
        >
          “{subtitle}”
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="font-serif text-lg sm:text-xl text-zinc-400 font-light italic"
        >
          {subtext}
        </motion.p>
      </div>

      {/* Bottom Action CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="relative flex flex-col gap-3.5 pt-4 pb-2"
      >
        {/* Particle Shockwave & Burst Container */}
        <AnimatePresence>
          {isBursting && (
            <div className="absolute inset-x-0 top-4 h-16 pointer-events-none flex items-center justify-center z-30">
              {/* Radial shockwave glow */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0.9 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
                className="absolute w-44 h-44 rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.45)_0%,rgba(190,18,60,0.15)_50%,transparent_75%)]"
              />

              {/* Radiating sparkles */}
              {PARTICLES.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                  animate={{
                    x: p.x,
                    y: p.y,
                    opacity: [1, 1, 0],
                    scale: [0, 1.3, 0.4],
                  }}
                  transition={{
                    duration: 0.65,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute rounded-full shadow-[0_0_8px_currentColor]"
                  style={{
                    backgroundColor: p.color,
                    color: p.color,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Primary CTA with celebration micro-animation */}
        <button
          type="button"
          disabled={isBursting}
          onClick={() =>
            handleOpenWhatsApp(
              whatsapp.primaryMessage,
              whatsapp.primaryCtaLabel,
              true
            )
          }
          className={`
            group relative w-full overflow-hidden rounded-full p-[1px]
            focus:outline-none transition-all duration-300 select-none
            touch-manipulation shadow-[0_0_32px_rgba(190,18,60,0.35)]
            ${isBursting ? 'scale-[0.98] ring-2 ring-rose-400' : 'active:scale-[0.98]'}
          `}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 rounded-full opacity-90 group-hover:opacity-100 transition-opacity" />
          <span className="relative flex items-center justify-center gap-3 px-7 py-4 bg-zinc-950/90 rounded-full group-hover:bg-zinc-950/70 transition-all">
            <span className="font-serif text-lg sm:text-xl font-medium text-white tracking-wide">
              {whatsapp.primaryCtaLabel}
            </span>
            {isBursting ? (
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1.5 transition-transform duration-300" />
            )}
          </span>
        </button>

        {/* Secondary CTA */}
        <button
          type="button"
          disabled={isBursting}
          onClick={() =>
            handleOpenWhatsApp(
              whatsapp.secondaryMessage,
              whatsapp.secondaryCtaLabel,
              false
            )
          }
          className="
            w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full
            bg-zinc-900/40 hover:bg-zinc-900/70 active:scale-[0.98]
            border border-white/[0.1] hover:border-rose-500/40
            transition-all duration-300 touch-manipulation select-none
          "
        >
          <span className="font-serif text-sm sm:text-base text-zinc-300 font-light italic tracking-wide">
            {whatsapp.secondaryCtaLabel}
          </span>
        </button>
      </motion.div>
    </div>
  )
}
