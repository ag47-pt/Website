export type StepType = 'intro' | 'question' | 'dynamic_hint' | 'final'

export interface ChoiceOption {
  id: string
  label: string
  secondaryText?: string
  badge?: string
}

export interface InvitationStep {
  id: string
  stepNumber?: number // for display e.g. 1, 2, 3...
  type: StepType
  category?: string
  prompt: string
  subtext?: string
  options?: ChoiceOption[]
  layout?: 'stacked' | 'grid'
}

export interface WhatsAppConfig {
  phone: string
  primaryCtaLabel: string
  primaryMessage: string
  secondaryCtaLabel: string
  secondaryMessage: string
}

export interface InvitationTheme {
  accentColor: string // e.g. "#BE123C" (deep crimson)
  accentGlow: string
  bgPrimary: string
  cardBg: string
  cardBorder: string
  cardBorderHover: string
  cardBorderActive: string
  textPrimary: string
  textSecondary: string
  textMuted: string
}

export interface InvitationResponses {
  day?: string
  time?: string
  environment?: string
  control?: string
  vibe?: string
  [key: string]: string | undefined
}

export interface DynamicHintRule {
  key: string
  value: string
  hint: string
}

export interface InvitationConfig {
  slug: string
  recipientName: string
  totalQuestionSteps: number
  theme: InvitationTheme
  whatsapp: WhatsAppConfig
  intro: {
    lines: string[]
    ctaLabel: string
  }
  steps: InvitationStep[]
  dynamicHints: DynamicHintRule[]
  final: {
    title: string
    subtitle: string
    subtext: string
  }
}
