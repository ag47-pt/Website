'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, ChevronLeft, Search, Eye, Key, Ban, Settings } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

import { getRestaurants } from '@/lib/restag/service';
import { Restaurant } from '@/types/restag';

export default function NodesAdminPage() {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [restaurantsList, setRestaurantsList] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const data = await getRestaurants();
        setRestaurantsList(data);
      } catch (err) {
        console.error("Failed to load restaurants:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = restaurantsList.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

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
                {restaurantsList.length} ATIVOS
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
              <thead className="bg-white/10 border-b border-white/10">
                <tr style={{ color: theme.colors.primary }}>
                  <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest opacity-70">Restaurante / Node</th>
                  <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest opacity-70">Status</th>
                  <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest opacity-70">Volume GMV</th>
                  <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest opacity-70">Último Sync</th>
                  <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest opacity-70 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-mono text-sm">
                      Sincronizando com a rede...
                    </td>
                  </tr>
                ) : filtered.map((node, idx) => (
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
                        node.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {node.status === 'active' ? 'Operante' : 'Problema'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-white">€{Math.floor(Math.random() * 5000)}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">há {Math.floor(Math.random() * 60)} min</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/restag/admin/restaurantes/${node.id}`} title="Editar Nó" className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                          <Settings className="w-4 h-4" />
                        </Link>
                        <Link href={`/restag/${node.slug}`} title="Visualizar Página" className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
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
