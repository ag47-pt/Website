import {
  Archetype,
  DemoContentSpec,
  MetaSpec,
  PresentationSpec,
} from './types';

/**
 * Default presentation profiles tailored for each archetype.
 */
export const ARCHETYPE_PRESENTATION_DEFAULTS: Record<Archetype, PresentationSpec> = {
  editorial: {
    archetype: 'editorial',
    density: 'spacious',
    alignment: 'asymmetric',
    hero_style: 'editorial',
    card_style: 'flat',
    section_flow: 'editorial',
    navigation_style: 'minimal',
    imagery_weight: 'medium',
    decorative_style: 'restrained',
    is_fallback: false,
  },
  saas: {
    archetype: 'saas',
    density: 'balanced',
    alignment: 'symmetric',
    hero_style: 'split',
    card_style: 'bordered',
    section_flow: 'alternating',
    navigation_style: 'standard',
    imagery_weight: 'high',
    decorative_style: 'restrained',
    is_fallback: false,
  },
  commerce: {
    archetype: 'commerce',
    density: 'balanced',
    alignment: 'symmetric',
    hero_style: 'visual',
    card_style: 'image_led',
    section_flow: 'modular',
    navigation_style: 'prominent',
    imagery_weight: 'high',
    decorative_style: 'expressive',
    is_fallback: false,
  },
  fintech: {
    archetype: 'fintech',
    density: 'compact',
    alignment: 'symmetric',
    hero_style: 'split',
    card_style: 'bordered',
    section_flow: 'linear',
    navigation_style: 'standard',
    imagery_weight: 'low',
    decorative_style: 'none',
    is_fallback: false,
  },
  restaurant: {
    archetype: 'restaurant',
    density: 'spacious',
    alignment: 'asymmetric',
    hero_style: 'visual',
    card_style: 'flat',
    section_flow: 'alternating',
    navigation_style: 'prominent',
    imagery_weight: 'high',
    decorative_style: 'expressive',
    is_fallback: false,
  },
  service: {
    archetype: 'service',
    density: 'balanced',
    alignment: 'symmetric',
    hero_style: 'split',
    card_style: 'bordered',
    section_flow: 'alternating',
    navigation_style: 'standard',
    imagery_weight: 'medium',
    decorative_style: 'restrained',
    is_fallback: false,
  },
  minimal: {
    archetype: 'minimal',
    density: 'spacious',
    alignment: 'asymmetric',
    hero_style: 'centered',
    card_style: 'flat',
    section_flow: 'linear',
    navigation_style: 'minimal',
    imagery_weight: 'none',
    decorative_style: 'none',
    is_fallback: false,
  },
  generic: {
    archetype: 'generic',
    density: 'balanced',
    alignment: 'symmetric',
    hero_style: 'centered',
    card_style: 'bordered',
    section_flow: 'linear',
    navigation_style: 'standard',
    imagery_weight: 'medium',
    decorative_style: 'restrained',
    is_fallback: false,
  },
};

/**
 * Authentic, domain-specific demo content presets for each archetype.
 * Free of generic placeholder text or meta-commentary about design systems.
 */
