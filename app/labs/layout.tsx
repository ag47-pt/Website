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
import { Menu, X, ChevronRight, LayoutGrid, Terminal, Presentation, Utensils, Home } from 'lucide-react';

export default function LabsLayout({
  children,
  bgImage = "/imgs/universo-nebuloso.webp",
}: {
  children: React.ReactNode;
  bgImage?: string;
}) {
  const pathname = usePathname();
  const { theme, themeName, toggleTheme } = useTheme();
  const scrollOffset = usePageScroll();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const displayPercent = Math.round(theme.branding.startingPercent + (scrollOffset * (100 - theme.branding.startingPercent)));

  const navItems = [
    { name: 'INDEX', path: '/labs', icon: LayoutGrid },
    { name: 'I.A-47', path: '/labs/ia', icon: Terminal },
    { name: 'DEV SHOWCASE', path: '/labs/dev', icon: Terminal },
    { name: 'SALES SLIDES', path: '/labs/slides', icon: Presentation },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
              src={bgImage}
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
          <nav className="hidden lg:flex items-center gap-6 text-white/70 font-bold text-[10px] tracking-[0.2em] uppercase">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] ${
                  pathname === item.path ? 'text-white drop-shadow-[0_0_8px_var(--primary-color)]' : ''
                }`}
                style={pathname === item.path ? { '--primary-color': theme.colors.primary } as any : {}}
              >
                {item.name}
              </Link>
            ))}
            
            {/* "Back to Home" special button style from main page */}
            <Link 
              href="/"
              className="relative group px-5 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 text-white font-black text-[10px] tracking-[0.2em] uppercase transition-all duration-500 hover:scale-110 active:scale-95 overflow-hidden ml-4"
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

              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        pathname === item.path 
                          ? 'bg-white/10 border-white/20' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
                          <Icon className="w-5 h-5" style={{ color: pathname === item.path ? theme.colors.primary : 'white' }} />
                        </div>
                        <span className={`font-bold text-xs tracking-widest ${pathname === item.path ? 'text-white' : 'text-gray-400'}`}>
                          {item.name}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600" />
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

      {/* Main Content Area - Adjusted PT for new header height */}
      {/* Main Content Area - Adjusted PT for new header height */}
      <main className="relative pt-20 md:pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
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
