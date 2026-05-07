// ─── Technical Analysis Engine ────────────────────────────────────────────────
// Pure-TS implementations of RSI, MACD, SMA, RVOL, Support/Resistance.
// No external TA-Lib dependency — avoids native module compilation issues.

import type { CandleData, TechnicalSignals } from '../types'
import { TA_CONFIG, SCORE_WEIGHTS } from '../config'

// ── Simple Moving Average ─────────────────────────────────────────────────────

export function sma(values: number[], period: number): number[] {
  const result: number[] = []
  for (let i = period - 1; i < values.length; i++) {
    const slice = values.slice(i - period + 1, i + 1)
    result.push(slice.reduce((a, b) => a + b, 0) / period)
  }
  return result
}

// ── Exponential Moving Average ────────────────────────────────────────────────

export function ema(values: number[], period: number): number[] {
  const k = 2 / (period + 1)
  const result: number[] = []
  let prev = values.slice(0, period).reduce((a, b) => a + b, 0) / period
  result[period - 1] = prev
  for (let i = period; i < values.length; i++) {
    prev = values[i] * k + prev * (1 - k)
    result[i] = prev
  }
  return result
}

// ── RSI (Wilder's Smoothing) ─────────────────────────────────────────────────

export function rsi(closes: number[], period: number = TA_CONFIG.rsiPeriod): number[] {
  const gains: number[] = []
  const losses: number[] = []

  for (let i = 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1]
    gains.push(Math.max(diff, 0))
    losses.push(Math.max(-diff, 0))
  }

  if (gains.length < period) return []

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period

  const result: number[] = []
  const calcRsi = (ag: number, al: number) => (al === 0 ? 100 : 100 - 100 / (1 + ag / al))

  result.push(calcRsi(avgGain, avgLoss))

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period
    result.push(calcRsi(avgGain, avgLoss))
  }

  return result
}

// ── MACD ─────────────────────────────────────────────────────────────────────

export interface MACDResult {
  macdLine:    number
  signalLine:  number
  histogram:   number
}

export function macd(
  closes: number[],
  fast:   number = TA_CONFIG.macdFast,
  slow:   number = TA_CONFIG.macdSlow,
  signal: number = TA_CONFIG.macdSignal,
): MACDResult[] {
  const emaFast   = ema(closes, fast)
  const emaSlow   = ema(closes, slow)

  const macdLine: number[] = []
  for (let i = slow - 1; i < closes.length; i++) {
    macdLine.push((emaFast[i] ?? 0) - (emaSlow[i] ?? 0))
  }

  const signalEma = ema(macdLine, signal)
  const results:  MACDResult[] = []

  for (let i = signal - 1; i < macdLine.length; i++) {
    const ml = macdLine[i]
    const sl = signalEma[i] ?? 0
    results.push({ macdLine: ml, signalLine: sl, histogram: ml - sl })
  }

  return results
}

// ── Relative Volume (RVOL) ────────────────────────────────────────────────────

/**
 * Computes RVOL: latest candle's volume divided by the SMA of volume
 * over the last `period` candles (excluding the current one).
 */
export function relativeVolume(
  candles:  CandleData[],
  period:   number = TA_CONFIG.rvolPeriod,
): number {
  if (candles.length < period + 1) return 1

  const historical = candles.slice(-period - 1, -1)
  const avgVolume  = historical.reduce((sum, c) => sum + c.volume, 0) / historical.length
  const lastVolume = candles[candles.length - 1].volume

  return avgVolume === 0 ? 1 : lastVolume / avgVolume
}

// ── Support & Resistance (Pivot-based) ───────────────────────────────────────

/**
 * Identifies the nearest support and resistance levels using recent pivot
 * highs/lows (looks back `lookback` candles).
 */
