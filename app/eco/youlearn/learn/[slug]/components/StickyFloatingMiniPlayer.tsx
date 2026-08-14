'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, X, ChevronDown, ChevronUp, ExternalLink, Film, ArrowUp, Sparkles, Volume2, VolumeX, MonitorPlay, GripHorizontal } from 'lucide-react';
import { extractYoutubeId } from '@/eco/youlearn/lib/provenance';

interface StickyFloatingMiniPlayerProps {
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  authorName: string;
}

export function StickyFloatingMiniPlayer({
  videoUrl,
  thumbnailUrl,
  title,
  authorName,
}: StickyFloatingMiniPlayerProps) {
  const videoId = extractYoutubeId(videoUrl);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [activeStartTime, setActiveStartTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load initial saved states
  useEffect(() => {
    const savedMuted = localStorage.getItem('youlearn:muted') === 'true';
    const savedVolume = localStorage.getItem('youlearn:volume');
    setIsMuted(savedMuted);
    if (savedVolume !== null) {
      setVolume(Number(savedVolume));
    }

    if (videoId) {
      const savedTime = localStorage.getItem(`youlearn:resume:${videoId}`);
      if (savedTime) {
        const seconds = Number(savedTime);
        if (seconds > 0 && seconds < 100000) {
          setActiveStartTime(seconds);
        }
      }
    }
  }, [videoId]);

  // Dragging state
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; initialX: number; initialY: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    const currentX = position?.x ?? 0;
    const currentY = position?.y ?? 0;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: currentX,
      initialY: currentY,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;
    setPosition({
      x: dragStartRef.current.initialX + dx,
      y: dragStartRef.current.initialY + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = null;
    }
  };

  // Seek handler for mini-player
  useEffect(() => {
    const handleSeek = (e: CustomEvent<{ timeSeconds: number; autoplay: boolean }>) => {
      const { timeSeconds, autoplay } = e.detail;
      
      const isScrolledDown = window.scrollY > 480;
      if (!isScrolledDown || !isVisible || isCollapsed || isDismissed) return;

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
    };

    window.addEventListener('youlearn:seek' as any, handleSeek);
    return () => window.removeEventListener('youlearn:seek' as any, handleSeek);
  }, [isPlaying, isVisible, isCollapsed, isDismissed]);

  // Handoff logic: scrolling DOWN (Hero -> Floating)
  useEffect(() => {
    if (isVisible && !isDismissed && !isCollapsed) {
      const syncState = (window as any).youlearnPlayerSync;
      if (syncState && syncState.activePlayer === 'hero' && syncState.isPlaying) {
        // Pause the hero player
        window.dispatchEvent(new CustomEvent('youlearn:pause-hero'));
        
        // Start playing in floating player from the same timestamp
        setActiveStartTime(Math.floor(syncState.currentTime));
        setIsPlaying(true);
      }
    }
  }, [isVisible, isDismissed, isCollapsed]);

  // Handoff logic: scrolling UP (Floating -> Hero)
  const prevVisibleRef = useRef(isVisible);
  useEffect(() => {
    const wasVisible = prevVisibleRef.current;
    prevVisibleRef.current = isVisible;

    if (wasVisible && !isVisible) {
      // Scrolled up! If floating player was playing, transfer back to hero
      if (isPlaying) {
        setIsPlaying(false); // stop floating player
        
        const syncState = (window as any).youlearnPlayerSync;
        const timeToResume = syncState && syncState.activePlayer === 'floating' 
          ? Math.floor(syncState.currentTime) 
          : activeStartTime;
          
        window.dispatchEvent(new CustomEvent('youlearn:resume-hero', {
          detail: { timeSeconds: timeToResume }
        }));
      }
    }
  }, [isVisible, isPlaying, activeStartTime]);

  // YouTube Iframe PostMessage listener to update sync status
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (iframeRef.current && event.source === iframeRef.current.contentWindow) {
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (data.event === 'infoDelivery' && data.info) {
            const info = data.info;
            if (info.currentTime !== undefined) {
              (window as any).youlearnPlayerSync = {
                currentTime: info.currentTime,
                isPlaying: info.playerState === 1,
                activePlayer: 'floating',
                lastUpdated: Date.now(),
              };
              if (videoId) {
                localStorage.setItem(`youlearn:resume:${videoId}`, String(Math.floor(info.currentTime)));
              }
            }
            if (info.volume !== undefined) {
              localStorage.setItem('youlearn:volume', String(info.volume));
            }
            if (info.muted !== undefined) {
              localStorage.setItem('youlearn:muted', String(info.muted));
            }
          }
        } catch (e) {
          // not a youtube JSON message
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isPlaying, videoId]);

  // Sync volume state to iframe on start
  useEffect(() => {
    if (isPlaying && iframeRef.current && iframeRef.current.contentWindow) {
      const timer = setTimeout(() => {
        if (!iframeRef.current || !iframeRef.current.contentWindow) return;
        const savedVolume = localStorage.getItem('youlearn:volume');
        const savedMuted = localStorage.getItem('youlearn:muted') === 'true';

        if (savedVolume !== null) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'setVolume', args: [Number(savedVolume)] }),
            '*'
          );
        }
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: savedMuted ? 'mute' : 'unMute', args: [] }),
          '*'
        );
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isPlaying]);

  // Volume sync from other player
  useEffect(() => {
    const handleVolumeSync = (e: CustomEvent<{ muted: boolean; volume: number }>) => {
      const { muted, volume: newVolume } = e.detail;
      setIsMuted(muted);
      setVolume(newVolume);
      
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: muted ? 'mute' : 'unMute', args: [] }),
          '*'
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [newVolume] }),
          '*'
        );
      }
    };

    window.addEventListener('youlearn:volume-sync' as any, handleVolumeSync);
    return () => window.removeEventListener('youlearn:volume-sync' as any, handleVolumeSync);
  }, []);

  const handleVolumeCycle = () => {
    let newMuted = isMuted;
    let newVolume = volume;

    if (isMuted) {
      newMuted = false;
      newVolume = 100;
    } else if (volume === 100) {
      newVolume = 50;
    } else {
      newMuted = true;
    }

    setIsMuted(newMuted);
    setVolume(newVolume);
    localStorage.setItem('youlearn:muted', String(newMuted));
    localStorage.setItem('youlearn:volume', String(newVolume));

    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: newMuted ? 'mute' : 'unMute', args: [] }),
        '*'
      );
      if (!newMuted) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [newVolume] }),
          '*'
        );
      }
    }

    window.dispatchEvent(new CustomEvent('youlearn:volume-sync', {
      detail: { muted: newMuted, volume: newVolume }
    }));
  };

  const maxresThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : thumbnailUrl;
  const hqThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : thumbnailUrl;
  const effectiveThumbnail = imgError ? (hqThumbnail || thumbnailUrl) : (maxresThumbnail || thumbnailUrl);

  useEffect(() => {
    const handleScroll = () => {
      // Show mini-player once scrolled past 480px (past the hero section)
      if (window.scrollY > 480 && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!videoId || isDismissed || !isVisible) {
    return null;
  }

  return (
    <aside
      aria-label="Mini-Player Flutuante (Picture-in-Picture)"
      style={position ? { transform: `translate3d(${position.x}px, ${position.y}px, 0px)` } : undefined}
      className={`fixed bottom-20 right-4 sm:right-6 z-40 ${isDragging ? '' : 'transition-all duration-300 ease-out'}`}
    >
      {/* Collapsed Pill State */}
      {isCollapsed ? (
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`flex items-center gap-2 rounded-2xl border border-white/20 bg-zinc-950/90 p-2 shadow-2xl backdrop-blur-xl hover:border-[#D1FF00]/50 transition-all select-none touch-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          <button
            onClick={() => setIsCollapsed(false)}
            className="flex items-center gap-2.5 px-2.5 py-1 text-xs font-medium text-white hover:text-[#D1FF00] transition-colors"
            title="Expandir Mini-Player"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D1FF00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D1FF00]"></span>
            </span>
            <Film className="h-3.5 w-3.5 text-[#D1FF00]" />
            <span className="max-w-[140px] truncate text-[11px] font-mono">{authorName}</span>
            <ChevronUp className="h-3.5 w-3.5 text-zinc-400" />
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
            title="Fechar Mini-Player"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        /* Expanded Floating PiP Window */
        <div className="w-[280px] sm:w-[320px] overflow-hidden rounded-2xl border border-white/20 bg-zinc-950/95 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300 hover:border-[#D1FF00]/40">
          
          {/* Header Bar (Draggable handle) */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={`flex items-center justify-between border-b border-white/10 px-3 py-2 bg-black/60 select-none touch-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            <div className="flex items-center gap-2 truncate pr-2">
              <GripHorizontal className="h-3.5 w-3.5 text-zinc-400 hover:text-[#D1FF00] shrink-0" />
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D1FF00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D1FF00]"></span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#D1FF00] font-semibold flex items-center gap-1 shrink-0">
                <MonitorPlay className="h-3 w-3" />
                PiP Player
              </span>
              <span className="text-zinc-600">·</span>
              <span className="truncate text-[10px] font-mono text-zinc-400" title={authorName}>
                {authorName}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleVolumeCycle}
                className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title={isMuted ? 'Ativar Áudio (Muted)' : `Ajustar Volume (Atual: ${volume}%)`}
              >
                {isMuted ? (
                  <VolumeX className="h-3.5 w-3.5 text-rose-500" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5 text-[#D1FF00]" />
                )}
              </button>
              <button
                onClick={scrollToHero}
                className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Voltar ao topo da Hero"
              >
                <ArrowUp className="h-3 w-3" />
              </button>
              <button
                onClick={() => setIsCollapsed(true)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Minimizar Player"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsDismissed(true)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Fechar Player"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Video / Thumbnail Container */}
          <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden">
            {isPlaying ? (
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1&enablejsapi=1${activeStartTime ? `&start=${activeStartTime}` : ''}`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <div
                onClick={() => setIsPlaying(true)}
                className="group relative h-full w-full cursor-pointer overflow-hidden"
              >
                <img
                  src={effectiveThumbnail}
                  alt={title}
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                {/* Floating Centered Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D1FF00]/50 bg-black/80 text-[#D1FF00] shadow-[0_0_20px_rgba(209,255,0,0.4)] backdrop-blur-md group-hover:scale-110 group-hover:bg-[#D1FF00] group-hover:text-black transition-all">
                    <Play className="h-5 w-5 fill-current translate-x-0.5" />
                  </div>
                </div>

                {/* Bottom Quick Play Label */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono text-[#D1FF00] border border-white/10 backdrop-blur-md">
                    Clique para Assistir
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Title Bar & Actions */}
          <div className="p-2.5 bg-zinc-950/90 flex items-center justify-between gap-2 border-t border-white/5">
            <p className="truncate text-[11px] font-medium text-zinc-300" title={title}>
              {title}
            </p>

            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="h-2.5 w-2.5 text-red-500 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>YouTube</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-60" />
            </a>
          </div>

        </div>
      )}
    </aside>
  );
}
