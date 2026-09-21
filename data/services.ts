// Fonte única de verdade para todos os serviços.
// Usado pela landing 3D (cards) E pelas páginas /servicos/[slug].

export type ServiceKey = 'websites-landing-pages' | 'saas-webapps' | 'social-media-conteudo' | 'trafego-pago-conversao' | 'ia-automacao' | 'solucoes-restaurantes' | 'digitalizacao-negocios'

export type SalesChannel = 'direct' | 'fixando' | 'zaask' | 'olx' | 'upwork' | 'fiverr'

export interface ServiceOffer {
  id: string
  title: string
  shortDescription: string
  outcome: string
  audience: string[]
  priceLabel: string
  deliveryLabel: string
  recurring?: boolean
  channels: SalesChannel[]
  included: string[]
  upsells?: string[]
  active: boolean
}

export interface ServiceLP {
  featured?: boolean
  catalogOrder: number
  offers: ServiceOffer[]
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
  valueProps: { icon: string; title: string; body: string; detail?: string }[]
  // Como funciona
  process: { step: string; title: string; desc: string; detail?: string }[]
  // Social proof / resultados
  results: { value: string; label: string; desc?: string }[]
  // FAQ
  faqs: { q: string; a: string }[]
  // CTA final
  ctaTitle: string
  ctaBody: string
}

