'use client'

import { motion } from 'framer-motion'
import { ChoiceOption } from '@/lib/invitations/types'

interface ChoiceCardProps {
  option: ChoiceOption
  isSelected: boolean
  onSelect: (id: string) => void
  index: number
  isGrid?: boolean
}

export function ChoiceCard({
  option,
  isSelected,
  onSelect,
  index,
  isGrid = false,
}: ChoiceCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(option.id)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.12 + index * 0.09,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileTap={{ scale: 0.98 }}
      className={`
        group relative w-full text-left transition-all duration-300 rounded-2xl
        border backdrop-blur-xl touch-manipulation select-none overflow-hidden
        ${
          isGrid
            ? 'p-6 sm:p-7 flex flex-col justify-between min-h-[160px]'
            : 'p-5 sm:p-6 flex flex-col justify-center min-h-[76px]'
        }
        ${
          isSelected
            ? 'bg-gradient-to-br from-rose-950/40 via-zinc-900/70 to-zinc-950/90 border-rose-500/70 shadow-[0_0_32px_rgba(190,18,60,0.28)] ring-1 ring-rose-500/40'
            : 'bg-zinc-900/25 border-white/[0.07] hover:border-rose-900/40 hover:bg-zinc-900/45'
        }
      `}
    >
      {/* Active Velvet Sheen */}
      {isSelected && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(225,29,72,0.18),transparent_70%)] pointer-events-none" />
      )}

      <div className="relative z-10 flex flex-col gap-1.5 w-full">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`
              font-serif text-xl sm:text-2xl transition-all duration-300 leading-tight
              ${
                isSelected
                  ? 'text-white font-normal drop-shadow-[0_2px_12px_rgba(190,18,60,0.45)]'
                  : 'text-zinc-300 font-light group-hover:text-white'
              }
            `}
          >
            {option.label}
          </span>

          {/* Minimalist Editorial Accent (No radio button, just delicate velvet light) */}
          <div
            className={`
              w-2 h-2 rounded-full transition-all duration-400 shrink-0
              ${
                isSelected
                  ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.9)] scale-125'
                  : 'bg-white/10 group-hover:bg-white/20'
              }
            `}
          />
        </div>

        {option.secondaryText && (
          <p
            className={`
              font-serif text-sm sm:text-base italic leading-relaxed transition-colors duration-300 pt-0.5
              ${
                isSelected
                  ? 'text-rose-200/90 font-light'
                  : 'text-zinc-400/90 group-hover:text-zinc-300'
              }
            `}
          >
            {option.secondaryText}
          </p>
        )}
      </div>
    </motion.button>
  )
}