export function supportResistance(
  candles:  CandleData[],
  lookback: number = 20,
): { support: number; resistance: number } {
  const recent = candles.slice(-lookback)
  const highs  = recent.map(c => c.high)
  const lows   = recent.map(c => c.low)

  const currentClose = candles[candles.length - 1].close

  // All pivot lows below price = support candidates
  const supports    = lows.filter(l => l < currentClose)
  const resistances = highs.filter(h => h > currentClose)

  const support    = supports.length    ? Math.max(...supports)    : Math.min(...lows)
  const resistance = resistances.length ? Math.min(...resistances) : Math.max(...highs)

  return { support, resistance }
}

// ── Full Signal Pack ─────────────────────────────────────────────────────────

/**
 * Computes all technical signals for a symbol given its candle history.
 */
export function computeSignals(symbol: string, candles: CandleData[]): TechnicalSignals {
  if (candles.length < TA_CONFIG.klineLimit) {
    throw new Error(`Insufficient candle data for ${symbol}: got ${candles.length}`)
  }

  const closes = candles.map(c => c.close)

  const rsiValues  = rsi(closes)
  const macdValues = macd(closes)
  const rvol       = relativeVolume(candles)
  const { support, resistance } = supportResistance(candles)

  const latestRsi  = rsiValues[rsiValues.length - 1] ?? 50
  const latestMacd = macdValues[macdValues.length - 1] ?? { macdLine: 0, signalLine: 0, histogram: 0 }

  // Trend determination: price above/below SMA50
  const sma50    = sma(closes, 50)
  const latestSma = sma50[sma50.length - 1] ?? closes[closes.length - 1]
  const lastClose = closes[closes.length - 1]

  let trend: TechnicalSignals['trend'] = 'NEUTRAL'
  if (lastClose > latestSma && latestMacd.histogram > 0) trend = 'BULLISH'
  if (lastClose < latestSma && latestMacd.histogram < 0) trend = 'BEARISH'

  return {
    symbol,
    rsi14:               latestRsi,
    macdLine:            latestMacd.macdLine,
    macdSignal:          latestMacd.signalLine,
    macdHistogram:       latestMacd.histogram,
    rvol,
    volumeSpikeDetected: rvol >= TA_CONFIG.rvolSpikeThreshold,
    trend,
    supportLevel:        support,
    resistanceLevel:     resistance,
  }
}

// ── Composite Score ───────────────────────────────────────────────────────────

/**
 * Scores an altcoin candidate 0–100 for prioritization.
 * Higher = stronger entry setup.
 */
export function scoreCandidate(
  signals:   TechnicalSignals,
  bidLiquidity: number,
  askLiquidity: number,
  spread:    number,
): number {
  // RVOL component: 0–100
  const rvolScore = Math.min((signals.rvol / TA_CONFIG.rvolSpikeThreshold) * 100, 100)

  // RSI component: peak score at 35–45 (oversold bounce zone)
  const rsiScore =
    signals.rsi14 >= 30 && signals.rsi14 <= 45
      ? 100
      : signals.rsi14 > 45 && signals.rsi14 <= 55
      ? 60
      : signals.rsi14 > 55 && signals.rsi14 <= 65
      ? 30
      : 0

  // MACD component: bullish histogram
  const macdScore = signals.macdHistogram > 0 ? 100 : signals.macdHistogram > -0.001 ? 50 : 0

  // Liquidity ratio: bid dominance is bullish
  const totalLiquidity = bidLiquidity + askLiquidity
  const liquidityScore = totalLiquidity > 0 ? (bidLiquidity / totalLiquidity) * 100 : 50

  // Spread: lower is better (max 0.5% = score 0, 0% = score 100)
  const spreadScore = Math.max(0, 100 - spread * 200)

  return (
    rvolScore       * SCORE_WEIGHTS.rvol      +
    rsiScore        * SCORE_WEIGHTS.rsi       +
    macdScore       * SCORE_WEIGHTS.macd      +
    liquidityScore  * SCORE_WEIGHTS.liquidity +
    spreadScore     * SCORE_WEIGHTS.spread
  )
}
