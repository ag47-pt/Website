/**
 * Agência 47 - Design System ORANGE
 * Versão energética e vibrante com tons de laranja e amarelo.
 */

export const theme = {
  colors: {
    primary: '#ffaa00', // Laranja principal (Orange 500) - tom base energético e vibrante.
    secondary: '#ff4d00', // Laranja avermelhado (Orange-Red) - para contrastes de profundidade.
    accent: '#ffcc00', // Amarelo Ouro (Gold) - para brilhos e destaques de alta intensidade.
    textPrimary: '#ffffff', // Texto principal branco para máxima legibilidade sobre fundos escuros.
    textSecondary: '#cbd5e7', // Azul acinzentado suave para descrições e textos secundários.
    textMuted: '#ffd1b388', // Laranja pálido translúcido para metadados e elementos desativados.
    textVoice: '#ffaa00', // Laranja vibrante principal para títulos e ícones de destaque.
    
    textRestagMarked: '#ffffffff', // Preto sólido para texto sobre fundos de destaque.
    textRestagMarkedBG: '#ffaa00', // Fundo laranja para marcações de texto.
    
    // Especializados
    scrollPercentage: '#ffaa00', // Laranja para a barra de progresso de leitura.
    highlight: '#ffcc00', // Amarelo vibrante para destaques em hover e estados ativos.
    comet: {
      from: 'transparent', // Cauda do cometa (invisível)
      via: '#ff4d00', // Meio do cometa (vibrante)
      to: '#ffcc00' // Cabeça do cometa (brilhante)
    },
    
    // Backgrounds & Glass
    glass: {
      bg: 'rgba(0, 0, 0, 0.5)', 
      border: 'rgba(255, 170, 0, 0.15)', // Borda de vidro calibrada para o espectro laranja
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
