'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Search, Map, User, Utensils, Menu, X, ChevronRight, Calendar, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { renderRestagText } from '../../lib/utils';
import { RestagProgressBar } from './RestagProgressBar';

/**
 * RestagNavbar - Localized version of the RESTAG navbar.
 * Cloned to remove dependencies on global components and Labs utils.
 */
export const RestagNavbar = () => {
  const { theme, themeName, toggleTheme, isDark, toggleDark } = useTheme();
  const pathname = usePathname();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mouse position for neon border effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth mouse tracking
  const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 150 });
  const smoothMouseY = useSpring(mouseY, { damping: 20, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <>
    <header className={`fixed top-0 left-0 right-0 z-[100] border-b backdrop-blur-2xl transition-all duration-300 ${isDark ? 'border-white/10 bg-[#0a0a0a]/80 md:bg-black/40 text-white' : 'border-black/10 bg-[#ffffff]/80 md:bg-white/40 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
        
        {/* Logo Section */}
        <div className="flex items-center gap-6">
          <Link href="/restag" className="group flex items-center gap-3">
            <div 
              className="w-10 h-10 flex items-center justify-center font-bold text-black text-xs hover:scale-110 transition-transform rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.3)]" 
              style={{ backgroundColor: theme.colors.primary }}
            >
              RAG
            </div>
            <div className="hidden sm:block">
              <span className={`text-[9px] block leading-none font-mono tracking-widest uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Tool_V1.0</span>
              <span className={`text-sm font-black tracking-[0.1em] uppercase transition-colors ${isDark ? 'text-white group-hover:text-white/80' : 'text-gray-900 group-hover:text-gray-700'}`}>RestAG</span>
            </div>
          </Link>
          
          <div className={`h-8 w-[1px] mx-2 hidden md:block ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
          <div className="hidden md:flex items-center gap-2">
            <ThemeSwitcher themeName={themeName} onToggle={toggleTheme} />
            <button 
              onClick={toggleDark}
              className={`w-9 h-9 rounded-full border active:scale-95 transition-all duration-300 flex items-center justify-center relative overflow-hidden ${
                isDark 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-400 hover:text-white' 
                  : 'bg-black/5 border-black/10 hover:bg-black/10 text-gray-600 hover:text-black'
              }`}
              title={isDark ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDark ? 0 : 180, scale: isDark ? 1 : 0.9 }}
                transition={{ duration: 0.5, ease: [0.27, 1, 0.45, 1] }}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-500" />
                )}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Search Bar - Center */}
        <div className="flex-1 max-w-[160px] sm:max-w-md">
          <div className={`relative group transition-all duration-500 ${isSearchFocused ? 'scale-105' : ''}`}>
            <div className="absolute inset-y-0 left-3 sm:left-4 flex items-center pointer-events-none">
              <Search className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${isSearchFocused ? (isDark ? 'text-white' : 'text-black') : 'text-gray-500'}`} style={isSearchFocused ? { color: theme.colors.primary } : {}} />
            </div>
            <input
              type="text"
              placeholder="Pesquisar..."
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`w-full focus:border-opacity-40 rounded-full py-2 sm:py-2.5 pl-9 sm:pl-11 pr-4 text-[10px] sm:text-xs outline-none transition-all backdrop-blur-xl ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-white/30' 
                  : 'bg-black/5 border-black/10 text-gray-900 placeholder:text-gray-400 focus:border-black/30'
              }`}
            />
            {/* Input Glow */}
            <div 
              className={`absolute inset-0 rounded-full blur-md -z-10 opacity-0 transition-opacity duration-500 ${isSearchFocused ? 'opacity-20' : ''}`}
              style={{ backgroundColor: theme.colors.primary }}
            />
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-2">
            <NavStickerButton icon={Calendar} label="Reservar" href="#reservations" />
            <nav className="hidden md:flex items-center gap-2">
              <NavStickerButton icon={Map} label="Mapa" href="/restag/map" active={pathname === '/restag/map'} />
              <NavStickerButton icon={User} label="Perfil" href="/restag/profile" active={pathname === '/restag/profile'} />
            </nav>
          </div>

          <button 
            onMouseMove={handleMouseMove}
            className={`relative group px-4 md:px-6 py-2.5 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3`}
            style={{ 
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', 
              border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)' 
            }}
          >
            <motion.div 
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: useTransform(
                  [smoothMouseX, smoothMouseY],
                  ([x, y]) => `radial-gradient(circle 80px at ${x}px ${y}px, ${theme.colors.primary}, transparent)`
                ),
                padding: '1px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />

            {/* Luz Aleatória que passa pelo botão */}
            <motion.div 
              animate={{ x: ['-150%', '150%'] }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                repeatDelay: 3,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent skew-x-12 pointer-events-none"
            />

            <motion.div 
              whileHover={{ rotate: [-5, 5, -5], scale: 1.1 }}
              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border relative overflow-hidden ${
                isDark 
                  ? 'bg-white text-black border-black/10 shadow-[0_5px_15px_rgba(255,255,255,0.3)]' 
                  : 'bg-gray-900 text-white border-white/10 shadow-[0_5px_15px_rgba(0,0,0,0.1)]'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
            </motion.div>

            <span className={`text-[9px] md:text-[10px] font-black tracking-widest uppercase whitespace-nowrap ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <span className="hidden lg:inline">
                {renderRestagText("Use **RestAG** at your business", 'title', theme)}
              </span>
              <span className="lg:hidden">
                {renderRestagText("USE **RESTAG**", 'title', theme)}
              </span>
            </span>
          </button>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
              isDark 
                ? 'bg-white/5 border-white/10 text-white/60 hover:text-white' 
                : 'bg-black/5 border-black/10 text-gray-600 hover:text-black'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <RestagProgressBar />

    </header>
    
    <MobileMenu 
      isOpen={mobileMenuOpen} 
      onClose={() => setMobileMenuOpen(false)} 
      theme={theme}
      themeName={themeName}
      toggleTheme={toggleTheme}
      isDark={isDark}
      toggleDark={toggleDark}
      pathname={pathname}
    />
    </>
  );
};

const NavStickerButton = ({ icon: Icon, label, href, active }: any) => {
  const { theme, isDark } = useTheme();
  
  return (
    <Link href={href} className="relative group">
      <motion.div 
        whileHover={{ rotate: [-8, 8, -5], scale: 1.15 }}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden border ${
          active 
            ? (isDark ? 'bg-white text-black border-black/10' : 'bg-gray-900 text-white border-white/10') 
            : (isDark 
                ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10' 
                : 'bg-black/5 border-black/10 text-gray-600 hover:text-black hover:bg-black/10')
        }`}
        style={{ boxShadow: isDark ? '0 5px 15px rgba(0,0,0,0.3)' : '0 5px 15px rgba(0,0,0,0.06)' }}
      >
        <Icon className="w-5 h-5" style={active ? {} : { color: theme.colors.primary }} />
        <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-bl from-white/20 to-transparent opacity-50" />
      </motion.div>
      <span className={`absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-[8px] font-mono tracking-widest uppercase rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 ${isDark ? 'bg-black text-white border border-white/10' : 'bg-white text-black border border-black/10'}`}>
        {label}
      </span>
    </Link>
  );
};

const MobileMenu = ({ isOpen, onClose, theme, themeName, toggleTheme, isDark, toggleDark, pathname }: any) => {
  return (
    <div className={`fixed inset-0 z-[110] md:hidden transition-all duration-500 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div 
        className={`absolute bottom-0 left-0 right-0 w-full backdrop-blur-3xl border-t p-8 flex flex-col gap-6 transition-transform duration-500 rounded-t-[40px] ${
          isOpen ? 'translate-y-0 shadow-[0_-20px_40px_rgba(0,0,0,0.8)]' : 'translate-y-full shadow-none'
        } ${
          isDark 
            ? 'bg-[#0a0a0a]/95 border-white/10 text-white' 
            : 'bg-[#ffffff]/98 border-black/10 text-gray-900'
        }`}
        style={{ height: '85vh', maxHeight: '85vh' }}
      >
        {/* Handle for BottomSheet feel */}
        <div className={`w-12 h-1.5 rounded-full mx-auto -mt-4 mb-2 shrink-0 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />

        <div className={`flex justify-between items-center -mx-8 p-6 border-b ${isDark ? 'border-white/10' : 'border-black/5'}`}>
          <span className="font-black tracking-[0.3em] uppercase text-[10px] text-gray-400">System_Menu</span>
          <div className="flex items-center gap-3">
            <ThemeSwitcher themeName={themeName} onToggle={toggleTheme} />
            <button 
              onClick={toggleDark}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-amber-400 hover:text-amber-300' 
                  : 'bg-black/5 border-black/10 text-indigo-500 hover:text-indigo-600'
              }`}
              title={isDark ? "Modo Claro" : "Modo Escuro"}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={onClose} className={`w-10 h-10 rounded-full flex items-center justify-center border ${isDark ? 'bg-white/5 text-gray-500 hover:text-white border-white/10' : 'bg-black/5 text-gray-600 hover:text-black border-black/10'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
          <div className="flex flex-col gap-3">
            <MobileNavItem icon={Calendar} label="SINCRONIZAR RESERVA" href="#reservations" active={false} theme={theme} isDark={isDark} />
            <MobileNavItem icon={Map} label="MAPA GEOSPACIAL" href="/restag/map" active={pathname === '/restag/map'} theme={theme} isDark={isDark} />
            <MobileNavItem icon={User} label="PERFIL USUÁRIO" href="/restag/profile" active={pathname === '/restag/profile'} theme={theme} isDark={isDark} />
            <MobileNavItem icon={Utensils} label="PARA EMPRESAS" href="/restag/audit" active={pathname === '/restag/audit'} theme={theme} isDark={isDark} />
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl text-gray-400 font-bold text-[10px] tracking-widest hover:bg-white/10 transition-all uppercase"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Sair do Portal / Labs
          </Link>
          <div className="text-[8px] font-mono text-gray-600 text-center uppercase tracking-[0.5em]">
            Restag_Protocol_V.1
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileNavItem = ({ icon: Icon, label, href, active, theme, isDark }: any) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
        active 
          ? (isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-black/10 border-black/20 text-black') 
          : (isDark ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-black/5 border-black/5 text-gray-600')
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isDark ? 'bg-black border-white/5' : 'bg-white border-black/5'}`}>
        <Icon className="w-5 h-5" style={active ? { color: theme.colors.primary } : {}} />
      </div>
      <span className="font-bold text-[10px] tracking-[0.2em] uppercase">
        {label}
      </span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.colors.primary }} />}
    </Link>
  );
};
