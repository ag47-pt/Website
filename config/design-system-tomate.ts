/**
 * Agência 47 - Design System TOMATE
 * Versão energética e vibrante com tons de tomate e laranja.
 */

export const theme = {
  colors: {
    primary: '#FF0000', // Vermelho Tomate (Red 500) - base energética e apaixonante.
    secondary: '#ff4d00', // Vermelho Alaranjado - para transições de calor e profundidade.
    accent: '#ff8080', // Coral Vibrante - para brilhos e destaques de alta intensidade.
    textPrimary: '#ffffff',
    textSecondary: '#cbd5e7',
    textMuted: '#ffc2c288', // Vermelho pálido translúcido para elementos secundários.
    textVoice: '#b30000', // Vermelho escuro para títulos e ícones de destaque.
    
    textRestagMarked: '#000000ff', 
    textRestagMarkedBG: '#FF0000',
    
    // Especializados
    scrollPercentage: '#FF0000',
    highlight: '#ff8080',
    comet: {
      from: 'transparent',
      via: '#ff4d00',
      to: '#ff8080'
    },
    
    // Backgrounds & Glass
    glass: {
      bg: 'rgba(0, 0, 0, 0.5)',
      border: 'rgba(255, 0, 0, 0.15)', // Borda avermelhada calibrada
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
