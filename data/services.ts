export interface ServiceData {
  slug: string;
  title: string;
  description: string;
  fullDescription: string;
  features: string[];
  faqs: { question: string; answer: string }[];
  roiFocus: string;
}

export const services: ServiceData[] = [
  {
    slug: "criacao-de-sites",
    title: "Criação de Sites Profissionais",
    description: "Sites de alta performance com design 3D exclusivo e foco em conversão.",
    fullDescription: "Desenvolvemos sites que não são apenas bonitos, mas máquinas de vendas. Unimos a estética do design 3D com a velocidade do desenvolvimento ultra-rápido para garantir que sua marca se destaque em Portugal e no Brasil.",
    features: ["Design 3D Exclusivo", "Otimização de Velocidade (Core Web Vitals)", "SEO Avançado", "Totalmente Responsivo"],
    roiFocus: "Nossos sites são projetados para reduzir o custo de aquisição e aumentar a taxa de retenção de clientes.",
    faqs: [
      { question: "Quanto tempo leva para criar um site?", answer: "Graças ao nosso fluxo de desenvolvimento ultra-rápido, entregamos projetos complexos em tempo recorde, geralmente entre 7 a 15 dias úteis." },
      { question: "O site funciona bem no Google?", answer: "Sim, todos os nossos sites seguem as práticas mais modernas de SEO técnico para garantir o melhor ranqueamento possível." }
    ]
  },
  {
    slug: "landing-pages",
    title: "Landing Pages de Alta Conversão",
    description: "Páginas focadas em um único objetivo: transformar visitantes em clientes.",
    fullDescription: "Landing Pages estratégicas desenhadas para maximizar o seu ROI em campanhas de tráfego pago. Foco total em clareza, velocidade e conversão.",
    features: ["Copywriting focado em vendas", "A/B Testing Ready", "Integração com CRM", "Layouts de carregamento instantâneo"],
    roiFocus: "Maximizamos cada centavo investido em tráfego transformando mais cliques em leads qualificados.",
    faqs: [
      { question: "Por que não usar o meu site principal?", answer: "Landing pages removem distrações e focam em uma única oferta, o que comprovadamente aumenta a taxa de conversão em até 300%." }
    ]
  },
  {
    slug: "sistemas-e-webapps",
    title: "Desenvolvimento de Sistemas e WebApps",
    description: "Soluções robustas e escaláveis para automatizar o seu negócio.",
    fullDescription: "Criamos sistemas sob medida que resolvem problemas reais. De dashboards complexos a ferramentas internas, focamos na usabilidade e performance.",
    features: ["Arquitetura Escalável", "Segurança de Dados", "Interfaces Intuitivas", "API-First approach"],
    roiFocus: "Redução de custos operacionais através da automação e melhoria de processos internos.",
    faqs: [
      { question: "Vocês dão suporte após o lançamento?", answer: "Sim, oferecemos planos de manutenção e suporte contínuo para garantir que seu sistema esteja sempre atualizado e seguro." }
    ]
  },
  {
    slug: "micro-saas",
    title: "Criação de Micro-SaaS",
    description: "Transforme sua ideia em um produto recorrente em tempo recorde.",
    fullDescription: "Especialistas em validar e construir produtos de software as a service (SaaS) compactos e lucrativos. O caminho mais rápido da ideia ao MVP.",
    features: ["Validação de MVP", "Sistemas de Assinatura", "Multi-tenancy", "Dashboard de Usuário"],
    roiFocus: "Foco em gerar receita recorrente com o menor custo de infraestrutura possível.",
    faqs: [
      { question: "O que é um Micro-SaaS?", answer: "É um software focado em resolver um problema muito específico para um nicho, permitindo uma gestão simplificada e alta lucratividade." }
    ]
  },
  {
    slug: "trafego-pago",
    title: "Gestão de Tráfego Pago",
    description: "Campanhas otimizadas para gerar lucro real, não apenas curtidas.",
    fullDescription: "Gerenciamos seus anúncios no Google Ads, Meta Ads e LinkedIn Ads com foco total em ROI. Estratégias personalizadas para os mercados de BR e PT.",
    features: ["Análise de Público-Alvo", "Criação de Criativos", "Otimização Diária", "Relatórios de ROI Transparentes"],
    roiFocus: "Cada real ou euro investido é monitorado para garantir o máximo de retorno sobre o investimento publicitário.",
    faqs: [
      { question: "Quanto devo investir em anúncios?", answer: "O investimento depende do seu objetivo e mercado. Começamos com testes para validar o CPA e escalamos com base no lucro." }
    ]
  }
];
