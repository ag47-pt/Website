// SEO: metadata (title, description, openGraph, twitter, canonical)
// is defined in the parent Server Component: app/servicos/planos/page.tsx
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import Link from 'next/link'
import { useTheme, ThemeProvider } from '@/context/ThemeContext'
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher'
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar'

// --- Types ---
interface PlanFeature {
  text: string
  isNew?: boolean
  isFree?: boolean
}

interface Plan {
  id: string
  name: string
  slogan: string
  setup: string
  monthly: string
  originalMonthly?: string
  discount?: string
  resources: string[]
  features: PlanFeature[]
}

// --- Data ---
const plans: Plan[] = [
  {
    id: 'startup',
    name: 'Startup',
    slogan: 'Otimizado para novos negócios e validação de ideias.',
    setup: '€497',
    monthly: '€49',
    originalMonthly: '€69',
    discount: 'Poupe 29%',
    resources: [
      '1 Landing Page Premium',
      'Copywriting Persuasivo',
      'Otimização de Conversão (CRO)',
      'Alojamento de Alta Velocidade',
      'Suporte via Email/WhatsApp',
    ],
    features: [
      { text: 'Design Exclusivo Ag47' },
      { text: 'Certificado SSL Ilimitado', isFree: true },
      { text: 'Integração com CRM/Email', isNew: true },
      { text: 'Relatório Mensal de Performance' },
      { text: 'CDN Global Ativa', isFree: true },
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    slogan: 'Mais potência e escala para projetos em crescimento.',
    setup: '€1.497',
    monthly: '€149',
    originalMonthly: '€199',
    discount: 'Poupe 25%',
    resources: [
      'Website Completo (até 5 páginas)',
      'Gestão de Tráfego Pago (Ads)',
      'SEO Técnico Avançado',
      'Manutenção e Backups Diários',
      'Gestor de Conta Dedicado',
    ],
    features: [
      { text: 'Tudo do plano Startup' },
      { text: 'Painel do Cliente Ag47', isNew: true },
      { text: 'Análise de Heatmaps Mensal', isNew: true },
      { text: 'Prioridade no Suporte (24h)', isNew: true },
      { text: 'Email Profissional (10 contas)', isFree: true },
      { text: 'Automações de Marketing' },
    ]
  },
  {
    id: 'growth',
    name: 'Growth',
    slogan: 'Criado para expansão séria e dominação de mercado.',
    setup: '€2.997',
    monthly: '€299',
    originalMonthly: '€399',
    discount: 'Poupe 25%',
    resources: [
      'Ecossistema Digital Completo',
      'Desenvolvimento SaaS/Custom App',
      'Funis de Venda Complexos',
      'Consultoria Estratégica Semanal',
      'Escala Ilimitada de Infraestrutura',
    ],
    features: [
      { text: 'Tudo do plano Professional' },
      { text: 'Redação de Conteúdo (Blog)', isNew: true },
      { text: 'Dashboards em Tempo Real', isNew: true },
      { text: 'Segurança Nível Enterprise' },
      { text: 'Apoio Especializado 24/7', isNew: true },
      { text: 'Treino de Equipa Mensal' },
    ]
  }
]

// --- Utils ---
const renderHighlightedTitle = (text: string, theme: any) => {
  if (!text) return null;
  const parts = text.split(/(\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <span 
          key={i} 
          style={{ color: theme.colors.highlight, filter: `drop-shadow(0 0 15px ${theme.colors.highlight}60)` }}
        >
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
};

const CheckIcon = ({ color }: { color: string }) => (
  <svg className="w-4 h-4 mr-2 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="3">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

export default function PlanosClient() {
  return <PlanosContent />
}

function PlanosContent() {
  const { theme, themeName, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<number>(1) // Professional as default
  const activePlan = plans[activeTab]

  const fadeInUp: Variants = {
    initial: { opacity: 0, y: 30 },
    whileInView: { 
      opacity: 1, 
      y: 0,
      transition: { duration: theme.animations.duration, ease: theme.animations.ease }
    }
  }

  const staggerContainer: Variants = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <main className="min-h-screen bg-black text-white relative">
      <style>{`
        :root {
          --primary-color: ${theme.colors.primary};
          --secondary-color: ${theme.colors.secondary};
          --highlight-color: ${theme.colors.highlight};
        }
      `}</style>

      {/* Fundo fixo */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/imgs/universo-nebuloso.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-30 blur-[4px]"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10">
        {/* Navbar idêntica às LPs */}
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <Link
                href="/"
                className="font-black text-2xl tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
              >
                AG47
              </Link>
              <ThemeSwitcher themeName={themeName} onToggle={toggleTheme} />
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/servicos#grid-servicos"
                className="text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors"
              >
                Outros Serviços
              </Link>
              <a
                href="#contacto"
                className="text-[10px] uppercase tracking-[0.3em] bg-white text-black font-black px-4 py-2 rounded-full hover:scale-105 transition-all"
              >
                Contacto
              </a>
            </div>

            {/* Mobile Round Buttons */}
            <div className="flex md:hidden items-center gap-2">
              <Link 
                href="/servicos#grid-servicos"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-90"
                aria-label="Todos os Serviços"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </Link>
              <a 
                href="#contacto"
                className="relative group w-9 h-9 rounded-full bg-white/10 backdrop-blur-lg border border-white/30 flex items-center justify-center text-white transition-all active:scale-90 overflow-hidden"
                aria-label="Contacto"
              >
                <svg className="relative z-10" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <div className="absolute inset-0 bg-white/5 animate-pulse" />
              </a>
            </div>
          </div>
          <ScrollProgressBar />
        </nav>

        {/* Hero Section */}
        <section className="relative pt-40 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent uppercase"
            >
              {renderHighlightedTitle('Planos de *Alta Performance*', theme)}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed"
            >
              Escolha o motor ideal para a sua marca. Transparência total, sem letras pequenas e foco absoluto em ROI.
            </motion.p>
          </div>

          {/* Background ambient glow */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[150px] opacity-20 pointer-events-none transition-all duration-1000"
            style={{ background: `radial-gradient(circle, ${theme.colors.primary}60 0%, transparent 70%)` }}
          />
        </section>

        {/* Pricing Module */}
        <section className="px-6 pb-32">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[650px]"
            >
              
              {/* Left Column: Plan Selection & Resources */}
              <div className="flex-1 p-8 md:p-12 lg:border-r border-white/10">
                <div className="mb-12">
                  <h3 className="text-4xl font-black mb-3 tracking-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent uppercase">
                    {activePlan.name}
                  </h3>
                  <p className="text-white/50 text-sm font-medium">{activePlan.slogan}</p>
                </div>

                {/* Tab Switcher */}
                <div className="relative flex justify-between mb-16 p-1 bg-white/5 rounded-full border border-white/5">
                  {plans.map((plan, idx) => (
                    <button
                      key={plan.id}
                      onClick={() => setActiveTab(idx)}
                      className={`relative z-10 flex-1 py-4 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === idx ? 'text-black' : 'text-white/30 hover:text-white/60'}`}
                    >
                      {plan.name}
                    </button>
                  ))}
                  {/* Selector Background */}
                  <motion.div 
                    layoutId="tab-bg"
                    className="absolute inset-y-1 rounded-full shadow-lg"
                    style={{ 
                      backgroundColor: theme.colors.primary,
                      width: `${100 / plans.length}%`,
                      left: `${(100 / plans.length) * activeTab}%`,
                      boxShadow: `0 0 30px ${theme.colors.primary}40`
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                </div>

                {/* Resources List */}
                <div className="space-y-8">
                  <h4 className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-black">Recursos Principais</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
                    {activePlan.resources.map((res, i) => (
                      <motion.div 
                        key={res}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center text-sm md:text-base font-medium text-white/80"
                      >
                        <div className="w-1.5 h-1.5 rounded-full mr-4 shrink-0" style={{ backgroundColor: theme.colors.primary }} />
                        {res}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Pricing & Secondary Features */}
              <div className="w-full lg:w-[400px] bg-white/[0.01] p-8 md:p-12 flex flex-col">
                <div className="mb-10">
                  {activePlan.originalMonthly && (
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white/20 line-through text-sm font-light">{activePlan.originalMonthly}</span>
                      <span 
                        style={{ backgroundColor: `${theme.colors.primary}15`, color: theme.colors.primary, borderColor: `${theme.colors.primary}30` }}
                        className="text-[9px] font-black uppercase px-2 py-0.5 rounded border"
                      >
                        {activePlan.discount}
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-black tracking-tighter">{activePlan.monthly}</span>
                    <span className="text-white/40 text-sm font-light">/mês</span>
                  </div>
                  <div 
                    style={{ backgroundColor: `${theme.colors.secondary}15`, borderColor: `${theme.colors.secondary}30`, color: theme.colors.secondary }}
                    className="mt-6 inline-block px-4 py-2 border rounded-lg text-[10px] font-black uppercase tracking-[0.2em]"
                  >
                    Setup Único: {activePlan.setup}
                  </div>
                </div>

                {/* CTA */}
                <button 
                  style={{ backgroundColor: theme.colors.primary }}
                  className="w-full py-5 rounded-xl text-black font-black uppercase tracking-[0.2em] text-[11px] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)] mb-12"
                >
                  Escolher {activePlan.name} →
                </button>

                {/* Features Checklist */}
                <div className="flex-1">
                  <div className="space-y-4">
                    {activePlan.features.map((feat, i) => (
                      <motion.div 
                        key={feat.text}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 + 0.3 }}
                        className="flex items-start text-[13px] text-white/60 leading-snug group/feat"
                      >
                        <CheckIcon color={theme.colors.highlight} />
                        <span className="flex-1 group-hover/feat:text-white transition-colors">{feat.text}</span>
                        {feat.isNew && (
                          <span className="ml-2 text-[8px] font-black uppercase bg-white/5 text-white/30 px-1.5 py-0.5 rounded">Novo</span>
                        )}
                        {feat.isFree && (
                          <span 
                            style={{ color: theme.colors.primary, borderColor: `${theme.colors.primary}30`, backgroundColor: `${theme.colors.primary}10` }}
                            className="ml-2 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border"
                          >
                            Grátis
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <p className="mt-12 text-[9px] text-white/10 text-center uppercase tracking-[0.5em] font-black">
                  Inovação sem limites • 2026
                </p>
              </div>

            </motion.div>
          </div>
        </section>

        {/* Footer link */}
        <div className="text-center pb-20 opacity-30 hover:opacity-100 transition-opacity">
          <Link href="/servicos" className="text-[10px] uppercase tracking-[0.5em] font-black text-white hover:text-[var(--primary-color)] transition-colors">
            ← Voltar para todos os serviços
          </Link>
        </div>
      </div>
    </main>
  )
}
