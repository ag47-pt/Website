'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { ThemeSwitcher } from './ThemeSwitcher';

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
    e.preventDefault()
    if (typeof window !== 'undefined') {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo({ top: scrollHeight * percent, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!mobileMenuRef.current) return
      if (mobileMenuOpen && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [mobileMenuOpen])

  const mobileMenuItems = [
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
      label: 'Labs',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v10" />
          <path d="M18.4 4.6a9 9 0 1 1-12.8 0" />
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        </svg>
      ),
      href: '/labs',
    },
    {
      label: 'Rest.AG',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 2h18" />
          <path d="M5 2v6a7 7 0 0 0 14 0V2" />
          <path d="M19 14.5A9.5 9.5 0 0 1 12 17a9.5 9.5 0 0 1-7-2.5" />
          <path d="M12 17v5" />
        </svg>
      ),
      href: '/rest',
    },
    {
      label: 'Lançar',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        </svg>
      ),
      onClick: (e: React.MouseEvent) => scrollToPercent(e, 1),
    },
  ]

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

           {/* Botão de Alterar Terra - Agora ao lado do logo */}
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
         <div className="hidden md:flex items-center gap-8 text-white/80 font-bold text-xs tracking-[0.2em] uppercase">
            <a href="#" onClick={(e) => scrollToPercent(e, 0.25)} className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all">Sites</a>
            <a href="#" onClick={(e) => scrollToPercent(e, 0.45)} className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all">APPs</a>
            <a href="#" onClick={(e) => scrollToPercent(e, 0.65)} className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all">Social</a>
            <a href="#" onClick={(e) => scrollToPercent(e, 0.85)} className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all">Ads</a>
            <Link
              href="/rest"
              className="hover:text-[#7ad8ff] hover:drop-shadow-[0_0_10px_rgba(122,216,255,0.8)] transition-all"
            >
              Rest.AG
            </Link>
             <Link 
               href="/labs" 
               className="transition-all border px-3 py-1 rounded-sm tracking-widest flex items-center gap-2"
               style={{ 
                 color: theme.colors.primary, 
                 borderColor: `${theme.colors.primary}33`,
                 backgroundColor: `${theme.colors.primary}0D`
               }}
             >
               <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.colors.primary }} />
               Labs
             </Link>
            
            {/* Botão Lançar com efeito Cometa (Refinado - Branco) */}
            <button 
              onClick={(e) => scrollToPercent(e, 1)} 
              className="relative group px-5 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 text-white font-black text-[10px] tracking-[0.2em] uppercase transition-all duration-500 hover:scale-110 active:scale-95 overflow-hidden"
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

         {/* Mobile Buttons with overflow menu */}
         <div className="flex md:hidden items-center gap-2" ref={mobileMenuRef}>
            <button 
              onClick={(e) => scrollToPercent(e, 0.25)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex flex-col items-center justify-center text-white/60 hover:text-white transition-all active:scale-90"
              aria-label="Sites"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <span className="text-[10px] uppercase tracking-[0.2em] mt-1 text-white/70">Sites</span>
            </button>
            <button 
              onClick={(e) => scrollToPercent(e, 0.45)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex flex-col items-center justify-center text-white/60 hover:text-white transition-all active:scale-90"
              aria-label="APPs"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              <span className="text-[10px] uppercase tracking-[0.2em] mt-1 text-white/70">APPs</span>
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
                 <div className="absolute right-0 top-full mt-2 min-w-[210px] rounded-3xl border border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-2xl p-2 z-50">
                   {mobileMenuItems.map((item) => (
                     item.href ? (
                       <Link
                         key={item.label}
                         href={item.href}
                         onClick={() => setMobileMenuOpen(false)}
                         className="flex items-center gap-3 w-full rounded-2xl px-3 py-2 text-white/80 hover:bg-white/10 transition-colors"
                       >
                         {item.icon}
                         <span className="text-sm font-semibold">{item.label}</span>
                       </Link>
                     ) : (
                       <button
                         type="button"
                         key={item.label}
                         onClick={(e) => {
                           item.onClick?.(e)
                           setMobileMenuOpen(false)
                         }}
                         className="flex items-center gap-3 w-full rounded-2xl px-3 py-2 text-white/80 hover:bg-white/10 transition-colors"
                       >
                         {item.icon}
                         <span className="text-sm font-semibold">{item.label}</span>
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
