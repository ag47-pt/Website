'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Presentation, ChevronRight, Loader2, ArrowRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/config/supabase';

interface PresentationData {
  id: string;
  client_name: string;
  slug: string;
  is_active: boolean;
}

export default function SlidesPortalPage() {
  const { theme } = useTheme();
  const [presentations, setPresentations] = useState<PresentationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPresentations() {
      const { data, error } = await supabase
        .from('presentations')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (data) setPresentations(data);
      setLoading(false);
    }
    fetchPresentations();
  }, []);

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-12">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-white/5 border border-white/10 rounded-full">
            <Presentation className="w-10 h-10" style={{ color: theme.colors.primary }} />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Portal de <span style={{ color: theme.colors.primary }}>Apresentações</span></h1>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest max-w-xl mx-auto">
          Acesse propostas comerciais e demonstrações de conceitos exclusivas da Agência 47.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 bg-zinc-900/50 border border-white/5 animate-pulse" />
          ))
        ) : presentations.length === 0 ? (
          <div className="col-span-full py-20 text-center border border-dashed border-white/10">
             <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">Nenhuma apresentação pública disponível.</p>
          </div>
        ) : presentations.map((p) => (
          <Link 
            key={p.id}
            href={`/labs/slides/${p.slug}`}
            className="group bg-zinc-900/50 border border-white/5 p-8 hover:bg-white/5 transition-all relative overflow-hidden"
          >
            <div className="relative z-10 space-y-4">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Apresentação Ativa</div>
              <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors" style={{ '--hover-color': theme.colors.primary } as any}>
                <style jsx>{`
                  h3:hover { color: var(--hover-color); }
                `}</style>
                {p.client_name}
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest pt-2">
                Acessar Proposta <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" style={{ color: theme.colors.primary }} />
              </div>
            </div>
            {/* Tech Decoration */}
            <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Presentation className="w-24 h-24 rotate-12" />
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-blue-500/5 border border-blue-500/20 p-8 text-center space-y-2">
        <p className="text-[10px] font-mono text-blue-500 uppercase tracking-[0.2em]">Acesso Restrito</p>
        <p className="text-xs text-zinc-500 leading-relaxed max-w-2xl mx-auto">
          Algumas apresentações podem exigir identificação prévia para visualização do conteúdo sensível.
        </p>
      </div>
    </div>
  );
}
