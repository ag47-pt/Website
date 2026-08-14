'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ExternalLink, Film, Sparkles, RotateCcw, MonitorPlay, Image as ImageIcon, Maximize2, Minimize2, Tv, RefreshCw } from 'lucide-react';
import { extractYoutubeId } from '@/eco/youlearn/lib/provenance';

export type PlayerSizeMode = 'standard' | 'wide' | 'theater';

interface CinematicHeroPlayerProps {
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  initialTimeSeconds?: number;
  onSizeModeChange?: (mode: PlayerSizeMode) => void;
}

export function CinematicHeroPlayer({
  videoUrl,
  thumbnailUrl,
  title,
  initialTimeSeconds = 0,
  onSizeModeChange,
}: CinematicHeroPlayerProps) {
  const videoId = extractYoutubeId(videoUrl);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [sizeMode, setSizeMode] = useState<PlayerSizeMode>('wide');
  const [useNoCookie, setUseNoCookie] = useState(false);
  const [activeStartTime, setActiveStartTime] = useState(initialTimeSeconds);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleSeek = (e: CustomEvent<{ timeSeconds: number; autoplay: boolean }>) => {
      const { timeSeconds, autoplay } = e.detail;
      if (!isPlaying) {
        setActiveStartTime(timeSeconds);
        setIsPlaying(true);
      } else if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'seekTo', args: [timeSeconds, true] }),
          '*'
        );
        if (autoplay) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
            '*'
          );
        }
      }
      // Scroll to top to see the player
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('youlearn:seek' as any, handleSeek);
    return () => window.removeEventListener('youlearn:seek' as any, handleSeek);
  }, [isPlaying]);

  // High-res YouTube thumbnail with fallback to hqdefault
  const maxresThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : thumbnailUrl;
  const hqThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : thumbnailUrl;
  const effectiveThumbnail = imgError ? (hqThumbnail || thumbnailUrl) : (maxresThumbnail || thumbnailUrl);

  const startPlaying = () => {
    setIsPlaying(true);
  };

  const stopPlaying = () => {
    setIsPlaying(false);
  };

  const handleModeChange = (newMode: PlayerSizeMode) => {
    setSizeMode(newMode);
    if (onSizeModeChange) {
      onSizeModeChange(newMode);
    }
  };

  const sizeClasses: Record<PlayerSizeMode, string> = {
    standard: 'max-w-3xl',
    wide: 'max-w-5xl',
    theater: 'max-w-6xl w-full',
  };

  // Embed URL with reliable parameters and privacy-enhanced domain
  const embedDomain = useNoCookie ? 'https://www.youtube-nocookie.com' : 'https://www.youtube.com';
  const embedUrl = videoId
    ? `${embedDomain}/embed/${videoId}?autoplay=1&rel=0&playsinline=1&enablejsapi=1${activeStartTime ? `&start=${activeStartTime}` : ''}`
    : '';

  return (
    <div className={`mx-auto w-full transition-all duration-500 ease-out ${sizeClasses[sizeMode]}`}>
      {/* Top Control Bar: Size Presets & Status */}
      <div className="mb-2.5 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D1FF00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D1FF00]"></span>
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-1.5">
            <Film className="h-3.5 w-3.5 text-[#D1FF00]" />
            Cinema Master Player
          </span>
        </div>

        {/* Viewport Size Controls */}
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/60 p-1 backdrop-blur-md">
          <button
            onClick={() => handleModeChange('standard')}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-mono transition-all ${
              sizeMode === 'standard'
                ? 'bg-[#D1FF00] text-black font-bold shadow'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Tamanho Padrão (Compacto)"
          >
            <Minimize2 className="h-3 w-3" />
            <span className="hidden sm:inline">Padrão</span>
          </button>

          <button
            onClick={() => handleModeChange('wide')}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-mono transition-all ${
              sizeMode === 'wide'
                ? 'bg-[#D1FF00] text-black font-bold shadow'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Tamanho Amplo (Recomendado)"
          >
            <Tv className="h-3 w-3" />
            <span className="hidden sm:inline">Amplo</span>
          </button>

          <button
            onClick={() => handleModeChange('theater')}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-mono transition-all ${
              sizeMode === 'theater'
                ? 'bg-[#D1FF00] text-black font-bold shadow'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Modo Teatro (Expandido)"
          >
            <Maximize2 className="h-3 w-3" />
            <span className="hidden sm:inline">Teatro</span>
          </button>
        </div>
      </div>

      {/* Main Video Box */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-white/20 bg-zinc-950 shadow-[0_20px_60px_rgba(0,0,0,0.9)] transition-all duration-300 group hover:border-[#D1FF00]/40">
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
          
          {/* State A: Interactive Video Iframe */}
          {isPlaying && videoId ? (
            <div className="relative h-full w-full">
              <iframe
                ref={iframeRef}
                src={embedUrl}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />

              {/* Player Overlay Controls: Cover Switch & Direct YouTube Link */}
              <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
                <button
                  onClick={() => setUseNoCookie(!useNoCookie)}
                  className="flex items-center gap-1 rounded-full border border-white/20 bg-black/80 px-2.5 py-1 text-[10px] font-medium text-zinc-300 backdrop-blur-md hover:text-[#D1FF00] hover:border-[#D1FF00]/50 transition-all shadow-lg"
                  title="Alternar servidor de stream (Privacy / Standard)"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span className="hidden sm:inline">{useNoCookie ? 'NoCookie' : 'Standard'}</span>
                </button>

                <button
                  onClick={stopPlaying}
                  className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/80 px-3 py-1 text-[11px] font-medium text-zinc-200 backdrop-blur-md hover:bg-black hover:text-[#D1FF00] hover:border-[#D1FF00]/50 transition-all shadow-lg"
                  title="Voltar para exibição da capa"
                >
                  <ImageIcon className="h-3 w-3" />
                  <span>Capa</span>
                </button>
              </div>
            </div>
          ) : (
            /* State B: Cinematic High-Res Artwork & Play Trigger */
            <div
              onClick={startPlaying}
              className="relative h-full w-full cursor-pointer overflow-hidden group"
            >
              {/* High-Resolution Video Thumbnail */}
              <img
                src={effectiveThumbnail}
                alt={title}
                onError={() => setImgError(true)}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Dark Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px] transition-opacity group-hover:opacity-10" />

              {/* Top Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-3.5 py-1.5 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D1FF00] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D1FF00]"></span>
                  </span>
                  <span className="text-xs font-mono font-semibold text-white tracking-wider uppercase flex items-center gap-1.5">
                    <Film className="h-3.5 w-3.5 text-[#D1FF00]" />
                    Original Lecture
                  </span>
                </div>

                <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-mono text-zinc-300 backdrop-blur-md">
                  <MonitorPlay className="h-3.5 w-3.5 text-[#D1FF00]" />
                  <span>Full HD Stream</span>
                </div>
              </div>

              {/* Centered Glowing Play Button */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="flex h-18 w-18 sm:h-22 sm:w-22 items-center justify-center rounded-full border-2 border-[#D1FF00]/60 bg-black/75 text-[#D1FF00] shadow-[0_0_40px_rgba(209,255,0,0.35)] backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-[#D1FF00] group-hover:text-black group-hover:shadow-[0_0_60px_rgba(209,255,0,0.7)]">
                  <Play className="h-8 w-8 sm:h-10 sm:w-10 fill-current translate-x-0.5" />
                </div>
              </div>

              {/* Bottom Info Deck */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#D1FF00] px-3.5 py-1.5 text-xs font-bold text-black shadow-lg">
                    <Play className="h-3.5 w-3.5 fill-black" />
                    Iniciar Aula em Vídeo
                  </span>
                </div>

                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-black/70 px-3 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-md hover:bg-white/10 hover:text-white transition-colors"
                >
                  <svg className="h-3.5 w-3.5 text-red-500 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  <span>Abrir no YouTube</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
