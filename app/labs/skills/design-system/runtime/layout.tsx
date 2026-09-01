import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Live Design System Runtime — AG47 Labs Skills',
  description: 'Ambiente isolado de execução visual determinística de Design System.',
};

export default function RuntimeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-black text-white antialiased overflow-x-hidden">
      {children}
    </div>
  );
}
