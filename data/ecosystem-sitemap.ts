import React from 'react';
import {
  Layers,
  TrendingUp,
  Brain,
  Code2,
  Presentation,
  Cpu,
  Sparkles,
  Terminal,
  Radar,
  Dna,
  GraduationCap,
  UtensilsCrossed,
  Network,
  Globe2,
  LayoutGrid,
  BadgeCheck,
  Wand2,
  type LucideIcon,
} from 'lucide-react';

export interface SitemapItem {
  id: string;
  title: string;
  shortName?: string;
  description: string;
  path: string;
  status:
    | 'NEW_RELEASE'
    | 'BETA_LIVE'
    | 'ACTIVE_SECTOR'
    | 'STABLE_VERSION'
    | 'SYSTEM_ACTIVE'
    | 'NEW_EXPERIMENT'
    | 'DOC_DRIVEN'
    | 'ECO_LIVE'
    | 'PRODUCT_LIVE'
    | 'INTERNAL_TOOL'
    | string;
  icon: LucideIcon;
  category: 'labs_core' | 'ecosystem';
  techStack?: string[];
  releaseDate?: string;
  nodeId?: string;
  features?: string[];
}

export const LABS_CORE_ITEMS: SitemapItem[] = [
  {
    id: 'liveskills',
    title: 'LiveSkills',
    shortName: 'LIVESKILLS',
    description: 'Motor de apresentações orientado a evidência: capacidades, projetos e provas reais convertidos em páginas personalizadas por oportunidade.',
    icon: BadgeCheck,
    path: '/labs/liveskills',
    status: 'NEW_RELEASE',
    category: 'labs_core',
    nodeId: 'NODE_0x47_LIVESKILLS',
    releaseDate: 'Agosto 2026',
    techStack: ['Next.js 16', 'React 19', 'TypeScript', 'Evidence Graph'],
    features: ['Grafo de evidência com nível de confiança explícito', 'Matriz requisito → capacidade → prova', 'Rota dinâmica: uma apresentação por oportunidade'],
  },
  {
    id: 'labs-skills',
    title: 'Labs Skills — Design System Lab',
    shortName: 'SKILLS LAB',
    description: 'Validador determinístico, motor de cobertura e bancada universal multi-viewport para especificações de Design System em Markdown.',
    icon: Wand2,
    path: '/labs/skills',
    status: 'NEW_RELEASE',
    category: 'labs_core',
    nodeId: 'NODE_0x47_SKILLS',
    releaseDate: 'Setembro 2026',
    techStack: ['Next.js 16', 'React 19', 'Zod v1.0 Contract', 'AST Parser', 'Isolated Canvas'],
    features: ['Validador determinístico sem chamadas LLM', 'Bancada universal isolada via CSS Scoped', 'Cálculo de cobertura matemática e auditoria'],
  },
  {
    id: 'pitch-deck-library',
    title: 'Pitch Deck Library',
    shortName: 'PITCH DECK LIB',
    description: 'Mural editorial e curadoria de pitch decks, narrativas estratégicas e teses de investimento.',
    icon: Layers,
    path: '/labs/ag47-lib-pith-deck',
    status: 'NEW_RELEASE',
    category: 'labs_core',
    nodeId: 'NODE_0x47_PITCH',
    releaseDate: 'Agosto 2026',
    techStack: ['Next.js 15', 'Framer Motion', 'Tailwind CSS', 'Editorial Grid'],
    features: ['Curadoria de narrativas de alta conversão', 'Visualizador de slides integrado', 'Categorias por tese de investimento'],
  },
  {
    id: 'apex',
    title: 'APEX Predictor',
    shortName: 'APEX',
    description: 'Sinais e previsões semanais, mensais e anuais do mercado de BTC com IA proprietária.',
    icon: TrendingUp,
    path: '/labs/apex',
    status: 'BETA_LIVE',
    category: 'labs_core',
    nodeId: 'NODE_0x47_APEX',
    releaseDate: 'Julho 2026',
    techStack: ['Python Core', 'Next.js 15', 'Apex Engine', 'Chart.js'],
    features: ['Previsões multitemporais BTC', 'Modelagem quantitativa determinística', 'Sinais de volatilidade em tempo real'],
  },
  {
    id: 'oracle-trader',
    title: 'Oracle Trader',
    shortName: 'ORACLE',
    description: 'Análise de mercado e trader quantitativo de futebol com cognição preditiva e calibração de edge.',
    icon: Brain,
    path: '/labs/oracle-trader',
    status: 'BETA_LIVE',
    category: 'labs_core',
    nodeId: 'NODE_0x47_ORACLE',
    releaseDate: 'Junho 2026',
    techStack: ['Next.js 15', 'FastAPI', 'Framer Motion', 'Quantitative Edge'],
    features: ['Análise quantitativa de probabilidades', 'Radar de valor esperado (+EV)', 'Backtesting histórico de estratégias'],
  },
  {
    id: 'dev',
    title: 'Dev Showcase',
    shortName: 'DEV',
    description: 'Acompanhe o desenvolvimento em tempo real dos nossos projetos ativos e MVPs em fase alfa.',
    icon: Code2,
    path: '/labs/dev',
    status: 'ACTIVE_SECTOR',
    category: 'labs_core',
    nodeId: 'NODE_0x47_DEV',
    releaseDate: 'Maio 2026',
    techStack: ['React', 'Next.js', 'Tailwind CSS', 'Vite Sandbox'],
    features: ['Showcase de componentes experimentais', 'Testbed de novas bibliotecas', 'Sandbox de prototipagem rápida'],
  },
  {
    id: 'slides',
    title: 'Sales Slides',
    shortName: 'SLIDES',
    description: 'Ferramenta interativa de apresentações para pitches de vendas e demonstração de conceitos.',
    icon: Presentation,
    path: '/labs/slides',
    status: 'STABLE_VERSION',
    category: 'labs_core',
    nodeId: 'NODE_0x47_SLIDES',
    releaseDate: 'Abril 2026',
    techStack: ['React Three Fiber', 'Framer Motion', 'Reveal.js Core'],
    features: ['Transições cinematográficas 3D', 'Modo apresentador sincronizado', 'Exportação de decks responsivos'],
  },
  {
    id: 'ia',
    title: 'I.A-47',
    shortName: 'I.A-47',
    description: 'Diretório mestre do Setor de Inteligência Artificial e agentes autônomos da Agência 47.',
    icon: Cpu,
    path: '/labs/ia',
    status: 'SYSTEM_ACTIVE',
    category: 'labs_core',
    nodeId: 'NODE_0x47_IA_CORE',
    releaseDate: 'Março 2026',
    techStack: ['Gemini 2.5 Flash', 'Vertex AI', 'FastAPI', 'Agent Runtime'],
    features: ['Orquestração multi-agente', 'Pipelines de automação cognitiva', 'Protocolos MCP integrados'],
  },
  {
    id: 'gemini-glow',
    title: 'Gemini Border Glow',
    shortName: 'GEMINI GLOW',
    description: 'Experimento com bordas animadas e brilhantes inspiradas no Google Gemini usando CSS Houdini.',
    icon: Sparkles,
    path: '/labs/gemini-glow',
    status: 'NEW_EXPERIMENT',
    category: 'labs_core',
    nodeId: 'NODE_0x47_GLOW',
    releaseDate: 'Fevereiro 2026',
    techStack: ['CSS Houdini Paint API', 'WebGL Shaders', 'Vanilla CSS Tokens'],
    features: ['Shaders dinâmicos acelerados por GPU', 'Gradientes cônicos com micro-rotação', 'Zero dependências externas'],
  },
  {
    id: 'agent-doc',
    title: 'Exemple I.A-47 Agent.md',
    shortName: 'AGENT DOC',
    description: 'Documentação e protótipo de agente autônomo especializado em processos Ag47.',
    icon: Terminal,
    path: '/labs/ia/agent/skills/ex',
    status: 'DOC_DRIVEN',
    category: 'labs_core',
    nodeId: 'NODE_0x47_AGENT_DOC',
    releaseDate: 'Janeiro 2026',
    techStack: ['Markdown Protocol', 'YAML Frontmatter', 'Antigravity Skills'],
    features: ['Especificação formal de agentes de código', 'Protocolo Socrático e regras P0', 'Árvore de decisão determinística'],
  },
];

