import { z } from 'zod';

export const SourceTypeSchema = z.enum([
  'youtube',
  'podcast',
  'pdf',
  'article',
  'lecture',
  'course',
  'webpage',
  'audio',
  'document',
]);

export const DifficultyLevelSchema = z.enum(['beginner', 'intermediate', 'advanced']);

export const ContentStatusSchema = z.enum(['published', 'draft', 'archived']);

export const SourceAuthorSchema = z.object({
  name: z.string().min(1),
  channelOrOrg: z.string().optional(),
  avatarUrl: z.string().optional(),
  profileUrl: z.string().optional(),
  roleOrBio: z.string().optional(),
});

export const SourceSchema = z.object({
  type: SourceTypeSchema,
  title: z.string().min(1),
  url: z.string().url(),
  author: SourceAuthorSchema,
  publishedAt: z.string().optional(),
  platformIdentifier: z.string().optional(),
  license: z.string().optional(),
  thumbnail: z.string().optional(),
});

export const ProvenanceSchema = z.object({
  sourceUrl: z.string().optional(),
  timestampSeconds: z.number().nonnegative().optional(),
  timestampDisplay: z.string().optional(),
  excerpt: z.string().optional(),
  authorNote: z.string().optional(),
});

export const LearningMetadataSchema = z.object({
  originalDurationMinutes: z.number().positive(),
  estimatedLearningMinutes: z.number().positive(),
  compressionRatioPercent: z.number().min(0).max(100).optional(),
  difficulty: DifficultyLevelSchema,
  keyTakeawaysSummary: z.string().optional(),
  targetAudience: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
});

export const SectionTypeSchema = z.enum([
  'hero',
  'overview',
  'timeline',
  'concept',
  'process',
  'comparison',
  'visual',
  'insight',
  'quiz',
  'takeaways',
  'provenance',
]);

export const BaseSectionSchema = z.object({
  id: z.string().min(1),
  type: SectionTypeSchema,
  title: z.string().min(1),
  subtitle: z.string().optional(),
  provenance: ProvenanceSchema.optional(),
  content: z.any(),
});

export const KnowledgeObjectSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  version: z.string().default('1.0.0'),
  title: z.string().min(1),
  subtitle: z.string(),
  description: z.string(),
  category: z.string().min(1),
  topics: z.array(z.string()),
  tags: z.array(z.string()),
  featured: z.boolean().default(false),
  thumbnail: z.string(),
  source: SourceSchema,
  learning: LearningMetadataSchema,
  sections: z.array(BaseSectionSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: ContentStatusSchema.default('published'),
});

export const LibraryEntrySchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string(),
  thumbnail: z.string(),
  category: z.string(),
  topics: z.array(z.string()),
  tags: z.array(z.string()),
  featured: z.boolean(),
  sourceType: SourceTypeSchema,
  sourceTitle: z.string(),
  sourceUrl: z.string().url(),
  authorName: z.string(),
  channelOrOrg: z.string().optional(),
  authorAvatar: z.string().optional(),
  originalDurationMinutes: z.number(),
  estimatedLearningMinutes: z.number(),
  compressionRatioPercent: z.number(),
  difficulty: DifficultyLevelSchema,
  shortTakeaway: z.string(),
  publishedAt: z.string().optional(),
  updatedAt: z.string(),
  status: ContentStatusSchema,
  sectionCount: z.number().int().nonnegative(),
});
