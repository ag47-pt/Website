'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Eye, 
  MousePointerClick, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Presentation,
  FileText,
  Rocket,
  Loader2
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/config/supabase';

interface ActivityItem {
  id: string;
  type: 'lead' | 'project' | 'presentation';
  message: string;
  time: string;
  status: 'success' | 'info' | 'warning';
  created_at: string;
}

export default function AdminDashboardPage() {
  const { theme, isDark } = useTheme();
  const primary = theme.colors.primary;
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Leads Totais', value: '0', change: '0', icon: <Users className="w-5 h-5" />, color: 'blue' },
    { label: 'Projetos Labs', value: '0', change: '0', icon: <Rocket className="w-5 h-5" />, color: 'pink' },
    { label: 'Decks Ativos', value: '0', change: '0', icon: <Presentation className="w-5 h-5" />, color: 'green' },
    { label: 'Total Slides', value: '0', change: '0', icon: <FileText className="w-5 h-5" />, color: 'orange' },
  ]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  const [leadTrend, setLeadTrend] = useState<{ day: string, count: number }[]>([]);

  const formatTimeAgo = React.useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}m atrás`;
    return 'Agora';
  }, []);

  const fetchDashboardData = React.useCallback(async () => {
    try {
      type LeadTimestampRow = { created_at?: string | null; viewed_at?: string | null }
      type RecentLeadRow = { id: string; name: string; created_at?: string | null; viewed_at?: string | null }

      // 1. Fetch Counts
      const [leadsCount, labsCount, presCount, slidesCount] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('labs_projects').select('*', { count: 'exact', head: true }),
        supabase.from('presentations').select('*', { count: 'exact', head: true }),
        supabase.from('slides').select('*', { count: 'exact', head: true }),
      ]);

      let leadTimestampField: 'created_at' | 'viewed_at' = 'created_at';
      let leadTimestampRows: LeadTimestampRow[] = [];

      const allLeadsCreated = await supabase.from('leads').select('created_at');
      if (allLeadsCreated.error) {
        leadTimestampField = 'viewed_at';
        const allLeadsViewed = await supabase.from('leads').select('viewed_at');
        leadTimestampRows = (allLeadsViewed.data || []) as LeadTimestampRow[];
      } else {
        leadTimestampRows = (allLeadsCreated.data || []) as LeadTimestampRow[];
      }

      setStats([
        { label: 'Leads Totais', value: leadsCount.count?.toString() || '0', change: '+100%', icon: <Users className="w-5 h-5" />, color: 'blue' },
        { label: 'Projetos Labs', value: labsCount.count?.toString() || '0', change: 'BETA', icon: <Rocket className="w-5 h-5" />, color: 'pink' },
        { label: 'Decks Ativos', value: presCount.count?.toString() || '0', change: 'LIVE', icon: <Presentation className="w-5 h-5" />, color: 'green' },
        { label: 'Total Slides', value: slidesCount.count?.toString() || '0', change: 'EDIT', icon: <FileText className="w-5 h-5" />, color: 'orange' },
      ]);

      // 2. Process Lead Trend (Last 7 Days)
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();

      const trend = last7Days.map(day => ({
        day: day.split('-')[2], // Just the day number
        count: leadTimestampRows.filter(l => {
          const timestamp = leadTimestampField === 'created_at' ? l.created_at : l.viewed_at;
          return typeof timestamp === 'string' && timestamp.startsWith(day);
        }).length
      }));
      setLeadTrend(trend);

      // 3. Fetch Recent Activities
      const recentLeadsCreated = await supabase
        .from('leads')
        .select('id, name, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      let recentLeadRows: RecentLeadRow[] = [];
      if (recentLeadsCreated.error) {
        const recentLeadsViewed = await supabase
          .from('leads')
          .select('id, name, viewed_at')
          .order('viewed_at', { ascending: false })
          .limit(3);
        recentLeadRows = (recentLeadsViewed.data || []) as RecentLeadRow[];
      } else {
        recentLeadRows = (recentLeadsCreated.data || []) as RecentLeadRow[];
      }

      const [recentLabs, recentPres] = await Promise.all([
        supabase.from('labs_projects').select('id, name, created_at').order('created_at', { ascending: false }).limit(3),
        supabase.from('presentations').select('id, client_name, created_at').order('created_at', { ascending: false }).limit(3),
      ]);

      const normalizedRecentLeads = recentLeadRows.map((lead) => ({
        ...lead,
        created_at: lead.created_at ?? lead.viewed_at ?? '',
      }));

      const activities: ActivityItem[] = [
        ...normalizedRecentLeads.map(l => ({
          id: l.id,
          type: 'lead' as const,
          message: `Novo lead capturado: ${l.name}`,
          time: formatTimeAgo(l.created_at),
          status: 'success' as const,
          created_at: l.created_at
        })),
        ...(recentLabs.data || []).map(p => ({
          id: p.id,
          type: 'project' as const,
          message: `Projeto iniciado: ${p.name}`,
          time: formatTimeAgo(p.created_at),
          status: 'info' as const,
          created_at: p.created_at
        })),
        ...(recentPres.data || []).map(p => ({
          id: p.id,
          type: 'presentation' as const,
          message: `Novo deck comercial: ${p.client_name}`,
          time: formatTimeAgo(p.created_at),
          status: 'info' as const,
          created_at: p.created_at
        }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
       .slice(0, 5);

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    setLoading(false);
  }, [formatTimeAgo]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchDashboardData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchDashboardData]);
  return (
    <div className="space-y-12 relative">
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl"
          >
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" style={{ color: theme.colors.primary }} />
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.4em]">Sincronizando Metricas...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
          Visão <span className="px-2" style={{ backgroundColor: theme.colors.primary, color: '#000', borderRadius: '4px' }}>Geral</span>
        </h1>
        <p className="text-sm text-zinc-500 font-mono uppercase tracking-[0.2em]">Painel de Controle // Agência 47</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 md:p-8 rounded-2xl space-y-6 hover:border-white/10 transition-all group relative overflow-hidden"
            style={{ boxShadow: isDark ? `0 4px 32px ${primary}33` : `0 4px 20px ${primary}44` }}
          >
            <div className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: theme.colors.primary }}></div>
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-primary group-hover:border-primary/30 transition-all" style={{ '--primary': theme.colors.primary } as any}>
                {stat.icon}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-green-500 uppercase">
                  {stat.change}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{stat.label}</div>
              <div className="text-3xl font-black text-white tracking-tight group-hover:translate-x-1 transition-transform">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 pb-12">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 md:p-10 rounded-2xl space-y-10 relative overflow-hidden"
           style={{ boxShadow: isDark ? `0 4px 40px ${primary}22` : `0 4px 24px ${primary}44` }}>
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" style={{ '--primary': theme.colors.primary } as any}></div>
           <div className="flex justify-between items-center relative z-10">
             <div className="space-y-1">
               <h3 className="text-sm font-black text-white uppercase tracking-widest">Performance de Tráfego</h3>
               <p className="text-[10px] text-zinc-600 font-mono">Metodologia de análise em tempo real</p>
             </div>
             <select className="bg-black/50 border border-white/10 rounded-full text-[10px] font-mono px-4 py-2 outline-none text-zinc-500 hover:border-white/20 transition-all cursor-pointer">
                <option>Últimos 7 Dias</option>
                <option>Últimos 30 Dias</option>
             </select>
           </div>
           
           <div className="h-80 border border-white/5 rounded-2xl flex items-end justify-between p-8 bg-black/20 group relative">
              {leadTrend.map((data, idx) => {
                const maxCount = Math.max(...leadTrend.map(d => d.count), 1);
                const height = (data.count / maxCount) * 100;
                return (
                  <div key={idx} className="flex flex-col items-center gap-4 w-full">
                    <div className="relative w-2 sm:w-4 bg-zinc-800 rounded-t-full overflow-hidden flex items-end" style={{ height: '200px' }}>
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: idx * 0.1, duration: 1 }}
                        className="w-full bg-primary" 
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                    </div>
                    <span className="text-[8px] font-mono text-zinc-600 uppercase">{data.day}</span>
                  </div>
                );
              })}
              {leadTrend.every(d => d.count === 0) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                  <TrendingUp className="w-8 h-8 text-zinc-800" />
                  <div className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.4em]">Aguardando Captura de Dados...</div>
                </div>
              )}
           </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 md:p-10 rounded-2xl space-y-10 shadow-2xl relative overflow-hidden">
           <div className="flex items-center justify-between border-b border-white/5 pb-6">
             <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
               <Clock className="w-5 h-5" style={{ color: theme.colors.primary }} /> Fluxo de Atividade
             </h3>
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
           </div>
           
           <div className="space-y-8 relative">
             <div className="absolute left-1.5 top-2 bottom-2 w-px" style={{ backgroundColor: `${theme.colors.secondary}20` }} />
             {recentActivity.length === 0 ? (
               <div className="py-10 text-center space-y-4">
                 <div className="text-zinc-800 font-black text-4xl opacity-20 uppercase" style={{ color: `${theme.colors.secondary}20` }}>Vazio</div>
                 <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Aguardando novas interações...</p>
               </div>
             ) : recentActivity.map((activity, idx) => (
               <div key={activity.id} className="flex gap-6 group relative">
                 <div className="shrink-0 relative z-10">
                   <div 
                     className="w-3 h-3 rounded-full border-2 border-zinc-950 mt-1 transition-all group-hover:scale-125" 
                     style={{ 
                       backgroundColor: activity.status === 'success' ? '#22c55e' : theme.colors.secondary,
                       boxShadow: `0 0 10px ${activity.status === 'success' ? '#22c55e' : theme.colors.secondary}80`
                     }}
                   />
                 </div>
                 <div className="space-y-2">
                   <p className="text-xs text-zinc-400 leading-relaxed font-medium group-hover:text-white transition-colors">{activity.message}</p>
                   <div className="flex items-center gap-3 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                     <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {activity.time}</span>
                     <span className="w-1 h-1 rounded-full bg-zinc-800" />
                     <span className="text-zinc-700" style={{ color: theme.colors.secondary }}>{activity.type}</span>
                   </div>
                 </div>
               </div>
             ))}
           </div>
           
           <Link href="/admin/leads" className="block w-full">
             <button className="w-full py-4 border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-xl shadow-lg mt-4">
               Relatório Completo
             </button>
           </Link>
        </div>
      </div>

    </div>
  );
}
