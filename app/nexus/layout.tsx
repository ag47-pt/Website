'use client';

import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { NexusSidebar } from '@/components/nexus/Sidebar';
import { NexusMobileHeader } from '@/components/nexus/MobileHeader';
import { NexusThemeProvider } from '@/context/NexusThemeContext';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export default function NexusLayout({ children }: { children: ReactNode }) {
  return (
    <NexusThemeProvider fontClassName={inter.className}>
      <NexusMobileHeader />
      <NexusSidebar />
      <main className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden bg-background">
        {children}
      </main>
    </NexusThemeProvider>
  );
}
