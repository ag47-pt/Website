"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { radarApi } from "./client";
import type { OpportunityFilters } from "./schemas";

export const queryKeys = {
  status: ["system-status"] as const,
  evolution: ["system-evolution"] as const,
  opportunities: (filters: OpportunityFilters) => ["opportunities", filters] as const,
  token: (tokenId: string) => ["token", tokenId] as const,
  history: (tokenId: string, interval: string) => ["history", tokenId, interval] as const,
  social: (tokenId: string) => ["social", tokenId] as const,
  timeline: (tokenId: string, page: number) => ["timeline", tokenId, page] as const,
  risk: (tokenId: string) => ["risk", tokenId] as const,
  score: (tokenId: string) => ["score", tokenId] as const,
  alerts: (page: number, pageSize: number) => ["alerts", page, pageSize] as const,
  watchlist: ["watchlist"] as const,
};

export function useSystemStatus() {
  return useQuery({
    queryKey: queryKeys.status,
    queryFn: ({ signal }) => radarApi.getSystemStatus(signal),
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}

export function useEvolution() {
  return useQuery({
    queryKey: queryKeys.evolution,
    queryFn: ({ signal }) => radarApi.getEvolution(signal),
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useOpportunities(filters: OpportunityFilters) {
  return useQuery({
    queryKey: queryKeys.opportunities(filters),
    queryFn: ({ signal }) => radarApi.getOpportunities(filters, signal),
    placeholderData: (previous) => previous,
    staleTime: 20_000,
  });
}

export function useToken(tokenId: string | null) {
  return useQuery({
    queryKey: queryKeys.token(tokenId ?? "__none__"),
    queryFn: ({ signal }) => radarApi.getToken(tokenId!, signal),
    enabled: tokenId !== null,
    staleTime: 20_000,
  });
}

export function useMarketHistory(tokenId: string | null, interval: string) {
  return useQuery({
    queryKey: queryKeys.history(tokenId ?? "__none__", interval),
    queryFn: ({ signal }) => radarApi.getMarketHistory(tokenId!, interval, signal),
    enabled: tokenId !== null,
    staleTime: 30_000,
  });
}

export function useSocial(tokenId: string | null) {
  return useQuery({
    queryKey: queryKeys.social(tokenId ?? "__none__"),
    queryFn: ({ signal }) => radarApi.getSocial(tokenId!, signal),
    enabled: tokenId !== null,
    staleTime: 30_000,
  });
}

export function useTimeline(tokenId: string | null, page = 1) {
  return useQuery({
    queryKey: queryKeys.timeline(tokenId ?? "__none__", page),
    queryFn: ({ signal }) => radarApi.getTokenTimeline(tokenId!, page, 20, signal),
    enabled: tokenId !== null,
    staleTime: 30_000,
  });
}

export function useRisk(tokenId: string | null) {
  return useQuery({
    queryKey: queryKeys.risk(tokenId ?? "__none__"),
    queryFn: ({ signal }) => radarApi.getRisk(tokenId!, signal),
    enabled: tokenId !== null,
    staleTime: 30_000,
  });
}

export function useScore(tokenId: string | null) {
  return useQuery({
    queryKey: queryKeys.score(tokenId ?? "__none__"),
    queryFn: ({ signal }) => radarApi.getScore(tokenId!, signal),
    enabled: tokenId !== null,
    staleTime: 30_000,
  });
}

export function useAlerts(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: queryKeys.alerts(page, pageSize),
    queryFn: ({ signal }) => radarApi.getAlerts(page, pageSize, signal),
    staleTime: 15_000,
  });
}

export function useEdgeInbox(page = 1, pageSize = 20, confidenceLevel?: string) {
  return useQuery({
    queryKey: ["edge-inbox", page, pageSize, confidenceLevel],
    queryFn: ({ signal }) => radarApi.getEdgeInboxAlerts(page, pageSize, confidenceLevel, signal),
    staleTime: 15_000,
  });
}

export function useAlertMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      alertId,
      status,
    }: {
      alertId: string;
      status: "unread" | "read" | "acknowledged" | "dismissed";
    }) => radarApi.updateAlert(alertId, status),
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["alerts"] }),
        queryClient.invalidateQueries({ queryKey: ["edge-inbox"] }),
      ]);
    },
  });
}

export function useWatchlist(page = 1, pageSize = 50) {
  return useQuery({
    queryKey: [...queryKeys.watchlist, page, pageSize],
    queryFn: ({ signal }) => radarApi.getWatchlist(page, pageSize, signal),
    staleTime: 15_000,
  });
}

export function useWatchlistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tokenId, isWatchlisted }: { tokenId: string; isWatchlisted: boolean }) => {
      if (isWatchlisted) {
        await radarApi.removeFromWatchlist(tokenId);
        return;
      }
      await radarApi.addToWatchlist(tokenId);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["opportunities"] }),
        queryClient.invalidateQueries({ queryKey: queryKeys.watchlist }),
        queryClient.invalidateQueries({ queryKey: ["token"] }),
        queryClient.invalidateQueries({ queryKey: ["alerts"] }),
      ]);
    },
  });
}
