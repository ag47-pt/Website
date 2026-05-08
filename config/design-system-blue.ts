/**
 * Agência 47 - Design System LIME
 * Versão energética e vibrante com tons de lima e ciano.
 */

export const theme = {
  colors: {
    primary: '#0059ff', // Azul principal (Blue 500)
    secondary: '#6399ff', // Azul claro (Blue 300)
    accent: '#6399ff', // Amarelo (Yellow 500)
    
    // Especializados
    scrollPercentage: '#0059ff', // Azul para indicador de scroll
    highlight: '#6399ff', // Azul mais claro para destaque
    comet: {
      from: 'transparent', // Começa transparente
      via: '#0059ff', // Passa pelo azul
      to: '#6399ff' // Termina no azul
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
