'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface StepIntroProps {
  lines: string[]
  ctaLabel: string
  onStart: () => void
}

export function StepIntro({ lines, ctaLabel, onStart }: StepIntroProps) {
  return (
    <div className="flex flex-col justify-between h-full max-w-md mx-auto w-full px-6 py-10">
      {/* Top spacer for balanced vertical optical center */}
      <div className="h-6" />

      {/* Center dramatic narrative reveal */}
      <div className="flex flex-col gap-7 sm:gap-9 my-auto py-6">
        {lines.map((line, index) => {
          const delay = 0.4 + index * 1.1

          return (
            <motion.div
              key={line}
              initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.9,
                delay,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              <p
                className={`
                  leading-[1.28] tracking-tight font-serif
                  ${
                    index === 0
                      ? 'text-2xl sm:text-3xl text-zinc-300 font-light italic'
                      : index === 1
                      ? 'text-3xl sm:text-4xl font-normal text-white drop-shadow-[0_2px_16px_rgba(190,18,60,0.35)]'
                      : 'text-xl sm:text-2xl font-light text-zinc-400'
                  }
                `}
              >
                {index === 1 ? (
                  <span className="relative inline-block">
                    {line}
                    <span className="absolute -bottom-1.5 left-0 w-full h-[1.5px] bg-gradient-to-r from-rose-600 via-rose-500 to-transparent" />
                  </span>
                ) : (
                  line
                )}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom Action CTA */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 3.4 }}
        className="w-full pt-4 pb-2"
      >
        <button
          type="button"
          onClick={onStart}
          className="
            group relative w-full overflow-hidden rounded-full p-[1px]
            focus:outline-none transition-all duration-300 active:scale-[0.98]
            touch-manipulation shadow-[0_0_25px_rgba(190,18,60,0.2)]
          "
        >
          {/* Seductive gradient border */}
          <span className="absolute inset-0 bg-gradient-to-r from-rose-600 via-rose-500 to-zinc-700 rounded-full opacity-80 group-hover:opacity-100 transition-opacity" />

          {/* Button interior */}
          <span className="relative flex items-center justify-center gap-3 px-8 py-4 bg-zinc-950/90 rounded-full transition-all duration-300 group-hover:bg-zinc-950/70">
            <span className="font-serif text-base tracking-widest uppercase font-medium text-white group-hover:text-rose-200 transition-colors">
              {ctaLabel}
            </span>
            <ArrowRight className="w-4 h-4 text-rose-500 group-hover:translate-x-1.5 transition-transform duration-300" />
          </span>
        </button>
      </motion.div>
    </div>
  )
}
