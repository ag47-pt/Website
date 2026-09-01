import {
  RawParsedDesignSystem,
  RawParsedSection,
  parseElementStatus,
  normalizeKey,
} from './parser';
import {
  NormalizedDesignSystem,
  ValidationResult,
  ValidationErrorItem,
  ColorPaletteSpec,
  ColorToken,
  TypographyScaleSpec,
  TypographyToken,
  SpacingSpec,
  RadiusSpec,
  BorderToken,
  ShadowToken,
  ContainerSpec,
  BreakpointSpec,
  MotionSpec,
  ComponentSpec,
  PatternSpec,
  SpecVersion,
  ComponentStateMap,
  StateDefinition,
} from './types';
import { NormalizedDesignSystemSchema } from './schema';
import { resolvePresentationProfile, resolveDemoContent } from './presentation-resolver';

/**
 * Deterministically transforms a raw parsed Markdown AST into a fully resolved,
 * strictly typed NormalizedDesignSystem object.
 */
export function normalizeDesignSystem(doc: RawParsedDesignSystem): ValidationResult {
  const errors: ValidationErrorItem[] = [];
  const warnings: ValidationErrorItem[] = [];

  const { frontmatter, sections, rawMarkdown } = doc;

  // 1. Meta Normalization & Version Verification
  const specVersion = String(frontmatter.spec_version || '1.0') as SpecVersion;
  if (specVersion !== '1.0' && specVersion !== '1.1') {
    errors.push({
      path: 'meta.spec_version',
      message: `Versão "${specVersion}" incompatível. As versões de contrato suportadas são "1.0" e "1.1".`,
      severity: 'error',
    });
  }

  // Clean presentation and demo_content objects from empty string / null values
  const cleanObjectKeys = (obj: any) => {
    if (!obj || typeof obj !== 'object') return undefined;
    const res: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined && v !== null && v !== '') {
        res[k] = v;
      }
    }
    return Object.keys(res).length > 0 ? res : undefined;
  };

  const cleanPresentation = cleanObjectKeys(frontmatter.presentation);
  const cleanDemoContent = cleanObjectKeys(frontmatter.demo_content);

  const meta = {
    spec_version: (specVersion === '1.1' ? '1.1' : '1.0') as SpecVersion,
    name: String(frontmatter.name || 'Design System Sem Nome'),
    version: String(frontmatter.version || '1.0.0'),
    platform: (frontmatter.platform || 'web') as any,
    description: String(frontmatter.description || ''),
    theme: String(frontmatter.theme || 'default'),
    supported_modes: (frontmatter.supported_modes || 'both') as any,
    presentation: cleanPresentation as any,
    demo_content: cleanDemoContent as any,
    author: frontmatter.author ? String(frontmatter.author) : undefined,
    last_updated: frontmatter.last_updated ? String(frontmatter.last_updated) : undefined,
  };

  if (!frontmatter.name) {
    warnings.push({
      path: 'meta.name',
      message: 'Nome do Design System ausente no frontmatter. Usando valor padrão.',
      severity: 'warning',
    });
  }

  // Helper to find section by title keywords
  const findSection = (keywords: string[]): RawParsedSection | undefined => {
    return sections.find((s: RawParsedSection) => {
      const lower = s.title.toLowerCase();
      return keywords.some((k) => lower.includes(k));
    });
  };

  // 2. Identity Normalization
  const identitySec = findSection(['identity', 'principles', 'identidade', 'principios']);
  const identity = {
    principles: extractListItems(identitySec, 'principles', 'principios'),
    brand_personality: extractListItems(identitySec, 'brand_personality', 'personalidade'),
    visual_direction: identitySec?.keyValues['visual_direction'] || identitySec?.keyValues['direcao_visual'] || '',
    dos: extractListItems(identitySec, 'do', 'dos', 'fazer'),
    donts: extractListItems(identitySec, 'dont', 'donts', 'nao_fazer', 'evitar'),
  };

  // 3. Colors Normalization
  const colorsSec = findSection(['color', 'colors', 'cores', 'paleta', 'palette']);
  const colors = normalizeColorPalette(colorsSec, warnings);

  // 4. Typography Normalization
  const typeSec = findSection(['typography', 'tipografia', 'type_scale', 'scale']);
  const typography = normalizeTypographyScale(typeSec, warnings);

  // 5. Spacing & Radius Normalization
  const spaceSec = findSection(['spacing', 'espacamento', 'layout_foundations', 'foundations']);
  const spacing = normalizeSpacing(spaceSec);
  const radius = normalizeRadius(spaceSec);
  const borders = normalizeBorders(spaceSec);
  const shadows = normalizeShadows(spaceSec);

  // 6. Containers & Breakpoints
  const containers: ContainerSpec = {
    max_width_sm: '640px',
    max_width_md: '768px',
    max_width_lg: '1024px',
    max_width_xl: '1280px',
    status: 'DEFINED',
  };

  const breakpoints: BreakpointSpec = {
    mobile: '375px',
    tablet: '768px',
    desktop: '1280px',
    status: 'DEFINED',
  };

  // 7. Motion Normalization
  const motionSec = findSection(['motion', 'animacao', 'animation']);
  const motion = normalizeMotion(motionSec);

  // 8. Components Normalization
  const components = normalizeComponents(sections, warnings);

  // 9. Patterns Normalization
  const patterns = normalizePatterns(sections);

  // 10. Accessibility & Responsive Normalization
  const a11ySec = findSection(['accessibility', 'acessibilidade', 'responsive', 'responsividade']);
  const accessibility = {
    wcag_target: ((a11ySec?.keyValues['wcag_target'] || 'AA') as any),
    color_contrast_min: a11ySec?.keyValues['color_contrast_minimum'] || a11ySec?.keyValues['color_contrast_min'] || '4.5:1',
    keyboard_navigable: a11ySec?.keyValues['keyboard_navigation'] !== 'false',
    screen_reader_tested: a11ySec?.keyValues['screen_reader_tested'] === 'true',
    status: 'DEFINED' as const,
  };

  const responsive = {
    strategy: ((a11ySec?.keyValues['responsive_strategy'] || 'mobile_first') as any),
    status: 'DEFINED' as const,
  };

  // 11. Presentation & Demo Content Resolution
  const presentation = resolvePresentationProfile(meta);
  const demo_content = resolveDemoContent(meta, presentation);

  const normalizedCandidate: NormalizedDesignSystem = {
    meta,
    identity,
    presentation,
    demo_content,
    colors,
    typography,
    spacing,
    radius,
    borders,
    shadows,
    containers,
    breakpoints,
    motion,
    components,
    patterns,
    responsive,
    accessibility,
    raw_markdown: rawMarkdown,
  };

  // Run through Zod for schema validation
  const zodResult = NormalizedDesignSystemSchema.safeParse(normalizedCandidate);
  if (!zodResult.success) {
    for (const issue of zodResult.error.issues) {
      errors.push({
        path: issue.path.join('.'),
        message: issue.message,
        severity: 'error',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    version: '1.0',
    errors,
    warnings,
    normalized: zodResult.success ? (zodResult.data as NormalizedDesignSystem) : normalizedCandidate,
  };
}

/**
 * Helper to extract list items or bullet lines matching key prefixes
 */
function extractListItems(sec: RawParsedSection | undefined, ...keys: string[]): string[] {
  if (!sec) return [];
  const items: string[] = [];

  let capturing = false;
  for (const line of sec.lists) {
    const lower = line.toLowerCase();
    const matchedKey = keys.some((k) => lower.startsWith(`**${k}:**`) || lower.startsWith(`${k}:`));
    if (matchedKey) {
      capturing = true;
      const contentAfterColon = line.split(/:\*\*/)[1] || line.split(/:/)[1] || '';
      if (contentAfterColon.trim()) {
        items.push(contentAfterColon.trim());
      }
      continue;
    }
    if (capturing) {
      if (line.startsWith('**') && line.includes(':**')) {
        break; // Next section began
      }
      items.push(line.replace(/^[-\*]\s*/, '').trim());
    }
  }

  return items;
}

/**
 * Normalizes Color Palette section
 */
function normalizeColorPalette(sec: RawParsedSection | undefined, warnings: ValidationErrorItem[]): ColorPaletteSpec {
  const defaultColors: ColorPaletteSpec = {
    primary: { name: 'Primary', value: '#2563EB', dark_value: '#3B82F6', usage: 'Ações primárias', status: 'DEFINED' },
    secondary: { name: 'Secondary', value: '#64748B', dark_value: '#94A3B8', usage: 'Ações secundárias', status: 'DEFINED' },
    accent: { name: 'Accent', value: '#10B981', dark_value: '#34D399', usage: 'Destaques e badges', status: 'DEFINED' },
    background: { name: 'Background', value: '#FFFFFF', dark_value: '#09090B', usage: 'Fundo principal', status: 'DEFINED' },
    surface: { name: 'Surface', value: '#F8FAFC', dark_value: '#18181B', usage: 'Superfície de cards', status: 'DEFINED' },
    surface_elevated: { name: 'Surface Elevated', value: '#FFFFFF', dark_value: '#27272A', usage: 'Modais e popovers', status: 'DEFINED' },
    text_primary: { name: 'Text Primary', value: '#0F172A', dark_value: '#F8FAFC', usage: 'Texto principal', status: 'DEFINED' },
    text_secondary: { name: 'Text Secondary', value: '#475569', dark_value: '#94A3B8', usage: 'Texto secundário', status: 'DEFINED' },
    text_muted: { name: 'Text Muted', value: '#94A3B8', dark_value: '#71717A', usage: 'Legendas e metadados', status: 'DEFINED' },
    border: { name: 'Border', value: '#E2E8F0', dark_value: '#27272A', usage: 'Bordas', status: 'DEFINED' },
    success: { name: 'Success', value: '#10B981', dark_value: '#34D399', usage: 'Sucesso', status: 'DEFINED' },
    warning: { name: 'Warning', value: '#F59E0B', dark_value: '#FBBF24', usage: 'Avisos', status: 'DEFINED' },
    error: { name: 'Error', value: '#EF4444', dark_value: '#F87171', usage: 'Erros e destrutivos', status: 'DEFINED' },
    info: { name: 'Info', value: '#3B82F6', dark_value: '#60A5FA', usage: 'Informativo', status: 'DEFINED' },
  };

  if (!sec || sec.tables.length === 0) {
    warnings.push({
      path: 'colors',
      message: 'Tabela de cores não encontrada no documento. Utilizando valores base.',
      severity: 'warning',
    });
    return defaultColors;
  }

  const table = sec.tables[0];
  const customTokens: Record<string, ColorToken> = {};

  for (const row of table.rows) {
    const rawId =
      row['token_key'] ||
      row['token_id'] ||
      row['id'] ||
      row['token'] ||
      row['key'] ||
      row['token_name'] ||
      row['name'] ||
      '';
    const id = normalizeKey(rawId);
    if (!id) continue;

    const name = row['nome'] || row['token_name'] || row['name'] || rawId;
    const status = parseElementStatus(row['status']);
    const rawValClaro = row['valor_claro'] || row['light_value'] || row['value'] || row['light'];
    const rawValEscuro = row['valor_escuro'] || row['dark_value'] || row['dark'];
    const defCol = defaultColors[id as keyof ColorPaletteSpec] as ColorToken | undefined;

    const value = rawValClaro && rawValClaro.trim() !== ''
      ? rawValClaro.trim()
      : (status === 'NOT_DEFINED' ? 'transparent' : (defCol?.value || '#000000'));

    const dark_value = rawValEscuro && rawValEscuro.trim() !== '' ? rawValEscuro.trim() : undefined;
    const usage = row['uso_principal'] || row['uso'] || row['usage'] || '';

    const token: ColorToken = {
      name,
      value,
      dark_value,
      usage,
      status,
    };

    if (id in defaultColors) {
      (defaultColors as any)[id] = token;
    } else {
      customTokens[id] = token;
    }
  }

  if (Object.keys(customTokens).length > 0) {
    defaultColors.custom = customTokens;
  }

  return defaultColors;
}

/**
 * Normalizes Typography scale section
 */
function normalizeTypographyScale(sec: RawParsedSection | undefined, warnings: ValidationErrorItem[]): TypographyScaleSpec {
  const defaultTypography: TypographyScaleSpec = {
    display: { name: 'Display Hero', font_family: 'var(--font-sans, Inter, sans-serif)', size: '48px', mobile_size: '32px', weight: 800, line_height: 1.1, tracking: '-0.02em', status: 'DEFINED' },
    h1: { name: 'Heading 1', font_family: 'var(--font-sans, Inter, sans-serif)', size: '36px', mobile_size: '28px', weight: 700, line_height: 1.2, tracking: '-0.02em', status: 'DEFINED' },
    h2: { name: 'Heading 2', font_family: 'var(--font-sans, Inter, sans-serif)', size: '28px', mobile_size: '24px', weight: 700, line_height: 1.25, tracking: '-0.01em', status: 'DEFINED' },
    h3: { name: 'Heading 3', font_family: 'var(--font-sans, Inter, sans-serif)', size: '22px', mobile_size: '20px', weight: 600, line_height: 1.3, status: 'DEFINED' },
    section_title: { name: 'Section Title', font_family: 'var(--font-sans, Inter, sans-serif)', size: '20px', mobile_size: '18px', weight: 600, line_height: 1.35, status: 'DEFINED' },
    card_title: { name: 'Card Title', font_family: 'var(--font-sans, Inter, sans-serif)', size: '18px', mobile_size: '16px', weight: 600, line_height: 1.4, status: 'DEFINED' },
    body: { name: 'Body Text', font_family: 'var(--font-sans, Inter, sans-serif)', size: '16px', mobile_size: '15px', weight: 400, line_height: 1.5, status: 'DEFINED' },
    secondary_body: { name: 'Secondary Body', font_family: 'var(--font-sans, Inter, sans-serif)', size: '14px', mobile_size: '13px', weight: 400, line_height: 1.5, status: 'DEFINED' },
    caption: { name: 'Caption', font_family: 'var(--font-sans, Inter, sans-serif)', size: '12px', mobile_size: '11px', weight: 400, line_height: 1.4, tracking: '0.01em', status: 'DEFINED' },
    label: { name: 'Input Label', font_family: 'var(--font-sans, Inter, sans-serif)', size: '13px', mobile_size: '12px', weight: 600, line_height: 1.4, tracking: '0.02em', status: 'DEFINED' },
    button: { name: 'Button Label', font_family: 'var(--font-sans, Inter, sans-serif)', size: '14px', mobile_size: '13px', weight: 600, line_height: 1.2, tracking: '0.02em', status: 'DEFINED' },
    price: { name: 'Price Highlight', font_family: 'var(--font-sans, Inter, sans-serif)', size: '24px', mobile_size: '20px', weight: 700, line_height: 1.1, tracking: '-0.02em', status: 'DEFINED' },
    metadata: { name: 'Metadata Code', font_family: 'var(--font-mono, monospace)', size: '11px', mobile_size: '10px', weight: 500, line_height: 1.4, tracking: '0.05em', status: 'DEFINED' },
  };

  if (!sec || sec.tables.length === 0) {
    warnings.push({
      path: 'typography',
      message: 'Tabela de tipografia não encontrada no documento. Utilizando escala padrão.',
      severity: 'warning',
    });
    return defaultTypography;
  }

  const table = sec.tables[0];
  const customTokens: Record<string, TypographyToken> = {};

  for (const row of table.rows) {
    const rawId = row['level'] || row['id'] || row['name'] || '';
    const id = normalizeKey(rawId);
    if (!id) continue;

    const status = parseElementStatus(row['status']);
    const rawSize = row['size'];
    const defTypo = defaultTypography[id as keyof TypographyScaleSpec] as TypographyToken | undefined;
    const size = rawSize && rawSize.trim() !== ''
      ? rawSize.trim()
      : (status === 'NOT_DEFINED' ? '0px' : (defTypo?.size || '16px'));

    const token: TypographyToken = {
      name: row['name'] || rawId,
      font_family: row['font_family'] || row['family'] || 'inherit',
      size,
      mobile_size: row['mobile_size'] && row['mobile_size'].trim() !== '' ? row['mobile_size'].trim() : undefined,
      weight: row['weight'] && row['weight'].trim() !== '' ? (Number(row['weight']) || row['weight'].trim()) : 400,
      line_height: row['line_height'] && row['line_height'].trim() !== '' ? (Number(row['line_height']) || row['line_height'].trim()) : 1.5,
      tracking: row['tracking'] && row['tracking'].trim() !== '' ? row['tracking'].trim() : undefined,
      style: row['style'] && row['style'].trim() !== '' ? row['style'].trim() : undefined,
      status,
    };

    if (id in defaultTypography) {
      (defaultTypography as any)[id] = token;
    } else {
      customTokens[id] = token;
    }
  }

  if (Object.keys(customTokens).length > 0) {
    defaultTypography.custom = customTokens;
  }

  return defaultTypography;
}

/**
 * Normalizes Spacing foundations
 */
function normalizeSpacing(sec: RawParsedSection | undefined): SpacingSpec {
  const spec: SpacingSpec = {
    base_unit: '4px',
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    section_spacing: '64px',
    container_padding: '16px',
    status: 'DEFINED',
  };

  if (!sec || sec.tables.length === 0) return spec;

  const table = sec.tables[0];
  for (const row of table.rows) {
    const token = normalizeKey(row['token'] || row['id'] || '');
    const val = row['value'] || '';
    if (token in spec && val) {
      (spec as any)[token] = val;
    }
  }

  return spec;
}

/**
 * Normalizes Radius foundations
 */
function normalizeRadius(sec: RawParsedSection | undefined): RadiusSpec {
  const spec: RadiusSpec = {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',
    status: 'DEFINED',
  };

  if (!sec || sec.tables.length < 2) return spec;

  // Search in all tables of the foundations section for radius tokens
  for (const table of sec.tables) {
    for (const row of table.rows) {
      const token = normalizeKey(row['token'] || row['id'] || '');
      const val = row['value'] || '';
      if (token in spec && val) {
        (spec as any)[token] = val;
      }
    }
  }

  return spec;
}

/**
 * Normalizes Borders
 */
function normalizeBorders(sec: RawParsedSection | undefined): BorderToken {
  const spec: BorderToken = {
    width: '1px',
    style: 'solid',
    color_token: 'border',
    status: 'DEFINED',
  };

  if (!sec) return spec;
  if (sec.keyValues['border_width']) spec.width = sec.keyValues['border_width'];
  if (sec.keyValues['border_style']) spec.style = sec.keyValues['border_style'];

  return spec;
}

/**
 * Normalizes Shadows
 */
function normalizeShadows(sec: RawParsedSection | undefined): ShadowToken {
  const spec: ShadowToken = {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px -1px rgba(0,0,0,0.1)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.1)',
    focus_ring: '0 0 0 3px rgba(37,99,235,0.3)',
    status: 'DEFINED',
  };

  if (!sec) return spec;

  for (const table of sec.tables) {
    for (const row of table.rows) {
      const token = normalizeKey(row['token'] || row['id'] || '');
      const val = row['value'] || '';
      if (token === 'shadow_sm') spec.sm = val;
      if (token === 'shadow_md') spec.md = val;
      if (token === 'shadow_lg') spec.lg = val;
      if (token === 'focus_ring') spec.focus_ring = val;
    }
  }

  return spec;
}

/**
 * Normalizes Motion section
 */
function normalizeMotion(sec: RawParsedSection | undefined): MotionSpec {
  const spec: MotionSpec = {
    duration_fast: '150ms',
    duration_normal: '250ms',
    duration_slow: '400ms',
    easing_default: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    spring: 'spring(1, 100, 10, 0)',
    reduced_motion_rule: 'prefers-reduced-motion: reduce -> duration 0ms',
    status: 'DEFINED',
  };

  if (!sec || sec.tables.length === 0) return spec;

  const table = sec.tables[0];
  for (const row of table.rows) {
    const token = normalizeKey(row['token'] || row['id'] || '');
    const val = row['value'] || '';
    if (token in spec && val) {
      (spec as any)[token] = val;
    }
  }

  return spec;
}

/**
 * Normalizes Components specifications across sections
 */
function normalizeComponents(sections: RawParsedSection[], warnings: ValidationErrorItem[]): Record<string, ComponentSpec> {
  const components: Record<string, ComponentSpec> = {};

  // Core set of expected components for MVP
  const coreComponentIds = [
    'button.primary',
    'button.secondary',
    'button.ghost',
    'button.destructive',
    'input.text',
    'checkbox',
    'switch',
    'badge',
    'card.basic',
    'alert',
  ];

  for (const sec of sections) {
    const id = sec.keyValues['id'];
    if (!id) continue;

    const name = sec.title.replace(/^#+\s*/, '').trim();
    const category = (sec.keyValues['category'] || 'button') as any;
    const status = parseElementStatus(sec.keyValues['status']);
    const radius = sec.keyValues['radius'];
    const padding = sec.keyValues['padding'];
    const fontToken = sec.keyValues['font_token'] || sec.keyValues['font'];
    const inheritedFrom = sec.keyValues['inherited_from'];

    // Parse states from content lines
    const states = parseComponentStates(sec.content);

    components[id] = {
      id,
      name,
      category,
      status,
      inherited_from: inheritedFrom,
      radius,
      padding,
      font_token: fontToken,
      states,
    };
  }

  // Ensure core components have at least fallback representation if missing
  for (const coreId of coreComponentIds) {
    if (!components[coreId]) {
      components[coreId] = {
        id: coreId,
        name: coreId.replace('.', ' ').toUpperCase(),
        category: coreId.startsWith('button') ? 'button' : coreId.startsWith('input') ? 'input' : 'feedback',
        status: 'NOT_DEFINED',
        states: { default: {} },
      };
    }
  }

  return components;
}

/**
 * Parse state key-values (e.g. - `hover`: bg=`#1D4ED8`, text=`#FFFFFF`)
 */
function parseComponentStates(content: string): ComponentStateMap {
  const stateMap: ComponentStateMap = {
    default: {},
  };

  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^[-\*]\s*`?([a-z_]+)`?:\s*(.*)$/i);
    if (match) {
      const stateName = match[1].toLowerCase() as keyof ComponentStateMap;
      const statePropsString = match[2];

      const stateDef: StateDefinition = {};
      const propPairs = statePropsString.split(/,\s*(?=[a-z_]+=)/i);

      for (const pair of propPairs) {
        const [k, v] = pair.split('=');
        if (k && v) {
          const propKey = k.trim().toLowerCase();
          const propVal = v.trim().replace(/^`|`$/g, '').replace(/^"|"$/g, '').replace(/^'|'$/g, '');
          (stateDef as any)[propKey] = propVal;
        }
      }

      stateMap[stateName] = stateDef;
    }
  }

  return stateMap;
}

/**
 * Normalizes Pattern specifications
 */
function normalizePatterns(sections: RawParsedSection[]): Record<string, PatternSpec> {
  const patterns: Record<string, PatternSpec> = {};

  const expectedPatterns = ['pattern.hero', 'pattern.card_grid', 'pattern.cta'];

  for (const sec of sections) {
    const id = sec.keyValues['id'];
    if (!id || !id.startsWith('pattern.')) continue;

    patterns[id] = {
      id,
      name: sec.title.replace(/^#+\s*/, '').trim(),
      status: parseElementStatus(sec.keyValues['status']),
      description: sec.keyValues['description'] || sec.content.trim(),
    };
  }

  for (const expId of expectedPatterns) {
    if (!patterns[expId]) {
      patterns[expId] = {
        id: expId,
        name: expId.replace('pattern.', '').toUpperCase(),
        status: 'DEFINED',
        description: 'Layout pattern',
      };
    }
  }

  return patterns;
}
