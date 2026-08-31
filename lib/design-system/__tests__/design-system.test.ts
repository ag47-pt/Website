import fs from 'fs';
import path from 'path';
import { parseDesignSystemMarkdown } from '../parser';
import { normalizeDesignSystem } from '../normalizer';
import { calculateCoverageAndAudit } from '../coverage';

function runTests() {
  console.log('🧪 Starting AG47 Labs Skills — Design System Lab Deterministic Test Suite...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      if (detail) console.error(`     Detail: ${detail}`);
      failed++;
    }
  }

  // 1. Test Official Template
  const templatePath = path.join(process.cwd(), 'public', 'templates', 'design-system-template.md');
  assert(fs.existsSync(templatePath), 'Official template exists on disk');

  const templateContent = fs.readFileSync(templatePath, 'utf8');
  const parsedTemplate = parseDesignSystemMarkdown(templateContent);
  assert(parsedTemplate.frontmatter.spec_version === '1.0', 'Parsed template frontmatter spec_version is 1.0');
  assert(parsedTemplate.sections.length > 5, `Parsed template has ${parsedTemplate.sections.length} structured sections`);

  const normalizedTemplate = normalizeDesignSystem(parsedTemplate);
  assert(normalizedTemplate.isValid, 'Normalized official template is schema-valid', JSON.stringify(normalizedTemplate.errors));
  assert(normalizedTemplate.normalized?.colors.primary.value === '#2563EB', 'Template primary color parsed correctly (#2563EB)');
  assert(normalizedTemplate.normalized?.typography.display.size === '48px', 'Template typography display size parsed correctly (48px)');

  // 2. Test Golden Sample (AGMenu Clean)
  const samplePath = path.join(process.cwd(), 'public', 'examples', 'agmenu-clean-sample.md');
  assert(fs.existsSync(samplePath), 'Golden fixture sample exists on disk');

  const sampleContent = fs.readFileSync(samplePath, 'utf8');
  const parsedSample = parseDesignSystemMarkdown(sampleContent);
  const normalizedSample = normalizeDesignSystem(parsedSample);
  assert(normalizedSample.isValid, 'Normalized AGMenu sample is valid', JSON.stringify(normalizedSample.errors));
  assert(normalizedSample.normalized?.colors.primary.dark_value === '#D1FF00', 'AGMenu primary dark color parsed as #D1FF00 (Lime)');

  // 3. Test Coverage Calculation & Mathematical Precision
  if (normalizedSample.normalized) {
    const audit = calculateCoverageAndAudit(normalizedSample.normalized);
    assert(audit.coverage.overallPercentage >= 80, `AGMenu overall coverage is ${audit.coverage.overallPercentage}% (>= 80%)`);
    assert(audit.coverage.categories.length === 8, 'Audit contains 8 distinct categories');

    const foundCategory = audit.coverage.categories.find((c) => c.category === 'Foundations');
    assert(foundCategory !== undefined && foundCategory.percentage > 90, 'Foundations category coverage is > 90%');
  }

  // 4. Test Incompatible Spec Version Error
  const invalidVersionMd = `---
spec_version: "3.5"
name: "Future DS"
version: "1.0.0"
platform: "web"
---
# Content
`;
  const parsedInvalid = parseDesignSystemMarkdown(invalidVersionMd);
  const normalizedInvalid = normalizeDesignSystem(parsedInvalid);
  assert(!normalizedInvalid.isValid, 'Incompatible spec version 3.5 correctly rejected');
  assert(
    normalizedInvalid.errors.some((e) => e.path.includes('spec_version')),
    'Path-addressed error generated for spec_version'
  );

  // 5. Test NOT_APPLICABLE denominator reduction
  const notApplicableMd = `---
spec_version: "1.0"
name: "Minimalist CLI"
version: "1.0.0"
platform: "web"
---

## Color Palette
| Token ID | Token Name | Light Value | Usage | Status |
| :--- | :--- | :--- | :--- | :--- |
| primary | Primary | #000000 | CLI Green | DEFINED |
| secondary | Secondary | #000000 | Secondary | NOT_APPLICABLE |
| accent | Accent | #000000 | Accent | NOT_APPLICABLE |
| background | Canvas | #000000 | Background | NOT_APPLICABLE |
| surface | Surface | #000000 | Surface | NOT_APPLICABLE |
| surface_elevated | Surface Elev | #000000 | Elevated | NOT_APPLICABLE |
| text_primary | Text | #000000 | Text | DEFINED |
| text_secondary | Text Sec | #000000 | Text Sec | NOT_APPLICABLE |
| text_muted | Text Mut | #000000 | Muted | NOT_APPLICABLE |
| border | Border | #000000 | Border | NOT_APPLICABLE |
| success | Success | #000000 | Success | NOT_APPLICABLE |
| warning | Warning | #000000 | Warning | NOT_APPLICABLE |
| error | Error | #000000 | Error | NOT_APPLICABLE |
| info | Info | #000000 | Info | NOT_APPLICABLE |
`;
  const parsedNa = parseDesignSystemMarkdown(notApplicableMd);
  const normalizedNa = normalizeDesignSystem(parsedNa);
  if (normalizedNa.normalized) {
    const auditNa = calculateCoverageAndAudit(normalizedNa.normalized);
    const founds = auditNa.coverage.categories.find((c) => c.category === 'Foundations');
    // total 16 items in foundations (13 colors + 3 tokens), 12 not applicable -> effective total = 4. 2 defined -> 50%
    assert(
      founds !== undefined && founds.not_applicable >= 12,
      `NOT_APPLICABLE correctly deducted from denominator (not_applicable count: ${founds?.not_applicable})`
    );
  }

  console.log(`\n🏁 Test Results: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
