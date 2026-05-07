// ─── Liquidity-Flow Crypto Agent — Configuration ─────────────────────────────

import type { RiskParameters } from './types'

// ── API Credentials (set via environment variables — never hard-code) ─────────
export const BINANCE_CONFIG = {
  apiKey:    process.env.BINANCE_API_KEY    ?? '',
  apiSecret: process.env.BINANCE_API_SECRET ?? '',
  // Use testnet for paper trading: https://testnet.binance.vision
  useTestnet: process.env.BINANCE_TESTNET === 'true',
} as const

export const GEMINI_CONFIG = {
  // Gemini model for LLM reasoning — Flash for speed, Pro for depth
  model:  process.env.GEMINI_MODEL   ?? 'gemini-2.0-flash',
  apiKey: process.env.GOOGLE_API_KEY ?? '',
} as const

// ── Market Universe ───────────────────────────────────────────────────────────
// Pairs to monitor for BTC.D proxy (CoinGecko / Binance global market endpoint)
export const DOMINANCE_CONFIG = {
  // Binance doesn't expose BTC.D directly — fetched via CoinGecko
  coinGeckoGlobalUrl: 'https://api.coingecko.com/api/v3/global',
  // ETH/BTC pair on Binance
  ethBtcSymbol: 'ETHBTC',
  // BTC.D thresholds
  dominanceRisingThreshold:  0.5,   // % change in 24h to consider "rising"
  dominanceFallingThreshold: -0.5,  // % change in 24h to consider "falling"
  // ETH/BTC breakout: price crosses above its 20-period SMA
  ethBtcBreakoutSmaLength: 20,
} as const

// Top 50 Altcoins to scan (USDT pairs — update periodically)
export const TOP50_SYMBOLS = [
  'SOLUSDT',  'BNBUSDT',  'XRPUSDT',  'ADAUSDT',  'DOGEUSDT',
  'AVAXUSDT', 'TRXUSDT',  'DOTUSDT',  'MATICUSDT','LINKUSDT',
  'LTCUSDT',  'SHIBUSDT', 'UNIUSDT',  'ATOMUSDT', 'XLMUSDT',
  'ETCUSDT',  'FILUSDT',  'APTUSDT',  'NEARUSDT', 'HBARUSDT',
  'ARBUSDT',  'OPUSDT',   'INJUSDT',  'SUIUSDT',  'SEIUSDT',
  'TIAUSDT',  'ARUSDT',   'FTMUSDT',  'RENDERUSDT','RNDRUSDT',
  'PEPEUSDT', 'WIFUSDT',  'JUPUSDT',  'PYTAUSDT', 'STRKUSDT',
  'LDOUSDT',  'MKRUSDT',  'AAVEUSDT', 'SNXUSDT',  'CRVUSDT',
  'GRTUSDT',  'SANDUSDT', 'MANAUSDT', 'AXSUSDT',  'IMXUSDT',
  'FLOWUSDT', 'ENAUSDT',  'EIGENUSDT','REZUSDT',  '1000BONKUSDT',
] as const

// ── Technical Analysis Parameters ────────────────────────────────────────────
export const TA_CONFIG = {
  // Candle interval for signal generation
  klineInterval: '4h' as const,
  // Number of candles to fetch for calculations
  klineLimit: 100,
  // RSI
  rsiPeriod: 14,
  rsiOversold:   35,   // Entry zone
  rsiOverbought: 70,   // Exit zone
  // MACD
  macdFast:   12,
  macdSlow:   26,
  macdSignal:  9,
  // Relative Volume: current volume vs SMA(volume, N)
  rvolPeriod:       20,
  rvolSpikeThreshold: 2.0,   // 2× average = spike
  // Order Book depth levels to aggregate
  orderBookLevels: 20,
} as const

// ── Risk Parameters ───────────────────────────────────────────────────────────
export const DEFAULT_RISK_PARAMS: RiskParameters = {
  accountBalance:  1000,   // USDC — override at runtime
  winRate:          0.45,  // Conservative starting assumption
  avgWin:           0.04,  // 4% average win
  avgLoss:          0.02,  // 2% average loss (1.5% stop + slippage)
  maxRiskPerTrade:  0.015, // Hard cap: 1.5% of account
}

// Kelly Criterion half-Kelly multiplier (reduces position size for safety)
export const KELLY_FRACTION_MULTIPLIER = 0.5

// ── Scan & Refresh Intervals ─────────────────────────────────────────────────
export const INTERVALS = {
  dominancePollMs:  5  * 60 * 1000,  //  5 min: BTC.D / ETH-BTC check
  marketScanMs:    15  * 60 * 1000,  // 15 min: Altcoin RVOL scan
  fearGreedPollMs: 60  * 60 * 1000,  //  1 hr:  Fear & Greed Index
  decisionCycleMs: 30  * 60 * 1000,  // 30 min: LLM reasoning cycle
} as const

// ── Fear & Greed Index API ────────────────────────────────────────────────────
export const FEAR_GREED_URL = 'https://api.alternative.me/fng/?limit=1'

// ── Candidate Scoring Weights ─────────────────────────────────────────────────
export const SCORE_WEIGHTS = {
  rvol:       0.35,  // Relative volume spike — most important
  rsi:        0.20,  // RSI in entry zone
  macd:       0.20,  // MACD bullish crossover
  liquidity:  0.15,  // Order book bid/ask ratio
  spread:     0.10,  // Low spread = tighter execution
} as const

// Minimum composite score to be included in shortlist
export const MIN_CANDIDATE_SCORE = 55

// Re-export for convenience
export const WATCHED_SYMBOLS: readonly string[] = TOP50_SYMBOLS
