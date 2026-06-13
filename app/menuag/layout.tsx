import React from 'react';
import { Metadata } from 'next';
import { MenuAGHeader } from './components/MenuAGHeader';

export const metadata: Metadata = {
  title: 'menuAG | Discovery Gastronômico',
  description: 'Conectando amantes da culinária a experiências gastronômicas.',
};

export default function MenuAGLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased flex flex-col">
      <MenuAGHeader />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>
    </div>
  );
}
