'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, Edit3, Move, Presentation, ChevronRight, Loader2, ArrowLeft, ExternalLink, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/config/supabase';

interface PresentationData {
  id: string;
  client_name: string;
  slug: string;
  is_active: boolean;
}

interface Slide {
  id: string;
  presentation_id: string;
  title: string;
  subtitle: string;
  content: string;
  icon_name: string;
  stats: any[];
  order_index: number;
}

export default function AdminSlidesPage() {
  const { theme } = useTheme();
  const [presentations, setPresentations] = useState<PresentationData[]>([]);
  const [selectedPresentation, setSelectedPresentation] = useState<PresentationData | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlides, setLoadingSlides] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [isSavingSlide, setIsSavingSlide] = useState(false);

  const [isCreatingPresentation, setIsCreatingPresentation] = useState(false);
  const [newPresentation, setNewPresentation] = useState({ client_name: '', slug: '' });
  const [isCreatingSlide, setIsCreatingSlide] = useState(false);
  const [newSlide, setNewSlide] = useState({ title: '', subtitle: '' });

  useEffect(() => {
    fetchPresentations();
  }, []);

  async function fetchPresentations() {
    setLoading(true);
    const { data, error } = await supabase
      .from('presentations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setPresentations(data);
    setLoading(false);
  }

  async function fetchSlides(presentationId: string) {
    setLoadingSlides(true);
    const { data, error } = await supabase
      .from('slides')
      .select('*')
      .eq('presentation_id', presentationId)
      .order('order_index', { ascending: true });
    
    if (data) setSlides(data);
    setLoadingSlides(false);
  }

  const handleSelectPresentation = (p: PresentationData) => {
    setSelectedPresentation(p);
    fetchSlides(p.id);
  };

  const createPresentation = async () => {
    if (!newPresentation.client_name) return;
    const slug = newPresentation.slug || newPresentation.client_name.toLowerCase().replace(/\s+/g, '-');

    const { error } = await supabase.from('presentations').insert([
      { client_name: newPresentation.client_name, slug }
    ]);

    if (!error) {
      setIsCreatingPresentation(false);
      setNewPresentation({ client_name: '', slug: '' });
      fetchPresentations();
    }
  };

  const createSlide = async () => {
    if (!selectedPresentation || !newSlide.title) return;

    const { error } = await supabase.from('slides').insert([
      { 
        presentation_id: selectedPresentation.id, 
        title: newSlide.title,
        subtitle: newSlide.subtitle,
        order_index: slides.length 
      }
    ]);

    if (!error) {
      setIsCreatingSlide(false);
      setNewSlide({ title: '', subtitle: '' });
      fetchSlides(selectedPresentation.id);
    }
  };

  const deletePresentation = async (id: string) => {
    if (!confirm('Excluir esta apresentação e todos os seus slides?')) return;
    const { error } = await supabase.from('presentations').delete().eq('id', id);
    if (!error) fetchPresentations();
  };

  const handleSaveSlide = async (slide: Slide) => {
    setIsSavingSlide(true);
    const { error } = await supabase
      .from('slides')
      .update({
        title: slide.title,
        subtitle: slide.subtitle,
        content: slide.content,
        icon_name: slide.icon_name,
        stats: slide.stats
      })
      .eq('id', slide.id);

    if (!error) {
      setEditingSlideId(null);
      fetchSlides(selectedPresentation!.id);
    }
    setIsSavingSlide(false);
  };

  const updateSlideLocal = (id: string, field: string, value: any) => {
    setSlides(slides.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  if (!selectedPresentation) {
    return (
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
              Gestão <span className="px-2" style={{ backgroundColor: theme.colors.primary, color: '#000', borderRadius: '4px' }}>Vendas</span>
            </h1>
            <p className="text-sm text-zinc-500 font-mono uppercase tracking-[0.2em]">Decks de Apresentação por Cliente</p>
          </div>
          <button 
            onClick={() => setIsCreatingPresentation(!isCreatingPresentation)}
            className="px-8 py-4 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 rounded-full shadow-lg hover:brightness-110"
            style={{ 
              backgroundColor: theme.colors.primary, 
              color: '#000',
              boxShadow: `0 8px 24px ${theme.colors.primary}40`
            }}
          >
            {isCreatingPresentation ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isCreatingPresentation ? 'Cancelar' : 'Nova Apresentação'}
          </button>
        </div>

        <AnimatePresence>
          {isCreatingPresentation && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-10 rounded-2xl space-y-8 shadow-2xl relative">
                <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: theme.colors.primary }}></div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Nome do Cliente</label>
                    <input 
                      className="w-full bg-black/40 border border-white/10 p-5 text-white text-lg font-black tracking-tight outline-none focus:border-white/30 transition-all rounded-2xl"
                      placeholder="Ex: Apple Inc."
                      value={newPresentation.client_name}
                      onChange={(e) => setNewPresentation({ ...newPresentation, client_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Slug (URL Personalizada)</label>
                    <input 
                      className="w-full bg-black/40 border border-white/10 p-5 text-white text-sm outline-none focus:border-white/30 transition-all font-mono rounded-2xl"
                      placeholder="ex: apple-vendas"
                      value={newPresentation.slug}
                      onChange={(e) => setNewPresentation({ ...newPresentation, slug: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={createPresentation}
                    className="px-10 py-5 bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-black transition-all rounded-full shadow-xl active:scale-95"
                    style={{ '--primary': theme.colors.primary } as any}
                  >
                    Confirmar Criação
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full py-32 text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-zinc-800" />
              <p className="mt-6 text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">Carregando decks...</p>
            </div>
          ) : presentations.length === 0 ? (
            <div className="col-span-full py-32 text-center border border-white/5 bg-zinc-900/40 rounded-2xl">
              <div className="text-zinc-800 font-black text-6xl opacity-20 mb-4 uppercase">Vazio</div>
              <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">Nenhuma apresentação criada.</p>
            </div>
          ) : presentations.map((p) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-2xl hover:border-white/20 transition-all cursor-pointer group relative overflow-hidden"
              onClick={() => handleSelectPresentation(p)}
            >
              <div className="absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: theme.colors.primary }}></div>
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all">
                  <Presentation className="w-6 h-6" style={{ color: theme.colors.primary }} />
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); deletePresentation(p.id); }}
                  className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all text-zinc-500 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-tight group-hover:text-primary transition-colors" style={{ '--primary': theme.colors.primary } as any}>{p.client_name}</h3>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-zinc-700"></span> slug: {p.slug}
              </p>
              <div className="flex items-center text-[10px] font-black text-white uppercase tracking-widest gap-2 opacity-40 group-hover:opacity-100 transition-all">
                Abrir Editor <ChevronRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setSelectedPresentation(null)}
            className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full transition-all active:scale-90"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">{selectedPresentation.client_name}</h1>
            <p className="text-sm text-zinc-500 font-mono uppercase tracking-[0.2em]">Editor de Slides // Proposta Comercial</p>
          </div>
        </div>
        <div className="flex gap-4">
          <a 
            href={`/labs/slides/${selectedPresentation.slug}`}
            target="_blank"
            className="bg-white/5 border border-white/10 text-white px-8 py-4 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:text-black transition-all rounded-full shadow-lg"
          >
            <ExternalLink className="w-4 h-4" /> Visualizar
          </a>
          <button 
            onClick={() => setIsCreatingSlide(!isCreatingSlide)}
            className="px-8 py-4 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 rounded-full shadow-lg hover:brightness-110"
            style={{ 
              backgroundColor: theme.colors.primary, 
              color: '#000',
              boxShadow: `0 8px 24px ${theme.colors.primary}40`
            }}
          >
            {isCreatingSlide ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isCreatingSlide ? 'Cancelar' : 'Novo Slide'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isCreatingSlide && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-10 rounded-2xl space-y-8 shadow-2xl relative">
              <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: theme.colors.primary }}></div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Título do Slide</label>
                  <input 
                    className="w-full bg-black/40 border border-white/10 p-5 text-white text-lg font-black tracking-tight outline-none focus:border-white/30 transition-all rounded-2xl"
                    placeholder="Ex: Nossa Metodologia"
                    value={newSlide.title}
                    onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Categoria / Subtítulo</label>
                  <input 
                    className="w-full bg-black/40 border border-white/10 p-5 text-white text-sm outline-none focus:border-white/30 transition-all font-mono rounded-2xl"
                    placeholder="Ex: Estratégia de Crescimento"
                    value={newSlide.subtitle}
                    onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={createSlide}
                  className="px-10 py-5 bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-black transition-all rounded-full shadow-xl active:scale-95"
                  style={{ '--primary': theme.colors.primary } as any}
                >
                  Adicionar Slide
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {loadingSlides ? (
          <div className="py-32 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-zinc-800" />
            <p className="mt-6 text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">Sincronizando slides...</p>
          </div>
        ) : slides.length === 0 ? (
          <div className="py-32 text-center border border-white/5 bg-zinc-900/40 rounded-2xl">
             <div className="text-zinc-800 font-black text-6xl opacity-20 mb-4 uppercase">Vazio</div>
            <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">Nenhum slide nesta apresentação.</p>
          </div>
        ) : slides.map((slide, index) => (
          <div key={slide.id} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-2xl flex items-center gap-8 transition-all relative overflow-hidden ${editingSlideId === slide.id ? 'border-white/20 bg-zinc-900/60 shadow-2xl' : 'hover:border-white/10'}`}
              style={{ '--hover-border': `${theme.colors.primary}4D` } as any}
            >
              <div className="absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: theme.colors.primary }}></div>
              <div className="cursor-grab text-zinc-800 hover:text-zinc-600 transition-colors">
                <Move className="w-6 h-6" />
              </div>
              
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/20 transition-all">
                 <Presentation className="w-7 h-7" style={{ color: theme.colors.primary }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">{slide.subtitle || 'Slide sem categoria'}</div>
                <h3 className="text-xl font-black text-white truncate tracking-tight">{slide.title}</h3>
              </div>

              <div className="flex gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setEditingSlideId(editingSlideId === slide.id ? null : slide.id)}
                  className={`w-12 h-12 flex items-center justify-center bg-white/5 border border-white/5 hover:border-white/20 rounded-xl transition-all ${editingSlideId === slide.id ? 'bg-white text-black border-white' : 'text-zinc-500 hover:text-white'}`}
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button 
                  onClick={async () => {
                    if (!confirm('Excluir este slide?')) return;
                    const { error } = await supabase.from('slides').delete().eq('id', slide.id);
                    if (!error) fetchSlides(selectedPresentation!.id);
                  }}
                  className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/5 hover:border-red-500/20 rounded-xl transition-all text-zinc-500 hover:text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            <AnimatePresence>
              {editingSlideId === slide.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-black/40 backdrop-blur-2xl border-x border-b border-white/5 p-10 rounded-b-2xl space-y-10"
                >
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Título do Slide</label>
                      <input 
                        className="w-full bg-black/40 border border-white/10 p-5 text-white text-lg font-black tracking-tight outline-none focus:border-white/30 transition-all rounded-2xl"
                        value={slide.title}
                        onChange={(e) => updateSlideLocal(slide.id, 'title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Subtítulo / Categoria</label>
                      <input 
                        className="w-full bg-black/40 border border-white/10 p-5 text-white text-sm outline-none focus:border-white/30 transition-all font-mono rounded-2xl"
                        value={slide.subtitle || ''}
                        onChange={(e) => updateSlideLocal(slide.id, 'subtitle', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Narrativa do Slide (Content)</label>
                    <textarea 
                      className="w-full bg-black/40 border border-white/10 p-6 text-zinc-300 text-sm leading-relaxed outline-none focus:border-white/30 transition-all h-48 rounded-2xl font-mono"
                      value={slide.content || ''}
                      onChange={(e) => updateSlideLocal(slide.id, 'content', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Performance Stats / KPIs</label>
                      <button 
                        type="button"
                        onClick={() => {
                          const newStats = [...(slide.stats || []), { label: '', value: '' }];
                          updateSlideLocal(slide.id, 'stats', newStats);
                        }}
                        className="text-[10px] font-mono text-primary hover:brightness-125 transition-all uppercase tracking-widest flex items-center gap-2"
                        style={{ '--primary': theme.colors.primary } as any}
                      >
                        <Plus className="w-3 h-3" /> Adicionar KPI
                      </button>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                      {slide.stats?.map((stat: any, sIdx: number) => (
                        <div key={sIdx} className="flex gap-4 items-center bg-black/40 p-4 border border-white/5 rounded-2xl group/stat hover:border-white/10 transition-all">
                          <div className="flex-1 space-y-3">
                            <input 
                              className="w-full bg-transparent border-none p-0 text-white font-black text-xl tracking-tight outline-none placeholder:text-zinc-800"
                              placeholder="Value (ex: 98%)"
                              value={stat.value}
                              onChange={(e) => {
                                const newStats = [...(slide.stats || [])];
                                newStats[sIdx].value = e.target.value;
                                updateSlideLocal(slide.id, 'stats', newStats);
                              }}
                            />
                            <input 
                              className="w-full bg-transparent border-none p-0 text-zinc-500 font-mono text-[9px] uppercase tracking-widest outline-none placeholder:text-zinc-800"
                              placeholder="Label (ex: Conversão)"
                              value={stat.label}
                              onChange={(e) => {
                                const newStats = [...(slide.stats || [])];
                                newStats[sIdx].label = e.target.value;
                                updateSlideLocal(slide.id, 'stats', newStats);
                              }}
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              const newStats = slide.stats?.filter((_: any, i: number) => i !== sIdx);
                              updateSlideLocal(slide.id, 'stats', newStats);
                            }}
                            className="w-8 h-8 flex items-center justify-center bg-red-500/0 hover:bg-red-500/10 text-zinc-700 hover:text-red-500 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-10 pt-10 border-t border-white/5">
                    <div className="space-y-4">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Metáfora Visual (Ícone)</label>
                      <select 
                        className="w-full bg-black/40 border border-white/10 p-5 text-white text-sm outline-none focus:border-white/30 transition-all rounded-2xl appearance-none"
                        value={slide.icon_name || ''}
                        onChange={(e) => updateSlideLocal(slide.id, 'icon_name', e.target.value)}
                      >
                        <option value="rocket">ROCKET // VELOCIDADE</option>
                        <option value="palette">PALETTE // DESIGN</option>
                        <option value="cpu">CPU // TECNOLOGIA</option>
                        <option value="mouse-pointer">POINTER // INTERAÇÃO</option>
                        <option value="presentation">PRESENTATION // ESTRATÉGIA</option>
                      </select>
                    </div>
                    <div className="flex items-end justify-end">
                      <button 
                        onClick={() => handleSaveSlide(slide)}
                        disabled={isSavingSlide}
                        className="px-10 py-5 font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 rounded-full shadow-lg hover:brightness-110 disabled:opacity-50"
                        style={{ 
                          backgroundColor: theme.colors.primary, 
                          color: '#000',
                          boxShadow: `0 8px 24px ${theme.colors.primary}40`
                        }}
                      >
                        {isSavingSlide ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Publicar Alterações
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 py-12 border-2 border-dashed border-white/5 rounded-2xl bg-zinc-900/20">
        <Move className="w-5 h-5 text-zinc-700" />
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.3em]">Arraste para reordenar o fluxo da apresentação</p>
      </div>

      <style jsx>{`
        .group:hover { border-color: var(--hover-border) !important; }
        .text-primary { color: var(--primary); }
      `}</style>
    </div>
  );
}
