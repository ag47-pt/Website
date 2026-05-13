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
      className="absolute -bottom-[1px] left-0 h-[2px] transition-all duration-300 ease-out z-[60]" 
      style={{ 
        width: `${widthPercent}%`,
        background: `linear-gradient(to right, transparent, ${theme.colors.comet.via}, ${theme.colors.comet.to})`,
        boxShadow: `0 0 10px ${theme.colors.comet.to}40` // Reduzido o brilho (demasiadamente acesa fix)
      }} 
    >
      {/* Bolinha Flamejante (Glow) - Suavizada para seguir o padrão da home */}
      <div 
        className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-white rounded-full transition-all duration-300 z-10"
        style={{ 
          boxShadow: `0 0 10px 2px ${theme.colors.comet.to}, 0 0 20px 4px ${theme.colors.comet.via}80`,
        }}
      >
        <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-50" />
      </div>
    </div>
  )
}
