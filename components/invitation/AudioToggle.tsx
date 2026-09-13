'use client'

import { useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

interface AudioToggleProps {
  audioSrc?: string
}

export function AudioToggle({ audioSrc }: AudioToggleProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handleToggle = () => {
    if (!audioSrc) {
      setIsPlaying((prev) => !prev)
      return
    }
    // Audio instance handling if audioSrc is provided in the future
    setIsPlaying((prev) => !prev)
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="relative p-2 rounded-full text-zinc-500 hover:text-zinc-200 transition-colors duration-250 active:scale-95 touch-manipulation group"
      title={isPlaying ? 'Silenciar ambiente' : 'Ativar som ambiente'}
      aria-label="Controle de áudio ambiente"
    >
      {isPlaying ? (
        <Volume2 className="w-4 h-4 text-rose-500 transition-transform duration-200 group-hover:scale-110" />
      ) : (
        <VolumeX className="w-4 h-4 text-zinc-500 transition-transform duration-200 group-hover:scale-110" />
      )}
      <span className="sr-only">Áudio</span>
    </button>
  )
}
