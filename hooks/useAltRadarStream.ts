'use client';

import { useState, useEffect, useCallback } from 'react';

export interface LiveTokenItem {
  id: string;
  symbol: string;
  name: string;
  chain: 'solana' | 'ethereum' | 'base' | 'bsc';
  liquidity: string;
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: string;
}

export interface AltRadarStreamState {
  isConnected: boolean;
  statusMessage: string;
  lastPing: string | null;
  liveFeed: LiveTokenItem[];
  reconnect: () => void;
}

const INITIAL_MOCK_FEED: LiveTokenItem[] = [
  {
    id: 'token-1',
    symbol: 'AGAI',
    name: 'AG47 Intelligence Engine',
    chain: 'solana',
    liquidity: '$145,200',
    score: 94,
    riskLevel: 'LOW',
    timestamp: 'Agora'
  },
  {
    id: 'token-2',
    symbol: 'NEOFLOW',
    name: 'NeoFlow Liquidity',
    chain: 'base',
    liquidity: '$89,400',
    score: 88,
    riskLevel: 'LOW',
    timestamp: 'há 12s'
  },
  {
    id: 'token-3',
    symbol: 'SOLRADAR',
    name: 'Solana Sentinel',
    chain: 'solana',
    liquidity: '$42,100',
    score: 76,
    riskLevel: 'MEDIUM',
    timestamp: 'há 45s'
  }
];

export function useAltRadarStream(): AltRadarStreamState {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Conectando à API /api/eco/alt-radar...');
  const [lastPing, setLastPing] = useState<string | null>(null);
  const [liveFeed, setLiveFeed] = useState<LiveTokenItem[]>(INITIAL_MOCK_FEED);

  const checkTelemetry = useCallback(async () => {
    try {
      const res = await fetch('/api/eco/alt-radar/status', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setIsConnected(true);
        setStatusMessage(data.message || 'Stream Ativo & Telemetria Sincronizada');
        setLastPing(new Date().toLocaleTimeString('pt-PT'));
      } else {
        setIsConnected(false);
        setStatusMessage('Modo Standby / Reconectando...');
      }
    } catch (_err) {
      setIsConnected(false);
      setStatusMessage('Ponte de API Ativa (Modo Standby)');
    }
  }, []);

  useEffect(() => {
    checkTelemetry();
    const interval = setInterval(() => {
      checkTelemetry();
    }, 15000);

    return () => clearInterval(interval);
  }, [checkTelemetry]);

  return {
    isConnected,
    statusMessage,
    lastPing,
    liveFeed,
    reconnect: checkTelemetry
  };
}
