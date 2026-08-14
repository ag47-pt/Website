import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const logPath = path.join(process.cwd(), 'eco', 'youlearn', 'data', 'ingestion-logs.json');
  try {
    let logs = [];
    try {
      const logData = await fs.readFile(logPath, 'utf8');
      logs = JSON.parse(logData);
    } catch (e) {
      // Return empty array if file does not exist yet
    }

    // Return newest logs first
    if (Array.isArray(logs)) {
      logs.reverse();
    } else {
      logs = [];
    }

    return NextResponse.json({
      success: true,
      logs
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Falha ao ler os logs de ingestão.'
    }, { status: 500 });
  }
}
