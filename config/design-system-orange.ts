/**
 * Agência 47 - Design System LIME
 * Versão energética e vibrante com tons de lima e ciano.
 */

export const theme = {
  colors: {
    primary: '#ffaa00', // Laranja principal (Orange 500)
    secondary: '#ffea00', // Amarelo (Yellow 500)
    accent: '#ffea00', // Amarelo (Yellow 500)
    
    // Especializados
    scrollPercentage: '#ffaa00', // Laranja para indicador de scroll
    highlight: '#ffaa00', // Laranja mais claro para destaque
    comet: {
      from: 'transparent', // Começa transparente
      via: '#ffea00', // Passa pelo amarelo
      to: '#ffaa00' // Termina no laranja
    },
    
    // Backgrounds & Glass
    glass: {
      bg: 'rgba(0, 0, 0, 0.5)', // Fundo escuro semi-transparente para contraste
      border: 'rgba(132, 204, 22, 0.1)', // Borda sutil com um toque de verde
      blur: 'blur(24px)' // Efeito de desfoque para o vidro
    }
  },
  
  branding: {
    startingPercent: 47, 
  },
  
  typography: {
    fontFamily: 'Inter, sans-serif',
  },

  animations: {
    duration: 0.9, // Duração padrão das animações em segundos
    ease: [0.27, 1, 0.45, 1] as any, // Curva de animação personalizada para um movimento mais fluido
  }
}
