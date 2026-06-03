'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LucideIcon, Activity } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { renderRestagText } from '../lib/utils';

interface HeroRestagProps {
  overline: string;
  overlineIcon?: LucideIcon;
  title: string;
  highlight?: string;
  description: string;
  image?: string;
  video?: string;
  watermark?: string;
  actions?: React.ReactNode;
  effectsEnabled?: boolean;
  theme?: any;
  statusTags?: { label: string; color?: 'main' | 'secondary' | 'blue' | 'orange' | 'lime' | 'red'; pulse?: boolean }[];
  isDashboard?: boolean;
}

export const HeroRestag = ({ 
  overline, 
  overlineIcon: Icon = Activity, 
  title, 
  highlight, 
  description, 
  image,
  video,
  watermark,
  actions,
  effectsEnabled = true,
  theme: customTheme,
  statusTags,
  isDashboard = false
}: HeroRestagProps) => {
  const { theme: globalTheme, isDark, themeContrast } = useTheme();
  const theme = customTheme || globalTheme;
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // High-End Labs Animations (respecting effectsEnabled)
  const mediaScale = useTransform(scrollYProgress, [0, 1], effectsEnabled ? [1, 1.15] : [1, 1]);
  const watermarkOpacity = useTransform(scrollYProgress, [0, 1], effectsEnabled ? [0.6, 1] : [1, 1]);

  return (
    <div ref={sectionRef} className={`relative ${isDashboard ? '' : 'lg:min-h-[110vh]'}`}>
      <div className={`${isDashboard ? '' : 'lg:sticky lg:top-0 lg:h-screen'} flex items-start w-full overflow-hidden ${isDashboard ? 'pt-2' : 'pt-6 md:pt-8 lg:pt-10'}`}>
        <section className={`w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-center ${isDashboard ? 'pt-4 pb-4 lg:pb-8' : 'pt-6 lg:pt-8 pb-6 lg:pb-0'}`}>
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 font-mono text-sm tracking-[0.2em]" style={{ color: theme.colors.primary }}>
              <Icon className="w-4 h-4" />
              <span>{overline}</span>
            </div>
            
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {renderRestagText(title, 'title', theme)}
              {highlight && (
                <span className="block mt-4 px-4 py-2 rounded-xl text-2xl md:text-4xl w-fit" style={{ backgroundColor: theme.colors.primary, color: themeContrast }}>
                  {highlight}
                </span>
              )}
            </h1>

            <p className="text-lg md:text-xl leading-relaxed max-w-2xl" style={{ color: theme.colors.textSecondary }}>
              {renderRestagText(description, 'description', theme)}
            </p>

            {statusTags && (
              <div className="flex flex-wrap gap-3 mt-4">
                {statusTags.map((tag, idx) => (
                  <motion.div 
                    key={idx} 
                    animate={tag.pulse ? { 
                      opacity: [1, 0.4, 1],
                      scale: [1, 0.98, 1]
                    } : {}}
                    transition={tag.pulse ? { 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut" 
                    } : {}}
                    className={`px-3 py-1 rounded-md text-[10px] font-mono border uppercase tracking-widest transition-all ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}
                    style={{ 
                      color: tag.color === 'main' ? theme.colors.primary : 
                             tag.color === 'secondary' ? theme.colors.secondary :
                             tag.color === 'blue' ? '#3b82f6' :
                             tag.color === 'orange' ? '#f97316' :
                             tag.color === 'lime' ? '#84cc16' : 
                             tag.color === 'red' ? '#ef4444' : isDark ? '#fff' : '#111827'
                    }}
                  >
                    {tag.label}
                  </motion.div>
                ))}
              </div>
            )}

            {actions && (
              <div className="mt-10 flex flex-wrap items-center gap-6">
                {actions}
              </div>
            )}
          </motion.div>

          {/* Media Content */}
          <div className="relative flex justify-center lg:justify-end py-6 lg:py-0 self-center w-full">
            <motion.div 
              style={{ scale: mediaScale }}
              className={`relative aspect-[4/3] max-w-[500px] w-full lg:ml-auto rounded-[40px] overflow-hidden border shadow-[0_0_80px_rgba(0,0,0,0.5)] group z-20 transition-all ${isDark ? 'border-white/10' : 'border-black/10'}`}
            >
              {video ? (
                <video 
                  src={video} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" 
                />
              ) : image ? (
                <Image 
                  src={image} 
                  alt={title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center font-mono transition-all ${isDark ? 'bg-white/5 text-white/20' : 'bg-black/5 text-black/20'}`}>
                  NO_MEDIA_LOADED
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 z-10" />
              
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
                <div className={`w-10 h-10 border-t-2 border-r-2 rounded-tr-xl transition-all ${isDark ? 'border-white/20' : 'border-black/20'}`} />
              </div>
              <div className="absolute bottom-0 left-0 p-6">
                <div className={`w-10 h-10 border-b-2 border-l-2 rounded-bl-xl transition-all ${isDark ? 'border-white/20' : 'border-black/20'}`} />
              </div>
            </motion.div>

            {/* Glow Effect */}
            <motion.div 
              style={{ 
                opacity: useTransform(scrollYProgress, [0.6, 1], [0, 0.3]),
                backgroundColor: theme.colors.primary 
              }}
              className="absolute inset-0 blur-[120px] rounded-full -z-10"
            />
          </div>

        </section>
      </div>
    </div>
  );
};
