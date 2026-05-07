// ─── Fear & Greed Index Tool ──────────────────────────────────────────────────

import type { FearGreedData } from '../types'
import { FEAR_GREED_URL } from '../config'

interface FearGreedApiResponse {
  data: Array<{
    value:               string
    value_classification: string
    timestamp:           string
  }>
}

let _cache: { data: FearGreedData; fetchedAt: number } | null = null
const CACHE_TTL = 60 * 60 * 1000  // 1 hour — index updates once/day

/**
 * Fetches the current Crypto Fear & Greed Index from alternative.me.
 * Results are cached for 1 hour to avoid hammering the free API.
 */
export async function fetchFearGreedIndex(): Promise<FearGreedData> {
  if (_cache && Date.now() - _cache.fetchedAt < CACHE_TTL) {
    return _cache.data
  }

  const res = await fetch(FEAR_GREED_URL)
  if (!res.ok) {
    throw new Error(`Fear & Greed API error: ${res.status} ${res.statusText}`)
  }

  const json = (await res.json()) as FearGreedApiResponse
  const entry = json.data[0]
  if (!entry) throw new Error('Fear & Greed API returned empty data')

  const data: FearGreedData = {
    value:     parseInt(entry.value, 10),
    label:     entry.value_classification,
    timestamp: entry.timestamp,
  }

  _cache = { data, fetchedAt: Date.now() }
  return data
}

/**
 * Interprets the Fear & Greed Index in the context of the rotation strategy.
 * Returns a risk multiplier (0.5 – 1.25) to adjust position sizing.
 */
export function fearGreedRiskMultiplier(value: number): number {
  if (value <= 20) return 0.50   // Extreme Fear → reduce size (but potential reversal)
  if (value <= 40) return 0.75   // Fear → cautious
  if (value <= 60) return 1.00   // Neutral → base size
  if (value <= 80) return 1.15   // Greed → slightly increase (momentum)
  return 1.25                    // Extreme Greed → max momentum, but watch for top
}

/**
 * Returns a human-readable macro comment for the LLM context.
 */
export function fearGreedMacroComment(data: FearGreedData): string {
  const v = data.value
  if (v <= 20) return `Extreme Fear (${v}) — market is historically oversold. Contrarian opportunity window, but wait for BTC.D confirmation.`
  if (v <= 40) return `Fear (${v}) — risk appetite is suppressed. Prefer high-conviction setups only.`
  if (v <= 60) return `Neutral (${v}) — balanced market. Rotation plays viable if BTC.D confirms.`
  if (v <= 80) return `Greed (${v}) — momentum is strong. Altcoin rotation favorable but watch for exhaustion signals.`
  return `Extreme Greed (${v}) — FOMO environment. Tighten stops, reduce leverage, prioritize exits over entries.`
}
