export type DeckCategory =
  | "Todas"
  | "Startups"
  | "Marketing"
  | "IA"
  | "Produto"
  | "Branding"
  | "Impacto"
  | "Estratégia";

export type DeckStatus =
  | "Todos"
  | "Em destaque"
  | "Mais recentes"
  | "Em desenvolvimento"
  | "Arquivados";

export interface DeckSlide {
  id: number;
  slideNumber: string;
  title: string;
  subtitle: string;
  bullets?: string[];
  contentSnippet: string;
  visualType?: "kpi" | "architecture" | "timeline" | "quote" | "market" | "team";
  highlightMetric?: string;
  highlightLabel?: string;
}

export interface DeckAuthor {
  name: string;
  role: string;
  avatarText: string;
}

export interface DeckCoverStyle {
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  pattern: "geometry" | "neural" | "radar" | "minimal" | "wave" | "isometric" | "orbital" | "grid";
  iconName: string;
  badgeNumber: string;
}

export interface DeckMetric {
  label: string;
  value: string;
  change?: string;
}

export interface PitchDeck {
  id: string;
  slug: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  category: Exclude<DeckCategory, "Todas">;
  status: Exclude<DeckStatus, "Todos">;
  year: string;
  tags: string[];
  author: DeckAuthor;
  featured: boolean;
  gridSpan?: "large" | "medium" | "tall" | "standard";
  readTime: string;
  slideCount: number;
  coverStyle: DeckCoverStyle;
  metrics?: DeckMetric[];
  slides: DeckSlide[];
}
