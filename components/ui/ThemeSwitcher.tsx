'use client'

import React from 'react'

export function ThemeSwitcher({ // onToggle é a função para alternar o tema, themeName é o nome do tema atual (ex: 'default', 'lime', 'orange')
  onToggle, // themeName é usado para determinar a cor do próximo tema e o estado atual
  themeName // O nome do tema atual para determinar a cor do próximo tema e o estado atual
}: { 
  onToggle: () => void, // Função para alternar o tema
  themeName: string // O nome do tema atual para determinar a cor do próximo tema e o estado atual
}) {
  const NEXT_COLOR: Record<string, string> = { // Define a cor do próximo tema com base no tema atual
    'default': '#D1FF00',  // next: lime
    'lime':    '#ffaa00',  // next: orange
    'orange':  '#0059ff',  // next: blue
    'blue':    '#FF0000',  // next: tomate
    'tomate':  '#ec4899',  // next: default (pink)
  }
  const CURRENT_COLOR: Record<string, string> = {
    'default': '#ec4899',
    'lime':    '#D1FF00',
    'orange':  '#ffaa00',
    'blue':    '#0059ff',
    'tomate':  '#FF0000',
  }
  const targetColor  = NEXT_COLOR[themeName]    ?? '#D1FF00'
  const currentColor = CURRENT_COLOR[themeName] ?? '#ec4899'

  return (
    <button 
      onClick={onToggle}
      className="w-9 h-9 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
      aria-label="Alterar Design System"
      title={`Mudar para tema ${NEXT_COLOR[themeName] ? ({ default: 'LIME', lime: 'ORANGE', orange: 'BLUE', blue: 'TOMATE', tomate: 'DEFAULT' }[themeName] ?? '') : ''}`}
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
