/**
 * Agência 47 - Design System LIME
 * Versão energética e vibrante com tons de lima e ciano.
 */

export const theme = { 
  colors: { 
    primary: '#D1FF00', // Lima principal (Lime 500) - usado no botão de alternância entre Neon e Lime.
    secondary: '#3fe2ff', // Ciano (Cyan 500) - usado no botão de alternância entre Neon e Lime.
    accent: '#00d9ff', // Esmeralda (Emerald 500) - usado no botão de alternância entre Neon e Lime.
    textPrimary: '#ffffff', // Texto principal branco usado nos textos dos cards, em toda a navegação do site e em outros locais. 
    textSecondary: '#cbd5e7', // Usado em textos secundários e descrições em toda a navegação do site.
    textMuted: '#b2ffafff', // Usado em textos de menor importância e em elementos desabilitados em toda a navegação do site.
    textVoice: '#D1FF00', // Usado em titulos e icones de destaque  secundario na versão lime
    
    textRestagMarked: '#000000ff', // Usado em textos de destaque secundário na versão lime
    textRestagMarkedBG: '#D1FF00', // Usado em background de destaque secundário na versão lime
    // #01b378 cor usada em antigo textVoice (em títulos e ícones de destaque secundário na versão lime),  e em alguns textos e icones de destaque  na versão lime  
    
    // Especializados 
    scrollPercentage: '#D1FF00', // Lima para indicador de scroll usado na barra de progresso e no cabeçalho do site
    highlight: '#D1FF00', // Lima mais claro para destaque em textos e botões usados em toda a navegação do site.
    comet: {
      from: 'transparent', // Começa transparente usado na cauda do cometa
      via: '#00d9ff', // Cor intermediária do cometa usado no corpo do cometa
      to: '#D1FF00' // Cor final do cometa usado na cabeça do cometa
    },
    
    // Backgrounds & Glass
    glass: {
      bg: 'rgba(0, 0, 0, 0.5)', // Fundo escuro semi-transparente para contraste
      border: 'rgba(209, 255, 0, 0.1)', // Borda do vidro com um toque do verde lima principal
      blur: 'blur(24px)' // Efeito de desfoque para o vidro
    }
  },
  
  branding: { // Branding usado no botão de alternância entre Neon e Lime e na barra de progresso.
    startingPercent: 47, // Percentual inicial da marca
  },
  
  typography: { // Tipografia usada em toda a navegação do site.
    fontFamily: 'Inter, sans-serif', // Fonte principal do site
  },

  animations: { // Animações usadas em toda a navegação do site. 
    duration: 0.8, // Duração padrão das animações em segundos
    ease: [0.27, 1, 0.45, 1] as any, // Curva de easing personalizada para um movimento mais fluido
  }
}