export const services: ServiceLP[] = [
  {
    slug: 'websites-landing-pages',
    featured: true,
    catalogOrder: 1,
    offers: [
      {
            "id": "landing-page",
            "title": "Landing Page Profissional",
            "priceLabel": "desde €97",
            "deliveryLabel": "1–3 dias",
            "shortDescription": "Uma página dedicada à tua oferta e ao contacto.",
            "outcome": "Apresentar uma oferta com um caminho claro para o contacto.",
            "audience": [
                  "Profissionais independentes",
                  "Pequenos negócios"
            ],
            "included": [
                  "Página responsiva",
                  "Formulário ou contacto",
                  "SEO essencial"
            ],
            "channels": [
                  "olx",
                  "fixando",
                  "zaask"
            ],
            "active": true
      },
      {
            "id": "site-profissional",
            "title": "Site Profissional para Empresas",
            "priceLabel": "desde €197",
            "deliveryLabel": "3–7 dias",
            "shortDescription": "Presença institucional adaptada ao teu negócio.",
            "outcome": "Reunir serviços, apresentação e contactos num site.",
            "audience": [
                  "Empresas",
                  "Prestadores de serviços"
            ],
            "included": [
                  "Estrutura de páginas acordada",
                  "Layout responsivo",
                  "Contactos e SEO essencial"
            ],
            "channels": [
                  "olx",
                  "fixando",
                  "zaask"
            ],
            "active": true
      },
      {
            "id": "catalogo-whatsapp",
            "title": "Catálogo Digital + WhatsApp",
            "priceLabel": "desde €147",
            "deliveryLabel": "2–4 dias",
            "shortDescription": "Produtos organizados com ligação para contacto.",
            "outcome": "Facilitar consultas sobre produtos pelo WhatsApp.",
            "audience": [
                  "Comércio local"
            ],
            "included": [
                  "Catálogo com conteúdos fornecidos",
                  "Categorias acordadas",
                  "Ligações para WhatsApp"
            ],
            "channels": [
                  "olx",
                  "fixando",
                  "zaask"
            ],
            "active": true
      }
],
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
        body: 'Prazo acordado após validação do âmbito, conteúdos e acessos.',
        detail: 'Processo otimizado com ferramentas de ponta. Conseguimos esta rapidez porque eliminamos burocracia e focamos no que move o ponteiro do teu negócio.',
      },
      {
        icon: '🎯',
        title: 'Focado em Conversão',
        body: 'Cada secção tem um objetivo: transformar visitantes em clientes. Copy, UX e CTA pensados para converter.',
        detail: 'Não é apenas design. É psicologia aplicada ao layout. Criamos caminhos visuais que guiam o utilizador até à ação desejada.',
      },
      {
        icon: '🧬',
        title: 'DNA da Tua Marca',
        body: 'Sem templates genéricos. Cada projeto é construído à medida do teu negócio, público e tom de voz.',
        detail: 'O teu site não pode parecer o do vizinho. Desenvolvemos uma linguagem visual que transmite a autoridade e os valores da tua empresa.',
      },
      {
        icon: '📱',
        title: 'Design Responsivo',
        body: 'Perfeito em qualquer ecrã. Mobile-first por definição, testado em múltiplos dispositivos.',
        detail: 'O mundo é mobile. Garantimos que a experiência de navegação no smartphone é tão rica e rápida quanto no desktop.',
      },
      {
        icon: '🔍',
        title: 'SEO Técnico Incluído',
        body: 'Metadata, performance, schema markup e Core Web Vitals otimizados desde o primeiro dia.',
        detail: 'Páginas rápidas e bem estruturadas para que o Google te encontre. Configuramos tudo o que é necessário para indexação imediata.',
      },
      {
        icon: '📊',
        title: 'Analytics & Tracking',
        body: 'GTM, GA4 e pixel de conversão configurados. Sabes exatamente o que acontece no teu site.',
        detail: 'Instalamos os olhos no teu site. Vês o funil de vendas, onde as pessoas saem e onde convertem, tudo em tempo real.',
      },
    ],
    process: [
      { step: '01', title: 'Briefing & Estratégia', desc: 'Chamada de diagnóstico para entender o teu negócio, público e objetivo.', detail: 'Definição de objetivos de conversão, análise da concorrência e mapeamento da jornada do utilizador ideal.' },
      { step: '02', title: 'Design & Wireframe', desc: 'Protótipo interativo para aprovares antes de escrever uma linha de código.', detail: 'Criação de protótipos de alta fidelidade onde podes sentir a navegação e a hierarquia visual antes de passarmos ao código.' },
      { step: '03', title: 'Desenvolvimento', desc: 'Código limpo, Next.js, performance máxima. Sem WordPress lento.', detail: 'Escrita de código limpo em Next.js, otimização de imagens e implementação de SEO técnico para máxima velocidade.' },
      { step: '04', title: 'Lançamento & Suporte', desc: 'Deploy, domínio, analytics e suporte conforme o âmbito acordado.', detail: 'Configuração de domínio, SSL, analytics e suporte ativo para garantir que a transição para o ar é perfeita.' },
    ],
    results: [
      {
            "value": "Design",
            "label": "Alinhado à marca",
            "desc": "A proposta visual é validada contigo."
      },
      {
            "value": "SEO",
            "label": "Estrutura técnica",
            "desc": "Metadata e estrutura de páginas fazem parte do âmbito acordado."
      },
      {
            "value": "Dados",
            "label": "Tracking configurável",
            "desc": "A medição depende dos eventos, ferramentas e permissões disponíveis."
      },
      {
            "value": "Plano",
            "label": "Entrega acordada",
            "desc": "Prazo e conteúdos são confirmados antes do início."
      }
],
    faqs: [
      { q: 'Quanto tempo demora a construir o meu website?', a: 'As ofertas indicam 1–3 dias para landing pages e 3–7 dias para sites, sujeitos à confirmação do âmbito e à receção dos materiais.' },
      { q: 'Usam WordPress?', a: 'Não. Usamos Next.js — mais rápido, mais seguro e com melhor SEO do que qualquer solução WordPress.' },
      { q: 'O site fica meu?', a: 'Sim, 100%. Código, domínio e hosting são teus. Sem dependências da agência.' },
      { q: 'Posso atualizar o conteúdo depois?', a: 'Sim. Entregamos com CMS simples ou guia de edição para seres autónomo.' },
    ],
    ctaTitle: 'Pronto para um site que *vende* por ti?',
    ctaBody: 'Diagnóstico inicial. Saímos com um plano claro para o teu projeto.',
  },

  {
    slug: 'saas-webapps',
    featured: true,
    catalogOrder: 2,
    offers: [
      {
            "id": "mvp",
            "title": "MVP de produto digital",
            "priceLabel": "sob diagnóstico",
            "deliveryLabel": "a definir",
            "shortDescription": "Uma primeira versão centrada na hipótese a validar.",
            "outcome": "Testar o produto com utilizadores reais.",
            "audience": [
                  "Fundadores",
                  "Equipas de produto"
            ],
            "included": [
                  "Definição do âmbito",
                  "Fluxo principal",
                  "Plano de validação"
            ],
            "channels": [
                  "upwork",
                  "direct"
            ],
            "active": true
      },
      {
            "id": "dashboard",
            "title": "Dashboard ou sistema interno",
            "priceLabel": "sob diagnóstico",
            "deliveryLabel": "a definir",
            "shortDescription": "Uma ferramenta adaptada à operação da equipa.",
            "outcome": "Organizar dados e tarefas num fluxo partilhado.",
            "audience": [
                  "Equipas operacionais"
            ],
            "included": [
                  "Mapeamento de dados",
                  "Permissões acordadas",
                  "Interface de operação"
            ],
            "channels": [
                  "upwork",
                  "direct"
            ],
            "active": true
      }
],
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
        body: 'Projetada para crescer. Capacidade e evolução definidas conforme a utilização prevista.',
        detail: 'Utilizamos tecnologias de ponta como Next.js e bases de dados serverless que escalam automaticamente conforme a procura.',
      },
      {
        icon: '🚀',
        title: 'MVP por Fases',
        body: 'Validamos a tua ideia no mercado antes de investir meses em funcionalidades.',
        detail: 'Focamos no "Core" do produto. Lançamos a funcionalidade principal para obteres feedback real de utilizadores pagantes o mais rápido possível.',
      },
      {
        icon: '💻',
        title: 'Código Limpo & Documentado',
        body: 'Podes integrar a tua equipa ou trocar de parceiro a qualquer momento. Sem lock-in.',
        detail: 'Seguimos as melhores práticas de Clean Code e arquitetura modular. O software é um ativo da tua empresa, não um segredo da agência.',
      },
      {
        icon: '🔄',
        title: 'Modelo Recorrente',
        body: 'Iteramos contigo mês a mês. Novas features, bugs resolvidos, produto sempre a evoluir.',
        detail: 'Software nunca está "terminado". O nosso modelo permite que o produto se adapte às mudanças do mercado e às necessidades dos utilizadores.',
      },
      {
        icon: '🎯',
        title: 'Foco em ROI',
        body: 'Cada decisão técnica é tomada com a rentabilidade do produto em mente.',
        detail: 'Ajudamos-te a decidir que features construir com base no impacto financeiro e na retenção de utilizadores.',
      },
      {
        icon: '🔐',
        title: 'Auth, Billing & Analytics',
        body: 'Autenticação, pagamentos e métricas de produto integrados desde o início.',
        detail: 'Tratamos da parte chata (Stripe, Clerk/NextAuth, Mixpanel) para que te possas focar no que torna o teu SaaS único.',
      },
    ],
    process: [
      { step: '01', title: 'Discovery & Mapeamento', desc: 'Entendemos o problema, o utilizador e o mercado antes de tocar no código.', detail: 'Sessões intensivas para definir o modelo de dados, as permissões de utilizador e as integrações críticas do sistema.' },
      { step: '02', title: 'Arquitetura & Stack', desc: 'Escolhemos a stack certa para o teu caso. Sem over-engineering.', detail: 'Desenho da infraestrutura na cloud e escolha das bases de dados que garantem a escalabilidade do produto.' },
      { step: '03', title: 'MVP → Produto', desc: 'Lançamos rápido, medimos, iteramos. Metodologia ágil real.', detail: 'Ciclos de desenvolvimento semanais (Sprints) com entregas constantes para que possas testar o produto em tempo real.' },
      { step: '04', title: 'Crescimento Contínuo', desc: 'Contrato mensal com roadmap definido. O produto nunca para.', detail: 'Implementação de feedback loops e novas funcionalidades baseadas no comportamento real dos teus utilizadores.' },
    ],
    results: [
      {
            "value": "MVP",
            "label": "Validação do produto",
            "desc": "O roadmap começa pela hipótese principal."
      },
      {
            "value": "Código",
            "label": "Entrega documentada",
            "desc": "A documentação e os acessos são definidos no projeto."
      },
      {
            "value": "Infra",
            "label": "Configuração por projeto",
            "desc": "Monitorização e disponibilidade são acordadas conforme a infraestrutura."
      },
      {
            "value": "Ciclos",
            "label": "Evolução planeada",
            "desc": "Prioridades revistas a partir de feedback."
      }
],
    faqs: [
      { q: 'Que tipo de SaaS desenvolvem?', a: 'B2B, B2C, marketplaces, ferramentas internas, plataformas de gestão — se resolve um problema real, construímos.' },
      { q: 'Qual é a stack tecnológica?', a: 'Next.js, TypeScript, Prisma, PostgreSQL/Supabase, Stripe e Vercel. Moderna, testada e com grande ecossistema.' },
      { q: 'E se precisar de mudar algo após o lançamento?', a: 'Para isso serve o modelo recorrente. Iteramos mensalmente com base em dados reais.' },
      { q: 'Integram com ferramentas externas?', a: 'Sim. Zapier, webhooks, APIs REST/GraphQL — avaliamos cada integração conforme a API, as permissões e os custos disponíveis.' },
    ],
    ctaTitle: 'A tua ideia merece sair do *papel*.',
    ctaBody: 'Conta-nos o que queres construir. Sessão inicial de diagnóstico.',
  },

  {
    slug: 'social-media-conteudo',
    featured: true,
    catalogOrder: 3,
    offers: [
      {
            "id": "videos-3",
            "title": "3 vídeos curtos",
            "priceLabel": "desde €79",
            "deliveryLabel": "2–5 dias",
            "shortDescription": "Edição de três vídeos a partir de materiais acordados.",
            "outcome": "Preparar vídeos para os canais escolhidos.",
            "audience": [
                  "Marcas",
                  "Profissionais"
            ],
            "included": [
                  "3 vídeos curtos",
                  "Edição e legendas",
                  "Formatos acordados"
            ],
            "channels": [
                  "olx",
                  "fiverr",
                  "zaask"
            ],
            "active": true
      },
      {
            "id": "videos-8",
            "title": "8 vídeos curtos",
            "priceLabel": "desde €179",
            "deliveryLabel": "3–7 dias",
            "shortDescription": "Um conjunto de vídeos para organizar a publicação.",
            "outcome": "Criar uma sequência de conteúdos coerente.",
            "audience": [
                  "Marcas",
                  "Comércio local"
            ],
            "included": [
                  "8 vídeos curtos",
                  "Edição e legendas",
                  "Formatos acordados"
            ],
            "channels": [
                  "olx",
                  "fiverr",
                  "zaask"
            ],
            "active": true
      },
      {
            "id": "conteudo-mensal",
            "title": "Conteúdo mensal",
            "priceLabel": "desde €297/mês",
            "deliveryLabel": "mensal",
            "shortDescription": "Planeamento e produção com cadência acordada.",
            "outcome": "Manter um calendário de comunicação.",
            "audience": [
                  "Pequenos negócios"
            ],
            "included": [
                  "Calendário editorial",
                  "Produção acordada",
                  "Revisão de métricas"
            ],
            "channels": [
                  "zaask",
                  "direct"
            ],
            "active": true,
            "recurring": true
      }
],
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
      'Paramos de perseguir likes. Criamos conteúdo estratégico que atrai o teu cliente ideal, constrói autoridade e apoia a geração de oportunidades.',
    heroCta: 'Crescer nas redes',
    valueProps: [
      {
        icon: '🎯',
        title: 'Estratégia Antes de Tudo',
        body: 'Definimos nicho, tom de voz, pilares de conteúdo e KPIs antes de publicar o primeiro post.',
        detail: 'Analisamos o mercado, a concorrência e o comportamento do teu público para criar um roteiro que não só preenche o calendário, mas que guia o cliente na jornada de compra.',
      },
      {
        icon: '✍️',
        title: 'Copy que Converte',
        body: 'Cada caption tem um objetivo. Educar, entreter ou vender — sempre com propósito.',
        detail: 'Escrevemos com base em gatilhos mentais e técnicas de storytelling que prendem a atenção no feed e incentivam o clique, o comentário ou a mensagem direta.',
      },
      {
        icon: '📸',
        title: 'Produção Visual Premium',
        body: 'Design alinhado à tua marca. Feeds coerentes que transmitem profissionalismo.',
        detail: 'Design de alta performance adaptado aos formatos que as redes privilegiam (Reels, Carrosséis, Stories). Identidade visual forte que faz a marca ser reconhecida instantaneamente.',
      },
      {
        icon: '📈',
        title: 'Crescimento Orgânico Real',
        body: 'Estratégia de alcance ajustada aos canais escolhidos. Sem comprar seguidores, sem atalhos.',
        detail: 'Focamos em conteúdo partilhável e que gera conversas. Usamos o algoritmo a teu favor para chegar a novas pessoas sem precisar de investir em tráfego de imediato.',
      },
      {
        icon: '📊',
        title: 'Relatórios Mensais',
        body: 'Dados que importam: alcance, engajamento qualitativo, leads gerados e vendas atribuídas.',
        detail: 'Mensalmente, apresentamos o que realmente importa. Quantos leads vieram das redes? Qual o post que mais gerou interesse? Decidimos os próximos passos com base em factos.',
      },
      {
        icon: '🤝',
        title: 'Gestão de Comunidade',
        body: 'Respondemos, engajamos e construímos relação com a tua audiência como se fôssemos o teu team.',
        detail: 'Transformamos seguidores em fãs. Respondemos a comentários e DMs com agilidade e inteligência emocional, garantindo que ninguém fica sem resposta.',
      },
    ],
    process: [
      { step: '01', title: 'Diagnóstico de Marca', desc: 'Auditamos o que existe, definimos posicionamento e identificamos oportunidades.', detail: 'Análise do perfil atual, taxa de engajamento e qualidade visual. Definimos as diretrizes de branding para que as redes respirem a alma do negócio.' },
      { step: '02', title: 'Estratégia & Calendário', desc: 'Plano de conteúdo mensal com temas, formatos e datas.', detail: 'Criamos os pilares de conteúdo: educar, inspirar e vender. Planeamos o calendário editorial para que cada post tenha um objetivo de negócio claro.' },
      { step: '03', title: 'Produção & Publicação', desc: 'Criamos, aprovamos contigo e publicamos nos horários de maior impacto.', detail: 'Design premium e legendas estratégicas. Utilizamos ferramentas de agendamento para que a tua marca esteja sempre ativa, mesmo quando estás a descansar.' },
      { step: '04', title: 'Análise & Otimização', desc: 'O que funciona, escalamos. O que não funciona, ajustamos. Ciclo mensal.', detail: 'Avaliamos o que gerou mais salvamentos e partilhas. Ajustamos a rota mensalmente para que o crescimento orgânico seja sustentável e crescente.' },
    ],
    results: [
      {
            "value": "Plano",
            "label": "Calendário editorial",
            "desc": "Temas e cadência são definidos antes da produção."
      },
      {
            "value": "Marca",
            "label": "Conteúdo alinhado",
            "desc": "A direção editorial parte da identidade da marca."
      },
      {
            "value": "Revisão",
            "label": "Aprovação de conteúdos",
            "desc": "O cliente valida os materiais antes da publicação."
      },
      {
            "value": "Dados",
            "label": "Métricas disponíveis",
            "desc": "Alcance e interação são acompanhados nas plataformas."
      }
],
    faqs: [
      { q: 'Em que redes sociais trabalham?', a: 'Instagram, LinkedIn, TikTok e Facebook. A escolha depende do teu negócio e onde está o teu cliente.' },
      { q: 'Quantos posts por semana?', a: 'Depende do plano escolhido. Trabalhamos com cadências acordadas no plano editorial.' },
      { q: 'Preciso de aprovar o conteúdo?', a: 'Sim. Tens sempre a última palavra. Enviamos para aprovação com antecedência acordada no calendário.' },
      { q: 'Fazem conteúdo em vídeo?', a: 'Sim, incluindo Reels e TikToks com guião, edição e legendas.' },
    ],
    ctaTitle: 'Pronto para construir uma presença que *gera negócio*?',
    ctaBody: 'Mostramos o potencial das tuas redes numa análise inicial.',
  },

  {
    slug: 'trafego-pago-conversao',
    featured: true,
    catalogOrder: 4,
    offers: [
      {
            "id": "setup-campanha",
            "title": "Setup de campanha",
            "priceLabel": "sob diagnóstico",
            "deliveryLabel": "a definir",
            "shortDescription": "Preparação da campanha e dos eventos de medição.",
            "outcome": "Lançar uma campanha com objetivos definidos.",
            "audience": [
                  "Empresas",
                  "Comércio local"
            ],
            "included": [
                  "Diagnóstico da conta",
                  "Configuração de campanha",
                  "Validação de tracking disponível"
            ],
            "channels": [
                  "fixando",
                  "zaask"
            ],
            "active": true
      },
      {
            "id": "gestao-anuncios",
            "title": "Gestão de anúncios",
            "priceLabel": "sob diagnóstico",
            "deliveryLabel": "mensal",
            "shortDescription": "Acompanhamento das campanhas em ciclos acordados.",
            "outcome": "Decidir ajustes com base nos dados disponíveis.",
            "audience": [
                  "Anunciantes"
            ],
            "included": [
                  "Revisão de campanhas",
                  "Testes de criativos",
                  "Relatório de acompanhamento"
            ],
            "channels": [
                  "fixando",
                  "zaask"
            ],
            "active": true,
            "recurring": true
      }
],
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
        detail: 'Entramos nos teus anúncios atuais para descobrir para onde está a fugir o dinheiro. Identificamos erros técnicos de tracking e audiências mal configuradas.',
      },
      {
        icon: '🎯',
        title: 'Targeting Cirúrgico',
        body: 'Chegamos ao teu cliente ideal — não a toda a gente. Menos alcance, mais conversão.',
        detail: 'Usamos dados demográficos e de comportamento para encontrar quem já está pronto para comprar. Não desperdiçamos budget com "curiosos".',
      },
      {
        icon: '🧪',
        title: 'Cultura de Teste A/B',
        body: 'Testamos criativos, copies e audiências constantemente. Escalamos os vencedores.',
        detail: 'Lançamos várias versões do mesmo anúncio. O mercado diz-nos qual funciona melhor e nós escalamos o vencedor para maximizar o lucro.',
      },
      {
        icon: '📈',
        title: 'Otimização Semanal',
        body: 'Campanhas revistas e ajustadas toda a semana. Não mensalmente como a maioria.',
        detail: 'Campanhas de tráfego pago não são "set and forget". Ajustamos licitações, trocamos criativos e refinamos audiências todas as semanas.',
      },
      {
        icon: '💰',
        title: 'ROAS Transparente',
        body: 'Sabes exatamente quanto gastas e quanto retorna. Dashboard em tempo real.',
        detail: 'O nosso foco é o retorno real. Criamos dashboards que mostram o lucro líquido gerado pelas campanhas, para que saibas exatamente o valor de cada euro investido.',
      },
      {
        icon: '🔗',
        title: 'Ecossistema Completo',
        body: 'Ads + landing page + automação de follow-up. O funil completo para não perder leads.',
        detail: 'Integramos os anúncios com as tuas ferramentas de CRM ou e-mail marketing. Garantimos que a lead é acompanhada desde o clique até à venda final.',
      },
    ],
    process: [
      { step: '01', title: 'Auditoria & Estratégia', desc: 'Analisamos conta, concorrência e oportunidades. Definimos orçamento e objetivos.', detail: 'Verificamos o histórico da conta, os ativos de marca e a qualidade das landing pages. Saímos desta fase com um diagnóstico claro e um orçamento recomendado.' },
      { step: '02', title: 'Setup & Criativos', desc: 'Pixel, eventos de conversão, criativos e copies otimizados para cada plataforma.', detail: 'Instalação técnica de Pixel, API de Conversão e Tag Manager. Desenvolvemos as peças criativas (vídeo/imagem) com base em padrões de alta conversão.' },
      { step: '03', title: 'Lançamento & Testes', desc: 'Campanha ao vivo com múltiplas variantes. Recolhemos dados para otimizar.', detail: 'Ativamos as campanhas com segmentações sobrepostas para validar hipóteses. Monitorizamos as fase inicial de forma intensiva para garantir que tudo corre bem.' },
      { step: '04', title: 'Escala & Reporting', desc: 'O que converte, escalamos. Relatório semanal com CPL, ROAS e próximos passos.', detail: 'Com base nos dados, transferimos o budget para os anúncios vencedores. Criamos novos criativos para evitar a fadiga da audiência e aumentar o volume de vendas.' },
    ],
    results: [
      {
            "value": "CPL",
            "label": "Acompanhamento por ciclo",
            "desc": "O custo por lead é analisado quando existem eventos de conversão."
      },
      {
            "value": "ROAS",
            "label": "Receita com tracking",
            "desc": "O retorno é acompanhado quando a receita pode ser atribuída."
      },
      {
            "value": "Testes",
            "label": "Hipóteses de campanha",
            "desc": "Criativos e audiências são comparados com dados disponíveis."
      },
      {
            "value": "Plano",
            "label": "Orçamento acordado",
            "desc": "Investimento, objetivos e revisão são definidos no diagnóstico."
      }
],
    faqs: [
      { q: 'Qual o investimento mínimo em anúncios?', a: 'O investimento em publicidade é separado da gestão e definido no diagnóstico, conforme os objetivos e o mercado.' },
      { q: 'Trabalham com Meta Ads e Google Ads?', a: 'Sim, ambas as plataformas. A escolha depende do teu negócio — explicamos qual faz mais sentido no diagnóstico.' },
      { q: 'Em quanto tempo vejo resultados?', a: 'Os resultados dependem da oferta, do orçamento e do mercado. Definimos ciclos de avaliação e ajustamos as campanhas a partir dos dados recolhidos.' },
      { q: 'O que acontece se as campanhas não performarem?', a: 'Revisamos a estratégia sem custo adicional. O sucesso do teu negócio é o nosso KPI.' },
    ],
    ctaTitle: 'Chega de queimar budget sem *retorno*.',
    ctaBody: 'Auditoria gratuita da tua conta de anúncios. Sem compromisso.',
  },
{
  "slug": "ia-automacao",
  "featured": false,
  "catalogOrder": 5,
  "offers": [
    {
      "id": "automacao-ia",
      "title": "Automação empresarial com IA",
      "priceLabel": "desde €297",
      "deliveryLabel": "variável",
      "shortDescription": "Workflows para documentos, leads e relatórios.",
      "outcome": "Reduzir tarefas repetitivas com revisão humana.",
      "audience": [
        "Equipas administrativas",
        "Pequenos negócios"
      ],
      "included": [
        "Diagnóstico do fluxo",
        "Integrações tecnicamente validadas",
        "Testes e documentação"
      ],
      "channels": [
        "upwork",
        "fixando",
        "zaask"
      ],
      "active": true
    },
    {
      "id": "assistente-ia",
      "title": "Assistente ou chatbot de IA",
      "priceLabel": "desde €297",
      "deliveryLabel": "3–10 dias",
      "shortDescription": "Assistente apoiado no conhecimento autorizado da empresa.",
      "outcome": "Apoiar respostas e encaminhar pedidos para a equipa.",
      "audience": [
        "Equipas de atendimento"
      ],
      "included": [
        "Organização de conhecimento",
        "Configuração do assistente",
        "Testes e encaminhamento humano"
      ],
      "channels": [
        "upwork",
        "fiverr",
        "direct"
      ],
      "active": true
    }
  ],
  "tag": "Processos ligados",
  "cardTitle": "IA & Automação",
  "cardSubtitle": "IA & Automação",
  "img": "/imgs/service_ai_agent.webp",
  "metaTitle": "IA & Automação | Agência 47",
  "metaDescription": "Automação de documentos, leads e relatórios, com integrações avaliadas e supervisão humana.",
  "heroLabel": "Processos ligados",
  "heroTitle": "Menos tarefas manuais.\nMais negócio em *movimento*.",
  "heroSubtitle": "Automação de documentos, leads e relatórios, com integrações avaliadas e supervisão humana.",
  "heroCta": "Solicitar diagnóstico de automação",
  "valueProps": [
    {
      "icon": "🔄",
      "title": "Fluxos úteis",
      "body": "Automação focada em tarefas repetitivas identificadas com a equipa."
    },
    {
      "icon": "💬",
      "title": "Conhecimento da empresa",
      "body": "Assistentes apoiados em fontes autorizadas e regras de encaminhamento."
    },
    {
      "icon": "🔐",
      "title": "Controlo humano",
      "body": "Permissões, revisão e limites definidos antes de ativar o fluxo."
    }
  ],
  "process": [
    {
      "step": "01",
      "title": "Diagnóstico",
      "desc": "Identificamos tarefas, dados e dependências."
    },
    {
      "step": "02",
      "title": "Desenho do fluxo",
      "desc": "Definimos entradas, decisões e exceções."
    },
    {
      "step": "03",
      "title": "Implementação controlada",
      "desc": "Testamos com dados e permissões autorizados."
    },
    {
      "step": "04",
      "title": "Medição e melhoria",
      "desc": "Revemos o fluxo com a equipa e ajustamos as regras."
    }
  ],
  "results": [
    {
      "value": "Âmbito",
      "label": "Validado no diagnóstico",
      "desc": "Objetivos e entregáveis acordados antes da implementação."
    },
    {
      "value": "Dados",
      "label": "Acessos autorizados",
      "desc": "As fontes e permissões são confirmadas com o cliente."
    },
    {
      "value": "Testes",
      "label": "Antes da publicação",
      "desc": "O fluxo acordado é validado antes de entrar em operação."
    },
    {
      "value": "Equipa",
      "label": "Operação acompanhada",
      "desc": "Responsáveis e manutenção definidos na proposta."
    }
  ],
  "faqs": [
    {
      "q": "Integram com qualquer sistema?",
      "a": "A integração depende da API, das permissões e das condições de cada fornecedor. Confirmamos a viabilidade antes do orçamento."
    },
    {
      "q": "O assistente substitui a equipa?",
      "a": "O assistente apoia tarefas delimitadas. A equipa mantém a revisão, a decisão e o tratamento de exceções."
    },
    {
      "q": "Que dados podem ser usados?",
      "a": "Definimos contigo as fontes autorizadas, os acessos e as condições de tratamento antes da implementação."
    }
  ],
  "ctaTitle": "Solicitar diagnóstico de automação",
  "ctaBody": "Conta-nos o teu contexto. Confirmamos a viabilidade, o âmbito, os custos e o prazo antes de avançar."
},
{
  "slug": "solucoes-restaurantes",
  "featured": false,
  "catalogOrder": 6,
  "offers": [
    {
      "id": "menu-digital",
      "title": "Menu digital",
      "priceLabel": "desde €97",
      "deliveryLabel": "1–3 dias",
      "shortDescription": "Ementa acessível por ligação e QR Code.",
      "outcome": "Facilitar a consulta da oferta do restaurante.",
      "audience": [
        "Restaurantes",
        "Cafés"
      ],
      "included": [
        "Ementa com dados fornecidos",
        "QR Code",
        "Validação antes da publicação"
      ],
      "channels": [
        "olx",
        "fixando",
        "direct"
      ],
      "active": true
    },
    {
      "id": "site-restaurante",
      "title": "Site para restaurante",
      "priceLabel": "desde €197",
      "deliveryLabel": "2–5 dias",
      "shortDescription": "Página com identidade, ementa e contactos.",
      "outcome": "Reunir informação útil antes da visita.",
      "audience": [
        "Restaurantes"
      ],
      "included": [
        "Página responsiva",
        "Ligação à ementa",
        "Localização e contacto por WhatsApp"
      ],
      "channels": [
        "olx",
        "fixando",
        "direct"
      ],
      "active": true
    },
    {
      "id": "reservas-online",
      "title": "Reservas online",
      "priceLabel": "desde €197 + mensalidade",
      "deliveryLabel": "2–5 dias",
      "shortDescription": "Configuração de pedidos de reserva no fluxo validado.",
      "outcome": "Encaminhar pedidos para confirmação pelo restaurante.",
      "audience": [
        "Restaurantes com equipa responsável pelas reservas"
      ],
      "included": [
        "Validação do fluxo operacional",
        "Recolha de pedidos",
        "Orientação para confirmação e manutenção"
      ],
      "channels": [
        "direct"
      ],
      "active": true,
      "recurring": true
    }
  ],
  "tag": "À mesa e online",
  "cardTitle": "Soluções para Restaurantes",
  "cardSubtitle": "Soluções para Restaurantes",
  "img": "/imgs/pizza-base.png",
  "metaTitle": "Soluções para Restaurantes | Agência 47",
  "metaDescription": "Página, ementa, contactos e pedidos de reserva num fluxo adaptado à operação do restaurante.",
  "heroLabel": "À mesa e online",
  "heroTitle": "A experiência do restaurante\ncomeça *antes da mesa*.",
  "heroSubtitle": "Página, ementa, contactos e pedidos de reserva num fluxo adaptado à operação do restaurante.",
  "heroCta": "Pedir demonstração com os meus dados",
  "valueProps": [
    {
      "icon": "📋",
      "title": "Ementa acessível",
      "body": "Menu digital e QR Code com dados validados pelo restaurante."
    },
    {
      "icon": "📍",
      "title": "Contacto direto",
      "body": "Localização, horários e WhatsApp reunidos numa presença digital."
    },
    {
      "icon": "🍽️",
      "title": "Operação acompanhada",
      "body": "Reservas e atualizações configuradas conforme o fluxo efetivamente disponível."
    }
  ],
  "process": [
    {
      "step": "01",
      "title": "Recolha e importação",
      "desc": "Reunimos ementa, imagens, horários e contactos."
    },
    {
      "step": "02",
      "title": "Validação",
      "desc": "O restaurante confirma dados e funcionamento."
    },
    {
      "step": "03",
      "title": "Publicação",
      "desc": "Publicamos a solução acordada e o QR Code."
    },
    {
      "step": "04",
      "title": "Operação e atualização",
      "desc": "Definimos responsáveis e condições de manutenção."
    }
  ],
  "results": [
    {
      "value": "Âmbito",
      "label": "Validado no diagnóstico",
      "desc": "Objetivos e entregáveis acordados antes da implementação."
    },
    {
      "value": "Dados",
      "label": "Acessos autorizados",
      "desc": "As fontes e permissões são confirmadas com o cliente."
    },
    {
      "value": "Testes",
      "label": "Antes da publicação",
      "desc": "O fluxo acordado é validado antes de entrar em operação."
    },
    {
      "value": "Equipa",
      "label": "Operação acompanhada",
      "desc": "Responsáveis e manutenção definidos na proposta."
    }
  ],
  "faqs": [
    {
      "q": "A solução pode usar AG Menu?",
      "a": "Sim. O AG Menu pode ser a infraestrutura da solução, conforme as necessidades e o âmbito acordado."
    },
    {
      "q": "As reservas são confirmadas automaticamente?",
      "a": "A confirmação segue o fluxo operacional validado com o restaurante. Um pedido não equivale a uma reserva confirmada."
    },
    {
      "q": "Inclui integração com plataformas externas?",
      "a": "Não pressupomos integrações com ZenChef, Google Reservas ou outros terceiros. Qualquer integração exige validação técnica e contratual."
    },
    {
      "q": "Existe mensalidade?",
      "a": "Reservas e manutenção podem ter custos recorrentes. O valor, o IVA aplicável e as condições são confirmados na proposta."
    }
  ],
  "ctaTitle": "Pedir demonstração com os meus dados",
  "ctaBody": "Conta-nos o teu contexto. Confirmamos a viabilidade, o âmbito, os custos e o prazo antes de avançar."
},
{
  "slug": "digitalizacao-negocios",
  "featured": false,
  "catalogOrder": 7,
  "offers": [
    {
      "id": "diagnostico-integrado",
      "title": "Diagnóstico e implementação integrada",
      "priceLabel": "desde €497",
      "deliveryLabel": "5–14 dias",
      "shortDescription": "Prioridades e implementação para uma operação dispersa.",
      "outcome": "Ligar presença digital, contactos e processos essenciais.",
      "audience": [
        "Pequenos negócios"
      ],
      "included": [
        "Auditoria",
        "Plano por prioridades",
        "Implementação do âmbito acordado"
      ],
      "channels": [
        "fixando",
        "zaask",
        "direct"
      ],
      "active": true
    },
    {
      "id": "transformacao-digital",
      "title": "Transformação digital completa",
      "priceLabel": "a partir de €947 (€947–€1.497+)",
      "deliveryLabel": "sob diagnóstico",
      "shortDescription": "Um programa por fases com ferramentas e processos coordenados.",
      "outcome": "Construir uma operação digital adequada à equipa.",
      "audience": [
        "Negócios em reorganização"
      ],
      "included": [
        "Diagnóstico aprofundado",
        "Implementação faseada",
        "Formação e acompanhamento acordados"
      ],
      "channels": [
        "direct"
      ],
      "active": true
    }
  ],
  "tag": "Operação integrada",
  "cardTitle": "Digitalização de Negócios",
  "cardSubtitle": "Digitalização de Negócios",
  "img": "/imgs/universo_hero_dashboard.webp",
  "metaTitle": "Digitalização de Negócios | Agência 47",
  "metaDescription": "Diagnóstico e implementação coordenada de presença digital, contactos, medição e automação para pequenos negócios.",
  "heroLabel": "Operação integrada",
  "heroTitle": "Do processo disperso\na uma operação digital *integrada*.",
  "heroSubtitle": "Diagnóstico e implementação coordenada de presença digital, contactos, medição e automação para pequenos negócios.",
  "heroCta": "Solicitar diagnóstico do negócio",
  "valueProps": [
    {
      "icon": "🔎",
      "title": "Prioridades claras",
      "body": "Identificamos os problemas operacionais antes de escolher ferramentas."
    },
    {
      "icon": "🔗",
      "title": "Implementação coordenada",
      "body": "Articulamos website, catálogo, WhatsApp e automação conforme o diagnóstico."
    },
    {
      "icon": "🤝",
      "title": "Adoção pela equipa",
      "body": "Responsáveis, formação e acompanhamento definidos no plano."
    }
  ],
  "process": [
    {
      "step": "01",
      "title": "Auditoria",
      "desc": "Mapeamos canais, ferramentas e tarefas atuais."
    },
    {
      "step": "02",
      "title": "Priorização por impacto",
      "desc": "Escolhemos as mudanças mais úteis e viáveis."
    },
    {
      "step": "03",
      "title": "Implementação em fases",
      "desc": "Ligamos as soluções acordadas e validamos cada etapa."
    },
    {
      "step": "04",
      "title": "Acompanhamento",
      "desc": "Apoiamos a adoção e revemos as prioridades."
    }
  ],
  "results": [
    {
      "value": "Âmbito",
      "label": "Validado no diagnóstico",
      "desc": "Objetivos e entregáveis acordados antes da implementação."
    },
    {
      "value": "Dados",
      "label": "Acessos autorizados",
      "desc": "As fontes e permissões são confirmadas com o cliente."
    },
    {
      "value": "Testes",
      "label": "Antes da publicação",
      "desc": "O fluxo acordado é validado antes de entrar em operação."
    },
    {
      "value": "Equipa",
      "label": "Operação acompanhada",
      "desc": "Responsáveis e manutenção definidos na proposta."
    }
  ],
  "faqs": [
    {
      "q": "Preciso de substituir todas as ferramentas?",
      "a": "Não. Começamos pelo que já existe e avaliamos o que deve ser mantido, ligado ou substituído."
    },
    {
      "q": "Como difere de contratar um website?",
      "a": "O trabalho começa pela operação e coordena várias soluções. O website pode ser uma parte do plano, conforme a necessidade."
    },
    {
      "q": "O preço inclui todas as ferramentas?",
      "a": "Licenças, serviços externos, IVA e manutenção são discriminados na proposta. O preço inicial depende do âmbito confirmado."
    }
  ],
  "ctaTitle": "Solicitar diagnóstico do negócio",
  "ctaBody": "Conta-nos o teu contexto. Confirmamos a viabilidade, o âmbito, os custos e o prazo antes de avançar."
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

export const catalogServices = [...services].sort((a, b) => a.catalogOrder - b.catalogOrder)
export const featuredServices = catalogServices.filter((service) => service.featured)
export const activeOffers = catalogServices.flatMap((service) =>
  service.offers.filter((offer) => offer.active).map((offer) => ({ ...offer, serviceSlug: service.slug }))
)

export const servicesItemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Serviços digitais — Agência 47',
  numberOfItems: services.length,
  itemListElement: catalogServices.map((service, index) => ({
    '@type': 'ListItem', position: index + 1, name: service.cardTitle,
    url: `https://ag47.pt/servicos/${service.slug}`,
  })),
}
