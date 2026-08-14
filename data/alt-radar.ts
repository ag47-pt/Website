/**
 * Dados tipados e canónicos do AG47 Alt Radar (Altcoin Intelligence & Discovery Engine)
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

export const ALT_RADAR_CONFIG = {
  name: 'AG47 Alt Radar',
  tagline: 'Radar Inteligente de Descoberta, Scoring Explicável e Análise de Risco de Altcoins',
  version: '1.0.0',
  repoPath: 'eco/alt-radar',
  canonicalUrl: 'https://ag47.pt/eco/alt-radar',
  status: 'Ativo & Operacional',
  metrics: [
    {
      label: 'Tokens Monitorizados',
      value: '14,250+',
      change: '+12% este mês',
      trend: 'up',
      description: 'Varredura em tempo real via DexScreener, GeckoTerminal e RPCs Solana/EVM.'
    },
    {
      label: 'Tempo Médio de Deteção',
      value: '< 1.8s',
      change: '-0.4s latência',
      trend: 'up',
      description: 'Deteção ultrarrápida de liquidez recém-adicionada em pools descentralizados.'
    },
    {
      label: 'Índice de Precisão de Risco',
      value: '99.4%',
      change: 'Algoritmo V2',
      trend: 'neutral',
      description: 'Análise sintética de Smart Contracts, Honeypots, Rugpulls e MINT Authority.'
    },
    {
      label: 'Alertas Disparados / Dia',
      value: '3,800+',
      change: 'Telegram & Webhooks',
      trend: 'up',
      description: 'Sinais filtrados e classificados por score de oportunidade sintético.'
    }
  ] as RadarMetric[],
  features: [
    {
      id: 'discovery',
      icon: 'Search',
      title: 'Descoberta Early-Stage',
      description: 'Filtros avançados para identificar novos pares de liquidez e acumulação de smart money antes do volume de massa.',
      badge: 'Real-time'
    },
    {
      id: 'security-audit',
      icon: 'ShieldCheck',
      title: 'Auditoria Autônoma de Risco',
      description: 'Verificação instantânea de contratos inteligente com simulação de venda, checagem de taxas de buy/sell e liquidez bloqueada.',
      badge: 'Zero-Trust'
    },
    {
      id: 'social-radar',
      icon: 'TrendingUp',
      title: 'Radar de Sentimento & Social',
      description: 'Monitorização contínua de picos de menções no Telegram, X (Twitter) e grupos alpha qualificados.',
      badge: 'AI Powered'
    },
    {
      id: 'explainable-score',
      icon: 'Cpu',
      title: 'Score Explicável AG47',
      description: 'Pontuação sintética de 0 a 100 com detalhamento exato dos fatores de risco, volumetria e distribuição de holders.',
      badge: 'Transparente'
    }
  ] as RadarFeature[],
  securityCategories: [
    {
      category: 'Integridade do Contrato',
      weight: '35%',
      description: 'Verificação de Honeypot, Renúncia de Ownership, Minting Authority e Blacklist Functions.',
      checks: ['Simulação de Sell Tax', 'Validação de MINT Authority', 'Verificação de Proxy / Upgradability']
    },
    {
      category: 'Estrutura de Liquidez',
      weight: '30%',
      description: 'Análise do bloqueio de liquidez (LP Lock), tamanho da pool inicial e par de cotação.',
      checks: ['Status do LP Token (Burned / Locked)', 'Tempo de Bloqueio > 6 meses', 'Ratio Liquidez / Market Cap']
    },
    {
      category: 'Distribuição de Holders',
      weight: '20%',
      description: 'Detecção de concentração excessiva em poucas carteiras ou vestígios de insider sniper wallets.',
      checks: ['Top 10 Holders % Total', 'Identificação de Wallets Correlacionadas', 'Developer Wallet Balance']
    },
    {
      category: 'Dinâmica de Mercado',
      weight: '15%',
      description: 'Volume de negociação orgânico versus transações automatizadas de bots.',
      checks: ['Volume 1h e 24h', 'Transações Únicas Buy/Sell', 'Buy Ratio > 55%']
    }
  ] as SecurityScoreCategory[]
};
