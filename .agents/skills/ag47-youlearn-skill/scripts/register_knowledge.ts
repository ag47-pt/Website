/**
 * YouLearn Knowledge Registrar
 * Validates a KnowledgeObject with Zod, writes the TypeScript data module,
 * and updates the central catalog registry idempotently.
 */

import fs from 'fs';
import path from 'path';
import { KnowledgeObjectSchema } from '@/eco/youlearn/schema/validation';
import { KnowledgeObject } from '@/eco/youlearn/schema/types';
import { deriveLibraryEntry } from '@/eco/youlearn/lib/library';

export function registerKnowledgeObject(ko: KnowledgeObject, workspaceRoot?: string): { success: boolean; error?: string; entry?: any } {
  const root = workspaceRoot || process.cwd();

  // 1. Zod Runtime Validation Gate
  const validation = KnowledgeObjectSchema.safeParse(ko);
  if (!validation.success) {
    return {
      success: false,
      error: `Validation Error: ${JSON.stringify(validation.error.format(), null, 2)}`,
    };
  }

  const validKo = validation.data as KnowledgeObject;
  const slug = validKo.slug;
  const varName = slug.replace(/-([a-z0-9])/g, (_, g) => g.toUpperCase()).replace(/[^a-zA-Z0-9]/g, '');

  const dataDirPath = path.join(root, 'eco', 'youlearn', 'data');
  const targetFilePath = path.join(dataDirPath, `${slug}.ts`);
  const catalogIndexPath = path.join(dataDirPath, 'index.ts');

  // 2. Generate TypeScript Content
  const fileContent = `import { KnowledgeObject } from '../schema/types';

export const ${varName}: KnowledgeObject = ${JSON.stringify(validKo, null, 2)};
`;

  fs.writeFileSync(targetFilePath, fileContent, 'utf-8');

  // 3. Update eco/youlearn/data/index.ts Idempotently
  if (fs.existsSync(catalogIndexPath)) {
    let indexContent = fs.readFileSync(catalogIndexPath, 'utf-8');

    const importStatement = `import { ${varName} } from './${slug}';`;
    if (!indexContent.includes(importStatement)) {
      indexContent = `${importStatement}\n` + indexContent;
    }

    // Ensure exported in export statement
    if (!indexContent.includes(`${varName},`) && !indexContent.includes(`${varName} }`)) {
      indexContent = indexContent.replace(
        /export\s*\{\s*([^}]+)\s*\};/,
        (match, p1) => {
          const cleanP1 = p1.trim().replace(/,\s*$/, '');
          return `export { ${cleanP1}, ${varName} };`;
        }
      );
    }

    // Ensure included in DEMO_KNOWLEDGE_OBJECTS array
    const arrayMatch = indexContent.match(/export const DEMO_KNOWLEDGE_OBJECTS:\s*KnowledgeObject\[\]\s*=\s*\[([\s\S]*?)\];/);
    if (arrayMatch && !arrayMatch[1].includes(varName)) {
      const rawItems = arrayMatch[1]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      rawItems.push(varName);
      const uniqueItems = Array.from(new Set(rawItems));
      const formattedItems = uniqueItems.map((item) => `  ${item}`).join(',\n');

      indexContent = indexContent.replace(
        /export const DEMO_KNOWLEDGE_OBJECTS:\s*KnowledgeObject\[\]\s*=\s*\[[\s\S]*?\];/,
        `export const DEMO_KNOWLEDGE_OBJECTS: KnowledgeObject[] = [\n${formattedItems},\n];`
      );
    }

    fs.writeFileSync(catalogIndexPath, indexContent, 'utf-8');
  }

  const libraryEntry = deriveLibraryEntry(validKo);

  return {
    success: true,
    entry: libraryEntry,
  };
}

// CLI Execution Support
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: npx tsx register_knowledge.ts <PATH_TO_JSON_FILE>');
    process.exit(1);
  }

  const jsonFilePath = path.resolve(args[0]);
  if (!fs.existsSync(jsonFilePath)) {
    console.error(`File not found: ${jsonFilePath}`);
    process.exit(1);
  }

  try {
    const rawData = fs.readFileSync(jsonFilePath, 'utf-8');
    const ko = JSON.parse(rawData);
    const result = registerKnowledgeObject(ko);

    if (result.success) {
      console.log(JSON.stringify({ status: 'SUCCESS', entry: result.entry }, null, 2));
    } else {
      console.error(JSON.stringify({ status: 'ERROR', message: result.error }, null, 2));
      process.exit(1);
    }
  } catch (err: any) {
    console.error(JSON.stringify({ status: 'ERROR', message: err.message }, null, 2));
    process.exit(1);
  }
}
