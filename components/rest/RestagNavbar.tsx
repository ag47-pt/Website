'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Search, Map, User, Utensils, Menu, X, ChevronRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { renderFormattedText } from '@/app/labs/components/utils';
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar';

export const RestagNavbar = () => {
  const { theme, themeName, toggleTheme } = useTheme();
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
    <header className="fixed top-0 left-0 right-0 z-[100] border-b border-white/10 bg-[#0a0a0a]/80 md:bg-black/40 backdrop-blur-2xl transition-all duration-300">
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
              <span className="text-[9px] block leading-none text-gray-500 font-mono tracking-widest uppercase">Tool_V1.0</span>
              <span className="text-sm font-black tracking-[0.1em] uppercase text-white group-hover:text-white/80 transition-colors">RestAG</span>
            </div>
          </Link>
          
          <div className="h-8 w-[1px] bg-white/10 mx-2 hidden md:block" />
          <div className="hidden md:block">
            <ThemeSwitcher themeName={themeName} onToggle={toggleTheme} />
          </div>
        </div>

        {/* Search Bar - Center (Desktop) */}
        <div className="flex-1 max-w-md hidden lg:block">
          <div className={`relative group transition-all duration-500 ${isSearchFocused ? 'scale-105' : ''}`}>
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className={`w-4 h-4 transition-colors ${isSearchFocused ? 'text-white' : 'text-gray-500'}`} style={isSearchFocused ? { color: theme.colors.primary } : {}} />
            </div>
            <input
              type="text"
              placeholder="Pesquisar restaurantes, pratos ou locais..."
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-full py-2.5 pl-11 pr-4 text-xs text-white placeholder:text-gray-600 outline-none transition-all backdrop-blur-xl"
            />
            {/* Input Glow */}
            <div 
              className={`absolute inset-0 rounded-full blur-md -z-10 opacity-0 transition-opacity duration-500 ${isSearchFocused ? 'opacity-20' : ''}`}
              style={{ backgroundColor: theme.colors.primary }}
            />
          </div>
        </div>

        {/* Mobile Search Icon (Compact) */}
        <div className="lg:hidden flex-1 flex justify-end">
          <div className="relative w-full max-w-[150px]">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
             <input
               type="text"
               placeholder="PESQUISAR..."
               className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-3 text-[9px] text-white placeholder:text-gray-600 outline-none"
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

          {/* Special Button: "Use RestAG at your business" */}
          <button 
            onMouseMove={handleMouseMove}
            className="relative group px-4 md:px-6 py-2.5 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            {/* Neon Border following mouse */}
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

            {/* Light passing effect (Glass shine animation) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div 
                animate={{ 
                  x: ['-100%', '200%'],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  repeatDelay: 1
                }}
                className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
              />
            </div>

            {/* Sticker / Icon - Styled like a premium sticker */}
            <motion.div 
              whileHover={{ rotate: [-5, 5, -5], scale: 1.1 }}
              className="w-6 h-6 rounded-lg flex items-center justify-center bg-white text-black shrink-0 shadow-[0_5px_15px_rgba(255,255,255,0.3)] border border-black/10 relative overflow-hidden"
            >
              <Utensils className="w-3.5 h-3.5" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-gradient-to-bl from-black/5 to-transparent" />
            </motion.div>

            {/* Text */}
            <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase text-white whitespace-nowrap">
              <span className="md:hidden">
                {renderFormattedText("Use **RestAG**", 'title', theme)}
              </span>
              <span className="hidden md:inline">
                {renderFormattedText("Use **RestAG** at your business", 'title', theme)}
              </span>
            </span>

            {/* Background Glow */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
          </button>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-90"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <ScrollProgressBar />

      {/* Mobile Menu Sidebar */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        theme={theme}
        themeName={themeName}
        toggleTheme={toggleTheme}
        pathname={pathname}
      />
    </header>
  );
};

const NavStickerButton = ({ icon: Icon, label, href, active }: any) => {
  const { theme } = useTheme();
  
  return (
    <Link href={href} className="relative group">
      <motion.div 
        whileHover={{ rotate: [-8, 8, -5], scale: 1.15 }}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.3)] border ${
          active 
            ? 'bg-white text-black border-black/10' 
            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
        }`}
      >
        <Icon className="w-5 h-5" style={active ? {} : { color: theme.colors.primary }} />
        
        {/* Sticker Fold Effect (Top Right) */}
        <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-bl from-white/20 to-transparent opacity-50" />
        
        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
      </motion.div>
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-[8px] font-mono tracking-widest uppercase rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 whitespace-nowrap z-50">
        {label}
      </span>
    </Link>
  );
};

const NavIconButton = ({ icon: Icon, label, href, active }: any) => {
  const { theme } = useTheme();
  
  return (
    <Link href={href} className="relative group">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${active ? 'bg-white/10 border-white/20 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'}`}>
        <Icon className="w-5 h-5" style={active ? { color: theme.colors.primary } : {}} />
      </div>
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-[8px] font-mono tracking-widest uppercase rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
        {label}
      </span>
    </Link>
  );
};

const MobileMenu = ({ isOpen, onClose, theme, themeName, toggleTheme, pathname }: any) => {
  return (
    <div className={`fixed inset-0 z-[110] md:hidden transition-all duration-500 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`absolute top-0 right-0 w-80 h-full bg-[#0a0a0a]/95 backdrop-blur-3xl border-l border-white/10 p-8 flex flex-col gap-8 transition-transform duration-500 ${isOpen ? 'translate-x-0 shadow-[-20px_0_40px_rgba(0,0,0,0.8)]' : 'translate-x-full shadow-none'}`}>
        <div className="flex justify-between items-center -mx-8 -mt-8 p-8 border-b border-white/10">
          <span className="font-black tracking-[0.3em] uppercase text-[10px] text-gray-400">System_Menu</span>
          <div className="flex items-center gap-4">
            <ThemeSwitcher themeName={themeName} onToggle={toggleTheme} />
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white border border-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search in Mobile */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="PESQUISAR..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-mono tracking-widest text-white outline-none"
          />
        </div>

        <div className="flex flex-col gap-3">
          <MobileNavItem icon={Calendar} label="SINCRONIZAR RESERVA" href="#reservations" active={false} theme={theme} />
          <MobileNavItem icon={Map} label="MAPA GEOSPACIAL" href="/restag/map" active={pathname === '/restag/map'} theme={theme} />
          <MobileNavItem icon={User} label="PERFIL USUÁRIO" href="/restag/profile" active={pathname === '/restag/profile'} theme={theme} />
          <MobileNavItem icon={Utensils} label="PARA EMPRESAS" href="/restag/audit" active={pathname === '/restag/audit'} theme={theme} />
        </div>

        <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-4">
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

const MobileNavItem = ({ icon: Icon, label, href, active, theme }: any) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
        active 
          ? 'bg-white/10 border-white/20 text-white' 
          : 'bg-white/5 border-white/5 text-gray-400'
      }`}
    >
      <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
        <Icon className="w-5 h-5" style={active ? { color: theme.colors.primary } : {}} />
      </div>
      <span className="font-bold text-[10px] tracking-[0.2em] uppercase">
        {label}
      </span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.colors.primary }} />}
    </Link>
  );
};
