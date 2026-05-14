'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/config/supabase';
import { Loader2, ArrowLeft, Maximize2, Monitor, Smartphone, Tablet } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function SandboxPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const [projectData, setProjectData] = useState<{ url?: string; fileUrl?: string } | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSource, setActiveSource] = useState<'link' | 'file'>('file');
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    async function fetchProjectAndContent() {
      const { data, error } = await supabase
        .from('labs_projects')
        .select('sandbox_url, sandbox_file_url')
        .eq('slug', slug)
        .single();

      if (data) {
        setProjectData({
          url: data.sandbox_url,
          fileUrl: data.sandbox_file_url
        });
        
        // Se houver apenas link, muda para link
        if (!data.sandbox_file_url && data.sandbox_url) {
          setActiveSource('link');
        }

        // Busca conteúdo do arquivo se existir
        if (data.sandbox_file_url) {
          try {
            const response = await fetch(data.sandbox_file_url);
            const text = await response.text();
            setHtmlContent(text);
          } catch (err) {
            console.error('Erro ao buscar conteúdo do protótipo:', err);
          }
        }
      }
      setLoading(false);
    }
    fetchProjectAndContent();
  }, [slug]);

  const toggleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: theme.colors.primary }} />
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 text-center">
          Iniciando Sandbox Virtual...
        </p>
      </div>
    );
  }

  if (!projectData?.url && !projectData?.fileUrl) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center gap-6">
        <div className="text-zinc-800 font-black text-8xl opacity-20">404</div>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Sandbox não configurada para este projeto.</p>
        <button onClick={() => router.back()} className="px-6 py-2 border border-white/10 text-white rounded-full text-xs hover:bg-white/5 transition-all">
          Voltar para Vitrine
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#050505] overflow-hidden">
      {/* Sandbox Header */}
      <div className="h-14 shrink-0 bg-black/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-white" />
          </button>
          <div className="h-4 w-px bg-white/10" />
          
          {/* Source Switcher */}
          <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-white/5 gap-1">
            {projectData.url && (
              <button 
                onClick={() => setActiveSource('link')}
                className={`px-3 py-1 rounded text-[9px] font-black tracking-widest transition-all ${activeSource === 'link' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                VERSÃO WEB
              </button>
            )}
            {projectData.fileUrl && (
              <button 
                onClick={() => setActiveSource('file')}
                className={`px-3 py-1 rounded text-[9px] font-black tracking-widest transition-all ${activeSource === 'file' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                PROTÓTIPO HTML
              </button>
            )}
          </div>
        </div>

        {/* Device Switcher */}
        <div className="hidden md:flex items-center bg-zinc-900/50 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setViewMode('desktop')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-white/10 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('tablet')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'tablet' ? 'bg-white/10 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('mobile')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-white/10 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <button 
          onClick={toggleFullscreen}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all hover:brightness-110 active:scale-95"
          style={{ backgroundColor: theme.colors.primary, color: '#000' }}
        >
          <Maximize2 className="w-3 h-3" /> Full View
        </button>
      </div>

      {/* Viewport Area */}
      <div className="grow overflow-auto p-4 md:p-10 flex justify-center items-start scrollbar-hide">
        <div 
          className="transition-all duration-500 ease-in-out bg-white shadow-2xl rounded-sm overflow-hidden"
          style={{ 
            width: viewMode === 'desktop' ? '100%' : viewMode === 'tablet' ? '768px' : '375px',
            height: viewMode === 'desktop' ? '100%' : '812px',
            maxWidth: '100%'
          }}
        >
          {activeSource === 'file' && htmlContent ? (
            <iframe 
              ref={iframeRef}
              srcDoc={htmlContent}
              className="w-full h-full border-none bg-white"
              title="Sandbox View"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            />
          ) : activeSource === 'link' && projectData?.url ? (
            <iframe 
              ref={iframeRef}
              src={projectData.url}
              className="w-full h-full border-none bg-white"
              title="Sandbox View"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
              Selecione uma fonte de visualização
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
