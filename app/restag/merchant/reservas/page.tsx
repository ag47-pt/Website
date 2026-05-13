'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, ChevronLeft, Check, X, Clock } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

// Mock Data
const initialReservations = [
  { id: 1, name: "João Silva", pax: 2, time: "19:30", date: "Hoje", status: "pending", notes: "Aniversário" },
  { id: 2, name: "Maria Oliveira", pax: 4, time: "20:00", date: "Hoje", status: "confirmed", notes: "Mesa perto da janela" },
  { id: 3, name: "Carlos Mendes", pax: 2, time: "21:15", date: "Hoje", status: "pending", notes: "" },
  { id: 4, name: "Ana Costa", pax: 6, time: "19:00", date: "Amanhã", status: "confirmed", notes: "Cadeira de bebé" },
];

export default function ReservasPage() {
  const { theme } = useTheme();
  const [reservations, setReservations] = useState(initialReservations);

  const handleStatusChange = (id: number, newStatus: string) => {
    setReservations(prev => prev.map(res => res.id === id ? { ...res, status: newStatus } : res));
  };

  return (
    <div className="relative pb-24 pt-0">
      <div className="max-w-5xl mx-auto space-y-24 md:space-y-32">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/restag/merchant" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4 font-mono uppercase tracking-widest">
              <ChevronLeft className="w-4 h-4" /> Voltar ao Terminal
            </Link>
            <h1 className="text-4xl font-bold tracking-tighter text-white flex items-center gap-4">
              Gestão de Reservas
              <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-mono tracking-widest uppercase">
                {reservations.length} Totais
              </span>
            </h1>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
             <CalendarCheck className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        {/* Action Board */}
        <div className="grid gap-4">
          <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-gray-500 border-b border-white/10 pb-2">Pedidos Pendentes</h3>
          
          {reservations.filter(r => r.status === 'pending').map((res, idx) => (
            <motion.div 
              key={res.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-yellow-500/5 border border-yellow-500/20 rounded-xl backdrop-blur-md gap-4"
            >
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xl font-black text-white">{res.time}</p>
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{res.date}</p>
                </div>
                <div className="w-px h-10 bg-white/10 hidden md:block" />
                <div>
                  <h4 className="text-lg font-bold text-white">{res.name}</h4>
                  <p className="text-sm text-gray-400 font-mono"><UsersIcon className="inline w-4 h-4 mr-1"/> {res.pax} Pessoas {res.notes && `• Observação: ${res.notes}`}</p>
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <button 
                  onClick={() => handleStatusChange(res.id, 'confirmed')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-black hover:bg-gray-200 transition-colors font-bold rounded-lg"
                >
                  <Check className="w-4 h-4" /> Aprovar
                </button>
                <button 
                  onClick={() => handleStatusChange(res.id, 'cancelled')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500/30 transition-colors font-bold rounded-lg"
                >
                  <X className="w-4 h-4" /> Rejeitar
                </button>
              </div>
            </motion.div>
          ))}
          {reservations.filter(r => r.status === 'pending').length === 0 && (
             <div className="p-8 text-center bg-white/5 border border-white/10 rounded-xl text-gray-400 font-mono text-sm">
               Nenhuma reserva pendente no momento.
             </div>
          )}
        </div>

        {/* Confirmed List */}
        <div className="grid gap-4 pt-8">
          <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-gray-500 border-b border-white/10 pb-2">Próximas Chegadas (Confirmadas)</h3>
          
          <div className="grid gap-3">
            {reservations.filter(r => r.status === 'confirmed').map((res) => (
              <div key={res.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-500/20 text-green-500 rounded-md">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{res.time} • {res.name}</p>
                    <p className="text-xs text-gray-400 font-mono">{res.pax} Pax | {res.date}</p>
                  </div>
                </div>
                <div className="text-xs font-mono text-green-400 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                  CONFIRMADO
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// Inline helper icon
function UsersIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
