import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

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
      exec(cmd, { cwd: process.cwd() }, (error, stdout, stderr) => {
        if (error) {
          console.error(`[YouLearn API] Ingestion failed:`, error);
          console.error(stderr);
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
