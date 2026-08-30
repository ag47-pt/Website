/**
 * LiveSkills — motor de apresentação.
 * Todos os componentes abaixo são agnósticos à oportunidade: recebem
 * `LiveSkillPresentation` e renderizam. Nenhum conhece a YER.
 */

export * from './styles';
export { SectionShell, Reveal } from './SectionShell';
export { ConfidenceBadge, EvidenceContract } from './ConfidenceBadge';
export { Disclosure } from './Disclosure';
export { EvidenceCard } from './EvidenceCard';
export { PresentationHero } from './PresentationHero';
export { PresentationNav } from './PresentationNav';
export type { NavSection } from './PresentationNav';
export { CapabilityGroups } from './CapabilityGroups';
export { EngineeringWorkflow } from './EngineeringWorkflow';
export { ProjectCaseCard } from './ProjectCaseCard';
export { RequirementMatchList } from './RequirementMatchList';
export { CapabilityMapGrid } from './CapabilityMapGrid';
export { AiNativeSection } from './AiNativeSection';
export { MetaSection } from './MetaSection';
export { PresentationCta } from './PresentationCta';
export { PresentationCard } from './PresentationCard';
