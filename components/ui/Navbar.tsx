'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LayoutGrid, Network, Radio, Compass, Rocket } from 'lucide-react';
import { SitemapHoverPopover } from '@/app/labs/components/SitemapHoverPopover';

export function Navbar({ 
  progressRef, 
  onChangeEarth 
}: { 
  progressRef: React.RefObject<HTMLDivElement | null>,
  onChangeEarth: () => void
}) {
  const { theme, themeName, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const scrollToPercent = (e: React.MouseEvent, percent: number) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: scrollHeight * percent, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!mobileMenuRef.current) return;
      if (mobileMenuOpen && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [mobileMenuOpen]);

  const mobileMenuItems = [
    {
      label: 'Sites',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
      onClick: (e: React.MouseEvent) => scrollToPercent(e, 0.25),
    },
    {
      label: 'APPs',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
      ),
      onClick: (e: React.MouseEvent) => scrollToPercent(e, 0.45),
    },
    {
      label: 'Social',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      ),
      onClick: (e: React.MouseEvent) => scrollToPercent(e, 0.65),
    },
    {
      label: 'Ads',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
          <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
      ),
      onClick: (e: React.MouseEvent) => scrollToPercent(e, 0.85),
    },
    {
      label: 'Universo 2D',
      badge: 'NOVO',
      icon: (
        <div className="relative flex items-center justify-center">
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="transition-transform duration-500 group-hover:rotate-180 text-cyan-400/90 group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_8px_rgba(122,216,255,0.8)]"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-300/90 shadow-[0_0_8px_#38bdf8]" />
          </span>
        </div>
      ),
      href: '/universo-2d',
    },
    {
      label: 'LABS HUB',
      badge: 'SITEMAP',
      isSitemap: true,
      icon: <LayoutGrid className="w-4 h-4" />,
      href: '/labs',
    },
    {
      label: 'ECO HUB',
      badge: 'SITEMAP',
      isSitemap: true,
      icon: <Network className="w-4 h-4" />,
      href: '/eco',
    },
    {
      label: 'Lançar',
      icon: <Rocket className="w-4 h-4" />,
      onClick: (e: React.MouseEvent) => scrollToPercent(e, 1),
    },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-white/5 backdrop-blur-xl border-b border-white/20 pointer-events-auto">
       <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
         <div className="flex items-center gap-3 md:gap-5">
           <div 
             className="text-white font-black text-2xl md:text-3xl tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent cursor-pointer"
             onClick={(e) => scrollToPercent(e, 0)}
           >
             AG47
           </div>

           {/* Botão de Alterar Terra */}
            <button 
              onClick={onChangeEarth}
              className="w-9 h-9 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
              aria-label="Mudar Visão do Planeta"
            >
              <div className="w-4 h-4 rounded-full border border-white/30 group-hover:border-white/60 transition-colors relative z-10">
                <div className="absolute inset-[1px] rounded-full border border-white/10 group-hover:border-white/20" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <ThemeSwitcher themeName={themeName} onToggle={toggleTheme} />
          </div>

         {/* Desktop Links */}
         <div className="hidden lg:flex items-center gap-5 text-white/80 font-bold text-xs tracking-[0.2em] uppercase">
            <a href="#" onClick={(e) => scrollToPercent(e, 0.25)} className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all">Sites</a>
            <a href="#" onClick={(e) => scrollToPercent(e, 0.45)} className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all">APPs</a>
            <a href="#" onClick={(e) => scrollToPercent(e, 0.65)} className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all">Social</a>
            <a href="#" onClick={(e) => scrollToPercent(e, 0.85)} className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all">Ads</a>
            <Link
              href="/universo-2d"
              className="group flex items-center gap-1.5 hover:text-[#7ad8ff] transition-all duration-300 relative py-1"
            >
              <div className="relative flex items-center justify-center">
                <svg 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="transition-transform duration-500 group-hover:rotate-180 text-cyan-400/80 group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_8px_rgba(122,216,255,0.9)]"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5 pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-300/90 shadow-[0_0_6px_#38bdf8]" />
                </span>
              </div>
              <span className="group-hover:drop-shadow-[0_0_10px_rgba(122,216,255,0.9)] transition-all">
                Universo 2D
              </span>
              <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded tracking-widest font-black uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_8px_rgba(34,211,238,0.3)] transition-all">
                NOVO
              </span>
            </Link>

            {/* Visual Sitemap: LABS HUB */}
            <SitemapHoverPopover target="labs">
              <Link 
                href="/labs" 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-300 hover:scale-105"
                style={{ 
                  color: theme.colors.primary, 
                  borderColor: `${theme.colors.primary}50`,
                  backgroundColor: `${theme.colors.primary}15`,
                  boxShadow: `0 0 12px ${theme.colors.primary}20`,
                }}
              >
                <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                <span>LABS HUB</span>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded tracking-widest font-black uppercase bg-black/60 text-white border border-white/10">
                  MAP
                </span>
              </Link>
            </SitemapHoverPopover>

            {/* Visual Sitemap: ECO HUB */}
            <SitemapHoverPopover target="eco">
              <Link 
                href="/eco" 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-300 hover:scale-105"
                style={{ 
                  color: theme.colors.primary, 
                  borderColor: `${theme.colors.primary}50`,
                  backgroundColor: `${theme.colors.primary}15`,
                  boxShadow: `0 0 12px ${theme.colors.primary}20`,
                }}
              >
                <Network className="w-3.5 h-3.5 shrink-0" />
                <span>ECO HUB</span>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded tracking-widest font-black uppercase bg-black/60 text-white border border-white/10">
                  MAP
                </span>
              </Link>
            </SitemapHoverPopover>
            
            {/* Botão Lançar com efeito Cometa (Refinado - Branco) */}
            <button 
              onClick={(e) => scrollToPercent(e, 1)} 
              className="relative group px-5 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 text-white font-black text-[10px] tracking-[0.2em] uppercase transition-all duration-500 hover:scale-110 active:scale-95 overflow-hidden ml-2"
            >
              <span className="relative z-10">Lançar</span>
              
              {/* Núcleo do Cometa (Branco) */}
              <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-8 bg-white animate-pulse opacity-10 blur-xl" />
              
              {/* Luz Pulsante Branca Suave em Volta */}
              <div className="absolute -inset-[2px] rounded-full bg-white/5 blur-sm animate-pulse" />
              
              {/* Glow Externo Branco Refinado */}
              <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-500" />
            </button>
         </div>

         {/* Tablet & Small Desktop intermediate */}
         <div className="hidden md:flex lg:hidden items-center gap-3">
            <Link 
              href="/labs" 
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold"
              style={{ 
                color: theme.colors.primary, 
                borderColor: `${theme.colors.primary}50`,
                backgroundColor: `${theme.colors.primary}15`,
              }}
            >
              <LayoutGrid className="w-3 h-3" />
              LABS
            </Link>
            <Link 
              href="/eco" 
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold"
              style={{ 
                color: theme.colors.primary, 
                borderColor: `${theme.colors.primary}50`,
                backgroundColor: `${theme.colors.primary}15`,
              }}
            >
              <Network className="w-3 h-3" />
              ECO
            </Link>
         </div>

         {/* Mobile Buttons with overflow menu */}
         <div className="flex md:hidden items-center gap-2" ref={mobileMenuRef}>
            <button 
              onClick={(e) => scrollToPercent(e, 0.25)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex flex-col items-center justify-center text-white/60 hover:text-white transition-all active:scale-90"
              aria-label="Sites"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <span className="text-[9px] uppercase tracking-[0.2em] mt-0.5 text-white/70">Sites</span>
            </button>
            <button 
              onClick={(e) => scrollToPercent(e, 0.45)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex flex-col items-center justify-center text-white/60 hover:text-white transition-all active:scale-90"
              aria-label="APPs"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              <span className="text-[9px] uppercase tracking-[0.2em] mt-0.5 text-white/70">APPs</span>
            </button>
            <div className="relative">
               <button
                 onClick={() => setMobileMenuOpen((current) => !current)}
                 className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-90"
                 aria-expanded={mobileMenuOpen}
                 aria-haspopup="menu"
                 aria-label="Abrir menu de ações"
               >
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
               </button>
               {mobileMenuOpen && (
                 <div className="absolute right-0 top-full mt-2 min-w-[240px] rounded-3xl border border-white/10 bg-zinc-950/95 backdrop-blur-2xl shadow-2xl p-2 z-50 space-y-1">
                   {mobileMenuItems.map((item) => (
                     item.href ? (
                       <Link
                         key={item.label}
                         href={item.href}
                         onClick={() => setMobileMenuOpen(false)}
                         className={`group flex items-center justify-between w-full rounded-2xl px-3.5 py-2.5 transition-all ${
                           item.isSitemap
                             ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                             : 'text-white/80 hover:bg-white/10'
                         }`}
                         style={
                           item.isSitemap
                             ? {
                                 borderColor: `${theme.colors.primary}40`,
                                 backgroundColor: `${theme.colors.primary}12`,
                               }
                             : {}
                         }
                       >
                         <div className="flex items-center gap-3">
                           <div style={item.isSitemap ? { color: theme.colors.primary } : {}}>
                             {item.icon}
                           </div>
                           <span className="text-xs font-bold tracking-wider">{item.label}</span>
                         </div>
                          {item.badge && (
                            <span
                              className={`text-[7px] font-mono px-1.5 py-0.5 rounded tracking-widest font-black uppercase border ${
                                item.badge === 'NOVO'
                                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40 shadow-[0_0_8px_rgba(34,211,238,0.25)]'
                                  : 'bg-black text-white border border-white/10'
                              }`}
                              style={item.badge !== 'NOVO' ? { color: theme.colors.primary } : {}}
                            >
                              {item.badge}
                            </span>
                          )}
                       </Link>
                     ) : (
                       <button
                         type="button"
                         key={item.label}
                         onClick={(e) => {
                           item.onClick?.(e);
                           setMobileMenuOpen(false);
                         }}
                         className="flex items-center gap-3 w-full rounded-2xl px-3.5 py-2.5 text-white/80 hover:bg-white/10 transition-colors"
                       >
                         {item.icon}
                         <span className="text-xs font-bold tracking-wider">{item.label}</span>
                       </button>
                     )
                   ))}
                 </div>
               )}
            </div>
         </div>
       </div>
        <div 
          className="absolute bottom-0 left-0 h-[3px] transition-all duration-100 ease-out shadow-lg" 
          ref={progressRef} 
          style={{ 
            width: '0%',
            background: `linear-gradient(to right, transparent, ${theme.colors.secondary}, ${theme.colors.primary})`,
            boxShadow: `0 0 15px ${theme.colors.primary}CC`
          }}
        >
          <div 
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-white rounded-full"
            style={{ 
              boxShadow: `0 0 15px 4px ${theme.colors.primary}, 0 0 30px 8px ${theme.colors.secondary}CC`
            }}
          >
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
         </div>
       </div>
    </nav>
  )
}
