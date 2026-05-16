'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronLeft, UserPlus, ShieldAlert, Key } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

const initialTeam = [
  { id: 1, name: "Admin Ag47", email: "concierge@agencia47.pt", role: "Superadmin", status: "Ativo", isAgency: true },
  { id: 2, name: "Gerente Operacional", email: "gerente@restaurante.pt", role: "Manager", status: "Ativo", isAgency: false },
];

export default function EquipaPage() {
  const { theme } = useTheme();

  return (
    <div className="relative pb-24 pt-12 md:pt-16">
      <div className="max-w-[1600px] mx-auto space-y-12 md:space-y-16 px-4 md:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link href="/restag/merchant" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4 font-mono uppercase tracking-widest">
              <ChevronLeft className="w-4 h-4" /> Voltar ao Terminal
            </Link>
            <h1 className="text-4xl font-bold tracking-tighter text-white flex items-center gap-4">
              Equipe & Acessos
              <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-mono tracking-widest uppercase">
                {initialTeam.length} Membros
              </span>
            </h1>
          </div>
          
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black hover:bg-gray-200 transition-colors font-bold rounded-lg w-full md:w-auto">
            <UserPlus className="w-4 h-4" /> Convidar Membro
          </button>
        </div>

        {/* Agency Delegation Alert */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-4"
        >
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-1">Acesso Concierge Ag47</h4>
            <p className="text-sm text-gray-400">
              A Agência 47 possui acesso delegado (Superadmin) à sua conta para fornecer suporte técnico e configurações avançadas. Você pode revogar este acesso a qualquer momento através do contato direto com o seu gestor.
            </p>
          </div>
        </motion.div>

        {/* Team List */}
        <div className="space-y-4 pt-4">
          <h3 className="font-mono text-sm uppercase tracking-[0.3em] text-gray-500 border-b border-white/10 pb-2">
            Membros Ativos
          </h3>
          
          <div className="grid gap-4">
            {initialTeam.map((member, idx) => (
              <motion.div 
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/5 border ${member.isAgency ? 'border-blue-500/30' : 'border-white/10'} rounded-xl backdrop-blur-md gap-4 hover:bg-white/10 transition-colors`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${member.isAgency ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white'}`}>
                    {member.isAgency ? <Key className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      {member.name}
                      {member.isAgency && (
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-mono rounded uppercase tracking-widest">Agência</span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-400">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-gray-500">{member.role}</span>
                  {!member.isAgency && (
                    <button className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors">
                      Remover
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
