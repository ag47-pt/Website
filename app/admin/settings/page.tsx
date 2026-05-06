'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, Smartphone, Shield, Bell, Loader2, Check, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/config/supabase';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { theme } = useTheme();

  const [settings, setSettings] = useState({
    branding: { name: '', tagline: '', logo_url: '' },
    social: { instagram: '', linkedin: '', github: '', whatsapp: '' },
    custom: [] as { key: string, value: string }[]
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('site_settings').select('*');
    if (!error && data) {
      const formatted: any = { custom: [] };
      data.forEach((curr: any) => {
        if (curr.key === 'branding' || curr.key === 'social') {
          formatted[curr.key] = curr.value;
        } else {
          formatted.custom.push({ key: curr.key, value: curr.value });
        }
      });
      setSettings(prev => ({ ...prev, ...formatted }));
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Standard settings
    const promises = [
      supabase.from('site_settings').upsert({ key: 'branding', value: settings.branding }, { onConflict: 'key' }),
      supabase.from('site_settings').upsert({ key: 'social', value: settings.social }, { onConflict: 'key' })
    ];

    // Custom settings
    settings.custom.forEach(item => {
      if (item.key) {
        promises.push(
          supabase.from('site_settings').upsert({ key: item.key, value: item.value }, { onConflict: 'key' })
        );
      }
    });

    await Promise.all(promises);
    
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const addCustomField = () => {
    setSettings(prev => ({
      ...prev,
      custom: [...prev.custom, { key: '', value: '' }]
    }));
  };

  const removeCustomField = async (key: string, index: number) => {
    if (key) {
      await supabase.from('site_settings').delete().eq('key', key);
    }
    setSettings(prev => ({
      ...prev,
      custom: prev.custom.filter((_, i) => i !== index)
    }));
  };

  const updateField = (category: string, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev as any)[category],
        [field]: value
      }
    }));
  };

  const updateCustomField = (index: number, field: 'key' | 'value', value: string) => {
    const newCustom = [...settings.custom];
    newCustom[index][field] = value;
    setSettings({ ...settings, custom: newCustom });
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-700" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
            Configurações <span className="px-2" style={{ backgroundColor: theme.colors.primary, color: '#000', borderRadius: '4px' }}>Globais</span>
          </h1>
          <p className="text-sm text-zinc-500 font-mono uppercase tracking-[0.2em]">Ajustes de Branding e Integrações</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-4 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 rounded-full shadow-lg hover:brightness-110 disabled:opacity-50"
          style={{ 
            backgroundColor: theme.colors.primary, 
            color: '#000',
            boxShadow: `0 8px 24px ${theme.colors.primary}40`
          }}
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : showSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {showSuccess ? 'Sucesso!' : 'Salvar Tudo'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Branding Section */}
        <section className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 md:p-8 space-y-8 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: theme.colors.primary }}></div>
          <div className="flex items-center gap-3 border-b border-white/5 pb-6">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <Globe className="w-5 h-5 text-zinc-400" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Identidade Visual</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Nome da Agência</label>
              <input 
                className="w-full bg-black/40 border border-white/10 px-4 py-4 text-white text-sm outline-none focus:border-white/30 transition-all font-mono rounded-xl"
                value={settings.branding.name}
                onChange={(e) => updateField('branding', 'name', e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Tagline / Slogan</label>
              <input 
                className="w-full bg-black/40 border border-white/10 px-4 py-4 text-white text-sm outline-none focus:border-white/30 transition-all font-mono rounded-xl"
                value={settings.branding.tagline}
                onChange={(e) => updateField('branding', 'tagline', e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">URL do Logo</label>
              <input 
                className="w-full bg-black/40 border border-white/10 px-4 py-4 text-white text-sm outline-none focus:border-white/30 transition-all font-mono rounded-xl placeholder:text-zinc-800"
                placeholder="https://..."
                value={settings.branding.logo_url}
                onChange={(e) => updateField('branding', 'logo_url', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Social Section */}
        <section className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 md:p-8 space-y-8 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: theme.colors.primary }}></div>
          <div className="flex items-center gap-3 border-b border-white/5 pb-6">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <Smartphone className="w-5 h-5 text-zinc-400" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Canais Digitais</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Instagram</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-xs font-mono">@</span>
                <input 
                  className="w-full bg-black/40 border border-white/10 pl-10 pr-4 py-4 text-white text-sm outline-none focus:border-white/30 transition-all font-mono rounded-xl"
                  value={settings.social.instagram}
                  onChange={(e) => updateField('social', 'instagram', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">LinkedIn Profile</label>
              <input 
                className="w-full bg-black/40 border border-white/10 px-4 py-4 text-white text-sm outline-none focus:border-white/30 transition-all font-mono rounded-xl"
                value={settings.social.linkedin}
                onChange={(e) => updateField('social', 'linkedin', e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">WhatsApp Business</label>
              <input 
                className="w-full bg-black/40 border border-white/10 px-4 py-4 text-white text-sm outline-none focus:border-white/30 transition-all font-mono rounded-xl"
                value={settings.social.whatsapp}
                onChange={(e) => updateField('social', 'whatsapp', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Custom Section */}
        <section className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 md:p-8 space-y-8 rounded-2xl shadow-2xl col-span-1 md:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: theme.colors.primary }}></div>
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <Plus className="w-5 h-5 text-zinc-400" />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Parâmetros Personalizados</h3>
            </div>
            <button 
              onClick={addCustomField}
              className="text-[10px] font-mono text-primary hover:brightness-125 transition-all uppercase tracking-widest flex items-center gap-2"
              style={{ '--primary': theme.colors.primary } as any}
            >
              <Plus className="w-3 h-3" /> Adicionar Campo
            </button>
          </div>
          
          <div className="space-y-4">
            {settings.custom.length === 0 ? (
              <p className="text-center py-10 text-zinc-700 font-mono text-[10px] uppercase tracking-widest">Nenhum parâmetro extra configurado</p>
            ) : settings.custom.map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center group">
                <div className="col-span-1 md:col-span-5">
                  <input 
                    className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white text-xs outline-none focus:border-white/30 transition-all font-mono rounded-xl"
                    placeholder="CHAVE"
                    value={item.key}
                    onChange={(e) => updateCustomField(idx, 'key', e.target.value)}
                  />
                </div>
                <div className="col-span-1 md:col-span-6">
                  <input 
                    className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white text-xs outline-none focus:border-white/30 transition-all font-mono rounded-xl"
                    placeholder="VALOR"
                    value={item.value}
                    onChange={(e) => updateCustomField(idx, 'value', e.target.value)}
                  />
                </div>
                <div className="col-span-1 flex justify-end">
                  <button 
                    onClick={() => removeCustomField(item.key, idx)}
                    className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-red-500/10 text-zinc-700 hover:text-red-500 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Security / System Section */}
        <section className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-8 space-y-8 rounded-2xl shadow-2xl col-span-1 md:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: theme.colors.primary }}></div>
          <div className="flex items-center gap-3 border-b border-white/5 pb-6">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <Shield className="w-5 h-5 text-zinc-400" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Segurança & Engine</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-2xl hover:border-white/10 transition-all group">
              <div className="space-y-1">
                <div className="text-sm font-black text-white uppercase tracking-tighter group-hover:text-primary transition-colors" style={{ '--primary': theme.colors.primary } as any}>Modo de Manutenção</div>
                <p className="text-[10px] text-zinc-600 font-mono">Restringe o acesso público ao site principal</p>
              </div>
              <div className="w-12 h-6 bg-zinc-800 rounded-full relative cursor-pointer group-hover:bg-zinc-700 transition-all">
                <div className="absolute left-1 top-1 w-4 h-4 bg-zinc-600 rounded-full transition-all" />
              </div>
            </div>
            <div className="flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-2xl opacity-40">
              <div className="space-y-1">
                <div className="text-sm font-black text-white uppercase tracking-tighter">AI Core Sync</div>
                <p className="text-[10px] text-zinc-600 font-mono">Processamento de leads via agente inteligente</p>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Active</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
