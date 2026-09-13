'use client'

import { motion } from 'framer-motion'
import { InvitationStep } from '@/lib/invitations/types'
import { ChoiceCard } from './ChoiceCard'
import { ArrowRight } from 'lucide-react'

interface StepQuestionProps {
  step: InvitationStep
  selectedOptionId?: string
  onSelectOption: (optionId: string) => void
  onNext: () => void
}

export function StepQuestion({
  step,
  selectedOptionId,
  onSelectOption,
  onNext,
}: StepQuestionProps) {
  const isGrid = step.layout === 'grid'

  return (
    <div className="flex flex-col justify-between h-full max-w-md mx-auto w-full px-6 py-6">
      {/* Top Question Narrative */}
      <div className="flex flex-col gap-3 pt-2">
        <motion.h2
          key={step.prompt}
          initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-2xl sm:text-3xl font-normal leading-[1.25] text-white tracking-tight"
        >
          {step.prompt}
        </motion.h2>

        {step.subtext && (
          <motion.p
            key={step.subtext}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-serif text-lg sm:text-xl text-zinc-400 font-light italic leading-snug"
          >
            {step.subtext}
          </motion.p>
        )}
      </div>

      {/* Center Options */}
      <div
        className={`
          my-auto py-5
          ${
            isGrid
              ? 'grid grid-cols-1 gap-3.5 sm:grid-cols-2'
              : 'flex flex-col gap-3'
          }
        `}
      >
        {step.options?.map((option, idx) => (
          <ChoiceCard
            key={option.id}
            option={option}
            index={idx}
            isGrid={isGrid}
            isSelected={selectedOptionId === option.id}
            onSelect={onSelectOption}
          />
        ))}
      </div>

      {/* Bottom Affirmation CTA */}
      <div className="pt-2 min-h-[64px] flex items-center justify-end">
        {selectedOptionId && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            type="button"
            onClick={onNext}
            className="
              group relative overflow-hidden rounded-full p-[1px]
              focus:outline-none active:scale-[0.97] transition-all duration-300
              touch-manipulation shadow-[0_0_20px_rgba(190,18,60,0.25)]
            "
          >
            <span className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-400 rounded-full opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-2.5 px-6 py-2.5 bg-zinc-950 rounded-full">
              <span className="font-serif text-sm tracking-wider uppercase font-medium text-white group-hover:text-rose-200 transition-colors">
                Continuar
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </motion.button>
        )}
      </div>
    </div>
  )
}
