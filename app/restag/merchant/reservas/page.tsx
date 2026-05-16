'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, ChevronLeft, Check, X, Clock, Users as UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Reservation } from '@/types/restag';

export default function ReservasPage() {
  const { theme } = useTheme();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('restag_reservations')
        .select('*')
        .order('reservation_date', { ascending: true })
        .order('reservation_time', { ascending: true });
      
      if (data) setReservations(data);
      if (error) throw error;
    } catch (err) {
      console.error('Error fetching reservations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('restag_reservations')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      setReservations(prev => prev.map(res => res.id === id ? { ...res, status: newStatus as any } : res));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="relative pb-24 pt-0">
      <div className="max-w-[1600px] mx-auto space-y-24 md:space-y-32 px-6">
        
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
          <h3 className="font-mono text-xs uppercase tracking-[0.3em] border-b border-white/10 pb-2" style={{ color: theme.colors.textVoice }}>Pedidos Pendentes</h3>
          
          {isLoading ? (
            <div className="p-8 text-center bg-white/5 border border-white/10 rounded-xl text-gray-400 font-mono text-sm">
              Sincronizando dados...
            </div>
          ) : (
            <>
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
                      <p className="text-xl font-black text-white">{res.reservation_time}</p>
                      <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{res.reservation_date}</p>
                    </div>
                    <div className="w-px h-10 bg-white/10 hidden md:block" />
                    <div>
                      <h4 className="text-lg font-bold text-white">{res.customer_name}</h4>
                      <p className="text-sm text-gray-400 font-mono"><UsersIcon className="inline w-4 h-4 mr-1"/> {res.party_size} Pessoas {res.notes && `• Obs: ${res.notes}`}</p>
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
                      onClick={() => handleStatusChange(res.id, 'rejected')}
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
            </>
          )}
        </div>

        {/* Confirmed List */}
        <div className="grid gap-4 pt-8">
          <h3 className="font-mono text-xs uppercase tracking-[0.3em] border-b border-white/10 pb-2" style={{ color: theme.colors.textVoice }}>Próximas Chegadas (Confirmadas)</h3>
          
          <div className="grid gap-3">
            {reservations.filter(r => r.status === 'confirmed').map((res) => (
              <div key={res.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-500/20 text-green-500 rounded-md">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{res.reservation_time} • {res.customer_name}</p>
                    <p className="text-xs text-gray-400 font-mono">{res.party_size} Pax | {res.reservation_date}</p>
                  </div>
                </div>
                <div className="text-xs font-mono text-green-400 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                  CONFIRMADO
                </div>
              </div>
            ))}
            {!isLoading && reservations.filter(r => r.status === 'confirmed').length === 0 && (
               <div className="p-8 text-center bg-white/5 border border-white/10 rounded-xl text-gray-400 font-mono text-sm">
                 Nenhuma reserva confirmada.
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
