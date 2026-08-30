/**
 * LiveSkills — Derived metrics & evidence graph traversal
 * =======================================================
 * Todos os números apresentados na UI são derivados dos dados reais.
 * Nada aqui inventa, arredonda para efeito ou estima.
 */

import type {
  Evidence,
  EvidenceConfidence,
  LiveSkillPresentation,
  PresentationSummary,
} from '../types';

/** Ordem de força epistémica, usada para ordenar e priorizar na UI. */
export const CONFIDENCE_RANK: Record<EvidenceConfidence, number> = {
  VERIFIED: 0,
  DOCUMENTED: 1,
  REPORTED: 2,
  UNVERIFIED: 3,
};

/** Resolve ids de evidência para os objetos, ignorando referências inválidas. */
export function resolveEvidence(
  presentation: LiveSkillPresentation,
  ids: readonly string[] | undefined,
): Evidence[] {
  if (!ids?.length) return [];
  const index = getEvidenceIndex(presentation);
  return ids
    .map((id) => index[id])
    .filter((item): item is Evidence => Boolean(item))
    .sort((a, b) => CONFIDENCE_RANK[a.confidence] - CONFIDENCE_RANK[b.confidence]);
}

const indexCache = new WeakMap<LiveSkillPresentation, Record<string, Evidence>>();

function getEvidenceIndex(presentation: LiveSkillPresentation): Record<string, Evidence> {
  const cached = indexCache.get(presentation);
  if (cached) return cached;
  const index = Object.fromEntries(presentation.evidence.map((item) => [item.id, item]));
  indexCache.set(presentation, index);
  return index;
}

/** Evidências efetivamente referenciadas por capacidades, projetos ou requisitos. */
export function getReferencedEvidence(presentation: LiveSkillPresentation): Evidence[] {
  const referenced = new Set<string>();

  for (const capability of presentation.capabilities) {
    capability.evidenceIds.forEach((id) => referenced.add(id));
  }
  for (const project of presentation.projects) {
    project.evidenceIds.forEach((id) => referenced.add(id));
  }
  for (const match of presentation.requirementMatches) {
    match.evidenceIds.forEach((id) => referenced.add(id));
  }
  for (const tool of presentation.aiNativeTools) {
    tool.evidenceIds?.forEach((id) => referenced.add(id));
  }

  return presentation.evidence.filter((item) => referenced.has(item.id));
}

export function countByConfidence(
  evidence: readonly Evidence[],
): Record<EvidenceConfidence, number> {
  const counts: Record<EvidenceConfidence, number> = {
    VERIFIED: 0,
    DOCUMENTED: 0,
    REPORTED: 0,
    UNVERIFIED: 0,
  };
  for (const item of evidence) counts[item.confidence] += 1;
  return counts;
}

/** Resumo para o índice do lab. Só números reais, derivados dos dados. */
export function summarize(presentation: LiveSkillPresentation): PresentationSummary {
  const referenced = getReferencedEvidence(presentation);
  const counts = countByConfidence(referenced);

  return {
    slug: presentation.slug,
    index: presentation.index,
    organization: presentation.target.organization,
    role: presentation.target.role,
    location: presentation.target.location,
    type: presentation.type,
    status: presentation.status,
    visibility: presentation.visibility,
    updatedAt: presentation.metadata.updatedAt,
    objective: presentation.objective,
    evidenceCount: referenced.length,
    verifiedCount: counts.VERIFIED,
    projectCount: presentation.projects.length,
    requirementCount: presentation.requirementMatches.length,
    capabilityCount: presentation.capabilities.length,
  };
}

/** Rótulos legíveis para os tipos de apresentação. */
export const PRESENTATION_TYPE_LABEL: Record<string, string> = {
  job_application: 'Job application',
  commercial_proposal: 'Commercial proposal',
  partnership: 'Partnership',
  project_pitch: 'Project pitch',
  technical_profile: 'Technical profile',
  case_study: 'Case study',
  service_offer: 'Service offer',
  custom: 'Custom',
};

/** Contagem de fontes distintas por tipo — usada na barra de proveniência. */
export function countSourceKinds(evidence: readonly Evidence[]): { kind: string; count: number }[] {
  const tally = new Map<string, number>();
  for (const item of evidence) {
    for (const source of item.sources) {
      tally.set(source.kind, (tally.get(source.kind) ?? 0) + 1);
    }
  }
  return [...tally.entries()]
    .map(([kind, count]) => ({ kind, count }))
    .sort((a, b) => b.count - a.count);
}
