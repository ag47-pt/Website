/**
 * Agência 47 - Design System LIME
 * Versão energética e vibrante com tons de lima e ciano.
 */

export const theme = { 
  colors: { 
    primary: '#D1FF00', // Lima principal (Lime 500)
    secondary: '#00d9ffff', // Ciano (Cyan 500)
    accent: '#00d9ff', // Esmeralda (Emerald 500)
    
    // Especializados 
    scrollPercentage: '#D1FF00', // Lima para indicador de scroll
    highlight: '#D1FF00', // Lima mais claro para destaque
    comet: {
      from: 'transparent', // Começa transparente
      via: '#00d9ff', // Cor intermediária do cometa
      to: '#D1FF00' // Cor final do cometa
    },
    
    // Backgrounds & Glass
    glass: {
      bg: 'rgba(0, 0, 0, 0.5)', // Fundo escuro semi-transparente para contraste
      border: 'rgba(132, 204, 22, 0.1)', // Borda do vidro com um toque de verde
      blur: 'blur(24px)' // Efeito de desfoque para o vidro
    }
  },
  
  branding: {
    startingPercent: 47, // Percentual inicial da marca
  },
  
  typography: {
    fontFamily: 'Inter, sans-serif', // Fonte principal do site
  },

  animations: { 
    duration: 0.8, // Duração padrão das animações em segundos
    ease: [0.27, 1, 0.45, 1] as any, // Curva de easing personalizada para um movimento mais fluido
  }
}
