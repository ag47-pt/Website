/**
 * Dados tipados e canónicos do AG47 Alt Radar (Altcoin Intelligence & Discovery Engine)
 * Padrão EvoPro (Evolution Protocol)
 * Localização no repositório: eco/alt-radar
 */

export interface RadarMetric {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  description: string;
}

export interface RadarFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
  badge?: string;
}

export interface SecurityScoreCategory {
  category: string;
  weight: string;
  description: string;
  checks: string[];
}

export interface PipelineStage {
  step: number;
  id: string;
  name: string;
  shortDesc: string;
  technicalDetails: string;
  latency: string;
  status: 'active' | 'synced' | 'standby';
}

export interface TerminalTabItem {
  id: string;
  title: string;
  command: string;
  output: string;
}

export interface CliCommandItem {
  name: string;
  category: 'discovery' | 'security' | 'analytics' | 'alerts' | 'system';
  syntax: string;
  description: string;
  flags: { flag: string; desc: string }[];
  exampleOutput: string;
}

export interface CapabilityItem {
  feature: string;
  ag47Radar: string | boolean;
  dexScreener: string | boolean;
  photon: string | boolean;
  gmgn: string | boolean;
  arkham: string | boolean;
}

export interface RoadmapItem {
  quarter: string;
  title: string;
  status: 'completed' | 'in_progress' | 'planned';
  items: string[];
}

export interface UseCaseItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  benefits: string[];
  metrics: string;
}

