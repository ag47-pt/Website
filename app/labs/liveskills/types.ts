/**
 * LiveSkills — Evidence-Driven Presentation Engine
 * =================================================
 * Modelo de dados do motor de apresentações do AG47 Labs.
 *
 * Princípio arquitetural: uma apresentação é CONFIGURAÇÃO, não código.
 * O motor (componentes) é reutilizável; cada oportunidade fornece apenas
 * contexto, evidências curadas e narrativa.
 *
 *   Evidence Catalog (partilhado)  +  Presentation Config (por oportunidade)
 *                            ↓
 *                   /labs/liveskills/[slug]
 *
 * Regra de honestidade: nenhuma capability é publicada sem pelo menos uma
 * evidência associada. O nível de confiança é sempre explícito.
 */

/* ------------------------------------------------------------------ *
 * Evidence Graph
 * ------------------------------------------------------------------ */

/**
 * Nível de confiança de uma evidência.
 *
 * VERIFIED    — observada diretamente em código, config, schema, teste,
 *               rota, componente, API ou deploy real.
 * DOCUMENTED  — existe documentação sólida; implementação não auditada
 *               diretamente nesta passagem.
 * REPORTED    — registada no histórico/dossiê do candidato.
 * UNVERIFIED  — sem evidência suficiente. Nunca deve virar claim público.
 */
export type EvidenceConfidence = 'VERIFIED' | 'DOCUMENTED' | 'REPORTED' | 'UNVERIFIED';

/** Natureza do artefacto que sustenta a evidência. */
export type EvidenceSourceKind =
  | 'code'
  | 'config'
  | 'schema'
  | 'test'
  | 'route'
  | 'component'
  | 'api'
  | 'deploy'
  | 'ci'
  | 'repository'
  | 'doc'
  | 'product'
  | 'runtime';

export interface EvidenceSource {
  /** Rótulo curto e legível: `lib/authz.ts`, `firestore.rules`, `agmenu.pt`. */
  label: string;
  kind: EvidenceSourceKind;
  /** Repositório de origem, quando aplicável. Não implica repositório público. */
  repository?: string;
  /** URL público. Só preencher quando o destino é realmente acessível. */
  url?: string;
  /** Detalhe adicional observado (contagens, versões, resultados). */
  detail?: string;
}

export interface Evidence {
  id: string;
  /** Afirmação factual, escrita de forma verificável. */
  claim: string;
  confidence: EvidenceConfidence;
  sources: EvidenceSource[];
  /** Data ISO (YYYY-MM-DD) em que a evidência foi observada. */
  observedOn?: string;
  /** Ressalva, limitação ou contexto necessário para leitura honesta. */
  caveat?: string;
}

/* ------------------------------------------------------------------ *
 * Capabilities
 * ------------------------------------------------------------------ */

export type CapabilityGroupId =
  | 'build'
  | 'engineer'
  | 'ai'
  | 'product';

export interface Capability {
  id: string;
  label: string;
  /** O que a pessoa consegue efetivamente fazer — não uma tecnologia isolada. */
  summary: string;
  group: CapabilityGroupId;
  /** Arestas do grafo: capability → evidence. */
  evidenceIds: string[];
  /** Arestas do grafo: capability → project. */
  projectIds?: string[];
}

export interface CapabilityGroup {
  id: CapabilityGroupId;
  label: string;
  caption: string;
  iconName: CapabilityIconName;
}

export type CapabilityIconName =
  | 'blocks'
  | 'workflow'
  | 'bot'
  | 'target';

/* ------------------------------------------------------------------ *
 * Projects
 * ------------------------------------------------------------------ */

export type ProjectStatus = 'live' | 'production' | 'beta' | 'experimental' | 'internal';

export interface ProjectLink {
  label: string;
  href: string;
  /** true quando o destino é externo ao ag47.pt. */
  external?: boolean;
}

export interface ProjectMetric {
  label: string;
  value: string;
  /** Como o número foi obtido. Nenhuma métrica sem proveniência. */
  source: string;
}

export interface ProjectCase {
  id: string;
  name: string;
  /** Uma linha: o que o projeto é. */
  kicker: string;
  status: ProjectStatus;
  confidence: EvidenceConfidence;
  /** Problem → What I built → Architecture → Stack → Evidence → What it demonstrates */
  problem: string;
  built: string[];
  architecture: string[];
  stack: string[];
  demonstrates: string[];
  metrics?: ProjectMetric[];
  evidenceIds: string[];
  links?: ProjectLink[];
  /** Limitação declarada. Obrigatório quando algo é conceptual ou parcial. */
  caveat?: string;
}

/* ------------------------------------------------------------------ *
 * Workflow
 * ------------------------------------------------------------------ */

export interface WorkflowStep {
  id: string;
  label: string;
  detail: string;
  /** Marca as etapas onde agentes/LLMs participam efetivamente. */
  aiAssisted: boolean;
}