export const ARCHETYPE_DEMO_CONTENT: Record<Archetype, DemoContentSpec> = {
  editorial: {
    profile: 'editorial',
    brand_name: 'The Monocle Review',
    tagline: 'Jornalismo de profundidade sobre tecnologia, arquitetura e cultura contemporânea.',
    eyebrow: 'EDIÇÃO Nº 47 · ENSAIO PRINCIPAL',
    headline: 'A Nova Fronteira do Design de Sistemas e Engenharia Visual',
    description:
      'Uma investigação profunda sobre como a tipografia, a contenção espacial e o rigor determinístico moldam as interfaces mais sofisticadas da era digital.',
    cta_primary: 'Ler Artigo Completo',
    cta_secondary: 'Assinar a Revista',
    features_highlight: [
      {
        title: 'Estruturas Não-Lineares',
        desc: 'A superação dos layouts simétricos em favor de ritmos visuais fluidos e autênticos.',
        tag: 'Ensaio',
      },
      {
        title: 'A Física dos Espaços em Branco',
        desc: 'Como a contenção e o respiro definem a hierarquia antes mesmo do primeiro caractere ser lido.',
        tag: 'Crítica',
      },
      {
        title: 'Tipografia com Propósito',
        desc: 'Equilíbrio entre Space Grotesk e Hanken Grotesk na composição de narrativas digitais.',
        tag: 'Tipografia',
      },
    ],
    is_fallback: false,
  },
  saas: {
    profile: 'saas',
    brand_name: 'Nexus Cloud OS',
    tagline: 'Infraestrutura distribuída de alta performance para equipes modernas.',
    eyebrow: 'INFRAESTRUTURA DISTRIBUÍDA V3.4',
    headline: 'Deploy Global com Latência Sub-Milissegundo e Observabilidade Real',
    description:
      'Orquestre microserviços, execute contêineres e sincronize bancos de dados de borda com telemetria determinística e zero overhead.',
    cta_primary: 'Iniciar Cluster Grátis',
    cta_secondary: 'Explorar Documentação',
    features_highlight: [
      {
        title: 'Edge Compute Engine',
        desc: 'Funções sem servidor executadas em mais de 300 pontos de presença em todo o mundo.',
        tag: 'Sub-5ms',
      },
      {
        title: 'Telemetria em Tempo Real',
        desc: 'Métricas de consumo de CPU, memória e throughput atualizadas a 60 FPS.',
        tag: 'Live Stream',
      },
      {
        title: 'Segurança Zero-Trust',
        desc: 'Isolamento de nós com criptografia mTLS ponta a ponta e auditoria contínua.',
        tag: 'SOC2 Compliant',
      },
    ],
    is_fallback: false,
  },
  commerce: {
    profile: 'commerce',
    brand_name: 'Atelier Aureum',
    tagline: 'Coleções exclusivas de peças de design e acessórios de edição limitada.',
    eyebrow: 'COLEÇÃO OUTONO / INVERNO 2026',
    headline: 'Design Escandinavo & Matéria-Prima Sustentável em Sua Casa',
    description:
      'Peças esculpidas à mão por artesãos renomados com acabamentos naturais, linhas minimalistas e durabilidade para gerações.',
    cta_primary: 'Ver Coleção Exclusiva',
    cta_secondary: 'Catálogo Digital',
    features_highlight: [
      {
        title: 'Luminária Arc Minimal',
        desc: 'Alumínio anodizado fosco com temperatura de cor regulável via dimmer tátil.',
        tag: 'Mais Vendido',
      },
      {
        title: 'Poltrona Nordic Raw',
        desc: 'Madeira maciça de reflorestamento com estofamento em linho cru sustentável.',
        tag: 'Edição Limitada',
      },
      {
        title: 'Vaso Cerâmica Vulcânica',
        desc: 'Acabamento texturizado moldado manualmente em forno a lenha tradicional.',
        tag: 'Novo',
      },
    ],
    is_fallback: false,
  },
  fintech: {
    profile: 'fintech',
    brand_name: 'Aethelgard Treasury',
    tagline: 'Gestão institucional de liquidez, custódia e pagamentos transfronteiriços.',
    eyebrow: 'PROTOCOLO INSTITUCIONAL DE LIQUIDEZ',
    headline: 'Custódia Inteligente e Liquidação Instantânea para Tesourarias',
    description:
      'Gerencie reservas corporativas, execute transferências transfronteiriças com câmbio direto e automatize rendimentos com proteção de grau bancário.',
    cta_primary: 'Abrir Conta Corporativa',
    cta_secondary: 'Falar com Especialista',
    features_highlight: [
      {
        title: 'Custódia Segregada MPC',
        desc: 'Assinaturas multipartidárias com proteção contra ponto único de falha.',
        tag: '100% Assegurado',
      },
      {
        title: 'Câmbio FX em Tempo Real',
        desc: 'Spread institucional direto com liquidação bruta em tempo real (RTGS).',
        tag: 'Zero Markup',
      },
      {
        title: 'Relatórios Fiscais Automatizados',
        desc: 'Exportação em padrão Swift MT940 e conciliação instantânea em ERPs.',
        tag: 'Automático',
      },
    ],
    is_fallback: false,
  },
  restaurant: {
    profile: 'restaurant',
    brand_name: 'Bistrô Lima & Sal',
    tagline: 'Gastronomia autoral, ingredientes sazonais e coquetelaria de autor.',
    eyebrow: 'MENU DEGUSTAÇÃO DE PRIMAVERA',
    headline: 'Uma Experiência Culinária Vibrante da Horta à Sua Mesa',
    description:
      'Pratos concebidos com técnica contemporânea e os melhores produtores locais de Portugal. Sabores frescos, apresentações surpreendentes e uma carta de vinhos curada.',
    cta_primary: 'Reservar uma Mesa',
    cta_secondary: 'Ver Menu Completo',
    features_highlight: [
      {
        title: 'Polvo Grelhado ao Molho de Lima',
        desc: 'Tentáculos tenros com purê de batata-doce roxa, azeite de coentros e emulsão cítrica.',
        tag: 'Assinatura',
      },
      {
        title: 'Risoto de Cogumelos Selvagens',
        desc: 'Arroz carnaroli com cogumelos da serra, queijo da Ilha curado e azeite trufado.',
        tag: 'Vegetariano',
      },
      {
        title: 'Tarte de Lima Desconstruída',
        desc: 'Creme aveludado de lima kaffir com crumble de amêndoa e merengue tostado.',
        tag: 'Sobremesa',
      },
    ],
    is_fallback: false,
  },
  service: {
    profile: 'service',
    brand_name: 'Kroma Studio',
    tagline: 'Consultoria estratégica de produto, design systems e engenharia de software.',
    eyebrow: 'ESTÚDIO DE DESIGN & ENGENHARIA',
    headline: 'Construímos Produtos Digitais de Alto Impacto e Marca Inesquecível',
    description:
      'Ajudamos empresas líderes a projetar experiências extraordinárias com Design Systems robustos, interfaces de alta densidade e código performático.',
    cta_primary: 'Iniciar Projeto',
    cta_secondary: 'Ver Casos de Sucesso',
    features_highlight: [
      {
        title: 'Arquitetura de Design Systems',
        desc: 'Criação de tokens, contratos rígidos e componentes interoperáveis para equipes globais.',
        tag: 'Estratégia',
      },
      {
        title: 'Prototipagem de Alta Densidade',
        desc: 'Da ideia ao runtime funcional em dias com as tecnologias mais modernas da web.',
        tag: 'Engenharia',
      },
      {
        title: 'Auditoria de Acessibilidade',
        desc: 'Conformidade total com diretrizes WCAG 2.1 AA e otimização de performance Core Web Vitals.',
        tag: 'Qualidade',
      },
    ],
    is_fallback: false,
  },
  minimal: {
    profile: 'minimal',
    brand_name: 'Aura',
    tagline: 'Menos ruído, mais foco. Espaços e ferramentas para clareza mental.',
    eyebrow: 'CLAREZA ESSENCIAL',
    headline: 'O Essencial com Rigor e Sem Distrações',
    description:
      'Uma abordagem sóbria e focada em conteúdo, eliminando elementos supérfluos para entregar a máxima legibilidade e clareza de pensamento.',
    cta_primary: 'Começar Agora',
    cta_secondary: 'Saber Mais',
    features_highlight: [
      {
        title: 'Foco Puro',
        desc: 'Layouts silenciosos com contraste impecável e tipografia equilibrada.',
        tag: 'Essência',
      },
      {
        title: 'Zero Latência',
        desc: 'Páginas ultra-leves desenhadas para carregamento instantâneo.',
        tag: 'Velocidade',
      },
      {
        title: 'Privacidade Total',
        desc: 'Nenhum rastreamento ou dados desnecessários coletados.',
        tag: 'Segurança',
      },
    ],
    is_fallback: false,
  },
  generic: {
    profile: 'generic',
    brand_name: 'Nova Product Suite',
    tagline: 'Soluções modernas para pessoas e empresas que buscam excelência.',
    eyebrow: 'INOVAÇÃO EM EXPERIÊNCIA',
    headline: 'Transformando Decisões Estruturais em Resultados Reais',
    description:
      'Plataforma completa para desenhar, construir e escalar iniciativas digitais com controle total sobre cada detalhe da experiência.',
    cta_primary: 'Descobrir Mais',
    cta_secondary: 'Fale Conosco',
    features_highlight: [
      {
        title: 'Flexibilidade Modular',
        desc: 'Construa fluxos personalizados combinando blocos independentes e escaláveis.',
        tag: 'Modular',
      },
      {
        title: 'Interoperabilidade Total',
        desc: 'Conecte-se a qualquer API ou serviço através de integrações determinísticas.',
        tag: 'Conectado',
      },
      {
        title: 'Confiabilidade Comprovada',
        desc: 'Disponibilidade de 99.99% e suporte dedicado 24 horas por dia.',
        tag: 'Garantia',
      },
    ],
    is_fallback: false,
  },
};

