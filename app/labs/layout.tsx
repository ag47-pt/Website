'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';

export default function LabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, themeName, toggleTheme } = useTheme();

  const navItems = [
    { name: 'INDEX', path: '/labs' },
    { name: 'DEV SHOWCASE', path: '/labs/dev' },
    { name: 'SALES SLIDES', path: '/labs/slides' },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden" style={{ '--primary-color': theme.colors.primary } as any}>
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
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:200px_200px] border-l border-t border-gray-800"></div>
      </div>

      {/* Lab HUD Header */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="w-8 h-8 flex items-center justify-center font-bold text-black text-xs hover:scale-110 transition-transform" style={{ backgroundColor: theme.colors.primary }}>
              L47
            </Link>
            <div className="hidden md:block">
              <span className="text-[10px] block leading-none text-gray-500 font-mono">EXPERIMENTAL_SECTOR</span>
              <span className="text-sm font-bold tracking-widest uppercase">Agência 47 Labs</span>
            </div>
            <div className="ml-2 border-l border-white/10 pl-4 h-8 flex items-center">
              <ThemeSwitcher themeName={themeName} onToggle={toggleTheme} />
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto no-scrollbar py-2 -my-2 mask-linear-r">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-[10px] md:text-xs font-mono px-3 py-1.5 border transition-all whitespace-nowrap shrink-0 ${
                  pathname === item.path
                    ? 'text-black shadow-lg'
                    : 'border-white/20 text-gray-400 hover:text-white'
                }`}
                style={pathname === item.path ? { 
                  backgroundColor: theme.colors.primary, 
                  borderColor: theme.colors.primary,
                  boxShadow: `0 0 15px ${theme.colors.primary}80`
                } : {}}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4 font-mono text-[10px] text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>SYSTEM_ACTIVE</span>
            </div>
            <div className="border-l border-white/10 pl-4">
              {new Date().toISOString().split('T')[0]}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 pt-24 pb-20 px-6 max-w-7xl mx-auto">
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
    </div>
  );
}
