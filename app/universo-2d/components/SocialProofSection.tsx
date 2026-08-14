'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { UNIVERSO_2D_DATA } from '@/data/universo-2d';
import { 
  Sparkles, 
  ChevronDown, 
  HelpCircle, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';

export function SocialProofSection() {
  const { theme } = useTheme();
  const { faqs } = UNIVERSO_2D_DATA;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const results = [
    {
      metric: '+180%',
      title: 'Aumento em Conversão de Leads',
      description: 'Média de ganho reportada por clientes após migração de páginas antigas para as LPs em Next.js da Agência 47.',
      icon: <TrendingUp className="w-5 h-5 transition-colors duration-500" style={{ color: theme.colors.primary }} />,
    },
    {
      metric: '0.62s',
      title: 'Largest Contentful Paint (LCP)',
      description: 'Carregamento instantâneo em redes móveis 4G/5G com zero sensação de lentidão ou congelamento de tela.',
      icon: <Zap className="w-5 h-5 text-cyan-400" />,
    },
    {
      metric: '7 Dias',
      title: 'Sprint de Entrega Garantida',
      description: 'Processo ágil sem reuniões desnecessárias. Do conceito ao deploy com domínio apontado e analytics funcionando.',
      icon: <Clock className="w-5 h-5 text-emerald-400" />,
    },
    {
      metric: '100%',
      title: 'Código Proprietário',
      description: 'Zero dependência de templates pesados ou plugins vulneráveis de terceiros. Seu ativo digital seguro.',
      icon: <ShieldCheck className="w-5 h-5 text-teal-300" />,
    },
  ];

  return (
    <>
      {/* 08. MÉTRICAS E RESULTADOS COMPROVADOS */}
      <section id="metricas" className="py-20 px-4 sm:px-6 relative border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          {/* Results & Proof Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-bold uppercase tracking-wider mb-3 transition-colors duration-500"
              style={{
                backgroundColor: `${theme.colors.primary}12`,
                borderColor: `${theme.colors.primary}40`,
                color: theme.colors.primary,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>08. RESULTADOS & ENGENHARIA COMPROVADA</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4 uppercase">
              Métricas Reais que Movem o Ponteiro do Seu Negócio
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-mono">
              Não entregamos promessas vagas. Entregamos infraestrutura técnica de alto nível com impacto direto nas suas vendas.
            </p>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {results.map((res, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-zinc-950/80 border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 group shadow-xl backdrop-blur-xl"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {res.icon}
                </div>
                <div 
                  className="text-3xl sm:text-4xl font-black font-mono mb-2 transition-colors duration-500"
                  style={{ color: idx === 0 ? theme.colors.primary : '#ffffff' }}
                >
                  {res.metric}
                </div>
                <h3 className="text-sm font-bold text-zinc-200 mb-2">
                  {res.title}
                </h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  {res.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 09. DÚVIDAS FREQUENTES (FAQ) - SEPARADO COMO SEÇÃO TOP-LEVEL */}
      <section id="faq" className="py-20 px-4 sm:px-6 relative border-t border-white/10 bg-black/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>09. DÚVIDAS FREQUENTES</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight uppercase">
              Tudo o Que Você Precisa Saber
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-2">
              Respostas diretas e transparentes sobre a nossa metodologia e entrega.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-zinc-950/80 border border-white/10 overflow-hidden transition-colors backdrop-blur-xl"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-bold text-white hover:text-white transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      style={isOpen ? { color: theme.colors.primary } : {}}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
