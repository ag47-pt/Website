import { jacoboGrinbergTeoriaSintergica } from './jacobo-grinberg-teoria-sintergica';
import { introToLargeLanguageModels } from './intro-to-large-language-models';
import { KnowledgeObject, LibraryEntry } from '../schema/types';
import { deriveLibraryEntry } from '../lib/library';
import { transformerKarpathy } from './transformer-karpathy';
import { systemsThinking } from './systems-thinking';
import { agenticRagProd } from './agentic-rag-prod';

export { transformerKarpathy, systemsThinking, agenticRagProd, introToLargeLanguageModels };

export const DEMO_KNOWLEDGE_OBJECTS: KnowledgeObject[] = [
  transformerKarpathy,
  systemsThinking,
  agenticRagProd,
  introToLargeLanguageModels,
  jacoboGrinbergTeoriaSintergica,
];

export const DEMO_LIBRARY_ENTRIES: LibraryEntry[] = DEMO_KNOWLEDGE_OBJECTS.map(deriveLibraryEntry);

export function getKnowledgeObjectBySlug(slug: string): KnowledgeObject | undefined {
  return DEMO_KNOWLEDGE_OBJECTS.find((ko) => ko.slug === slug);
}

export function getAllKnowledgeSlugs(): string[] {
  return DEMO_KNOWLEDGE_OBJECTS.map((ko) => ko.slug);
}

export function getAllCategories(): string[] {
  const cats = DEMO_LIBRARY_ENTRIES.map((entry) => entry.category);
  return ['All', ...Array.from(new Set(cats))];
}

export function getAllTopics(): string[] {
  const topics = DEMO_LIBRARY_ENTRIES.flatMap((entry) => entry.topics);
  return Array.from(new Set(topics));
}
