'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  CalendarCheck, 
  UtensilsCrossed, 
  Users, 
  TrendingUp,
  Settings,
  Loader2
} from 'lucide-react';
import { LabHero, LabCallCard, LabInfoCard } from '@/app/labs/components';
import { useTheme } from '@/context/ThemeContext';
import { getMerchantStats } from '@/lib/restag/service';

export default function MerchantDashboard() {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    totalReservations: 0,
    pendingReservations: 0,
  });
  const [loading, setLoading] = useState(true);

  // Mock ID para demonstração - Futuramente virá do Auth/Profile
  const MOCK_RESTAURANT_ID = '00000000-0000-0000-0000-000000000000';

  useEffect(() => {
    async function loadStats() {
      try {
        // Tentamos carregar, se falhar (ID inválido), mantemos zeros
        const data = await getMerchantStats(MOCK_RESTAURANT_ID).catch(() => ({ totalReservations: 0, pendingReservations: 0 }));
        setStats(data);
      } catch (error) {
        console.error('Erro ao carregar merchant stats:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="relative pb-24 pt-0">
      <div className="max-w-7xl mx-auto space-y-24 md:space-y-32">
        
        {/* 1. Dashboard Hero */}
        <LabHero 
          overline="./restag/merchant/dashboard"
          overlineIcon={Store}
          title="Merchant"
          highlight="Terminal"
          description="Bem-vindo ao **Painel de Controle** do seu comércio. Faça a gestão de **reservas**, atualize o seu **menu** em tempo real e adicione novos gestores à sua equipe."
          statusTags={[
            { label: loading ? "Connecting..." : "Sync Active", color: "lime", pulse: true },
            { label: "Merchant Node", color: "blue" }
          ]}
        />

        {/* 2. Core Modules */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <LabCallCard 
            title="Gestão de Reservas"
            description="Aprove, rejeite e acompanhe o fluxo de clientes no seu salão."
            path="/restag/merchant/reservas"
            icon={<CalendarCheck className="w-8 h-8" />}
            status={`${stats.pendingReservations} PENDENTES`}
          />

          <LabCallCard 
            title="Edição de Menu"
            description="Atualize preços, adicione pratos ou altere descrições em tempo real."
            path="/restag/merchant/menu"
            icon={<UtensilsCrossed className="w-8 h-8" />}
            status="ACTIVE"
          />

          <LabCallCard 
            title="Equipe & Acessos"
            description="Convide novos gestores ou adicione permissões de concierge à Ag47."
            path="/restag/merchant/equipa"
            icon={<Users className="w-8 h-8" />}
            status="1 MANAGER"
          />
        </motion.section>

        {/* 3. Analytics Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-1">Telemetry</h3>
              <div className="text-2xl font-bold text-white tracking-tight uppercase">
                Visão <span style={{ color: theme.colors.primary }}>Geral</span>
              </div>
            </div>
            {loading ? <Loader2 className="w-6 h-6 text-gray-600 animate-spin" /> : <TrendingUp className="w-6 h-6 text-gray-600" />}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
             <div className="p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">Reservas Totais</p>
                <div className="text-4xl font-black text-white">{stats.totalReservations}</div>
             </div>
             <div className="p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">Visualizações no App</p>
                <div className="text-4xl font-black text-white">0</div>
             </div>
             <div className="p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">Avaliação Média</p>
                <div className="text-4xl font-black text-white flex items-end gap-2">
                  0.0 <span className="text-sm font-normal text-gray-500 mb-1">/ 5.0</span>
                </div>
             </div>
          </div>
        </motion.section>

        {/* 4. Support Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <LabInfoCard 
            title="Configurações e Suporte"
            description="Precisa de ajuda ou deseja ajustar as configurações da sua assinatura Restag? Acesse as definições ou chame o suporte concierge da Agência 47."
            icon={<Settings className="w-6 h-6" />}
          />
        </motion.div>

      </div>
    </div>
  );
}

