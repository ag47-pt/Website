/**
 * AG47 Labs Skills — Design System Lab Core Types
 * Pure TypeScript contract definitions for deterministic parsing, validation,
 * normalization, mathematical coverage calculation, and isolated showcase rendering.
 */

export type SpecVersion = '1.0' | '1.1';

export type ElementStatus = 'DEFINED' | 'NOT_DEFINED' | 'NOT_APPLICABLE' | 'INHERITED';

export type SupportedThemeMode = 'light' | 'dark' | 'both';

export type PlatformTarget = 'web' | 'mobile' | 'universal';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export type LabTabMode = 'preview' | 'components' | 'spec' | 'audit' | 'runtime';

export type LabState = 'EMPTY' | 'PARSING' | 'INVALID' | 'VALID_WITH_WARNINGS' | 'VALID' | 'RENDERED';

export type Archetype = 'editorial' | 'saas' | 'commerce' | 'fintech' | 'restaurant' | 'service' | 'minimal' | 'generic';
export type Density = 'compact' | 'balanced' | 'spacious';
export type Alignment = 'symmetric' | 'asymmetric';
export type HeroStyle = 'centered' | 'split' | 'editorial' | 'visual';
export type CardStyle = 'flat' | 'bordered' | 'elevated' | 'image_led';
export type SectionFlow = 'linear' | 'alternating' | 'editorial' | 'modular';
export type NavigationStyle = 'minimal' | 'standard' | 'prominent';
export type ImageryWeight = 'none' | 'low' | 'medium' | 'high';
export type DecorativeStyle = 'none' | 'restrained' | 'expressive';

export interface PresentationSpec {
  archetype: Archetype;
  density: Density;
  alignment: Alignment;
  hero_style: HeroStyle;
  card_style: CardStyle;
  section_flow: SectionFlow;
  navigation_style: NavigationStyle;
  imagery_weight: ImageryWeight;
  decorative_style: DecorativeStyle;
  is_fallback?: boolean;
}

export interface DemoContentSpec {
  profile: Archetype;
  brand_name?: string;
  tagline?: string;
  eyebrow?: string;
  headline?: string;
  description?: string;
  cta_primary?: string;
  cta_secondary?: string;
  features_highlight?: { title: string; desc: string; tag?: string }[];
  is_fallback?: boolean;
}

export interface MetaSpec {
  spec_version: SpecVersion;
  name: string;
  version: string;
  platform: PlatformTarget;
  description: string;
  theme: string;
  supported_modes: SupportedThemeMode;
  presentation?: Partial<PresentationSpec>;
  demo_content?: Partial<DemoContentSpec>;
  author?: string;
  last_updated?: string;
}

export interface IdentitySpec {
  principles: string[];
  brand_personality: string[];
  visual_direction: string;
  dos: string[];
  donts: string[];
}

export interface ColorToken {
  name: string;
  value: string;
  dark_value?: string;
  usage: string;
  forbidden_usage?: string;
  status: ElementStatus;
}

export interface ColorPaletteSpec {
  // Brand
  primary: ColorToken;
  secondary: ColorToken;
  accent: ColorToken;
  // Surfaces
  background: ColorToken;
  surface: ColorToken;
  surface_elevated: ColorToken;
  // Text
  text_primary: ColorToken;
  text_secondary: ColorToken;
  text_muted: ColorToken;
  // Borders
  border: ColorToken;
  // Semantics
  success: ColorToken;
  warning: ColorToken;
  error: ColorToken;
  info: ColorToken;
  // Custom tokens (optional)
  custom?: Record<string, ColorToken>;
}

export interface TypographyToken {
  name: string;
  font_family: string;
  size: string;
  mobile_size?: string;
  weight: string | number;
  line_height: string | number;
  tracking?: string;
  style?: string;
  status: ElementStatus;
}

export interface TypographyScaleSpec {
  display: TypographyToken;
  h1: TypographyToken;
  h2: TypographyToken;
  h3: TypographyToken;
  section_title: TypographyToken;
  card_title: TypographyToken;
  body: TypographyToken;
  secondary_body: TypographyToken;
  caption: TypographyToken;
  label: TypographyToken;
  button: TypographyToken;
  price: TypographyToken;
  metadata: TypographyToken;
  custom?: Record<string, TypographyToken>;
}

export interface SpacingSpec {
  base_unit: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  section_spacing: string;
  container_padding: string;
  status: ElementStatus;
}

export interface RadiusSpec {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  full: string;
  status: ElementStatus;
}

