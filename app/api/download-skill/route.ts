import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const skillId = searchParams.get('id');

  if (!skillId) {
    return NextResponse.json({ error: 'ID da skill é obrigatório' }, { status: 400 });
  }

  // Prevent directory traversal attacks
  const cleanId = skillId.replace(/[^a-zA-Z0-9_-]/g, '');
  const skillPath = path.join(process.cwd(), '.agent', 'skills', cleanId);

  if (!fs.existsSync(skillPath)) {
    return NextResponse.json({ error: 'Skill não encontrada' }, { status: 404 });
  }

  try {
    const zip = new AdmZip();
    
    // Add the entire skill folder preserving structure
    zip.addLocalFolder(skillPath);

    const zipBuffer = zip.toBuffer();

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${cleanId}-skill.zip"`,
      },
    });
  } catch (error) {
    console.error('Erro ao gerar zip:', error);
    return NextResponse.json({ error: 'Erro ao gerar o arquivo zip' }, { status: 500 });
  }
}
