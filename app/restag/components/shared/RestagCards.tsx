import React from 'react';
import { Info, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { renderRestagText } from '../../lib/utils';

/**
 * RestagVisitCard - Cloned from LabVisitCard for isolation.
 */
export const RestagVisitCard = ({ 
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
}: any) => {
  const { theme, isDark, themeContrast } = useTheme();
  
  return (
    <Link 
      href={path}
      className={`group relative block p-8 border transition-all duration-500 overflow-hidden rounded-2xl w-full h-full ${
        isDark 
          ? 'border-white/10 bg-white/5 hover:bg-white/[0.08]' 
          : 'border-black/10 bg-black/[0.03] hover:bg-black/[0.06]'
      }`}
      style={{ 
        '--hover-color': theme.colors.primary,
        '--hover-text-color': themeContrast
      } as any}
    >
      <div className="absolute -top-16 -right-16 opacity-[0.05] group-hover:opacity-[0.12] transition-all duration-700 pointer-events-none -rotate-12 group-hover:rotate-0">
        <div className="w-72 h-72" style={{ color: theme.colors.primary }}>
          {icon}
        </div>
      </div>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
      </div>

      <div className="space-y-6 relative z-10 text-left">
        <div className="flex justify-between items-start">
          <div className={`p-3 border rounded-xl inline-block ${isDark ? 'bg-black/50 border-white/10' : 'bg-white/50 border-black/10'}`} style={{ color: theme.colors.primary }}>
            {icon}
          </div>
          {progress && (
            <div className={`text-[10px] font-mono px-2 py-1 border rounded-md ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`} style={{ color: theme.colors.textSecondary }}>
              SYNC_{progress}%
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: theme.colors.primary }}>
            {client} // {slug?.toUpperCase()}
          </div>
          <h3 className={`text-2xl font-bold transition-all duration-500 leading-tight tracking-tighter inline-block group-hover:bg-[var(--hover-color)] group-hover:text-[var(--hover-text-color)] px-2 rounded-lg -ml-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {renderRestagText(title, 'title', theme)}
          </h3>
          <p className="text-sm leading-relaxed max-w-[90%] line-clamp-2" style={{ color: theme.colors.textSecondary }}>
            {renderRestagText(description, 'description', theme)}
          </p>
        </div>

        {specs.length > 0 && (
          <div className="flex flex-wrap gap-2 py-2">
            {specs.map((spec: string, i: number) => (
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

/**
 * RestagInfoCard - Cloned from LabInfoCard for isolation.
 */
export const RestagInfoCard = ({ title, description, icon = <Info className="w-4 h-4" /> }: {
  title: string;
  description: string;
  icon?: React.ReactNode;
}) => {
  const { theme, isDark } = useTheme();
  
  return (
    <div className={`p-6 border rounded-2xl backdrop-blur-md flex gap-4 items-start ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
    }`}>
      <div className={`p-2 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`} style={{ color: theme.colors.primary }}>
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: theme.colors.primary }}>
          {renderRestagText(title, 'title', theme)}
        </h4>
        <p className="text-xs leading-relaxed font-mono uppercase" style={{ color: theme.colors.textSecondary }}>
          {renderRestagText(description, 'description', theme)}
        </p>
      </div>
    </div>
  );
};

/**
 * RestagCallCard - Cloned from LabCallCard for isolation.
 */
export const RestagCallCard = ({ title, description, path, icon, status, isExternal, onClick, opacity = 1 }: any) => {
  const { theme, isDark, themeContrast } = useTheme();

  const content = (
    <div style={{ opacity }}>
      <div className="absolute -top-16 -right-16 opacity-[0.05] group-hover:opacity-[0.12] transition-all duration-700 pointer-events-none -rotate-12 group-hover:rotate-0">
        <div className="w-72 h-72" style={{ color: theme.colors.primary }}>
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: 'w-full h-full' }) : icon}
        </div>
      </div>

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

      <div className="space-y-6 relative z-10 text-left">
        <div className={`p-3 border rounded-xl inline-block ${isDark ? 'bg-black/50 border-white/10' : 'bg-white/50 border-black/10'}`} style={{ color: theme.colors.primary }}>
          {icon}
        </div>
        <div className="space-y-2">
          {path && (
            <div className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: theme.colors.primary }}>
              .{path}
            </div>
          )}
          <h3 className={`text-2xl font-bold transition-all duration-500 leading-tight tracking-tighter inline-block group-hover:bg-[var(--hover-color)] group-hover:text-[var(--hover-text-color)] px-2 rounded-lg -ml-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {renderRestagText(title, 'title', theme)}
          </h3>
          <p className="text-sm leading-relaxed max-w-[80%]" style={{ color: theme.colors.textSecondary }}>
            {renderRestagText(description, 'description', theme)}
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest pt-4" style={{ color: theme.colors.primary }}>
          {path ? 'Ver Detalhes' : (onClick ? 'Ver Detalhes' : 'Acessar Módulo')} <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );

  if (path) {
    return (
      <Link 
        href={path}
        className={`group relative p-8 border transition-all duration-500 overflow-hidden rounded-2xl w-full h-full block ${
          isDark 
            ? 'border-white/10 bg-white/5 hover:bg-white/[0.08]' 
            : 'border-black/10 bg-black/[0.03] hover:bg-black/[0.06]'
        }`}
        style={{ 
          '--hover-color': theme.colors.primary,
          '--hover-text-color': themeContrast
        } as any}
      >
        {content}
      </Link>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={`group relative p-8 border transition-all duration-500 overflow-hidden rounded-2xl w-full h-full ${onClick ? 'cursor-pointer' : ''} ${
        isDark 
          ? 'border-white/10 bg-white/5 hover:bg-white/[0.08]' 
          : 'border-black/10 bg-black/[0.03] hover:bg-black/[0.06]'
      }`}
      style={{ 
        '--hover-color': theme.colors.primary,
        '--hover-text-color': themeContrast
      } as any}
    >
      {content}
    </div>
  );
};
