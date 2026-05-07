// ─── Shared Types for the Liquidity-Flow Crypto Agent ────────────────────────

export type MarketPhase =
  | 'BTC_DOMINANCE'       // BTC.D rising  → Capital Preservation
  | 'ETH_ROTATION'        // ETH/BTC breakout → High-Risk Altcoin Entry
  | 'ALTSEASON'           // BTC.D falling + BTC sideways → Altcoin Opportunity
  | 'UNCERTAINTY'         // Conflicting signals → Hold / Reduce Exposure

export type RiskMode = 'CAPITAL_PRESERVATION' | 'RISK_ON' | 'AGGRESSIVE'

export interface DominanceSnapshot {
  btcDominance: number        // BTC.D %
  ethDominance: number        // ETH.D %
  btcDominanceTrend: 'RISING' | 'FALLING' | 'SIDEWAYS'
  ethBtcRatio: number         // ETH/BTC price
  ethBtcBreakout: boolean     // true if breaking out
  timestamp: number
}

export interface CandleData {
  symbol: string
  openTime: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  closeTime: number
  quoteVolume: number
  trades: number
}

export interface TechnicalSignals {
  symbol: string
  rsi14: number
  macdLine: number
  macdSignal: number
  macdHistogram: number
  rvol: number          // Relative Volume vs 20-period average
  volumeSpikeDetected: boolean
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL'
  supportLevel: number
  resistanceLevel: number
}

export interface OrderBookSnapshot {
  symbol: string
  bidLiquidity: number   // Total bid volume in top 20 levels (USD)
  askLiquidity: number   // Total ask volume in top 20 levels (USD)
  spread: number         // % spread
  orderBlockBid: number  // Strongest support OB price
  orderBlockAsk: number  // Strongest resistance OB price
}

export interface AltcoinCandidate {
  symbol: string
  price: number
  signals: TechnicalSignals
  orderBook: OrderBookSnapshot
  score: number          // Composite score 0–100
}

export interface RiskParameters {
  accountBalance: number  // USDC balance
  winRate: number         // Historical win rate 0–1
  avgWin: number          // Average win % per trade
  avgLoss: number         // Average loss % per trade
  maxRiskPerTrade: number // Hard cap: 1.5%
}

export interface PositionSizing {
  symbol: string
  kellyFraction: number   // Raw Kelly %
  cappedFraction: number  // After 1.5% hard cap
  positionSizeUSDC: number
  entryPrice: number
  stopLoss: number
  takeProfit1: number     // 1:2 R:R
  takeProfit2: number     // 1:3 R:R
  invalidationLevel: number
}

export interface TradeProposal {
  id: string
  timestamp: number
  // Macro Context
  macroContext: {
    marketPhase: MarketPhase
    riskMode: RiskMode
    btcDominance: number
    btcDominanceTrend: string
    ethBtcBreakout: boolean
    fearGreedIndex: number
    fearGreedLabel: string
  }
  // Micro Setup
  microSetup: {
    symbol: string
    trigger: string          // Human-readable reason for entry
    entryZone: [number, number]
    technicalSignals: TechnicalSignals
    orderBlock: { bid: number; ask: number }
  }
  // Position
  sizing: PositionSizing
  // Invalidation
  invalidation: {
    price: number
    condition: string        // e.g. "Close below 0.000182 BTC on 4H"
    btcCondition: string     // e.g. "BTC.D reclaims above 52%"
  }
  // LLM Reasoning
  llmReasoning: string
  confidence: 'LOW' | 'MEDIUM' | 'HIGH'
}

export interface FearGreedData {
  value: number         // 0–100
  label: string         // "Extreme Fear" | "Fear" | "Neutral" | "Greed" | "Extreme Greed"
  timestamp: string
}

export interface AgentState {
  dominance: DominanceSnapshot | null
  fearGreed: FearGreedData | null
  topCandidates: AltcoinCandidate[]
  activeProposals: TradeProposal[]
  lastScanTimestamp: number
}
