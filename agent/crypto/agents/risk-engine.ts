// ─── Risk Engine Agent ────────────────────────────────────────────────────────
// Kelly Criterion position sizing with hard 1.5% max-risk cap.
// Outputs precise entry, stop-loss, take-profit, and invalidation levels.

import { LlmAgent, FunctionTool } from '@google/adk'
import { z }                      from 'zod'
import { fearGreedRiskMultiplier } from '../tools/fear-greed'
import {
  DEFAULT_RISK_PARAMS,
  KELLY_FRACTION_MULTIPLIER,
  GEMINI_CONFIG,
} from '../config'
import type { PositionSizing, RiskParameters } from '../types'

// ── Kelly Criterion ───────────────────────────────────────────────────────────

/**
 * Full Kelly fraction:
 *   f* = W/L − (1 − W)/G
 *
 * Where:
 *   W  = win rate (probability)
 *   L  = average loss (as a fraction of bet)
 *   G  = average gain (as a fraction of bet)
 *
 * We apply a half-Kelly multiplier and a hard 1.5% cap for safety.
 */
export function kellyFraction(params: RiskParameters): number {
  const { winRate, avgWin, avgLoss } = params
  const lossRate = 1 - winRate

  const rawKelly = (winRate / avgLoss) - (lossRate / avgWin)

  // Half-Kelly to reduce variance
  const halfKelly = Math.max(0, rawKelly * KELLY_FRACTION_MULTIPLIER)

  // Hard cap at maxRiskPerTrade (1.5%)
  return Math.min(halfKelly, params.maxRiskPerTrade)
}

// ── Position Sizing ───────────────────────────────────────────────────────────

/**
 * Given entry price and the support level (which acts as stop-loss),
 * compute the full position sizing plan.
 *
 * Stop-loss is placed 0.5% below support to avoid premature triggers.
 */
export function computePositionSizing(
  symbol:           string,
  entryPrice:       number,
  supportLevel:     number,
  fearGreedValue:   number,
  params:           RiskParameters = DEFAULT_RISK_PARAMS,
): PositionSizing {
  const fraction       = kellyFraction(params)
  const fgMultiplier   = fearGreedRiskMultiplier(fearGreedValue)
  const adjustedFraction = Math.min(fraction * fgMultiplier, params.maxRiskPerTrade)

  // Stop-loss: 0.5% below nearest support (Order Block)
  const stopLoss = supportLevel * 0.995

  // Risk per unit = entry - stop
  const riskPerUnit = entryPrice - stopLoss
  if (riskPerUnit <= 0) {
    throw new Error(`Invalid risk: entry (${entryPrice}) is below stop-loss (${stopLoss}) for ${symbol}`)
  }

  // Max $ risk allowed
  const maxRiskUSDC    = params.accountBalance * adjustedFraction
  // Number of units to buy
  const units          = maxRiskUSDC / riskPerUnit
  // Total position in USDC
  const positionSizeUSDC = units * entryPrice

  // Take-profit levels (1:2 and 1:3 Risk:Reward)
  const takeProfit1 = entryPrice + riskPerUnit * 2
  const takeProfit2 = entryPrice + riskPerUnit * 3

  return {
    symbol,
    kellyFraction:      fraction,
    cappedFraction:     adjustedFraction,
    positionSizeUSDC:   Math.round(positionSizeUSDC * 100) / 100,
    entryPrice,
    stopLoss:           Math.round(stopLoss * 1e8) / 1e8,
    takeProfit1:        Math.round(takeProfit1 * 1e8) / 1e8,
    takeProfit2:        Math.round(takeProfit2 * 1e8) / 1e8,
    invalidationLevel:  stopLoss,
  }
}

// ── ADK FunctionTool: compute_position_size ───────────────────────────────────

interface ComputePositionParams {
  symbol:         string
  entryPrice:     number
  supportLevel:   number
  fearGreedValue: number
  accountBalance: number
}