export const ECOSYSTEM_ITEMS: SitemapItem[] = [
  {
    id: 'universo-2d',
    title: 'Universo 2D Hub',
    shortName: 'UNIVERSO 2D',
    description: 'Portal mestre da Agência 47 no padrão EvoPro: Serviços, Portfólio, Quem Somos, Vantagens e Preços.',
    icon: Globe2,
    path: '/universo-2d',
    status: 'ECO_LIVE',
    category: 'ecosystem',
    nodeId: 'NODE_0x47_UNIVERSO_2D',
    releaseDate: 'Agosto 2026',
    techStack: ['Next.js 15', 'EvoPro Architecture', 'Web Audio API', 'OLED Theme', 'Bento Grid'],
    features: ['Apresentação completa de serviços e planos', 'Terminal CLI interativo com atalhos 1-5', 'Exportador instantâneo de documentação .md'],
  },
  {
    id: 'alt-radar',
    title: 'Alt-Radar',
    shortName: 'ALT-RADAR',
    description: 'Radar de altcoins com análise de momentum, volume e sinais on-chain para detecção de oportunidades em tempo real.',
    icon: Radar,
    path: '/eco/alt-radar',
    status: 'ECO_LIVE',
    category: 'ecosystem',
    nodeId: 'NODE_0x47_ALT_RADAR',
    releaseDate: 'Agosto 2026',
    techStack: ['Next.js 15', 'Coingecko API', 'Framer Motion', 'Tailwind CSS v4'],
    features: ['Detecção de anomalias de volume em tempo real', 'Filtro por momentum e capitalização', 'Alertas determinísticos de breakout'],
  },
  {
    id: 'evopro',
    title: 'EvoPro',
    shortName: 'EVOPRO',
    description: 'Evolution Protocol — governança determinística e framework de engenharia contínua de software com IA.',
    icon: Dna,
    path: '/eco/evopro',
    status: 'ECO_LIVE',
    category: 'ecosystem',
    nodeId: 'NODE_0x47_EVOPRO',
    releaseDate: 'Agosto 2026',
    techStack: ['Next.js 15', 'OLED Lime System', 'Terminal Engine', 'Audio Synth'],
    features: ['Simulador de terminal de comando interativo', 'Efeitos de áudio sintético no clique', 'Scroll progress com efeito cometa'],
  },
  {
    id: 'youlearn',
    title: 'YouLearn',
    shortName: 'YOULEARN',
    description: 'Plataforma de aprendizagem imersiva com vídeos do YouTube, transcrições sincronizadas e insights gerados por IA.',
    icon: GraduationCap,
    path: '/eco/youlearn',
    status: 'ECO_LIVE',
    category: 'ecosystem',
    nodeId: 'NODE_0x47_YOULEARN',
    releaseDate: 'Agosto 2026',
    techStack: ['Next.js 15', 'YouTube API', 'Gemini AI Ingestion', 'Knowledge Objects'],
    features: ['Ingestão automática de URLs do YouTube', 'Timeline interativa com sincronização de vídeo', 'Quiz e sumário estruturado'],
  },
  {
    id: 'menuag',
    title: 'MenuAG',
    shortName: 'MENUAG',
    description: 'Sistema de cardápio digital para restaurantes com QR code interativo, pedidos e gestão do merchant.',
    icon: UtensilsCrossed,
    path: '/menuag',
    status: 'PRODUCT_LIVE',
    category: 'ecosystem',
    nodeId: 'NODE_0x47_MENUAG',
    releaseDate: 'Julho 2026',
    techStack: ['Next.js 15', 'Google Firestore', 'QR Generator', 'Stripe Payments'],
    features: ['Cardápio digital responsivo com fotos em alta', 'Sistema de carrinho e checkout sem atrito', 'Painel de administração em tempo real'],
  },
  {
    id: 'nexus',
    title: 'Nexus',
    shortName: 'NEXUS',
    description: 'Hub central de agentes IA, conectores MCP, monitoramento e configuração da infraestrutura de inteligência.',
    icon: Network,
    path: '/nexus',
    status: 'INTERNAL_TOOL',
    category: 'ecosystem',
    nodeId: 'NODE_0x47_NEXUS',
    releaseDate: 'Junho 2026',
    techStack: ['Model Context Protocol', 'Node.js', 'Docker', 'Google Cloud Run'],
    features: ['Catálogo e orquestração de servidores MCP', 'Monitoramento de latência e consumo de tokens', 'Gerenciamento de chaves e segurança'],
  },
];

