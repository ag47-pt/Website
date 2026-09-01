import { ElementStatus } from './types';

export interface RawParsedTable {
  headers: string[];
  rows: Record<string, string>[];
}

export interface RawParsedSection {
  title: string;
  level: number;
  content: string;
  tables: RawParsedTable[];
  lists: string[];
  keyValues: Record<string, string>;
  subsections: RawParsedSection[];
}

export interface RawParsedDocument {
  frontmatter: Record<string, any>;
  sections: RawParsedSection[];
  rawMarkdown: string;
}

export type RawParsedDesignSystem = RawParsedDocument;

/**
 * Safely parse YAML-like key-value frontmatter with support for nested objects
 * without eval or unsafe scripts.
 */
export function parseYamlFrontmatter(markdown: string): { frontmatter: Record<string, any>; body: string } {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: markdown };
  }

  const rawYaml = match[1];
  const body = match[2] || '';
  const frontmatter: Record<string, any> = {};

  const lines = rawYaml.split(/\r?\n/);
  let currentParent: string | null = null;

  function parseVal(rawVal: string, key: string): any {
    const isExplicitlyQuoted =
      (rawVal.startsWith('"') && rawVal.endsWith('"')) ||
      (rawVal.startsWith("'") && rawVal.endsWith("'"));

    if (isExplicitlyQuoted) {
      return rawVal.slice(1, -1);
    }
    if (key.includes('version') || key === 'spec_version') {
      return rawVal;
    }
    if (rawVal.toLowerCase() === 'true') {
      return true;
    }
    if (rawVal.toLowerCase() === 'false') {
      return false;
    }
    if (!isNaN(Number(rawVal)) && rawVal !== '') {
      return Number(rawVal);
    }
    return rawVal;
  }

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const isIndented = line.startsWith('  ') || line.startsWith('\t');
    const trimmed = line.trim();
    const colonIndex = trimmed.indexOf(':');

    if (colonIndex > 0) {
      const key = trimmed.slice(0, colonIndex).trim();
      const rawVal = trimmed.slice(colonIndex + 1).trim();

      if (!isIndented) {
        if (rawVal === '') {
          // Parent key with nested children
          currentParent = key;
          frontmatter[currentParent] = {};
        } else {
          currentParent = null;
          frontmatter[key] = parseVal(rawVal, key);
        }
      } else if (currentParent) {
        // Child key inside currentParent object
        frontmatter[currentParent][key] = parseVal(rawVal, key);
      } else {
        frontmatter[key] = parseVal(rawVal, key);
      }
    }
  }

  return { frontmatter, body };
}

/**
 * Parse markdown tables into array of row objects keyed by normalized header names
 */
export function parseMarkdownTables(content: string): RawParsedTable[] {
  const tables: RawParsedTable[] = [];
  const lines = content.split(/\r?\n/);
  let inTable = false;
  let currentHeaders: string[] = [];
  let currentRows: Record<string, string>[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      const cells = line
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim().replace(/^`|`$/g, ''));

      if (!inTable) {
        // First line is headers
        currentHeaders = cells.map((h) => normalizeKey(h));
        currentRows = [];
        inTable = true;
      } else if (cells.every((c) => /^:?-+:?$/.test(c.replace(/\s+/g, '')))) {
        // Separator row (e.g. | :--- | :--- |) -> skip
        continue;
      } else {
        // Data row
        const rowData: Record<string, string> = {};
        currentHeaders.forEach((header, idx) => {
          rowData[header] = cells[idx] !== undefined ? cells[idx] : '';
        });
        currentRows.push(rowData);
      }
    } else {
      if (inTable) {
        if (currentHeaders.length > 0 && currentRows.length > 0) {
          tables.push({ headers: currentHeaders, rows: currentRows });
        }
        inTable = false;
        currentHeaders = [];
        currentRows = [];
      }
    }
  }

  if (inTable && currentHeaders.length > 0 && currentRows.length > 0) {
    tables.push({ headers: currentHeaders, rows: currentRows });
  }

  return tables;
}

/**
 * Normalize header or key string to snake_case / identifier safe key
 */
export function normalizeKey(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Clean status string to ElementStatus enum
 */
export function parseElementStatus(val?: string): ElementStatus {
  if (!val) return 'DEFINED';
  const clean = val.toUpperCase().replace(/[^A-Z_]/g, '');
  if (clean === 'NOT_DEFINED') return 'NOT_DEFINED';
  if (clean === 'NOT_APPLICABLE') return 'NOT_APPLICABLE';
  if (clean === 'INHERITED') return 'INHERITED';
  return 'DEFINED';
}

/**
 * Parses markdown body into hierarchical sections
 */
export function parseMarkdownSections(body: string): RawParsedSection[] {
  const sections: RawParsedSection[] = [];
  const lines = body.split(/\r?\n/);

  let currentSection: RawParsedSection | null = null;
  let sectionContentLines: string[] = [];

  const finalizeCurrentSection = () => {
    if (currentSection) {
      const fullContent = sectionContentLines.join('\n');
      currentSection.content = fullContent;
      currentSection.tables = parseMarkdownTables(fullContent);

      // Extract list items and key-values
      const lists: string[] = [];
      const keyValues: Record<string, string> = {};

      for (const line of sectionContentLines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const item = trimmed.slice(2).trim();
          lists.push(item);

          // Check if it's a key-value like "- **Key:** Value"
          const kvMatch = item.match(/^\*\*([^:]+):\*\*\s*(.*)$/);
          if (kvMatch) {
            keyValues[normalizeKey(kvMatch[1])] = kvMatch[2].trim().replace(/^`|`$/g, '');
          }
        }
      }

      currentSection.lists = lists;
      currentSection.keyValues = keyValues;
      sections.push(currentSection);
    }
  };

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      finalizeCurrentSection();
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();
      currentSection = {
        title,
        level,
        content: '',
        tables: [],
        lists: [],
        keyValues: {},
        subsections: [],
      };
      sectionContentLines = [];
    } else {
      sectionContentLines.push(line);
    }
  }

  finalizeCurrentSection();
  return sections;
}

/**
 * Main parser entry point: parses raw Markdown string into structured AST
 */
export function parseDesignSystemMarkdown(markdown: string): RawParsedDocument {
  const { frontmatter, body } = parseYamlFrontmatter(markdown);
  const sections = parseMarkdownSections(body);

  return {
    frontmatter,
    sections,
    rawMarkdown: markdown,
  };
}
