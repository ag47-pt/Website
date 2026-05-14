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
  Info as InfoIcon
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { LabHero, LabInfoCard, LabCallCard } from '@/app/labs/components';
import { renderFormattedText } from '@/app/labs/components/utils';
import { RestaurantLP } from '@/data/restaurants';
import Image from 'next/image';
import { RestagLayout } from './RestagLayout';

const DETAIL_NAV_ITEMS = [
  { id: 'hero', label: 'NODE_START', icon: Activity },
  { id: 'metrics', label: 'NODE_KPI', icon: Zap },
  { id: 'editorial', label: 'EDITORIAL_DATA', icon: InfoIcon },
  { id: 'process', label: 'PROTOCOLS', icon: Flame },
  { id: 'menu', label: 'FLAVOR_NODES', icon: Utensils },
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
      className="p-10 flex flex-col items-center text-center space-y-2 hover:bg-white/5 transition-colors group cursor-pointer"
    >
      <span className="text-[10px] font-mono uppercase tracking-widest transition-colors group-hover:text-white" style={{ color: theme.colors.textMuted }}>{stat.label}</span>
      <span className="text-5xl font-black tracking-tighter tabular-nums" style={{ color: theme.colors.primary }}>
        {targetValue % 1 === 0 ? Math.floor(count) : count.toFixed(1)}
        {suffix}
      </span>
      <p className="text-xs font-mono leading-relaxed" style={{ color: theme.colors.textSecondary }}>{renderFormattedText(stat.desc || '', 'description', theme)}</p>
    </motion.div>
  );
};

