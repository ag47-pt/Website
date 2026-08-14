/**
 * Dados Canónicos e Tipados do Universo 2D — Agência 47 (ag47.pt)
 * Padrão EvoPro / Alt-Radar Architecture
 */

export interface ServiceItem {
  id: string;
  slug: string;
  tag: string;
  title: string;
  headline: string;
  description: string;
  deliveryTime: string;
  features: string[];
  metrics: { label: string; value: string }[];
  iconName: string;
  accentColor: string;
  linkHref?: string;
  imageUrl?: string;
}

export interface AdvantageComparisonItem {
  metric: string;
  ag47Way: string;
  ag47Highlight: boolean;
  traditionalWay: string;
  impact: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  subtitle: string;
  category: 'core' | 'ai_engine' | 'fintech' | 'hospitality' | 'editorial';
  categoryLabel: string;
  status: 'LIVE' | 'BETA' | 'ACTIVE_SECTOR' | 'NEW_RELEASE';
  description: string;
  techStack: string[];
  path: string;
  externalLink?: string;
  featuredMetric: { label: string; value: string };
  badgeText: string;
  imageUrl?: string;
}

export interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  tagline: string;
  priceProject: string;
  priceMonthly?: string;
  periodLabel: string;
  targetAudience: string;
  features: string[];
  deliverables: string[];
  ctaText: string;
  ctaUrl: string;
  isPopular?: boolean;
  accent: string;
}

export interface TerminalCommandItem {
  command: string;
  shortcut: string;
  description: string;
  outputLines: string[];
}

export interface MetricItem {
  value: string;
  label: string;
  detail: string;
  change?: string;
}

