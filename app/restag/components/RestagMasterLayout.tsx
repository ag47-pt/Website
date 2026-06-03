'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { useRestagScroll } from '../hooks/useRestagScroll';
import { RestagNavbar } from './shared/RestagNavbar';
import { RestagChatbox } from './shared/RestagChatbox';

export default function RestagMasterLayout({
  children,
  bgImage = "/labs/bipolar-brunch-veleiro.png",
}: {
  children: React.ReactNode;
  bgImage?: string;
}) {
  const pathname = usePathname();
  const { theme, isDark } = useTheme();
  const scrollOffset = useRestagScroll();
  const displayPercent = Math.round(theme.branding.startingPercent + (scrollOffset * (100 - theme.branding.startingPercent)));

  const computedBgImage = bgImage === "/labs/bipolar-brunch-veleiro.png" 
    ? (isDark ? "/restag/franguia_gallery_0.png" : "/restag/bg_light.png") 
    : bgImage;

  const isSpecialBg = computedBgImage.includes('franguia_gallery_0') || computedBgImage.includes('bg_light') || computedBgImage.includes('bg_dark');
  const isFranguia = computedBgImage.includes('franguia_gallery_0');

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#f8f9fa] text-[#121212]'}`} style={{ '--primary-color': theme.colors.primary } as any}>
      <style>{`
        ::selection {
          background-color: ${theme.colors.primary};
          color: ${isDark ? 'black' : 'white'};
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
      <div className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-500 ${isDark ? 'opacity-50' : 'opacity-40'}`}>
        <div className={`absolute inset-0 bg-[size:40px_40px]`} style={{ backgroundImage: `linear-gradient(to right, ${isDark ? '#80808020' : '#0000000a'} 1px, transparent 1px), linear-gradient(to bottom, ${isDark ? '#80808020' : '#0000000a'} 1px, transparent 1px)` }}></div>
        <div className={`absolute inset-0 bg-[size:200px_200px] border-l border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`} style={{ backgroundImage: `linear-gradient(to right, ${isDark ? '#80808020' : '#0000000a'} 1px, transparent 1px), linear-gradient(to bottom, ${isDark ? '#80808020' : '#0000000a'} 1px, transparent 1px)` }}></div>
      </div>

      {/* Ambient Nebula Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className={`absolute inset-0 transition-all duration-700 ${
          pathname.startsWith('/restag/admin') || pathname.startsWith('/restag/merchant') 
            ? 'opacity-20 grayscale-[0.5]' 
            : isFranguia
              ? 'opacity-60' // Significantly increased to 60% for strong detail visibility
              : isSpecialBg
                ? 'opacity-70' // High visibility for our special low-contrast backgrounds
                : 'opacity-30'
        }`}>
          <Image
            src={computedBgImage}
            alt="Background"
            fill
            className={`object-cover transition-all duration-500 ${
              isDark 
                ? (isFranguia ? 'filter brightness-[0.70] contrast-[1.1]' : '') 
                : 'filter brightness-[1.05] contrast-[0.9]'
            }`}
            priority
          />
        </div>

        {/* Light Mode Wash Out Overlay */}
        {!isDark && (
          <div className={`absolute inset-0 backdrop-blur-[1px] z-[1] transition-all duration-500 ${
            isSpecialBg ? 'bg-white/40' : 'bg-white/70'
          }`}></div>
        )}

        {/* Dashboard Dark Overlay */}
        {(pathname.startsWith('/restag/admin') || pathname.startsWith('/restag/merchant')) && (
          <div className={`absolute inset-0 backdrop-blur-[2px] z-[1] transition-all duration-500 ${isDark ? 'bg-black/60' : 'bg-white/40'}`}></div>
        )}
        <div
          className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-all duration-500 ${isDark ? 'opacity-20' : 'opacity-[0.08]'}`}
          style={{ backgroundColor: theme.colors.primary }}
        ></div>
        <div
          className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] transition-all duration-500 ${isDark ? 'opacity-10' : 'opacity-[0.04]'}`}
          style={{ backgroundColor: theme.colors.primary }}
        ></div>
        <div className={`absolute inset-0 mix-blend-overlay bg-[url('/noise.png')] transition-opacity duration-500 ${isDark ? 'opacity-[0.03]' : 'opacity-[0.015]'}`}></div>
      </div>

      {/* Restag Specialized Navbar */}
      <RestagNavbar />

      {/* Main Content Area */}
      <main className={`pt-[73px] pb-20 relative ${
        (pathname.startsWith('/restag/admin') || pathname.startsWith('/restag/merchant')) 
        ? 'w-full' 
        : 'max-w-7xl mx-auto px-4 sm:px-6'
      }`}>
        {children}
      </main>

      {/* HUD Footer Decor */}
      <footer className={`fixed bottom-0 left-0 w-full z-50 h-8 border-t backdrop-blur-sm pointer-events-none flex items-center px-6 transition-all duration-500 ${isDark ? 'border-white/5 bg-black/80' : 'border-black/5 bg-white/80'}`}>
        <div className={`w-full flex justify-between items-center font-mono text-[8px] tracking-tighter uppercase transition-all duration-500 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          <div>Coord_X: 47.000 // Coord_Y: 35.123 // Elevation: 1200m</div>
          <div className="flex gap-4">
            <span>Security_Protocol: 0x47_ALPHA</span>
            <span>Bitrate: 256kbps_LMT</span>
            <span>Ag47_V.1.0</span>
          </div>
        </div>
      </footer>

      {/* Scroll Percentage Indicator (Ag47 Style) */}
      <div className="fixed bottom-10 right-10 z-50 flex items-baseline gap-1 select-none pointer-events-none">
        <span className={`text-8xl md:text-[10rem] font-black tracking-tighter tabular-nums leading-none transition-all duration-500 ${isDark ? 'text-white/5' : 'text-black/[0.04]'}`}>
          {displayPercent}
        </span>
        <span
          style={{ color: theme.colors.primary, filter: `drop-shadow(0 0 15px ${theme.colors.primary}80)` }}
          className="text-2xl font-black"
        >
          %
        </span>
      </div>
      {/* Restag Specialized Chatbot */}
      <RestagChatbox />
    </div>
  );
}
