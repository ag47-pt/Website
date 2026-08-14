import { NextRequest, NextResponse } from 'next/server';

const RADAR_API_BASE = process.env.ALT_RADAR_API_URL || 'https://alt-radar-api-15974783507.europe-west3.run.app';

// Stable UUIDs for Demo Tokens
const DEMO_TOKENS = [
  {
    id: "a1b2c3d4-e5f6-4a1b-8c2d-1e2f3a4b5c6d",
    chain: "solana" as const,
    contract_address: "rndrizKT3MK1iimdxRdWabc1234567890abcdef12",
    symbol: "RENDER",
    name: "Render Network",
    price: 6.84,
    change1h: 3.42,
    change24h: 18.75,
    volume1h: 4200000,
    volume24h: 84500000,
    liquidity: 18500000,
    score: 9.4,
    classification: "oportunidade_forte" as const,
    risk: 1.8,
    holders: 142850,
    age: "180d",
  },
  {
    id: "b2c3d4e5-f6a1-4b2c-9d3e-2f3a4b5c6d7e",
    chain: "solana" as const,
    contract_address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    symbol: "RAY",
    name: "Raydium Protocol",
    price: 2.14,
    change1h: 1.85,
    change24h: 12.4,
    volume1h: 1850000,
    volume24h: 36200000,
    liquidity: 9400000,
    score: 8.9,
    classification: "oportunidade_forte" as const,
    risk: 2.4,
    holders: 98400,
    age: "240d",
  },
  {
    id: "c3d4e5f6-a1b2-4c3d-ae4f-3a4b5c6d7e8f",
    chain: "ethereum" as const,
    contract_address: "0x808507121b80c02388fad14726482e061b8da827",
    symbol: "PENDLE",
    name: "Pendle Finance",
    price: 4.38,
    change1h: -0.45,
    change24h: 8.92,
    volume1h: 920000,
    volume24h: 19800000,
    liquidity: 14200000,
    score: 8.6,
    classification: "oportunidade_forte" as const,
    risk: 2.1,
    holders: 56300,
    age: "310d",
  },
  {
    id: "d4e5f6a1-b2c3-4d4e-bf5a-4b5c6d7e8f9a",
    chain: "solana" as const,
    contract_address: "jtojtomepa8beP8VCQ35gumpkGxyTW59S5iCNLY3QrkJTO",
    symbol: "JTO",
    name: "Jito Liquid Staking",
    price: 3.05,
    change1h: 0.95,
    change24h: 6.4,
    volume1h: 650000,
    volume24h: 14500000,
    liquidity: 7800000,
    score: 8.1,
    classification: "oportunidade_forte" as const,
    risk: 2.7,
    holders: 42100,
    age: "120d",
  },
  {
    id: "e5f6a1b2-c3d4-4e5f-c06b-5b6c7d8e9f0b",
    chain: "bsc" as const,
    contract_address: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
    symbol: "CAKE",
    name: "PancakeSwap",
    price: 2.45,
    change1h: -0.12,
    change24h: 4.15,
    volume1h: 840000,
    volume24h: 18200000,
    liquidity: 12400000,
    score: 7.6,
    classification: "observar" as const,
    risk: 3.2,
    holders: 320000,
    age: "900d",
  },
  {
    id: "f6a1b2c3-d4e5-4f6a-d17c-6c7d8e9f0a1c",
    chain: "solana" as const,
    contract_address: "HZ1JovNiRPl3U29L1439gumpkGxyTW59S5iCNLY3QrkWIF",
    symbol: "WIF",
    name: "dogwifhat",
    price: 2.18,
    change1h: 5.12,
    change24h: 24.6,
    volume1h: 8900000,
    volume24h: 145000000,
    liquidity: 22000000,
    score: 7.4,
    classification: "especulativo" as const,
    risk: 5.8,
    holders: 185000,
    age: "95d",
  }
];

