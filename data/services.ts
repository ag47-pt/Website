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
        title: '100% Responsivo',
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
      { step: '01', title: 'Briefing & Estratégia', desc: 'Chamada de 30 min para entender o teu negócio, público e objetivo.', detail: 'Definição de objetivos de conversão, análise da concorrência e mapeamento da jornada do utilizador ideal.' },
      { step: '02', title: 'Design & Wireframe', desc: 'Protótipo interativo para aprovares antes de escrever uma linha de código.', detail: 'Criação de protótipos de alta fidelidade onde podes sentir a navegação e a hierarquia visual antes de passarmos ao código.' },
      { step: '03', title: 'Desenvolvimento', desc: 'Código limpo, Next.js, performance máxima. Sem WordPress lento.', detail: 'Escrita de código limpo em Next.js, otimização de imagens e implementação de SEO técnico para máxima velocidade.' },
      { step: '04', title: 'Lançamento & Suporte', desc: 'Deploy, domínio, analytics e 30 dias de suporte incluídos.', detail: 'Configuração de domínio, SSL, analytics e suporte ativo para garantir que a transição para o ar é perfeita.' },
    ],
    results: [
      { value: '7 dias', label: 'Tempo médio de entrega', desc: 'O tempo médio que levamos para entregar um projeto completo e funcional, do briefing ao deploy.' },
      { value: '+180%', label: 'Aumento médio em leads', desc: 'O crescimento médio de conversões que os nossos clientes experimentam após a migração para as nossas landing pages.' },
      { value: '98+', label: 'Score PageSpeed', desc: 'Pontuação média no Google PageSpeed Insights, garantindo a melhor performance e SEO técnico do mercado.' },
      { value: '0', label: 'Templates genéricos', desc: 'Zero templates genéricos. Cada design é único e construído do zero para refletir o DNA da tua marca.' },
    ],
    faqs: [
      { q: 'Quanto tempo demora a construir o meu website?', a: 'Em média 7 dias úteis para uma landing page. Sites mais complexos podem levar 2-3 semanas.' },
      { q: 'Usam WordPress?', a: 'Não. Usamos Next.js — mais rápido, mais seguro e com melhor SEO do que qualquer solução WordPress.' },
      { q: 'O site fica meu?', a: 'Sim, 100%. Código, domínio e hosting são teus. Sem dependências da agência.' },
      { q: 'Posso atualizar o conteúdo depois?', a: 'Sim. Entregamos com CMS simples ou guia de edição para seres autónomo.' },
    ],
    ctaTitle: 'Pronto para um site que *vende* por ti?',
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
        detail: 'Utilizamos tecnologias de ponta como Next.js e bases de dados serverless que escalam automaticamente conforme a procura.',
      },
      {
        icon: '🚀',
        title: 'MVP em 4 Semanas',
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
      { value: '4 sem.', label: 'Tempo médio para MVP', desc: 'Tempo recorde para transformar a tua ideia num Produto Mínimo Viável funcional e pronto para o mercado.' },
      { value: '+240%', label: 'ROI médio no 1º ano', desc: 'O Retorno Sobre Investimento médio que os nossos produtos geram para os fundadores no primeiro ano.' },
      { value: '99.9%', label: 'Uptime garantido', desc: 'Disponibilidade de infraestrutura garantida por contrato, utilizando arquiteturas modernas e resilientes.' },
      { value: '0', label: 'Lock-in com a agência', desc: 'Sem dependência técnica. O código e a infraestrutura são teus, e podes integrar a tua equipa a qualquer momento.' },
    ],
    faqs: [
      { q: 'Que tipo de SaaS desenvolvem?', a: 'B2B, B2C, marketplaces, ferramentas internas, plataformas de gestão — se resolve um problema real, construímos.' },
      { q: 'Qual é a stack tecnológica?', a: 'Next.js, TypeScript, Prisma, PostgreSQL/Supabase, Stripe e Vercel. Moderna, testada e com grande ecossistema.' },
      { q: 'E se precisar de mudar algo após o lançamento?', a: 'Para isso serve o modelo recorrente. Iteramos mensalmente com base em dados reais.' },
      { q: 'Integram com ferramentas externas?', a: 'Sim. Zapier, webhooks, APIs REST/GraphQL — integramos com qualquer ferramenta que o teu negócio usa.' },
    ],
    ctaTitle: 'A tua ideia merece sair do *papel*.',
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
        body: 'Técnicas de alcance que funcionam em 2025. Sem comprar seguidores, sem atalhos.',
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
      { step: '02', title: 'Estratégia & Calendário', desc: 'Plano de conteúdo para 30 dias com temas, formatos e datas.', detail: 'Criamos os pilares de conteúdo: educar, inspirar e vender. Planeamos o calendário editorial para que cada post tenha um objetivo de negócio claro.' },
      { step: '03', title: 'Produção & Publicação', desc: 'Criamos, aprovamos contigo e publicamos nos horários de maior impacto.', detail: 'Design premium e legendas estratégicas. Utilizamos ferramentas de agendamento para que a tua marca esteja sempre ativa, mesmo quando estás a descansar.' },
      { step: '04', title: 'Análise & Otimização', desc: 'O que funciona, escalamos. O que não funciona, ajustamos. Ciclo mensal.', detail: 'Avaliamos o que gerou mais salvamentos e partilhas. Ajustamos a rota mensalmente para que o crescimento orgânico seja sustentável e crescente.' },
    ],
    results: [
      { value: '3×', label: 'Crescimento médio em 90 dias', desc: 'Multiplicamos a visibilidade e autoridade da tua marca de forma consistente e estratégica.' },
      { value: '+65%', label: 'Aumento em alcance orgânico', desc: 'Melhoramos o alcance das tuas publicações sem depender exclusivamente de investimento em anúncios.' },
      { value: '30 dias', label: 'Para ver resultados', desc: 'O tempo médio para começares a notar uma mudança real na percepção e engajamento da tua audiência.' },
      { value: '100%', label: 'Conteúdo original', desc: 'Nada de stock images ou legendas genéricas. Tudo é criado especificamente para o teu público e tom de voz.' },
    ],
    faqs: [
      { q: 'Em que redes sociais trabalham?', a: 'Instagram, LinkedIn, TikTok e Facebook. A escolha depende do teu negócio e onde está o teu cliente.' },
      { q: 'Quantos posts por semana?', a: 'Depende do plano escolhido. Trabalhamos com cadências de 3 a 7 publicações semanais.' },
      { q: 'Preciso de aprovar o conteúdo?', a: 'Sim. Tens sempre a última palavra. Enviamos para aprovação com antecedência mínima de 3 dias.' },
      { q: 'Fazem conteúdo em vídeo?', a: 'Sim, incluindo Reels e TikToks com guião, edição e legendas.' },
    ],
    ctaTitle: 'Pronto para construir uma presença que *gera negócio*?',
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
      { step: '03', title: 'Lançamento & Testes', desc: 'Campanha ao vivo com múltiplas variantes. Recolhemos dados para otimizar.', detail: 'Ativamos as campanhas com segmentações sobrepostas para validar hipóteses. Monitorizamos as primeiras 48h de forma intensiva para garantir que tudo corre bem.' },
      { step: '04', title: 'Escala & Reporting', desc: 'O que converte, escalamos. Relatório semanal com CPL, ROAS e próximos passos.', detail: 'Com base nos dados, transferimos o budget para os anúncios vencedores. Criamos novos criativos para evitar a fadiga da audiência e aumentar o volume de vendas.' },
    ],
    results: [
      { 
        value: '-42%', 
        label: 'Redução média no CPL',
        desc: 'Custo Por Lead — O valor médio que pagas por cada potencial cliente interessado. Reduzimos este valor através de otimização contínua de criativos e audiências.'
      },
      { 
        value: '3.8×', 
        label: 'ROAS médio após 60 dias',
        desc: 'Return On Ad Spend — O retorno direto sobre o investimento em anúncios. Um ROAS de 3.8x significa que por cada 1€ investido, geramos 3.80€ em vendas.'
      },
      { 
        value: '7 dias', 
        label: 'Para campanha ao vivo',
        desc: 'O tempo recorde que levamos para colocar a tua primeira campanha no ar, desde o setup técnico até ao primeiro anúncio aprovado.'
      },
      { 
        value: '100%', 
        label: 'Transparência de dados',
        desc: 'Acesso total aos teus dashboards de performance. Sem relatórios escondidos ou métricas de vaidade. Somos donos da estratégia, tu és dono dos dados.'
      },
    ],
    faqs: [
      { q: 'Qual o investimento mínimo em anúncios?', a: 'Recomendamos mínimo €500/mês em budget de anúncios. Abaixo disso, os dados são insuficientes para otimizar.' },
      { q: 'Trabalham com Meta Ads e Google Ads?', a: 'Sim, ambas as plataformas. A escolha depende do teu negócio — explicamos qual faz mais sentido no diagnóstico.' },
      { q: 'Em quanto tempo vejo resultados?', a: 'Primeiras leads em 48-72h após lançamento. Otimização real acontece ao longo das primeiras 4 semanas.' },
      { q: 'O que acontece se as campanhas não performarem?', a: 'Revisamos a estratégia sem custo adicional. O sucesso do teu negócio é o nosso KPI.' },
    ],
    ctaTitle: 'Chega de queimar budget sem *retorno*.',
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
