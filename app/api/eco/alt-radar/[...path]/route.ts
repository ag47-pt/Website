import { NextRequest, NextResponse } from 'next/server';

const RADAR_API_BASE = process.env.ALT_RADAR_API_URL || 'http://127.0.0.1:8000/api/v1';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolvedParams = await params;
  const subPath = resolvedParams.path ? resolvedParams.path.join('/') : '';
  const search = request.nextUrl.search;
  const targetUrl = `${RADAR_API_BASE}/${subPath}${search}`;

  try {
    const res = await fetch(targetUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AG47-Eco-Proxy/1.0',
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          status: 'degraded',
          module: 'eco/alt-radar',
          path: subPath,
          message: 'Backend Python service starting or offline, returning fallback telemetry.',
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (_err) {
    return NextResponse.json(
      {
        status: 'online_proxy',
        module: 'eco/alt-radar',
        path: subPath,
        message: 'AG47 Eco Proxy bridge active. Backend microservice standby at eco/alt-radar/apps/api.',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolvedParams = await params;
  const subPath = resolvedParams.path ? resolvedParams.path.join('/') : '';
  const body = await request.json().catch(() => ({}));
  const targetUrl = `${RADAR_API_BASE}/${subPath}`;

  try {
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AG47-Eco-Proxy/1.0',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (_err) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Backend microservice unreachable at eco/alt-radar/apps/api.',
      },
      { status: 503 }
    );
  }
}
