'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Copy, Check, Download } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  description: string;
}

export default function SkillCard({ skill }: { skill: Skill }) {
  const { theme, themeContrast } = useTheme();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const getPromptExample = (name: string) => {
    const examples: Record<string, string> = {
      'algorithmic-art': 'Criar uma arte generativa baseada na turbulência orgânica com o tema do oceano usando p5.js.',
      'pdf': 'Extrair os textos principais deste arquivo PDF e formatá-los em Markdown.',
      'docx': 'Ler este arquivo Word, criar um índice e reescrever o conteúdo num tom corporativo.',
      'frontend-specialist': 'Analisar esse componente React e refatorá-lo aplicando os padrões de design de Glassmorphism da Agência 47.',
      'backend-specialist': 'Criar uma API RESTful em Node.js com paginação e validação para essa tabela do banco de dados.',
      'canvas-design': 'Desenhar um pôster minimalista com tipografia forte e paleta de cores escura.',
      'theme-factory': 'Gerar uma paleta de cores baseada em "cyberpunk neon" e aplicar nos meus componentes.',
      'documentation-writer': 'Escrever uma documentação técnica completa para essa função recém-criada.',
    };
    
    const defaultExample = 'Resolver essa tarefa complexa aplicando as melhores práticas e regras definidas na sua documentação.';
    return examples[name.toLowerCase()] || defaultExample;
  };

  const handleCopy = () => {
    const prompt = `Use a skill "${skill.name}" para ${getPromptExample(skill.name)}`;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(`/api/download-skill?id=${skill.id}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${skill.id}-skill.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed', error);
    } finally {
      setDownloading(false);
    }
  };

  const renderDescription = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <span key={i} className="text-white font-bold">{part.slice(2, -2)}</span>;
      }
      return part;
    });
  };

  return (
    <div 
      className="flex flex-col group relative rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl transition-all hover:bg-white/10"
      style={{ '--hover-color': theme.colors.primary, '--hover-shadow': `${theme.colors.primary}26`, '--hover-text': themeContrast } as any}
    >
      <style jsx>{`
        div:hover { border-color: var(--hover-color); box-shadow: 0 0 30px -5px var(--hover-shadow); }
        h3.title:hover { color: var(--hover-color); }
        .download-btn { background-color: var(--btn-bg); color: var(--btn-text); }
        .download-btn:hover:not(:disabled) { background-color: var(--hover-color); color: var(--hover-text); }
      `}</style>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="title text-xl font-semibold text-white transition-colors">
          {skill.name}
        </h3>
        <span className="inline-flex items-center rounded-lg bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/70 ring-1 ring-inset ring-white/20">
          Skill
        </span>
      </div>
      
      <p className="text-sm text-gray-400 mb-6 flex-grow line-clamp-4">
        {renderDescription(skill.description)}
      </p>
      
      <div className="mt-auto pt-6 border-t border-white/10 flex gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 active:bg-white/20"
        >
          {copied ? (
            <span className="flex items-center gap-2" style={{ color: theme.colors.primary }}>
              <Check className="w-4 h-4" />
              Copiado!
            </span>
          ) : (
            <span className="flex items-center gap-2 text-white/90 font-mono tracking-wider uppercase text-[11px]">
              <Copy className="w-3.5 h-3.5" />
              Prompt
            </span>
          )}
        </button>

        <button
          onClick={handleDownload}
          disabled={downloading}
          title="Baixar Skill (ZIP)"
          className="download-btn flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ '--btn-bg': `${theme.colors.primary}1A`, '--btn-text': theme.colors.primary } as any}
        >
          {downloading ? (
            <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          ) : (
            <Download className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
