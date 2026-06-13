// ─── Binance Tools — REST + WebSocket Data Ingestion ─────────────────────────
// Wraps binance-api-node for use as ADK FunctionTools

import Binance from 'binance-api-node'
import { BINANCE_CONFIG, TA_CONFIG, TOP50_SYMBOLS } from '../config'
import type { CandleData, OrderBookSnapshot } from '../types'

// Singleton Binance REST client
const client = Binance({
  apiKey:    BINANCE_CONFIG.apiKey,
  apiSecret: BINANCE_CONFIG.apiSecret,
  ...(BINANCE_CONFIG.useTestnet && {
    httpBase:  'https://testnet.binance.vision',
    wsBase:    'wss://testnet.binance.vision/ws',
  }),
})

// ── Candle Fetcher ────────────────────────────────────────────────────────────

/**
 * Fetches the last `limit` closed candles for a symbol.
 */
export async function fetchCandles(
  symbol: string,
  interval: string = TA_CONFIG.klineInterval,
  limit: number    = TA_CONFIG.klineLimit,
): Promise<CandleData[]> {
  const raw = await client.candles({ symbol, interval, limit })
  return raw.map(k => ({
    symbol,
    openTime:    Number(k.openTime),
    open:        parseFloat(k.open),
    high:        parseFloat(k.high),
    low:         parseFloat(k.low),
    close:       parseFloat(k.close),
    volume:      parseFloat(k.volume),
    closeTime:   Number(k.closeTime),
    quoteVolume: parseFloat(k.quoteAssetVolume),
    trades:      k.trades,
  }))
}

/**
 * Fetches candles for multiple symbols in parallel (rate-limit aware).
 * Chunks into batches of 10 to avoid 429s.
 */
export async function fetchMultipleCandles(
  symbols: readonly string[],
  interval: string = TA_CONFIG.klineInterval,
  limit:    number = TA_CONFIG.klineLimit,
): Promise<Map<string, CandleData[]>> {
  const result = new Map<string, CandleData[]>()
  const BATCH = 10
  const DELAY = 200  // ms between batches

  for (let i = 0; i < symbols.length; i += BATCH) {
    const batch = symbols.slice(i, i + BATCH)
    const settled = await Promise.allSettled(
      batch.map(sym => fetchCandles(sym, interval, limit))
    )
    settled.forEach((res, idx) => {
      if (res.status === 'fulfilled') result.set(batch[idx], res.value)
    })
    if (i + BATCH < symbols.length) {
      await new Promise(r => setTimeout(r, DELAY))
    }
  }
  return result
}

// ── Order Book Snapshot ───────────────────────────────────────────────────────

export async function fetchOrderBook(
  symbol: string,
  levels: number = 20,
): Promise<OrderBookSnapshot> {
  const book = await client.book({ symbol, limit: levels as 5 | 10 | 20 | 50 | 100 | 500 | 1000 })

  // binance-api-node returns bids/asks as [price, qty][] tuples
  const sumSide = (side: [string, string][]) =>
    side.reduce((acc, t) => acc + parseFloat(t[0]) * parseFloat(t[1]), 0)

  const bidLiquidity = sumSide(book.bids)
  const askLiquidity = sumSide(book.asks)

  const bestBid = parseFloat(book.bids[0]?.[0] ?? '0')
  const bestAsk = parseFloat(book.asks[0]?.[0] ?? '0')
  const spread  = bestBid > 0 ? ((bestAsk - bestBid) / bestBid) * 100 : 0

  // Identify the largest single bid/ask level as an "Order Block" proxy
  const maxBid = book.bids.reduce((max, b) =>
    parseFloat(b[1]) > parseFloat(max[1]) ? b : max, book.bids[0])
  const maxAsk = book.asks.reduce((max, a) =>
    parseFloat(a[1]) > parseFloat(max[1]) ? a : max, book.asks[0])

  return {
    symbol,
    bidLiquidity,
    askLiquidity,
    spread,
    orderBlockBid: parseFloat(maxBid?.[0] ?? '0'),
    orderBlockAsk: parseFloat(maxAsk?.[0] ?? '0'),
  }
}

// ── ETH/BTC Price ─────────────────────────────────────────────────────────────

export async function fetchEthBtcPrice(): Promise<number> {
  const tickers = (await client.prices()) as unknown as Record<string, string>
  return parseFloat(tickers['ETHBTC'] ?? '0')
}

// ── 24h Volume Stats (used for dominance proxy) ───────────────────────────────

export async function fetch24hStats(symbol: string) {
  const stats = await client.dailyStats({ symbol })
  const s = Array.isArray(stats) ? stats[0] : stats
  return {
    symbol,
    priceChangePercent: parseFloat(s.priceChangePercent),
    volume:             parseFloat(s.volume),
    quoteVolume:        parseFloat(s.quoteVolume),
    lastPrice:          parseFloat(s.lastPrice),
  }
}

// ── WebSocket Candle Stream ───────────────────────────────────────────────────
// Returns a cleanup function. Used for real-time RVOL alerting.

export function subscribeKlines(
  symbol:   string,
  interval: string,
  onCandle: (candle: CandleData) => void,
): () => void {
  const close = client.ws.candles(symbol, interval, candle => {
    if (!candle.isFinal) return  // Only process closed candles
    onCandle({
      symbol,
      openTime:    candle.startTime,
      open:        parseFloat(candle.open),
      high:        parseFloat(candle.high),
      low:         parseFloat(candle.low),
      close:       parseFloat(candle.close),
      volume:      parseFloat(candle.volume),
      closeTime:   candle.closeTime,
      quoteVolume: parseFloat(candle.quoteVolume),
      trades:      candle.trades,
    })
  })
  return close
}

// ── Top 50 Symbols Accessor ───────────────────────────────────────────────────
export const WATCHED_SYMBOLS: readonly string[] = TOP50_SYMBOLS
