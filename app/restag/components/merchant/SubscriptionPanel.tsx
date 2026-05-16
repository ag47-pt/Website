'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Utensils, Calendar, Globe, Rocket } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface SubscriptionPanelProps {
  plan: 'FREE' | 'MENU_CORE' | 'RESERVATION_PRO' | 'FULL_STACK_ADS';
}

export const SubscriptionPanel = ({ plan }: SubscriptionPanelProps) => {
  const { theme } = useTheme();

  const plans = [
    { id: 'FREE', name: 'LP Core', price: '0€', icon: Globe, modules: ['Immersive LP'] },
    { id: 'MENU_CORE', name: 'Menu Digital', price: '21€', icon: Utensils, modules: ['Immersive LP', 'Digital Menu', 'QR Code'] },
    { id: 'RESERVATION_PRO', name: 'Reservations', price: '81€', icon: Calendar, modules: ['Immersive LP', 'Booking Engine', 'Google Integration'] },
    { id: 'FULL_STACK_ADS', name: 'Full Stack + ADS', price: '350€', icon: Rocket, modules: ['All Modules', '150€ ADS Traffic'] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-5 h-5" style={{ color: theme.colors.primary }} />
        <h3 className="font-mono text-xs uppercase tracking-widest text-white/60">Subscription_Status</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {plans.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-2xl border transition-all ${
              plan === p.id 
                ? 'bg-white/10 border-white/20 ring-1 ring-white/10' 
                : 'bg-black/40 border-white/5 opacity-50 grayscale hover:grayscale-0'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2 rounded-lg ${plan === p.id ? 'bg-white/10' : 'bg-white/5'}`}>
                <p.icon className="w-5 h-5" style={{ color: plan === p.id ? theme.colors.primary : '#666' }} />
              </div>
              {plan === p.id && (
                <span className="text-[8px] font-mono bg-lime-500/20 text-lime-400 px-2 py-0.5 rounded-full border border-lime-500/30">
                  ACTIVE
                </span>
              )}
            </div>
            
            <h4 className="text-sm font-bold text-white mb-1">{p.name}</h4>
            <p className="text-xl font-black text-white mb-3">{p.price}<span className="text-[10px] font-normal text-white/40 ml-1">/mês</span></p>
            
            <ul className="space-y-1.5">
              {p.modules.map((m, i) => (
                <li key={i} className="flex items-center gap-2 text-[10px] text-white/50 font-mono">
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                  {m}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {plan === 'FULL_STACK_ADS' && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 flex items-center gap-4">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Zap className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">ADS_BUDGET_ACTIVE</p>
            <p className="text-[10px] text-blue-400/80 font-mono">150,00€ convertidos em tráfego de alta precisão em Lisboa.</p>
          </div>
        </div>
      )}
    </div>
  );
};
