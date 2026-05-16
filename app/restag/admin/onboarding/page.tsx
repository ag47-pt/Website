'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ChevronLeft, CheckCircle, XCircle, Store } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

// Mock Data
const initialApplications = [
  { id: 1, name: "Tasca do Zé", location: "Lisboa, PT", owner: "José Almeida", date: "2026-05-12", status: "pending", type: "Restaurante Tradicional" },
  { id: 2, name: "Bipolar Brunch", location: "Porto, PT", owner: "Mariana Costa", date: "2026-05-11", status: "pending", type: "Café / Brunch" },
  { id: 3, name: "Sushi Prime", location: "Faro, PT", owner: "Ricardo Silva", date: "2026-05-10", status: "pending", type: "Asiático Premium" },
];

export default function OnboardingAdminPage() {
  const { theme } = useTheme();
  const [apps, setApps] = useState(initialApplications);

  const handleAction = (id: number, action: string) => {
    setApps(prev => prev.filter(app => app.id !== id));
    // In a real app, this would update the database status
  };

  return (
    <div className="relative pb-24 pt-12 md:pt-16">
      <div className="max-w-[1600px] mx-auto space-y-12 md:space-y-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link href="/restag/admin" className="inline-flex items-center gap-2 text-sm hover:text-white transition-colors mb-4 font-mono uppercase tracking-widest" style={{ color: theme.colors.textSecondary }}>
              <ChevronLeft className="w-4 h-4" /> Voltar ao Core
            </Link>
            <h1 className="text-4xl font-bold tracking-tighter text-white flex items-center gap-4">
              Fila de Aprovação
              <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full text-xs font-mono tracking-widest uppercase">
                {apps.length} PENDENTES
              </span>
            </h1>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
             <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <p className="text-lg max-w-2xl" style={{ color: theme.colors.textSecondary }}>
          Avalie e aprove novos comércios para ingressarem na rede Restag. Apenas contas aprovadas recebem acesso ao painel Merchant.
        </p>

        {/* Applications List */}
        <div className="grid gap-6">
          {apps.map((app, idx) => (
            <motion.div 
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md gap-6 hover:bg-white/10 transition-colors"
            >
              <div className="flex flex-1 min-w-0 items-start gap-4">
                <div className="p-3 bg-white/10 rounded-xl mt-1 shrink-0">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xl font-bold text-white mb-1 truncate">{app.name}</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-mono" style={{ color: theme.colors.textSecondary }}>
                    <span className="whitespace-nowrap"><strong style={{ color: theme.colors.textPrimary }}>Dono:</strong> {app.owner}</span>
                    <span className="whitespace-nowrap"><strong style={{ color: theme.colors.textPrimary }}>Local:</strong> {app.location}</span>
                    <span className="whitespace-nowrap"><strong style={{ color: theme.colors.textPrimary }}>Tipo:</strong> {app.type}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                <button 
                  onClick={() => handleAction(app.id, 'approve')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-black hover:bg-gray-200 transition-colors font-bold rounded-lg whitespace-nowrap"
                >
                  <CheckCircle className="w-4 h-4" /> Aprovar Acesso
                </button>
                <button 
                  onClick={() => handleAction(app.id, 'reject')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors font-bold rounded-lg whitespace-nowrap"
                >
                  <XCircle className="w-4 h-4" /> Recusar
                </button>
              </div>
            </motion.div>
          ))}

          {apps.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 text-center bg-green-500/5 border border-green-500/20 rounded-2xl"
            >
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Fila Limpa</h3>
              <p className="font-mono text-sm" style={{ color: theme.colors.textSecondary }}>Nenhuma solicitação de entrada pendente.</p>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