export const ALT_RADAR_CONFIG = {
  name: 'AG47 Alt Radar',
  tagline: 'Radar Inteligente de Descoberta, Scoring Explicável e Análise Autônoma de Risco de Altcoins',
  subtitle: 'The intelligence can change. The protocol stays with the project.',
  version: '1.0.0',
  repoPath: 'eco/alt-radar',
  canonicalUrl: 'https://ag47.pt/eco/alt-radar',
  gitHubUrl: 'https://github.com/Agencia47/alt-radar',
  installCommand: 'git clone https://github.com/Agencia47/alt-radar.git && cd alt-radar && npm install',
  quickRunCommand: 'npx ag47-alt-radar scan --chain solana --min-liq 25000',
  status: 'Ativo & Operacional',
  
  metrics: [
    {
      label: 'Tokens Monitorizados',
      value: '14,250+',
      change: '+14.2% este mês',
      trend: 'up',
      description: 'Varredura contínua em tempo real via DexScreener, GeckoTerminal, Raydium e RPCs Solana/EVM.'
    },
    {
      label: 'Tempo Médio de Deteção',
      value: '< 1.4s',
      change: '-0.4s latência',
      trend: 'up',
      description: 'Deteção ultrarrápida de liquidez recém-adicionada em pools descentralizados de AMMs e CLMMs.'
    },
    {
      label: 'Índice de Precisão de Risco',
      value: '99.4%',
      change: 'Algoritmo V2.4',
      trend: 'neutral',
      description: 'Análise sintética profunda de Smart Contracts, Honeypots, Rugpulls, Minting e Blacklist Authority.'
    },
    {
      label: 'Alertas Disparados / Dia',
      value: '3,850+',
      change: 'Telegram & Webhooks',
      trend: 'up',
      description: 'Sinais filtrados e classificados por score de oportunidade sintético e agrupamento de smart money.'
    }
  ] as RadarMetric[],

  pipelineStages: [
    {
      step: 1,
      id: 'ingestion',
      name: 'Ingestão de Pools & RPC',
      shortDesc: 'Varredura contínua em Solana, Base, Ethereum e BSC.',
      technicalDetails: 'Conexão direta a nós RPC dedicados (Jito, Helius, Alchemy) consumindo logs de criação de pools AMM.',
      latency: '240ms',
      status: 'active'
    },
    {
      step: 2,
      id: 'dex-filter',
      name: 'Filtro Inicial de Liquidez',
      shortDesc: 'Eliminação imediata de pools vazios ou sem liquidez primária.',
      technicalDetails: 'Threshold mínimo configurável de liquidez ($10k+), pareamento SOL/USDC/ETH e profundidade do livro virtual.',
      latency: '180ms',
      status: 'active'
    },
    {
      step: 3,
      id: 'bytecode-audit',
      name: 'Auditoria de Bytecode & Honeypot',
      shortDesc: 'Simulação transacional de compra e venda sem execução em mainnet.',
      technicalDetails: 'Inspeção de bytecode de Solana SPL / ERC-20, verificação de taxas abusivas de sell tax e funções maliciosas.',
      latency: '310ms',
      status: 'active'
    },
    {
      step: 4,
      id: 'smart-money',
      name: 'Clusterização de Smart Money',
      shortDesc: 'Rastreio de carteiras alfa e detecção de insiders.',
      technicalDetails: 'Análise de grafos on-chain correlacionando carteiras geradoras de funding e transações snipers sincronizadas.',
      latency: '420ms',
      status: 'active'
    },
    {
      step: 5,
      id: 'scoring-engine',
      name: 'Motor de Score Explicável (0-100)',
      shortDesc: 'Geração do score ponderado AG47 com métricas transparentes.',
      technicalDetails: 'Composição de 4 vetores: Contrato (35%), Liquidez (30%), Holders (20%) e Dinâmica de Mercado (15%).',
      latency: '120ms',
      status: 'active'
    },
    {
      step: 6,
      id: 'dispatch',
      name: 'Despacho Multicanal em Tempo Real',
      shortDesc: 'Transmissão instantânea para Webhooks, WebSocket e Telegram.',
      technicalDetails: 'Broker Redis Pub/Sub com baixa latência para clientes inscritos e bot de alertas categorizados por risco.',
      latency: '95ms',
      status: 'active'
    }
  ] as PipelineStage[],

  features: [
    {
      id: 'discovery',
      icon: 'Search',
      title: 'Descoberta Early-Stage Ultrarrápida',
      description: 'Filtros avançados para identificar novos pares de liquidez e acumulação de smart money antes do volume de massa.',
      badge: 'Real-time'
    },
    {
      id: 'security-audit',
      icon: 'ShieldCheck',
      title: 'Auditoria Autônoma Zero-Trust',
      description: 'Verificação instantânea de contratos inteligentes com simulação de venda, checagem de taxas de buy/sell e liquidez bloqueada.',
      badge: 'Zero-Trust'
    },
    {
      id: 'social-radar',
      icon: 'TrendingUp',
      title: 'Radar de Sentimento & Social',
      description: 'Monitorização contínua de picos de menções no Telegram, X (Twitter) e grupos alpha qualificados com pontuação de engajamento.',
      badge: 'AI Powered'
    },
    {
      id: 'explainable-score',
      icon: 'Cpu',
      title: 'Score Explicável AG47 (0-100)',
      description: 'Pontuação sintética determinística com detalhamento exato dos fatores de risco, volumetria e distribuição de holders.',
      badge: 'Transparente'
    },
    {
      id: 'stream-telemetry',
      icon: 'Radio',
      title: 'Stream de Telemetria Contínua',
      description: 'WebSocket de alta performance com dados de sparkline ao vivo, order flow e mudanças súbitas na composição de liquidez.',
      badge: 'Sub-second'
    },
    {
      id: 'cluster-analysis',
      icon: 'Network',
      title: 'Deteção de Clusters de Sniper',
      description: 'Mapeamento em grafo de carteiras conectadas à mesma exchange de funding para sinalizar insiders antes de dump.',
      badge: 'Graph AI'
    }
  ] as RadarFeature[],

  securityCategories: [
    {
      category: 'Integridade do Contrato',
      weight: '35%',
      description: 'Verificação de Honeypot, Renúncia de Ownership, Minting Authority e Blacklist Functions.',
      checks: [
        'Simulação de Venda (Sell Tax Verification)',
        'Validação de MINT Authority revogada',
        'Verificação de Freeze Authority desativada',
        'Ausência de Proxies mutáveis não verificados'
      ]
    },
    {
      category: 'Estrutura de Liquidez',
      weight: '30%',
      description: 'Análise do bloqueio de liquidez (LP Lock), tamanho da pool inicial e par de cotação.',
      checks: [
        'Status do LP Token (Burned / Locked > 90%)',
        'Tempo de Bloqueio comprovado > 6 meses',
        'Ratio Liquidez / Market Cap superior a 15%',
        'Pareamento em ativos consolidados (SOL / USDC / ETH)'
      ]
    },
    {
      category: 'Distribuição de Holders',
      weight: '20%',
      description: 'Detecção de concentração excessiva em poucas carteiras ou vestígios de insider sniper wallets.',
      checks: [
        'Top 10 Holders controlam menos de 18% do suprimento',
        'Identificação de carteiras correlacionadas por funding comum',
        'Developer Wallet com balanço inferior a 2%',
        'Ausência de tokens bloqueados em contratos opacos'
      ]
    },
    {
      category: 'Dinâmica de Mercado & Volume',
      weight: '15%',
      description: 'Volume de negociação orgânico versus transações automatizadas de bots de wash trading.',
      checks: [
        'Volume 1h e 24h com rácio de transações buy/sell saudável',
        'Mais de 150 compradores únicos na primeira hora',
        'Buy Ratio superior a 52%',
        'Ausência de loops de volume falso entre pares de carteiras'
      ]
    }
  ] as SecurityScoreCategory[],

  terminalTabs: [
    {
      id: 'scan',
      title: '1. Scanner de Descoberta',
      command: 'ag47-alt-radar scan --chain solana --min-liq 25000 --min-score 80',
      output: `[2026-08-14T06:05:12Z] INGESTION ENGINE: Listening to Solana RPC (Jito + Helius)
[2026-08-14T06:05:13Z] DETECTED: New Raydium CLMM Pool: AGAI / SOL
[2026-08-14T06:05:13Z] CONTRACT: 8xP9q...kM42
[2026-08-14T06:05:14Z] LIQUIDITY: $145,200 (100% LP Burned - Verified)
[2026-08-14T06:05:14Z] MINT AUTH: Revoked | FREEZE AUTH: Revoked
[2026-08-14T06:05:14Z] COMPOSITE SCORE: 94/100 (EXCELLENT)
[2026-08-14T06:05:15Z] DISPATCHED: Telemetry -> Webhook [AG47 Alpha VIP Channel] - Latency: 142ms`
    },
    {
      id: 'audit',
      title: '2. Auditoria de Contrato',
      command: 'ag47-alt-radar audit --token 8xP9q...kM42 --deep-sim',
      output: `===============================================================
AG47 ZERO-TRUST SECURITY AUDIT ENGINE - REPORT #AUD-8821
===============================================================
Target Token: 8xP9q...kM42 ($AGAI)
Chain: Solana SPL Token Program
---------------------------------------------------------------
[✓] Honeypot Simulation: PASSED (Buy tax: 0%, Sell tax: 0%)
[✓] Mint Authority: REVOKED (Supply hard-capped at 1,000,000,000)
[✓] Freeze Authority: REVOKED (Cannot freeze user balances)
[✓] LP Token State: BURNED to Incinerator Address (100.0%)
[✓] Blacklist Mechanism: NOT PRESENT
[✓] Top 10 Holders Concentration: 12.4% (Safe threshold < 20%)
---------------------------------------------------------------
FINAL VERDICT: LOW RISK (Score: 96/100) | STATUS: APPROVED`
    },
    {
      id: 'smart-money',
      title: '3. Smart Money & Clusters',
      command: 'ag47-alt-radar smart-money --token 8xP9q...kM42 --cluster-depth 3',
      output: `[+] GRAPH ANALYSIS: 42 Wallets Analyzed
---------------------------------------------------------------
Cluster Alpha (Tier 1 Smart Traders):
  - Wallet 7vK...992: Bought 1.2% at pool inception (Funding: Binance)
  - Wallet 3mR...04a: Bought 0.8% at pool inception (Funding: Kraken)
  - Win-Rate histórica dos holders identificados: 78.4% (30d)

Insider Cluster Detection:
  - Wallets com funding idêntico: 0 identificadas
  - Sniper bots correlacionados: 2 (Bloqueados por slippage dinâmico)
---------------------------------------------------------------
NET SMART MONEY INFLOW (15m): +$38,400 USDC`
    },
    {
      id: 'score',
      title: '4. Decomposição de Score',
      command: 'ag47-alt-radar score --explain --token 8xP9q...kM42',
      output: `{
  "token": "AGAI",
  "total_score": 94,
  "risk_tier": "SAFE_ALPHA",
  "breakdown": {
    "contract_integrity": {
      "score": 98,
      "weight": "35%",
      "contribution": 34.3,
      "status": "PERFECT"
    },
    "liquidity_structure": {
      "score": 92,
      "weight": "30%",
      "contribution": 27.6,
      "status": "STRONG"
    },
    "holder_distribution": {
      "score": 90,
      "weight": "20%",
      "contribution": 18.0,
      "status": "DECENTRALIZED"
    },
    "market_dynamics": {
      "score": 94,
      "weight": "15%",
      "contribution": 14.1,
      "status": "ORGANIC_EXPONENTIAL"
    }
  },
  "flags": []
}`
    },
    {
      id: 'telemetry',
      title: '5. Stream Telemetria',
      command: 'ag47-alt-radar telemetry --live --rpc-benchmark',
      output: `[SYSTEM] WEBSOCKET CONNECTED: wss://ag47.pt/api/eco/alt-radar/stream
[RPC-STATS]
  - Solana RPC Jito MEV: 28ms (OK)
  - Solana Helius Dedicated: 32ms (OK)
  - Base Alchemy Node: 44ms (OK)
  - Ethereum Geth Local: 12ms (OK)
[BUFFER] Ingestion Rate: 1,420 events/sec | CPU: 12.4% | RAM: 340MB
[EVENT] Block #284,912,404 processed in 4ms.`
    }
  ] as TerminalTabItem[],

  cliCommands: [
    {
      name: 'scan',
      category: 'discovery',
      syntax: 'ag47-alt-radar scan [options]',
      description: 'Inicia a varredura contínua de novos pools de liquidez com filtros de qualidade.',
      flags: [
        { flag: '--chain <name>', desc: 'Rede alvo: solana, base, ethereum, bsc' },
        { flag: '--min-liq <usd>', desc: 'Liquidez mínima em USD para sinalizar (padrão: 10000)' },
        { flag: '--min-score <n>', desc: 'Score mínimo explicável de 0 a 100 (padrão: 75)' },
        { flag: '--auto-alert', desc: 'Despacha alertas automáticos para canais cadastrados' }
      ],
      exampleOutput: 'ag47-alt-radar scan --chain solana --min-liq 25000'
    },
    {
      name: 'audit',
      category: 'security',
      syntax: 'ag47-alt-radar audit --token <address>',
      description: 'Executa simulação completa de honeypot, análise de bytecode e checagem de authorities.',
      flags: [
        { flag: '--token <address>', desc: 'Endereço do contrato do token SPL ou ERC-20' },
        { flag: '--deep-sim', desc: 'Executa simulação de múltiplos volumes de venda em sandbox' },
        { flag: '--json', desc: 'Retorna o relatório de auditoria em formato JSON para automação' }
      ],
      exampleOutput: 'ag47-alt-radar audit --token 8xP9q...kM42 --deep-sim'
    },
    {
      name: 'smart-money',
      category: 'analytics',
      syntax: 'ag47-alt-radar smart-money --token <address>',
      description: 'Rastreia a presença de carteiras de alta performance e mapeia clusters de insiders.',
      flags: [
        { flag: '--token <address>', desc: 'Endereço do contrato do token' },
        { flag: '--cluster-depth <n>', desc: 'Profundidade da árvore de funding das carteiras (1 a 5)' },
        { flag: '--min-winrate <pct>', desc: 'Filtrar apenas carteiras com win-rate > X%' }
      ],
      exampleOutput: 'ag47-alt-radar smart-money --token 8xP9q...kM42 --cluster-depth 3'
    },
    {
      name: 'score',
      category: 'analytics',
      syntax: 'ag47-alt-radar score --token <address>',
      description: 'Calcula e explica a pontuação sintética AG47 de 0 a 100 com detalhamento de pesos.',
      flags: [
        { flag: '--explain', desc: 'Gera a decomposição detalhada de cada categoria e penalidades' },
        { flag: '--weights <json>', desc: 'Permite customizar os pesos da fórmula de pontuação' }
      ],
      exampleOutput: 'ag47-alt-radar score --explain --token 8xP9q...kM42'
    },
    {
      name: 'alert',
      category: 'alerts',
      syntax: 'ag47-alt-radar alert [action] [options]',
      description: 'Configura e gerencia webhooks, bots de Telegram e canais de notificação em tempo real.',
      flags: [
        { flag: '--webhook <url>', desc: 'Endpoint HTTP para receber payloads de novos tokens aprovados' },
        { flag: '--telegram <bot_token>', desc: 'Configuração do bot de despacho no Telegram' },
        { flag: '--filter-risk <tier>', desc: 'Filtrar alertas por nível de risco: LOW, MEDIUM, HIGH' }
      ],
      exampleOutput: 'ag47-alt-radar alert add --webhook https://api.exemplo.com/webhook'
    },
    {
      name: 'telemetry',
      category: 'system',
      syntax: 'ag47-alt-radar telemetry [options]',
      description: 'Exibe estatísticas de latência de RPCs, taxas de ingestão de blocos e saúde do sistema.',
      flags: [
        { flag: '--live', desc: 'Streaming contínuo de status no terminal' },
        { flag: '--rpc-benchmark', desc: 'Testa latência de todos os endpoints configurados' }
      ],
      exampleOutput: 'ag47-alt-radar telemetry --live --rpc-benchmark'
    }
  ] as CliCommandItem[],

  capabilities: [
    {
      feature: 'Deteção de Novos Pools Sub-Second (< 1.5s)',
      ag47Radar: 'Sim (Direct RPC Stream)',
      dexScreener: 'Parcial (2-5s delay)',
      photon: 'Sim',
      gmgn: 'Sim',
      arkham: 'Não (Foco Forense)'
    },
    {
      feature: 'Simulação de Honeypot em Sandbox Bytecode',
      ag47Radar: 'Sim (Nativo Zero-Trust)',
      dexScreener: 'Não',
      photon: 'Básico',
      gmgn: 'Parcial',
      arkham: 'Não'
    },
    {
      feature: 'Score Explicável Ponderado (0-100)',
      ag47Radar: 'Sim (Totalmente Transparente)',
      dexScreener: 'Não',
      photon: 'Não',
      gmgn: 'Score Opaco',
      arkham: 'Não'
    },
    {
      feature: 'Clusterização de Insiders por Funding',
      ag47Radar: 'Sim (Grafo On-Chain Nativo)',
      dexScreener: 'Não',
      photon: 'Não',
      gmgn: 'Parcial',
      arkham: 'Sim (Manual / Explorer)'
    },
    {
      feature: 'Arquitetura Repository-Native & Self-Hostable',
      ag47Radar: 'Sim (Código Aberto / Modular)',
      dexScreener: 'Não (Proprietário)',
      photon: 'Não (SaaS Fechado)',
      gmgn: 'Não (SaaS Fechado)',
      arkham: 'Não (Enterprise SaaS)'
    },
    {
      feature: 'Webhooks & WebSocket Streaming para Bots',
      ag47Radar: 'Sim (Redis Pub/Sub)',
      dexScreener: 'API Paga com Rate Limit',
      photon: 'Não',
      gmgn: 'Não',
      arkham: 'API Enterprise'
    },
    {
      feature: 'Suporte Multi-Chain Nativo (Solana, Base, EVM)',
      ag47Radar: 'Sim (Pool Unificado)',
      dexScreener: 'Sim',
      photon: 'Limitado a Solana/ETH',
      gmgn: 'Sim',
      arkham: 'Sim'
    }
  ] as CapabilityItem[],

  useCases: [
    {
      id: 'alpha-hunters',
      title: 'Alpha Hunters & Early Snipers',
      badge: 'Velocidade Máxima',
      description: 'Identifique novos projetos com liquidez bloqueada e smart money nos primeiros 60 segundos após criação do pool.',
      benefits: [
        'Entrada antes do volume de massa',
        'Filtro instantâneo contra rugpulls e honeypots',
        'Notificações imediatas via Telegram e Webhook'
      ],
      metrics: '+340% média de timing de entrada'
    },
    {
      id: 'algo-traders',
      title: 'Desenvolvedores de Bots & Copy-Traders',
      badge: 'Automação Total',
      description: 'Conecte seus bots de execução ao stream WebSocket do Alt Radar para disparar ordens automatizadas com segurança.',
      benefits: [
        'Payloads ricos com score, liquidez e mint authority',
        'Latência sub-segundo garantida via RPC dedicado',
        'Rejeição automática de tokens com taxas de sell ocultas'
      ],
      metrics: '< 150ms latência ponta a ponta'
    },
    {
      id: 'risk-analysts',
      title: 'Auditores de Risco & Analistas DeFi',
      badge: 'Segurança Forense',
      description: 'Utilize o motor de decomposição para auditar a saúde de contratos, concentração de holders e rastreio de carteiras insider.',
      benefits: [
        'Relatórios de auditoria exportáveis em JSON e Markdown',
        'Visualização do histórico de transações de smart money',
        'Validação formal de renúncia de chaves de minting'
      ],
      metrics: '99.4% precisão na detecção de golpes'
    },
    {
      id: 'fund-managers',
      title: 'Gestores de Fundo & Tesourarias Web3',
      badge: 'Controle Institucional',
      description: 'Monitore posições em altcoins em tempo real com alertas de drenagem de liquidez ou venda por top holders.',
      benefits: [
        'Alertas de risco preventivos antes do dump',
        'Painel customizável com telemetria contínua',
        'Integração direta com o ecossistema AG47'
      ],
      metrics: 'Zero perdas por honeypots em posições monitoradas'
    }
  ] as UseCaseItem[],

  roadmap: [
    {
      quarter: 'Sprint Atual (Q3 2026)',
      title: 'Core Engine V1 & Solana CLMM Optimization',
      status: 'in_progress',
      items: [
        'Integração nativa com Raydium CLMM e CPMM em Solana',
        'Implementação da fórmula explicável do Score AG47 (0-100)',
        'Motor de simulação de venda de bytecode em sandbox',
        'Interface EvoPro com Tactical HUD e Single Scrollbar Architecture'
      ]
    },
    {
      quarter: 'Próximo Sprint (Q4 2026)',
      title: 'Base & EVM Multi-Chain Expansion',
      status: 'planned',
      items: [
        'Conexão a nós de Base (Aerodrome) e Arbitrum (Camelot)',
        'Rastreio de bonding curves no Pump.fun e plataformas similares',
        'Clusterização avançada de carteiras com IA de grafos',
        'Bot interativo no Telegram com comandos /audit e /score'
      ]
    },
    {
      quarter: 'Futuro (2027)',
      title: 'Institutional Forensics & Autonomous Execution',
      status: 'planned',
      items: [
        'Módulo de execução autônoma com proteção anti-MEV (Jito Bundles)',
        'Suporte a redes não-EVM emergentes (Monad, Sui, Aptos)',
        'SDK em Rust, Python e TypeScript para desenvolvedores',
        'Treinamento de modelo proprietário para previsão de sentimento social'
      ]
    }
  ] as RoadmapItem[],

  pitchDeckSlides: [
    {
      title: 'O Problema: A Selva de Altcoins & Falta de Inteligência',
      subtitle: '92% das novas altcoins diárias são scams, honeypots ou projetos sem liquidez.',
      points: [
        'Traders perdem capital em contratos maliciosos com taxas de sell ocultas.',
        'Ferramentas atuais (DexScreener, Photon) fornecem gráficos, mas pouca análise de risco profunda.',
        'Insiders e sniper bots operam clusters ocultos para manipular preços antes do dump.'
      ]
    },
    {
      title: 'A Solução: AG47 Alt Radar',
      subtitle: 'Inteligência autônoma, auditoria zero-trust e scoring explicável em tempo real.',
      points: [
        'Varredura sub-segundo direto nos nós RPC da blockchain.',
        'Simulador de honeypot em sandbox que testa a venda antes de aprovar.',
        'Score Explicável de 0 a 100 com transparência total de fatores de ponderação.'
      ]
    },
    {
      title: 'Tecnologia & Arquitetura EvoPro',
      subtitle: 'Engenharia de alta densidade criada para máxima performance.',
      points: [
        'Pipeline em 6 etapas: Ingestão -> Filtro -> Auditoria -> Smart Money -> Score -> Despacho.',
        'Single Scrollbar Architecture, HUD Tático com modo OLED e Web Audio sintético.',
        'Código modular pronto para self-host ou consumo via WebSocket/REST.'
      ]
    }
  ]
};