function getDemoOpportunities() {
  const now = new Date().toISOString();
  return {
    items: DEMO_TOKENS.map((t) => ({
      token: {
        id: t.id,
        chain: t.chain,
        contract_address: t.contract_address,
        symbol: t.symbol,
        name: t.name,
        decimals: 9,
        created_at: now,
        first_seen_at: now,
        metadata: {},
        source: "dexscreener",
        is_demo: true,
      },
      pair: {
        id: "77777777-7777-4777-a777-777777777777",
        token_id: t.id,
        pair_address: t.contract_address,
        quote_token: t.chain === "solana" ? "SOL" : t.chain === "bsc" ? "BNB" : "USDC",
        dex: t.chain === "solana" ? "Raydium" : t.chain === "bsc" ? "PancakeSwap" : "Uniswap v3",
        created_at: now,
        first_seen_at: now,
        source: "dexscreener",
        source_url: `https://dexscreener.com/${t.chain}/${t.contract_address}`,
        is_demo: true,
      },
      market: {
        id: "88888888-8888-4888-a888-888888888888",
        pair_id: "77777777-7777-4777-a777-777777777777",
        price_usd: t.price,
        liquidity_usd: t.liquidity,
        volume_5m: t.volume1h / 12,
        volume_1h: t.volume1h,
        volume_24h: t.volume24h,
        price_change_5m: t.change1h / 6,
        price_change_1h: t.change1h,
        price_change_24h: t.change24h,
        market_cap: t.volume24h * 8,
        fdv: t.volume24h * 12,
        buyers: 480,
        sellers: 210,
        captured_at: now,
        source: "dexscreener",
        data_quality: "high" as const,
        is_demo: true,
      },
      risk: {
        risk_score: t.risk,
        critical_flags: [],
        captured_at: now,
        source: "goplus",
        data_quality: "high" as const,
        is_demo: true,
      },
      score: {
        id: "99999999-9999-4999-a999-999999999999",
        token_id: t.id,
        momentum_score: 9.2,
        liquidity_score: 8.8,
        community_score: 8.5,
        distribution_score: 8.2,
        safety_score: 9.5,
        data_quality_score: 1.0,
        final_score: t.score,
        classification: t.classification,
        confidence: 0.94,
        signals_available: 6,
        explanation: "Forte momento com expansão sustentada de liquidez e volume sem flags de risco.",
        positive_factors: ["LP Bloqueada", "Volume / Liquidez > 2.5x", "Comunidade ativa"],
        negative_factors: [],
        critical_gate_applied: false,
        calculated_at: now,
        scoring_version: "2.4.0",
        is_demo: true,
      },
      holders_count: t.holders,
      watchlisted: false,
      updated_at: now,
    })),
    page: 1,
    page_size: 10,
    total: DEMO_TOKENS.length,
    pages: 1,
    demo_mode: true,
    partial: false,
    stale: false,
  };
}

function getDemoStatus() {
  const now = new Date().toISOString();
  return {
    status: "operational" as const,
    demo_mode: true,
    monitoring_active: true,
    read_only: true,
    database: "connected",
    last_sync_at: now,
    generated_at: now,
    metrics: {
      tokens_monitored: 12480,
      alerts_today: 38,
      strong_opportunities: 14,
      average_score: 7.8,
      active_providers: 4,
    },
    providers: [
      { id: "dexscreener", name: "DexScreener Live RPC", kind: "market", status: "active" as const, mode: "demo" as const, last_checked_at: now, detail: "Conexão de telemetria operante" },
      { id: "goplus", name: "GoPlus Security Engine", kind: "security", status: "active" as const, mode: "demo" as const, last_checked_at: now, detail: "Auditoria determinística ativa" },
      { id: "helius", name: "Helius Solana Sub-second", kind: "rpc", status: "active" as const, mode: "demo" as const, last_checked_at: now, detail: "Sub-second block streaming" },
      { id: "quicknode", name: "QuickNode Multi-Chain", kind: "rpc", status: "active" as const, mode: "demo" as const, last_checked_at: now, detail: "BSC & ETH nodes operantes" },
    ],
  };
}

function getDemoEvolution() {
  return {
    phase: "Fase 2",
    phase_title: "Inteligência Autônoma & Sinais Multi-Chain",
    now: "Sprint 11 • Webhook Outbound Assinado, Painel Multi-Chain e Exportação Epistemológica",
    completed_steps: 11,
    total_steps: 15,
    goal: "Terminal de Operações Determinísticas de Altcoins EvoPro",
  };
}

