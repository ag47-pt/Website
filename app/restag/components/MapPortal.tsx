'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Info, Crosshair, Target, Activity, ArrowRight } from 'lucide-react';
import { RestaurantLP } from '@/data/restaurants';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';

interface MapPortalProps {
  restaurants: RestaurantLP[];
  onSelect: (restaurant: RestaurantLP) => void;
  selectedId?: string;
}

export const MapPortal: React.FC<MapPortalProps> = ({ restaurants, onSelect, selectedId }) => {
  const { theme } = useTheme();

  const handleKeyDown = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  return (
    <div className="relative w-full h-[350px] sm:h-[450px] md:h-[600px] bg-black border border-white/10 rounded-3xl overflow-hidden group shadow-2xl">
      {/* Technical Grid Backdrop */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:40px_40px]" 
          style={{ '--grid-color': `${theme.colors.primary}22` } as any}
        />
        <div 
          className="absolute inset-0"
          style={{ background: `radial-gradient(circle at 50% 50%, ${theme.colors.primary}05, transparent 70%)` }}
        />
      </div>

      {/* Coordinate Labels */}
      <div className="absolute top-4 left-4 font-mono text-[8px] text-emerald-500/40 select-none">
        GRID_UNIT: 40px // SCALE: 1:1000 // PROJECTION: LABS_MERCATOR
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[8px] text-emerald-500/40 select-none">
        LAT_REF: 38.7223 // LNG_REF: -9.1393
      </div>

      {/* Map Markers */}
      <div className="relative w-full h-full">
        {restaurants.map((rest, idx) => {
          const left = 20 + (idx * 30);
          const top = 30 + (idx * 15);
          
          return (
            <MapMarker 
              key={rest.slug}
              restaurant={rest}
              style={{ left: `${left}%`, top: `${top}%` }}
              isSelected={selectedId === rest.slug}
              onClick={() => onSelect(rest)}
              delay={idx * 0.1}
              theme={theme}
            />
          );
        })}
      </div>

      {/* Scan Line Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-full h-1 blur-sm"
          style={{ backgroundColor: `${theme.colors.primary}20`, boxShadow: `0 0 15px ${theme.colors.primary}40` }}
        />
      </div>
    </div>
  );
};

const MapMarker = ({ restaurant, style, isSelected, onClick, delay, theme }: any) => {
  return (
    <motion.div 
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring" }}
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
      style={style}
    >
      <div 
        role="button"
        tabIndex={0}
        aria-label={`Select ${restaurant.cardTitle} node`}
        className="relative group/marker cursor-pointer" 
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {/* Radar Ping */}
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
        
        {/* Main Marker */}
        <div className={`relative w-10 h-10 flex items-center justify-center rounded-xl border-2 transition-all duration-500 ${
          isSelected 
            ? 'border-white shadow-2xl scale-125' 
            : 'bg-black/80 border-white/20 group-hover/marker:border-white group-hover/marker:scale-110'
        }`} style={isSelected ? { backgroundColor: theme.colors.primary } : {}}>
          <Target className={`w-5 h-5 ${isSelected ? 'text-black' : 'text-white'}`} style={!isSelected ? { color: theme.colors.primary } : {}} />
        </div>

        {/* Technical Label */}
        <div className={`absolute top-10 left-1/2 -translate-x-1/2 px-3 py-2 bg-black/90 border border-white/10 rounded-xl font-mono text-[10px] whitespace-nowrap transition-all duration-300 ${
          isSelected ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 group-hover/marker:opacity-100 group-hover/marker:translate-y-0 pointer-events-none'
        }`}>
          <div className="font-bold uppercase mb-1" style={{ color: theme.colors.primary }}>{restaurant.cardTitle}</div>
          <div className="text-gray-500 text-[8px] mb-2">{restaurant.location.lat.toFixed(4)}, {restaurant.location.lng.toFixed(4)}</div>
          
          {isSelected && (
            <Link 
              href={`/restag/${restaurant.slug}`}
              className="flex items-center justify-center gap-2 py-1 px-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[9px] font-bold text-white uppercase tracking-wider"
              onClick={(e) => e.stopPropagation()}
            >
              Access Node <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};
