'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, ChevronLeft, Search, Eye, Key, Ban, Settings, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

import { getRestaurants, updateRestaurantStatus } from '@/lib/restag/service';
import { Restaurant } from '@/types/restag';
import { Toast, ToastType } from '@/app/restag/components/Toast';

export default function NodesAdminPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [restaurantsList, setRestaurantsList] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });
  };

  const handleImpersonate = (node: Restaurant) => {
    // Armazena o estado de impersonificação no localStorage
    localStorage.setItem('restag_impersonate', JSON.stringify({
      id: node.id,
      slug: node.slug,
      name: node.name,
      timestamp: Date.now()
    }));
    
    // Redireciona para o dashboard do merchant
    router.push('/restag/merchant');
  };

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

  const handleToggleStatus = async (node: Restaurant) => {
    const newStatus = node.status === 'active' ? 'suspended' : 'active';
    try {
      await updateRestaurantStatus(node.id, newStatus as any);
      setRestaurantsList(prev => prev.map(r => r.id === node.id ? { ...r, status: newStatus as any } : r));
      showToast(`Node ${node.name} ${newStatus === 'active' ? 'ativado' : 'suspenso'}.`, "success");
    } catch (err) {
      showToast("Erro ao alterar status do nó.", "error");
    }
  };

  const filtered = restaurantsList.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative pb-24 pt-0">
      <div className="max-w-[1600px] mx-auto space-y-24 md:space-y-32 px-6">
        
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
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Buscar restaurante..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            
            <Link 
              href="/restag/admin/restaurantes/new"
              className="whitespace-nowrap px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)] flex items-center gap-2"
            >
              <Store className="w-4 h-4" /> Novo Nó
            </Link>
          </div>
        </div>

        {/* Network Table */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="overflow-x-auto nexus-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px] md:min-w-0">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Node_ID / Identidade</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Status_Rede</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Receita_Est.</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Last_Sync</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-right">Ações_Nexus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-mono text-sm">
                      Sincronizando com a rede...
                    </td>
                  </tr>
                ) : filtered.map((node, index) => (
                  <motion.tr 
                    key={node.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs shadow-lg group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: (node as any).branding_color || theme.colors.primary, color: '#000' }}
                        >
                          {node.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{node.name}</p>
                          <p className="text-[10px] font-mono text-gray-500 tracking-widest">{node.slug}.restag.node</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-mono rounded-full border tracking-widest ${
                        node.status === 'active' 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {node.status === 'active' ? '● OPERANTE' : '○ ALERTA'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-white">€{Math.floor(Math.random() * 5000 + 2000).toLocaleString()}</td>
                    <td className="px-6 py-4 text-[10px] font-mono text-gray-500 uppercase">há {Math.floor(Math.random() * 60)} min</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <Link href={`/restag/admin/restaurantes/${node.id}`} title="Editar Nó" className="p-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 hover:border-white/20 shadow-xl">
                          <Settings className="w-4 h-4" />
                        </Link>
                        <Link href={`/restag/${node.slug}`} title="Visualizar Live" className="p-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 hover:border-white/20 shadow-xl">
                          <Globe className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleImpersonate(node)}
                          title="Acesso Concierge (Impersonate)" 
                          className="p-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all border border-blue-500/20 hover:border-blue-500/40 shadow-xl"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(node)}
                          title={node.status === 'active' ? "Suspender Instância" : "Ativar Instância"} 
                          className={`p-2.5 rounded-xl transition-all border shadow-xl ${
                            node.status === 'active' 
                              ? 'bg-red-500/5 hover:bg-red-500/10 text-red-500 border-transparent hover:border-red-500/20' 
                              : 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/20'
                          }`}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filtered.length === 0 && (
            <div className="p-12 text-center text-gray-500 font-mono text-sm">
              Nenhum restaurante encontrado com o termo "{search}".
            </div>
          )}
        </div>

        {/* Feedback Toast */}
        <Toast 
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
        />
        </div>
      </div>
  );
}
