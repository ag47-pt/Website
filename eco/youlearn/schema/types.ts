/**
 * YouLearn Core Domain Types & Declarative Schema
 * Clean, decoupled domain interfaces for knowledge objects, sources, learning sections, and library entries.
 */

export type SourceType =
  | 'youtube'
  | 'podcast'
  | 'pdf'
  | 'article'
  | 'lecture'
  | 'course'
  | 'webpage'
  | 'audio'
  | 'document';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type ContentStatus = 'published' | 'draft' | 'archived';

export interface SourceAuthor {
  name: string;
  channelOrOrg?: string;
  avatarUrl?: string;
  profileUrl?: string;
  roleOrBio?: string;
}

export interface Source {
  type: SourceType;
  title: string;
  url: string;
  author: SourceAuthor;
  publishedAt?: string;
  platformIdentifier?: string; // e.g. YouTube Video ID
  license?: string;
  thumbnail?: string;
}

export interface Provenance {
  sourceUrl?: string;
  timestampSeconds?: number;
  timestampDisplay?: string; // e.g. "14:32"
  excerpt?: string;
  authorNote?: string;
}

export interface LearningMetadata {
  originalDurationMinutes: number;
  estimatedLearningMinutes: number;
  compressionRatioPercent?: number; // derived e.g. 87%
  difficulty: DifficultyLevel;
  keyTakeawaysSummary?: string;
  targetAudience?: string[];
  prerequisites?: string[];
}

export type SectionType =
  | 'hero'
  | 'overview'
  | 'timeline'
  | 'concept'
  | 'process'
  | 'comparison'
  | 'visual'
  | 'insight'
  | 'quiz'
  | 'takeaways'
  | 'provenance';

export interface BaseSection<T = any> {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  provenance?: Provenance;
  content: T;
}

// 1. Overview Section
export interface OverviewSectionContent {
  executiveSummary: string;
  coreThesis: string;
  whyItMatters: string;
  prerequisites?: string[];
  targetAudience?: string[];
}

// 2. Timeline Section
export interface TimelineChapter {
  id: string;
  title: string;
  durationMinutes?: number;
  timestampSeconds?: number;
  timestampDisplay?: string;
  summary: string;
  keyConcepts: string[];
  badge?: string;
}

export interface TimelineSectionContent {
  introText?: string;
  chapters: TimelineChapter[];
}

// 3. Concept Section
export interface ConceptDiagram {
  type: 'architecture' | 'flow' | 'matrix' | 'code' | 'infographic';
  title: string;
  description?: string;
  asciiArt?: string;
  imageUrl?: string;
  caption?: string;
}

export interface ConceptSectionContent {
  coreIdea: string;
  deepDive: string;
  keyTakeaways: string[];
  diagram?: ConceptDiagram;
  codeSnippet?: {
    language: string;
    code: string;
    explanation?: string;
  };
  callout?: {
    type: 'tip' | 'note' | 'warning' | 'quote';
    text: string;
    author?: string;
  };
}

// 4. Process Section
export interface ProcessStep {
  stepNumber: number;
  title: string;
  description: string;
  badge?: string;
  codeSnippet?: string;
  substeps?: string[];
  warning?: string;
  provenanceTimestamp?: string;
}

export interface ProcessSectionContent {
  summary: string;
  steps: ProcessStep[];
  outcomeSummary?: string;
}

// 5. Comparison Section
export interface ComparisonColumn {
  key: string;
  label: string;
  highlight?: boolean;
}

export interface ComparisonRow {
  aspect: string;
  values: Record<string, string>;
  verdictWinnerKey?: string;
  note?: string;
}

export interface ComparisonSectionContent {
  context: string;
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  verdict: string;
}

// 6. Visual Evidence Section
export interface VisualAnnotation {
  label: string;
  description: string;
  position?: string;
}

export interface VisualEvidenceItem {
  id: string;
  title: string;
  imageUrl: string;
  caption: string;
  visualType: 'frame' | 'screenshot' | 'diagram' | 'chart' | 'benchmark';
  analysis: string;
  annotations?: VisualAnnotation[];
  provenance?: Provenance;
}

export interface VisualSectionContent {
  overviewText: string;
  items: VisualEvidenceItem[];
}

// 7. Insight Section
export interface InsightItem {
  id: string;
  type: 'key_insight' | 'warning' | 'mental_model' | 'pro_tip';
  title: string;
  description: string;
  actionableAdvice?: string;
  quote?: {
    text: string;
    author: string;
  };
}

export interface InsightSectionContent {
  items: InsightItem[];
}

// 8. Quiz Section
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  hint?: string;
}

export interface QuizSectionContent {
  title?: string;
  description?: string;
  questions: QuizQuestion[];
}

// 9. Takeaways Section
export interface TakeawaysSectionContent {
  mainPoints: string[];
  actionableChecklist: { text: string; category?: string }[];
  nextSteps?: string[];
  recommendedFollowUps?: { title: string; linkOrSlug: string; type: string }[];
}

// 10. Provenance Section
export interface ProvenanceReference {
  label: string;
  url: string;
  type: 'paper' | 'github' | 'documentation' | 'video' | 'book';
  description?: string;
}

export interface ProvenanceSectionContent {
  sourceTitle: string;
  sourceUrl: string;
  author: SourceAuthor;
  license?: string;
  citationText?: string;
  keyTimestamps?: { label: string; timestampDisplay: string; timestampSeconds: number }[];
  references?: ProvenanceReference[];
}

export type Section =
  | BaseSection<OverviewSectionContent>
  | BaseSection<TimelineSectionContent>
  | BaseSection<ConceptSectionContent>
  | BaseSection<ProcessSectionContent>
  | BaseSection<ComparisonSectionContent>
  | BaseSection<VisualSectionContent>
  | BaseSection<InsightSectionContent>
  | BaseSection<QuizSectionContent>
  | BaseSection<TakeawaysSectionContent>
  | BaseSection<ProvenanceSectionContent>
  | BaseSection<any>;

export interface KnowledgeObject {
  id: string;
  slug: string;
  version: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  topics: string[];
  tags: string[];
  featured: boolean;
  thumbnail: string;
  source: Source;
  learning: LearningMetadata;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
  status: ContentStatus;
}

export interface LibraryEntry {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  thumbnail: string;
  category: string;
  topics: string[];
  tags: string[];
  featured: boolean;
  sourceType: SourceType;
  sourceTitle: string;
  sourceUrl: string;
  authorName: string;
  channelOrOrg?: string;
  authorAvatar?: string;
  originalDurationMinutes: number;
  estimatedLearningMinutes: number;
  compressionRatioPercent: number;
  difficulty: DifficultyLevel;
  shortTakeaway: string;
  publishedAt?: string;
  updatedAt: string;
  status: ContentStatus;
  sectionCount: number;
}
