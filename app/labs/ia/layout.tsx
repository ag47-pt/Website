'use client';

import React from 'react';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';

export default function IALayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <div className="relative min-h-screen">
      {/* Ambient IA Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Nebula Background Image */}
        <div className="absolute inset-0 opacity-30 mix-blend-screen">
          <Image
            src="/imgs/universo-nebuloso.webp"
            alt="Universo Nebuloso IA Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Deep ambient glow based on primary color */}
        <div 
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-30 blur-[120px]"
          style={{ backgroundColor: theme.colors.primary }}
        ></div>
        
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[150px]"
          style={{ backgroundColor: theme.colors.primary }}
        ></div>

        {/* Subtle noise overlay for texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('/noise.png')]"></div>
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
