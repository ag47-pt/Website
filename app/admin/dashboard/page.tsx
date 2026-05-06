'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Eye, 
  MousePointerClick, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const stats = [
  { label: 'Visitantes Únicos', value: '12,482', change: '+12%', icon: <Users className="w-5 h-5" />, color: 'blue' },
  { label: 'Visualizações', value: '45,200', change: '+18%', icon: <Eye className="w-5 h-5" />, color: 'pink' },
  { label: 'Taxa de Cliques', value: '3.2%', change: '+5%', icon: <MousePointerClick className="w-5 h-5" />, color: 'green' },
  { label: 'Conversões', value: '124', change: '+24%', icon: <TrendingUp className="w-5 h-5" />, color: 'orange' },
];

const recentActivity = [
  { id: 1, type: 'update', message: 'Showcase "Neural Interface" atualizado para 85%', time: '2h atrás', status: 'success' },
  { id: 2, type: 'create', message: 'Novo slide "Design Premium" adicionado ao Sales Slides', time: '5h atrás', status: 'info' },
  { id: 3, type: 'alert', message: 'Tentativa de acesso não autorizado bloqueada (IP: 192.168.1.1)', time: '12h atrás', status: 'warning' },
];

export default function AdminDashboardPage() {
  const { theme } = useTheme();
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
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
            className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-2xl space-y-6 hover:border-white/10 transition-all group relative overflow-hidden shadow-2xl"
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
        <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-10 rounded-2xl space-y-10 shadow-2xl relative overflow-hidden">
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
           
           <div className="h-80 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center space-y-4 bg-black/20 group">
              <TrendingUp className="w-8 h-8 text-zinc-800 group-hover:text-primary transition-all duration-700 group-hover:scale-110" style={{ '--primary': theme.colors.primary } as any} />
              <div className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.4em]">Analytics Engine Syncing...</div>
              <div className="w-48 h-1 bg-zinc-900 rounded-full overflow-hidden relative">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-primary w-full"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{ '--primary': theme.colors.primary } as any}
                />
              </div>
           </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-10 rounded-2xl space-y-10 shadow-2xl relative overflow-hidden">
           <div className="flex items-center justify-between border-b border-white/5 pb-6">
             <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
               <Clock className="w-5 h-5" style={{ color: theme.colors.primary }} /> Fluxo de Atividade
             </h3>
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
           </div>
           
           <div className="space-y-8 relative">
             <div className="absolute left-1.5 top-2 bottom-2 w-px bg-white/5" />
             {recentActivity.map((activity, idx) => (
               <div key={activity.id} className="flex gap-6 group relative">
                 <div className="shrink-0 relative z-10">
                   <div className={`w-3 h-3 rounded-full border-2 border-zinc-950 mt-1 transition-transform group-hover:scale-125 ${
                     activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                   }`} />
                 </div>
                 <div className="space-y-2">
                   <p className="text-xs text-zinc-400 leading-relaxed font-medium group-hover:text-white transition-colors">{activity.message}</p>
                   <div className="flex items-center gap-3 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                     <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {activity.time}</span>
                     <span className="w-1 h-1 rounded-full bg-zinc-800" />
                     <span className="text-zinc-700">{activity.type}</span>
                   </div>
                 </div>
               </div>
             ))}
           </div>
           
           <button className="w-full py-4 border border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-xl shadow-lg mt-4">
             Relatório Completo
           </button>
        </div>
      </div>

      <style jsx>{`
        .text-primary { color: var(--primary); }
        .bg-primary { background-color: var(--primary); }
      `}</style>
    </div>
  );
}