function getDemoTokenDetail(tokenId: string) {
  const t = DEMO_TOKENS.find((item) => item.id === tokenId) ?? DEMO_TOKENS[0];
  const now = new Date().toISOString();
  return {
    token: {
      id: t.id,
      chain: t.chain,
      contract_address: t.contract_address,
      symbol: t.symbol,
      name: t.name,
      decimals: 9,
      created_at: now,
      first_seen_at: now,
      metadata: {},
      source: "dexscreener",
      is_demo: true,
    },
    pairs: [
      {
        id: "77777777-7777-4777-a777-777777777777",
        token_id: t.id,
        pair_address: t.contract_address,
        quote_token: t.chain === "solana" ? "SOL" : "USDC",
        dex: "Raydium",
        created_at: now,
        first_seen_at: now,
        source: "dexscreener",
        source_url: `https://dexscreener.com/${t.chain}/${t.contract_address}`,
        is_demo: true,
      }
    ],
    latest_market: {
      id: "88888888-8888-4888-a888-888888888888",
      pair_id: "77777777-7777-4777-a777-777777777777",
      price_usd: t.price,
      liquidity_usd: t.liquidity,
      volume_5m: t.volume1h / 12,
      volume_1h: t.volume1h,
      volume_24h: t.volume24h,
      price_change_5m: t.change1h / 6,
      price_change_1h: t.change1h,
      price_change_24h: t.change24h,
      market_cap: t.volume24h * 8,
      fdv: t.volume24h * 12,
      buyers: 480,
      sellers: 210,
      captured_at: now,
      source: "dexscreener",
      data_quality: "high" as const,
      is_demo: true,
    },
    latest_social: {
      id: "66666666-6666-4666-a666-666666666666",
      token_id: t.id,
      platform: "telegram",
      members: 34200,
      member_growth_1h: 120,
      member_growth_24h: 1850,
      messages_per_minute: 42.5,
      unique_authors: 890,
      participation_rate: 0.28,
      engagement_rate: 0.74,
      repetition_rate: 0.08,
      estimated_bot_ratio: 0.04,
      team_activity: "Alta atividade de desenvolvedores",
      captured_at: now,
      source: "telegram-tracker",
      data_quality: "high" as const,
      is_demo: true,
    },
    latest_risk: {
      id: "55555555-5555-4555-a555-555555555555",
      token_id: t.id,
      risk_score: t.risk,
      critical_flags: [],
      liquidity_lock_status: "locked" as const,
      top_holders_percentage: 18.4,
      deployer_percentage: 1.2,
      owner_privileges: "None (Renounced)",
      mintable: false,
      blacklist_capability: false,
      holders_count: t.holders,
      can_change_tax: false,
      buy_tax: 0,
      sell_tax: 0,
      proxy_contract: false,
      contract_age_days: 180,
      honeypot_status: "Clean",
      flags: [
        { code: "lp_locked", label: "LP Bloqueada 100%", level: "informativo" as const, description: "Liquidez travada no contrato oficial" },
        { code: "no_mint", label: "Mint Authority Revogada", level: "informativo" as const, description: "Nenhum novo token pode ser emitido" },
      ],
      captured_at: now,
      source: "goplus",
      data_quality: "high" as const,
      is_demo: true,
    },
    latest_score: {
      id: "99999999-9999-4999-a999-999999999999",
      token_id: t.id,
      momentum_score: 9.2,
      liquidity_score: 8.8,
      community_score: 8.5,
      distribution_score: 8.2,
      safety_score: 9.5,
      data_quality_score: 1.0,
      final_score: t.score,
      classification: t.classification,
      confidence: 0.94,
      signals_available: 6,
      explanation: "Forte momento com expansão sustentada de liquidez e volume sem flags de risco.",
      positive_factors: ["LP Bloqueada", "Volume / Liquidez > 2.5x", "Comunidade ativa"],
      negative_factors: [],
      critical_gate_applied: false,
      calculated_at: now,
      scoring_version: "2.4.0",
      is_demo: true,
    },
    watchlisted: false,
    data_mode: "demo" as const,
  };
}

function getDemoHistory(tokenId: string) {
  const points = [];
  const basePrice = 6.0;
  for (let i = 24; i >= 0; i--) {
    const time = new Date(Date.now() - i * 3600 * 1000).toISOString();
    const noise = Math.sin(i * 0.5) * 0.4 + (24 - i) * 0.05;
    points.push({
      captured_at: time,
      price_usd: Number((basePrice + noise).toFixed(4)),
      volume_usd: 1200000 + Math.floor(Math.random() * 500000),
      liquidity_usd: 18000000 + Math.floor(Math.random() * 500000),
      source: "dexscreener",
      data_quality: "high" as const,
    });
  }
  return {
    token_id: tokenId,
    pair_id: "77777777-7777-4777-a777-777777777777",
    interval: "24h" as const,
    points,
    demo_mode: true,
  };
}

