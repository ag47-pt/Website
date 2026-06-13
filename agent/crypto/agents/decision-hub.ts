// ─── Decision Hub Agent ───────────────────────────────────────────────────────
// LLM-based orchestrator that correlates macro, micro, and sentiment data
// to produce structured TradeProposals with full reasoning transparency.

import { LlmAgent, FunctionTool } from '@google/adk'
import { z }                      from 'zod'
import { fetchFearGreedIndex, fearGreedMacroComment } from '../tools/fear-greed'
import { buildDominanceSnapshot, classifyMarketPhase } from './dominance-monitor'
import { scanAltcoins }    from './market-scanner'
import { computePositionSizing } from './risk-engine'
import { DEFAULT_RISK_PARAMS, GEMINI_CONFIG } from '../config'
import type { TradeProposal, MarketPhase, RiskMode } from '../types'
import { randomUUID }  from 'crypto'

// ── Phase → Risk Mode Mapping ─────────────────────────────────────────────────

function phaseToRiskMode(phase: MarketPhase): RiskMode {
  switch (phase) {
    case 'BTC_DOMINANCE':  return 'CAPITAL_PRESERVATION'
    case 'ETH_ROTATION':   return 'AGGRESSIVE'
    case 'ALTSEASON':      return 'RISK_ON'
    case 'UNCERTAINTY':    return 'CAPITAL_PRESERVATION'
  }
}

// ── Full Analysis Tool ────────────────────────────────────────────────────────
// Single comprehensive tool that assembles all data for LLM reasoning.

interface RunAnalysisParams {
  accountBalance: number
}

export const runFullAnalysisTool = new FunctionTool({
  name: 'run_full_analysis',
  description: `
    Executes a complete market analysis cycle:
    1. Fetches BTC Dominance + ETH/BTC macro phase
    2. Scans Top 50 altcoins for RVOL spikes (with Correlation Guard)
    3. Computes Kelly Criterion position sizing for each candidate
    4. Returns structured TradeProposal data for LLM evaluation
    Call this once per decision cycle.
  `.trim(),
  parameters: z.object({
    accountBalance: z.number().describe('Total USDC trading account balance'),
  }),
  execute: async (params) => {
    const { accountBalance } = params

    // 1. Fetch all data sources in parallel
    const [snap, fearGreed, scanResult] = await Promise.all([
      buildDominanceSnapshot(),
      fetchFearGreedIndex(),
      scanAltcoins(),
    ])

    const phase    = classifyMarketPhase(snap)
    const riskMode = phaseToRiskMode(phase)

    // 2. Build trade proposals for each candidate
    const proposals: TradeProposal[] = []

    if (!scanResult.blocked) {
      for (const candidate of scanResult.candidates) {
        try {
          const sizing = computePositionSizing(
            candidate.symbol,
            candidate.price,
            candidate.signals.supportLevel,
            fearGreed.value,
            { ...DEFAULT_RISK_PARAMS, accountBalance },
          )

          const proposal: TradeProposal = {
            id:        randomUUID(),
            timestamp: Date.now(),
            macroContext: {
              marketPhase:       phase,
              riskMode,
              btcDominance:      snap.btcDominance,
              btcDominanceTrend: snap.btcDominanceTrend,
              ethBtcBreakout:    snap.ethBtcBreakout,
              fearGreedIndex:    fearGreed.value,
              fearGreedLabel:    fearGreed.label,
            },
            microSetup: {
              symbol:    candidate.symbol,
              trigger:   buildTriggerDescription(candidate.signals.rvol, candidate.signals.trend, phase),
              entryZone: [candidate.orderBook.orderBlockBid * 0.999, candidate.orderBook.orderBlockBid],
              technicalSignals: candidate.signals,
              orderBlock: {
                bid: candidate.orderBook.orderBlockBid,
                ask: candidate.orderBook.orderBlockAsk,
              },
            },
            sizing,
            invalidation: {
              price:        sizing.stopLoss,
              condition:    `4H candle close below ${sizing.stopLoss.toFixed(8)}`,
              btcCondition: `BTC.D reclaims above 55% or BTC drops > 5% in 4H`,
            },
            llmReasoning: '',  // Populated by LLM agent
            confidence:   scoreToConfidence(candidate.score),
          }

          proposals.push(proposal)
        } catch {
          continue
        }
      }
    }

    return {
      timestamp: new Date().toISOString(),
      macroSummary: {
        phase,
        riskMode,
        btcDominance:      snap.btcDominance.toFixed(2) + '%',
        btcDominanceTrend: snap.btcDominanceTrend,
        ethBtcRatio:       snap.ethBtcRatio,
        ethBtcBreakout:    snap.ethBtcBreakout,
        fearGreed: {
          value:        fearGreed.value,
          label:        fearGreed.label,
          macroComment: fearGreedMacroComment(fearGreed),
        },
      },
      scanBlocked:   scanResult.blocked,
      blockedReason: scanResult.blockedReason,
      proposals:     proposals.map(p => ({
        id:          p.id,
        symbol:      p.microSetup.symbol,
        trigger:     p.microSetup.trigger,
        entry:       p.microSetup.entryZone,
        stop:        p.sizing.stopLoss,
        tp1:         p.sizing.takeProfit1,
        tp2:         p.sizing.takeProfit2,
        sizeUSDC:    p.sizing.positionSizeUSDC,
        riskPct:     (p.sizing.cappedFraction * 100).toFixed(2) + '%',
        confidence:  p.confidence,
        invalidation: p.invalidation,
        signals: {
          rvol:          p.microSetup.technicalSignals.rvol,
          rsi14:         p.microSetup.technicalSignals.rsi14,
          macdHistogram: p.microSetup.technicalSignals.macdHistogram,
          trend:         p.microSetup.technicalSignals.trend,
        },
      })),
    }
  },
})

