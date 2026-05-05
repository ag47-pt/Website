// Fonte única de verdade para todos os serviços.
// Usado pela landing 3D (cards) E pelas páginas /servicos/[slug].

export type ServiceKey = 'websites-landing-pages' | 'saas-webapps' | 'social-media-conteudo' | 'trafego-pago-conversao'

export interface ServiceLP {
  slug: ServiceKey
  // Card 3D
  tag: string
  cardTitle: string
  cardSubtitle: string
  img: string
  badge?: string
  // SEO / página individual
  metaTitle: string
  metaDescription: string
  // Hero LP
  heroLabel: string
  heroTitle: string
  heroSubtitle: string
  heroCta: string
  // Proposta de valor
  valueProps: { icon: string; title: string; body: string }[]
  // Como funciona
  process: { step: string; title: string; desc: string }[]
  // Social proof / resultados
  results: { value: string; label: string }[]
  // FAQ
  faqs: { q: string; a: string }[]
  // CTA final
  ctaTitle: string
  ctaBody: string
}

export const services: ServiceLP[] = [
  {
    slug: 'websites-landing-pages',
    tag: 'Desenvolvimento Elite',
    cardTitle: 'Websites & Landing Pages',
    cardSubtitle: 'Websites &\nLanding Pages',
    img: '/imgs/service_web_design_pt.webp',
    badge: 'Popular',
    metaTitle: 'Websites & Landing Pages de Alta Conversão | Agência 47',
    metaDescription:
      'Criamos websites e landing pages com o DNA da tua marca, focados em conversão e desempenho. Setup rápido, sem contratos longos.',
    heroLabel: 'Desenvolvimento Elite',
    heroTitle: 'O teu site que\n*vende* por ti',
    heroSubtitle:
      'Não construímos páginas bonitas. Construímos máquinas de conversão com o DNA da tua empresa — cada pixel com um propósito.',
    heroCta: 'Quero o meu site',
    valueProps: [
      {
        icon: '⚡',
        title: 'Velocidade de Lançamento',
        body: 'Do briefing ao ar em 7 dias. Zero burocracia, foco total na entrega.',
      },
      {
        icon: '🎯',
        title: 'Focado em Conversão',
        body: 'Cada secção tem um objetivo: transformar visitantes em clientes. Copy, UX e CTA pensados para converter.',
      },
      {
        icon: '🧬',
        title: 'DNA da Tua Marca',
        body: 'Sem templates genéricos. Cada projeto é construído à medida do teu negócio, público e tom de voz.',
      },
      {
        icon: '📱',
        title: '100% Responsivo',
        body: 'Perfeito em qualquer ecrã. Mobile-first por definição, testado em múltiplos dispositivos.',
      },
      {
        icon: '🔍',
        title: 'SEO Técnico Incluído',
        body: 'Metadata, performance, schema markup e Core Web Vitals otimizados desde o primeiro dia.',
      },
      {
        icon: '📊',
        title: 'Analytics & Tracking',
        body: 'GTM, GA4 e pixel de conversão configurados. Sabes exatamente o que acontece no teu site.',
      },
    ],
    process: [
      { step: '01', title: 'Briefing & Estratégia', desc: 'Chamada de 30 min para entender o teu negócio, público e objetivo.' },
      { step: '02', title: 'Design & Wireframe', desc: 'Protótipo interativo para aprovares antes de escrever uma linha de código.' },
      { step: '03', title: 'Desenvolvimento', desc: 'Código limpo, Next.js, performance máxima. Sem WordPress lento.' },
      { step: '04', title: 'Lançamento & Suporte', desc: 'Deploy, domínio, analytics e 30 dias de suporte incluídos.' },
    ],
    results: [
      { value: '7 dias', label: 'Tempo médio de entrega' },
      { value: '+180%', label: 'Aumento médio em leads' },
      { value: '98+', label: 'Score PageSpeed' },
      { value: '0', label: 'Templates genéricos' },
    ],
    faqs: [
      { q: 'Quanto tempo demora a construir o meu website?', a: 'Em média 7 dias úteis para uma landing page. Sites mais complexos podem levar 2-3 semanas.' },
      { q: 'Usam WordPress?', a: 'Não. Usamos Next.js — mais rápido, mais seguro e com melhor SEO do que qualquer solução WordPress.' },
      { q: 'O site fica meu?', a: 'Sim, 100%. Código, domínio e hosting são teus. Sem dependências da agência.' },
      { q: 'Posso atualizar o conteúdo depois?', a: 'Sim. Entregamos com CMS simples ou guia de edição para seres autónomo.' },
    ],
    ctaTitle: 'Pronto para um site que trabalha por ti?',
    ctaBody: 'Diagnóstico gratuito de 15 minutos. Saímos com um plano claro para o teu projeto.',
  },

  {
    slug: 'saas-webapps',
    tag: 'Desenvolvimento As a Service',
    cardTitle: 'SaaS, Micro-SaaS & WebApps',
    cardSubtitle: 'Saas, Micro-saas,\nWebApps',
    img: '/imgs/service_saas_pt.webp',
    badge: 'Inovação',
    metaTitle: 'Desenvolvimento de SaaS e WebApps | Agência 47',
    metaDescription:
      'Transformamos a tua ideia em produto digital escalável. Do MVP à plataforma final — arquitetura sólida, código limpo e foco em ROI.',
    heroLabel: 'Desenvolvimento As a Service',
    heroTitle: 'Da ideia ao produto\nem *escala global*',
    heroSubtitle:
      'Construímos SaaS, micro-SaaS e WebApps que funcionam. Arquitetura sólida, UX pensada para retenção e código que não te prende.',
    heroCta: 'Lançar o meu produto',
    valueProps: [
      {
        icon: '🏗️',
        title: 'Arquitetura Escalável',
        body: 'Projetada para crescer. Do primeiro utilizador a 100 mil — sem reescrever tudo.',
      },
      {
        icon: '🚀',
        title: 'MVP em 4 Semanas',
        body: 'Validamos a tua ideia no mercado antes de investir meses em funcionalidades.',
      },
      {
        icon: '💻',
        title: 'Código Limpo & Documentado',
        body: 'Podes integrar a tua equipa ou trocar de parceiro a qualquer momento. Sem lock-in.',
      },
      {
        icon: '🔄',
        title: 'Modelo Recorrente',
        body: 'Iteramos contigo mês a mês. Novas features, bugs resolvidos, produto sempre a evoluir.',
      },
      {
        icon: '🎯',
        title: 'Foco em ROI',
        body: 'Cada decisão técnica é tomada com a rentabilidade do produto em mente.',
      },
      {
        icon: '🔐',
        title: 'Auth, Billing & Analytics',
        body: 'Autenticação, pagamentos e métricas de produto integrados desde o início.',
      },
    ],
    process: [
      { step: '01', title: 'Discovery & Mapeamento', desc: 'Entendemos o problema, o utilizador e o mercado antes de tocar no código.' },
      { step: '02', title: 'Arquitetura & Stack', desc: 'Escolhemos a stack certa para o teu caso. Sem over-engineering.' },
      { step: '03', title: 'MVP → Produto', desc: 'Lançamos rápido, medimos, iteramos. Metodologia ágil real.' },
      { step: '04', title: 'Crescimento Contínuo', desc: 'Contrato mensal com roadmap definido. O produto nunca para.' },
    ],
    results: [
      { value: '4 sem.', label: 'Tempo médio para MVP' },
      { value: '+240%', label: 'ROI médio no 1º ano' },
      { value: '99.9%', label: 'Uptime garantido' },
      { value: '0', label: 'Lock-in com a agência' },
    ],
    faqs: [
      { q: 'Que tipo de SaaS desenvolvem?', a: 'B2B, B2C, marketplaces, ferramentas internas, plataformas de gestão — se resolve um problema real, construímos.' },
      { q: 'Qual é a stack tecnológica?', a: 'Next.js, TypeScript, Prisma, PostgreSQL/Supabase, Stripe e Vercel. Moderna, testada e com grande ecossistema.' },
      { q: 'E se precisar de mudar algo após o lançamento?', a: 'Para isso serve o modelo recorrente. Iteramos mensalmente com base em dados reais.' },
      { q: 'Integram com ferramentas externas?', a: 'Sim. Zapier, webhooks, APIs REST/GraphQL — integramos com qualquer ferramenta que o teu negócio usa.' },
    ],
    ctaTitle: 'A tua ideia merece sair do papel.',
    ctaBody: 'Conta-nos o que queres construir. Sessão de discovery gratuita de 30 min.',
  },

  {
    slug: 'social-media-conteudo',
    tag: 'Presença Digital',
    cardTitle: 'Social Media & Conteúdo',
    cardSubtitle: 'Social Media &\nConteúdo',
    img: '/imgs/service_social_media_pt.webp',
    metaTitle: 'Gestão de Social Media & Conteúdo | Agência 47',
    metaDescription:
      'Estratégia de conteúdo e gestão de redes sociais que constrói audiência real e gera negócio. Sem métricas de vaidade.',
    heroLabel: 'Presença Digital',
    heroTitle: 'Conteúdo que\nconstrói *negócio*',
    heroSubtitle:
      'Paramos de perseguir likes. Criamos conteúdo estratégico que atrai o teu cliente ideal, constrói autoridade e gera receita previsível.',
    heroCta: 'Crescer nas redes',
    valueProps: [
      {
        icon: '🎯',
        title: 'Estratégia Antes de Tudo',
        body: 'Definimos nicho, tom de voz, pilares de conteúdo e KPIs antes de publicar o primeiro post.',
      },
      {
        icon: '✍️',
        title: 'Copy que Converte',
        body: 'Cada caption tem um objetivo. Educar, entreter ou vender — sempre com propósito.',
      },
      {
        icon: '📸',
        title: 'Produção Visual Premium',
        body: 'Design alinhado à tua marca. Feeds coerentes que transmitem profissionalismo.',
      },
      {
        icon: '📈',
        title: 'Crescimento Orgânico Real',
        body: 'Técnicas de alcance que funcionam em 2025. Sem comprar seguidores, sem atalhos.',
      },
      {
        icon: '📊',
        title: 'Relatórios Mensais',
        body: 'Dados que importam: alcance, engajamento qualitativo, leads gerados e vendas atribuídas.',
      },
      {
        icon: '🤝',
        title: 'Gestão de Comunidade',
        body: 'Respondemos, engajamos e construímos relação com a tua audiência como se fôssemos o teu team.',
      },
    ],
    process: [
      { step: '01', title: 'Diagnóstico de Marca', desc: 'Auditamos o que existe, definimos posicionamento e identificamos oportunidades.' },
      { step: '02', title: 'Estratégia & Calendário', desc: 'Plano de conteúdo para 30 dias com temas, formatos e datas.' },
      { step: '03', title: 'Produção & Publicação', desc: 'Criamos, aprovamos contigo e publicamos nos horários de maior impacto.' },
      { step: '04', title: 'Análise & Otimização', desc: 'O que funciona, escalamos. O que não funciona, ajustamos. Ciclo mensal.' },
    ],
    results: [
      { value: '3×', label: 'Crescimento médio em 90 dias' },
      { value: '+65%', label: 'Aumento em alcance orgânico' },
      { value: '30 dias', label: 'Para ver resultados' },
      { value: '100%', label: 'Conteúdo original' },
    ],
    faqs: [
      { q: 'Em que redes sociais trabalham?', a: 'Instagram, LinkedIn, TikTok e Facebook. A escolha depende do teu negócio e onde está o teu cliente.' },
      { q: 'Quantos posts por semana?', a: 'Depende do plano escolhido. Trabalhamos com cadências de 3 a 7 publicações semanais.' },
      { q: 'Preciso de aprovar o conteúdo?', a: 'Sim. Tens sempre a última palavra. Enviamos para aprovação com antecedência mínima de 3 dias.' },
      { q: 'Fazem conteúdo em vídeo?', a: 'Sim, incluindo Reels e TikToks com guião, edição e legendas.' },
    ],
    ctaTitle: 'Pronto para construir uma presença que gera negócio?',
    ctaBody: 'Mostramos o potencial das tuas redes numa análise gratuita de 20 minutos.',
  },

  {
    slug: 'trafego-pago-conversao',
    tag: 'Performance Total',
    cardTitle: 'Tráfego Pago & Conversão',
    cardSubtitle: 'Tráfego Pago &\nConversão',
    img: '/imgs/service_ads_pt.webp',
    metaTitle: 'Tráfego Pago & Gestão de Anúncios | Agência 47',
    metaDescription:
      'Gerimos campanhas Meta Ads e Google Ads focadas em conversão e ROI. Paramos de queimar dinheiro e começamos a escalar o que funciona.',
    heroLabel: 'Performance Total',
    heroTitle: 'Cada euro investido\ncom *propósito*',
    heroSubtitle:
      'Não gerimos orçamentos, gerimos resultados. Campanhas Meta Ads e Google Ads otimizadas para conversão — não para cliques.',
    heroCta: 'Escalar as minhas vendas',
    valueProps: [
      {
        icon: '📊',
        title: 'Auditoria de Conta Gratuita',
        body: 'Antes de gastar um euro, auditamos o que existe e identificamos onde está o desperdício.',
      },
      {
        icon: '🎯',
        title: 'Targeting Cirúrgico',
        body: 'Chegamos ao teu cliente ideal — não a toda a gente. Menos alcance, mais conversão.',
      },
      {
        icon: '🧪',
        title: 'Cultura de Teste A/B',
        body: 'Testamos criativos, copies e audiências constantemente. Escalamos os vencedores.',
      },
      {
        icon: '📈',
        title: 'Otimização Semanal',
        body: 'Campanhas revistas e ajustadas toda a semana. Não mensalmente como a maioria.',
      },
      {
        icon: '💰',
        title: 'ROAS Transparente',
        body: 'Sabes exatamente quanto gastas e quanto retorna. Dashboard em tempo real.',
      },
      {
        icon: '🔗',
        title: 'Ecossistema Completo',
        body: 'Ads + landing page + automação de follow-up. O funil completo para não perder leads.',
      },
    ],
    process: [
      { step: '01', title: 'Auditoria & Estratégia', desc: 'Analisamos conta, concorrência e oportunidades. Definimos orçamento e objetivos.' },
      { step: '02', title: 'Setup & Criativos', desc: 'Pixel, eventos de conversão, criativos e copies otimizados para cada plataforma.' },
      { step: '03', title: 'Lançamento & Testes', desc: 'Campanha ao vivo com múltiplas variantes. Recolhemos dados para otimizar.' },
      { step: '04', title: 'Escala & Reporting', desc: 'O que converte, escalamos. Relatório semanal com CPL, ROAS e próximos passos.' },
    ],
    results: [
      { value: '-42%', label: 'Redução média no CPL' },
      { value: '3.8×', label: 'ROAS médio após 60 dias' },
      { value: '7 dias', label: 'Para campanha ao vivo' },
      { value: '100%', label: 'Transparência de dados' },
    ],
    faqs: [
      { q: 'Qual o investimento mínimo em anúncios?', a: 'Recomendamos mínimo €500/mês em budget de anúncios. Abaixo disso, os dados são insuficientes para otimizar.' },
      { q: 'Trabalham com Meta Ads e Google Ads?', a: 'Sim, ambas as plataformas. A escolha depende do teu negócio — explicamos qual faz mais sentido no diagnóstico.' },
      { q: 'Em quanto tempo vejo resultados?', a: 'Primeiras leads em 48-72h após lançamento. Otimização real acontece ao longo das primeiras 4 semanas.' },
      { q: 'O que acontece se as campanhas não performarem?', a: 'Revisamos a estratégia sem custo adicional. O sucesso do teu negócio é o nosso KPI.' },
    ],
    ctaTitle: 'Chega de queimar budget sem retorno.',
    ctaBody: 'Auditoria gratuita da tua conta de anúncios. Sem compromisso.',
  },
]

// Lookup por slug — O(1)
export const servicesBySlug = Object.fromEntries(
  services.map((s) => [s.slug, s])
) as Record<ServiceKey, ServiceLP>

// Mapeamento de chave interna → slug (para os cards 3D)
export const serviceKeyToSlug: Record<string, ServiceKey> = {
  websites: 'websites-landing-pages',
  saas: 'saas-webapps',
  socialMedia: 'social-media-conteudo',
  trafegoPago: 'trafego-pago-conversao',
}
