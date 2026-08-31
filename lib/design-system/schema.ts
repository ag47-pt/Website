import { z } from 'zod';

export const ElementStatusSchema = z.enum(['DEFINED', 'NOT_DEFINED', 'NOT_APPLICABLE', 'INHERITED']);

export const ColorTokenSchema = z.object({
  name: z.string().min(1, 'Nome do token de cor obrigatório'),
  value: z.string().min(1, 'Valor da cor obrigatório (hex, rgb, hsl ou var)'),
  dark_value: z.string().optional(),
  usage: z.string().default(''),
  forbidden_usage: z.string().optional(),
  status: ElementStatusSchema.default('DEFINED'),
});

export const TypographyTokenSchema = z.object({
  name: z.string().min(1, 'Nome da tipografia obrigatório'),
  font_family: z.string().default('sans-serif'),
  size: z.string().min(1, 'Tamanho obrigatório (ex: 16px, 1rem)'),
  mobile_size: z.string().optional(),
  weight: z.union([z.string(), z.number()]).default(400),
  line_height: z.union([z.string(), z.number()]).default(1.5),
  tracking: z.string().optional(),
  style: z.string().optional(),
  status: ElementStatusSchema.default('DEFINED'),
});

export const SpacingSpecSchema = z.object({
  base_unit: z.string().default('4px'),
  xs: z.string().default('4px'),
  sm: z.string().default('8px'),
  md: z.string().default('16px'),
  lg: z.string().default('24px'),
  xl: z.string().default('32px'),
  section_spacing: z.string().default('64px'),
  container_padding: z.string().default('16px'),
  status: ElementStatusSchema.default('DEFINED'),
});

export const RadiusSpecSchema = z.object({
  xs: z.string().default('2px'),
  sm: z.string().default('4px'),
  md: z.string().default('8px'),
  lg: z.string().default('16px'),
  full: z.string().default('9999px'),
  status: ElementStatusSchema.default('DEFINED'),
});

export const BorderTokenSchema = z.object({
  width: z.string().default('1px'),
  style: z.string().default('solid'),
  color_token: z.string().default('border'),
  status: ElementStatusSchema.default('DEFINED'),
});

export const ShadowTokenSchema = z.object({
  sm: z.string().default('0 1px 2px rgba(0,0,0,0.05)'),
  md: z.string().default('0 4px 6px -1px rgba(0,0,0,0.1)'),
  lg: z.string().default('0 10px 15px -3px rgba(0,0,0,0.1)'),
  focus_ring: z.string().optional(),
  status: ElementStatusSchema.default('DEFINED'),
});

export const ContainerSpecSchema = z.object({
  max_width_sm: z.string().default('640px'),
  max_width_md: z.string().default('768px'),
  max_width_lg: z.string().default('1024px'),
  max_width_xl: z.string().default('1280px'),
  status: ElementStatusSchema.default('DEFINED'),
});

export const BreakpointSpecSchema = z.object({
  mobile: z.string().default('375px'),
  tablet: z.string().default('768px'),
  desktop: z.string().default('1280px'),
  wide: z.string().optional(),
  status: ElementStatusSchema.default('DEFINED'),
});

export const MotionSpecSchema = z.object({
  duration_fast: z.string().default('150ms'),
  duration_normal: z.string().default('300ms'),
  duration_slow: z.string().default('500ms'),
  easing_default: z.string().default('cubic-bezier(0.2, 0.8, 0.2, 1)'),
  spring: z.string().optional(),
  hover_effect: z.string().optional(),
  entrance_effect: z.string().optional(),
  modal_effect: z.string().optional(),
  reduced_motion_rule: z.string().optional(),
  status: ElementStatusSchema.default('DEFINED'),
});

export const StateDefinitionSchema = z.object({
  bg: z.string().optional(),
  text: z.string().optional(),
  border: z.string().optional(),
  shadow: z.string().optional(),
  opacity: z.string().optional(),
  transform: z.string().optional(),
  cursor: z.string().optional(),
});

export const ComponentStateMapSchema = z.object({
  default: StateDefinitionSchema.default({}),
  hover: StateDefinitionSchema.optional(),
  active: StateDefinitionSchema.optional(),
  focus: StateDefinitionSchema.optional(),
  disabled: StateDefinitionSchema.optional(),
  loading: StateDefinitionSchema.optional(),
  selected: StateDefinitionSchema.optional(),
  error: StateDefinitionSchema.optional(),
  success: StateDefinitionSchema.optional(),
  warning: StateDefinitionSchema.optional(),
});

