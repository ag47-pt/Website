'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { LucideIcon } from 'lucide-react';

import Image from 'next/image';
import { renderFormattedText } from './utils';
import { GlobalBreadcrumb } from '@/components/ui/GlobalBreadcrumb';

interface StatusTagProps {
  label: string;
  color: 'blue' | 'lime' | 'orange' | 'main' | 'red' | 'secondary';
  pulse?: boolean;
}

export const LabStatusTag = ({ label, color, pulse = false }: StatusTagProps) => {
  const { theme, setTheme } = useTheme();
  
  const colors = {
    blue: '#0059ff',
    lime: '#84cc16',
    orange: '#f59e0b',
    main: theme.colors.primary,
    secondary: theme.colors.secondary,
    red: '#ef4444'
  };

  const handleThemeSwitch = () => {
    const themeMap: Record<string, string> = {
      blue: 'blue',
      lime: 'lime',
      orange: 'orange',
      main: 'default',
      red: 'tomate'
    };
    if (themeMap[color]) setTheme(themeMap[color] as any);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleThemeSwitch();
    }
  };

  return (
    <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10 select-none">
      <div 
        role="button"
        tabIndex={0}
        className={`w-2 h-2 rounded-full cursor-pointer transition-transform hover:scale-125 ${pulse ? 'animate-pulse' : ''}`}
        style={{ backgroundColor: colors[color] }}
        onClick={handleThemeSwitch}
        onKeyDown={handleKeyDown}
        aria-label={`Switch theme to ${color}`}
      ></div>
      <span style={{ color: theme.colors.textSecondary }}>{label}</span>
    </div>
  );
};

interface LabHeroProps {
  overline: string;
  overlineIcon: LucideIcon;
  title: string;
  highlight?: string;
  description: string;
  statusTags?: StatusTagProps[];
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  image?: string;
  video?: string;
  mosaicImages?: string[]; // New for full variant
  watermark?: string;
  onImageClick?: () => void;
  variant?: 'full' | 'medium' | 'mini'; // New variant system
  theme?: any;
  effectsEnabled?: boolean;
}