export const RestagDetailClient: React.FC<RestagDetailClientProps> = ({ restaurant }) => {
  const { theme, themeContrast } = useTheme();
  const [isReserving, setIsReserving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <RestagLayout navItems={DETAIL_NAV_ITEMS}>
      <div ref={containerRef} className="relative min-h-screen">
        <div className={`relative ${isReserving ? 'z-[200]' : ''} space-y-32 pb-32`}>
          
          {/* 1. Hero Section (Labs Blueprint) */}
          <div id="hero">
            <LabHero 
          overline={`NODE_REGISTRY // ${restaurant.slug.toUpperCase()}`}
          overlineIcon={Activity}
          title={restaurant.heroTitle}
          highlight={restaurant.tag.replace('_', ' ')}
          description={restaurant.heroSubtitle}
          image={restaurant.gallery[0]}
          video={restaurant.video}
          watermark={restaurant.videoWatermark}
          onImageClick={() => setIsReserving(true)}
          statusTags={[
            { label: restaurant.cuisine, color: "lime" },
            { label: restaurant.priceRange, color: "blue" },
            { label: `STABILITY_SCORE: ${restaurant.rating * 20}%`, color: "main" }
          ]}
          actions={
            <div className="flex flex-wrap items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsReserving(true)}
                className="flex items-center gap-2 rounded-xl px-10 py-4 text-sm font-black shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all group"
                style={{ backgroundColor: theme.colors.primary, color: themeContrast }}
              >
                <Target className="w-4 h-4" /> 
                INIT_RESERVATION_v1.0
              </motion.button>
              
              <div className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-xs font-mono backdrop-blur-md" style={{ color: theme.colors.textSecondary }}>
                <MapPin className="w-4 h-4" style={{ color: theme.colors.primary }} />
                {restaurant.address.toUpperCase()}
              </div>
            </div>
          }
        />
      </div>

        {/* 2. Results/Metrics Bar (Labs Blueprint) */}
        <div id="metrics" className="max-w-7xl mx-auto px-6 scroll-mt-20 pt-10">
          <div className="grid md:grid-cols-3 gap-1px bg-white/1 border border-white/20 rounded-2xl overflow-hidden backdrop-blur-xl">
            {restaurant.results.map((stat, idx) => (
              <MetricCard key={idx} stat={stat} theme={theme} />
            ))}
          </div>
        </div>

        {/* 2.5 Editorial & Discovery Gallery */}
        <section id="editorial" className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center scroll-mt-20 pt-16">
          <div className="space-y-8">
            <div 
              className="text-xs font-mono tracking-[0.3em] uppercase"
              style={{ color: theme.colors.primary }}
            >
              .editorial/abstract
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight uppercase">
              {renderFormattedText("A ESSÊNCIA DA *EXPERIÊNCIA*", 'title', theme)}
            </h2>
            <p className="leading-relaxed text-lg italic" style={{ color: theme.colors.textSecondary }}>
              "{restaurant.descriptionLong}"
            </p>
            <div className="flex flex-wrap gap-3">
              {restaurant.features.map(feature => (
                <span key={feature} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  {feature}
                </span>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 h-[500px]">
            {restaurant.gallery.slice(0, 4).map((img, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 0.98 }}
                className={`relative overflow-hidden rounded-3xl border border-white/10 ${idx === 0 ? 'row-span-2' : ''}`}
              >
                <Image 
                  src={img} 
                  alt={`${restaurant.cardTitle.replace(/\*/g, '')} Gallery ${idx}`} 
                  fill 
                  className="object-cover transition-transform duration-700 hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. Sticky Scroll Process (Labs Blueprint) */}
        <div id="process" className="max-w-7xl mx-auto px-6 py-40 scroll-mt-20">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div className="space-y-8 sticky top-40 h-fit">
              <div 
                className="text-xs font-mono tracking-[0.3em] uppercase"
                style={{ color: theme.colors.primary }}
              >
                .operational/protocol
              </div>
              <h2 className="text-5xl font-black tracking-tighter leading-none">
                {renderFormattedText("THE *GASTRO*\nENGINEERING\nCYCLE", 'title', theme)}
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

        {/* 4. Technical Menu (Grid) */}
        <section id="menu" className="max-w-7xl mx-auto px-6 py-20 space-y-16 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
            <div className="space-y-4">
              <div 
                className="text-xs font-mono tracking-[0.3em] uppercase"
                style={{ color: theme.colors.primary }}
              >
                .menu/node_registry
              </div>
              <h2 className="text-5xl font-black tracking-tighter uppercase">
                {renderFormattedText("PROTOCOLOS_DE_*SABOR*", 'title', theme)}
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
                  <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
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

        {/* 4.5 Operational Registry & Contact */}
        <section id="contact" className="max-w-7xl mx-auto px-6 py-20 scroll-mt-20">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-3xl space-y-8">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Contact_Node</span>
                  <div className="flex items-center gap-4 text-2xl font-bold text-white">
                    <Phone className="w-6 h-6" style={{ color: theme.colors.primary }} />
                    {restaurant.phone}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Operating_Registry</span>
                  <div className="space-y-3">
                    {Object.entries(restaurant.operatingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-xs text-gray-400 font-mono">{day}</span>
                        <span className={`text-xs font-mono ${hours === 'Encerrado' ? 'text-red-500/60' : 'text-white'}`}>{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-8 relative rounded-[40px] overflow-hidden border border-white/10 min-h-[400px]">
              <Image 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop" 
                alt="Map View" 
                fill 
                className="object-cover grayscale opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent" />
              <div className="absolute bottom-10 left-10 space-y-4">
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Geospatial_Target</span>
                  <h3 className="text-xl font-bold text-white">{restaurant.address}</h3>
                  <button className="flex items-center gap-2 text-[10px] font-mono text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
                    Open_In_Google_Maps <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Final CTA / Bento Grid */}
        <section id="audit" className="max-w-7xl mx-auto px-6 pb-40 scroll-mt-20 pt-16">
          <div className="grid md:grid-cols-12 gap-6 h-[500px]">
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-8 bg-black/60 border border-white/10 rounded-3xl p-16 flex flex-col justify-center items-start space-y-8 relative overflow-hidden backdrop-blur-2xl group"
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 right-0 p-8 text-[12rem] font-black text-white/[0.02] pointer-events-none select-none">
                  L47
                </div>
              </div>
              <h2 className="text-6xl font-black tracking-tighter leading-none relative z-10">
                {renderFormattedText("INITIATE THE\n*EXPERIENCE\nNODE *RESTAG*", 'title', theme)}
              </h2>
              <p className="text-gray-400 max-w-md relative z-10">
                Acesse o núcleo da nossa gastronomia. Garanta seu slot de processamento agora.
              </p>
              <Link 
                href="/restag/audit"
                className="px-12 py-5 rounded-2xl font-black text-black tracking-widest hover:scale-105 transition-all relative z-10 shadow-[0_0_40px_rgba(16,185,129,0.3)] flex items-center justify-center"
                style={{ backgroundColor: theme.colors.primary }}
              >
                ACCESS_PROTOCOL
              </Link>
            </motion.div>
            
            <div className="md:col-span-4 grid grid-rows-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-center backdrop-blur-xl group hover:border-emerald-500/30 transition-all">
                <span className="text-[10px] font-mono uppercase mb-2" style={{ color: theme.colors.textVoice }}>{renderFormattedText("*Notice_Interval*", 'title', theme)}</span>
                <span className="text-4xl font-bold tracking-tighter relative z-10">{restaurant.reservationSettings.notice}</span>
                <p className="text-[10px] text-gray-100 font-mono mt-2 uppercase relative z-10">Required lead time for prep</p>
                <div className="absolute bottom-0 right-0 p-4 text-6xl font-black text-white/[0.03] pointer-events-none select-none">
                  TIME_REF
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-center backdrop-blur-xl group hover:border-emerald-500/30 transition-all">
                <span className="text-[10px] font-mono uppercase mb-2" style={{ color: theme.colors.textVoice }}>{renderFormattedText("*Max_Capacity*", 'title', theme)}</span>
                <span className="text-4xl font-bold tracking-tighter relative z-10">{restaurant.reservationSettings.maxPartySize} NODES</span>
                <p className="text-[10px] text-gray-100 font-mono mt-2 uppercase relative z-10">Maximum simultaneous processing</p>
                <div className="absolute bottom-0 right-0 p-4 text-6xl font-black text-white/[0.03] pointer-events-none select-none">
                  97%
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Reservation Drawer */}
      <AnimatePresence>
        {isReserving && (
          <ReservationDrawer 
            restaurant={restaurant} 
            onClose={() => setIsReserving(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  </RestagLayout>
);
};

const MenuItem = ({ item }: { item: any }) => {
  const { theme } = useTheme();
  return (
    <motion.div 
      role="button"
      tabIndex={0}
      whileHover={{ x: 10 }}
      onClick={() => {}}
      onKeyDown={(e) => handleKeyDown(e, () => {})}
      className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden backdrop-blur-sm"
    >
      {item.popular && (
        <div className="absolute top-0 right-0 px-4 py-1 font-mono text-[8px] font-black rounded-bl-xl text-black" style={{ backgroundColor: theme.colors.primary }}>
          NODE_STAPLE_v1
        </div>
      )}
      <div className="flex justify-between items-start mb-2 relative z-10">
        <h4 className="text-xl font-black text-white group-hover:bg-[var(--hover-color)] group-hover:text-black transition-all px-2 rounded-lg -ml-2 inline-block uppercase tracking-tighter" style={{ '--hover-color': theme.colors.primary } as any}>
          {renderFormattedText(item.name, 'title', theme)}
        </h4>
        <span className="font-mono text-lg" style={{ color: theme.colors.primary }}>{item.price}</span>
      </div>
      <p className="text-sm leading-relaxed italic max-w-md" style={{ color: theme.colors.textMuted }}>{renderFormattedText(item.desc, 'description', theme)}</p>
    </motion.div>
  );
};

const ReservationDrawer = ({ restaurant, onClose }: { restaurant: RestaurantLP, onClose: () => void }) => {
  const { theme, themeContrast } = useTheme();
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        onKeyDown={(e) => handleKeyDown(e, onClose)}
        role="button"
        tabIndex={0}
        aria-label="Close reservation drawer"
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150]"
      />
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        className="fixed top-0 right-0 w-full md:w-[500px] h-full bg-[#0a0a0a] border-l border-white/10 z-[200] shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-8 border-b border-white/5 bg-zinc-950/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${theme.colors.primary}20`, border: `1px solid ${theme.colors.primary}40` }}>
              <Calendar className="w-5 h-5" style={{ color: theme.colors.primary }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tighter">
                {renderFormattedText("RESERVA_*PROTOCOL*", 'title', theme)}
              </h2>
              <p className="text-[10px] font-mono text-gray-500">{restaurant.cardTitle.replace(/\*/g, '').toUpperCase()} // SLOT_CALIBRATION</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            onKeyDown={(e) => handleKeyDown(e, onClose)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-500"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-12 nexus-scrollbar">
          <section className="space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-[0.3em]" style={{ color: theme.colors.primary }}>
              {renderFormattedText("Party_*Size*_Config", 'title', theme)}
            </h3>
            <div className="grid grid-cols-4 gap-3" role="group" aria-label="Party Size Selection">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
                <button 
                  key={size} 
                  id={`party-size-${size}`}
                  aria-label={`${size} persons`}
                  onClick={() => {}}
                  onKeyDown={(e) => handleKeyDown(e, () => {})}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-emerald-500 hover:text-emerald-500 transition-all font-mono text-sm"
                  style={{ borderColor: size === 1 ? theme.colors.primary : 'rgba(255,255,255,0.1)' }}
                >
                  {size}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-[0.3em]" style={{ color: theme.colors.primary }}>
              {renderFormattedText("Time_Slot_*Calibration*", 'title', theme)}
            </h3>
            <div className="grid grid-cols-2 gap-3" role="group" aria-label="Time Slot Selection">
              {['19:00', '19:30', '20:00', '20:30', '21:00', '21:30'].map(time => (
                <button 
                  key={time} 
                  id={`time-slot-${time.replace(':', '')}`}
                  aria-label={`Time slot ${time}`}
                  onClick={() => {}}
                  onKeyDown={(e) => handleKeyDown(e, () => {})}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl hover:text-white transition-all font-mono text-sm flex justify-between items-center group"
                  style={{ border: `1px solid rgba(255,255,255,0.1)` }}
                >
                  {time}
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: theme.colors.primary }} />
                </button>
              ))}
            </div>
          </section>

          <LabInfoCard 
            title="SYNC_ACTIVE"
            description="Slot calibration synchronized with local restaurant hardware every 30s."
          />
        </div>

        <div className="p-8 bg-zinc-950 border-t border-white/5">
          <button 
            className="w-full py-5 text-black font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(16,185,129,0.2)]"
            style={{ backgroundColor: theme.colors.primary }}
          >
            CONFIRM_PROTOCOL_EXECUTION
          </button>
        </div>
      </motion.div>
    </>
  );
};
const ProcessStep = ({ step, index, total, theme }: { step: any, index: number, total: number, theme: any }) => {
  return (
    <div 
      className="sticky h-0 overflow-visible"
      style={{ 
        top: '200px',
        zIndex: index + 1,
        marginTop: index > 0 ? `${index * 60}vh` : '0'
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.5 }}
        className="space-y-6 p-10 bg-zinc-900/90 border border-white/10 rounded-[40px] backdrop-blur-3xl relative overflow-hidden group shadow-2xl"
      >
        <div className="absolute top-0 right-0 p-8 text-8xl font-black text-white/[0.03] pointer-events-none group-hover:text-emerald-500/5 transition-colors">
          {step.step}
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-black font-bold" style={{ backgroundColor: theme.colors.primary }}>
          {step.step}
        </div>
        <h3 className="text-3xl font-bold tracking-tighter uppercase">{renderFormattedText(step.title, 'title', theme)}</h3>
        <p className="leading-relaxed italic" style={{ color: theme.colors.textSecondary }}>{renderFormattedText(step.desc, 'description', theme)}</p>
        <div className="pt-6 border-t border-white/5">
          <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Metadata_Log</p>
          <p className="text-xs mt-2" style={{ color: theme.colors.textMuted }}>{step.detail}</p>
        </div>
      </motion.div>
    </div>
  );
};
