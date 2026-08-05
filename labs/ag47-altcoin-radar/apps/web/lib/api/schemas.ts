import { z } from "zod";

export const chainSchema = z.enum(["bsc", "solana", "ethereum"]);
export const providerStatusSchema = z.enum(["active", "degraded", "disabled"]);
export const dataModeSchema = z.enum(["real", "demo"]);
export const dataQualitySchema = z.enum(["high", "medium", "low", "unknown"]);
export const severitySchema = z.enum(["informativo", "atencao", "alto_risco", "critico"]);
export const tokenIdSchema = z.uuid();

const nullableNumber = z.number().finite().nullable();
const recordSchema = z.record(z.string(), z.unknown());
const timestampSchema = z.string().min(1);

export const tokenSchema = z.object({
  id: tokenIdSchema,
  chain: chainSchema,
  contract_address: z.string().min(1),
  symbol: z.string().min(1),
  name: z.string().min(1),
  decimals: z.number().int().nonnegative().nullable(),
  created_at: timestampSchema,
  first_seen_at: timestampSchema,
  metadata: recordSchema.default({}),
  source: z.string().min(1),
  is_demo: z.boolean().default(false),
});

export const pairSchema = z.object({
  id: z.uuid(),
  token_id: tokenIdSchema,
  pair_address: z.string().min(1),
  quote_token: z.string().min(1),
  dex: z.string().min(1),
  created_at: z.string().nullable(),
  first_seen_at: timestampSchema,
  source: z.string().min(1),
  source_url: z.url().nullable(),
  is_demo: z.boolean(),
});

export const marketSchema = z.object({
  id: z.uuid(),
  pair_id: z.uuid(),
  price_usd: nullableNumber,
  liquidity_usd: nullableNumber,
  volume_5m: nullableNumber,
  volume_1h: nullableNumber,
  volume_24h: nullableNumber,
  price_change_5m: nullableNumber,
  price_change_1h: nullableNumber,
  price_change_24h: nullableNumber,
  market_cap: nullableNumber,
  fdv: nullableNumber,
  buyers: z.number().int().nonnegative().nullable(),
  sellers: z.number().int().nonnegative().nullable(),
  captured_at: timestampSchema,
  source: z.string().min(1),
  data_quality: dataQualitySchema,
  is_demo: z.boolean().default(false),
});

export const scoreSchema = z.object({
  id: z.uuid(),
  token_id: tokenIdSchema,
  momentum_score: z.number().finite(),
  liquidity_score: z.number().finite(),
  community_score: z.number().finite(),
  distribution_score: z.number().finite(),
  safety_score: z.number().finite(),
  data_quality_score: z.number().finite(),
  final_score: z.number().finite(),
  classification: z.enum(["oportunidade_forte", "observar", "especulativo", "risco_elevado"]),
  confidence: z.number().finite(),
  signals_available: z.number().int().nonnegative(),
  explanation: z.string().min(1),
  positive_factors: z.array(z.string()),
  negative_factors: z.array(z.string()),
  critical_gate_applied: z.boolean(),
  calculated_at: timestampSchema,
  scoring_version: z.string().min(1),
  is_demo: z.boolean(),
});

export const riskSummarySchema = z.object({
  risk_score: z.number().finite(),
  critical_flags: z.array(z.string()).default([]),
  captured_at: timestampSchema,
  source: z.string().min(1),
  data_quality: dataQualitySchema,
  is_demo: z.boolean().default(false),
});

export const riskSchema = riskSummarySchema.extend({
  id: z.uuid(),
  token_id: tokenIdSchema,
  liquidity_lock_status: z.enum(["locked", "unlocked", "unknown"]),
  top_holders_percentage: nullableNumber,
  deployer_percentage: nullableNumber,
  owner_privileges: z.string().nullable(),
  mintable: z.boolean().nullable(),
  blacklist_capability: z.boolean().nullable(),
  holders_count: z.number().int().nonnegative().nullable(),
  can_change_tax: z.boolean().nullable(),
  buy_tax: nullableNumber,
  sell_tax: nullableNumber,
  proxy_contract: z.boolean().nullable(),
  contract_age_days: z.number().int().nonnegative().nullable(),
  honeypot_status: z.string().nullable(),
  flags: z
    .array(
      z.object({
        code: z.string().min(1),
        label: z.string().min(1),
        level: z.enum(["informativo", "atencao", "alto_risco", "critico", "desconhecido"]),
        description: z.string().nullable(),
      }),
    )
    .default([]),
});

export const socialSchema = z.object({
  id: z.uuid(),
  token_id: tokenIdSchema,
  platform: z.string().min(1),
  members: z.number().int().nonnegative().nullable(),
  member_growth_1h: nullableNumber,
  member_growth_24h: nullableNumber,
  messages_per_minute: nullableNumber,
  unique_authors: z.number().int().nonnegative().nullable(),
  participation_rate: nullableNumber,
  engagement_rate: nullableNumber,
  repetition_rate: nullableNumber,
  estimated_bot_ratio: nullableNumber,
  team_activity: z.string().nullable(),
  captured_at: timestampSchema,
  source: z.string().min(1),
  data_quality: dataQualitySchema,
  is_demo: z.boolean().default(false),
});

export const opportunitySchema = z.object({
  token: tokenSchema,
  pair: pairSchema,
  market: marketSchema.nullable(),
  risk: riskSummarySchema.nullable(),
  score: scoreSchema.nullable(),
  holders_count: z.number().int().nonnegative().nullable(),
  watchlisted: z.boolean(),
  updated_at: z.string(),
});

