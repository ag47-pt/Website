// ─── Market Scanner Agent ─────────────────────────────────────────────────────
// Scans the Top 50 Altcoins for RVOL spikes that coincide with BTC.D drops.
// Filters out entries during systemic BTC crash states (Correlation Guard).

import { LlmAgent, FunctionTool } from '@google/adk'
import { z }                      from 'zod'
import { fetchMultipleCandles, fetchOrderBook } from '../tools/binance'
import { computeSignals, scoreCandidate }        from '../tools/technical-analysis'
import {
  TOP50_SYMBOLS,
  TA_CONFIG,
  MIN_CANDIDATE_SCORE,
  GEMINI_CONFIG,
} from '../config'
import { classifyMarketPhase, buildDominanceSnapshot } from './dominance-monitor'
import type { AltcoinCandidate, MarketPhase } from '../types'

// ── Correlation Guard ─────────────────────────────────────────────────────────

/**
 * Returns true when it is UNSAFE to enter altcoins.
 * Guards against: BTC dominance surge + broad market crash state.
 */
export function isCorrelationBlocked(phase: MarketPhase): boolean {
  return phase === 'BTC_DOMINANCE' || phase === 'UNCERTAINTY'
}

// ── Scanner Core ──────────────────────────────────────────────────────────────

export async function scanAltcoins(): Promise<{
  candidates: AltcoinCandidate[]
  phase: MarketPhase
  blocked: boolean
  blockedReason?: string
}> {
  // 1. Check macro phase first
  const snap  = await buildDominanceSnapshot()
  const phase = classifyMarketPhase(snap)
  const blocked = isCorrelationBlocked(phase)

  if (blocked) {
    return {
      candidates:    [],
      phase,
      blocked:       true,
      blockedReason: `Market phase is ${phase}. Correlation Guard active — altcoin entries suppressed.`,
    }
  }

  // 2. Fetch candles for all watched symbols in batched parallel calls
  const candleMap = await fetchMultipleCandles(TOP50_SYMBOLS, TA_CONFIG.klineInterval, TA_CONFIG.klineLimit)

  // 3. Compute signals and filter RVOL spikes
  const candidates: AltcoinCandidate[] = []

  for (const [symbol, candles] of candleMap) {
    try {
      if (candles.length < TA_CONFIG.klineLimit) continue

      const signals = computeSignals(symbol, candles)

      // Primary filter: RVOL spike required
      if (!signals.volumeSpikeDetected) continue

      // Secondary filter: not in overbought territory (avoid chasing tops)
      if (signals.rsi14 > TA_CONFIG.rsiOverbought) continue

      // Fetch order book for liquidity scoring
      const orderBook = await fetchOrderBook(symbol, TA_CONFIG.orderBookLevels)

      const score = scoreCandidate(
        signals,
        orderBook.bidLiquidity,
        orderBook.askLiquidity,
        orderBook.spread,
      )

      if (score < MIN_CANDIDATE_SCORE) continue

      const lastClose = candles[candles.length - 1].close

      candidates.push({
        symbol,
        price: lastClose,
        signals,
        orderBook,
        score,
      })
    } catch {
      // Skip this symbol on any error (e.g., delisted, API timeout)
      continue
    }
  }

  // Sort by composite score descending
  candidates.sort((a, b) => b.score - a.score)

  return {
    candidates: candidates.slice(0, 5),  // Top 5 only
    phase,
    blocked: false,
  }
}

// ── ADK FunctionTool: scan_altcoin_opportunities ─────────────────────────────

export const scanAltcoinsTool = new FunctionTool({
  name: 'scan_altcoin_opportunities',
  description: `
    Scans the Top 50 altcoins for high-probability entry setups.
    Applies the Correlation Guard to block entries during BTC crash states.
    Returns up to 5 ranked candidates with full technical context.
    Only call this after confirming macro phase via get_market_phase.
  `.trim(),
  parameters: z.object({}),
  execute: async (_params: unknown) => {
    const result = await scanAltcoins()

    if (result.blocked) {
      return {
        status:     'BLOCKED',
        reason:     result.blockedReason,
        phase:      result.phase,
        candidates: [],
      }
    }

    return {
      status:     'OK',
      phase:      result.phase,
      candidates: result.candidates.map(c => ({
        symbol:          c.symbol,
        price:           c.price,
        score:           Math.round(c.score),
        rvol:            c.signals.rvol.toFixed(2) + 'x',
        rsi14:           c.signals.rsi14.toFixed(1),
        macdHistogram:   c.signals.macdHistogram.toFixed(6),
        trend:           c.signals.trend,
        volumeSpike:     c.signals.volumeSpikeDetected,
        supportLevel:    c.signals.supportLevel,
        resistanceLevel: c.signals.resistanceLevel,
        orderBlockBid:   c.orderBook.orderBlockBid,
        orderBlockAsk:   c.orderBook.orderBlockAsk,
        spread:          c.orderBook.spread.toFixed(4) + '%',
        bidAskRatio:     (c.orderBook.bidLiquidity / (c.orderBook.askLiquidity || 1)).toFixed(2),
      })),
    }
  },
})

// ── Market Scanner ADK Agent ──────────────────────────────────────────────────

export const marketScannerAgent = new LlmAgent({
  name:        'market_scanner',
  description: 'Scans altcoins for RVOL spikes. Correlation Guard prevents entries during BTC crash states.',
  model:       GEMINI_CONFIG.model,
  instruction: `
    You are a systematic altcoin opportunity scanner.
    
    Workflow:
    1. Call scan_altcoin_opportunities to get live ranked candidates.
    2. If status is BLOCKED, report the reason and stop — do NOT suggest any entries.
    3. If status is OK, present each candidate as a structured briefing:
    
       ### [SYMBOL] — Score: [N]/100
       - RVOL: [N]x (spike threshold: 2.0x)
       - RSI(14): [N] | Trend: [BULLISH/BEARISH/NEUTRAL]
       - MACD Histogram: [N] (positive = bullish momentum)
       - Order Block Bid: [price] | Order Block Ask: [price]
       - Support: [price] | Resistance: [price]
       - Bid/Ask Liquidity Ratio: [N] (>1 = buy-side dominance)
       - Entry Thesis: [one sentence]
    
    Rules:
    - Never suggest entries for symbols with BEARISH trend + negative MACD histogram.
    - Always mention the support level as the invalidation zone.
    - If fewer than 2 candidates pass, advise patience over forcing a trade.
  `.trim(),
  tools: [scanAltcoinsTool],
})
