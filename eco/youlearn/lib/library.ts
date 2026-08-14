import { KnowledgeObject, LibraryEntry } from '../schema/types';

export function calculateCompressionRatio(originalMinutes: number, learningMinutes: number): number {
  if (!originalMinutes || originalMinutes <= 0) return 0;
  if (!learningMinutes || learningMinutes <= 0) return 0;
  if (learningMinutes >= originalMinutes) return 0;
  const ratio = ((originalMinutes - learningMinutes) / originalMinutes) * 100;
  return Math.min(99, Math.max(0, Math.round(ratio)));
}

export function deriveLibraryEntry(ko: KnowledgeObject): LibraryEntry {
  const compressionRatio =
    ko.learning.compressionRatioPercent ??
    calculateCompressionRatio(
      ko.learning.originalDurationMinutes,
      ko.learning.estimatedLearningMinutes
    );

  // Extract a concise takeaway if not explicitly defined
  let takeaway = ko.learning.keyTakeawaysSummary || '';
  if (!takeaway) {
    const takeawaysSec = ko.sections.find((s) => s.type === 'takeaways');
    if (takeawaysSec && takeawaysSec.content?.mainPoints?.length) {
      takeaway = takeawaysSec.content.mainPoints[0];
    } else {
      takeaway = ko.description;
    }
  }

  return {
    id: ko.id,
    slug: ko.slug,
    title: ko.title,
    subtitle: ko.subtitle,
    description: ko.description,
    thumbnail: ko.thumbnail,
    category: ko.category,
    topics: ko.topics,
    tags: ko.tags,
    featured: Boolean(ko.featured),
    sourceType: ko.source.type,
    sourceTitle: ko.source.title,
    sourceUrl: ko.source.url,
    authorName: ko.source.author.name,
    channelOrOrg: ko.source.author.channelOrOrg,
    authorAvatar: ko.source.author.avatarUrl,
    originalDurationMinutes: ko.learning.originalDurationMinutes,
    estimatedLearningMinutes: ko.learning.estimatedLearningMinutes,
    compressionRatioPercent: compressionRatio,
    difficulty: ko.learning.difficulty,
    shortTakeaway: takeaway,
    publishedAt: ko.source.publishedAt,
    updatedAt: ko.updatedAt,
    status: ko.status,
    sectionCount: ko.sections.length,
  };
}

function matchesWordOrSubstring(text: string, query: string): boolean {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  // For short queries (<= 3 chars like 'RAG', 'AI', 'GPT', 'RNN'), match word boundary or whole words
  if (lowerQuery.length <= 3) {
    const words = lowerText.split(/[\s,./\-_():;[\]{}|]+/);
    return words.some((w) => w === lowerQuery || w.startsWith(lowerQuery));
  }

  return lowerText.includes(lowerQuery);
}

export function filterKnowledgeEntries(
  entries: LibraryEntry[],
  options: {
    query?: string;
    category?: string;
    topic?: string;
    difficulty?: string;
    featuredOnly?: boolean;
  }
): LibraryEntry[] {
  const { query = '', category = 'All', topic, difficulty, featuredOnly } = options;
  const normalizedQuery = query.trim().toLowerCase();

  return entries.filter((entry) => {
    // Status check
    if (entry.status === 'archived') return false;

    // Featured filter
    if (featuredOnly && !entry.featured) return false;

    // Category filter
    if (category && category !== 'All' && category !== 'all') {
      if (entry.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }
    }

    // Topic filter
    if (topic && topic !== 'All' && topic !== 'all') {
      const hasTopic = entry.topics.some((t) => t.toLowerCase() === topic.toLowerCase());
      if (!hasTopic) return false;
    }

    // Difficulty filter
    if (difficulty && difficulty !== 'All' && difficulty !== 'all') {
      if (entry.difficulty.toLowerCase() !== difficulty.toLowerCase()) {
        return false;
      }
    }

    // Search query multi-field search
    if (normalizedQuery) {
      const matchTitle = matchesWordOrSubstring(entry.title, normalizedQuery);
      const matchSubtitle = matchesWordOrSubstring(entry.subtitle || '', normalizedQuery);
      const matchDesc = matchesWordOrSubstring(entry.description, normalizedQuery);
      const matchAuthor = matchesWordOrSubstring(entry.authorName, normalizedQuery);
      const matchOrg = matchesWordOrSubstring(entry.channelOrOrg || '', normalizedQuery);
      const matchCategory = matchesWordOrSubstring(entry.category, normalizedQuery);
      const matchTopics = entry.topics.some((t) => matchesWordOrSubstring(t, normalizedQuery));
      const matchTags = entry.tags.some((tag) => matchesWordOrSubstring(tag, normalizedQuery));
      const matchTakeaway = matchesWordOrSubstring(entry.shortTakeaway, normalizedQuery);

      if (
        !matchTitle &&
        !matchSubtitle &&
        !matchDesc &&
        !matchAuthor &&
        !matchOrg &&
        !matchCategory &&
        !matchTopics &&
        !matchTags &&
        !matchTakeaway
      ) {
        return false;
      }
    }

    return true;
  });
}

export function getLibraryStats(entries: LibraryEntry[]) {
  const totalEntries = entries.length;
  const totalOriginalMinutes = entries.reduce((acc, curr) => acc + curr.originalDurationMinutes, 0);
  const totalLearningMinutes = entries.reduce((acc, curr) => acc + curr.estimatedLearningMinutes, 0);
  const totalMinutesSaved = Math.max(0, totalOriginalMinutes - totalLearningMinutes);
  const avgCompression =
    totalEntries > 0
      ? Math.round(entries.reduce((acc, curr) => acc + curr.compressionRatioPercent, 0) / totalEntries)
      : 0;

  const categories = Array.from(new Set(entries.map((e) => e.category)));
  const uniqueAuthors = Array.from(new Set(entries.map((e) => e.authorName)));

  return {
    totalEntries,
    totalOriginalHours: (totalOriginalMinutes / 60).toFixed(1),
    totalLearningHours: (totalLearningMinutes / 60).toFixed(1),
    totalHoursSaved: (totalMinutesSaved / 60).toFixed(1),
    avgCompressionPercent: avgCompression,
    categoriesCount: categories.length,
    authorsCount: uniqueAuthors.length,
  };
}
