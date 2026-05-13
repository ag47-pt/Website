'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Zap, Target, Activity, Info } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

import { renderFormattedText } from './utils';

interface VisitCardProps {
  title: string;
  client: string;
  description: string;
  thumbnail?: string;
  progress?: number;
  specs?: string[];
  slug?: string;
  hasSandbox?: boolean;
  icon?: React.ReactNode;
  path: string;
  actionLabel?: string;
}

export const LabVisitCard = ({ 
  title, 
  client, 
  description, 
  thumbnail, 
  progress = 100, 
  specs = [], 
  slug, 
  hasSandbox, 
  icon, 
  path, 
  actionLabel = "Ver Detalhes" 
}: VisitCardProps) => {
  const { theme } = useTheme();
  
  return (
    <Link 
      href={path}
      className="group relative block p-8 border border-white/10 bg-white/5 hover:bg-white/[0.08] transition-all duration-500 overflow-hidden rounded-2xl w-full h-full"
      style={{ '--hover-color': theme.colors.primary } as any}
    >
      {/* Large Watermark Icon - Top Right */}
      <div className="absolute -top-16 -right-16 opacity-[0.05] group-hover:opacity-[0.12] transition-all duration-700 pointer-events-none -rotate-12 group-hover:rotate-0">
        <div className="w-72 h-72" style={{ color: theme.colors.primary }}>
          {icon}
        </div>
      </div>

      {/* Glass Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
      </div>

      <div className="space-y-6 relative z-10 text-left">
        <div className="flex justify-between items-start">
          <div className={`p-3 bg-black/50 border border-white/10 rounded-xl inline-block`} style={{ color: theme.colors.primary }}>
            {icon}
          </div>
          {progress && (
            <div className="text-[10px] font-mono px-2 py-1 bg-white/5 border border-white/10 rounded-md" style={{ color: theme.colors.textSecondary }}>
              SYNC_{progress}%
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: theme.colors.primary }}>
            {client} // {slug?.toUpperCase()}
          </div>
          <h3 className="text-2xl font-bold text-white transition-all duration-500 leading-tight tracking-tighter inline-block group-hover:bg-[var(--hover-color)] group-hover:text-black px-2 rounded-lg -ml-2">
            {renderFormattedText(title, 'title', theme)}
          </h3>
          <p className="text-sm leading-relaxed max-w-[90%] line-clamp-2" style={{ color: theme.colors.textSecondary }}>
            {renderFormattedText(description, 'description', theme)}
          </p>
        </div>

        {specs.length > 0 && (
          <div className="flex flex-wrap gap-2 py-2">
            {specs.map((spec, i) => (
              <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded uppercase" style={{ color: theme.colors.primary, borderColor: theme.colors.primary + '40', backgroundColor: theme.colors.primary + '10', borderWidth: '1px' }}>
                {spec}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest pt-2" style={{ color: theme.colors.primary }}>
          {actionLabel} <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

interface CallCardProps {
  title: string;
  description: string;
  path?: string;
  icon?: React.ReactNode;
  status?: string;
  isExternal?: boolean;
  onClick?: () => void;
}

export const LabCallCard = ({ title, description, path, icon, status, isExternal, onClick }: CallCardProps) => {
  const { theme } = useTheme();

  const content = (
    <>
      {/* Large Watermark Icon - Top Right */}
      <div className="absolute -top-16 -right-16 opacity-[0.05] group-hover:opacity-[0.12] transition-all duration-700 pointer-events-none -rotate-12 group-hover:rotate-0">
        <div className="w-72 h-72" style={{ color: theme.colors.primary }}>
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: 'w-full h-full' }) : icon}
        </div>
      </div>

      {/* Glass Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
      </div>

      {status && (
        <div className="absolute bottom-4 right-4 z-20">
          <span
            className="text-[9px] font-mono px-2.5 py-1 rounded-md border tracking-widest uppercase"
            style={{
              color: theme.colors.primary,
              borderColor: `${theme.colors.primary}40`,
              backgroundColor: `${theme.colors.primary}10`,
            }}
          >
            {status}
          </span>
        </div>
      )}

      {/* Technical Corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-2xl opacity-30" style={{ borderColor: theme.colors.primary }}></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-2xl opacity-30" style={{ borderColor: theme.colors.primary }}></div>

      <div className="space-y-6 relative z-10 text-left">
        <div className={`p-3 bg-black/50 border border-white/10 rounded-xl inline-block`} style={{ color: theme.colors.primary }}>
          {icon}
        </div>
        <div className="space-y-2">
          {path && (
            <div className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: theme.colors.primary }}>
              .{path}
            </div>
          )}
          <h3 className="text-2xl font-bold text-white transition-all duration-500 leading-tight tracking-tighter inline-block group-hover:bg-[var(--hover-color)] group-hover:text-black px-2 rounded-lg -ml-2">
            {renderFormattedText(title, 'title', theme)}
          </h3>
          <p className="text-sm leading-relaxed max-w-[80%]" style={{ color: theme.colors.textSecondary }}>
            {renderFormattedText(description, 'description', theme)}
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest pt-4" style={{ color: theme.colors.primary }}>
          {path ? 'Ver Detalhes' : (onClick ? 'Ver Detalhes' : 'Acessar Módulo')} <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </>
  );

  if (path) {
    return (
      <Link 
        href={path}
        className="group relative p-8 border border-white/10 bg-white/5 hover:bg-white/[0.08] transition-all duration-500 overflow-hidden rounded-2xl w-full h-full block"
        style={{ '--hover-color': theme.colors.primary } as any}
      >
        {content}
      </Link>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={`group relative p-8 border border-white/10 bg-white/5 hover:bg-white/[0.08] transition-all duration-500 overflow-hidden rounded-2xl w-full h-full ${onClick ? 'cursor-pointer' : ''}`}
      style={{ '--hover-color': theme.colors.primary } as any}
    >
      {content}
    </div>
  );
};

interface InfoCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export const LabInfoCard = ({ title, description, icon = <Info className="w-4 h-4" /> }: InfoCardProps) => {
  const { theme } = useTheme();
  
  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md flex gap-4 items-start">
      <div className="p-2 rounded-lg bg-white/5 border border-white/10" style={{ color: theme.colors.primary }}>
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: theme.colors.primary }}>{renderFormattedText(title, 'title', theme)}</h4>
        <p className="text-xs leading-relaxed font-mono uppercase" style={{ color: theme.colors.textSecondary }}>{renderFormattedText(description, 'description', theme)}</p>
      </div>
    </div>
  );
};
