/**
 * Agência 47 - Design System Configuration (DEFAULT)
 * Versão principal em tons de rosa e roxo (Labs Classic).
 */

export const theme = {
  colors: {
    primary: '#ec4899', // Rosa Vibrante (Pink 500) - tom base clássico do Ag47 Labs.
    secondary: '#8b5cf6', // Violeta Tecnológico - para profundidade e acentos futuristas.
    accent: '#f472b6', // Rosa Claro Brilhante - para estados de hover e luzes de destaque.
    textPrimary: '#ffffff',
    textSecondary: '#cbd5e7',
    textMuted: '#fbcfe888', // Rosa pálido translúcido para elementos secundários.
    textVoice: '#9d174d', // Rosa denso para títulos e ícones de destaque.
    
    textRestagMarked: '#000000ff', 
    textRestagMarkedBG: '#ec4899',
    
    // Especializados
    scrollPercentage: '#ec4899',
    highlight: '#f472b6',
    comet: {
      from: 'transparent',
      via: '#8b5cf6',
      to: '#f472b6'
    },
    
    // Backgrounds & Glass
    glass: {
      bg: 'rgba(0, 0, 0, 0.5)',
      border: 'rgba(236, 72, 153, 0.15)', // Borda rosada calibrada
      blur: 'blur(24px)'
    }
  },
  
  branding: {
    startingPercent: 47,
  },
  
  typography: {
    fontFamily: 'Inter, sans-serif',
  },

  animations: {
    duration: 0.8,
    ease: [0.27, 1, 0.45, 1] as any,
  }
}
