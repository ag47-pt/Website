'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, animate } from 'framer-motion';
import { 
  Utensils, 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  ChefHat, 
  Flame, 
  Wine,
  Calendar,
  X,
  CreditCard,
  ChevronRight,
  Zap,
  Activity,
  Target,
  Phone,
  LayoutGrid,
  ShieldCheck,
  Info as InfoIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown as ChevronDownIcon
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '@/context/ThemeContext';
import { HeroRestag } from './HeroRestag';
import { RestagInfoCard, RestagCallCard } from './shared/RestagCards';
import { renderRestagText } from '../lib/utils';
import { RestaurantLP } from '@/data/restaurants';
import Image from 'next/image';
import { RestagLayout } from './RestagLayout';

const DETAIL_NAV_ITEMS = [
  { id: 'hero', label: 'NODE_START', icon: Activity },
  { id: 'metrics', label: 'NODE_KPI', icon: Zap },
  { id: 'editorial', label: 'BRAND_STORY', icon: InfoIcon },
  { id: 'menu', label: 'SIGNATURE_MENU', icon: Utensils },
  { id: 'reservations', label: 'BOOKING_SYNC', icon: Calendar },
  { id: 'process', label: 'GASTRO_ENGINEERING', icon: Flame },
  { id: 'contact', label: 'NODE_LOCATION', icon: MapPin },
  { id: 'audit', label: 'REQUEST_AUDIT', icon: ShieldCheck },
];

interface RestagDetailClientProps {
  restaurant: RestaurantLP;
}

const handleKeyDown = (e: React.KeyboardEvent, callback: () => void) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    callback();
  }
};

