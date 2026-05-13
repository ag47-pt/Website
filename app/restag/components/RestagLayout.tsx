'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Activity, Map as MapIcon, ShieldCheck, Zap, ChevronRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface NavItem {
  id: string;
  label: string;
  icon: any;
}

interface RestagLayoutProps {
  children: React.ReactNode;
  activeView?: 'MAP' | 'LIST' | 'CONFIG';
  navItems?: NavItem[];
}

/**
 * RestagLayout is a functional overlay for the RESTAG portal.
 * It provides the restag-specific HUD and decorative elements.
 */
export const RestagLayout: React.FC<RestagLayoutProps> = ({ children, activeView = 'MAP', navItems }) => {
  const { theme } = useTheme();
  
  const defaultNavItems: NavItem[] = [
    { id: 'map', label: 'GEOSPATIAL_GRID', icon: MapIcon },
    { id: 'metrics', label: 'THERMAL_STATUS', icon: Activity },
    { id: 'featured', label: 'GRID_SYNC', icon: Zap },
    { id: 'hero', label: 'AUDIT_LOCK', icon: ShieldCheck },
  ];

  const currentNavItems = navItems || defaultNavItems;
  const [activeSection, setActiveSection] = useState(currentNavItems[0].id);

  // Smooth scroll handler
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Calibrated offset for optimal section alignment
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Scroll detection to update active HUD state
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = currentNavItems.map(item => item.id);
    
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [currentNavItems]);

  return (
    <div className="relative w-full">
      {/* Restag Specific Floating HUD (Center Bottom) - Following the provided visual pattern */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-4 w-full max-w-fit">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-2 p-1.5 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        >
          {currentNavItems.map((item) => (
            <RoundHUDIcon 
              key={item.id}
              icon={item.icon} 
              tooltip={item.label}
              isActive={activeSection === item.id} 
              onClick={() => scrollToSection(item.id)}
            />
          ))}
          
          <div className="w-[1px] h-6 bg-white/10 mx-1" />
          
          <RoundHUDIcon 
            icon={Terminal} 
            tooltip="PROTOCOL_v1.0"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        </motion.div>
      </div>

      {/* Page Content */}
      <div className="relative">
        {children}
      </div>

      {/* Technical Background Elements (Only when Layout is active) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-10 w-px h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="absolute top-1/3 right-10 w-px h-48 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  );
};

const RoundHUDIcon = ({ icon: Icon, tooltip, isActive = false, onClick }: any) => {
  const { theme } = useTheme();
  
  return (
    <div className="relative group">
      <motion.button
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 relative ${
          isActive 
            ? 'text-black z-10' 
            : 'text-gray-400 hover:text-white bg-white/5 border border-white/5 hover:border-white/20'
        }`}
        style={isActive ? { backgroundColor: theme.colors.primary } : {}}
      >
        <Icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
        
        {/* Active Glow */}
        {isActive && (
          <motion.div 
            layoutId="activeGlow"
            className="absolute inset-0 rounded-full blur-md -z-10 opacity-50"
            style={{ backgroundColor: theme.colors.primary }}
          />
        )}

        {/* Hover Ring */}
        <div className="absolute inset-0 rounded-full border border-white/0 group-hover:border-white/10 scale-110 transition-all duration-500" />
      </motion.button>
      
      {/* Tooltip - Styled to match the dark high-contrast image provided */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-y-2 group-hover:translate-y-0">
        <div className="bg-black/95 border border-white/10 px-4 py-2 rounded-xl shadow-2xl backdrop-blur-md">
          <div className="text-[10px] font-mono font-bold text-white tracking-[0.2em] uppercase whitespace-nowrap flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
            {tooltip}
          </div>
        </div>
        {/* Centered Arrow */}
        <div className="w-2 h-2 bg-black/95 border-r border-b border-white/10 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
      </div>
    </div>
  );
};
