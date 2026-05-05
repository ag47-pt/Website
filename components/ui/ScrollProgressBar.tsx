'use client'

import React from 'react'
import { usePageScroll } from '@/hooks/usePageScroll'

export function ScrollProgressBar() {
  const scrollOffset = usePageScroll()
  
  // Mantemos a estética da home: começa em 18% para a bolinha não sumir e vai até 100%
  const widthPercent = 18 + (scrollOffset * 82)
  
  return (
    <div 
      className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-transparent via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)] transition-all duration-75 ease-out" 
      style={{ width: `${widthPercent}%` }}
    >
      {/* Bolinha Flamejante (Glow) */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_15px_4px_rgba(236,72,153,1),0_0_30px_8px_rgba(168,85,247,0.8)]">
        <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
      </div>
    </div>
  )
}
