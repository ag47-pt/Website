"use client";

import { useCallback, useEffect, useState } from "react";

export interface LiveTokenItem {
  id: string;
  symbol: string;
  name: string;
  chain: "solana" | "ethereum" | "base" | "bsc";
  liquidity: string;
  score: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  timestamp: string;
}

export interface AltRadarStreamState {
  isApiReachable: boolean;
  statusMessage: string;
  lastCheck: string | null;
  liveFeed: LiveTokenItem[];
  recheck: () => void;
}

const NO_LIVE_FEED: LiveTokenItem[] = [];

export function useAltRadarStream(): AltRadarStreamState {
  const [isApiReachable, setIsApiReachable] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Feed em tempo real não disponibilizado neste portal.",
  );
  const [lastCheck, setLastCheck] = useState<string | null>(null);

  const checkTelemetry = useCallback(async () => {
    try {
      const res = await fetch("/api/eco/alt-radar/health", {
        cache: "no-store",
        headers: { Accept: "application/json" },
        method: "GET",
      });

      setLastCheck(new Date().toLocaleTimeString("pt-PT"));

      if (res.ok) {
        setIsApiReachable(true);
        setStatusMessage(
          "API pública acessível. Esta verificação não confirma WebSocket nem feed em tempo real.",
        );
      } else {
        setIsApiReachable(false);
        setStatusMessage(
          `API pública respondeu HTTP ${res.status}; nenhum feed ao vivo está disponível.`,
        );
      }
    } catch {
      setLastCheck(new Date().toLocaleTimeString("pt-PT"));
      setIsApiReachable(false);
      setStatusMessage(
        "API pública indisponível; nenhum feed ao vivo está disponível.",
      );
    }
  }, []);

  useEffect(() => {
    const initialCheck = window.setTimeout(() => {
      void checkTelemetry();
    }, 0);
    const interval = window.setInterval(() => {
      void checkTelemetry();
    }, 15000);

    return () => {
      window.clearTimeout(initialCheck);
      window.clearInterval(interval);
    };
  }, [checkTelemetry]);

  return {
    isApiReachable,
    statusMessage,
    lastCheck,
    liveFeed: NO_LIVE_FEED,
    recheck: checkTelemetry,
  };
}
