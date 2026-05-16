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
import { useTheme } from '@/context/ThemeContext';
import { getMerchantStats } from '../lib/service';
import { HeroRestag } from '../components/HeroRestag';
import { RestagCallCard, RestagInfoCard } from '../components/shared/RestagCards';
import { SubscriptionPanel } from '../components/merchant/SubscriptionPanel';
import { restaurants, RestaurantLP } from '@/data/restaurants';

export default function MerchantDashboard() {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    totalReservations: 0,
    pendingReservations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentRestaurant, setCurrentRestaurant] = useState<RestaurantLP | undefined>(undefined);

  // Mock ID para demonstração - Futuramente virá do Auth/Profile
  const MOCK_RESTAURANT_ID = '00000000-0000-0000-0000-000000000000';

  useEffect(() => {
    async function loadStats() {
      try {
        // Simulando carregamento do restaurante logado (Bipolar para teste)
        const rest = restaurants.find(r => r.slug === 'bipolar');
        setCurrentRestaurant(rest);

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

  const isModuleActive = (module: 'MENU' | 'RESERVATIONS' | 'ADS') => {
    if (!currentRestaurant) return false;
    const p = currentRestaurant.plan;
    if (p === 'FULL_STACK_ADS') return true;
    if (module === 'MENU' && p === 'MENU_CORE') return true;
    if (module === 'RESERVATIONS' && p === 'RESERVATION_PRO') return true;
    return false;
  };

  return (
    <div className="relative pb-12">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10 px-4 md:px-12">
        
        {/* 1. Dashboard Hero */}
        <HeroRestag 
          overline="./restag/merchant/dashboard"
          overlineIcon={Store}
          title="Merchant"
          highlight="Terminal"
          description="Bem-vindo ao **Painel de Controle** do seu comércio. Faça a gestão de **reservas**, atualize o seu **menu** em tempo real e adicione novos gestores à sua equipe."
          statusTags={[
            { label: loading ? "Connecting..." : "Sync Active", color: "lime" },
            { label: "Merchant Node", color: "blue" }
          ]}
          isDashboard
        />

        {/* 2. Subscription Status */}
        {currentRestaurant && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <SubscriptionPanel plan={currentRestaurant.plan} />
          </motion.section>
        )}

        {/* 3. Core Modules */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <RestagCallCard 
            title="Gestão de Reservas"
            description={isModuleActive('RESERVATIONS') ? "Aprove, rejeite e acompanhe o fluxo de clientes no seu salão." : "Módulo bloqueado. Faça o upgrade para ativar o motor de reservas."}
            path={isModuleActive('RESERVATIONS') ? "/restag/merchant/reservas" : "#"}
            icon={<CalendarCheck className="w-8 h-8" />}
            status={isModuleActive('RESERVATIONS') ? `${stats.pendingReservations} PENDENTES` : "BLOQUEADO"}
            opacity={isModuleActive('RESERVATIONS') ? 1 : 0.5}
          />

          <RestagCallCard 
            title="Edição de Menu"
            description={isModuleActive('MENU') ? "Atualize preços, adicione pratos ou altere descrições em tempo real." : "Módulo bloqueado. Faça o upgrade para ativar o menu digital."}
            path={isModuleActive('MENU') ? "/restag/merchant/menu" : "#"}
            icon={<UtensilsCrossed className="w-8 h-8" />}
            status={isModuleActive('MENU') ? "ACTIVE" : "BLOQUEADO"}
            opacity={isModuleActive('MENU') ? 1 : 0.5}
          />

          <RestagCallCard 
            title="Equipe & Acessos"
            description="Convide novos gestores ou adicione permissões de concierge à Ag47."
            path="/restag/merchant/equipa"
            icon={<Users className="w-8 h-8" />}
            status="1 MANAGER"
          />

          <RestagCallCard 
            title="Configurações"
            description="Ajuste limites de pessoas, intervalos e horários de reserva."
            path="/restag/merchant/configuracoes"
            icon={<Settings className="w-8 h-8" />}
            status="CONTROL_PANEL"
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
              <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] mb-1" style={{ color: theme.colors.textVoice }}>Telemetry</h3>
              <div className="text-2xl font-bold text-white tracking-tight uppercase">
                Visão <span style={{ color: theme.colors.primary }}>Geral</span>
              </div>
            </div>
            {loading ? <Loader2 className="w-6 h-6 text-gray-600 animate-spin" /> : <TrendingUp className="w-6 h-6 text-gray-600" />}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
             <div className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <p className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: theme.colors.textVoice }}>Reservas Totais</p>
                <div className="text-4xl font-black text-white">{stats.totalReservations}</div>
             </div>
             <div className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <p className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: theme.colors.textVoice }}>Visualizações no App</p>
                <div className="text-4xl font-black text-white">0</div>
             </div>
             <div className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <p className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: theme.colors.textVoice }}>Avaliação Média</p>
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
          <RestagInfoCard 
            title="Configurações e Suporte"
            description="Precisa de ajuda ou deseja ajustar as configurações da sua assinatura Restag? Acesse as definições ou chame o suporte concierge da Agência 47."
            icon={<Settings className="w-6 h-6" />}
          />
        </motion.div>

      </div>
    </div>
  );
}

