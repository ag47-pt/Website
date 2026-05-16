'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar';
import { usePageScroll } from '@/hooks/usePageScroll';
import { RestagNavbar } from '@/components/rest/RestagNavbar';

export default function RestagMasterLayout({
  children,
  bgImage = "/labs/bipolar-brunch-veleiro.png",
}: {
  children: React.ReactNode;
  bgImage?: string;
}) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const scrollOffset = usePageScroll();
  const displayPercent = Math.round(theme.branding.startingPercent + (scrollOffset * (100 - theme.branding.startingPercent)));

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

      {/* Restag Specialized Navbar */}
      <RestagNavbar />

      {/* Main Content Area */}
      <main className={`${pathname.startsWith('/restag/admin') || pathname.startsWith('/restag/merchant') ? 'pt-[73px]' : 'pt-20 md:pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto'}`}>
        {children}
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

      {/* Scroll Percentage Indicator (Ag47 Style) */}
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
