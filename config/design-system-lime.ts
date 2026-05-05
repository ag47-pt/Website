/**
 * Agência 47 - Design System LIME
 * Versão energética e vibrante com tons de lima e ciano.
 */

export const theme = {
  colors: {
    primary: '#D1FF00', // Lima principal (Lime 500)
    secondary: '#00d9ffff', // Ciano (Cyan 500)
    accent: '#D1FF00', // Esmeralda (Emerald 500)
    
    // Especializados
    scrollPercentage: '#D1FF00',
    highlight: '#bef264', // Lima mais claro para destaque
    comet: {
      from: 'transparent',
      via: '#06b6d4',
      to: '#D1FF00'
    },
    
    // Backgrounds & Glass
    glass: {
      bg: 'rgba(0, 0, 0, 0.5)',
      border: 'rgba(132, 204, 22, 0.1)',
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
