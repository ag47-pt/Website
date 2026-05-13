import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

export async function GET() {
  const agentsPath = path.join(process.cwd(), '.agent');

  if (!fs.existsSync(agentsPath)) {
    return NextResponse.json({ error: 'Diretório .agent não encontrado' }, { status: 404 });
  }

  try {
    const zip = new AdmZip();
    zip.addLocalFolder(agentsPath);
    const zipBuffer = zip.toBuffer();

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="ag47-agent-dir.zip"`,
      },
    });
  } catch (error) {
    console.error('Erro ao gerar zip do diretório .agent:', error);
    return NextResponse.json({ error: 'Erro ao gerar o arquivo zip' }, { status: 500 });
  }
}
