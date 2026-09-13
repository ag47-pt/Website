'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { InvitationConfig, InvitationResponses } from '@/lib/invitations/types'
import { ProgressIndicator } from './ProgressIndicator'
import { BackNav } from './BackNav'
import { AudioToggle } from './AudioToggle'
import { StepIntro } from './StepIntro'
import { StepQuestion } from './StepQuestion'
import { StepDynamicHint } from './StepDynamicHint'
import { StepFinal } from './StepFinal'

interface InvitationExperienceProps {
  config: InvitationConfig
}

type ScreenPhase = 'intro' | number | 'final'

export function InvitationExperience({ config }: InvitationExperienceProps) {
  const [phase, setPhase] = useState<ScreenPhase>('intro')
  const [direction, setDirection] = useState<number>(1)
  const [responses, setResponses] = useState<InvitationResponses>({})
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current)
      }
    }
  }, [])

  const trackEvent = (
    eventType: 'started' | 'completed',
    currentResponses?: InvitationResponses,
    ctaChosen?: string
  ) => {
    try {
      fetch('/api/invitations/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: config.slug,
          recipient: config.recipientName,
          eventType,
          responses: currentResponses || responses,
          ctaChosen,
        }),
      }).catch((err) => console.warn('Track event error:', err))
    } catch (e) {
      console.warn('Track event exception:', e)
    }
  }

  const handleStart = () => {
    setDirection(1)
    setPhase(0)
    trackEvent('started')
  }

  const handleSelectOption = (stepId: string, optionId: string) => {
    setResponses((prev) => ({
      ...prev,
      [stepId]: optionId,
    }))

    // Auto-advance with micro-delay for tactile visual feedback
    if (typeof phase === 'number') {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current)
      }

      autoAdvanceTimerRef.current = setTimeout(() => {
        handleNext()
      }, 350)
    }
  }

  const handleNext = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current)
    }

    if (phase === 'intro') {
      setDirection(1)
      setPhase(0)
    } else if (typeof phase === 'number') {
      setDirection(1)
      if (phase < config.steps.length - 1) {
        setPhase(phase + 1)
      } else {
        setPhase('final')
      }
    }
  }

  const handleBack = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current)
    }

    setDirection(-1)
    if (phase === 'final') {
      setPhase(config.steps.length - 1)
    } else if (typeof phase === 'number') {
      if (phase === 0) {
        setPhase('intro')
      } else {
        setPhase(phase - 1)
      }
    }
  }

  const currentStepData = typeof phase === 'number' ? config.steps[phase] : null
  const currentStepNumber = currentStepData?.stepNumber || 1

  // Slide animation variants
  const pageVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 32 : -32,
      opacity: 0,
      scale: 0.985,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -32 : 32,
      opacity: 0,
      scale: 0.985,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    }),
  }

  return (
    <main className="relative w-full h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#050505] text-[#F5F5F7] flex flex-col justify-between select-none">
      {/* Editorial Vignette & Deep Crimson Ambient Lighting */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_25%,rgba(190,18,60,0.12),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.8),transparent_80%)]"
        aria-hidden="true"
      />

      {/* Seductive Velvet Obsidian Ambient Glow - No grid lines */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,rgba(190,18,60,0.14),transparent_65%)]"
        aria-hidden="true"
      />

      {/* Top Bar Navigation */}
      <header className="relative z-20 w-full max-w-md mx-auto px-5 pt-4 pb-2 flex items-center justify-between shrink-0">
        <div className="w-16 flex items-center justify-start">
          {phase !== 'intro' ? (
            <BackNav onBack={handleBack} />
          ) : (
            <div className="w-8 h-8" />
          )}
        </div>

        <div className="flex-1 flex justify-center">
          {typeof phase === 'number' && (
            <ProgressIndicator
              currentStep={currentStepNumber}
              totalSteps={config.totalQuestionSteps}
            />
          )}
        </div>

        <div className="w-16 flex items-center justify-end">
          <AudioToggle />
        </div>
      </header>

      {/* Main Step Canvas */}
      <div className="relative z-10 flex-1 w-full overflow-hidden flex flex-col justify-center">
        <AnimatePresence custom={direction} mode="wait">
          {phase === 'intro' && (
            <motion.div
              key="intro"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full flex flex-col justify-center"
            >
              <StepIntro
                lines={config.intro.lines}
                ctaLabel={config.intro.ctaLabel}
                onStart={handleStart}
              />
            </motion.div>
          )}

          {typeof phase === 'number' && currentStepData && (
            <motion.div
              key={currentStepData.id}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full flex flex-col justify-center"
            >
              {currentStepData.type === 'dynamic_hint' ? (
                <StepDynamicHint
                  responses={responses}
                  dynamicHintRules={config.dynamicHints}
                  onProceed={handleNext}
                />
              ) : (
                <StepQuestion
                  step={currentStepData}
                  selectedOptionId={responses[currentStepData.id]}
                  onSelectOption={(optionId) =>
                    handleSelectOption(currentStepData.id, optionId)
                  }
                  onNext={handleNext}
                />
              )}
            </motion.div>
          )}

          {phase === 'final' && (
            <motion.div
              key="final"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full flex flex-col justify-center"
            >
              <StepFinal
                title={config.final.title}
                subtitle={config.final.subtitle}
                subtext={config.final.subtext}
                whatsapp={config.whatsapp}
                onComplete={(ctaChosen) =>
                  trackEvent('completed', responses, ctaChosen)
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </main>
  )
}
