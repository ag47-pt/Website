'use client'

import React from 'react'

export function ThemeSwitcher({ 
  onToggle, 
  themeName 
}: { 
  onToggle: () => void, 
  themeName: string 
}) {
  const targetColor = themeName === 'default' ? '#D1FF00' : '#ec4899'
  const currentColor = themeName === 'default' ? '#ec4899' : '#D1FF00'

  return (
    <button 
      onClick={onToggle}
      className="w-9 h-9 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
      aria-label="Alterar Design System"
      title={`Mudar para tema ${themeName === 'default' ? 'LIME' : 'Main'}`}
    >
      <style>{`
        @keyframes themePulse {
          0% { box-shadow: 0 0 0px 0px ${targetColor}40; }
          50% { box-shadow: 0 0 12px 2px ${targetColor}60; }
          100% { box-shadow: 0 0 0px 0px ${targetColor}40; }
        }
        .animate-theme-pulse {
          animation: themePulse 3s infinite ease-in-out;
        }
      `}</style>

      {/* Círculo Interno Pulsante com a cor do ALVO */}
      <div 
        className="w-4 h-4 rounded-full border transition-all duration-500 relative z-10 flex items-center justify-center animate-theme-pulse"
        style={{ borderColor: `${targetColor}40` }}
      >
        <div 
          className="w-1.5 h-1.5 rounded-full transition-all duration-500"
          style={{ backgroundColor: targetColor }}
        />
      </div>
      
      {/* Glow background dinâmico (Cor do Atual no Hover) */}
      <div 
        className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle at center, ${currentColor}20 0%, transparent 70%)` }}
      />

      {/* Indicador de estado (Cor do Atual) */}
      <div 
        className="absolute -bottom-1 w-1 h-1 rounded-full transition-all duration-500"
        style={{ 
          backgroundColor: currentColor,
          boxShadow: `0 0 8px ${currentColor}`
        }}
      />
    </button>
  )
}
