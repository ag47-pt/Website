'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Store, 
  Activity, 
  ShieldAlert,
  ServerCrash,
  Loader2
} from 'lucide-react';
import { HeroRestag } from '../components/HeroRestag';
import { RestagCallCard } from '../components/shared/RestagCards';
import { useTheme } from '@/context/ThemeContext';
import { getAdminStats } from '@/lib/restag/service';

export default function AdminDashboard() {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalReservations: 0,
    activeNodes: 0,
    pendingApproval: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getAdminStats();
        // Nota: Podemos adicionar mais queries específicas se necessário
        setStats({
          ...data,
          pendingApproval: data.totalRestaurants - data.activeNodes // Exemplo simples
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="relative pb-12 pt-0">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10 px-4 md:px-12">
        
        {/* 1. Admin Hero */}
        <HeroRestag 
          overline="./restag/admin/core"
          overlineIcon={ShieldCheck}
          title="Ag47"
          highlight="Oversight"
          description="Acesso de nível **Superadmin**. Visualize a saúde da rede Restag, modere a entrada de novos estabelecimentos e interceda em instâncias de clientes em formato **Concierge**."
          statusTags={[
            { label: "God Mode", color: "red", pulse: true },
            { label: loading ? "Syncing..." : "All Systems Nominal", color: "blue" }
          ]}
          isDashboard
        />

        {/* 2. Admin Modules */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <RestagCallCard 
            title="Aprovação de Nós"
            description={loading ? "Carregando..." : `Existem ${stats.pendingApproval} restaurantes na fila de espera aguardando auditoria.`}
            path="/restag/admin/onboarding"
            icon={<ShieldAlert className="w-8 h-8" />}
            status={`${stats.pendingApproval} PENDENTES`}
          />

          <RestagCallCard 
            title="Gestão de Rede"
            description="Visualize, suspenda ou atue como Concierge em qualquer restaurante do ecosistema."
            path="/restag/admin/restaurantes"
            icon={<Store className="w-8 h-8" />}
            status={`${stats.activeNodes} ATIVOS`}
          />
        </motion.section>

        {/* 3. Global Telemetry */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-1">Global_Telemetry</h3>
              <div className="text-2xl font-bold text-white tracking-tight uppercase">
                Rede <span style={{ color: theme.colors.primary }}>Restag</span>
              </div>
            </div>
            {loading ? <Loader2 className="w-6 h-6 text-gray-600 animate-spin" /> : <Activity className="w-6 h-6 text-gray-600" />}
          </div>

          <div className="grid md:grid-cols-4 gap-4">
             <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">Volume GMV</p>
                <div className="text-3xl font-black text-white">€0.00</div>
             </div>
             <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">Reservas Totais</p>
                <div className="text-3xl font-black text-white">{stats.totalReservations}</div>
             </div>
             <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">Nós Operantes</p>
                <div className="text-3xl font-black text-white">{stats.activeNodes}</div>
             </div>
             <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <p className="text-[10px] font-mono uppercase tracking-widest text-red-500 mb-2">Falhas de Sync</p>
                <div className="text-3xl font-black text-white">0</div>
             </div>
          </div>
        </motion.section>

        {/* 4. Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="p-6 border border-red-500/30 bg-red-500/5 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <ServerCrash className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">System Override</h4>
                <p className="text-sm text-gray-400 mb-4">Acesso direto ao banco de dados e políticas de RLS. Qualquer alteração aqui afetará todos os nós da rede imediatamente.</p>
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 transition-colors text-white text-xs font-bold uppercase tracking-widest rounded-lg">
                  Acessar Painel de Controle Core
                </button>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

