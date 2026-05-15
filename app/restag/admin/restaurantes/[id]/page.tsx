'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Save, Store, Palette, ShieldCheck, Globe } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getRestaurantById, updateRestaurant } from '@/lib/restag/service';
import { Restaurant, NodeStatus } from '@/types/restag';
import { useTheme } from '@/context/ThemeContext';

export default function EditRestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const { theme } = useTheme();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getRestaurantById(id);
        setRestaurant(data);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar o registro.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant) return;

    setSaving(true);
    try {
      await updateRestaurant(id, {
        name: restaurant.name,
        slug: restaurant.slug,
        status: restaurant.status,
        branding_color: restaurant.branding_color,
        address: restaurant.address
      });
      router.push('/restag/admin/restaurantes');
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar alterações.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center font-mono text-gray-500 uppercase tracking-widest animate-pulse">
      Carregando Registro_...
    </div>
  );

  if (error || !restaurant) return (
    <div className="p-12 text-center text-red-500 font-mono">
      {error || "Registro não encontrado."}
    </div>
  );

  return (
    <div className="relative pb-24 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <Link href="/restag/admin/restaurantes" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4 font-mono uppercase tracking-widest">
          <ChevronLeft className="w-4 h-4" /> Gestão de Nós
        </Link>
        <h1 className="text-4xl font-bold tracking-tighter text-white flex items-center gap-4">
          Configurar Nó
          <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-mono tracking-widest uppercase">
            ID: {id.slice(0, 8)}...
          </span>
        </h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Basic Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
            <Store className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Identidade do Nó</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Nome do Comércio</label>
              <input 
                type="text" 
                value={restaurant.name}
                onChange={e => setRestaurant({...restaurant, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Slug (URL Path)</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  value={restaurant.slug}
                  onChange={e => setRestaurant({...restaurant, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-red-500/50 transition-colors font-mono text-sm"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Endereço Principal</label>
            <input 
              type="text" 
              value={restaurant.address || ''}
              onChange={e => setRestaurant({...restaurant, address: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500/50 transition-colors"
            />
          </div>
        </motion.div>

        {/* Status & Branding Card */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Status Operacional</h2>
            </div>

            <div className="space-y-4">
              {(['active', 'suspended', 'pending'] as NodeStatus[]).map((status) => (
                <label 
                  key={status}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    restaurant.status === status 
                      ? 'bg-white/10 border-white/30 text-white' 
                      : 'bg-transparent border-white/5 text-gray-500 hover:bg-white/5'
                  }`}
                >
                  <span className="font-mono uppercase tracking-widest text-sm">{status}</span>
                  <input 
                    type="radio" 
                    name="status" 
                    value={status}
                    checked={restaurant.status === status}
                    onChange={() => setRestaurant({...restaurant, status})}
                    className="w-4 h-4 accent-red-500"
                  />
                </label>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
              <Palette className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Cores & Branding</h2>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Cor de Destaque (Hex)</label>
              <div className="flex gap-4">
                <input 
                  type="color" 
                  value={restaurant.branding_color}
                  onChange={e => setRestaurant({...restaurant, branding_color: e.target.value})}
                  className="w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer p-0"
                />
                <input 
                  type="text" 
                  value={restaurant.branding_color}
                  onChange={e => setRestaurant({...restaurant, branding_color: e.target.value})}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500/50 transition-colors font-mono"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/20 border border-white/5">
              <p className="text-[10px] font-mono text-gray-500 uppercase leading-relaxed">
                Nota: A cor de branding é utilizada como acento em elementos específicos quando o tema global permite sobreposição.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-end gap-4 pt-8"
        >
          <button 
            type="button"
            onClick={() => router.back()}
            className="px-8 py-4 rounded-xl text-sm font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            disabled={saving}
            className="px-12 py-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] flex items-center gap-3"
          >
            {saving ? 'Sincronizando...' : <><Save className="w-4 h-4" /> Gravar Configurações</>}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