export interface BorderToken {
  width: string;
  style: string;
  color_token: string;
  status: ElementStatus;
}

export interface ShadowToken {
  sm: string;
  md: string;
  lg: string;
  focus_ring?: string;
  status: ElementStatus;
}

export interface ContainerSpec {
  max_width_sm: string;
  max_width_md: string;
  max_width_lg: string;
  max_width_xl: string;
  status: ElementStatus;
}

export interface BreakpointSpec {
  mobile: string;
  tablet: string;
  desktop: string;
  wide?: string;
  status: ElementStatus;
}

export interface MotionSpec {
  duration_fast: string;
  duration_normal: string;
  duration_slow: string;
  easing_default: string;
  spring?: string;
  hover_effect?: string;
  entrance_effect?: string;
  modal_effect?: string;
  reduced_motion_rule?: string;
  status: ElementStatus;
}

export interface StateDefinition {
  bg?: string;
  text?: string;
  border?: string;
  shadow?: string;
  opacity?: string;
  transform?: string;
  cursor?: string;
}

export interface ComponentStateMap {
  default: StateDefinition;
  hover?: StateDefinition;
  active?: StateDefinition;
  focus?: StateDefinition;
  disabled?: StateDefinition;
  loading?: StateDefinition;
  selected?: StateDefinition;
  error?: StateDefinition;
  success?: StateDefinition;
  warning?: StateDefinition;
}

export interface ComponentSpec {
  id: string;
  name: string;
  category: 'button' | 'input' | 'selection' | 'feedback' | 'card' | 'navigation' | 'overlay' | 'display';
  status: ElementStatus;
  inherited_from?: string;
  description?: string;
  radius?: string;
  padding?: string;
  font_token?: string;
  states: ComponentStateMap;
  variants?: Record<string, { states: ComponentStateMap }>;
  accessibility?: {
    role?: string;
    aria_label?: string;
    keyboard_navigation?: string;
    contrast_ratio_notes?: string;
  };
}

export interface PatternSpec {
  id: string;
  name: string;
  status: ElementStatus;
  inherited_from?: string;
  description?: string;
  layout_type?: string;
  spacing?: string;
  contained_components?: string[];
  accessibility_notes?: string;
}

export interface ResponsiveSpec {
  strategy: 'mobile_first' | 'desktop_first' | 'fluid';
  mobile_nav_behavior?: string;
  tablet_columns?: number;
  desktop_columns?: number;
  status: ElementStatus;
}

export interface AccessibilitySpec {
  wcag_target: 'A' | 'AA' | 'AAA';
  color_contrast_min: string;
  keyboard_navigable: boolean;
  screen_reader_tested: boolean;
  status: ElementStatus;
}

export interface NormalizedDesignSystem {
  meta: MetaSpec;
  identity: IdentitySpec;
  presentation: PresentationSpec;
  demo_content: DemoContentSpec;
  colors: ColorPaletteSpec;
  typography: TypographyScaleSpec;
  spacing: SpacingSpec;
  radius: RadiusSpec;
  borders: BorderToken;
  shadows: ShadowToken;
  containers: ContainerSpec;
  breakpoints: BreakpointSpec;
  motion: MotionSpec;
  components: Record<string, ComponentSpec>;
  patterns: Record<string, PatternSpec>;
  responsive: ResponsiveSpec;
  accessibility: AccessibilitySpec;
  raw_markdown?: string;
}

export interface CategoryCoverage {
  category: string;
  defined: number;
  inherited: number;
  not_defined: number;
  not_applicable: number;
  total: number;
  effectiveTotal: number;
  percentage: number;
}

export interface CoverageReport {
  overallPercentage: number;
  totalDefined: number;
  totalInherited: number;
  totalNotDefined: number;
  totalNotApplicable: number;
  totalSpecs: number;
  categories: CategoryCoverage[];
}

export interface MissingSpecificationItem {
  section: string;
  elementId: string;
  name: string;
  severity: 'critical' | 'warning' | 'info';
  missingField: string;
  suggestion: string;
}

export interface AuditReport {
  timestamp: string;
  specName: string;
  specVersion: string;
  coverage: CoverageReport;
  missingSpecifications: MissingSpecificationItem[];
  warnings: string[];
  inconsistencies: string[];
  passedTests: number;
  totalTests: number;
}

export interface ValidationErrorItem {
  path: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  version: SpecVersion;
  errors: ValidationErrorItem[];
  warnings: ValidationErrorItem[];
  normalized?: NormalizedDesignSystem;
}
