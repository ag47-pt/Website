'use client'

import { ArrowLeft } from 'lucide-react'

interface BackNavProps {
  onBack: () => void
  disabled?: boolean
}

export function BackNav({ onBack, disabled = false }: BackNavProps) {
  if (disabled) return <div className="w-8 h-8" />

  return (
    <button
      type="button"
      onClick={onBack}
      className="group flex items-center gap-2 text-zinc-500 hover:text-zinc-200 transition-all duration-300 py-2 px-1 -ml-1 active:scale-95 touch-manipulation"
      aria-label="Voltar"
    >
      <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-rose-400 group-hover:-translate-x-1 transition-all duration-300" />
      <span className="text-xs font-serif italic text-zinc-400 group-hover:text-zinc-200 transition-colors">
        voltar
      </span>
    </button>
  )
}
