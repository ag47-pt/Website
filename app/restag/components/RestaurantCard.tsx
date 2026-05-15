'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { ChefHat, MapPin, Clock, Star, Zap, ChevronRight, Activity, Thermometer, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { renderFormattedText } from '@/app/labs/components/utils';

interface RestaurantCardProps {
  restaurant: any;
  isActive?: boolean;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, isActive = false }) => {
  const { theme } = useTheme();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative p-6 bg-black/40 backdrop-blur-xl border-l-2 transition-all duration-500 overflow-hidden ${
        isActive 
          ? 'bg-white/5' 
          : 'border-white/10 hover:bg-white/5'
      }`}
      style={{ 
        '--hover-color': theme.colors.primary,
        borderLeftColor: isActive ? theme.colors.primary : 'rgba(255,255,255,0.1)'
      } as React.CSSProperties}
    >
      {/* Glass Shine Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-[150%] bg-gradient-to-r from-transparent via-white/5 to-transparent animate-glass-shine mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex gap-6">
        {/* Image / Icon container */}
        <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border border-white/10 group/img">
          <Image 
            src={restaurant.img} 
            alt={restaurant.cardTitle} 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" 
          />
          {/* Technical Scanner Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] pointer-events-none opacity-20" />
          
          <motion.div 
            animate={{ y: [0, 96, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 right-0 h-[1px] bg-white/20 z-20 shadow-[0_0_5px_rgba(255,255,255,0.5)]" 
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              {/* Overtitle Rule */}
              <div 
                className="text-[10px] font-mono tracking-[0.2em] uppercase"
                style={{ color: theme.colors.primary }}
              >
                .restag/node/{restaurant.slug}
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tighter leading-tight transition-all duration-500 inline-block group-hover:bg-[var(--hover-color)] group-hover:text-black px-2 rounded-lg -ml-2" style={{ '--hover-color': theme.colors.primary } as any}>
                {renderFormattedText(restaurant.cardTitle, 'title', theme)}
              </h3>
              <p className="text-xs text-gray-400 font-mono flex items-center gap-2">
                <MapPin className="w-3 h-3" style={{ color: theme.colors.primary }} />
                {restaurant.location?.address || 'Multiple Locations'}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span 
                className="text-[10px] font-mono px-2 py-0.5 rounded border"
                style={{ 
                  color: theme.colors.primary,
                  backgroundColor: `${theme.colors.primary}1A`,
                  borderColor: `${theme.colors.primary}33`
                }}
              >
                ACTIVE_NODE
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
                <span className="font-mono">{restaurant.rating}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 line-clamp-2 mb-4">
            {renderFormattedText(restaurant.metaDescription, 'description', theme)}
          </p>

          {/* Technical Metadata Bar */}
          <div className="pt-4 flex flex-wrap gap-4 border-t border-white/5">
            <TechnicalMetric 
              icon={Thermometer} 
              label="THERMAL_SCORE" 
              value={restaurant.slug === 'carbon-core' ? '99.2%' : '84.5%'} 
            />
            <TechnicalMetric 
              icon={Clock} 
              label="SYNC_STATUS" 
              value={restaurant.reservationSettings.notice} 
            />
            <TechnicalMetric 
              icon={MapPin} 
              label="LOC_ID" 
              value={restaurant.slug.toUpperCase()} 
            />
          </div>
        </div>
      </div>

      {/* Action Hover */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-300">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-black shadow-lg"
          style={{ backgroundColor: theme.colors.primary, boxShadow: `0 0 20px ${theme.colors.primary}40` }}
        >
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
};

const TechnicalMetric = ({ icon: Icon, label, value }: any) => {
  return (
    <div className="flex flex-col">
      <div className="text-[8px] font-mono text-gray-600 mb-1 flex items-center gap-1 uppercase">
        <Icon className="w-2 h-2" />
        {label}
      </div>
      <div className="text-[10px] font-mono text-gray-300">
        {value}
      </div>
    </div>
  );
};
