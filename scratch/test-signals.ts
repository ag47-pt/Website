import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });

async function test() {
  try {
    console.log("Testing buildDominanceSnapshot...");
    const { buildDominanceSnapshot, classifyMarketPhase } = await import('../agent/crypto/agents/dominance-monitor');
    const snap = await buildDominanceSnapshot();
    console.log("Snapshot successfully fetched:", snap);
    const phase = classifyMarketPhase(snap);
    console.log("Market phase:", phase);
  } catch (err) {
    console.error("Error in buildDominanceSnapshot:", err);
  }

  try {
    console.log("Testing fetchFearGreedIndex...");
    const { fetchFearGreedIndex } = await import('../agent/crypto/tools/fear-greed');
    const fg = await fetchFearGreedIndex();
    console.log("Fear Greed fetched:", fg);
  } catch (err) {
    console.error("Error in fetchFearGreedIndex:", err);
  }

  try {
    console.log("Testing fetch24hStats for BTCUSDT...");
    const { fetch24hStats } = await import('../agent/crypto/tools/binance');
    const stats = await fetch24hStats('BTCUSDT');
    console.log("BTC Stats fetched:", stats);
  } catch (err) {
    console.error("Error in fetch24hStats:", err);
  }
}

test();
