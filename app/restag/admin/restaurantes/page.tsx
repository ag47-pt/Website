'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, ChevronLeft, Search, Eye, Key, Ban } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

// Mock Data
const activeRestaurants = [
  { id: 1, name: "Cura", slug: "cura-lisboa", status: "Operante", gmv: "€4.2k", lastSync: "há 2 min" },
  { id: 2, name: "Alma", slug: "alma-lisboa", status: "Operante", gmv: "€3.8k", lastSync: "há 12 min" },
  { id: 3, name: "Veleiro", slug: "veleiro-cascais", status: "Problema", gmv: "€800", lastSync: "há 2 horas" },
  { id: 4, name: "Oeste", slug: "oeste-porto", status: "Operante", gmv: "€1.1k", lastSync: "há 5 min" },
];

export default function NodesAdminPage() {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");

  const filtered = activeRestaurants.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative pb-24 pt-0">
      <div className="max-w-6xl mx-auto space-y-24 md:space-y-32">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link href="/restag/admin" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4 font-mono uppercase tracking-widest">
              <ChevronLeft className="w-4 h-4" /> Voltar ao Core
            </Link>
            <h1 className="text-4xl font-bold tracking-tighter text-white flex items-center gap-4">
              Gestão de Nós (Rede)
              <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-mono tracking-widest uppercase">
                {activeRestaurants.length} ATIVOS
              </span>
            </h1>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar restaurante..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </div>

        {/* Network Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-gray-500">Restaurante / Node</th>
                  <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-gray-500">Status</th>
                  <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-gray-500">Volume GMV</th>
                  <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-gray-500">Último Sync</th>
                  <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-gray-500 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((node, idx) => (
                  <motion.tr 
                    key={node.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                          <Store className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-lg">{node.name}</p>
                          <p className="text-xs text-gray-500 font-mono">/{node.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-mono rounded uppercase tracking-widest ${
                        node.status === 'Operante' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {node.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-white">{node.gmv}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{node.lastSync}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button title="Visualizar Página" className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button title="Acesso Concierge (Impersonate)" className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors border border-blue-500/30">
                          <Key className="w-4 h-4" />
                        </button>
                        <button title="Suspender Nó" className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {filtered.length === 0 && (
              <div className="p-12 text-center text-gray-500 font-mono text-sm">
                Nenhum restaurante encontrado com o termo "{search}".
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
