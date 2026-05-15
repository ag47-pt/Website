/**
 * Agência 47 - Design System BLUE
 * Versão tecnológica e sóbria com tons de azul e ciano.
 */

export const theme = {
  colors: {
    primary: '#ffffffff', // Azul Royal (Blue 500) - tom base tecnológico e profundo.
    secondary: '#00f2ff', // Ciano Neon - para brilhos de interface e acentos vibrantes.
    accent: '#fbfbfcff', // Azul Brilhante - para estados de hover e luzes de destaque.
    textPrimary: '#ffffff', // Texto principal branco.
    textSecondary: '#cbd5e7', // Cinza azulado para descrições.
    textMuted: '#fbfcfe88', // Azul pálido translúcido para elementos secundários.
    textVoice: '#6a8ecfff', // Azul denso para títulos e ícones de destaque.
    
    textRestagMarked: '#ffffffff', 
    textRestagMarkedBG: '#0059ff',
    
    // Especializados
    scrollPercentage: '#0059ff',
    highlight: '#00f2ff', // Ciano para destaques técnicos.
    comet: {
      from: 'transparent',
      via: '#00f2ff',
      to: '#0059ff'
    },
    
    // Backgrounds & Glass
    glass: {
      bg: 'rgba(255, 255, 255, 0.5)',
      border: 'rgba(0, 89, 255, 0.15)', // Borda azulada calibrada
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