const MetricCard = ({ stat, theme }: { stat: any, theme: any }) => {
  const [count, setCount] = React.useState(0);
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const { isDark } = useTheme();
  
  // Extract number from string (e.g., "95%" -> 95)
  const targetValue = parseFloat(stat.value.replace(/[^0-9.]/g, '')) || 0;
  const suffix = stat.value.replace(/[0-9.]/g, '');

  return (
    <motion.div 
      role="button"
      tabIndex={0}
      onKeyDown={(e) => handleKeyDown(e, () => {})}
      onViewportEnter={() => {
        if (!hasAnimated) {
          animate(0, targetValue, {
            duration: 2,
            ease: "easeOut",
            onUpdate: (latest) => setCount(latest)
          });
          setHasAnimated(true);
        }
      }}
      className={`p-10 flex flex-col items-center text-center space-y-2 transition-colors group cursor-pointer ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
    >
      <span className={`text-[10px] font-mono uppercase tracking-widest transition-colors ${isDark ? 'group-hover:text-white' : 'group-hover:text-gray-900'}`} style={{ color: theme.colors.textMuted }}>{stat.label}</span>
      <span className="text-5xl font-black tracking-tighter tabular-nums" style={{ color: theme.colors.primary }}>
        {targetValue % 1 === 0 ? Math.floor(count) : count.toFixed(1)}
        {suffix}
      </span>
      <p className="text-xs font-mono leading-relaxed" style={{ color: theme.colors.textSecondary }}>{renderRestagText(stat.desc || '', 'description', theme)}</p>
    </motion.div>
  );
};

export const RestagDetailClient: React.FC<RestagDetailClientProps> = ({ restaurant }) => {
  const { theme: globalTheme, themeContrast: globalContrast, isDark } = useTheme();
  
  // Use global theme from context
  const theme = globalTheme;
  const themeContrast = globalContrast;

  const [isReserving, setIsReserving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorialRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { scrollYProgress: editorialScroll } = useScroll({
    target: editorialRef,
    offset: ["start end", "end start"]
  });

  // Spring settings for organic card motion
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  const y0 = useSpring(useTransform(editorialScroll, [0.1, 0.6], restaurant.effectsEnabled ? [-60, 60] : [0, 0]), springConfig);
  const y1 = useSpring(useTransform(editorialScroll, [0.1, 0.6], restaurant.effectsEnabled ? [-100, 100] : [0, 0]), springConfig);
  const y2 = useSpring(useTransform(editorialScroll, [0.1, 0.6], restaurant.effectsEnabled ? [-140, 140] : [0, 0]), springConfig);

  const r0 = useSpring(useTransform(editorialScroll, [0.1, 0.6], restaurant.effectsEnabled ? [4, -4] : [0, 0]), springConfig);
  const r1 = useSpring(useTransform(editorialScroll, [0.1, 0.6], restaurant.effectsEnabled ? [-4, 4] : [0, 0]), springConfig);
  const r2 = useSpring(useTransform(editorialScroll, [0.1, 0.6], restaurant.effectsEnabled ? [2, -2] : [0, 0]), springConfig);

  return (
    <RestagLayout navItems={DETAIL_NAV_ITEMS}>
      <div ref={containerRef} className="relative min-h-screen">
        <div className={`relative ${isReserving ? 'z-[200]' : ''} space-y-4 md:space-y-6 pb-12`}>
          
          {/* 1. Hero Section (Labs Blueprint) */}
          <div id="hero">
            <HeroRestag 
              theme={theme}
              effectsEnabled={restaurant.effectsEnabled}
              overline={`NODE_REGISTRY // ${restaurant.slug.toUpperCase()}`}
              overlineIcon={Activity}
              title={restaurant.heroTitle}
              highlight={restaurant.tag.replace('_', ' ')}
              description={restaurant.heroSubtitle}
              image={restaurant.gallery[0]}
              video={restaurant.video}
              watermark={restaurant.videoWatermark}
              statusTags={[
                { label: restaurant.cuisine, color: 'secondary' as any },
                { label: restaurant.priceRange, color: 'blue' as any },
                { label: `STABILITY_SCORE: ${restaurant.rating * 20}%`, color: 'main' as any }
              ]}
              actions={
                <div className="flex flex-wrap items-center gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsReserving(true)}
                    className="flex items-center gap-2 rounded-xl px-10 py-4 text-sm font-black transition-all group shadow-2xl"
                    style={{ backgroundColor: theme.colors.primary, color: themeContrast, boxShadow: `0 10px 30px ${theme.colors.primary}33` }}
                  >
                    <Calendar className="w-4 h-4 transition-transform group-hover:rotate-12" />
                    {restaurant.heroCta}
                  </motion.button>

                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const el = document.getElementById('menu');
                      if (el) {
                        const offset = 80;
                        window.scrollTo({
                          top: el.getBoundingClientRect().top + window.scrollY - offset,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className={`flex items-center gap-2 rounded-xl px-10 py-4 text-sm font-black transition-all border backdrop-blur-md ${
                      isDark 
                        ? 'border-white/20 bg-white/5 hover:bg-white/10 text-white' 
                        : 'border-black/20 bg-black/5 hover:bg-black/10 text-gray-900'
                    }`}
                  >
                    <Utensils className="w-4 h-4" /> 
                    VIEW_MENU
                  </motion.button>
                  
                  <div className={`hidden md:flex items-center gap-2 px-6 py-4 border rounded-xl text-xs font-mono backdrop-blur-md transition-all ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-black/5 border-black/10 text-gray-900'
                  }`} style={{ color: theme.colors.textSecondary }}>
                    <MapPin className="w-4 h-4" style={{ color: theme.colors.primary }} />
                    {restaurant.address.toUpperCase()}
                  </div>
                </div>
              }
            />
          </div>

          {/* 2. Results/Metrics Bar (Labs Blueprint) */}
          <div id="metrics" className="max-w-7xl mx-auto px-6 scroll-mt-20">
            <div className={`grid md:grid-cols-3 gap-1px border rounded-2xl overflow-hidden backdrop-blur-xl transition-all ${
              isDark ? 'bg-white/5 border-white/20' : 'bg-black/5 border-black/20'
            }`}>
              {restaurant.results.map((stat, idx) => (
                <MetricCard key={idx} stat={stat} theme={theme} />
              ))}
            </div>
          </div>

          {/* 2.5 Editorial & Discovery Gallery */}
          <section 
            id="editorial" 
            ref={editorialRef}
            className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center scroll-mt-20 pt-10 pb-20"
          >
            <div className="space-y-8">
              <div 
                className="text-xs font-mono tracking-[0.3em] uppercase"
                style={{ color: theme.colors.primary }}
              >
                .editorial/abstract
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight uppercase">
                {renderRestagText("A ESSÊNCIA DA *EXPERIÊNCIA*", 'title', theme)}
              </h2>
              <p className="leading-relaxed text-lg italic" style={{ color: theme.colors.textSecondary }}>
                "{restaurant.descriptionLong}"
              </p>
              <div className="flex flex-wrap gap-3">
                {restaurant.features.map(feature => (
                  <span key={feature} className={`px-3 py-1 border rounded-full text-[10px] font-mono uppercase tracking-widest transition-all ${
                    isDark ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-black/5 border-black/10 text-gray-600'
                  }`}>
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[500px] md:h-[600px] relative">
              {restaurant.gallery.slice(0, 3).map((img, idx) => {
                // Individual scroll transforms for "baralho" effect
                const y = [y0, y1, y2][idx];
                const r = [r0, r1, r2][idx];
                
                return (
                  <motion.div 
                    key={idx}
                    style={{ y, rotate: r, zIndex: 10 + idx }}
                    whileHover={{ scale: 1.05, zIndex: 50, rotate: 0 }}
                    className={`relative overflow-hidden rounded-[32px] border shadow-2xl transition-all ${
                      idx === 0 ? 'row-span-2' : ''
                    } ${isDark ? 'border-white/10' : 'border-black/10'}`}
                  >
                    <Image 
                      src={img} 
                      alt={`${restaurant.cardTitle.replace(/\*/g, '')} Gallery ${idx}`} 
                      fill 
                      className="object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-20" />
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* 3. Technical Menu (Grid) - MOVED UP FOR CONVERSION */}
          <section id="menu" className="max-w-7xl mx-auto px-6 py-20 space-y-12 scroll-mt-20">
            <div className={`flex flex-col md:flex-row md:items-end justify-between gap-8 border-b pb-10 transition-all ${
              isDark ? 'border-white/5' : 'border-black/5'
            }`}>
              <div className="space-y-4">
                <div 
                  className="text-xs font-mono tracking-[0.3em] uppercase"
                  style={{ color: theme.colors.primary }}
                >
                  .menu/node_registry
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">
                  {renderRestagText("PROTOCOLOS_DE_*SABOR*", 'title', theme)}
                </h2>
              </div>
              <div className="flex gap-4">
                <div className="px-4 py-2 rounded-full text-[10px] font-mono flex items-center gap-2 border" 
                     style={{ 
                       backgroundColor: `${theme.colors.textVoice}1a`, 
                       borderColor: `${theme.colors.textVoice}33`, 
                       color: theme.colors.textVoice 
                     }}>
                  <Zap className="w-3 h-3" />
                  SENSORY_OPTIMIZED
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
              {restaurant.menu.map((category, cIdx) => (
                <div key={cIdx} className="space-y-8">
                  <h3 className="text-sm font-mono uppercase tracking-[0.5em] flex items-center gap-4" style={{ color: theme.colors.textMuted }}>
                    <span>{category.category}</span>
                    <div className={`h-px flex-1 bg-gradient-to-r ${isDark ? 'from-white/10' : 'from-black/10'} to-transparent`} />
                  </h3>
                  <div className="space-y-4">
                    {category.items.map((item, iIdx) => (
                      <MenuItem key={iIdx} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* 3.5 Dedicated Booking Section (New Module) */}
          <section id="reservations" className="max-w-7xl mx-auto px-6 py-12 scroll-mt-20">
            <BookingSection restaurant={restaurant} onOpenDrawer={() => setIsReserving(true)} />
          </section>

          {/* 4. Sticky Scroll Process (Labs Blueprint) */}
          <div id="process" className="max-w-7xl mx-auto px-6 py-24 scroll-mt-20">
            <div className="grid lg:grid-cols-2 gap-20 items-start">
              <div className="space-y-8 sticky top-40 h-fit">
                <div 
                  className="text-xs font-mono tracking-[0.3em] uppercase"
                  style={{ color: theme.colors.primary }}
                >
                  .culinary/engineering
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">
                  {renderRestagText("THE *GASTRO*\nENGINEERING\nCYCLE", 'title', theme)}
                </h2>
                <p className="max-w-md leading-relaxed" style={{ color: theme.colors.textSecondary }}>
                  Nossos nós operacionais seguem protocolos rígidos para garantir a integridade da experiência sensorial. 
                  Cada etapa é calibrada para máxima eficiência.
                </p>
              </div>
              
              <div className="relative pb-[120vh] grid grid-cols-1">
                {restaurant.process.map((step, idx) => (
                  <ProcessStep key={idx} step={step} index={idx} total={restaurant.process.length} theme={theme} />
                ))}
              </div>
            </div>
          </div>

          {/* 4.5 Operational Registry & Contact */}
          <section id="contact" className="max-w-7xl mx-auto px-6 py-12 scroll-mt-20">
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-6">
                <div className={`p-10 border rounded-[40px] backdrop-blur-3xl space-y-8 transition-all ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-black/[0.02] border-black/10'
                }`}>
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Contact_Node</span>
                    <div className={`flex items-center gap-4 text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <Phone className="w-6 h-6" style={{ color: theme.colors.primary }} />
                      {restaurant.phone}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Operating_Registry</span>
                    <div className="space-y-3">
                      {Object.entries(restaurant.operatingHours).map(([day, hours]) => (
                        <div key={day} className={`flex justify-between items-center border-b pb-2 transition-all ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                          <span className="text-xs text-gray-400 font-mono">{day}</span>
                          <span className={`text-xs font-mono ${hours === 'Encerrado' ? 'text-red-500/60' : (isDark ? 'text-white' : 'text-gray-900')}`}>{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`lg:col-span-8 relative rounded-[40px] overflow-hidden border min-h-[400px] transition-all ${
                isDark ? 'border-white/10' : 'border-black/10'
              }`}>
                <Image 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop" 
                  alt="Map View" 
                  fill 
                  className="object-cover grayscale opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent" />
                <div className="absolute bottom-10 left-10 space-y-4">
                  <div className={`backdrop-blur-xl border p-6 rounded-2xl space-y-2 transition-all ${
                    isDark ? 'bg-black/60 border-white/10' : 'bg-white/80 border-black/10'
                  }`}>
                    <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Geospatial_Target</span>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{restaurant.address}</h3>
                    <button className="flex items-center gap-2 text-[10px] font-mono text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
                      Open_In_Google_Maps <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Final CTA / Bento Grid */}
          <section id="audit" className="max-w-7xl mx-auto px-6 pb-12 scroll-mt-20 pt-10">
            <div className="grid md:grid-cols-12 gap-6 h-auto md:h-[500px]">
              <motion.div 
                whileHover={{ y: -5 }}
                className={`md:col-span-8 border rounded-3xl p-16 flex flex-col justify-center items-start space-y-8 relative overflow-hidden backdrop-blur-2xl group transition-all ${
                  isDark ? 'bg-black/60 border-white/10' : 'bg-white/80 border-black/10'
                }`}
              >
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 right-0 w-96 h-96 blur-[100px] rounded-full" style={{ backgroundColor: `${theme.colors.primary}1A` }} />
                  <div className={`absolute bottom-0 right-0 p-8 text-[12rem] font-black pointer-events-none select-none transition-all ${
                    isDark ? 'text-white/[0.02]' : 'text-black/[0.01]'
                  }`}>
                    L47
                  </div>
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none relative z-10">
                  {renderRestagText("INITIATE THE\n*EXPERIENCE\nNODE *RESTAG*", 'title', theme)}
                </h2>
                <p className={`max-w-md relative z-10 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Acesse o núcleo da nossa gastronomia. Garanta seu slot de processamento agora.
                </p>
                <Link 
                  href="/restag/audit"
                  className="px-12 py-5 rounded-2xl font-black tracking-widest hover:scale-105 transition-all relative z-10 flex items-center justify-center"
                  style={{ 
                    backgroundColor: theme.colors.primary,
                    color: themeContrast,
                    boxShadow: `0 0 40px ${theme.colors.primary}4D`
                  }}
                >
                  ACCESS_PROTOCOL
                </Link>
              </motion.div>
              
              <div className="md:col-span-4 grid grid-rows-2 gap-6">
                <div 
                  className={`rounded-3xl p-8 flex flex-col justify-center backdrop-blur-xl group transition-all border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-black/[0.02] border-black/10'
                  }`}
                  style={{ 
                    '--hover-border': `${theme.colors.primary}4D` 
                  } as any}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = `${theme.colors.primary}4D`}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                >
                  <span className="text-[10px] font-mono uppercase mb-2" style={{ color: theme.colors.textVoice }}>{renderRestagText("*Notice_Interval*", 'title', theme)}</span>
                  <span className={`text-4xl font-bold tracking-tighter relative z-10 ${isDark ? 'text-white' : 'text-gray-900'}`}>{restaurant.reservationSettings.notice}</span>
                  <p className={`text-[10px] font-mono mt-2 uppercase relative z-10 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Required lead time for prep</p>
                  <div className={`absolute bottom-0 right-0 p-4 text-6xl font-black pointer-events-none select-none transition-all ${
                    isDark ? 'text-white/[0.03]' : 'text-black/[0.02]'
                  }`}>
                    TIME_REF
                  </div>
                </div>
                <div 
                  className={`rounded-3xl p-8 flex flex-col justify-center backdrop-blur-xl group transition-all border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-black/[0.02] border-black/10'
                  }`}
                  style={{ 
                    '--hover-border': `${theme.colors.primary}4D` 
                  } as any}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = `${theme.colors.primary}4D`}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                >
                  <span className="text-[10px] font-mono uppercase mb-2" style={{ color: theme.colors.textVoice }}>{renderRestagText("*Max_Capacity*", 'title', theme)}</span>
                  <span className={`text-4xl font-bold tracking-tighter relative z-10 ${isDark ? 'text-white' : 'text-gray-900'}`}>{restaurant.reservationSettings.maxPartySize} NODES</span>
                  <p className={`text-[10px] font-mono mt-2 uppercase relative z-10 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Maximum simultaneous processing</p>
                  <div className={`absolute bottom-0 right-0 p-4 text-6xl font-black pointer-events-none select-none transition-all ${
                    isDark ? 'text-white/[0.03]' : 'text-black/[0.02]'
                  }`}>
                    97%
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      {/* Reservation Drawer Overlay */}
      <AnimatePresence>
        {isReserving && (
          <ReservationDrawer 
            restaurant={restaurant} 
            onClose={() => setIsReserving(false)} 
          />
        )}
      </AnimatePresence>
    </RestagLayout>
  );
};

const BookingSection = ({ restaurant, onOpenDrawer }: { restaurant: RestaurantLP, onOpenDrawer: () => void }) => {
  const { theme, isDark, themeContrast } = useTheme();
  
  return (
    <div className={`relative p-12 md:p-20 border rounded-[40px] overflow-hidden backdrop-blur-3xl group transition-all ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-black/[0.02] border-black/10'
    }`}>
      {/* Background Decor */}
      <div className={`absolute top-0 right-0 p-12 text-[15rem] font-black pointer-events-none select-none transition-all ${
        isDark ? 'text-white/[0.02]' : 'text-black/[0.01]'
      }`}>
        BOOK
      </div>
      
      <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="space-y-8">
          <div 
            className="text-xs font-mono tracking-[0.3em] uppercase"
            style={{ color: theme.colors.primary }}
          >
            .reservation/sync_module
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">
            {renderRestagText("GARANTA SEU\n**SLOT** DE\nEXPERIÊNCIA", 'title', theme)}
          </h2>
          <p className={`max-w-md leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Nossos slots de processamento gastronômico são limitados para garantir a integridade de cada ciclo. 
            Sincronize sua presença com o nosso nó central.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-6 border rounded-2xl transition-all ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
              <span className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Notice_Required</span>
              <span className="text-2xl font-bold">{restaurant.reservationSettings.notice}</span>
            </div>
            <div className={`p-6 border rounded-2xl transition-all ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
              <span className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Max_Nodes</span>
              <span className="text-2xl font-bold">{restaurant.reservationSettings.maxPartySize} GUESTS</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="relative w-full aspect-square max-w-[300px] flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className={`absolute inset-0 border-2 border-dashed rounded-full transition-all ${isDark ? 'border-white/10' : 'border-black/10'}`}
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className={`absolute inset-8 border rounded-full transition-all ${isDark ? 'border-white/5' : 'border-black/5'}`}
            />
            <div 
              className={`w-48 h-48 rounded-full border backdrop-blur-2xl flex flex-col items-center justify-center text-center p-6 transition-all ${
                isDark 
                  ? 'bg-white/5 border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)]' 
                  : 'bg-black/5 border-black/10 shadow-[0_0_50px_rgba(0,0,0,0.02)]'
              }`}
            >
              <Calendar className="w-8 h-8 mb-4" style={{ color: theme.colors.primary }} />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] mb-1">Status</span>
              <span className="text-xs font-bold text-green-500/80 uppercase">Slots_Available</span>
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenDrawer}
            className="w-full max-w-sm py-6 rounded-2xl font-black tracking-[0.3em] uppercase transition-all shadow-2xl"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: themeContrast,
              boxShadow: `0 20px 40px ${theme.colors.primary}33`
            }}
          >
            INICIAR_RESERVA_v2.0
          </motion.button>
        </div>
      </div>
    </div>
  );
};

const MenuItem = ({ item }: { item: any }) => {
  const { theme, isDark, themeContrast } = useTheme();
  return (
    <motion.div 
      role="button"
      tabIndex={0}
      whileHover={{ x: 10 }}
      onClick={() => {}}
      onKeyDown={(e) => handleKeyDown(e, () => {})}
      className={`group p-6 border rounded-2xl transition-all cursor-pointer relative overflow-hidden backdrop-blur-sm ${
        isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/5 border-black/10 hover:bg-black/10'
      }`}
    >
      {item.popular && (
        <div className="absolute top-0 right-0 px-4 py-1 font-mono text-[8px] font-black rounded-bl-xl" style={{ backgroundColor: theme.colors.primary, color: themeContrast }}>
          NODE_STAPLE_v1
        </div>
      )}
      <div className="flex justify-between items-start mb-2 relative z-10">
        <h4 className={`text-xl font-black group-hover:bg-[var(--hover-color)] group-hover:text-[var(--hover-text-color)] transition-all px-2 rounded-lg -ml-2 inline-block uppercase tracking-tighter ${
          isDark ? 'text-white' : 'text-gray-900'
        }`} style={{ 
          '--hover-color': theme.colors.primary,
          '--hover-text-color': themeContrast
        } as any}>
          {renderRestagText(item.name, 'title', theme)}
        </h4>
        <span className="font-mono text-lg" style={{ color: theme.colors.primary }}>{item.price}</span>
      </div>
      <p className="text-sm leading-relaxed italic max-w-md" style={{ color: theme.colors.textMuted }}>{renderRestagText(item.desc, 'description', theme)}</p>
    </motion.div>
  );
};

const ReservationDrawer = ({ restaurant, onClose }: { restaurant: RestaurantLP, onClose: () => void }) => {
  const { theme, themeContrast, isDark } = useTheme();
  
  // Form State
  const [partySize, setPartySize] = useState(2);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('19:30');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  
  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  // Get next 7 days for the date picker
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      value: d.toISOString().split('T')[0],
      label: i === 0 ? 'HOJE' : d.toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric' }).toUpperCase(),
      day: d.toLocaleDateString('pt-PT', { day: 'numeric' }),
      weekday: d.toLocaleDateString('pt-PT', { weekday: 'short' }).toUpperCase()
    };
  });

  // Fetch restaurant ID from DB
  React.useEffect(() => {
    const fetchId = async () => {
      try {
        const { data, error } = await supabase
          .from('restag_restaurants')
          .select('id')
          .eq('slug', restaurant.slug)
          .single();
        
        if (data) setRestaurantId(data.id);
        if (error) console.error('Error fetching restaurant ID:', error);
      } catch (e) {
        console.error('Fetch error:', e);
      }
    };
    fetchId();
  }, [restaurant.slug]);

  const handleSubmit = async () => {
    if (!name || !phone) {
      setError('Por favor preencha pelo menos Nome e Telefone.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // If we couldn't get the ID from DB (e.g. policies), we use a placeholder or handle it
      // For this demo, if no ID is found, we might be in a local-only mode, but we try anyway
      const targetId = restaurantId || 'bipolar-uuid-placeholder';

      const { error: insertError } = await supabase
        .from('restag_reservations')
        .insert({
          restaurant_id: targetId,
          customer_name: name,
          customer_email: email || null,
          customer_phone: phone,
          party_size: partySize,
          reservation_date: date,
          reservation_time: time,
          notes: notes || null,
          status: 'pending'
        });

      if (insertError) throw insertError;

      setIsSuccess(true);
    } catch (err: any) {
      console.error('Reservation error:', err);
      setError(err.message || 'Erro ao processar reserva. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150]" />
        <motion.div 
          initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
          className={`fixed top-0 right-0 w-full md:w-[500px] h-full border-l z-[200] flex flex-col items-center justify-center p-12 text-center transition-all ${
            isDark ? 'bg-[#0a0a0a] border-white/10 text-white' : 'bg-white border-black/10 text-gray-900'
          }`}
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
            <CheckCircle2 className="w-24 h-24 mb-8" style={{ color: theme.colors.primary }} />
          </motion.div>
          <h2 className="text-3xl font-black tracking-tighter uppercase mb-4">RESERVA_SYNC_SUCCESS</h2>
          <p className={`mb-12 font-mono text-sm uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            O seu slot foi calibrado com sucesso.<br/>Receberá uma confirmação em breve.
          </p>
          <button 
            onClick={onClose}
            className="px-12 py-5 rounded-2xl font-black text-black tracking-widest transition-all"
            style={{ backgroundColor: theme.colors.primary }}
          >
            TERMINAR_SESSÃO
          </button>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150]"
      />
      <motion.div 
        initial={{ y: "100%", x: 0 }}
        animate={{ y: 0, x: 0 }}
        exit={{ y: "100%", x: 0 }}
        variants={{
          desktop: { y: 0, x: 0 },
          mobile: { y: 0, x: 0 }
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        className={`fixed bottom-0 right-0 w-full md:w-[500px] md:top-0 md:h-full h-[92vh] border-t md:border-t-0 md:border-l z-[200] shadow-2xl overflow-hidden flex flex-col rounded-t-[40px] md:rounded-t-none transition-all ${
          isDark ? 'bg-[#0a0a0a] border-white/10 text-white' : 'bg-white border-black/10 text-gray-900'
        }`}
      >
        {/* Mobile Handle */}
        <div className={`md:hidden w-12 h-1.5 rounded-full mx-auto mt-4 mb-2 shrink-0 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
        {/* Header */}
        <div className={`p-8 border-b flex justify-between items-center transition-all ${
          isDark ? 'border-white/5 bg-zinc-950/50' : 'border-black/5 bg-zinc-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${theme.colors.primary}20`, border: `1px solid ${theme.colors.primary}40` }}>
              <Calendar className="w-5 h-5" style={{ color: theme.colors.primary }} />
            </div>
            <div>
              <h2 className={`text-xl font-bold uppercase tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {renderRestagText("RESERVA_*PROTOCOL*", 'title', theme)}
              </h2>
              <p className={`text-[10px] font-mono ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{restaurant.cardTitle.replace(/\*/g, '').toUpperCase()} // SLOT_CALIBRATION</p>
            </div>
          </div>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-gray-500' : 'hover:bg-black/10 text-gray-600'}`}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 nexus-scrollbar">
          {/* Party Size */}
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <h3 className="text-[10px] font-mono uppercase tracking-[0.3em]">
                {renderRestagText("01. Party_*Size*_Config", 'title', theme)}
              </h3>
              <span className="text-[10px] font-mono text-gray-500 uppercase">LIMIT: {restaurant.reservationSettings.maxPartySize} NODES</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex-1 flex items-center justify-between p-2 rounded-2xl border transition-all ${
                isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-gray-900'
              }`}>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPartySize(Math.max(1, partySize - 1))}
                  className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'}`}
                >
                  -
                </motion.button>
                
                <div className="flex flex-col items-center">
                  <motion.span 
                    key={partySize}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`text-4xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}
                  >
                    {partySize}
                  </motion.span>
                  <span className="text-[8px] font-mono uppercase text-gray-500 tracking-widest">GUESTS</span>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPartySize(Math.min(restaurant.reservationSettings.maxPartySize, partySize + 1))}
                  className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors text-xl font-bold`}
                  style={{ 
                    backgroundColor: partySize < restaurant.reservationSettings.maxPartySize ? `${theme.colors.primary}20` : 'transparent', 
                    color: partySize < restaurant.reservationSettings.maxPartySize ? theme.colors.primary : (isDark ? '#fff' : '#000') 
                  }}
                >
                  +
                </motion.button>
              </div>

              {/* Quick Select for common sizes */}
              <div className="grid grid-cols-2 gap-2">
                {[2, 4].map(size => (
                  <button 
                    key={size}
                    onClick={() => setPartySize(size)}
                    className={`px-4 py-2 rounded-xl border font-mono text-xs transition-all ${
                      partySize === size 
                        ? (isDark ? 'bg-white border-white text-black' : 'bg-black border-black text-white') 
                        : (isDark ? 'bg-transparent border-white/10 text-gray-400' : 'bg-transparent border-black/10 text-gray-600')
                    }`}
                  >
                    {size}P
                  </button>
                ))}
              </div>
            </div>

            {partySize >= restaurant.reservationSettings.maxPartySize && (
              <p className="text-[9px] font-mono text-amber-500/80 uppercase tracking-tight">
                Capacidade máxima atingida para este slot.
              </p>
            )}
          </section>

          {/* Date Selection */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.3em]">
              {renderRestagText("02. Temporal_*Node*_Target", 'title', theme)}
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {dates.map(d => (
                <button 
                  key={d.value}
                  onClick={() => setDate(d.value)}
                  className={`flex-shrink-0 w-20 p-4 border rounded-xl flex flex-col items-center gap-1 transition-all ${
                    date === d.value 
                      ? (isDark ? 'bg-white/10 border-white text-white' : 'bg-black/10 border-black text-black') 
                      : (isDark ? 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20' : 'bg-black/5 border-black/5 text-gray-600 hover:border-black/20')
                  }`}
                  style={{ borderColor: date === d.value ? theme.colors.primary : '' }}
                >
                  <span className="text-[8px] font-mono opacity-60">{d.weekday}</span>
                  <span className="text-xl font-bold">{d.day}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Time Slots */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.3em]">
              {renderRestagText("03. Time_Slot_*Calibration*", 'title', theme)}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'].map(t => (
                <button 
                  key={t}
                  onClick={() => setTime(t)}
                  className={`p-3 border rounded-xl transition-all font-mono text-xs ${
                    time === t 
                      ? (isDark ? 'bg-white/10 border-white text-white' : 'bg-black/10 border-black text-black') 
                      : (isDark ? 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20' : 'bg-black/5 border-black/5 text-gray-600 hover:border-black/20')
                  }`}
                  style={{ borderColor: time === t ? theme.colors.primary : '' }}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          {/* Guest Identity */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.3em]">
              {renderRestagText("04. Guest_*Identity*_Metadata", 'title', theme)}
            </h3>
            <div className="space-y-3">
              <input 
                type="text" placeholder="NOME_COMPLETO" value={name} onChange={(e) => setName(e.target.value)}
                className={`w-full border rounded-xl p-4 text-sm font-mono focus:outline-none transition-colors ${
                  isDark 
                    ? 'bg-white/5 border-white/10 text-white focus:border-white/40' 
                    : 'bg-black/5 border-black/10 text-gray-900 focus:border-black/40'
                }`}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input 
                  type="tel" placeholder="TELEFONE" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className={`w-full border rounded-xl p-4 text-sm font-mono focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white focus:border-white/40' 
                      : 'bg-black/5 border-black/10 text-gray-900 focus:border-black/40'
                  }`}
                />
                <input 
                  type="email" placeholder="EMAIL (OPTIONAL)" value={email} onChange={(e) => setEmail(e.target.value)}
                  className={`w-full border rounded-xl p-4 text-sm font-mono focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white focus:border-white/40' 
                      : 'bg-black/5 border-black/10 text-gray-900 focus:border-black/40'
                  }`}
                />
              </div>
              <textarea 
                placeholder="OBSERVAÇÕES_ADICIONAIS" value={notes} onChange={(e) => setNotes(e.target.value)}
                className={`w-full border rounded-xl p-4 text-sm font-mono focus:outline-none transition-colors h-24 resize-none ${
                  isDark 
                    ? 'bg-white/5 border-white/10 text-white focus:border-white/40' 
                    : 'bg-black/5 border-black/10 text-gray-900 focus:border-black/40'
                }`}
              />
            </div>
          </section>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-500 text-xs font-mono">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <RestagInfoCard 
            title="SYNC_ACTIVE"
            description="Slot calibration synchronized with local restaurant hardware every 30s via Ag47 Nexus."
          />
        </div>

        {/* Footer Action */}
        <div className={`p-8 border-t transition-all ${isDark ? 'bg-zinc-950 border-white/5' : 'bg-zinc-50 border-black/5'}`}>
          <button 
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="w-full py-5 font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: themeContrast,
              boxShadow: `0 0 40px ${theme.colors.primary}33`
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                PROCESSING_DATA...
              </>
            ) : (
              'CONFIRM_PROTOCOL_EXECUTION'
            )}
          </button>
        </div>
      </motion.div>
    </>
  );
};

const ProcessStep = ({ step, index, total, theme }: { step: any, index: number, total: number, theme: any }) => {
  const { isDark, themeContrast } = useTheme();

  return (
    <div 
      className="sticky h-0 overflow-visible"
      style={{ 
        top: '120px',
        zIndex: index + 1,
        marginTop: index > 0 ? '60vh' : '0'
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.5 }}
        className={`space-y-6 p-6 md:p-10 border rounded-[30px] md:rounded-[40px] backdrop-blur-3xl relative overflow-hidden group shadow-2xl transition-all ${
          isDark ? 'bg-zinc-900/90 border-white/10' : 'bg-white/90 border-black/10'
        }`}
      >
        <div 
          className={`absolute top-0 right-0 p-8 text-8xl font-black pointer-events-none transition-all ${
            isDark ? 'text-white/[0.03]' : 'text-black/[0.02]'
          }`}
          style={{ '--hover-text': `${theme.colors.primary}0D` } as any}
        >
          {step.step}
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold" style={{ backgroundColor: theme.colors.primary, color: themeContrast }}>
          {step.step}
        </div>
        <h3 className={`text-3xl font-bold tracking-tighter uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>{renderRestagText(step.title, 'title', theme)}</h3>
        <p className="leading-relaxed italic" style={{ color: theme.colors.textSecondary }}>{renderRestagText(step.desc, 'description', theme)}</p>
        <div className={`pt-6 border-t transition-all ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Metadata_Log</p>
          <p className="text-xs mt-2" style={{ color: theme.colors.textMuted }}>{step.detail}</p>
        </div>
      </motion.div>
    </div>
  );
};
