'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar';
import { usePageScroll } from '@/hooks/usePageScroll';
import { Menu, X, ChevronRight, Home } from 'lucide-react';
import { LABS_NAV_CONFIG } from '@/data/ecosystem-sitemap';
import { SitemapHoverPopover } from '@/app/labs/components/SitemapHoverPopover';

export default function LabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, themeName, toggleTheme } = useTheme();
  const scrollOffset = usePageScroll();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const displayPercent = Math.round(theme.branding.startingPercent + (scrollOffset * (100 - theme.branding.startingPercent)));

  const primaryNav = LABS_NAV_CONFIG.primary;
  const overflowNav = LABS_NAV_CONFIG.overflow;
  const allNavItems = [...primaryNav, ...overflowNav];
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close mobile menu + dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    if (moreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [moreOpen]);

  // Fully isolate the Design System Live Runtime from AG47 navbar, footer, themes, and backgrounds
  if (pathname?.startsWith('/labs/skills/design-system/runtime')) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans" style={{ '--primary-color': theme.colors.primary } as any}>
      <style>{`
        ::selection {
          background-color: ${theme.colors.primary};
          color: black;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {/* Background Blueprint Grid */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808020_1px,transparent_1px),linear-gradient(to_bottom,#80808020_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808020_1px,transparent_1px),linear-gradient(to_bottom,#80808020_1px,transparent_1px)] bg-[size:200px_200px] border-l border-t border-gray-800"></div>
      </div>

      {/* Ambient Nebula Background */}
      {!pathname.startsWith('/labs/ia') && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-50">
            <Image
              src={pathname.includes('/oracle-trader') ? '/imgs/estadio-universo.webp' : "/imgs/universo-nebuloso.webp"}
              alt="Background"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div 
            className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-30 blur-[120px]"
            style={{ backgroundColor: theme.colors.primary }}
          ></div>
          <div 
            className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[150px]"
            style={{ backgroundColor: theme.colors.primary }}
          ></div>
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('/noise.png')]"></div>
        </div>
      )}

      {/* Optimized Header (Navbar) - Following Homepage Pattern */}
      {!pathname.includes('/oracle-trader') && (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl transition-all duration-300">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-[150%] bg-gradient-to-r from-transparent via-white/5 to-transparent animate-glass-shine mix-blend-overlay"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="group flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center font-bold text-black text-[10px] hover:scale-110 transition-transform rounded-xl" style={{ backgroundColor: theme.colors.primary }}>
                L47
              </div>
              <div className="hidden sm:block">
                <span className="text-[9px] block leading-none text-gray-500 font-mono tracking-widest">EXPERIMENTAL_SECTOR</span>
                <span className="text-xs font-black tracking-[0.2em] uppercase text-white group-hover:text-white/80 transition-colors">Agência 47 Labs</span>
              </div>
            </Link>
            
            <div className="h-6 w-[1px] bg-white/10 mx-2" />
            <ThemeSwitcher themeName={themeName} onToggle={toggleTheme} />
          </div>

          {/* Desktop Navigation Link Pattern */}
          <nav className="hidden lg:flex items-center gap-4 text-white/70 font-bold text-[10px] tracking-[0.2em] uppercase">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              if (item.isSitemap) {
                return (
                  <SitemapHoverPopover
                    key={item.path}
                    target={item.path === '/labs' ? 'labs' : 'eco'}
                  >
                    <Link
                      href={item.path}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-300 ${
                        isActive
                          ? 'bg-white text-black font-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-105'
                          : 'hover:scale-105'
                      }`}
                      style={
                        isActive
                          ? {}
                          : {
                              borderColor: `${theme.colors.primary}50`,
                              backgroundColor: `${theme.colors.primary}15`,
                              color: theme.colors.primary,
                              boxShadow: `0 0 12px ${theme.colors.primary}20`,
                            }
                      }
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.name}</span>
                      <span
                        className={`text-[8px] font-mono px-1.5 py-0.5 rounded tracking-widest font-black uppercase ${
                          isActive
                            ? 'bg-black text-white'
                            : 'bg-black/60 text-white border border-white/10'
                        }`}
                      >
                        MAP
                      </span>
                    </Link>
                  </SitemapHoverPopover>
                );
              }

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] ${
                    isActive ? 'text-white drop-shadow-[0_0_8px_var(--primary-color)]' : ''
                  }`}
                  style={isActive ? ({ '--primary-color': theme.colors.primary } as any) : {}}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Overflow Dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex items-center gap-1.5 transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] ${
                  overflowNav.some(i => pathname === i.path || pathname.startsWith(i.path + '/')) ? 'text-white drop-shadow-[0_0_8px_var(--primary-color)]' : ''
                }`}
                style={overflowNav.some(i => pathname === i.path || pathname.startsWith(i.path + '/')) ? { '--primary-color': theme.colors.primary } as any : {}}
              >
                MAIS
                <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${moreOpen ? 'rotate-90' : ''}`} />
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-full right-0 mt-3 w-60 bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-50"
                  >
                    <div className="p-1.5 space-y-0.5">
                      {overflowNav.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
                        return (
                          <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
                              item.isSitemap
                                ? isActive
                                  ? 'bg-white text-black font-bold'
                                  : 'border hover:bg-white/10'
                                : isActive
                                ? 'bg-white/10 text-white'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                            style={
                              item.isSitemap && !isActive
                                ? {
                                    borderColor: `${theme.colors.primary}40`,
                                    backgroundColor: `${theme.colors.primary}12`,
                                    color: theme.colors.primary,
                                  }
                                : {}
                            }
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon
                                className="w-4 h-4 shrink-0"
                                style={
                                  item.isSitemap && !isActive
                                    ? { color: theme.colors.primary }
                                    : isActive
                                    ? { color: theme.colors.primary }
                                    : {}
                                }
                              />
                              <span className="text-[10px] font-bold tracking-[0.15em]">{item.name}</span>
                            </div>
                            {item.isSitemap && (
                              <span
                                className={`text-[7px] font-mono px-1.5 py-0.5 rounded tracking-widest font-black uppercase ${
                                  isActive ? 'bg-black text-white' : 'bg-black/60 text-white border border-white/10'
                                }`}
                              >
                                SITEMAP
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                    <div className="border-t border-white/5 px-4 py-2">
                      <span className="text-[8px] font-mono text-gray-600 tracking-widest uppercase">Ecossistema_Ag47</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* "Back to Home" special button style from main page */}
            <Link 
              href="/"
              className="relative group px-5 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 text-white font-black text-[10px] tracking-[0.2em] uppercase transition-all duration-500 hover:scale-110 active:scale-95 overflow-hidden ml-3"
            >
              <span className="relative z-10">Voltar</span>
              <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-8 bg-white animate-pulse opacity-10 blur-xl" />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-90"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-80 h-screen bg-zinc-950 border-l border-white/10 z-[60] p-8 flex flex-col gap-8 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] lg:hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-black tracking-[0.3em] uppercase text-xs text-gray-500">Navigation</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-240px)] no-scrollbar">
                <span className="text-[9px] font-mono text-gray-600 tracking-[0.2em] uppercase px-2 pt-2">Labs_Core</span>
                {primaryNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        item.isSitemap
                          ? isActive
                            ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                            : 'bg-white/5 border-white/15'
                          : isActive
                          ? 'bg-white/10 border-white/20'
                          : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                      }`}
                      style={
                        item.isSitemap && !isActive
                          ? {
                              borderColor: `${theme.colors.primary}40`,
                              backgroundColor: `${theme.colors.primary}12`,
                            }
                          : {}
                      }
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-white/10"
                          style={item.isSitemap ? { borderColor: `${theme.colors.primary}50` } : {}}
                        >
                          <Icon
                            className="w-5 h-5"
                            style={{
                              color:
                                isActive && !item.isSitemap
                                  ? theme.colors.primary
                                  : item.isSitemap
                                  ? theme.colors.primary
                                  : 'white',
                            }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span
                            className={`font-bold text-xs tracking-widest ${
                              isActive && item.isSitemap
                                ? 'text-black'
                                : isActive
                                ? 'text-white'
                                : item.isSitemap
                                ? 'text-white'
                                : 'text-gray-400'
                            }`}
                          >
                            {item.name}
                          </span>
                          {item.isSitemap && (
                            <span
                              className="text-[8px] font-mono tracking-widest font-black uppercase"
                              style={{
                                color: isActive && item.isSitemap ? '#000000' : theme.colors.primary,
                              }}
                            >
                              SITEMAP VISUAL
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 ${
                          isActive && item.isSitemap ? 'text-black' : 'text-gray-600'
                        }`}
                      />
                    </Link>
                  );
                })}

                <span className="text-[9px] font-mono text-gray-600 tracking-[0.2em] uppercase px-2 pt-4">Ecossistema</span>
                {overflowNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        item.isSitemap
                          ? isActive
                            ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                            : 'bg-white/5 border-white/15'
                          : isActive
                          ? 'bg-white/10 border-white/20'
                          : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                      }`}
                      style={
                        item.isSitemap && !isActive
                          ? {
                              borderColor: `${theme.colors.primary}40`,
                              backgroundColor: `${theme.colors.primary}12`,
                            }
                          : {}
                      }
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-white/10"
                          style={item.isSitemap ? { borderColor: `${theme.colors.primary}50` } : {}}
                        >
                          <Icon
                            className="w-5 h-5"
                            style={{
                              color:
                                isActive && !item.isSitemap
                                  ? theme.colors.primary
                                  : item.isSitemap
                                  ? theme.colors.primary
                                  : 'white',
                            }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span
                            className={`font-bold text-xs tracking-widest ${
                              isActive && item.isSitemap
                                ? 'text-black'
                                : isActive
                                ? 'text-white'
                                : item.isSitemap
                                ? 'text-white'
                                : 'text-gray-400'
                            }`}
                          >
                            {item.name}
                          </span>
                          {item.isSitemap && (
                            <span
                              className="text-[8px] font-mono tracking-widest font-black uppercase"
                              style={{
                                color: isActive && item.isSitemap ? '#000000' : theme.colors.primary,
                              }}
                            >
                              SITEMAP VISUAL
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 ${
                          isActive && item.isSitemap ? 'text-black' : 'text-gray-600'
                        }`}
                      />
                    </Link>
                  );
                })}
              </div>

              <div className="mt-auto space-y-4">
                <Link href="/" className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl text-gray-400 font-bold text-xs tracking-widest hover:bg-white/10 transition-all">
                  <Home className="w-5 h-5" />
                  PÁGINA PRINCIPAL
                </Link>
                <div className="text-[10px] font-mono text-gray-600 text-center uppercase tracking-widest">
                  Protocol_Ag47_V1.0
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ScrollProgressBar />
        </header>
      )}

      {/* Main Content Area - Balanced symmetrical top spacing */}
      <main className={`relative pb-20 px-4 sm:px-6 max-w-7xl mx-auto ${pathname.includes('/oracle-trader') ? 'pt-8' : 'pt-20 sm:pt-22'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </main>

      {/* HUD Footer Decor */}
      <footer className="fixed bottom-0 left-0 w-full z-50 h-8 border-t border-white/5 bg-black/80 backdrop-blur-sm pointer-events-none flex items-center px-6">
        <div className="w-full flex justify-between items-center font-mono text-[8px] text-gray-600 tracking-tighter uppercase">
          <div>Coord_X: 47.000 // Coord_Y: 35.123 // Elevation: 1200m</div>
          <div className="flex gap-4">
            <span>Security_Protocol: 0x47_ALPHA</span>
            <span>Bitrate: 256kbps_LMT</span>
            <span>Ag47_V.1.0</span>
          </div>
        </div>
      </footer>

      {/* Indicador de Percentagem de Scroll (Ag47 Style) */}
      <div className="fixed bottom-10 right-10 z-50 flex items-baseline gap-1 select-none pointer-events-none">
        <span className="text-8xl md:text-[10rem] font-black tracking-tighter text-white/5 tabular-nums leading-none">
          {displayPercent}
        </span>
        <span 
          style={{ color: theme.colors.primary, filter: `drop-shadow(0 0 15px ${theme.colors.primary}80)` }}
          className="text-2xl font-black"
        >
          %
        </span>
      </div>
    </div>
  );
}
