import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import { revalidatePath } from 'next/cache';

async function addIngestionLog(url: string, status: 'success' | 'error', slug?: string | null, error?: string | null) {
  const logPath = path.join(process.cwd(), 'eco', 'youlearn', 'data', 'ingestion-logs.json');
  try {
    let logs: any[] = [];
    try {
      const existingData = await fs.readFile(logPath, 'utf8');
      logs = JSON.parse(existingData);
      if (!Array.isArray(logs)) logs = [];
    } catch (e) {
      // Ignore if file doesn't exist
    }

    logs.push({
      url,
      timestamp: new Date().toISOString(),
      status,
      slug: slug || null,
      error: error || null,
    });

    // Cap history length to last 50 entries
    if (logs.length > 50) {
      logs = logs.slice(logs.length - 50);
    }

    await fs.writeFile(logPath, JSON.stringify(logs, null, 2), 'utf8');
  } catch (err) {
    console.error('[YouLearn Log Engine] Failed to write ingestion log:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || !url.startsWith('http')) {
      return NextResponse.json({ success: false, error: 'URL do YouTube inválida.' }, { status: 400 });
    }

    console.log(`[YouLearn API] Starting ingestion for: ${url}`);

    // Execute the ingestion script using tsx
    const scriptPath = path.join(process.cwd(), 'eco', 'youlearn', 'scripts', 'ingest.ts');
    const cmd = `npx tsx "${scriptPath}" "${url}"`;

    return new Promise<NextResponse>((resolve) => {
      exec(cmd, { cwd: process.cwd() }, async (error, stdout, stderr) => {
        if (error) {
          console.error(`[YouLearn API] Ingestion failed:`, error);
          console.error(stderr);
          
          await addIngestionLog(url, 'error', null, error.message || stderr);

          resolve(NextResponse.json({ 
            success: false, 
            error: error.message || 'Erro ao processar a ingestão.',
            details: stderr 
          }, { status: 500 }));
          return;
        }

        console.log(`[YouLearn API] Ingestion output:`, stdout);

        // Find the generated slug from the output
        const slugMatch = stdout.match(/Live Route:\s+(\S+)/);
        const slug = slugMatch ? slugMatch[1].split('/').pop() : null;

        await addIngestionLog(url, 'success', slug, null);

        try {
          revalidatePath('/eco/youlearn');
        } catch (revalErr) {
          console.error('[YouLearn API] Revalidation failed:', revalErr);
        }

        resolve(NextResponse.json({ 
          success: true, 
          slug: slug,
          message: 'Vídeo ingerido e cadastrado com sucesso!',
          stdout: stdout
        }));
      });
    });

  } catch (error: any) {
    console.error(`[YouLearn API] Ingest endpoint error:`, error);
    return NextResponse.json({ success: false, error: error.message || 'Erro interno do servidor.' }, { status: 500 });
  }
}
