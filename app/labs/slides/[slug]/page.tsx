'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Play, 
  X,
  Presentation,
  Rocket,
  Palette,
  MousePointer2,
  Cpu,
  Loader2,
  Mail,
  User,
  Phone,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/config/supabase';
import { useParams } from 'next/navigation';

interface SlideData {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  icon_name: string;
  stats: { label: string; value: string }[];
}

export default function PresentationViewerPage() {
  const { slug } = useParams();
  const { theme } = useTheme();
  const [presentation, setPresentation] = useState<any>(null);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // Lead state
  const [lead, setLead] = useState({ name: '', email: '', whatsapp: '' });
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    // Check if lead is already registered
    const savedLead = localStorage.getItem('ag47_lead_registered');
    if (!savedLead) {
      setShowLeadModal(true);
    }
    fetchData();
  }, [slug]);

  async function fetchData() {
    setLoading(true);
    // 1. Fetch Presentation
    const { data: pData, error: pError } = await supabase
      .from('presentations')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (pData) {
      setPresentation(pData);
      // 2. Fetch Slides
      const { data: sData, error: sError } = await supabase
        .from('slides')
        .select('*')
        .eq('presentation_id', pData.id)
        .order('order_index', { ascending: true });
      
      if (sData) setSlides(sData);
    }
    setLoading(false);
  }

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead.name || !lead.email) return;

    setIsRegistering(true);
    const { error } = await supabase.from('leads').insert([
      { 
        presentation_id: presentation?.id,
        name: lead.name,
        email: lead.email,
        whatsapp: lead.whatsapp
      }
    ]);

    if (!error) {
      localStorage.setItem('ag47_lead_registered', 'true');
      setShowLeadModal(false);
    }
    setIsRegistering(false);
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    let interval: any;
    if (isAutoPlay && slides.length > 0) {
      interval = setInterval(nextSlide, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, slides.length]);

  const getIcon = (name: string) => {
    const props = { className: "w-12 h-12", style: { color: theme.colors.primary } };
    switch (name) {
      case 'rocket': return <Rocket {...props} />;
      case 'palette': return <Palette {...props} />;
      case 'mouse-pointer': return <MousePointer2 {...props} />;
      case 'cpu': return <Cpu {...props} />;
      default: return <Presentation {...props} />;
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-zinc-800" />
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Acessando Terminal Seguro...</p>
      </div>
    );
  }

  if (!presentation) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <X className="w-12 h-12 text-red-500 mb-6" />
        <h1 className="text-2xl font-black text-white uppercase mb-2">Acesso Negado</h1>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Link de apresentação expirado ou inexistente.</p>
      </div>
    );
  }

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-[100] bg-black p-0 m-0 overflow-hidden' : 'space-y-8'}`}>
      
      {/* Lead Capture Modal */}
      <AnimatePresence>
        {showLeadModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md bg-zinc-900 border border-white/10 p-10 space-y-8"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Presentation className="w-8 h-8" style={{ color: theme.colors.primary }} />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                  Área <span className="px-2" style={{ backgroundColor: theme.colors.primary, color: '#000', borderRadius: '4px' }}>Restrita</span>
                </h2>
                <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest leading-relaxed">
                  Por favor, identifique-se para visualizar a proposta de <strong>{presentation.client_name}</strong>
                </p>
              </div>

              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div className="space-y-1">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input 
                      required
                      type="text"
                      placeholder="NOME COMPLETO"
                      className="w-full bg-black border border-white/5 py-4 pl-12 pr-4 text-xs font-mono uppercase tracking-widest focus:border-white/20 outline-none transition-all"
                      value={lead.name}
                      onChange={e => setLead({...lead, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input 
                      required
                      type="email"
                      placeholder="E-MAIL CORPORATIVO"
                      className="w-full bg-black border border-white/5 py-4 pl-12 pr-4 text-xs font-mono uppercase tracking-widest focus:border-white/20 outline-none transition-all"
                      value={lead.email}
                      onChange={e => setLead({...lead, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input 
                      type="text"
                      placeholder="WHATSAPP (OPCIONAL)"
                      className="w-full bg-black border border-white/5 py-4 pl-12 pr-4 text-xs font-mono uppercase tracking-widest focus:border-white/20 outline-none transition-all"
                      value={lead.whatsapp}
                      onChange={e => setLead({...lead, whatsapp: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  disabled={isRegistering}
                  className="w-full py-4 text-black font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  {isRegistering ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Acessar Proposta <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {slides.length === 0 ? (
        <div className="h-[500px] border border-dashed border-white/5 flex items-center justify-center">
          <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">Nenhum slide disponível.</p>
        </div>
      ) : (
        <>
          {/* HUD Controls */}
          <div className={`flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-950/50 backdrop-blur-md ${isFullscreen ? 'sticky top-0' : 'rounded-sm'}`}>
            <div className="flex items-center gap-4">
              <Presentation className="w-5 h-5" style={{ color: theme.colors.primary }} />
              <div className="font-mono text-xs">
                <span className="text-gray-500 uppercase">{presentation.client_name}</span>
                <span className="mx-2" style={{ color: theme.colors.primary }}>//</span>
                <span className="uppercase tracking-widest text-zinc-300">Slide {currentSlide + 1}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`p-2 border border-white/10 transition-colors ${isAutoPlay ? 'text-black' : ''}`}
                style={{ 
                  backgroundColor: isAutoPlay ? theme.colors.primary : 'transparent',
                  borderColor: isAutoPlay ? theme.colors.primary : 'rgba(255,255,255,0.1)'
                } as any}
                title="Auto-play"
              >
                <Play className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 border border-white/10 transition-colors hover:border-white/20"
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Slide Content */}
          <div className={`relative flex items-center justify-center ${isFullscreen ? 'h-[calc(100vh-64px)]' : 'h-[600px] border border-white/5 bg-zinc-950/30 overflow-hidden'}`}>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-4xl px-12 text-center space-y-10"
              >
                <div className="flex justify-center mb-6">
                  <motion.div 
                    initial={{ rotate: -20, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 bg-white/5 border border-white/10 rounded-full"
                  >
                    {getIcon(slides[currentSlide].icon_name)}
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="font-mono text-sm tracking-[0.3em] uppercase"
                    style={{ color: theme.colors.primary }}
                  >
                    {slides[currentSlide].subtitle}
                  </motion.div>
                  <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-6xl font-black tracking-tighter uppercase"
                  >
                    {slides[currentSlide].title}
                  </motion.h2>
                </div>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
                >
                  {slides[currentSlide].content}
                </motion.p>

                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 gap-8 max-w-md mx-auto pt-8"
                >
                  {slides[currentSlide].stats?.map((stat, idx) => (
                    <div key={idx} className="p-4 border border-white/5 bg-white/2">
                      <div className="text-[10px] font-mono text-gray-500 uppercase">{stat.label}</div>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-12">
              <button 
                onClick={prevSlide}
                className="p-4 rounded-full border border-white/10 transition-all hover:bg-white/5"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="font-mono text-xs text-gray-500">
                <span style={{ color: theme.colors.primary }}>{currentSlide + 1}</span> / {slides.length}
              </div>

              <button 
                onClick={nextSlide}
                className="p-4 rounded-full border border-white/10 transition-all hover:bg-white/5"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Progress Line */}
          <div className="h-1 bg-white/5 w-full relative">
            <motion.div 
              className="absolute inset-y-0 left-0"
              style={{ backgroundColor: theme.colors.primary }}
              initial={{ width: '0%' }}
              animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </>
      )}
    </div>
  );
}