/**
 * Deterministically resolves the PresentationSpec from the meta spec and heuristics.
 */
export function resolvePresentationProfile(meta: MetaSpec): PresentationSpec {
  // If explicitly declared in frontmatter/meta:
  if (meta.presentation && meta.presentation.archetype) {
    const defaultForArchetype =
      ARCHETYPE_PRESENTATION_DEFAULTS[meta.presentation.archetype] ||
      ARCHETYPE_PRESENTATION_DEFAULTS.saas;
    return {
      ...defaultForArchetype,
      ...meta.presentation,
      is_fallback: false,
    };
  }

  // Otherwise, deterministically infer archetype from theme, name and description (for v1.0 specs)
  const corpus = `${meta.theme} ${meta.name} ${meta.description}`.toLowerCase();

  let inferredArchetype: Archetype = 'saas';

  if (corpus.includes('agmenu') || corpus.includes('restaurant') || corpus.includes('food') || corpus.includes('menu') || corpus.includes('cardapio')) {
    inferredArchetype = 'restaurant';
  } else if (corpus.includes('fintech') || corpus.includes('bank') || corpus.includes('treasury') || corpus.includes('invest') || corpus.includes('finance')) {
    inferredArchetype = 'fintech';
  } else if (corpus.includes('e-commerce') || corpus.includes('ecommerce') || corpus.includes('shop') || corpus.includes('store') || corpus.includes('vibrant')) {
    inferredArchetype = 'commerce';
  } else if (corpus.includes('editorial') || corpus.includes('magazine') || corpus.includes('journal') || corpus.includes('blog')) {
    inferredArchetype = 'editorial';
  } else if (corpus.includes('minimal') || corpus.includes('monochrome') || corpus.includes('zen')) {
    inferredArchetype = 'minimal';
  } else if (corpus.includes('lima') || corpus.includes('lime') || corpus.includes('saas') || corpus.includes('dark')) {
    inferredArchetype = 'saas';
  }

  const base = ARCHETYPE_PRESENTATION_DEFAULTS[inferredArchetype];
  return {
    ...base,
    is_fallback: true,
  };
}

/**
 * Deterministically resolves the DemoContentSpec from the meta spec and presentation profile.
 */
export function resolveDemoContent(
  meta: MetaSpec,
  presentation: PresentationSpec
): DemoContentSpec {
  const defaultContent =
    ARCHETYPE_DEMO_CONTENT[presentation.archetype] || ARCHETYPE_DEMO_CONTENT.saas;

  if (meta.demo_content && (meta.demo_content.headline || meta.demo_content.brand_name)) {
    return {
      ...defaultContent,
      ...meta.demo_content,
      brand_name: meta.demo_content.brand_name || meta.name || defaultContent.brand_name,
      is_fallback: false,
    };
  }

  // Fallback enriched with the actual Design System name
  return {
    ...defaultContent,
    brand_name: meta.name !== 'Design System Template' ? meta.name : defaultContent.brand_name,
    is_fallback: true,
  };
}
