'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { InvitationResponses, DynamicHintRule } from '@/lib/invitations/types'

interface StepDynamicHintProps {
  responses: InvitationResponses
  dynamicHintRules: DynamicHintRule[]
  onProceed: () => void
}

export function StepDynamicHint({
  responses,
  dynamicHintRules,
  onProceed,
}: StepDynamicHintProps) {
  // Collect matched hints
  const matchedHints = dynamicHintRules
    .filter((rule) => responses[rule.key] === rule.value)
    .map((rule) => rule.hint)

  const hintsToDisplay =
    matchedHints.length > 0
      ? matchedHints
      : ['Alguns segredos ficam melhores quando descobertos no momento certo.']

  return (
    <div className="flex flex-col justify-between h-full max-w-md mx-auto w-full px-6 py-8">
      {/* Top Header */}
      <div className="flex flex-col gap-2.5 pt-2">
        <motion.h2
          initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-3xl sm:text-4xl font-normal text-white tracking-tight leading-tight"
        >
          Apenas uma pista.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-serif text-lg sm:text-xl text-zinc-400 font-light italic"
        >
          O restante você descobre depois.
        </motion.p>
      </div>

      {/* Center Clues Card */}
      <div className="my-auto py-6 flex flex-col gap-5">
        {hintsToDisplay.map((hint, idx) => (
          <motion.div
            key={hint}
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.2 + idx * 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              relative p-6 sm:p-7 rounded-3xl
              bg-gradient-to-br from-rose-950/30 via-zinc-900/60 to-zinc-950/80
              border border-rose-500/40 backdrop-blur-2xl
              shadow-[0_0_35px_rgba(190,18,60,0.22)]
            "
          >
            <p className="font-serif text-xl sm:text-2xl text-zinc-100 italic leading-relaxed font-light">
              “{hint}”
            </p>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA to the climax */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="pt-2"
      >
        <button
          type="button"
          onClick={onProceed}
          className="
            group relative w-full overflow-hidden rounded-full p-[1px]
            focus:outline-none transition-all duration-300 active:scale-[0.98]
            touch-manipulation shadow-[0_0_25px_rgba(190,18,60,0.25)]
          "
        >
          <span className="absolute inset-0 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 rounded-full opacity-80 group-hover:opacity-100 transition-opacity" />
          <span className="relative flex items-center justify-center gap-3 px-8 py-4 bg-zinc-950/90 rounded-full group-hover:bg-zinc-950/70 transition-all">
            <span className="font-serif text-base tracking-widest uppercase font-medium text-white group-hover:text-rose-200 transition-colors">
              Continuar
            </span>
            <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1.5 transition-transform duration-300" />
          </span>
        </button>
      </motion.div>
    </div>
  )
}
