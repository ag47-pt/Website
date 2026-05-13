'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants, useSpring, useTransform, animate } from 'framer-motion';
import { Utensils, Search, Filter, Layers, Globe, Activity, ShieldCheck, Zap, ChevronRight, MapPin, SlidersHorizontal, Clock, Calendar, Gift, ChevronDown, Info, MousePointer2 } from 'lucide-react';
import { LabHero } from '@/app/labs/components';
import { LabVisitCard, LabCallCard } from '@/app/labs/components/LabCards';
import { RestagLayout } from './components/RestagLayout';
import { MapPortal } from './components/MapPortal';
import { restaurants, RestaurantLP } from '@/data/restaurants';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { renderFormattedText } from '@/app/labs/components/utils';
import { Skeleton, CardSkeleton, MetricSkeleton } from '@/components/ui/Skeleton';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] 
    }
  }
};

const PORTAL_NAV_ITEMS = [
  { id: 'hero', label: 'DISCOVERY_START', icon: Utensils },
  { id: 'featured', label: 'GRID_NODES', icon: Zap },
  { id: 'map', label: 'GEOSPATIAL_MAP', icon: MapPin },
  { id: 'metrics', label: 'THERMAL_STATUS', icon: Activity },
];

export default function RestagDiscoveryPortal() {
  const { theme } = useTheme();
  const router = useRouter();
  const [selectedRest, setSelectedRest] = useState<RestaurantLP | undefined>(undefined);
  const [activeCluster, setActiveCluster] = useState('ALL_NODES');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  const clusters = ['ALL_NODES', 'SINTRA_CLUSTER', 'LISBON_CLUSTER', 'PREMIUM_NODES'];

  const handleNodeClick = (rest: RestaurantLP) => {
    if (selectedRest?.slug === rest.slug) {
      router.push(`/restag/${rest.slug}`);
    } else {
      setSelectedRest(rest);
    }
  };

  return (
    <RestagLayout activeView="MAP" navItems={PORTAL_NAV_ITEMS}>
      <div className="space-y-12">
        
        {/* Section 1: Hero Discovery */}
        <div id="hero">
          <LabHero 
          overline="RESTAG_HOSPITALITY_v1.0"
          overlineIcon={Utensils}
          title="Discovery"
          highlight="Portal"
          description="Mapeamento geospacial de alta precisão para destinos culinários certificados. Conecte-se à malha de hospitalidade mais avançada de Portugal."
          statusTags={[
            { label: "GRID_ACTIVE", color: "lime", pulse: true },
            { label: "2_NODES_DETECTION", color: "blue" },
            { label: "SINTRA_CLUSTER", color: "main" }
          ]}
        />
        </div>

        {/* Section 2: Featured Nodes with Advanced Filters */}
        <motion.section 
          id="featured"
          variants={itemVariants}
          className="space-y-12"
        >
          {/* Advanced Filter Bar */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="p-2 bg-white/5 border border-white/10 rounded-xl" style={{ color: theme.colors.textSecondary }}>
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div className="w-[1px] h-6 bg-white/10 mx-1 hidden sm:block" />
              
              <div className="flex flex-wrap gap-2">
                <FilterPill icon={Clock} label="Open" />
                <FilterPill icon={Calendar} label="Reservations" />
                <FilterPill icon={Gift} label="Gift" />
              </div>
              
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] sm:text-sm font-medium hover:bg-white/10 transition-all" style={{ color: theme.colors.textPrimary }}>
                  <Utensils className="w-3.5 h-3.5" />
                  Cuisines
                  <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover:rotate-180 transition-transform" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b border-white/5 pb-8">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Activity className="w-6 h-6" style={{ color: theme.colors.primary }} />
              </div>
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] mb-1" style={{ color: theme.colors.textMuted }}>Grid_Clusters</h3>
                <div className="text-2xl font-bold text-white tracking-tight uppercase">
                  {renderFormattedText("Featured_*Nodes*", 'title', theme)}
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : (
              restaurants.map((rest) => (
                <LabVisitCard 
                  key={rest.slug}
                  title={rest.cardTitle}
                  client={rest.address.split(',')[0]}
                  description={rest.metaDescription}
                  thumbnail={rest.img}
                  progress={parseFloat(rest.results[0].value) || 95}
                  specs={rest.valueProps.map(v => v.title).slice(0, 3)}
                  slug={rest.slug}
                  hasSandbox={true}
                  icon={<Utensils />}
                  path={`/restag/${rest.slug}`}
                  actionLabel="Acessar LP Imersiva"
                />
              ))
            )}
          </div>
        </motion.section>

        {/* Section 3: The Matrix (Map & Dynamic List) */}
        <motion.section 
          id="map"
          variants={itemVariants}
          className="space-y-12"
        >
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left: Map Discovery */}
            <div className="lg:col-span-8 space-y-8">
              <div className="sticky top-24 z-40 flex flex-col sm:flex-row sm:items-center justify-between bg-black/60 border border-white/5 p-4 sm:p-6 rounded-[32px] md:rounded-[40px] backdrop-blur-3xl gap-6 sm:gap-4 shadow-2xl transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Search className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.colors.primary }} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {renderFormattedText("Geospatial_*Index*", 'title', theme)}
                    </h2>
                    <p className="text-[8px] sm:text-[10px] font-mono uppercase tracking-widest" style={{ color: theme.colors.textMuted }}>Global_Node_Positioning_v4.0</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {clusters.map(cluster => (
                    <button 
                      key={cluster}
                      onClick={() => setActiveCluster(cluster)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveCluster(cluster);
                        }
                      }}
                      aria-label={`Filter nodes by ${cluster.replace('_', ' ')}`}
                      className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg font-mono text-[8px] sm:text-[10px] border transition-all ${
                        activeCluster === cluster 
                          ? 'text-black border-white' 
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                      style={activeCluster === cluster ? { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary } : { color: theme.colors.textMuted }}
                    >
                      {cluster.split('_')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-zinc-950">
                <MapPortal 
                  restaurants={restaurants} 
                  onSelect={(r: RestaurantLP) => {
                    handleNodeClick(r);
                    const element = document.getElementById(`registry-${r.slug}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  selectedId={selectedRest?.slug}
                />
              </div>
            </div>

            {/* Right: Node Registry */}
            <div className="lg:col-span-4 space-y-8">
              <div className="flex items-center gap-4 px-2">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Layers className="w-6 h-6" style={{ color: theme.colors.primary }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight uppercase">
                    {renderFormattedText("*Registry*", 'title', theme)}
                  </h2>
                  <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: theme.colors.textMuted }}>Active_Node_Roster</p>
                </div>
              </div>

              <div className="space-y-4 max-h-[700px] overflow-y-auto nexus-scrollbar pr-4">
                <AnimatePresence mode="popLayout">
                  {restaurants
                    .filter(r => activeCluster === 'ALL_NODES' || r.address.toUpperCase().includes(activeCluster.split('_')[0]))
                    .map((rest, idx) => (
                    <motion.div
                      key={rest.slug}
                      id={`registry-${rest.slug}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <LabCallCard 
                        title={rest.cardTitle}
                        description={rest.address}
                        path={`/restag/${rest.slug}`}
                        icon={<MapPin className="w-6 h-6" />}
                        status={selectedRest?.slug === rest.slug ? "SELECTED" : "ONLINE"}
                        onClick={() => handleNodeClick(rest)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 4: Ecosystem Metrics (Full-Width Background and Animations) */}
        <div id="metrics" className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden border-y border-white/18 bg-zinc-900/5 backdrop-blur-2xl">
          {/* Internal technical background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          <motion.section 
            variants={itemVariants}
            whileInView="visible"
            initial="hidden"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-7xl mx-auto px-6 py-20 relative z-10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {isLoading ? (
                <>
                  <MetricSkeleton />
                  <MetricSkeleton />
                  <MetricSkeleton />
                  <MetricSkeleton />
                </>
              ) : (
                <>
                  <Metric 
                    label="NODES_ONLINE" 
                    targetValue={2} 
                    icon={Activity} 
                    description="Total de instâncias certificadas e ativas na malha de hospitalidade Ag47."
                  />
                  <Metric 
                    label="GLOBAL_RESERVATIONS" 
                    targetValue={1200} 
                    suffix="k"
                    icon={Zap} 
                    description="Volume agregado de transações de reserva processadas pelo motor Restag."
                  />
                  <Metric 
                    label="AUDIT_SCORE" 
                    targetValue={98.2} 
                    icon={ShieldCheck} 
                    description="Índice de conformidade técnica baseado no blueprint de Gastro-Engenharia."
                  />
                  <Metric 
                    label="SYNC_SPEED" 
                    targetValue={12} 
                    suffix="ms"
                    icon={Globe} 
                    description="Latência média de sincronização entre o nó local e o cluster central."
                  />
                </>
              )}
            </div>
          </motion.section>
        </div>

        {/* Section 5: Call to Action */}
        <motion.section 
          variants={itemVariants}
          whileInView="visible"
          initial="hidden"
          viewport={{ once: true }}
          className="relative p-20 rounded-[64px] overflow-hidden border border-white/10 bg-zinc-950/40 group text-center"
        >
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--dot-color)_1.5px,transparent_1.5px)] bg-[size:32px_32px]" style={{ '--dot-color': theme.colors.primary } as any} />
          </div>
          
          <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto space-y-10">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center relative"
            >
              <div className="absolute inset-0 blur-xl opacity-20" style={{ backgroundColor: theme.colors.primary }} />
              <Utensils className="w-10 h-10" style={{ color: theme.colors.primary }} />
            </motion.div>
            
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tighter leading-none uppercase">
                {renderFormattedText("Deploy to the *Grid*", 'title', theme)}
              </h2>
              <p className="text-xl font-mono uppercase tracking-widest" style={{ color: theme.colors.textSecondary }}>Ag47 Labs Infrastructure</p>
            </div>
            
            <button 
              onClick={() => router.push('/restag/audit')}
              className="group/btn relative px-12 py-5 rounded-full font-bold text-black transition-all hover:scale-105 active:scale-95 shadow-2xl overflow-hidden"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <span className="relative z-10 flex items-center gap-3 text-lg uppercase tracking-widest">
                REQUEST_AUDIT <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </motion.section>

      </div>
    </RestagLayout>
  );
}

const FilterPill = ({ icon: Icon, label }: { icon: any; label: string }) => {
  const { theme } = useTheme();
  return (
    <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-all hover:border-white/20 active:scale-95" style={{ color: theme.colors.textPrimary }}>
      <Icon className="w-4 h-4" style={{ color: theme.colors.primary }} />
      {label}
    </button>
  );
};

const Metric = ({ label, targetValue, suffix = "", icon: Icon, description }: any) => {
  const { theme } = useTheme();
  const [count, setCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

   return (
    <motion.div 
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`View details for ${label}`}
      onKeyDown={(e: any) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }
      }}
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
      className="flex flex-col items-center text-center gap-4 group cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-2 border border-white/10 group-hover:border-white/20 transition-all group-hover:scale-110 relative">
        <Icon className="w-7 h-7 text-gray-500 group-hover:text-white transition-colors" style={{ color: theme.colors.primary }} />
        {/* Secondary color accent */}
        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: theme.colors.secondary }} />
      </div>
      
      <div className="text-5xl font-bold text-white tracking-tighter transition-all group-hover:scale-105 tabular-nums" style={{ color: theme.colors.primary }}>
        {targetValue % 1 === 0 ? Math.floor(count) : count.toFixed(1)}
        {suffix}
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <div className="text-[10px] font-mono uppercase tracking-[0.4em] flex items-center gap-2" style={{ color: theme.colors.textMuted }}>
          {label}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-gray-400"
          >
            <ChevronDown className="w-3 h-3" />
          </motion.div>
        </div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="text-[9px] font-mono leading-relaxed mt-2 max-w-[150px] uppercase tracking-wider" style={{ color: theme.colors.secondary }}>
                {description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hover prompt */}
      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-[8px] font-mono text-white/20 uppercase tracking-widest">
        <MousePointer2 className="w-2.5 h-2.5" />
        Protocol_Details
      </div>
    </motion.div>
  );
};
