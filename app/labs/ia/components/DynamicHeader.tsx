'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface DynamicHeaderProps {
  title: string;
  count: number;
  countLabel: string;
  icon: React.ReactNode;
}

export default function DynamicHeader({ title, count, countLabel, icon }: DynamicHeaderProps) {
  const { theme } = useTheme();

  return (
    <div className="flex items-center justify-between mb-12">
      <h2 className="text-3xl font-bold tracking-tight text-white/90 flex items-center gap-4">
        <span style={{ color: theme.colors.primary }}>{icon}</span>
        {title} 
        <span 
          className="text-sm px-3 py-1 rounded-full"
          style={{ 
            color: theme.colors.primary, 
            backgroundColor: `${theme.colors.primary}1A`, // 1A = 10% opacity
            opacity: 0.8
          }}
        >
          {count} {countLabel}
        </span>
      </h2>
    </div>
  );
}
