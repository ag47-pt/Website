import { ZodError, type ZodType, z } from "zod";
import {
  alertsResponseSchema,
  evolutionStatusSchema,
  marketHistorySchema,
  opportunitiesResponseSchema,
  riskSchema,
  scoreSchema,
  socialResponseSchema,
  systemStatusSchema,
  timelineResponseSchema,
  tokenDetailSchema,
  watchlistItemSchema,
  watchlistResponseSchema,
  operatorInboxResponseSchema,
  userNotificationSettingsSchema,
  notificationDeliveryDetailSchema,
  paginatedSchema,
  type OpportunityFilters,
} from "./schemas";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
const REQUEST_TIMEOUT_MS = 12_000;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function createRequestSignal(signal?: AbortSignal) {
  const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  return signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;
}

async function parseResponse<T>(response: Response, schema: ZodType<T>): Promise<T> {
  if (!response.ok) {
    let detail = `A API respondeu com estado ${response.status}.`;
    try {
      const body = (await response.json()) as {
        detail?: string;
        error?: { message?: string };
      };
      if (body.error?.message) detail = body.error.message;
      else if (body.detail) detail = body.detail;
    } catch {
      // The status code remains the safe diagnostic when no JSON error is returned.
    }
    throw new ApiError(detail, response.status);
  }

  return schema.parse(await response.json());
}

async function apiRequest<T>(path: string, schema: ZodType<T>, init: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
      signal: createRequestSignal(init.signal ?? undefined),
    });
    return await parseResponse(response, schema);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof ZodError) {
      throw new ApiError("A API respondeu com um contrato de dados incompatível.");
    }
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new ApiError("A API excedeu o tempo limite de resposta.");
    }
    throw new ApiError("Não foi possível ligar ao serviço do Radar.");
  }
}

function buildOpportunitySearch(filters: OpportunityFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  filters.chains?.forEach((chain) => params.append("chain", chain));
  if (filters.minScore !== undefined) params.set("min_score", String(filters.minScore));
  if (filters.maxRisk !== undefined) params.set("max_risk", String(filters.maxRisk));
  if (filters.maxPairAgeHours !== undefined) {
    params.set("max_pair_age_hours", String(filters.maxPairAgeHours));
  }
  if (filters.minLiquidity !== undefined) {
    params.set("min_liquidity", String(filters.minLiquidity));
  }
  if (filters.sortBy) params.set("sort_by", filters.sortBy);
  if (filters.sortOrder) params.set("sort_order", filters.sortOrder);
  params.set("page", String(filters.page ?? 1));
  params.set("page_size", String(filters.pageSize ?? 10));
  return params.toString();
}

export const radarApi = {
  getSystemStatus(signal?: AbortSignal) {
    return apiRequest("/api/v1/system/status", systemStatusSchema, { signal });
  },
  getEvolution(signal?: AbortSignal) {
    return apiRequest("/api/v1/system/evolution", evolutionStatusSchema, { signal });
  },
  getOpportunities(filters: OpportunityFilters, signal?: AbortSignal) {
    return apiRequest(
      `/api/v1/opportunities?${buildOpportunitySearch(filters)}`,
      opportunitiesResponseSchema,
      { signal },
    );
  },
  getToken(tokenId: string, signal?: AbortSignal) {
    return apiRequest(`/api/v1/tokens/${tokenId}`, tokenDetailSchema, { signal });
  },
  getMarketHistory(tokenId: string, interval: string, signal?: AbortSignal) {
    return apiRequest(
      `/api/v1/tokens/${tokenId}/market-history?interval=${encodeURIComponent(interval)}`,
      marketHistorySchema,
      { signal },
    );
  },
  getSocial(tokenId: string, signal?: AbortSignal) {
    return apiRequest(`/api/v1/tokens/${tokenId}/social`, socialResponseSchema, { signal });
  },
  getTokenTimeline(tokenId: string, page = 1, pageSize = 20, signal?: AbortSignal) {
    return apiRequest(
      `/api/v1/tokens/${tokenId}/timeline?page=${page}&page_size=${pageSize}`,
      timelineResponseSchema,
      { signal },
    );
  },
  getRisk(tokenId: string, signal?: AbortSignal) {
    return apiRequest(`/api/v1/tokens/${tokenId}/risk`, riskSchema, { signal });
  },
  getScore(tokenId: string, signal?: AbortSignal) {
    return apiRequest(`/api/v1/tokens/${tokenId}/score`, scoreSchema, { signal });
  },
  getAlerts(page = 1, pageSize = 20, signal?: AbortSignal) {
    return apiRequest(`/api/v1/alerts?page=${page}&page_size=${pageSize}`, alertsResponseSchema, {
      signal,
    });
  },
  getEdgeInboxAlerts(page = 1, pageSize = 20, confidenceLevel?: string, signal?: AbortSignal) {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    if (confidenceLevel && confidenceLevel !== "all") {
      params.set("confidence_level", confidenceLevel);
    }
    return apiRequest(`/api/v1/alerts/edge-inbox?${params.toString()}`, operatorInboxResponseSchema, {
      signal,
    });
  },
  updateAlert(alertId: string, status: "unread" | "read" | "acknowledged" | "dismissed") {
    return apiRequest(
      `/api/v1/alerts/${alertId}`,
      alertsResponseSchema.shape.items.element, // Return schema is a single alert (TokenAlertRead)
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
    );
  },
  getWatchlist(page = 1, pageSize = 50, signal?: AbortSignal) {
    return apiRequest(
      `/api/v1/watchlist?page=${page}&page_size=${pageSize}`,
      watchlistResponseSchema,
      { signal },
    );
  },
  addToWatchlist(tokenId: string, notes?: string) {
    return apiRequest("/api/v1/watchlist", watchlistItemSchema, {
      method: "POST",
      body: JSON.stringify({ token_id: tokenId, notes: notes || undefined }),
    });
  },
  async removeFromWatchlist(tokenId: string) {
    const response = await fetch(`${API_URL}/api/v1/watchlist/${tokenId}`, {
      method: "DELETE",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok && response.status !== 204) {
      throw new ApiError(`Não foi possível remover o token (${response.status}).`, response.status);
    }
  },
  resetProviderCircuit(providerId: string) {
    return apiRequest(
      `/api/v1/system/providers/${encodeURIComponent(providerId)}/reset-circuit`,
      z.object({ success: z.boolean() }),
      {
        method: "POST",
      },
    );
  },
  getUserNotificationSettings() {
    return apiRequest(
      "/api/v1/system/notification-settings",
      userNotificationSettingsSchema
    );
  },
  updateUserNotificationSettings(payload: { min_severity: number; min_confidence: number; allowed_chains: string[] }) {
    return apiRequest(
      "/api/v1/system/notification-settings",
      userNotificationSettingsSchema,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },
  getSystemNotifications(page = 1, pageSize = 20, status?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (status) params.set("status", status);
    
    return apiRequest(
      `/api/v1/system/notifications?${params.toString()}`,
      paginatedSchema(notificationDeliveryDetailSchema)
    );
  },
};