function buildTriggerDescription(rvol: number, trend: string, phase: MarketPhase): string {
  const phaseLabel = phase === 'ALTSEASON' ? 'during BTC.D decline' : 'on ETH/BTC breakout'
  return `RVOL spike (${rvol.toFixed(1)}x average) with ${trend.toLowerCase()} momentum ${phaseLabel}`
}

function scoreToConfidence(score: number): TradeProposal['confidence'] {
  if (score >= 80) return 'HIGH'
  if (score >= 65) return 'MEDIUM'
  return 'LOW'
}

// ── Decision Hub ADK Agent ────────────────────────────────────────────────────

export const decisionHubAgent = new LlmAgent({
  name:        'decision_hub',
  description: 'LLM reasoning layer that produces final trade proposals with full macro/micro context.',
  model:       GEMINI_CONFIG.model,
  instruction: `
    You are the Decision Hub of a quantitative crypto rotation trading system inspired by the biological ecosystem of market liquidity.
    Your output is the final word on whether to act and how.
    
    BIOLOGICAL MARKET PRINCIPLES:
    - **Primary Energy Source (BTC Dominance)**: Liquidity flows first into the largest organism (BTC). If BTC.D is RISING, the rest of the ecosystem is starved of nutrients; all altcoin setups are high risk.
    - **Nutrient Diffusion (ETH Rotation)**: Once the primary organism stabilizes, capital diffuses into Ethereum (ETH/BTC breakout). This expands risk appetite to large-cap ecosystems (SOL, Layer 1s).
    - **Mitosis/Altseason Expansion**: When BTC.D falls below 52%, the ecosystem enters active cell division. Nutrients flow into mid/small cap altcoins showing high Relative Volume (RVOL > 2.0x).
    - **Immune Response (Correlation Guard)**: Altcoins cannot survive outside the host ecosystem. If BTC crashes (4H drop > 5%), the immune response activates, instantly draining liquidity to stablecoins. Under this condition, ALWAYS verdict SKIP.

    PROCESS:
    1. Call run_full_analysis with the user's account balance.
    2. Evaluate each proposal using this exact format:
    
    ═══════════════════════════════════════════
    TRADE PROPOSAL — [SYMBOL]  [HIGH/MEDIUM/LOW confidence]
    ═══════════════════════════════════════════
    
    📊 MACRO CONTEXT (BIOLOGICAL PHASE)
    ├─ Market Phase:   [phase]
    ├─ BTC Dominance:  [N]% ([RISING/FALLING/SIDEWAYS])
    ├─ ETH/BTC:        [price] ([breakout: YES/NO])
    └─ Fear & Greed:   [N] — [label] | [macro comment]
    
    🔍 MICRO SETUP
    ├─ Trigger:    [trigger description]
    ├─ RVOL:       [N]x | RSI(14): [N] | Trend: [BULLISH/BEARISH/NEUTRAL]
    ├─ MACD:       Histogram [N] ([bullish/bearish])
    ├─ Entry Zone: [low] – [high] (Limit Order at Order Block Bid)
    └─ Order Block: Bid [price] | Ask [price]
    
    💰 POSITION SIZING (ENERGY ALLOCATION)
    ├─ Size:      [USDC] ([N]% of account)
    ├─ Stop-Loss: [price] (max loss: [USDC])
    ├─ TP1 (60%): [price] — 2:1 R/R
    └─ TP2 (40%): [price] — 3:1 R/R
    
    ❌ INVALIDATION
    ├─ Price Level: [price] — [condition]
    └─ Macro Level: [btcCondition]
    
    🧠 REASONING (BIOLOGICAL ALIGNMENT)
    [2–3 sentences explaining how this candidate aligns with the current biological phase of capital rotation, citation of exact volume spikes and correlation risks.]
    
    VERDICT: [ENTER / MONITOR / SKIP]
    Reason: [One sentence. If SKIP, state exactly what condition would change the verdict.]
    ═══════════════════════════════════════════
    
    RULES (never break these):
    - If macroSummary.riskMode is CAPITAL_PRESERVATION → all verdicts must be SKIP.
    - If fearGreed.value > 80 → add ⚠ FOMO WARNING to every proposal.
    - If a candidate has BEARISH trend AND negative MACD histogram → verdict is SKIP.
    - Never invent prices or percentages. Every number must come from the tool output.
    - If scanBlocked is true → output only the blocked reason and wait for conditions to change.
    - Maximum 2 ENTER verdicts per cycle regardless of how many candidates pass.
  `.trim(),
  tools: [runFullAnalysisTool],
})