export const ALL_SITEMAP_ITEMS: SitemapItem[] = [
  ...LABS_CORE_ITEMS,
  ...ECOSYSTEM_ITEMS,
];

export interface NavLinkItem {
  name: string;
  path: string;
  icon: LucideIcon;
  isSitemap?: boolean;
  badge?: string;
}

export const LABS_NAV_CONFIG = {
  primary: [
    { name: 'LABS HUB', path: '/labs', icon: LayoutGrid, isSitemap: true, badge: 'SITEMAP' },
    { name: 'APEX', path: '/labs/apex', icon: TrendingUp },
    { name: 'ORACLE', path: '/labs/oracle-trader', icon: Brain },
    { name: 'I.A-47', path: '/labs/ia', icon: Cpu },
    { name: 'DEV', path: '/labs/dev', icon: Code2 },
    { name: 'SLIDES', path: '/labs/slides', icon: Presentation },
  ] as NavLinkItem[],
  overflow: [
    { name: 'SKILLS LAB', path: '/labs/skills', icon: Wand2 },
    { name: 'ECO HUB', path: '/eco', icon: Globe2, isSitemap: true, badge: 'SITEMAP' },
    { name: 'YOULEARN', path: '/eco/youlearn', icon: GraduationCap },
    { name: 'MENUAG', path: '/menuag', icon: UtensilsCrossed },
    { name: 'ALT-RADAR', path: '/eco/alt-radar', icon: Radar },
    { name: 'EVOPRO', path: '/eco/evopro', icon: Dna },
    { name: 'NEXUS', path: '/nexus', icon: Network },
  ] as NavLinkItem[],
};

