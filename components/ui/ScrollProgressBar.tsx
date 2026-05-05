'use client'

import React from 'react'
import { useTheme } from '@/context/ThemeContext'
import { usePageScroll } from '@/hooks/usePageScroll'

export function ScrollProgressBar() {
  const scrollOffset = usePageScroll()
  const { theme } = useTheme()
  
  // Mantemos a estética da home: começa em 18% para a bolinha não sumir e vai até 100%
  const widthPercent = 18 + (scrollOffset * 82)
  
  return (
    <div 
      className="absolute bottom-0 left-0 h-[3px] transition-all duration-75 ease-out" 
      style={{ 
        width: `${widthPercent}%`,
        background: `linear-gradient(to right, ${theme.colors.comet.from}, ${theme.colors.comet.via}, ${theme.colors.comet.to})`,
        boxShadow: `0 0 15px ${theme.colors.comet.to}cc`
      }} 
    >
      {/* Bolinha Flamejante (Glow) */}
      <div 
        className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-white rounded-full transition-all duration-300"
        style={{ 
          boxShadow: `0 0 15px 4px ${theme.colors.comet.to}, 0 0 30px 8px ${theme.colors.comet.via}cc` 
        }}
      >
        <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
      </div>
    </div>
  )
}
