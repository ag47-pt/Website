import { InvitationConfig } from './types'

export const lauraInvitationConfig: InvitationConfig = {
  slug: 'date',
  recipientName: 'Laura',
  totalQuestionSteps: 6,
  theme: {
    accentColor: '#BE123C', // Deep crimson editorial velvet
    accentGlow: 'rgba(190, 18, 60, 0.28)',
    bgPrimary: '#050505',
    cardBg: 'rgba(18, 18, 20, 0.65)',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    cardBorderHover: 'rgba(190, 18, 60, 0.4)',
    cardBorderActive: 'rgba(190, 18, 60, 0.85)',
    textPrimary: '#F5F5F7',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
  },
  whatsapp: {
    // Configurable author WhatsApp number (e.g. set NEXT_PUBLIC_WHATSAPP_PHONE in .env.local or modify below)
    phone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '351962200440',
    primaryCtaLabel: '😍Aceito. Deixo contigo.',
    primaryMessage: 'Sim. Aceito o convite. Agora quero ver o que você está aprontando 😏',
    secondaryCtaLabel: '☢️Aceito, mas quero negociar os termos.',
    secondaryMessage: 'Aceito, mas tenho algumas condições para negociar 😂',
  },
  intro: {
    lines: [
      '💌 Já te deixei saber, só faltava eu chamar.',
      'Então estou chamando.',
      'Mas um convite comum não me interessa, que graça teria?🤣',
    ],
    ctaLabel: 'Começar',
  },
  steps: [
    {
      id: 'day',
      stepNumber: 1,
      type: 'question',
      category: 'Disponibilidade',
      prompt: 'Antes de qualquer plano, precisamos resolver um pequeno problema chamado vida adulta.',
      subtext: 'Quando eu consigo roubar um dia ou algumas horas suas?',
      options: [
        { id: 'quinta', label: 'Quinta-feira 😏' },
        { id: 'sexta', label: 'Sexta-feira 😈' },
        { id: 'outra_semana', label: 'Melhor escolhermos "JUNTOS"' },
      ],
      layout: 'stacked',
    },
    {
      id: 'time',
      stepNumber: 2,
      type: 'question',
      category: 'Momento',
      prompt: 'Qual versão do dia combina mais?',
      options: [
        { id: 'almoco_tarde', label: 'Almoço + tarde' },
        { id: 'fim_tarde_noite', label: 'Fim de tarde + noite' },
        { id: 'noite', label: 'Noite' },
      ],
      layout: 'stacked',
    },
    {
      id: 'environment',
      stepNumber: 3,
      type: 'question',
      category: 'Atmosfera',
      prompt: 'Escolha sem pensar demais.',
      options: [
        {
          id: 'mar',
          label: 'MAR',
          secondaryText: 'vento, horizonte e nenhuma pressa',
          badge: '01',
        },
        {
          id: 'cidade',
          label: 'CIDADE',
          secondaryText: 'luzes, movimento e alguma coisa acontecendo',
          badge: '02',
        },
      ],
      layout: 'grid',
    },
    {
      id: 'control',
      stepNumber: 4,
      type: 'question',
      category: 'Curiosidade',
      prompt: 'Quanto você quer saber?',
      options: [
        {
          id: 'surpresa',
          label: 'Prefiro ser surpreendida',
          secondaryText: 'Você escolhe algumas coisas. O resto fica comigo.',
        },
        {
          id: 'pistas',
          label: 'Quero algumas pistas',
          secondaryText: 'Pode esconder o plano, mas não tudo.',
        },
      ],
      layout: 'stacked',
    },
    {
      id: 'vibe',
      stepNumber: 5,
      type: 'question',
      category: 'Dinâmica',
      prompt: 'E quando o plano começa a ficar interessante?',
      options: [
        { id: 'plano', label: 'Seguimos o plano' },
        { id: 'improviso', label: 'Improvisamos' },
        { id: 'ambos', label: 'Um pouco dos dois' },
      ],
      layout: 'stacked',
    },
    {
      id: 'dynamic_hint',
      stepNumber: 6,
      type: 'dynamic_hint',
      category: 'Confidencial',
      prompt: 'Uma prévia do que está por vir...',
      subtext: 'Com base nas tuas escolhas até aqui.',
    },
  ],
  dynamicHints: [
    {
      key: 'environment',
      value: 'mar',
      hint: 'Interessante. Então talvez exista horizonte envolvido.',
    },
    {
      key: 'environment',
      value: 'cidade',
      hint: 'Entendido. Luzes podem fazer parte da história.',
    },
    {
      key: 'control',
      value: 'surpresa',
      hint: 'O restante permanece estritamente confidencial.',
    },
    {
      key: 'control',
      value: 'pistas',
      hint: 'Posso revelar uma coisa: dificilmente vamos ficar no mesmo lugar a noite inteira.',
    },
  ],
  final: {
    title: 'Aprendi um pouco mais sobre você 💖.',
    subtitle: 'Agora eu cuido do resto.',
    subtext: 'Só falta confirmar uma coisa.',
  },
}
