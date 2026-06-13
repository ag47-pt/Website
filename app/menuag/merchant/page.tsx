'use client';

import React from 'react';
import { LayoutDashboard, Utensils, CalendarCheck, Settings, Users, ArrowUpRight } from 'lucide-react';

export default function MerchantDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Osteria Del Mare - Visão Geral</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Ver LP
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
            Upgrade de Plano
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-gray-500">
            <Utensils className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Menu Digital</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">2.4k</div>
          <div className="text-sm text-green-600 flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" />
            <span>12% este mês</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-gray-500">
            <CalendarCheck className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Reservas</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">142</div>
          <div className="text-sm text-green-600 flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" />
            <span>8% este mês</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-gray-500">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Visualizações da LP</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">5.8k</div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <span>Mantido</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-gray-500">
            <Settings className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Plano Atual</span>
          </div>
          <div className="text-xl font-bold text-gray-900 mb-1">Sistema de Reservas</div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <span>81€ / mês</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Últimas Reservas</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    MJ
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Maria João</div>
                    <div className="text-sm text-gray-500">Hoje, 20:00 • 4 Pessoas</div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  Confirmada
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 text-blue-600 font-medium hover:underline text-center">
            Ver todas as reservas
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center space-y-4">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
            <Utensils className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Aumente o tráfego do seu restaurante</h2>
          <p className="text-gray-600">
            Escale suas reservas convertendo parte da mensalidade em tráfego pago altamente segmentado com o plano Full Stack + ADS.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors mt-2">
            Saiba Mais
          </button>
        </div>
      </div>
    </div>
  );
}