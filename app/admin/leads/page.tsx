'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Download, Search, Mail, Calendar, Loader2, ChevronDown, ChevronRight, MessageSquare } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/config/supabase';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  source?: string;
  servico_interesse?: string;
  descricao_projeto?: string;
  orcamento_estimado?: string;
  urgencia?: string;
  lead_score?: number;
  lead_temperature?: string;
  tags?: string[];
  conversation_summary?: string;
  chat_history?: ChatMessage[];
  created_at?: string;
  viewed_at?: string;
}

const TEMP_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  hot:  { bg: 'rgba(239,68,68,0.15)',  text: '#ef4444', border: 'rgba(239,68,68,0.4)'  },
  warm: { bg: 'rgba(249,115,22,0.15)', text: '#f97316', border: 'rgba(249,115,22,0.4)' },
  cold: { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6', border: 'rgba(59,130,246,0.4)' },
};

function TemperatureBadge({ temp }: { temp?: string }) {
  const t = (temp ?? 'cold').toLowerCase();
  const c = TEMP_COLORS[t] ?? TEMP_COLORS.cold;
  return (
    <span style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>
      {t.toUpperCase()}
    </span>
  );
}

function ScoreBadge({ score, primary }: { score?: number; primary: string }) {
  const s = score ?? 0;
  const color = s >= 80 ? '#ef4444' : s >= 50 ? '#f97316' : primary;
  return (
    <span style={{ color, fontWeight: 800, fontSize: 16 }}>
      {s}<span style={{ color: '#555', fontWeight: 400, fontSize: 11 }}>/100</span>
    </span>
  );
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { theme, isDark } = useTheme();
  const primary = theme.colors.primary;
  const secondary = theme.colors.secondary;
  // Use black text on light primaries (lime, orange) and white on dark ones (pink)
  const primaryTextColor = (() => {
    const hex = primary.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  })();

  const fetchLeads = React.useCallback(async () => {
    setLoading(true);
    let { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      ({ data, error } = await supabase
        .from('leads')
        .select('*')
        .order('viewed_at', { ascending: false }));
    }

    if (!error && data) {
      const normalized = (data as Lead[]).map((lead) => ({
        ...lead,
        created_at: lead.created_at ?? lead.viewed_at,
      }));
      setLeads(normalized);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchLeads(); }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchLeads]);

  const deleteLead = async (id: string) => {
    if (!confirm('Excluir este lead?')) return;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (!error) void fetchLeads();
  };

  const filteredLeads = leads.filter((lead) =>
    (lead.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.email ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.servico_interesse ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['Nome', 'Email', 'Servi├ºo', 'Score', 'Temperatura', 'Tags', 'Urg├¬ncia', 'Descri├º├úo', 'Or├ºamento', 'Data'];
    const csvContent = [
      headers.join(','),
      ...leads.map((l) => [
        `"${l.name ?? ''}"`,
        `"${l.email ?? ''}"`,
        `"${l.servico_interesse ?? ''}"`,
        l.lead_score ?? 0,
        l.lead_temperature ?? '',
        `"${(l.tags ?? []).join('; ')}"`,
        l.urgencia ?? '',
        `"${(l.descricao_projeto ?? '').replace(/"/g, "'")}"`,
        `"${l.orcamento_estimado ?? ''}"`,
        l.created_at ? new Date(l.created_at).toLocaleString() : '',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_ag47_${new Date().toISOString().split('T')[0]}.csv`;
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
            Gest├úo de{' '}
            <span
              className="px-2"
              style={{ backgroundColor: primary, color: '#000', borderRadius: '4px' }}
            >
              Leads
            </span>
          </h1>
          <p className="text-sm font-mono uppercase tracking-[0.2em]" style={{ color: secondary }}>
            Chatbot & Apresenta├º├Áes ÔÇö {leads.length} leads capturados
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="px-8 py-4 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 rounded-full shadow-lg hover:opacity-80"
          style={{ background: primary, color: primaryTextColor }}
        >
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar por nome, email ou servi├ºo..."
          className={`w-full bg-zinc-900/80 backdrop-blur-xl pl-16 pr-6 py-5 rounded-2xl text-sm outline-none transition-all text-white font-mono placeholder:text-zinc-500 ${
            isDark ? 'border border-white/10 focus:border-white/20' : 'border border-zinc-300 focus:border-zinc-400'
          }`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className={`bg-zinc-900/40 backdrop-blur-xl rounded-2xl overflow-hidden ${
        isDark ? 'border border-white/5 shadow-2xl' : 'border border-zinc-200 shadow-sm'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className={`border-b ${isDark ? 'border-white/5 bg-black/40' : 'border-zinc-200 bg-zinc-100/60'}`}>
                <th className="p-6 w-8"></th>
                <th className="p-6 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Lead</th>
                <th className="p-6 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Servi├ºo</th>
                <th className="p-6 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Score</th>
                <th className="p-6 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Tags</th>
                <th className="p-6 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Data</th>
                <th className="p-6 text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-right">A├º├Áes</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-zinc-200'}`}>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-32 text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-zinc-800" />
                    <p className="mt-6 text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">Carregando leads...</p>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-32 text-center text-zinc-600 font-mono text-xs uppercase tracking-widest">
                    <div className="text-zinc-800 font-black text-6xl opacity-20 mb-4 uppercase">Limpo</div>
                    Nenhum lead encontrado.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <React.Fragment key={lead.id}>
                    <tr
                      className="group hover:bg-white/[0.02] transition-all duration-300 cursor-pointer"
                      onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                    >
                      {/* Expand toggle */}
                      <td className="pl-6 pr-2">
                        <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">
                          {expandedId === lead.id
                            ? <ChevronDown className="w-4 h-4" />
                            : <ChevronRight className="w-4 h-4" />}
                        </span>
                      </td>

                      {/* Name + Email */}
                      <td className="p-6">
                        <div className="font-bold text-white text-base tracking-tight">{lead.name}</div>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono text-zinc-500">
                          <Mail className="w-3 h-3" /> {lead.email}
                        </div>
                      </td>

                      {/* Service */}
                      <td className="p-6">
                        {lead.servico_interesse ? (
                          <span style={{ background: `${secondary}26`, border: `1px solid ${secondary}66`, color: secondary, borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>
                            {lead.servico_interesse}
                          </span>
                        ) : (
                          <span className="text-zinc-700 text-xs font-mono">ÔÇö</span>
                        )}
                      </td>

                      {/* Score + Temperature */}
                      <td className="p-6">
                        <div className="flex flex-col gap-1.5">
                          <ScoreBadge score={lead.lead_score} primary={primary} />
                          <TemperatureBadge temp={lead.lead_temperature} />
                        </div>
                      </td>

                      {/* Tags */}
                      <td className="p-6 max-w-[200px]">
                        <div className="flex flex-wrap gap-1">
                          {(lead.tags ?? []).slice(0, 4).map((tag) => (
                            <span key={tag} className="text-[10px] font-mono bg-white/5 border border-white/10 text-zinc-400 rounded px-1.5 py-0.5">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="p-6 text-zinc-500 text-xs font-mono whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-zinc-700" />
                          {lead.created_at
                            ? new Date(lead.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                            : 'ÔÇö'}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl opacity-40 group-hover:opacity-100 hover:bg-red-500/20 hover:border-red-500/40 transition-all ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </td>
                    </tr>

                    {/* Expanded row */}
                    <AnimatePresence>
                      {expandedId === lead.id && (
                        <tr key={`${lead.id}-expanded`}>
                          <td colSpan={7} className="p-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-8 py-7 bg-black/40 border-b border-white/5 space-y-6">

                                {/* ÔöÇÔöÇ Score cards row ÔöÇÔöÇ */}
                                <div className="flex flex-wrap gap-3">
                                  <div className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 min-w-[90px]">
                                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Lead Score</p>
                                    <ScoreBadge score={lead.lead_score} primary={primary} />
                                  </div>
                                  <div className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 min-w-[90px]">
                                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Temperatura</p>
                                    <TemperatureBadge temp={lead.lead_temperature} />
                                  </div>
                                  {lead.urgencia && (
                                    <div className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 min-w-[90px]">
                                      <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Urg├¬ncia</p>
                                      <span className="text-white text-sm font-semibold">{lead.urgencia}</span>
                                    </div>
                                  )}
                                  {lead.source && (
                                    <div className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 min-w-[90px]">
                                      <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Fonte</p>
                                      <span className="text-white text-sm font-semibold">{lead.source}</span>
                                    </div>
                                  )}
                                </div>

                                {/* ÔöÇÔöÇ Fields grid ÔöÇÔöÇ */}
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                  <div>
                                    <p className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: secondary }}>Nome</p>
                                    <p className="text-white text-sm font-medium">{lead.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: secondary }}>Email</p>
                                    <a href={`mailto:${lead.email}`} className="text-sm hover:underline" style={{ color: secondary }}>{lead.email}</a>
                                  </div>
                                  {lead.servico_interesse && (
                                    <div>
                                      <p className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: secondary }}>Servi├ºo de Interesse</p>
                                      <span style={{ background: `${secondary}26`, border: `1px solid ${secondary}66`, color: secondary, borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>
                                        {lead.servico_interesse}
                                      </span>
                                    </div>
                                  )}
                                  {lead.descricao_projeto && (
                                    <div className="sm:col-span-2">
                                      <p className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: secondary }}>Descri├º├úo do Projeto</p>
                                      <p className="text-zinc-200 text-sm leading-relaxed">{lead.descricao_projeto}</p>
                                    </div>
                                  )}
                                  {lead.orcamento_estimado && (
                                    <div>
                                      <p className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: secondary }}>Or├ºamento Estimado</p>
                                      <p className="text-zinc-200 text-sm">{lead.orcamento_estimado}</p>
                                    </div>
                                  )}
                                </div>

                                {/* ÔöÇÔöÇ Tags ÔöÇÔöÇ */}
                                {(lead.tags ?? []).length > 0 && (
                                  <div>
                                    <p className="text-[9px] font-mono uppercase tracking-widest mb-2" style={{ color: secondary }}>Tags</p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {(lead.tags ?? []).map((tag) => (
                                        <span key={tag} className="text-[11px] font-mono bg-white/5 border border-white/10 text-zinc-300 rounded-md px-2 py-0.5">
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* ÔöÇÔöÇ Summary + Conversation ÔöÇÔöÇ */}
                                <div className="grid md:grid-cols-2 gap-4">

                                  {/* Resumo de Qualifica├º├úo */}
                                  {lead.conversation_summary && (
                                    <div>
                                      <p className="text-[9px] font-mono uppercase tracking-widest mb-2" style={{ color: secondary }}>Resumo de Qualifica├º├úo</p>
                                      <div className="bg-zinc-900/60 border border-white/5 rounded-xl p-4 space-y-1.5">
                                        {lead.conversation_summary
                                          .split('\n')
                                          .filter((line) => line.trim())
                                          .map((line, i) => {
                                            const isDash = line.trim().startsWith('-');
                                            const parts = isDash ? line.trim().slice(1).split(':') : line.split(':');
                                            const hasLabel = parts.length >= 2;
                                            return (
                                              <div key={i} className={`text-sm ${isDash ? 'flex gap-1.5' : ''}`}>
                                                {isDash && <span className="shrink-0" style={{ color: secondary }}>ÔÇö</span>}
                                                {hasLabel ? (
                                                  <>
                                                    <span className="text-zinc-500">{parts[0].trim()}:</span>
                                                    <span className="text-zinc-200"> {parts.slice(1).join(':').trim()}</span>
                                                  </>
                                                ) : (
                                                  <span className="text-zinc-300 font-medium">{line.trim()}</span>
                                                )}
                                              </div>
                                            );
                                          })}
                                      </div>
                                    </div>
                                  )}

                                  {/* Hist├│rico da Conversa */}
                                  {(lead.chat_history ?? []).length > 0 && (
                                    <div>
                                      <p className="text-[9px] font-mono uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: secondary }}>
                                        <MessageSquare className="w-3 h-3" /> Hist├│rico da Conversa
                                      </p>
                                      <div className="bg-zinc-900/60 border border-white/5 rounded-xl p-4 max-h-64 overflow-y-auto space-y-3">
                                        {(lead.chat_history ?? []).map((msg, i) => (
                                          <div key={i} className="space-y-0.5">
                                            <span
                                              className="text-[9px] font-mono uppercase tracking-widest font-bold"
                                              style={{ color: msg.role === 'user' ? secondary : '#555' }}
                                            >
                                              {msg.role === 'user' ? '­ƒæñ USER' : '­ƒñû AGENT'}
                                            </span>
                                            <p className={`text-sm leading-relaxed ${msg.role === 'user' ? 'text-zinc-200' : 'text-zinc-400'}`}>
                                              {msg.content}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* ÔöÇÔöÇ CTA ÔöÇÔöÇ */}
                                <div>
                                  <a
                                    href={`mailto:${lead.email}?subject=AG47 ÔÇö A sua proposta est├í a caminho, ${lead.name.split(' ')[0]}!`}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                                    style={{ background: primary, color: primaryTextColor }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Ô£ë´©Å Responder ao Lead
                                  </a>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
