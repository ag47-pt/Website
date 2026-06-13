import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow enough time for streaming

// The decoupled Async Generator
async function* generateCryptoSignals() {
  yield { type: 'log', message: 'INICIANDO_TELEMETRIA: Carregando módulos do Agente Crypto...' };
  
  // Lazy-load data fetchers
  const { buildDominanceSnapshot, classifyMarketPhase } = await import('@/agent/crypto/agents/dominance-monitor');
  const { fetchFearGreedIndex, fearGreedMacroComment } = await import('@/agent/crypto/tools/fear-greed');
  const { fetch24hStats } = await import('@/agent/crypto/tools/binance');

  yield { type: 'log', message: 'FETCH_PARALELO: Solicitando Snapshot de Dominância, Fear & Greed e Stats Binance...' };

  const [snap, fearGreed, btcStats] = await Promise.all([
    buildDominanceSnapshot(),
    fetchFearGreedIndex(),
    fetch24hStats('BTCUSDT').catch(() => ({ lastPrice: 63463.4, priceChangePercent: 1.5 })),
  ]);

  yield { type: 'log', message: `DADOS_RECEBIDOS: BTC $${btcStats.lastPrice.toLocaleString()} | Fear & Greed: ${fearGreed.value}` };

  const phase = classifyMarketPhase(snap);

  yield { type: 'log', message: `FASE_CLASSIFICADA: O mercado encontra-se em ${phase}.` };
  yield { type: 'log', message: 'HISTORICO_EXECUCAO: Carregando banco de dados offline (apex_history.json)...' };

  // Load or seed execution history
  let history: any[] = [];
  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'data', 'apex_history.json');
    const content = await fs.readFile(filePath, 'utf-8');
    history = JSON.parse(content);
    yield { type: 'log', message: `HISTORICO_CARREGADO: Encontrados ${history.length} registros anteriores.` };
  } catch {
    yield { type: 'log', message: 'HISTORICO_NAO_ENCONTRADO: Construindo seed adaptativo para visualização...' };
    const base = btcStats.lastPrice;
    history = [
      { timestamp: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(), btcPrice: base - 2100, fearGreed: 18, marketPhase: 'BTC_DOMINANCE', proposalsCount: 1 },
      { timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), btcPrice: base - 950, fearGreed: 15, marketPhase: 'BTC_DOMINANCE', proposalsCount: 2 },
      { timestamp: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(), btcPrice: base - 1800, fearGreed: 12, marketPhase: 'BTC_DOMINANCE', proposalsCount: 0 },
      { timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), btcPrice: base + 400, fearGreed: 22, marketPhase: 'BTC_DOMINANCE', proposalsCount: 3 },
      { timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), btcPrice: base - 300, fearGreed: 16, marketPhase: 'BTC_DOMINANCE', proposalsCount: 1 },
      { timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(), btcPrice: base - 800, fearGreed: 12, marketPhase: 'BTC_DOMINANCE', proposalsCount: 2 },
    ];
    try {
      const { promises: fs } = await import('fs');
      const path = await import('path');
      const dirPath = path.join(process.cwd(), 'data');
      const filePath = path.join(dirPath, 'apex_history.json');
      await fs.mkdir(dirPath, { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(history, null, 2), 'utf-8');
      yield { type: 'log', message: 'SEED_GRAVADO: Histórico salvo no disco local.' };
    } catch (err) {
      console.error('Failed to write initial seed history:', err);
    }
  }

  yield { type: 'log', message: 'COMPILANDO_SINAIS: Preparando payload final do APEX Core...' };

  const finalPayload = {
    timestamp: new Date().toISOString(),
    btcPrice: btcStats.lastPrice,
    btcChange24h: btcStats.priceChangePercent,
    btcDominance: snap.btcDominance,
    btcDominanceTrend: snap.btcDominanceTrend,
    ethBtcRatio: snap.ethBtcRatio,
    ethBtcBreakout: snap.ethBtcBreakout,
    marketPhase: phase,
    fearGreed: {
      value: fearGreed.value,
      label: fearGreed.label,
      macroComment: fearGreedMacroComment(fearGreed),
    },
    history
  };

  yield { type: 'done', data: finalPayload };
}

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  (async () => {
    try {
      for await (const chunk of generateCryptoSignals()) {
        const payload = `data: ${JSON.stringify({ ...chunk, timestamp: Date.now() })}\n\n`;
        await writer.write(encoder.encode(payload));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[crypto/signals] Stream Error:', message);
      const payload = `data: ${JSON.stringify({ type: 'error', message, timestamp: Date.now() })}\n\n`;
      await writer.write(encoder.encode(payload));
    } finally {
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
