const SAME_ORIGIN_RADAR_API_URL = "/api/eco/alt-radar";

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "[::1]", "::1"]);

function normalizedConfiguredUrl(configuredUrl: string) {
  const candidate = configuredUrl.trim().replace(/\/+$/, "");
  if (candidate.startsWith("/")) return candidate;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return candidate;
  } catch {
    return null;
  }
}

export function resolveRadarApiUrl(
  configuredUrl = process.env.NEXT_PUBLIC_API_URL,
  environment = process.env.NODE_ENV,
) {
  if (!configuredUrl) return SAME_ORIGIN_RADAR_API_URL;

  const normalized = normalizedConfiguredUrl(configuredUrl);
  if (!normalized) return SAME_ORIGIN_RADAR_API_URL;
  if (normalized.startsWith("/")) return normalized;

  const hostname = new URL(normalized).hostname.toLowerCase();
  if (environment === "production" && LOOPBACK_HOSTS.has(hostname)) {
    return SAME_ORIGIN_RADAR_API_URL;
  }

  return normalized;
}

export const RADAR_API_URL = resolveRadarApiUrl();
