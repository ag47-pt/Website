/**
 * YouLearn Verification & Test Suite
 * Tests domain models, Zod validation, LibraryEntry derivation, search/filter algorithms, and timestamp utilities.
 */

import { DEMO_KNOWLEDGE_OBJECTS, DEMO_LIBRARY_ENTRIES, getKnowledgeObjectBySlug } from '../data';
import { KnowledgeObjectSchema, LibraryEntrySchema } from '../schema/validation';
import { calculateCompressionRatio, deriveLibraryEntry, filterKnowledgeEntries, getLibraryStats } from '../lib/library';
import { parseTimestampToSeconds, formatSecondsToTimestamp, formatDurationHuman, buildTimestampedSourceUrl } from '../lib/provenance';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

console.log('\n========================================');
console.log('🧪 RUNNING YOULEARN VERIFICATION TEST SUITE');
console.log('========================================\n');

// 1. Schema Validation Tests
console.log('1. Testing Zod Validation on Demo Knowledge Objects...');
for (const ko of DEMO_KNOWLEDGE_OBJECTS) {
  const result = KnowledgeObjectSchema.safeParse(ko);
  assert(result.success, `KnowledgeObject [${ko.slug}] passes Zod schema validation`);
  if (!result.success) {
    console.error('Validation errors:', result.error.format());
  }
}

// 2. Library Entry Derivation Tests
console.log('\n2. Testing LibraryEntry Derivation...');
for (const ko of DEMO_KNOWLEDGE_OBJECTS) {
  const entry = deriveLibraryEntry(ko);
  const entryValidation = LibraryEntrySchema.safeParse(entry);
  assert(entryValidation.success, `Derived LibraryEntry [${entry.slug}] passes schema validation`);
  assert(entry.compressionRatioPercent > 0, `Compression ratio computed properly for [${entry.slug}]: ${entry.compressionRatioPercent}%`);
  assert(entry.sectionCount === ko.sections.length, `Section count matches (${entry.sectionCount}) for [${entry.slug}]`);
}

// 3. Compression Calculator Tests
console.log('\n3. Testing Compression Calculator...');
assert(calculateCompressionRatio(100, 10) === 90, '100m -> 10m is 90% compression');
assert(calculateCompressionRatio(60, 6) === 90, '60m -> 6m is 90% compression');
assert(calculateCompressionRatio(52, 7) === 87, '52m -> 7m is 87% compression');
assert(calculateCompressionRatio(116, 14) === 88, '116m -> 14m is 88% compression');
assert(calculateCompressionRatio(10, 20) === 0, 'Invalid / negative compression yields 0%');

// 4. Timestamp & Provenance Utilities
console.log('\n4. Testing Timestamp & Provenance Utilities...');
assert(parseTimestampToSeconds('14:32') === 872, '14:32 parses to 872s');
assert(parseTimestampToSeconds('1:02:15') === 3735, '1:02:15 parses to 3735s');
assert(formatSecondsToTimestamp(872) === '14:32', '872s formats back to 14:32');
assert(formatSecondsToTimestamp(3735) === '1:02:15', '3735s formats back to 1:02:15');
assert(formatDurationHuman(116) === '1h 56min', '116m formats to 1h 56min');
assert(formatDurationHuman(14) === '14 min', '14m formats to 14 min');

const youtubeUrl = 'https://www.youtube.com/watch?v=kCc8FmEb1nY';
const timestampedUrl = buildTimestampedSourceUrl(youtubeUrl, '35:10');
assert(
  timestampedUrl === 'https://www.youtube.com/watch?v=kCc8FmEb1nY&t=2110s' ||
    timestampedUrl === 'https://www.youtube.com/watch?t=2110s&v=kCc8FmEb1nY',
  `YouTube URL with timestamp properly formatted: ${timestampedUrl}`
);

// 5. Search & Filter Algorithm Tests
console.log('\n5. Testing Search & Filtering...');
const searchByAuthor = filterKnowledgeEntries(DEMO_LIBRARY_ENTRIES, { query: 'Karpathy' });
assert(searchByAuthor.length >= 1 && searchByAuthor.some(e => e.slug === 'how-transformers-work'), 'Search by author finds Karpathy');

const searchByTopic = filterKnowledgeEntries(DEMO_LIBRARY_ENTRIES, { query: 'RAG' });
assert(searchByTopic.length >= 1 && searchByTopic.some(e => e.slug === 'production-agentic-rag'), 'Search by topic finds Agentic RAG');

const filterByCategory = filterKnowledgeEntries(DEMO_LIBRARY_ENTRIES, { category: 'Business' });
assert(filterByCategory.length >= 1 && filterByCategory.some(e => e.slug === 'systems-thinking'), 'Filter by Business category works');

const filterAll = filterKnowledgeEntries(DEMO_LIBRARY_ENTRIES, { category: 'All', query: '' });
assert(filterAll.length === DEMO_LIBRARY_ENTRIES.length, 'Filter All returns all items');

// 6. Library Stats
console.log('\n6. Testing Library Stats...');
const stats = getLibraryStats(DEMO_LIBRARY_ENTRIES);
assert(stats.totalEntries === DEMO_LIBRARY_ENTRIES.length, 'Stats count matches entries');
assert(Number(stats.totalOriginalHours) > 0, 'Original hours aggregated');
assert(Number(stats.totalHoursSaved) > 0, 'Hours saved aggregated');

// 7. Slug Lookup
console.log('\n7. Testing Slug Lookup...');
const ko = getKnowledgeObjectBySlug('how-transformers-work');
assert(ko !== undefined && ko.title.includes('Transformers'), 'Lookup by slug retrieves correct KnowledgeObject');

// 8. Markdown / Obsidian Exporter
console.log('\n8. Testing Markdown & Obsidian Exporter...');
if (ko) {
  const { exportKnowledgeObjectToMarkdown } = require('../lib/exportMarkdown');
  const md = exportKnowledgeObjectToMarkdown(ko);
  assert(typeof md === 'string' && md.length > 500, 'Markdown output generated non-empty string');
  assert(md.includes('---') && md.includes('title:'), 'Markdown includes valid YAML frontmatter');
  assert(md.includes('> [!'), 'Markdown includes Obsidian / GitHub callouts');
  assert(md.includes('## '), 'Markdown contains section headings');
  assert(md.includes('AG47 YouLearn'), 'Markdown contains generator attribution');
}

console.log('\n========================================');
console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
}