export const ComponentSpecSchema = z.object({
  id: z.string().min(1, 'ID do componente obrigatório'),
  name: z.string().min(1, 'Nome do componente obrigatório'),
  category: z.enum(['button', 'input', 'selection', 'feedback', 'card', 'navigation', 'overlay', 'display']).default('button'),
  status: ElementStatusSchema.default('DEFINED'),
  inherited_from: z.string().optional(),
  description: z.string().optional(),
  radius: z.string().optional(),
  padding: z.string().optional(),
  font_token: z.string().optional(),
  states: ComponentStateMapSchema.default({ default: {} }),
  variants: z.record(z.string(), z.object({ states: ComponentStateMapSchema })).optional(),
  accessibility: z.object({
    role: z.string().optional(),
    aria_label: z.string().optional(),
    keyboard_navigation: z.string().optional(),
    contrast_ratio_notes: z.string().optional(),
  }).optional(),
});

export const PatternSpecSchema = z.object({
  id: z.string().min(1, 'ID do padrão obrigatório'),
  name: z.string().min(1, 'Nome do padrão obrigatório'),
  status: ElementStatusSchema.default('DEFINED'),
  inherited_from: z.string().optional(),
  description: z.string().optional(),
  layout_type: z.string().optional(),
  spacing: z.string().optional(),
  contained_components: z.array(z.string()).optional(),
  accessibility_notes: z.string().optional(),
});

export const ResponsiveSpecSchema = z.object({
  strategy: z.enum(['mobile_first', 'desktop_first', 'fluid']).default('mobile_first'),
  mobile_nav_behavior: z.string().optional(),
  tablet_columns: z.number().optional(),
  desktop_columns: z.number().optional(),
  status: ElementStatusSchema.default('DEFINED'),
});

export const AccessibilitySpecSchema = z.object({
  wcag_target: z.enum(['A', 'AA', 'AAA']).default('AA'),
  color_contrast_min: z.string().default('4.5:1'),
  keyboard_navigable: z.boolean().default(true),
  screen_reader_tested: z.boolean().default(false),
  status: ElementStatusSchema.default('DEFINED'),
});

export const MetaSpecSchema = z.object({
  spec_version: z.literal('1.0', {
    message: 'Versão de especificação incompatível. A versão suportada no momento é 1.0.',
  }),
  name: z.string().min(1, 'Nome do Design System obrigatório'),
  version: z.string().min(1, 'Versão do Design System obrigatória (ex: 1.0.0)'),
  platform: z.enum(['web', 'mobile', 'universal']).default('web'),
  description: z.string().default(''),
  theme: z.string().default('default'),
  supported_modes: z.enum(['light', 'dark', 'both']).default('both'),
  author: z.string().optional(),
  last_updated: z.string().optional(),
});

export const IdentitySpecSchema = z.object({
  principles: z.array(z.string()).default([]),
  brand_personality: z.array(z.string()).default([]),
  visual_direction: z.string().default(''),
  dos: z.array(z.string()).default([]),
  donts: z.array(z.string()).default([]),
});

export const ColorPaletteSpecSchema = z.object({
  primary: ColorTokenSchema,
  secondary: ColorTokenSchema.default({ name: 'Secondary', value: '#64748B', usage: 'Ações secundárias', status: 'DEFINED' }),
  accent: ColorTokenSchema.default({ name: 'Accent', value: '#F59E0B', usage: 'Destaques e badges', status: 'DEFINED' }),
  background: ColorTokenSchema.default({ name: 'Background', value: '#FFFFFF', dark_value: '#09090B', usage: 'Fundo da aplicação', status: 'DEFINED' }),
  surface: ColorTokenSchema.default({ name: 'Surface', value: '#F8FAFC', dark_value: '#18181B', usage: 'Superfície de cards', status: 'DEFINED' }),
  surface_elevated: ColorTokenSchema.default({ name: 'Surface Elevated', value: '#FFFFFF', dark_value: '#27272A', usage: 'Modais e popovers', status: 'DEFINED' }),
  text_primary: ColorTokenSchema.default({ name: 'Text Primary', value: '#0F172A', dark_value: '#F8FAFC', usage: 'Texto principal', status: 'DEFINED' }),
  text_secondary: ColorTokenSchema.default({ name: 'Text Secondary', value: '#475569', dark_value: '#94A3B8', usage: 'Texto secundário', status: 'DEFINED' }),
  text_muted: ColorTokenSchema.default({ name: 'Text Muted', value: '#94A3B8', dark_value: '#71717A', usage: 'Legendas e metadados', status: 'DEFINED' }),
  border: ColorTokenSchema.default({ name: 'Border', value: '#E2E8F0', dark_value: '#27272A', usage: 'Bordas e divisores', status: 'DEFINED' }),
  success: ColorTokenSchema.default({ name: 'Success', value: '#10B981', usage: 'Sucesso e confirmações', status: 'DEFINED' }),
  warning: ColorTokenSchema.default({ name: 'Warning', value: '#F59E0B', usage: 'Avisos e pendências', status: 'DEFINED' }),
  error: ColorTokenSchema.default({ name: 'Error', value: '#EF4444', usage: 'Erros e ações destrutivas', status: 'DEFINED' }),
  info: ColorTokenSchema.default({ name: 'Info', value: '#3B82F6', usage: 'Informações neutras', status: 'DEFINED' }),
  custom: z.record(z.string(), ColorTokenSchema).optional(),
});

