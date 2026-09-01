import fs from 'fs';
import path from 'path';
import { parseDesignSystemMarkdown } from '../parser';
import { normalizeDesignSystem } from '../normalizer';
import { calculateCoverageAndAudit } from '../coverage';
import { generateCssTokens, generateTailwindConfig } from '../exporters';
import { ARCHETYPE_SECTION_RECIPES } from '../runtime/section-recipes';

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

  // 1. Test Official Neutral Unfilled Template
  const templatePath = path.join(process.cwd(), 'public', 'templates', 'design-system-template.md');
  assert(fs.existsSync(templatePath), 'Official neutral template exists on disk');

  const templateContent = fs.readFileSync(templatePath, 'utf8');
  const parsedTemplate = parseDesignSystemMarkdown(templateContent);
  assert(parsedTemplate.frontmatter.spec_version === '1.1', 'Parsed template frontmatter spec_version is 1.1');
  assert(parsedTemplate.sections.length >= 8, `Parsed template has ${parsedTemplate.sections.length} structured sections`);

  // Verify Zero Lima / AG47 / Pre-filled Brand Contamination in Download Template
  assert(!templateContent.includes('#C2F500'), 'Template has ZERO Lima primary color (#C2F500)');
  assert(!templateContent.includes('#A855F7'), 'Template has ZERO Lima secondary color (#A855F7)');
  assert(!templateContent.includes('Space Grotesk'), 'Template has ZERO Lima font (Space Grotesk)');
  assert(!templateContent.includes('Lima Voice Platform'), 'Template has ZERO Lima brand references');
  assert(!templateContent.includes('AGMenu'), 'Template has ZERO AGMenu brand references');
  assert(!templateContent.includes('#2563EB'), 'Template has ZERO hardcoded blue brand color (#2563EB)');

  const normalizedTemplate = normalizeDesignSystem(parsedTemplate);
  assert(normalizedTemplate.isValid, 'Neutral unfilled template is schema-valid', JSON.stringify(normalizedTemplate.errors));
  assert(normalizedTemplate.normalized?.colors.primary.status === 'NOT_DEFINED', 'Template primary color status is NOT_DEFINED');
  assert(normalizedTemplate.normalized?.typography.display.status === 'NOT_DEFINED', 'Template typography display status is NOT_DEFINED');

  // 1.1 Test Full External Project Flow:
  // Download Model (unfilled template) -> Fill in external project -> Upload to Lab -> Parse/Normalize -> Runtime Visual
  const filledExternalProjectMd = templateContent
    .replace('name: ""', 'name: "Apex Cyber Security"')
    .replace('description: ""', 'description: "Design System para plataforma de cibersegurança e SOC."')
    .replace('archetype: ""', 'archetype: "fintech"')
    .replace('density: ""', 'density: "compact"')
    .replace('brand_name: ""', 'brand_name: "Apex Cyber"')
    .replace('headline: ""', 'headline: "Proteção Zero Trust em Tempo Real"')
    .replace('| `primary` | Primary Brand | | | Ações principais e botões CTA | `NOT_DEFINED` |', '| `primary` | Primary Brand | `#00FF66` | `#00FF66` | Ações principais e botões CTA | `DEFINED` |')
    .replace('| `secondary` | Secondary | | | Ações secundárias e elementos de suporte | `NOT_DEFINED` |', '| `secondary` | Secondary | `#00E5FF` | `#00E5FF` | Ações secundárias | `DEFINED` |')
    .replace('| `display` | Display Hero | | | | | | | `NOT_DEFINED` |', '| `display` | Display Hero | `Geist, sans-serif` | `44px` | `30px` | `800` | `1.1` | `-0.02em` | `DEFINED` |')
    .replace('### Button Primary\n- **ID:** `button.primary`\n- **Category:** `button`\n- **Status:** `NOT_DEFINED`\n- **Radius:** \n- **Padding:** \n- **Font Token:** `button`\n- **States:\n  - `default`: bg=, text=, border=, shadow=', '### Button Primary\n- **ID:** `button.primary`\n- **Category:** `button`\n- **Status:** `DEFINED`\n- **Radius:** `6px`\n- **Padding:** `8px 16px`\n- **Font Token:** `button`\n- **States:**\n  - `default`: bg=`#00FF66`, text=`#000000`, border=`transparent`');

  const parsedExternal = parseDesignSystemMarkdown(filledExternalProjectMd);
  const normalizedExternal = normalizeDesignSystem(parsedExternal);
  assert(normalizedExternal.isValid, 'Filled external project is 100% valid', JSON.stringify(normalizedExternal.errors));
  assert(normalizedExternal.normalized?.meta.name === 'Apex Cyber Security', 'External project name parsed correctly');
  assert(normalizedExternal.normalized?.colors.primary.value === '#00FF66', 'External project primary color parsed as #00FF66');
  assert(normalizedExternal.normalized?.presentation.archetype === 'fintech', 'External project archetype parsed as fintech');
  assert(normalizedExternal.normalized?.presentation.is_fallback === false, 'External project presentation was explicitly declared');

  // Verify Runtime recipes generation for external project
  const archetypeRecipe = ARCHETYPE_SECTION_RECIPES[normalizedExternal.normalized!.presentation.archetype];
  assert(archetypeRecipe && archetypeRecipe.sections.length > 4, `Runtime section recipe generated for archetype (${archetypeRecipe?.sections.length} sections)`);

  // 2. Test Golden Sample (AGMenu Clean)
  const samplePath = path.join(process.cwd(), 'public', 'examples', 'agmenu-clean-sample.md');
  assert(fs.existsSync(samplePath), 'Golden fixture sample exists on disk');

  const sampleContent = fs.readFileSync(samplePath, 'utf8');
  const parsedSample = parseDesignSystemMarkdown(sampleContent);
  const normalizedSample = normalizeDesignSystem(parsedSample);
  assert(normalizedSample.isValid, 'Normalized AGMenu sample is valid', JSON.stringify(normalizedSample.errors));
  assert(normalizedSample.normalized?.colors.primary.dark_value === '#D1FF00', 'AGMenu primary dark color parsed as #D1FF00 (Lime)');

  // 2.1 Test Preset: SaaS Dark
  const saasPath = path.join(process.cwd(), 'public', 'examples', 'saas-dark-sample.md');
  assert(fs.existsSync(saasPath), 'SaaS Dark fixture exists on disk');
  const saasContent = fs.readFileSync(saasPath, 'utf8');
  const normalizedSaas = normalizeDesignSystem(parseDesignSystemMarkdown(saasContent));
  assert(normalizedSaas.isValid, 'Normalized SaaS Dark sample is valid', JSON.stringify(normalizedSaas.errors));
  assert(normalizedSaas.normalized?.colors.primary.dark_value === '#6366F1', 'SaaS Dark primary is #6366F1');

  // 2.2 Test Preset: Fintech Minimal
  const fintechPath = path.join(process.cwd(), 'public', 'examples', 'fintech-minimal-sample.md');
  assert(fs.existsSync(fintechPath), 'Fintech Minimal fixture exists on disk');
  const fintechContent = fs.readFileSync(fintechPath, 'utf8');
  const normalizedFintech = normalizeDesignSystem(parseDesignSystemMarkdown(fintechContent));
  assert(normalizedFintech.isValid, 'Normalized Fintech Minimal sample is valid', JSON.stringify(normalizedFintech.errors));
  assert(normalizedFintech.normalized?.colors.primary.dark_value === '#10B981', 'Fintech Minimal primary is #10B981');

  // 2.3 Test Preset: E-Commerce Vibrant
  const ecomPath = path.join(process.cwd(), 'public', 'examples', 'ecommerce-vibrant-sample.md');
  assert(fs.existsSync(ecomPath), 'E-Commerce Vibrant fixture exists on disk');
  const ecomContent = fs.readFileSync(ecomPath, 'utf8');
  const normalizedEcom = normalizeDesignSystem(parseDesignSystemMarkdown(ecomContent));
  assert(normalizedEcom.isValid, 'Normalized E-Commerce Vibrant sample is valid', JSON.stringify(normalizedEcom.errors));
  assert(normalizedEcom.normalized?.colors.primary.dark_value === '#FF5941', 'E-Commerce Vibrant primary is #FF5941');

  // 2.4 Test Benchmark Fixture: Lima Design System (v1.2 / spec 1.1)
  const limaPath = path.join(process.cwd(), 'public', 'examples', 'lima-design-system-sample.md');
  assert(fs.existsSync(limaPath), 'Lima Design System benchmark fixture exists on disk');
  const limaContent = fs.readFileSync(limaPath, 'utf8');
  const parsedLima = parseDesignSystemMarkdown(limaContent);
  assert(parsedLima.frontmatter.spec_version === '1.1', 'Lima sample spec_version is 1.1');
  const normalizedLima = normalizeDesignSystem(parsedLima);
  assert(normalizedLima.isValid, 'Normalized Lima sample is valid', JSON.stringify(normalizedLima.errors));
  assert(normalizedLima.normalized?.colors.primary.value === '#C2F500', 'Lima primary color is #C2F500 (Lime)');
  assert(normalizedLima.normalized?.colors.secondary.dark_value === '#A855F7', 'Lima secondary dark color is #A855F7 (Purple)');
  assert(normalizedLima.normalized?.presentation.archetype === 'saas', 'Lima presentation archetype is saas');
  assert(normalizedLima.normalized?.demo_content.brand_name === 'Lima Voice Platform', 'Lima demo brand name resolved correctly');

  // 3. Test Presentation Profile & Demo Content Resolution for v1.0 Specs
  if (normalizedSample.normalized) {
    assert(normalizedSample.normalized.presentation.archetype === 'restaurant', 'AGMenu v1.0 correctly inferred as restaurant archetype');
    assert(normalizedSample.normalized.presentation.is_fallback === true, 'AGMenu presentation marked as deterministic fallback');
    assert(normalizedSample.normalized.demo_content.profile === 'restaurant', 'AGMenu demo_content mapped to restaurant profile');
  }

  // 4. Test Coverage Calculation & Mathematical Precision
  if (normalizedSample.normalized) {
    const audit = calculateCoverageAndAudit(normalizedSample.normalized);
    assert(audit.coverage.overallPercentage >= 80, `AGMenu overall coverage is ${audit.coverage.overallPercentage}% (>= 80%)`);
    assert(audit.coverage.categories.length === 8, 'Audit contains 8 distinct categories');

    const foundCategory = audit.coverage.categories.find((c) => c.category === 'Foundations');
    assert(foundCategory !== undefined && foundCategory.percentage > 90, 'Foundations category coverage is > 90%');
  }

  // 5. Test Incompatible Spec Version Error
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

  // 6. Test NOT_APPLICABLE denominator reduction
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
    assert(
      founds !== undefined && founds.not_applicable >= 12,
      `NOT_APPLICABLE correctly deducted from denominator (not_applicable count: ${founds?.not_applicable})`
    );
  }

  // 7. Test Exporters (CSS Tokens and Tailwind Config)
  if (normalizedSample.normalized) {
    const cssOutput = generateCssTokens(normalizedSample.normalized);
    assert(cssOutput.includes(':root {'), 'CSS tokens export includes :root');
    assert(cssOutput.includes('--color-primary: #84CC16;'), 'CSS tokens export contains light primary');
    assert(cssOutput.includes('--color-primary: #D1FF00;'), 'CSS tokens export contains dark primary');
    assert(cssOutput.includes('--spacing-base: 4px;'), 'CSS tokens export contains spacing base');

    const tailwindOutput = generateTailwindConfig(normalizedSample.normalized);
    assert(tailwindOutput.includes('import type { Config }'), 'Tailwind config includes Config type import');
    assert(tailwindOutput.includes("'primary': 'var(--color-primary)'"), 'Tailwind config maps primary color');
    assert(tailwindOutput.includes('borderRadius: {'), 'Tailwind config extends borderRadius');
  }

  console.log(`\n🏁 Test Results: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
