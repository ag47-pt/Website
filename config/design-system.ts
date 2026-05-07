/**
 * Agência 47 - Design System Configuration
 * Use este arquivo para centralizar todas as cores, tokens e comportamentos visuais do site.
 */

export const theme = { // Cores principais e especializadas para a marca
  colors: {
    primary: '#ec4899', // Rosa principal (Pink 500)
    secondary: '#a855f7', // Roxo (Purple 500)
    accent: '#a855f7', // Roxo (Purple 500)
    
    // Especializados
    scrollPercentage: '#ec4899',
    highlight: '#ec4899',
    comet: {
      from: 'transparent',
      via: '#a855f7',
      to: '#ec4899'
    },
    
    // Backgrounds & Glass
    glass: {
      bg: 'rgba(0, 0, 0, 0.4)',
      border: 'rgba(255, 255, 255, 0.1)',
      blur: 'blur(24px)'
    }
  },
  
  branding: {
    startingPercent: 47, // O "número mágico" da Agência 47
  },
  
  typography: { // Use a fonte Inter para uma aparência moderna e legível
    fontFamily: 'Inter, sans-serif', // Fonte principal
  }, // Comportamentoos visuais

  animations: { // Configurações de animação para interações e transições
    duration: 0.8, // 
    ease: [0.27, 1, 0.45, 1] as any, // Curva de animação personalizada
  } // Comportamentoos visuais 
} // Exporta o tema para uso em todo o site