export const TypographyScaleSpecSchema = z.object({
  display: TypographyTokenSchema.default({ name: 'Display', font_family: 'inherit', size: '48px', weight: 800, line_height: 1.1, status: 'DEFINED' }),
  h1: TypographyTokenSchema.default({ name: 'H1', font_family: 'inherit', size: '36px', weight: 700, line_height: 1.2, status: 'DEFINED' }),
  h2: TypographyTokenSchema.default({ name: 'H2', font_family: 'inherit', size: '28px', weight: 700, line_height: 1.25, status: 'DEFINED' }),
  h3: TypographyTokenSchema.default({ name: 'H3', font_family: 'inherit', size: '22px', weight: 600, line_height: 1.3, status: 'DEFINED' }),
  section_title: TypographyTokenSchema.default({ name: 'Section Title', font_family: 'inherit', size: '20px', weight: 600, line_height: 1.35, status: 'DEFINED' }),
  card_title: TypographyTokenSchema.default({ name: 'Card Title', font_family: 'inherit', size: '18px', weight: 600, line_height: 1.4, status: 'DEFINED' }),
  body: TypographyTokenSchema.default({ name: 'Body', font_family: 'inherit', size: '16px', weight: 400, line_height: 1.5, status: 'DEFINED' }),
  secondary_body: TypographyTokenSchema.default({ name: 'Secondary Body', font_family: 'inherit', size: '14px', weight: 400, line_height: 1.5, status: 'DEFINED' }),
  caption: TypographyTokenSchema.default({ name: 'Caption', font_family: 'inherit', size: '12px', weight: 400, line_height: 1.4, status: 'DEFINED' }),
  label: TypographyTokenSchema.default({ name: 'Label', font_family: 'inherit', size: '13px', weight: 600, line_height: 1.4, status: 'DEFINED' }),
  button: TypographyTokenSchema.default({ name: 'Button', font_family: 'inherit', size: '14px', weight: 600, line_height: 1.2, status: 'DEFINED' }),
  price: TypographyTokenSchema.default({ name: 'Price', font_family: 'inherit', size: '24px', weight: 700, line_height: 1.2, status: 'DEFINED' }),
  metadata: TypographyTokenSchema.default({ name: 'Metadata', font_family: 'inherit', size: '11px', weight: 500, line_height: 1.3, status: 'DEFINED' }),
  custom: z.record(z.string(), TypographyTokenSchema).optional(),
});

export const NormalizedDesignSystemSchema = z.object({
  meta: MetaSpecSchema,
  identity: IdentitySpecSchema.default({ principles: [], brand_personality: [], visual_direction: '', dos: [], donts: [] }),
  colors: ColorPaletteSpecSchema,
  typography: TypographyScaleSpecSchema,
  spacing: SpacingSpecSchema.default({
    base_unit: '4px',
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    section_spacing: '64px',
    container_padding: '16px',
    status: 'DEFINED',
  }),
  radius: RadiusSpecSchema.default({
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',
    status: 'DEFINED',
  }),
  borders: BorderTokenSchema.default({
    width: '1px',
    style: 'solid',
    color_token: 'border',
    status: 'DEFINED',
  }),
  shadows: ShadowTokenSchema.default({
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px -1px rgba(0,0,0,0.1)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.1)',
    status: 'DEFINED',
  }),
  containers: ContainerSpecSchema.default({
    max_width_sm: '640px',
    max_width_md: '768px',
    max_width_lg: '1024px',
    max_width_xl: '1280px',
    status: 'DEFINED',
  }),
  breakpoints: BreakpointSpecSchema.default({
    mobile: '375px',
    tablet: '768px',
    desktop: '1280px',
    status: 'DEFINED',
  }),
  motion: MotionSpecSchema.default({
    duration_fast: '150ms',
    duration_normal: '300ms',
    duration_slow: '500ms',
    easing_default: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    status: 'DEFINED',
  }),
  components: z.record(z.string(), ComponentSpecSchema).default({}),
  patterns: z.record(z.string(), PatternSpecSchema).default({}),
  responsive: ResponsiveSpecSchema.default({
    strategy: 'mobile_first',
    status: 'DEFINED',
  }),
  accessibility: AccessibilitySpecSchema.default({
    wcag_target: 'AA',
    color_contrast_min: '4.5:1',
    keyboard_navigable: true,
    screen_reader_tested: false,
    status: 'DEFINED',
  }),
  raw_markdown: z.string().optional(),
});