export const paginatedSchema = <T extends z.ZodType>(item: T) =>
  z.object({
    items: z.array(item),
    page: z.number().int().positive(),
    page_size: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    pages: z.number().int().nonnegative(),
    demo_mode: z.boolean(),
    partial: z.boolean(),
    stale: z.boolean(),
  });

export const opportunitiesResponseSchema = paginatedSchema(opportunitySchema);

export const providerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  kind: z.string().min(1),
  status: providerStatusSchema,
  mode: z.enum(["real", "demo"]),
  last_checked_at: z.string().nullable(),
  detail: z.string().nullable(),
});

export const evolutionStatusSchema = z.object({
  phase: z.string().min(1),
  phase_title: z.string().min(1),
  now: z.string().min(1),
  completed_steps: z.number().int().nonnegative(),
  total_steps: z.number().int().positive(),
  goal: z.string().min(1),
});

export const systemStatusSchema = z.object({
  status: z.enum(["operational", "degraded"]),
  demo_mode: z.boolean(),
  monitoring_active: z.boolean(),
  read_only: z.boolean(),
  database: z.string().min(1),
  last_sync_at: z.string().nullable(),
  generated_at: z.string(),
  metrics: z.object({
    tokens_monitored: z.number().int().nonnegative(),
    alerts_today: z.number().int().nonnegative(),
    strong_opportunities: z.number().int().nonnegative(),
    average_score: nullableNumber,
    active_providers: z.number().int().nonnegative(),
  }),
  providers: z.array(providerSchema),
});

export const tokenDetailSchema = z.object({
  token: tokenSchema,
  pairs: z.array(pairSchema),
  latest_market: marketSchema.nullable(),
  latest_social: socialSchema.nullable(),
  latest_risk: riskSchema.nullable(),
  latest_score: scoreSchema.nullable(),
  watchlisted: z.boolean(),
  data_mode: dataModeSchema,
});

export const marketPointSchema = z.object({
  captured_at: z.string(),
  price_usd: nullableNumber,
  volume_usd: nullableNumber,
  liquidity_usd: nullableNumber,
  source: z.string().min(1),
  data_quality: dataQualitySchema,
});

export const marketHistorySchema = z.object({
  token_id: tokenIdSchema,
  pair_id: z.uuid().nullable(),
  interval: z.enum(["1h", "6h", "24h", "7d", "30d"]),
  points: z.array(marketPointSchema),
  demo_mode: z.boolean(),
});

export const socialResponseSchema = z.object({
  token_id: tokenIdSchema,
  latest: socialSchema.nullable(),
  timeline: z.array(socialSchema),
  demo_mode: z.boolean(),
});

export const alertSchema = z.object({
  id: z.string().min(1),
  rule_id: z.string().min(1),
  token_id: tokenIdSchema,
  token_symbol: z.string().min(1),
  source_kind: z.enum(["event", "signal"]),
  source_id: z.string().min(1),
  severity: nullableNumber,
  confidence: nullableNumber,
  status: z.enum(["unread", "read", "acknowledged", "dismissed"]),
  triggered_at: z.string(),
  read_at: z.string().nullable(),
  acknowledged_at: z.string().nullable(),
  dismissed_at: z.string().nullable(),
  deduplication_key: z.string().min(1),
  is_demo: z.boolean(),
});

export const alertsResponseSchema = paginatedSchema(alertSchema);

export const timelineItemBaseSchema = z.object({
  id: z.string(),
  type: z.string(),
  occurred_at: z.string(),
  title: z.string(),
  description: z.string(),
  rule_version: z.string(),
  caused_by: z.array(z.string()),
});

export const timelineEventSchema = timelineItemBaseSchema.extend({
  kind: z.literal("event"),
  severity: nullableNumber.optional(),
  strength: nullableNumber.optional(),
  confidence: nullableNumber.optional(),
});

export const timelineSignalSchema = timelineItemBaseSchema.extend({
  kind: z.literal("signal"),
  strength: z.number().finite(),
  confidence: z.number().finite(),
});

export const timelineItemSchema = z.discriminatedUnion("kind", [
  timelineEventSchema,
  timelineSignalSchema,
]);

export const timelineResponseSchema = paginatedSchema(timelineItemSchema);

export const watchlistItemSchema = z.object({
  id: z.uuid(),
  token_id: tokenIdSchema,
  notes: z.string().nullable(),
  created_at: z.string(),
  token: tokenSchema,
  latest_score: scoreSchema.nullable(),
  latest_market: marketSchema.nullable(),
});

export const watchlistResponseSchema = paginatedSchema(watchlistItemSchema);

export type Chain = z.infer<typeof chainSchema>;
export type TokenId = z.infer<typeof tokenIdSchema>;
export type Opportunity = z.infer<typeof opportunitySchema>;
export type SystemStatus = z.infer<typeof systemStatusSchema>;
export type EvolutionStatus = z.infer<typeof evolutionStatusSchema>;
export type TokenDetail = z.infer<typeof tokenDetailSchema>;
export type MarketHistory = z.infer<typeof marketHistorySchema>;
export type SocialResponse = z.infer<typeof socialResponseSchema>;
export type Risk = z.infer<typeof riskSchema>;
export type Score = z.infer<typeof scoreSchema>;
export type Alert = z.infer<typeof alertSchema>;
export type WatchlistItem = z.infer<typeof watchlistItemSchema>;
export type TimelineItem = z.infer<typeof timelineItemSchema>;
export type TimelineEvent = z.infer<typeof timelineEventSchema>;
export type TimelineSignal = z.infer<typeof timelineSignalSchema>;

export interface OpportunityFilters {
  q?: string;
  chains?: Chain[];
  minScore?: number;
  maxRisk?: number;
  maxPairAgeHours?: number;
  minLiquidity?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}
