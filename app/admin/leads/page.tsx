'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Download, Search, Mail, User, Phone, Calendar, Loader2, Plus, X, Edit3, Save } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/config/supabase';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  created_at?: string;
  viewed_at?: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  const fetchLeads = React.useCallback(async () => {
    setLoading(true);
    let query = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (query.error) {
      query = await supabase
        .from('leads')
        .select('*')
        .order('viewed_at', { ascending: false });
    }

    if (!query.error && query.data) {
      const normalized = query.data.map((lead) => ({
        ...lead,
        created_at: lead.created_at ?? lead.viewed_at,
      }));
      setLeads(normalized);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchLeads();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchLeads]);

  const createLead = async () => {
    if (!newLead.name || !newLead.email) return;
    setIsSaving(true);
    const { error } = await supabase.from('leads').insert([newLead]);
    if (!error) {
      setIsCreating(false);
      setNewLead({ name: '', email: '', phone: '', company: '' });
      fetchLeads();
    }
    setIsSaving(false);
  };

  const updateLead = async (id: string, updatedData: Partial<Lead>) => {
    setIsSaving(true);
    const { error } = await supabase.from('leads').update(updatedData).eq('id', id);
    if (!error) {
      setEditingId(null);
      fetchLeads();
    }
    setIsSaving(false);
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Excluir este lead?')) return;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (!error) fetchLeads();
  };

  const updateLeadLocal = (id: string, field: string, value: string) => {
    setLeads(leads.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['Nome', 'Email', 'Telefone', 'Empresa', 'Data'];
    const csvContent = [
      headers.join(','),
      ...leads.map(l => [
        l.name,
        l.email,
        l.phone,
        l.company,
        l.created_at ? new Date(l.created_at).toLocaleString() : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_ag47_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
            Gestão de <span className="px-2" style={{ backgroundColor: theme.colors.primary, color: '#000', borderRadius: '4px' }}>Leads</span>
          </h1>
          <p className="text-sm text-zinc-500 font-mono uppercase tracking-[0.2em]">Contatos capturados via Apresentações</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={exportCSV}
            className="bg-white/5 border border-white/10 text-white px-8 py-4 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:text-black transition-all active:scale-95 rounded-full shadow-lg"
          >
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="px-8 py-4 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 rounded-full shadow-lg hover:brightness-110"
            style={{ 
              backgroundColor: theme.colors.primary, 
              color: '#000',
              boxShadow: `0 8px 24px ${theme.colors.primary}40`
            }}
          >
            {isCreating ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isCreating ? 'Cancelar' : 'Adicionar Lead'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-10 rounded-2xl space-y-8 shadow-2xl relative">
              <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: theme.colors.primary }}></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Nome</label>
                  <input 
                    className="w-full bg-black/40 border border-white/10 p-4 text-white text-sm outline-none focus:border-white/30 transition-all rounded-xl"
                    placeholder="Nome completo"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Email</label>
                  <input 
                    className="w-full bg-black/40 border border-white/10 p-4 text-white text-sm outline-none focus:border-white/30 transition-all rounded-xl"
                    placeholder="email@empresa.com"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Telefone</label>
                  <input 
                    className="w-full bg-black/40 border border-white/10 p-4 text-white text-sm outline-none focus:border-white/30 transition-all rounded-xl"
                    placeholder="(00) 00000-0000"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Empresa</label>
                  <input 
                    className="w-full bg-black/40 border border-white/10 p-4 text-white text-sm outline-none focus:border-white/30 transition-all rounded-xl"
                    placeholder="Empresa LTDA"
                    value={newLead.company}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={createLead}
                  disabled={isSaving}
                  className="px-10 py-4 bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-black transition-all rounded-full shadow-xl active:scale-95 disabled:opacity-50"
                  style={{ '--primary': theme.colors.primary } as any}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Lead'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <div className="relative group max-w-2xl">
        <div className="absolute inset-0 bg-gradient-to-r opacity-20 blur-xl group-focus-within:opacity-40 transition-opacity" style={{ from: theme.colors.primary, to: 'transparent' } as any}></div>
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors w-5 h-5" />
          <input 
            type="text"
            placeholder="Buscar leads por nome, email ou empresa..."
            className="w-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 pl-16 pr-6 py-5 rounded-2xl text-sm outline-none focus:border-white/20 transition-all text-white font-mono placeholder:text-zinc-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-white/5 bg-black/40">
              <th className="p-8 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Lead / Contato</th>
              <th className="p-8 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Empresa</th>
              <th className="p-8 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Data de Captura</th>
              <th className="p-8 text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-right">Controle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-32 text-center">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto text-zinc-800" />
                  <p className="mt-6 text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">Carregando leads...</p>
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-32 text-center text-zinc-600 font-mono text-xs uppercase tracking-widest">
                  <div className="text-zinc-800 font-black text-6xl opacity-20 mb-4 uppercase">Limpo</div>
                  Nenhum lead encontrado no sistema.
                </td>
              </tr>
            ) : filteredLeads.map((lead) => (
              <tr key={lead.id} className={`group hover:bg-white/[0.01] transition-all duration-500 ${editingId === lead.id ? 'bg-white/[0.02]' : ''}`}>
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-all">
                      <User className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      {editingId === lead.id ? (
                        <div className="space-y-2 max-w-sm">
                          <input 
                            className="w-full bg-black/40 border border-white/10 px-3 py-2 text-white text-sm outline-none rounded-lg focus:border-white/20"
                            value={lead.name}
                            onChange={(e) => updateLeadLocal(lead.id, 'name', e.target.value)}
                          />
                          <input 
                            className="w-full bg-black/40 border border-white/10 px-3 py-2 text-zinc-400 text-[10px] font-mono outline-none rounded-lg focus:border-white/20"
                            value={lead.email}
                            onChange={(e) => updateLeadLocal(lead.id, 'email', e.target.value)}
                          />
                        </div>
                      ) : (
                        <>
                          <span className="text-white font-bold text-lg tracking-tight group-hover:text-primary transition-colors" style={{ '--primary': theme.colors.primary } as any}>{lead.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
                              <Mail className="w-3 h-3" /> {lead.email}
                            </span>
                            {lead.phone && (
                              <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
                                <Phone className="w-3 h-3" /> {lead.phone}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-8">
                   {editingId === lead.id ? (
                     <input 
                       className="w-full bg-black/40 border border-white/10 px-3 py-2 text-zinc-400 text-[10px] font-mono outline-none rounded-lg focus:border-white/20"
                       value={lead.company || ''}
                       placeholder="Empresa"
                       onChange={(e) => updateLeadLocal(lead.id, 'company', e.target.value)}
                     />
                   ) : (
                     <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full inline-block">
                       <span className="text-zinc-400 text-[10px] font-mono uppercase tracking-widest">
                         {lead.company || 'Pessoa Física'}
                       </span>
                     </div>
                   )}
                </td>
                <td className="p-8 text-zinc-500 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-zinc-700" />
                    {lead.created_at
                      ? new Date(lead.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })
                      : 'Sem data'}
                  </div>
                </td>
                <td className="p-8 text-right">
                  <div className="flex justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                    {editingId === lead.id ? (
                      <button 
                        onClick={() => updateLead(lead.id, lead)}
                        disabled={isSaving}
                        className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                      >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      </button>
                    ) : (
                      <button 
                        onClick={() => setEditingId(lead.id)}
                        className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl transition-all text-zinc-500 hover:text-white"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteLead(lead.id)}
                      className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-xl transition-all group/del"
                    >
                      <Trash2 className="w-4 h-4 text-zinc-600 group-hover/del:text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}