export const UNIVERSO_2D_DATA = {
  brand: {
    name: 'Agência 47',
    tagline: 'O Hub Definitivo de Engenharia de Software, IA Proprietária & Conversão Bruta',
    mantra: '"Transformamos negócios complexos em ecossistemas digitais de alta conversão, ultra-rápidos e movidos a IA."',
    version: 'v2026.4.7',
    status: 'SYSTEMS_OPERATIONAL',
    edgeNodes: '310+ Global Edge Locales',
    uptime: '99.98%',
    domain: 'ag47.pt',
    email: 'contacto@ag47.pt',
    whatsapp: 'https://wa.me/351912345678',
  },

  heroMetrics: [
    { value: '98+', label: 'PageSpeed Score Médio', detail: 'Core Web Vitals perfeitos em mobile e desktop' },
    { value: '7 Dias', label: 'Tempo Médio de Entrega', detail: 'Do briefing aprovado ao deploy em produção' },
    { value: '+180%', label: 'Aumento Médio de Leads', detail: 'Taxa de conversão em Landing Pages de Alta Performance' },
    { value: '0', label: 'Templates Lentos / WordPress', detail: '100% código artesanal em Next.js 15 e TypeScript' },
  ],

  about: {
    title: 'Quem Somos',
    subtitle: 'A interseção perfeita entre engenharia de software de ponta e marketing de alta conversão',
    description: `A Agência 47 nasceu para destruir a mediocridade das agências digitais convencionais. Não vendemos sites genéricos em WordPress nem empurramos dashboards inchados que ninguém usa. Construímos ecossistemas digitais proprietários, rápidos como um relâmpago, otimizados para converter visitantes em clientes pagantes e potencializados por modelos de inteligência artificial de última geração.`,
    pillars: [
      {
        icon: 'Zap',
        title: 'Velocidade Obsessiva',
        description: 'Páginas que carregam em menos de 800ms. A cada 100ms a mais de espera, você perde 7% de conversão. Nós eliminamos todo atrito.',
      },
      {
        icon: 'Cpu',
        title: 'Inteligência Artificial Proprietária',
        description: 'Integramos agentes autônomos, preditores quantitativos e modelos de linguagem diretamente nos processos da sua empresa.',
      },
      {
        icon: 'Target',
        title: 'Conversão Matemática (+EV)',
        description: 'Design psicológico orientado a resultados, copywriting cirúrgico e tracking de ponta a ponta sem perda de dados.',
      },
      {
        icon: 'ShieldCheck',
        title: 'Engenharia de Grau Militar',
        description: 'Next.js 15, TypeScript estrito, arquitetura Serverless, Cloudflare Edge e Google Firebase/Cloud com segurança por padrão.',
      },
    ],
  },

  advantagesComparison: [
    {
      metric: 'Arquitetura e Stack',
      ag47Way: 'Next.js 15, React 19, TypeScript e Edge Network',
      ag47Highlight: true,
      traditionalWay: 'WordPress, Elementor, PHP monolítico pesado',
      impact: 'Tempo de carregamento 4.8x mais veloz',
    },
    {
      metric: 'Tempo de Lançamento',
      ag47Way: '7 a 14 dias úteis com sprints contínuos',
      ag47Highlight: true,
      traditionalWay: '2 a 4 meses de burocracia e reuniões infinitas',
      impact: 'Seu produto validando e faturando no mercado muito mais cedo',
    },
    {
      metric: 'Design & Exclusividade',
      ag47Way: 'Design System sob medida, visual fluido e Dark Mode OLED',
      ag47Highlight: true,
      traditionalWay: 'Templates prontos comprados por $29 com código poluído',
      impact: 'Autoridade imediata e percepção de valor 10x superior',
    },
    {
      metric: 'Inteligência Artificial',
      ag47Way: 'Agentes autônomos, extração de dados e automação real',
      ag47Highlight: true,
      traditionalWay: 'Nenhuma ou apenas plugins de chat genéricos e lentos',
      impact: 'Redução de custos operacionais e atendimento 24/7 inteligente',
    },
    {
      metric: 'SEO & Core Web Vitals',
      ag47Way: 'Score 98-100/100, Schema Markup e JSON-LD nativos',
      ag47Highlight: true,
      traditionalWay: 'Score 30-60/100, travamentos de render e CLS alto',
      impact: 'Rankings orgânicos superiores no Google com menor CPC',
    },
    {
      metric: 'Suporte & Manutenção',
      ag47Way: 'Acesso direto aos engenheiros criadores sem intermediários',
      ag47Highlight: true,
      traditionalWay: 'Atendimento por tickets de suporte demorados',
      impact: 'Resolução de melhorias e ajustes em horas, não semanas',
    },
  ] as AdvantageComparisonItem[],

  services: [
    {
      id: 'srv-web',
      slug: 'websites-landing-pages',
      tag: 'Desenvolvimento Elite',
      title: 'Websites & Landing Pages de Alta Conversão',
      headline: 'A sua máquina de vendas digital de carregamento instantâneo',
      description: 'Construímos páginas sob medida focadas em conversão bruta. Cada secção, gatilho visual e linha de copy é orquestrada para transformar tráfego em receita.',
      deliveryTime: '7 dias úteis',
      features: [
        'Arquitetura Next.js 15 com renderização no Edge',
        'SEO Técnico com Schema Markup & OpenGraph completo',
        'Copywriting persuasivo focado na dor do cliente',
        'Design responsivo mobile-first com micro-interações fluidas',
        'Integração total com CRM, WhatsApp e Webhooks',
      ],
      metrics: [
        { label: 'PageSpeed Médio', value: '99/100' },
        { label: 'Tempo LCP', value: '< 0.7s' },
        { label: 'Lift de Conversão', value: '+180%' },
      ],
      iconName: 'Globe',
      accentColor: '#10b981',
      linkHref: '/servicos/websites-landing-pages',
      imageUrl: '/imgs/service_web_design_pt.webp',
    },
    {
      id: 'srv-saas',
      slug: 'saas-webapps',
      tag: 'Engenharia de Produto',
      title: 'SaaS & Web Applications Escaláveis',
      headline: 'Transformamos ideias complexas em softwares funcionais e lucrativos',
      description: 'Desenvolvimento full-stack de aplicativos web modernos, painéis administrativos de alta densidade, sistemas de autenticação, multi-tenant e checkout integrado.',
      deliveryTime: '15 a 30 dias úteis',
      features: [
        'Painéis de controle de alta densidade (Bento Grid)',
        'Autenticação segura (NextAuth / Supabase / Firebase)',
        'Pagamentos recorrentes e assinaturas com Stripe / Stripe Billing',
        'Banco de dados em tempo real com regras de segurança estritas',
        'APIs REST e Webhooks para automações externas',
      ],
      metrics: [
        { label: 'Uptime Garantido', value: '99.98%' },
        { label: 'Latência de Banco', value: '< 25ms' },
        { label: 'Escala Concorrente', value: '50k+ req/s' },
      ],
      iconName: 'Layers',
      accentColor: '#06b6d4',
      linkHref: '/servicos/saas-webapps',
      imageUrl: '/imgs/service_saas_pt.webp',
    },
    {
      id: 'srv-social',
      slug: 'social-media-conteudo',
      tag: 'Branding & Retenção',
      title: 'Social Media & Estratégia de Conteúdo Visual',
      headline: 'Construa autoridade implacável e retenha a atenção do seu mercado',
      description: 'Produção visual estratégica, design editorial técnico e campanhas de conteúdo que posicionam a sua empresa como o líder incontestável do seu nicho.',
      deliveryTime: 'Recorrência mensal',
      features: [
        'Identidade visual de alto padrão e consistente',
        'Roteirização de vídeos curtos (Reels / TikTok) de alta retenção',
        'Carrosséis educativos de altíssimo compartilhamento',
        'Calendário editorial orientado aos lançamentos da empresa',
        'Direção de arte com estética moderna Dark Mode / High-Tech',
      ],
      metrics: [
        { label: 'Alcance Orgânico', value: '4.2x' },
        { label: 'Taxa de Retenção', value: '78%' },
        { label: 'Engajamento Médio', value: '+240%' },
      ],
      iconName: 'Sparkles',
      accentColor: '#D1FF00',
      linkHref: '/servicos/social-media-conteudo',
      imageUrl: '/imgs/service_social_media_pt.webp',
    },
    {
      id: 'srv-traffic',
      slug: 'trafego-pago-conversao',
      tag: 'Growth & Aquisição',
      title: 'Tráfego Pago & Otimização de Conversão (+EV)',
      headline: 'Aquisição previsível de clientes qualificados com ROAS positivo',
      description: 'Gestão matemática de mídia paga no Meta Ads e Google Ads com tracking blindado (CAPI), testes A/B contínuos e foco estrito no custo por aquisição (CAC).',
      deliveryTime: 'Recorrência mensal',
      features: [
        'Instalação de Meta Conversions API (CAPI) e GTM Server-Side',
        'Segmentação avançada e testes multivariados de criativos',
        'Funis de venda e esteiras de conversão personalizadas',
        'Relatórios executivos semanais sem vaidade (foco em ROI e CAC)',
        'Otimização contínua de páginas de destino vinculadas aos anúncios',
      ],
      metrics: [
        { label: 'ROAS Médio', value: '4.8x' },
        { label: 'Redução de CAC', value: '-35%' },
        { label: 'Precisão Tracking', value: '99.4%' },
      ],
      iconName: 'TrendingUp',
      accentColor: '#f59e0b',
      linkHref: '/servicos/trafego-pago-conversao',
      imageUrl: '/imgs/service_ads_pt.webp',
    },
    {
      id: 'srv-ai',
      slug: 'ai-autonomous-agents',
      tag: 'Vanguarda Tecnológica',
      title: 'Soluções de Inteligência Artificial & Agentes Autônomos',
      headline: 'Automatize fluxos de trabalho e crie produtos orientados por IA',
      description: 'Integração de LLMs de última geração, sistemas RAG de extração de conhecimento, assistentes preditivos e agentes autônomos para acelerar o seu negócio.',
      deliveryTime: '10 a 20 dias úteis',
      features: [
        'Extração automática de conhecimento de vídeos e documentos (YouLearn)',
        'Modelos preditivos e quantitativos em tempo real (Apex & Oracle)',
        'Pipelines de evolução de código e refatoração assistida (EvoPro)',
        'Agentes conversacionais inteligentes integrados ao WhatsApp e Web',
        'Workflows autônomos conectados a APIs e bancos de dados corporativos',
      ],
      metrics: [
        { label: 'Horas Economizadas', value: '120h+/mês' },
        { label: 'Tempo Resposta IA', value: '< 600ms' },
        { label: 'Acurácia de RAG', value: '99.2%' },
      ],
      iconName: 'Brain',
      accentColor: '#10b981',
      linkHref: '/eco',
      imageUrl: '/imgs/service_ai_agent.jpg',
    },
  ] as ServiceItem[],

  portfolio: [
    {
      id: 'port-evopro',
      title: 'EvoPro — Evolution Protocol',
      subtitle: 'Plataforma Canónica de Evolução Contínua de Software & IA',
      category: 'ai_engine',
      categoryLabel: 'AI Engine & Framework',
      status: 'LIVE',
      description: 'Engine determinística para automação de testes, gauntlets de qualidade, análise de AST e evolução contínua de código com IA.',
      techStack: ['Next.js 15', 'TypeScript', 'Web Audio API', 'OLED Theme', 'AST Graph'],
      path: '/eco/evopro',
      featuredMetric: { label: 'Gauntlet Pass Rate', value: '100%' },
      badgeText: 'CORE ECOSYSTEM',
      imageUrl: '/imgs/evopro_product_mockup.jpg',
    },
    {
      id: 'port-altradar',
      title: 'Alt Radar',
      subtitle: 'Stream em Tempo Real de Sentimento & Segurança Cripto',
      category: 'fintech',
      categoryLabel: 'Fintech & Security',
      status: 'LIVE',
      description: 'Radar de auditoria de tokens, scoring de segurança, pipeline em tempo real e visualização de streams on-chain.',
      techStack: ['FastAPI', 'Next.js 15', 'WebSockets', 'Chart.js', 'Solana/EVM'],
      path: '/eco/alt-radar',
      featuredMetric: { label: 'Latência de Stream', value: '120ms' },
      badgeText: 'REALTIME STREAM',
      imageUrl: '/imgs/altradar_product_mockup.jpg',
    },
    {
      id: 'port-youlearn',
      title: 'AG47 YouLearn',
      subtitle: 'Extração de Conhecimento e Aprendizado Ativo de Vídeos',
      category: 'ai_engine',
      categoryLabel: 'Knowledge Extraction',
      status: 'NEW_RELEASE',
      description: 'Ingestão de vídeos do YouTube com transcrição sincronizada, keyframes visuais e cadernos de estudo interativos.',
      techStack: ['Gemini 2.5 Flash', 'Next.js 15', 'Tailwind v4', 'YouTube API'],
      path: '/eco/youlearn',
      featuredMetric: { label: 'Velocidade de Ingestão', value: '3.4s' },
      badgeText: 'NOVO LANÇAMENTO',
      imageUrl: '/imgs/youlearn_product_mockup.jpg',
    },
    {
      id: 'port-apex',
      title: 'APEX Predictor',
      subtitle: 'Previsões Quantitativas do Mercado de Bitcoin com IA',
      category: 'fintech',
      categoryLabel: 'Quantitative AI',
      status: 'BETA',
      description: 'Modelagem preditiva multitemporal para ciclos de mercado do Bitcoin com calibração probabilística avançada.',
      techStack: ['Python Core', 'FastAPI', 'Apex Engine', 'Chart.js'],
      path: '/labs/apex',
      featuredMetric: { label: 'Precisão Histórica', value: '84.2%' },
      badgeText: 'LABS CORE',
      imageUrl: '/imgs/apex-cinematic.png',
    },
    {
      id: 'port-oracle',
      title: 'Oracle Trader',
      subtitle: 'Inteligência Preditiva Quantitativa & Radar de Valor Esperado (+EV)',
      category: 'fintech',
      categoryLabel: 'Quantitative Edge',
      status: 'BETA',
      description: 'Sistema preditivo esportivo com análise de dados profundos e cálculo automatizado de margem e edge.',
      techStack: ['Next.js 15', 'Framer Motion', 'Quantitative Edge', 'FastAPI'],
      path: '/labs/oracle-trader',
      featuredMetric: { label: 'Edge Médio', value: '+8.4%' },
      badgeText: 'LABS EXPERIMENTAL',
      imageUrl: '/imgs/altradar_product_mockup.jpg',
    },
    {
      id: 'port-pitchlib',
      title: 'Pitch Deck Library',
      subtitle: 'Curadoria de Narrativas de Alto Impacto e Captação',
      category: 'editorial',
      categoryLabel: 'Editorial & Growth',
      status: 'LIVE',
      description: 'Mural interativo de pitch decks e teses de investimento que levantaram milhões no mercado de venture capital.',
      techStack: ['Next.js 15', 'Framer Motion', 'Tailwind CSS', 'Editorial Grid'],
      path: '/labs/ag47-lib-pith-deck',
      featuredMetric: { label: 'Decks Curados', value: '47+' },
      badgeText: 'EDITORIAL HUB',
      imageUrl: '/imgs/service_social_media_pt.webp',
    },
    {
      id: 'port-restag',
      title: 'RestAg & MenuAg',
      subtitle: 'Ecossistema Digital de Hospitalidade & QR Ordering',
      category: 'hospitality',
      categoryLabel: 'Hospitality Tech',
      status: 'LIVE',
      description: 'Cardápio digital inteligente, gestão de lista de espera com sincronização em tempo real e pagamentos instantâneos.',
      techStack: ['Next.js 15', 'Supabase Realtime', 'Stripe', 'Google Cloud'],
      path: '/menuag',
      featuredMetric: { label: 'Conversão em Mesas', value: '+42%' },
      badgeText: 'HOSPITALITY',
      imageUrl: '/restag/carbon_core_gallery_0.png',
    },
    {
      id: 'port-nexus',
      title: 'Nexus Core',
      subtitle: 'Orquestrador de Agentes de IA Autônomos em Equipe',
      category: 'core',
      categoryLabel: 'Multi-Agent Core',
      status: 'LIVE',
      description: 'Runtime distribuído de agentes de IA especializados que colaboram para executar tarefas técnicas complexas.',
      techStack: ['LangGraph', 'Gemini ADK', 'TypeScript', 'Google Cloud Run'],
      path: '/nexus',
      featuredMetric: { label: 'Agentes Ativos', value: '12' },
      badgeText: 'AGENTIC CORE',
      imageUrl: '/imgs/service_ai_agent.jpg',
    },
  ] as PortfolioProject[],

  pricingTiers: [
    {
      id: 'tier-starter',
      name: 'Landing Page Elite',
      badge: 'VALIDAÇÃO RÁPIDA',
      tagline: 'Ideal para negócios que precisam de uma máquina de conversão no ar em tempo recorde.',
      priceProject: '990€',
      priceMonthly: '99€/mês',
      periodLabel: 'pagamento único no projeto',
      targetAudience: 'Startups, Profissionais Liberais e Negócios Locais',
      features: [
        'Landing Page de Alta Conversão em Next.js 15',
        'Design 100% Exclusivo (Zero templates)',
        'Copywriting persuasivo e estruturado',
        'SEO Técnico com Schema Markup & OpenGraph',
        'Setup de Google Analytics 4 e Meta Pixel / CAPI',
        'Hospedagem de ultra-alta velocidade no Edge',
        'Entrega garantida em 7 dias úteis',
        '30 dias de suporte e ajustes pós-lançamento',
      ],
      deliverables: ['Código-fonte completo', 'Deploy em produção', 'Domínio conectado', 'Documentação básica'],
      ctaText: 'Quero Minha Landing Page',
      ctaUrl: 'https://wa.me/351912345678?text=Olá!%20Gostaria%20de%20iniciar%20o%20plano%20Landing%20Page%20Elite.',
      isPopular: false,
      accent: '#10b981',
    },
    {
      id: 'tier-growth',
      name: 'Plataforma & SaaS WebApp',
      badge: 'MAIS PROCURADO',
      tagline: 'Para empresas em crescimento que precisam de um sistema completo, rápido e escalável.',
      priceProject: '2.490€',
      priceMonthly: '190€/mês',
      periodLabel: 'pagamento único no projeto',
      targetAudience: 'PMEs, Empresas de Serviços e Produtos Digitais',
      features: [
        'Website Multi-página ou Web Application completa',
        'Painel Administrativo de Alta Densidade (Bento Grid)',
        'Sistema de Autenticação de Usuários Seguro',
        'Banco de dados em tempo real (Firebase / Supabase)',
        'Integração de Pagamentos com Stripe / Multibanco / MB Way',
        'Painel de Gestão de Conteúdo e Leads',
        'Testes automatizados e CI/CD configurado',
        'Entrega em 15 a 21 dias úteis',
        '60 dias de suporte técnico dedicado',
      ],
      deliverables: ['Repositório Git privado', 'Infraestrutura em nuvem configurada', 'Painel de métricas', 'Treinamento de equipe'],
      ctaText: 'Construir Minha Plataforma',
      ctaUrl: 'https://wa.me/351912345678?text=Olá!%20Gostaria%20de%20iniciar%20o%20plano%20Plataforma%20e%20SaaS%20WebApp.',
      isPopular: true,
      accent: '#06b6d4',
    },
    {
      id: 'tier-scale',
      name: 'Ecosystem & AI Agent Suite',
      badge: 'ALTA PERFORMANCE',
      tagline: 'Automação extrema com inteligência artificial proprietária e ecossistema digital integrado.',
      priceProject: '4.900€',
      priceMonthly: '390€/mês',
      periodLabel: 'pagamento único no projeto',
      targetAudience: 'Empresas consolidadas buscando liderança de mercado',
      features: [
        'Todo o pacote da Plataforma & SaaS WebApp',
        'Desenvolvimento e integração de Agente de IA customizado',
        'Pipeline de extração de conhecimento (RAG proprietário)',
        'Automações de atendimento inteligente e triagem 24/7',
        'Design System completo documentado e escalável',
        'Otimização de conversão contínua com testes A/B',
        'SLA prioritário de resposta em menos de 2 horas',
        'Consultoria estratégica semanal de growth',
      ],
      deliverables: ['Modelo de IA treinado/afinado', 'Pipelines de automação', 'Infraestrutura Enterprise', 'SLA Garantido'],
      ctaText: 'Acelerar com IA & Ecossistema',
      ctaUrl: 'https://wa.me/351912345678?text=Olá!%20Gostaria%20de%20iniciar%20o%20plano%20Ecosystem%20e%20AI%20Suite.',
      isPopular: false,
      accent: '#8b5cf6',
    },
    {
      id: 'tier-enterprise',
      name: 'Engenharia Dedicada',
      badge: 'CUSTOM ENTERPRISE',
      tagline: 'Esquadrão de engenharia e inteligência sob medida para desafios corporativos complexos.',
      priceProject: 'Sob Consulta',
      priceMonthly: 'Sob Consulta',
      periodLabel: 'escopo personalizado',
      targetAudience: 'Grandes corporações e instituições',
      features: [
        'Alocação de time dedicado (Engenheiros, Designers, Growth)',
        'Arquitetura distribuída de microsserviços em Google Cloud',
        'Modelagem quantitativa e preditiva de dados proprietários',
        'Auditoria de segurança, conformidade RGPD e pen-testing',
        'Acordo de Nível de Serviço (SLA) 24/7 de alta criticidade',
        'Desenvolvimento contínuo sob demanda com sprints ágeis',
      ],
      deliverables: ['Contrato Enterprise', 'NDA total', 'Infraestrutura dedicada', 'Suporte 24/7'],
      ctaText: 'Falar com Diretor Técnico',
      ctaUrl: 'https://wa.me/351912345678?text=Olá!%20Gostaria%20de%20solicitar%20uma%20reunião%20Enterprise.',
      isPopular: false,
      accent: '#f59e0b',
    },
  ] as PricingTier[],

  terminalCommands: [
    {
      command: 'ag47 info',
      shortcut: '1',
      description: 'Exibe o manifesto, DNA e infraestrutura do ecossistema AG47',
      outputLines: [
        '⚡ [AG47 CORE RUNTIME v2026.4.7] — Initializing Core Systems...',
        '----------------------------------------------------------------',
        '📍 Organização: Agência 47 (ag47.pt) — Elite Software & AI Studio',
        '🚀 Missão: Construir tecnologia sem fricção que multiplica receita.',
        '🌐 Infra: Cloudflare Edge (310+ nós) + Google Cloud Engine',
        '🛡️ Segurança: TypeScript Estrito + Regras de Proteção Ativas',
        '✨ Status: 100% OPERATIONAL | Latência Média Global: 22ms',
      ],
    },
    {
      command: 'ag47 services',
      shortcut: '2',
      description: 'Lista a suite completa de serviços e prazos de entrega',
      outputLines: [
        '📦 [CATÁLOGO DE SERVIÇOS AG47]',
        '  1. Websites & Landing Pages   -> Next.js 15 | LCP < 0.7s | 7 dias',
        '  2. SaaS & Web Applications    -> Fullstack + Auth + Stripe | 15-30 dias',
        '  3. Social Media & Branding    -> Editorial Dark Mode + Retenção | Recorrência',
        '  4. Tráfego Pago (+EV)         -> CAPI + GTM Server-side + ROAS 4.8x',
        '  5. Agentes de IA Autônomos    -> LLMs + RAG + YouLearn + Apex | 10-20 dias',
        '💡 Digite "ag47 quote" para simular o investimento ideal.',
      ],
    },
    {
      command: 'ag47 portfolio',
      shortcut: '3',
      description: 'Mapeia os produtos e sistemas ao vivo no ecossistema',
      outputLines: [
        '🪐 [ECOSSISTEMA VIVO AG47 — NODES ATIVOS]',
        '  • /eco/evopro       -> Evolution Protocol (AST Engine & Gauntlet) [LIVE]',
        '  • /eco/alt-radar    -> Realtime Token Sentiment & Security [LIVE]',
        '  • /eco/youlearn     -> Video Knowledge Extraction & Active Study [NEW]',
        '  • /labs/apex        -> Quantitative BTC Cycle Predictor [BETA]',
        '  • /labs/oracle      -> Sports Expected Value (+EV) Intelligence [BETA]',
        '  • /menuag           -> Hospitality QR Ordering & Smart Waitlist [LIVE]',
        '  • /nexus            -> Distributed Multi-Agent Runtime [LIVE]',
      ],
    },
    {
      command: 'ag47 pricing',
      shortcut: '4',
      description: 'Consulta os pacotes de investimento e planos transparentes',
      outputLines: [
        '💎 [INVESTIMENTO & PLANOS TRANSPARENTES]',
        '  • STARTER    : 990€   (Landing Page Elite — Entrega em 7 dias)',
        '  • GROWTH     : 2.490€ (Plataforma Web / SaaS / Autenticação)',
        '  • SCALE      : 4.900€ (Ecossistema Integrado + Agente de IA)',
        '  • ENTERPRISE : Custom (Engenharia dedicada + SLA 2h)',
        '✅ Zero taxas ocultas. 100% de propriedade do código-fonte.',
      ],
    },
    {
      command: 'ag47 audit',
      shortcut: '5',
      description: 'Executa diagnóstico rápido de performance e baselines',
      outputLines: [
        '🔍 [DIAGNÓSTICO TÉCNICO AG47 SPEED & COMPLIANCE]',
        '  [+] Core Web Vitals LCP     : 0.62s (PASSED - Ultra Fast)',
        '  [+] Cumulative Layout Shift : 0.000 (PASSED - Zero Shift)',
        '  [+] First Input Delay       : 8ms   (PASSED - Instant)',
        '  [+] Security Headers        : HSTS, CSP, XSS-Protect (PASSED)',
        '  [+] Single Scrollbar Engine : Engaged (0 Nested Conflicts)',
        '🏆 Resultado Geral: 100/100 EXCELLENCE SCORE',
      ],
    },
  ] as TerminalCommandItem[],

  faqs: [
    {
      q: 'Quanto tempo demora para a minha landing page ou website ficar pronto?',
      a: 'Para Landing Pages e Websites institucionais, o nosso prazo padrão é de 7 a 10 dias úteis desde a aprovação do briefing até ao deploy final. Para plataformas SaaS e aplicativos web complexos, o prazo varia entre 15 a 30 dias úteis.',
    },
    {
      q: 'O código-fonte e o projeto pertencem à minha empresa?',
      a: 'Sim, 100%. Diferente de agências que trancam o cliente em plataformas proprietárias, nós entregamos o repositório Git completo com o código limpo, moderno e documentado em seu nome.',
    },
    {
      q: 'Por que a Agência 47 não usa WordPress ou Elementor?',
      a: 'O WordPress tradicional com plugins lentos gera páginas pesadas com mais de 3 segundos de carregamento, alto risco de segurança e pontuações baixas no Google. Nós construímos tudo em Next.js 15 e TypeScript, garantindo velocidade instantânea (<800ms) e conversão máxima.',
    },
    {
      q: 'Como funciona o suporte após o lançamento do projeto?',
      a: 'Todos os nossos planos incluem de 30 a 60 dias de garantia e suporte técnico completo pós-lançamento, cobrindo ajustes finos, monitoramento de performance e suporte a dúvidas sem qualquer custo adicional.',
    },
    {
      q: 'Como posso agendar uma reunião ou solicitar um orçamento?',
      a: 'Basta clicar no botão de WhatsApp ou "Solicitar Briefing" em qualquer parte da página. Você será atendido diretamente por um engenheiro/estrategista em menos de 1 hora.',
    },
  ],
};
