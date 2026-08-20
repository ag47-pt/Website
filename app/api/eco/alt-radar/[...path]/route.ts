import { NextRequest, NextResponse } from "next/server";

const RADAR_API_BASE = (
  process.env.ALT_RADAR_API_URL ||
  "https://alt-radar-api-15974783507.europe-west3.run.app"
).replace(/\/+$/, "");
const UPSTREAM_TIMEOUT_MS = 8_000;

type RouteContext = { params: Promise<{ path?: string[] }> };

const PROXY_RESPONSE_HEADERS = {
  "Cache-Control": "no-store",
  "X-AG47-Fallback": "none",
  "X-AG47-Response-Origin": "upstream",
} as const;

function unavailableResponse(timedOut: boolean) {
  return NextResponse.json(
    {
      detail: timedOut
        ? "A API do Radar excedeu o tempo limite de resposta."
        : "Não foi possível ligar à API do Radar.",
      mode: "unavailable",
      success: false,
    },
    {
      status: timedOut ? 504 : 502,
      headers: {
        "Cache-Control": "no-store",
        "Retry-After": "30",
        "X-AG47-Fallback": "unavailable",
        "X-AG47-Response-Origin": "proxy",
      },
    },
  );
}

function readOnlyResponse() {
  return NextResponse.json(
    {
      detail: "O portal público do Radar é somente leitura.",
      mode: "read_only",
      success: false,
    },
    {
      status: 405,
      headers: {
        Allow: "GET",
        "Cache-Control": "no-store",
        "X-AG47-Access-Mode": "read-only",
        "X-AG47-Fallback": "none",
        "X-AG47-Response-Origin": "proxy",
      },
    },
  );
}

function isTimeoutError(error: unknown) {
  return error instanceof DOMException && error.name === "TimeoutError";
}

function copySafeUpstreamHeaders(upstream: Response) {
  const headers = new Headers(PROXY_RESPONSE_HEADERS);
  for (const name of ["content-disposition", "content-type", "retry-after"]) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  return headers;
}

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  const subPath = path.join("/");
  const targetUrl = `${RADAR_API_BASE}/${subPath}${request.nextUrl.search}`;
  const headers = new Headers({
    Accept: request.headers.get("accept") || "application/json",
    "User-Agent": "AG47-Eco-Proxy/1.0",
  });

  const apiKey = request.headers.get("x-ag47-api-key");
  if (apiKey) headers.set("x-ag47-api-key", apiKey);

  try {
    const upstream = await fetch(targetUrl, {
      method: "GET",
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    const responseBody = upstream.status === 204 ? null : upstream.body;

    return new NextResponse(responseBody, {
      status: upstream.status,
      headers: copySafeUpstreamHeaders(upstream),
    });
  } catch (error) {
    return unavailableResponse(isTimeoutError(error));
  }
}

export function GET(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export function POST(_request: NextRequest, _context: RouteContext) {
  return readOnlyResponse();
}

export function PATCH(_request: NextRequest, _context: RouteContext) {
  return readOnlyResponse();
}

export function DELETE(_request: NextRequest, _context: RouteContext) {
  return readOnlyResponse();
}
