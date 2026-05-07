// ─── Dominance Monitor Agent ──────────────────────────────────────────────────
// Tracks BTC.D % and the ETH/BTC pair to determine the macro market phase.
// BTC.D is fetched from CoinGecko (Binance doesn't expose it directly).

import { LlmAgent, FunctionTool }   from '@google/adk'
import { z }                         from 'zod'
import { fetchCandles, fetchEthBtcPrice } from '../tools/binance'
import { sma, ema }                  from '../tools/technical-analysis'
import { DOMINANCE_CONFIG, GEMINI_CONFIG } from '../config'
import type { DominanceSnapshot, MarketPhase } from '../types'

// ── CoinGecko BTC Dominance Fetcher ──────────────────────────────────────────

interface CoinGeckoGlobal {
  data: {
    market_cap_percentage: Record<string, number>
    market_cap_change_percentage_24h_usd: number
  }
}

async function fetchBtcDominance(): Promise<{ btcD: number; ethD: number }> {
  const res = await fetch(DOMINANCE_CONFIG.coinGeckoGlobalUrl)
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`)
  const json = (await res.json()) as CoinGeckoGlobal
  const pct  = json.data.market_cap_percentage
  return {
    btcD: pct['btc'] ?? 0,
    ethD: pct['eth'] ?? 0,
  }
}

// ── Core Snapshot Builder ─────────────────────────────────────────────────────

export async function buildDominanceSnapshot(): Promise<DominanceSnapshot> {
  const [{ btcD, ethD }, ethBtcCandles, ethBtcPrice] = await Promise.all([
    fetchBtcDominance(),
    fetchCandles(DOMINANCE_CONFIG.ethBtcSymbol, '1d', DOMINANCE_CONFIG.ethBtcBreakoutSmaLength + 5),
    fetchEthBtcPrice(),
  ])

  // ETH/BTC breakout: current price crosses above its SMA
  const ethBtcCloses = ethBtcCandles.map(c => c.close)
  const smaValues    = sma(ethBtcCloses, DOMINANCE_CONFIG.ethBtcBreakoutSmaLength)
  const latestSma    = smaValues[smaValues.length - 1] ?? ethBtcPrice
  const ethBtcBreakout = ethBtcPrice > latestSma

  // BTC.D trend: compare current vs SMA(3d) of dominance
  // Since we can't get historical BTC.D easily, we infer trend from ETH/BTC momentum
  // and market cap change direction — simplified heuristic using EMA(3) of closes
  const ema3   = ema(ethBtcCloses.slice(-10), 3)
  const emaLast = ema3[ema3.length - 1] ?? ethBtcPrice
  const emaPrev = ema3[ema3.length - 2] ?? emaLast

  // When ETH/BTC EMA is rising → BTC.D is likely falling (capital flowing out of BTC)
  const btcDTrend: DominanceSnapshot['btcDominanceTrend'] =
    emaLast > emaPrev * 1.002 ? 'FALLING' :
    emaLast < emaPrev * 0.998 ? 'RISING'  : 'SIDEWAYS'

  return {
    btcDominance:      btcD,
    ethDominance:      ethD,
    btcDominanceTrend: btcDTrend,
    ethBtcRatio:       ethBtcPrice,
    ethBtcBreakout,
    timestamp:         Date.now(),
  }
}

// ── Market Phase Classifier ───────────────────────────────────────────────────

export function classifyMarketPhase(snap: DominanceSnapshot): MarketPhase {
  const { btcDominanceTrend, ethBtcBreakout, btcDominance } = snap

  // Capital Preservation: BTC.D surging above 55% or in strong uptrend
  if (btcDominance > 55 || btcDominanceTrend === 'RISING') {
    return 'BTC_DOMINANCE'
  }

  // High-Risk ETH Rotation: ETH/BTC breaking out
  if (ethBtcBreakout) {
    return 'ETH_ROTATION'
  }

  // Altseason: BTC.D falling + consolidating
  if (btcDominanceTrend === 'FALLING' && btcDominance < 52) {
    return 'ALTSEASON'
  }

  return 'UNCERTAINTY'
}

// ── ADK FunctionTool: get_market_phase ───────────────────────────────────────
// This tool is exposed to the LLM Decision Hub agent.

export const getMarketPhaseTool = new FunctionTool({
  name:        'get_market_phase',
  description: `
    Fetches the current macro crypto market phase by analysing BTC Dominance (BTC.D)
    and the ETH/BTC pair. Returns one of: BTC_DOMINANCE, ETH_ROTATION, ALTSEASON, UNCERTAINTY.
    Call this first before evaluating any altcoin setup.
  `.trim(),
  parameters: z.object({}),
  execute: async (_params: unknown) => {
    const snap  = await buildDominanceSnapshot()
    const phase = classifyMarketPhase(snap)
    return {
      marketPhase:       phase,
      btcDominance:      snap.btcDominance.toFixed(2) + '%',
      btcDominanceTrend: snap.btcDominanceTrend,
      ethBtcRatio:       snap.ethBtcRatio,
      ethBtcBreakout:    snap.ethBtcBreakout,
      analysisTimestamp: new Date(snap.timestamp).toISOString(),
      recommendation:    phaseRecommendation(phase),
    }
  },
})

function phaseRecommendation(phase: MarketPhase): string {
  switch (phase) {
    case 'BTC_DOMINANCE':
      return 'Capital Preservation Mode: hold BTC/USDC, avoid altcoin exposure.'
    case 'ETH_ROTATION':
      return 'ETH/BTC breakout detected: ETH + large-cap alts (SOL, BNB) are favored.'
    case 'ALTSEASON':
      return 'BTC.D declining: scan mid/small caps for RVOL spikes and momentum setups.'
    case 'UNCERTAINTY':
      return 'Conflicting signals: reduce position sizes, wait for macro confirmation.'
  }
}

// ── Dominance Monitor ADK Agent ───────────────────────────────────────────────

export const dominanceMonitorAgent = new LlmAgent({
  name:        'dominance_monitor',
  description: 'Monitors BTC Dominance and ETH/BTC to classify the macro market phase.',
  model:       GEMINI_CONFIG.model,
  instruction: `
    You are a macro crypto market analyst.
    Your sole responsibility is to assess the current capital rotation phase.
    
    Use the get_market_phase tool to fetch live data.
    Then provide a concise structured report with:
    1. Current phase (BTC_DOMINANCE | ETH_ROTATION | ALTSEASON | UNCERTAINTY)
    2. Key metric that triggered this classification
    3. Recommended risk posture (one sentence)
    4. Warning if BTC is in a "high-volatility crash" state (BTC.D rising fast + broad market down)
    
    Be fact-based. Cite exact numbers. No speculation without data.
  `.trim(),
  tools: [getMarketPhaseTool],
})
