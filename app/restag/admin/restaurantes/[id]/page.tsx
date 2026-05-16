'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Save, Store, Palette, ShieldCheck, Globe, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getRestaurantById, updateRestaurant, createRestaurant } from '@/lib/restag/service';
import { Restaurant, NodeStatus } from '@/types/restag';
import { useTheme } from '@/context/ThemeContext';
import { Toast, ToastType } from '@/app/restag/components/Toast';

export default function EditRestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const { theme } = useTheme();
  
  const isNew = id === 'new';
  const [restaurant, setRestaurant] = useState<Restaurant | null>(isNew ? {
    id: '',
    owner_id: '',
    name: '',
    slug: '',
    description: '',
    address: '',
    city: '',
    status: 'active',
    branding_color: '#D1FF00',
    meta_data: {
      tag: 'NOVO',
      heroLabel: 'Grill & Wine Experience',
      heroTitle: 'A brasa de tradição',
      heroSubtitle: '',
      descriptionLong: '',
      heroCta: 'Reservar Mesa',
      cuisine: '',
      priceRange: '',
      rating: 4.5,
      phone: '',
      metaDescription: '',
      features: [],
      gallery: [],
      effectsEnabled: true,
      reservationSettings: {
        maxPartySize: 8,
        intervals: 30,
        notice: '1 hour'
      }
    },
    created_at: new Date().toISOString()
  } as Restaurant : null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });
  };

  useEffect(() => {
    if (isNew) return;
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
  }, [id, isNew]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant) return;

    setSaving(true);
    try {
      // Garantir que temos um owner_id para novos registros (dummy admin id se necessário)
      const { id: restId, ...payloadWithoutId } = restaurant;
      const finalPayload = {
        ...(isNew ? payloadWithoutId : restaurant),
        owner_id: restaurant.owner_id || '00000000-0000-0000-0000-000000000000', // Fallback se estiver vazio
        updated_at: new Date().toISOString()
      };

      if (isNew) {
        await createRestaurant(finalPayload);
        showToast("Novo nó criado com sucesso!", "success");
        // Pequeno delay para o usuário ver o sucesso antes de redirecionar
        setTimeout(() => router.push('/restag/admin/restaurantes'), 2000);
      } else {
        await updateRestaurant(id, finalPayload);
        showToast("Alterações salvas no banco de dados.", "success");
      }
    } catch (err: any) {
      console.error("Save Error Details:", err);
      const errorMessage = err.message || "Erro desconhecido ao salvar.";
      showToast(`ERRO_SYNC: ${errorMessage}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const updateMeta = (key: string, value: any) => {
    setRestaurant(prev => {
      if (!prev) return null;
      return {
        ...prev,
        meta_data: {
          ...(prev.meta_data || {}),
          [key]: value
        }
      };
    });
  };

  const updateResSettings = (key: string, value: any) => {
    setRestaurant(prev => {
      if (!prev) return null;
      const settings = prev.meta_data?.reservationSettings || {};
      return {
        ...prev,
        meta_data: {
          ...(prev.meta_data || {}),
          reservationSettings: {
            ...settings,
            [key]: value
          }
        }
      };
    });
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
    <div className="relative pb-24 max-w-7xl mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="mb-12">
        <Link href="/restag/admin/restaurantes" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4 font-mono uppercase tracking-widest">
          <ChevronLeft className="w-4 h-4" /> Gestão de Nós
        </Link>
        <h1 className="text-4xl font-bold tracking-tighter text-white flex items-center gap-4">
          {isNew ? 'Criar Novo Nó' : 'Configurar Nó'}
          {!isNew && (
            <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-mono tracking-widest uppercase">
              ID: {id.slice(0, 8)}...
            </span>
          )}
        </h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Basic Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
            <Store className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Identidade do Nó</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Nome do Comércio</label>
              <input 
                type="text" 
                value={restaurant.name}
                onChange={e => setRestaurant({...restaurant, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Slug (URL Path)</label>
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

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Endereço Principal</label>
              <input 
                type="text" 
                value={restaurant.address || ''}
                onChange={e => setRestaurant({...restaurant, address: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                placeholder="Ex: Rua Alecrim 12, Lisboa"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Cidade</label>
              <input 
                type="text" 
                value={restaurant.city || ''}
                onChange={e => setRestaurant({...restaurant, city: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                placeholder="Ex: Lisboa"
              />
            </div>
          </div>
        </motion.div>

        {/* Labs Blueprint: Hero & Copy Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
            <Palette className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Labs Blueprint: Hero & Copy</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Hero Label</label>
              <input 
                type="text" 
                value={restaurant.meta_data?.heroLabel || ''}
                onChange={e => updateMeta('heroLabel', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                placeholder="Ex: Grill & Wine Experience"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Etiqueta/Tag</label>
              <input 
                type="text" 
                value={restaurant.meta_data?.tag || ''}
                onChange={e => updateMeta('tag', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                placeholder="Ex: Reinventada"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Hero Title (Markdown Support)</label>
            <input 
              type="text" 
              value={restaurant.meta_data?.heroTitle || ''}
              onChange={e => updateMeta('heroTitle', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-500/50 transition-colors font-bold"
              placeholder="Ex: A brasa de *tradição*"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Hero Subtitle</label>
            <textarea 
              value={restaurant.meta_data?.heroSubtitle || ''}
              onChange={e => updateMeta('heroSubtitle', e.target.value)}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
              placeholder="Breve frase de impacto para a hero."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Descrição Longa (Storytelling)</label>
            <textarea 
              value={restaurant.meta_data?.descriptionLong || ''}
              onChange={e => updateMeta('descriptionLong', e.target.value)}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
              placeholder="O texto completo que aparece na seção de detalhes..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Texto do CTA</label>
              <input 
                type="text" 
                value={restaurant.meta_data?.heroCta || ''}
                onChange={e => updateMeta('heroCta', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                placeholder="Ex: Reservar Mesa"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Telefone de Contato</label>
              <input 
                type="text" 
                value={restaurant.meta_data?.phone || ''}
                onChange={e => updateMeta('phone', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                placeholder="Ex: +351 210 000 000"
              />
            </div>
          </div>
        </motion.div>

        {/* Business Attributes Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Atributos & SEO</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Cozinha</label>
              <input 
                type="text" 
                value={restaurant.meta_data?.cuisine || ''}
                onChange={e => updateMeta('cuisine', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="Ex: Portuguesa"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Preço Médio</label>
              <input 
                type="text" 
                value={restaurant.meta_data?.priceRange || ''}
                onChange={e => updateMeta('priceRange', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="Ex: avg. 25€"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Rating (0-5)</label>
              <input 
                type="number" 
                step="0.1"
                min="0"
                max="5"
                value={restaurant.meta_data?.rating || 0}
                onChange={e => updateMeta('rating', parseFloat(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Meta Description (SEO)</label>
            <textarea 
              value={restaurant.meta_data?.metaDescription || ''}
              onChange={e => updateMeta('metaDescription', e.target.value)}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
              placeholder="Descrição para Google/SEO..."
            />
          </div>
        </motion.div>

        {/* Status & Branding Card */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md space-y-6"
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
                      : 'bg-transparent border-white/5 text-gray-400 hover:bg-white/5'
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
            className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
              <Palette className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Cores & Media</h2>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Cor de Destaque (Hex)</label>
              <div className="flex gap-4">
                <input 
                  type="color" 
                  value={restaurant.branding_color || '#D1FF00'}
                  onChange={e => setRestaurant({...restaurant, branding_color: e.target.value})}
                  className="w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer p-0"
                />
                <input 
                  type="text" 
                  value={restaurant.branding_color || ''}
                  onChange={e => setRestaurant({...restaurant, branding_color: e.target.value})}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-red-500/50 transition-colors font-mono"
                  placeholder="#D1FF00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Vídeo Background (URL)</label>
              <input 
                type="text" 
                value={restaurant.meta_data?.video || ''}
                onChange={e => updateMeta('video', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors font-mono text-sm"
                placeholder="/restag/videos/..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Watermark do Vídeo (URL PNG)</label>
              <input 
                type="text" 
                value={restaurant.meta_data?.videoWatermark || ''}
                onChange={e => updateMeta('videoWatermark', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors font-mono text-sm"
                placeholder="/restag/watermarks/..."
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
                <div className="space-y-1">
                  <div className="text-xs font-mono uppercase tracking-widest text-white">Efeitos de Movimento</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-tighter">Ativar parallax e scroll animations</div>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    const current = restaurant.meta_data?.effectsEnabled !== false;
                    updateMeta('effectsEnabled', !current);
                  }}
                  className={`w-12 h-6 rounded-full relative transition-colors ${restaurant.meta_data?.effectsEnabled !== false ? 'bg-blue-500' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${restaurant.meta_data?.effectsEnabled !== false ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reservation Settings Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
            <ShieldCheck className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Configurações de Reserva</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Máx. Pessoas/Mesa</label>
              <input 
                type="number" 
                value={restaurant.meta_data?.reservationSettings?.maxPartySize || 8}
                onChange={e => updateResSettings('maxPartySize', parseInt(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Intervalo (Minutos)</label>
              <select 
                value={restaurant.meta_data?.reservationSettings?.intervals || 30}
                onChange={e => updateResSettings('intervals', parseInt(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-orange-500/50 transition-colors bg-neutral-900"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Aviso Prévio Mín.</label>
              <input 
                type="text" 
                value={restaurant.meta_data?.reservationSettings?.notice || '1 hour'}
                onChange={e => updateResSettings('notice', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                placeholder="Ex: 1 hour, 24 hours"
              />
            </div>
          </div>
        </motion.div>

        {/* Features & Gallery Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
            <ShieldCheck className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Funcionalidades & Galeria</h2>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Destaques / Features (Um por linha)</label>
            <textarea 
              value={restaurant.meta_data?.features?.join('\n') || ''}
              onChange={e => updateMeta('features', e.target.value.split('\n').filter(l => l.trim()))}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-yellow-500/50 transition-colors font-mono text-sm"
              placeholder="Grelha a Carvão&#10;Family-Friendly&#10;Ambiente Moderno"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Galeria de Imagens (URLs - Uma por linha)</label>
            <textarea 
              value={restaurant.meta_data?.gallery?.join('\n') || ''}
              onChange={e => updateMeta('gallery', e.target.value.split('\n').filter(l => l.trim()))}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-yellow-500/50 transition-colors font-mono text-sm"
              placeholder="/restag/foto1.png&#10;https://..."
            />
          </div>
        </motion.div>

        {/* Gastro Engineering, Metrics & Menu (JSON) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
            <Zap className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Conteúdo Dinâmico (JSON)</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-gray-400">Processo / Engenharia (JSON Array)</label>
              <textarea 
                defaultValue={JSON.stringify(restaurant.meta_data?.process || [], null, 2)}
                onBlur={e => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    updateMeta('process', parsed);
                  } catch (err) {
                    alert("Erro no formato JSON do Processo.");
                  }
                }}
                rows={8}
                className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors font-mono text-[10px]"
                placeholder="[ { 'step': '01', 'title': '...', 'desc': '...' } ]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-gray-400">Horário de Funcionamento (JSON Object)</label>
              <textarea 
                defaultValue={JSON.stringify(restaurant.meta_data?.operatingHours || {}, null, 2)}
                onBlur={e => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    updateMeta('operatingHours', parsed);
                  } catch (err) {
                    alert("Erro no formato JSON dos Horários.");
                  }
                }}
                rows={8}
                className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors font-mono text-[10px]"
                placeholder='{ "Segunda-Feira": "12:00 - 23:00", ... }'
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-gray-400">Métricas / Resultados (JSON Array)</label>
              <textarea 
                defaultValue={JSON.stringify(restaurant.meta_data?.results || [], null, 2)}
                onBlur={e => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    updateMeta('results', parsed);
                  } catch (err) {
                    alert("Erro no formato JSON das Métricas.");
                  }
                }}
                rows={8}
                className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors font-mono text-[10px]"
                placeholder="[ { 'label': 'SATISFAÇÃO', 'value': '98%', 'desc': '...' } ]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-gray-400">Cardápio / Menu (JSON Array)</label>
              <textarea 
                defaultValue={JSON.stringify(restaurant.meta_data?.menu || [], null, 2)}
                onBlur={e => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    updateMeta('menu', parsed);
                  } catch (err) {
                    alert("Erro no formato JSON do Menu.");
                  }
                }}
                rows={8}
                className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors font-mono text-[10px]"
                placeholder="[ { 'category': 'Entradas', 'items': [...] } ]"
              />
            </div>
          </div>
        </motion.div>

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

      {/* Feedback Toast */}
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}