export const LabHero = ({ 
  overline, 
  overlineIcon: Icon, 
  title, 
  highlight, 
  description, 
  statusTags = [], 
  actions,
  footer,
  image,
  video,
  mosaicImages,
  watermark,
  onImageClick,
  variant = 'full',
  theme: customTheme,
  effectsEnabled = true
}: LabHeroProps) => {
  const { theme: globalTheme } = useTheme();
  const theme = customTheme || globalTheme;
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Animations (mainly for full/media with media) - Respecting effectsEnabled
  const mediaScale = useTransform(scrollYProgress, [0, 1], effectsEnabled ? [1, 1.15] : [1, 1]);
  const watermarkOpacity = useTransform(scrollYProgress, [0, 1], effectsEnabled ? [0.6, 1] : [1, 1]);

  const hasMedia = !!(image || video || mosaicImages);

  // --- RENDER HELPERS ---
  
  const renderTextContent = (isCentered = false) => (
    <motion.div 
      className={`space-y-4 sm:space-y-5 ${isCentered ? 'text-center flex flex-col items-center' : 'text-left'}`}
    >
      <div className="pb-1">
        <GlobalBreadcrumb />
      </div>

      <div className="flex items-center gap-2 font-mono text-xs sm:text-sm tracking-[0.2em]" style={{ color: theme.colors.primary }}>
        <Icon className="w-4 h-4" />
        <span>{overline}</span>
      </div>
      
      <h1 className={`${variant === 'mini' ? 'text-2xl md:text-4xl' : 'text-3xl md:text-5xl lg:text-6xl'} font-black tracking-tighter text-white leading-tight uppercase`}>
        {renderFormattedText(title, 'title', theme)}
        {highlight && (
          <span className="px-3 py-1 rounded-lg md:ml-3 mt-3 md:mt-0 inline-block text-xl md:text-3xl lg:text-4xl" style={{ backgroundColor: theme.colors.primary, color: '#000' }}>
            {highlight}
          </span>
        )}
      </h1>

      <p className={`${variant === 'mini' ? 'text-sm md:text-base' : 'text-base md:text-lg'} leading-relaxed max-w-2xl`} style={{ color: theme.colors.textSecondary }}>
        {renderFormattedText(description, 'description', theme)}
      </p>

      {statusTags.length > 0 && (
        <div className="flex flex-wrap gap-3 sm:gap-4 font-mono text-[10px] uppercase pt-1 sm:pt-2" style={{ color: theme.colors.textMuted }}>
          {statusTags.map((tag, i) => <LabStatusTag key={i} {...tag} />)}
        </div>
      )}

      {actions && variant !== 'medium' && (
        <div className={`mt-10 flex flex-wrap items-center gap-6 ${isCentered ? 'justify-center' : ''}`}>
          {actions}
        </div>
      )}

      {footer && (
        <div className="pt-4 text-sm font-semibold leading-6 flex items-center" style={{ color: theme.colors.textSecondary }}>
          {footer}
        </div>
      )}
    </motion.div>
  );

  const renderMedia = () => (
    <div className="relative flex justify-center lg:justify-end py-6 lg:py-0 self-center">
      <motion.div 
        role="button"
        tabIndex={0}
        onClick={onImageClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onImageClick?.();
          }
        }}
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        style={{ 
          scale: mediaScale
        }}
        className="relative aspect-[4/3] max-w-[500px] w-full lg:ml-auto rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] group z-20 cursor-pointer"
      >
        {mosaicImages ? (
          <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full h-full bg-white/5 p-1">
            {mosaicImages.slice(0, 4).map((img, i) => (
              <div key={i} className="relative w-full h-full overflow-hidden">
                <Image src={img} alt={`${title} Mosaic ${i}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
            ))}
          </div>
        ) : video ? (
          <video src={video} autoPlay loop muted playsInline className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
        ) : (
          image && <Image src={image} alt={title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 z-10" />
        
        {watermark && (
          <motion.div 
            style={{ opacity: watermarkOpacity }}
            className="absolute bottom-8 right-8 z-30 pointer-events-none text-right"
          >
            <div className="text-[8px] font-mono uppercase tracking-[0.4em] text-white/40 mb-1">Authenticated_Node</div>
            <div className="text-sm font-black text-white/60 tracking-widest uppercase">{watermark}</div>
          </motion.div>
        )}
        
        <div className="absolute top-0 right-0 p-6">
          <div className="w-10 h-10 border-t-2 border-r-2 border-white/20 rounded-tr-xl" />
        </div>
        <div className="absolute bottom-0 left-0 p-6">
          <div className="w-10 h-10 border-b-2 border-l-2 border-white/20 rounded-bl-xl" />
        </div>
      </motion.div>

      <motion.div 
        style={{ 
          opacity: useTransform(scrollYProgress, [0.6, 1], [0, 0.4]),
          backgroundColor: `${theme.colors.primary}33` 
        }}
        className="absolute inset-0 blur-[120px] rounded-full -z-10"
      />
    </div>
  );

  // --- LAYOUTS ---

  if (variant === 'medium') {
    return (
      <div className="relative py-20">
        <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr_auto] gap-12 items-center">
          {renderTextContent(false)}
          {actions && (
            <div className="flex flex-col justify-center gap-4 border-l border-white/10 pl-12 h-fit">
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em] mb-2">Available_Actions</div>
              {actions}
            </div>
          )}
        </section>
      </div>
    );
  }

  if (variant === 'mini') {
    return (
      <div className="relative py-12">
        <section className="max-w-7xl mx-auto px-6">
          {renderTextContent(false)}
        </section>
      </div>
    );
  }

  // Default Full Variant
  return (
    <div ref={sectionRef} className={`${hasMedia ? 'lg:min-h-[110vh]' : 'min-h-0'} relative`}>
      <div className={`${hasMedia ? 'lg:sticky lg:top-0 lg:h-screen flex items-start lg:pt-0' : 'relative'} w-full overflow-hidden`}>
        <section className={`w-full max-w-7xl mx-auto px-6 ${hasMedia ? 'grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-center pt-6 lg:pt-0 pb-8 lg:pb-0' : 'space-y-5 sm:space-y-6 pt-4 sm:pt-6'}`}>
          {renderTextContent(false)}
          {hasMedia && renderMedia()}
        </section>
      </div>
    </div>
  );
};