export const ECO_NAV_CONFIG = {
  primary: [
    { name: 'ECO HUB', path: '/eco', icon: Globe2, isSitemap: true, badge: 'SITEMAP' },
    { name: 'ALT-RADAR', path: '/eco/alt-radar', icon: Radar },
    { name: 'EVOPRO', path: '/eco/evopro', icon: Dna },
    { name: 'YOULEARN', path: '/eco/youlearn', icon: GraduationCap },
    { name: 'MENUAG', path: '/menuag', icon: UtensilsCrossed },
    { name: 'NEXUS', path: '/nexus', icon: Network },
    { name: 'LABS HUB', path: '/labs', icon: LayoutGrid, isSitemap: true, badge: 'SITEMAP' },
  ] as NavLinkItem[],
  overflow: [
    { name: 'SKILLS LAB', path: '/labs/skills', icon: Wand2 },
    { name: 'PITCH DECK LIB', path: '/labs/ag47-lib-pith-deck', icon: Layers },
    { name: 'APEX PREDICTOR', path: '/labs/apex', icon: TrendingUp },
    { name: 'ORACLE TRADER', path: '/labs/oracle-trader', icon: Brain },
    { name: 'I.A-47', path: '/labs/ia', icon: Cpu },
    { name: 'DEV SHOWCASE', path: '/labs/dev', icon: Code2 },
    { name: 'SALES SLIDES', path: '/labs/slides', icon: Presentation },
    { name: 'GEMINI GLOW', path: '/labs/gemini-glow', icon: Sparkles },
  ] as NavLinkItem[],
};
