/**
 * Agência 47 - Design System ORANGE
 * Versão energética e vibrante com tons de laranja e amarelo.
 */

export const theme = {
  colors: {
    primary: '#ffaa00', // Laranja principal (Orange 500) - usado no botão de alternância entre temas e em elementos de destaque primários.
    secondary: '#fff480', // Amarelo (Yellow 500) - usado em acentos secundários e detalhes de interface.
    accent: '#fff480', // Amarelo (Yellow 500) - usado em estados de hover e elementos de ênfase.
    textPrimary: '#ffffff', // Texto principal branco usado nos textos dos cards, em toda a navegação do site e em outros locais.
    textSecondary: '#cbd5e7', // Usado em textos secundários e descrições em toda a navegação do site.
    textMuted: '#ffaa0044', // Usado em textos de menor importância com um toque de transparência laranja.
    textVoice: '#805500', // Usado em títulos e ícones de destaque secundário na versão laranja.
    
    textRestagMarked: '#000000ff', // Usado em textos de destaque secundário na versão laranja
    textRestagMarkedBG: '#ffaa00', // Usado em background de destaque secundário na versão laranja
    
    // Especializados
    scrollPercentage: '#ffaa00', // Laranja para indicador de scroll usado na barra de progresso e no cabeçalho do site.
    highlight: '#ffaa00', // Laranja mais claro para destaque em textos e botões usados em toda a navegação do site.
    comet: {
      from: 'transparent', // Começa transparente usado na cauda do cometa.
      via: '#fff480', // Cor intermediária (Amarelo) usado no corpo do cometa.
      to: '#ffaa00' // Cor final (Laranja) usado na cabeça do cometa.
    },
    
    // Backgrounds & Glass
    glass: {
      bg: 'rgba(0, 0, 0, 0.5)', // Fundo escuro semi-transparente para o efeito de vidro.
      border: 'rgba(132, 204, 22, 0.1)', // Borda sutil para definir os limites dos elementos de vidro.
      blur: 'blur(24px)' // Intensidade do desfoque de fundo para o efeito Frosted Glass.
    }
  },
  
  branding: { // Branding usado no botão de alternância entre temas e na barra de progresso.
    startingPercent: 47, // O "número mágico" da Agência 47 que inicia as métricas e progressos.
  },
  
  typography: { // Tipografia usada em toda a navegação do site para garantir modernidade e legibilidade.
    fontFamily: 'Inter, sans-serif', // Fonte principal (Inter) para consistência visual.
  },

  animations: { // Configurações de animação usadas em toda a navegação do site para interações e transições fluidas.
    duration: 0.9, // Duração padrão das animações em segundos.
    ease: [0.27, 1, 0.45, 1] as any, // Curva de easing personalizada (Cubic Bezier) para um movimento mais premium.
  }
}
