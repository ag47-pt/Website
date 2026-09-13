'use client'

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const formattedCurrent = currentStep < 10 ? `0${currentStep}` : `${currentStep}`
  const formattedTotal = totalSteps < 10 ? `0${totalSteps}` : `${totalSteps}`

  return (
    <div className="flex items-center gap-2 select-none pt-1">
      <span className="font-serif text-xs tracking-[0.25em] text-zinc-300 font-normal">
        {formattedCurrent}
      </span>
      <span className="w-4 h-[1px] bg-rose-600/60" />
      <span className="font-serif text-xs tracking-[0.25em] text-zinc-600 font-light">
        {formattedTotal}
      </span>
    </div>
  )
}
