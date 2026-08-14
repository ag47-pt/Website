'use client';

import React, { useState, useEffect } from 'react';
import { X, Video, Sparkles, AlertCircle, CheckCircle, Loader2, ArrowRight, Terminal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface IngestVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (slug: string) => void;
}

type IngestStatus = 'idle' | 'loading' | 'success' | 'error';

export function IngestVideoModal({ isOpen, onClose, onSuccess }: IngestVideoModalProps) {
  const router = useRouter();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [status, setStatus] = useState<IngestStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successSlug, setSuccessSlug] = useState<string | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch('/api/eco/youlearn/logs');
      const data = await res.json();
      if (data.success && data.logs) {
        setLogs(data.logs);
      }
    } catch (e) {
      console.error('[YouLearn Modal] Failed to load ingestion logs:', e);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl.trim() || !youtubeUrl.includes('http')) {
      setErrorMessage('Por favor, insira uma URL válida do YouTube.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    setConsoleOutput('');

    try {
      const response = await fetch('/api/eco/youlearn/ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: youtubeUrl.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Falha ao processar a ingestão.');
      }

      setConsoleOutput(data.stdout || '');
      setSuccessSlug(data.slug);
      setStatus('success');
      
      if (onSuccess && data.slug) {
        onSuccess(data.slug);
      }

      await fetchLogs();
      
      // Refresh the page data after a successful ingestion
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Ocorreu um erro inesperado.');
      setStatus('error');
      await fetchLogs();
    }
  };

  const handleGoToCourse = () => {
    if (successSlug) {
      onClose();
      // Reset state
      setYoutubeUrl('');
      setStatus('idle');
      setSuccessSlug(null);
      setConsoleOutput('');
      router.push(`/eco/youlearn/learn/${successSlug}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark Blur Overlay */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={status !== 'loading' ? onClose : undefined}
      />

      {/* Main Glass Modal Window */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-zinc-950/95 p-6 sm:p-8 shadow-[0_0_60px_rgba(209,255,0,0.15)] backdrop-blur-2xl transition-all z-10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/30 text-red-500">
              <Video className="h-5.5 w-5.5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Ingerir Novo Vídeo
                <span className="rounded bg-[#D1FF00]/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-[#D1FF00] border border-[#D1FF00]/30 animate-pulse">
                  Gemini AI
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">Scrape, destilação pedagógica e geração automática de conteúdo</p>
            </div>
          </div>

          {status !== 'loading' && (
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto pr-1">
          {status === 'idle' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="youtube-url" className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 font-bold">
                  URL do Vídeo do YouTube
                </label>
                <div className="relative">
                  <input
                    type="url"
                    id="youtube-url"
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/60 py-3.5 pl-4 pr-12 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#D1FF00] focus:ring-1 focus:ring-[#D1FF00]/30 transition-all font-mono"
                  />
                  <div className="absolute right-3 top-3 text-zinc-600">
                    <Video className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500 mt-2 font-mono">
                  Dica: Qualquer vídeo em qualquer idioma. O pipeline extrairá a legenda, traduzirá para Português, e compilará 6-8 seções interativas com Zod validation.
                </p>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#D1FF00] py-3.5 text-sm font-bold text-black shadow-[0_4px_20px_rgba(209,255,0,0.3)] hover:shadow-[0_4px_30px_rgba(209,255,0,0.5)] hover:scale-[1.01] active:scale-98 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>Iniciar Ingestão Autónoma</span>
              </button>
            </form>
          )}

          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="h-10 w-10 text-[#D1FF00] animate-spin mb-4" />
              <h3 className="text-base font-bold text-white">Processando Legendas & Metadados</h3>
              <p className="text-xs text-zinc-400 mt-2 max-w-md">
                Isso pode levar de 30 a 60 segundos. Estamos baixando a legenda, chamando o Gemini 2.5 Pro para sintetizar a pedagogia, gerando o módulo estático e rodando testes automatizados.
              </p>

              {/* Simulated Loading Console */}
              <div className="w-full mt-6 rounded-2xl border border-white/10 bg-black/80 p-4 text-left font-mono text-[11px] text-zinc-400 shadow-inner max-h-[160px] overflow-y-auto">
                <p className="text-[#D1FF00] flex items-center gap-1.5 mb-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D1FF00] animate-ping" />
                  <span>[Pipeline] Initializing worker...</span>
                </p>
                <p className="text-zinc-500 mb-1">[Phase 1/5] Extracting YouTube Transcript...</p>
                <p className="text-zinc-500 mb-1">[Phase 2/5] Synthesizing Pedagogy Structure via Gemini 2.5 Pro...</p>
                <p className="text-zinc-500 mb-1">[Phase 3/5] Compiling and registering catalog entries...</p>
                <p className="text-zinc-500">[Phase 4/5] Executing Jest/Zod checks and tsc compilation test...</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center text-center py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-white">Ingestão Concluída com Sucesso!</h3>
                <p className="text-xs text-zinc-400 mt-1">O novo curso foi gerado e registrado de forma 100% íntegra.</p>
              </div>

              {/* Terminal Output Display */}
              <div className="rounded-2xl border border-white/10 bg-black/90 p-4 text-left font-mono text-[11px] text-zinc-400 shadow-inner max-h-[220px] overflow-y-auto">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-2 text-zinc-500 text-[10px]">
                  <Terminal className="h-3.5 w-3.5 text-[#D1FF00]" />
                  <span>PIPELINE LOG CONSOLE</span>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed text-zinc-300 font-mono">
                  {consoleOutput || 'Sucesso.'}
                </pre>
              </div>

              {/* Navigation Action */}
              <button
                onClick={handleGoToCourse}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#D1FF00] py-3.5 text-sm font-bold text-black shadow-[0_4px_20px_rgba(209,255,0,0.3)] hover:shadow-[0_4px_30px_rgba(209,255,0,0.5)] transition-all"
              >
                <span>Acessar Nova Aula em Vídeo</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center text-center py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-3">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-white">Falha na Ingestão do Vídeo</h3>
                <p className="text-xs text-zinc-400 mt-1">Ocorreu um erro ao processar e compilar as legendas.</p>
              </div>

              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-xs font-mono text-rose-300 leading-relaxed max-h-[140px] overflow-y-auto">
                <span className="font-bold">Erro: </span>
                {errorMessage}
              </div>

              {/* Try Again */}
              <button
                onClick={() => setStatus('idle')}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-900 py-3.5 text-sm font-bold text-white hover:bg-zinc-800 transition-all"
              >
                <span>Tentar Novamente</span>
              </button>
            </div>
          )}

          {(status === 'idle' || status === 'error') && logs.length > 0 && (
            <div className="mt-8 border-t border-white/10 pt-6">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-[#D1FF00]" />
                Histórico Recente de Ingestões
              </h4>
              {loadingLogs && logs.length === 0 ? (
                <div className="flex items-center gap-2 justify-center py-4 text-xs text-zinc-500">
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                  <span>Carregando histórico...</span>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {logs.map((log, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-white/5 bg-white/5 p-3 hover:border-white/10 transition-all"
                    >
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="truncate text-xs font-mono text-zinc-300" title={log.url}>
                          {log.url}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
                          {new Date(log.timestamp).toLocaleString('pt-PT')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 font-mono">
                        {log.status === 'success' ? (
                          <>
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                              SUCESSO
                            </span>
                            {log.slug && (
                              <Link
                                href={`/eco/youlearn/learn/${log.slug}`}
                                onClick={onClose}
                                className="text-[11px] text-[#D1FF00] hover:underline"
                              >
                                Ver Aula
                              </Link>
                            )}
                          </>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-400 border border-rose-500/20 max-w-[80px] truncate"
                            title={log.error || undefined}
                          >
                            FALHA
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