/* ------------------------------------------------------------------ *
 * Technical capability map
 * ------------------------------------------------------------------ */

export interface CapabilityMapEntry {
  /** Frontend, Backend, Data, AI / LLM, Agentic Systems, Infrastructure, Testing, Product Engineering */
  category: string;
  items: string[];
  /** Onde estas tecnologias foram observadas. */
  observedIn: string;
}

/* ------------------------------------------------------------------ *
 * Requirement matching
 * ------------------------------------------------------------------ */

export interface RequirementMatch {
  id: string;
  /** Requisito da oportunidade, parafraseado — nunca copiado por inteiro. */
  requirement: string;
  /** Resposta do candidato em linguagem de capacidade. */
  capability: string;
  evidenceIds: string[];
  projectIds: string[];
  /** Ressalva honesta quando a aderência é parcial. */
  caveat?: string;
}

/* ------------------------------------------------------------------ *
 * Presentation
 * ------------------------------------------------------------------ */

export type PresentationType =
  | 'job_application'
  | 'commercial_proposal'
  | 'partnership'
  | 'project_pitch'
  | 'technical_profile'
  | 'case_study'
  | 'service_offer'
  | 'custom';

export type PresentationStatus = 'draft' | 'active' | 'archived';

/** Reservado para evolução futura. No MVP só `public` é servido. */
export type PresentationVisibility = 'public' | 'unlisted' | 'private';

export interface PresentationTarget {
  /** Organização a quem a apresentação se dirige. */
  organization: string;
  /** Papel/vaga/contexto. */
  role?: string;
  location?: string;
  /** Modelo de trabalho, quando confirmado. */
  workModel?: string;
  /** Fonte da informação sobre a oportunidade. */
  briefSource: string;
  /** true quando os requisitos ainda não foram confirmados contra o anúncio real. */
  briefNeedsConfirmation?: boolean;
}

export interface PresentationHero {
  /** Saudação dirigida — prova que a página não é um template. */
  salutation: string;
  headline: string;
  subheadline: string;
  body: string;
  primaryCta: ProjectLink;
  secondaryCta?: ProjectLink;
}

export interface PresentationSectionCopy {
  eyebrow: string;
  title: string;
  description?: string;
}

export interface PresentationCta {
  eyebrow: string;
  title: string;
  body: string;
  actions: ProjectLink[];
  /** Notas de transparência exibidas no rodapé da apresentação. */
  disclosures?: string[];
}

export interface PresentationMetadata {
  title: string;
  description: string;
  keywords: string[];
  /** Data ISO da última revisão de conteúdo. */
  updatedAt: string;
  /** Controla `robots` na rota. */
  noIndex?: boolean;
}

export interface LiveSkillPresentation {
  id: string;
  slug: string;
  /** Número sequencial da apresentação no LiveSkills (#001, #002...). */
  index: string;
  type: PresentationType;
  status: PresentationStatus;
  visibility: PresentationVisibility;

  target: PresentationTarget;
  /** Objetivo único desta apresentação. */
  objective: string;
  /** Quem vai ler. */
  audience: string;

  hero: PresentationHero;
  /** Narrativa curta em primeira pessoa. */
  narrative: string[];

  sections: {
    capabilities: PresentationSectionCopy;
    workflow: PresentationSectionCopy & { principle: string };
    projects: PresentationSectionCopy;
    requirements: PresentationSectionCopy;
    capabilityMap: PresentationSectionCopy;
    aiNative: PresentationSectionCopy & { principle: string };
    meta: PresentationSectionCopy;
  };

  capabilityGroups: CapabilityGroup[];
  capabilities: Capability[];
  workflow: WorkflowStep[];
  projects: ProjectCase[];
  requirementMatches: RequirementMatch[];
  capabilityMap: CapabilityMapEntry[];
  aiNativeTools: AiTool[];
  /** O que esta própria página demonstra enquanto artefacto de engenharia. */
  metaProof: MetaProofItem[];
  cta: PresentationCta;

  /** Catálogo de evidências referenciado por todo o grafo. */
  evidence: Evidence[];

  metadata: PresentationMetadata;
}

export interface AiTool {
  name: string;
  /** Como a ferramenta é usada em engenharia — não "sei usar X". */
  usage: string;
  evidenceIds?: string[];
}

export interface MetaProofItem {
  label: string;
  detail: string;
}

/* ------------------------------------------------------------------ *
 * Índice do Lab
 * ------------------------------------------------------------------ */

/** Resumo derivado para o índice `/labs/liveskills`. Números sempre reais. */
export interface PresentationSummary {
  slug: string;
  index: string;
  organization: string;
  role?: string;
  location?: string;
  type: PresentationType;
  status: PresentationStatus;
  visibility: PresentationVisibility;
  updatedAt: string;
  objective: string;
  evidenceCount: number;
  verifiedCount: number;
  projectCount: number;
  requirementCount: number;
  capabilityCount: number;
}
