'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Users, 
  Clock, 
  Save, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Layout,
  Image as ImageIcon,
  Type,
  Activity,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { updateRestaurantSettings } from '@/lib/restag/service';
import { LabHero, LabInfoCard } from '@/app/labs/components';

type TabType = 'OPERATIONAL' | 'VISUAL' | 'CORE';

export default function MerchantSettings() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('OPERATIONAL');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    branding_color: '#10b981',
    meta: {
      heroTitle: '',
      heroSubtitle: '',
      tag: '',
      cuisine: '',
      priceRange: '',
      descriptionLong: '',
      reservationSettings: {
        maxPartySize: 12,
        intervals: 30,
        notice: '1 hour'
      },
      gallery: [] as string[],
      video: '',
      videoWatermark: ''
    }
  });

  const RESTAURANT_SLUG = 'bipolar';

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data, error } = await supabase
          .from('restag_restaurants')
          .select('*')
          .eq('slug', RESTAURANT_SLUG)
          .single();

        if (data) {
          setRestaurantId(data.id);
          setFormData({
            name: data.name || '',
            address: data.address || '',
            branding_color: data.branding_color || '#10b981',
            meta: {
              ...formData.meta,
              ...(data.meta_data || {})
            }
          });
        }
      } catch (err) {
        console.error('Erro ao carregar settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!restaurantId) return;
    
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      // 1. Update Core Fields (name, address, branding_color)
      const { error: coreError } = await supabase
        .from('restag_restaurants')
        .update({
          name: formData.name,
          address: formData.address,
          branding_color: formData.branding_color,
          meta_data: formData.meta
        })
        .eq('id', restaurantId);

      if (coreError) throw coreError;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Erro ao salvar settings:', err);
      setError(err.message || 'Falha ao sincronizar com o Nexus.');
    } finally {
      setSaving(false);
    }
  };

  const updateMeta = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      meta: {
        ...prev.meta,
        [field]: value
      }
    }));
  };

  const updateReservation = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      meta: {
        ...prev.meta,
        reservationSettings: {
          ...prev.meta.reservationSettings,
          [field]: value
        }
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="relative pb-24 min-h-screen bg-[#050505] text-white">
      <div className="max-w-[1600px] mx-auto space-y-16 px-6">
        
        {/* Navigation */}
        <Link 
          href="/restag/merchant"
          className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors group mt-8"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          BACK_TO_TERMINAL
        </Link>

        {/* Hero */}
        <LabHero 
          overline="./restag/merchant/settings"
          overlineIcon={Settings}
          title="Terminal"
          highlight="Configuration"
          description="Controle total sobre o seu nó na rede Restag. Gerencie dados, estética e protocolos de reserva de forma centralizada."
          statusTags={[
            { label: "Admin Mode", color: "lime" },
            { label: "v1.0.4-L47", color: "blue" }
          ]}
        />

        {/* Tab Switcher */}
        <div className="flex gap-4 border-b border-white/5 pb-4">
          {(['CORE', 'OPERATIONAL', 'VISUAL'] as TabType[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-[10px] font-mono tracking-widest transition-all ${activeTab === tab ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeTab === 'CORE' && (
                <motion.section 
                  key="core"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-10 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-3xl space-y-10"
                >
                  <div className="space-y-2">
                    <h3 className="text-sm font-mono uppercase tracking-[0.4em] text-blue-500">Core_Identity</h3>
                    <p className="text-gray-400 text-sm">Informações básicas do registro comercial.</p>
                  </div>

                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest flex items-center gap-2" style={{ color: theme.colors.textVoice }}>
                        <Type className="w-3 h-3" /> Restaurant_Name
                      </label>
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 font-mono focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest flex items-center gap-2" style={{ color: theme.colors.textVoice }}>
                        <Globe className="w-3 h-3" /> Geo_Location_Address
                      </label>
                      <input 
                        type="text" 
                        value={formData.address} 
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 font-mono focus:outline-none focus:border-blue-500/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest flex items-center gap-2" style={{ color: theme.colors.textVoice }}>
                        <Activity className="w-3 h-3" /> Branding_Hex_Color
                      </label>
                      <div className="flex gap-4 items-center">
                        <input 
                          type="color" 
                          value={formData.branding_color} 
                          onChange={(e) => setFormData({...formData, branding_color: e.target.value})}
                          className="w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={formData.branding_color} 
                          onChange={(e) => setFormData({...formData, branding_color: e.target.value})}
                          className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 font-mono focus:outline-none focus:border-blue-500/50 uppercase"
                        />
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}

              {activeTab === 'OPERATIONAL' && (
                <motion.section 
                  key="op"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-10 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-3xl space-y-10"
                >
                  <div className="space-y-2">
                    <h3 className="text-sm font-mono uppercase tracking-[0.4em] text-emerald-500">Reservations_Engine</h3>
                    <p className="text-gray-400 text-sm">Configure os limites e intervalos do sistema de reservas.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>
                        <Users className="w-3 h-3" /> Max_Party_Size
                      </label>
                      <div className="flex items-center gap-4 p-4 bg-black/40 border border-white/5 rounded-2xl">
                        <button onClick={() => updateReservation('maxPartySize', Math.max(1, formData.meta.reservationSettings.maxPartySize - 1))} className="w-10 h-10 hover:bg-white/5 rounded-xl">-</button>
                        <span className="flex-1 text-center text-3xl font-black">{formData.meta.reservationSettings.maxPartySize}</span>
                        <button onClick={() => updateReservation('maxPartySize', formData.meta.reservationSettings.maxPartySize + 1)} className="w-10 h-10 hover:bg-white/5 rounded-xl">+</button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>
                        <Clock className="w-3 h-3" /> Time_Intervals
                      </label>
                      <select 
                        value={formData.meta.reservationSettings.intervals}
                        onChange={(e) => updateReservation('intervals', Number(e.target.value))}
                        className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl text-xl font-bold focus:outline-none focus:border-emerald-500/50 appearance-none"
                      >
                        <option value={15}>15 MIN</option>
                        <option value={30}>30 MIN</option>
                        <option value={60}>60 MIN</option>
                      </select>
                    </div>
                  </div>
                </motion.section>
              )}

              {activeTab === 'VISUAL' && (
                <motion.section 
                  key="visual"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-10 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-3xl space-y-10"
                >
                  <div className="space-y-2">
                    <h3 className="text-sm font-mono uppercase tracking-[0.4em] text-orange-500">Labs_Blueprint_Assets</h3>
                    <p className="text-gray-400 text-sm">Configure o visual "premium" da sua página Restag.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Hero_Title</label>
                        <input 
                          type="text" 
                          value={formData.meta.heroTitle} 
                          onChange={(e) => updateMeta('heroTitle', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 font-mono focus:outline-none focus:border-orange-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Hero_Highlight_Tag</label>
                        <input 
                          type="text" 
                          value={formData.meta.tag} 
                          onChange={(e) => updateMeta('tag', e.target.value)}
                          placeholder="EX: REINVENTADA"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 font-mono focus:outline-none focus:border-orange-500/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: theme.colors.textVoice }}>Hero_Subtitle</label>
                      <textarea 
                        value={formData.meta.heroSubtitle} 
                        onChange={(e) => updateMeta('heroSubtitle', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 font-mono focus:outline-none focus:border-orange-500/50 h-24 resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest flex items-center gap-2" style={{ color: theme.colors.textVoice }}>
                        <ImageIcon className="w-3 h-3" /> Cinematic_Video_URL
                      </label>
                      <input 
                        type="text" 
                        value={formData.meta.video} 
                        onChange={(e) => updateMeta('video', e.target.value)}
                        placeholder="/restag/videos/..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 font-mono focus:outline-none focus:border-orange-500/50"
                      />
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Save Button Floating/Footer */}
            <div className="mt-12 flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
               <div className="flex items-center gap-3">
                  {success && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-emerald-500 text-xs font-mono">
                      <CheckCircle2 className="w-4 h-4" /> NODE_SYNC_SUCCESS
                    </motion.div>
                  )}
                  {error && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-red-500 text-xs font-mono">
                      <AlertCircle className="w-4 h-4" /> {error}
                    </motion.div>
                  )}
                </div>
                
                <button 
                  disabled={saving}
                  onClick={handleSave}
                  className="px-12 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  COMMIT_CHANGES
                </button>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <LabInfoCard 
              title="Database Integrity"
              description="A sua instância está conectada diretamente ao cluster Supabase da Agência 47. Toda e qualquer informação é agora variável e editável."
            />
            
            <div className="p-8 bg-zinc-950 border border-white/10 rounded-3xl space-y-4">
              <h4 className="text-[10px] font-mono uppercase tracking-widest flex items-center gap-2" style={{ color: theme.colors.textVoice }}>
                <Layout className="w-3 h-3" /> Preview_Status
              </h4>
              <div className="aspect-video relative rounded-xl overflow-hidden border border-white/5 bg-black">
                 {formData.meta.video ? (
                   <video src={formData.meta.video} muted loop autoPlay className="w-full h-full object-cover opacity-50" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-700 font-mono text-[10px]">NO_VIDEO_LOADED</div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                 <div className="absolute bottom-4 left-4 text-[10px] font-mono text-white/40 uppercase">LIVE_RENDER_v1</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