export const computePositionTool = new FunctionTool({
  name: 'compute_position_size',
  description: `
    Computes Kelly Criterion position sizing for a crypto trade with a 1.5% hard max-risk cap.
    Accounts for Fear & Greed Index as a sentiment multiplier.
    Returns entry, stop-loss, take-profit levels, and USDC position size.
  `.trim(),
  parameters: z.object({
    symbol:         z.string().describe('Trading pair, e.g. SOLUSDT'),
    entryPrice:     z.number().describe('Planned entry price'),
    supportLevel:   z.number().describe('Nearest support / Order Block bid price'),
    fearGreedValue: z.number().describe('Fear & Greed Index value (0–100)'),
    accountBalance: z.number().describe('Total USDC account balance'),
  }),
  execute: async (params) => {
    const {
      symbol,
      entryPrice,
      supportLevel,
      fearGreedValue,
      accountBalance,
    } = params

    const riskParams: RiskParameters = {
      ...DEFAULT_RISK_PARAMS,
      accountBalance,
    }

    const sizing = computePositionSizing(
      symbol,
      entryPrice,
      supportLevel,
      fearGreedValue,
      riskParams,
    )

    const riskAmount = sizing.positionSizeUSDC * (sizing.entryPrice - sizing.stopLoss) / sizing.entryPrice

    return {
      symbol:            sizing.symbol,
      entryPrice:        sizing.entryPrice,
      stopLoss:          sizing.stopLoss,
      takeProfit1:       sizing.takeProfit1,
      takeProfit2:       sizing.takeProfit2,
      invalidationLevel: sizing.invalidationLevel,
      positionSizeUSDC:  sizing.positionSizeUSDC,
      riskUSDC:          Math.round(riskAmount * 100) / 100,
      riskPercent:       (sizing.cappedFraction * 100).toFixed(2) + '%',
      kellyFractionRaw:  (sizing.kellyFraction * 100).toFixed(2) + '%',
      rewardToRisk_TP1:  '2:1',
      rewardToRisk_TP2:  '3:1',
      fearGreedAdjusted: fearGreedValue,
      note: sizing.cappedFraction === DEFAULT_RISK_PARAMS.maxRiskPerTrade
        ? 'Kelly exceeded 1.5% cap — position sized at hard maximum.'
        : 'Position sized within Kelly bounds.',
    }
  },
})

// ── Risk Engine ADK Agent ─────────────────────────────────────────────────────

export const riskEngineAgent = new LlmAgent({
  name:        'risk_engine',
  description: 'Computes Kelly Criterion position sizing and manages stop-loss / take-profit levels.',
  model:       GEMINI_CONFIG.model,
  instruction: `
    You are a quantitative risk manager for a crypto trading system.
    
    Responsibilities:
    1. Use compute_position_size to calculate the exact position for each candidate.
    2. Always apply the 1.5% maximum risk rule — never override it.
    3. For each computed position, present:
    
       POSITION PLAN — [SYMBOL]
       ├─ Entry:        [price] (limit order at Order Block bid)
       ├─ Stop-Loss:    [price] ([N]% below support)
       ├─ Take-Profit 1: [price] (2:1 R/R — close 60% here)
       ├─ Take-Profit 2: [price] (3:1 R/R — close remaining 40%)
       ├─ Position Size: [USDC] ([N]% of account)
       ├─ Max Risk:      [USDC] (≤1.5% of account)
       └─ Invalidation:  Close 4H candle below [price]
    
    4. If Fear & Greed Index is in "Extreme Greed" (>80), explicitly warn:
       "⚠ FOMO ENVIRONMENT — Reduce position size by 25% from the computed value."
    
    5. Never suggest a trade if positionSizeUSDC is less than $10 (below practical execution threshold).
    
    You do not evaluate trade quality — that is the Decision Hub's role.
    You only output precise numbers.
  `.trim(),
  tools: [computePositionTool],
})