function getDemoAlerts() {
  const now = new Date();
  return {
    items: [
      {
        id: "alert-1",
        rule_id: "rule:liquidity_volume_expansion",
        severity: 85,
        token: { id: DEMO_TOKENS[0].id, symbol: DEMO_TOKENS[0].symbol, chain: DEMO_TOKENS[0].chain },
        triggered_at: new Date(now.getTime() - 4 * 60000).toISOString(),
        message: "Expansão de liquidez de +$2.4M com aceleração de volume 5m em RENDER.",
        status: "unread" as const,
      },
      {
        id: "alert-2",
        rule_id: "rule:volume_spike",
        severity: 68,
        token: { id: DEMO_TOKENS[1].id, symbol: DEMO_TOKENS[1].symbol, chain: DEMO_TOKENS[1].chain },
        triggered_at: new Date(now.getTime() - 14 * 60000).toISOString(),
        message: "Pico de volume de compras institucionais detectado em RAY.",
        status: "read" as const,
      },
      {
        id: "alert-3",
        rule_id: "rule:liquidity_volume_expansion",
        severity: 75,
        token: { id: DEMO_TOKENS[2].id, symbol: DEMO_TOKENS[2].symbol, chain: DEMO_TOKENS[2].chain },
        triggered_at: new Date(now.getTime() - 32 * 60000).toISOString(),
        message: "Afluxo constante de novos compradores em PENDLE.",
        status: "read" as const,
      }
    ],
    page: 1,
    page_size: 20,
    total: 3,
    pages: 1,
    demo_mode: true,
    partial: false,
    stale: false,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolvedParams = await params;
  const subPath = resolvedParams.path ? resolvedParams.path.join('/') : '';
  const search = request.nextUrl.search;
  const targetUrl = `${RADAR_API_BASE}/${subPath}${search}`;

  const incomingHeaders: Record<string, string> = {
    'Accept': 'application/json',
    'User-Agent': 'AG47-Eco-Proxy/1.0',
  };
  const apiKey = request.headers.get('x-ag47-api-key');
  if (apiKey) incomingHeaders['x-ag47-api-key'] = apiKey;

  try {
    const res = await fetch(targetUrl, {
      headers: incomingHeaders,
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (_err) {
    // Fallback to local demo responder
  }

  // Handle Demo Fallbacks deterministically
  if (subPath.includes('system/status')) {
    return NextResponse.json(getDemoStatus());
  }
  if (subPath.includes('system/evolution')) {
    return NextResponse.json(getDemoEvolution());
  }
  if (subPath.includes('opportunities')) {
    return NextResponse.json(getDemoOpportunities());
  }
  if (subPath.includes('alerts')) {
    return NextResponse.json(getDemoAlerts());
  }
  if (subPath.includes('watchlist')) {
    return NextResponse.json({ items: [], page: 1, page_size: 50, total: 0, pages: 0, demo_mode: true, partial: false, stale: false });
  }
  if (subPath.includes('market-history')) {
    const parts = subPath.split('/');
    const tokenId = parts[parts.indexOf('tokens') + 1] || DEMO_TOKENS[0].id;
    return NextResponse.json(getDemoHistory(tokenId));
  }
  if (subPath.includes('tokens/')) {
    const parts = subPath.split('/');
    const tokenId = parts[parts.indexOf('tokens') + 1] || DEMO_TOKENS[0].id;
    return NextResponse.json(getDemoTokenDetail(tokenId));
  }

  return NextResponse.json(getDemoStatus());
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolvedParams = await params;
  const subPath = resolvedParams.path ? resolvedParams.path.join('/') : '';
  const body = await request.json().catch(() => ({}));
  const targetUrl = `${RADAR_API_BASE}/${subPath}`;

  const postHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'AG47-Eco-Proxy/1.0',
  };
  const postApiKey = request.headers.get('x-ag47-api-key');
  if (postApiKey) postHeaders['x-ag47-api-key'] = postApiKey;

  try {
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: postHeaders,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }
  } catch (_err) {
    // Fallback response
  }

  return NextResponse.json({ success: true, mode: "demo_simulated" });
}
