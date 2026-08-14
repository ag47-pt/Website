import { NextResponse } from 'next/server';
import { DEMO_LIBRARY_ENTRIES } from '@/eco/youlearn/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      entries: DEMO_LIBRARY_ENTRIES
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Falha ao recuperar registros do catálogo.'
    }, { status: 500 });
  }
}
