'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, animate } from 'framer-motion';
import {
  ShieldCheck, ChevronDown, ChevronRight, Terminal, Activity,
  Zap, ArrowLeft, CheckCircle, Clock, Users, BarChart3, Send,
  FileSearch, Settings, TrendingUp, Award, MousePointer2
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import { HeroRestag } from '../components/HeroRestag';
import { RestagLayout } from '../components/RestagLayout';
import { renderRestagText } from '../lib/utils';

// ─── Scroll Progress Bar (Comet) ─────────────────────────────────────────────
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const { theme } = useTheme();
  return (
    <motion.div
      style={{ scaleX, backgroundColor: theme.colors.primary, transformOrigin: 'left' }}
      className="absolute bottom-0 left-0 right-0 h-[2px] shadow-[0_0_8px_var(--glow)]"
    />
  );
}

// ─── Scroll % HUD ─────────────────────────────────────────────────────────────
function ScrollHUD() {
  const { scrollYProgress } = useScroll();
  const { theme, isDark } = useTheme();
  const [pct, setPct] = useState(47);
  scrollYProgress.on('change', (v) => setPct(Math.round(47 + v * 53)));
  return (
    <div className={`fixed bottom-6 right-6 z-40 font-mono text-xs border backdrop-blur-xl px-3 py-2 rounded-full pointer-events-none ${isDark ? 'border-white/10 bg-black/60' : 'border-black/10 bg-white/85'}`}>
      <span style={{ color: theme.colors.primary }}>{pct}%</span>
      <span className={`ml-1 ${isDark ? 'text-white/30' : 'text-black/30'}`}>LOADED</span>
    </div>
  );
}

// ─── Process Steps (Sticky Scroll) ───────────────────────────────────────────
const PROCESS_STEPS = [
  {
    id: '01',
    title: 'INTAKE_BRIEF',
    subtitle: 'Recolha de Dados',
    description: 'Analisamos o teu negócio em profundidade: operações, equipa, ticket médio, fluxo de clientes e sistemas existentes.',
    icon: FileSearch,
    meta: 'DURATION: 48h · FORMAT: Entrevista + Questionário Digital',
  },
  {
    id: '02',
    title: 'GASTRO_SCAN',
    subtitle: 'Auditoria Técnica',
    description: 'Inspecção presencial ou remota a todos os pontos críticos: cozinha, sala, tecnologia, carta, e experiência do cliente.',
    icon: Activity,
    meta: 'DURATION: 3-5 dias · FORMAT: Site Visit + Mystery Guest',
  },
  {
    id: '03',
    title: 'DATA_SYNTHESIS',
    subtitle: 'Processamento & Análise',
    description: 'Os dados são transformados em métricas acionáveis. Identificamos os 3 maiores alavancadores de crescimento do negócio.',
    icon: BarChart3,
    meta: 'DURATION: 5 dias · FORMAT: Relatório Técnico Detalhado',
  },
  {
    id: '04',
    title: 'DEPLOY_ROADMAP',
    subtitle: 'Plano de Implementação',
    description: 'Entregamos um roadmap priorizado com quick wins e transformações estruturais. Acompanhamos a execução.',
    icon: TrendingUp,
    meta: 'DURATION: Contínuo · FORMAT: Dashboard de Progresso',
  },
];

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  { q: 'Quanto tempo demora uma auditoria completa?', a: 'O processo padrão leva entre 2-3 semanas: 1 semana de recolha e análise, 1 semana de síntese, e entrega do relatório final com roadmap.' },
  { q: 'O meu negócio precisa de estar em operação?', a: 'Sim, preferimos auditar em operação real. Podemos adaptar horários para minimizar o impacto no serviço.' },
  { q: 'O que está incluído no relatório final?', a: 'Análise de 360° do negócio, benchmarking sectorial, top 3 alavancadores de crescimento, roadmap priorizado, e 30 dias de suporte pós-entrega.' },
  { q: 'Trabalham com que tipo de negócios?', a: 'Restaurantes, hotéis, bares, caterings, e qualquer negócio de hospitalidade com ambição de crescimento. Desde startups a grupos com múltiplas unidades.' },
  { q: 'Qual é o investimento?', a: 'Cada auditoria é orçamentada após o primeiro contacto, com base na dimensão e complexidade do negócio. Contacta-nos para uma proposta.' },
];
const AUDIT_NAV_ITEMS = [
  { id: 'hero', label: 'AUDIT_START', icon: ShieldCheck },
  { id: 'metrics', label: 'THERMAL_STATUS', icon: Activity },
  { id: 'process', label: 'ENGINEERING_CYCLE', icon: Settings },
  { id: 'faq', label: 'FAQ_NODES', icon: ChevronDown },
  { id: 'form', label: 'DEPLOY_REQUEST', icon: Send },
];

const METRICS = [
  { 
    label: 'COMPLIANCE_SCORE', 
    targetValue: 98.2, 
    suffix: '%', 
    icon: ShieldCheck, 
    description: 'Medição rigorosa baseada em 120+ pontos de controlo operacional.' 
  },
  { 
    label: 'DELIVERY_TIME', 
    targetValue: 21, 
    suffix: '_DAYS', 
    icon: Clock, 
    description: 'Do intake inicial até à entrega do roadmap estratégico final.' 
  },
  { 
    label: 'AUDITS_DEPLOYED', 
    targetValue: 450, 
    suffix: '+', 
    icon: Activity, 
    description: 'Experiência acumulada em diversos conceitos de hospitalidade.' 
  },
  { 
    label: 'AVG_ROI_MULTIPLIER', 
    targetValue: 3.4, 
    suffix: 'x', 
    icon: Zap, 
    description: 'Retorno médio sobre o investimento verificado após 12 meses.' 
  },
];

// ─── Metric Component (Identical to /restag) ──────────────────────────────────────
const Metric = ({ label, targetValue, suffix = "", icon: Icon, description }: any) => {
  const { theme, isDark } = useTheme();
  const [count, setCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

   return (
    <motion.div 
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`View details for ${label}`}
      onKeyDown={(e: any) => handleKeyDown(e, () => setIsExpanded(!isExpanded))}
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
      }}
      onViewportEnter={() => {
        if (!hasAnimated) {
          animate(0, targetValue, {
            duration: 2,
            ease: "easeOut",
            onUpdate: (latest) => setCount(latest)
          });
          setHasAnimated(true);
        }
      }}
      className="flex flex-col items-center text-center gap-4 group cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-2 border transition-all group-hover:scale-110 relative ${
        isDark ? 'bg-white/5 border-white/10 group-hover:border-white/20' : 'bg-black/5 border-black/10 group-hover:border-black/20'
      }`}>
        <Icon className={`w-7 h-7 transition-colors ${isDark ? 'text-gray-500 group-hover:text-white' : 'text-gray-450 group-hover:text-black'}`} style={{ color: theme.colors.primary }} />
        {/* Secondary color accent */}
        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: theme.colors.secondary }} />
      </div>
      
      <div className={`text-5xl font-bold tracking-tighter transition-all group-hover:scale-105 tabular-nums ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ color: theme.colors.primary }}>
        {targetValue % 1 === 0 ? Math.floor(count) : count.toFixed(1)}
        {suffix}
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <div className="text-[10px] font-mono uppercase tracking-[0.4em] flex items-center gap-2" style={{ color: theme.colors.textMuted }}>
          {label}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className={isDark ? 'text-gray-400' : 'text-gray-500'}
          >
            <ChevronDown className="w-3 h-3" />
          </motion.div>
        </div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="text-[9px] font-mono leading-relaxed mt-2 max-w-[150px] uppercase tracking-wider" style={{ color: isDark ? theme.colors.secondary : theme.colors.textSecondary }}>
                {description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hover prompt */}
      <div className={`mt-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-[8px] font-mono uppercase tracking-widest ${isDark ? 'text-white/20' : 'text-black/30'}`}>
        <MousePointer2 className="w-2.5 h-2.5" />
        Protocol_Details
      </div>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AuditClient() {
  const { theme, isDark } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formState, setFormState] = useState({ name: '', business: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <RestagLayout navItems={AUDIT_NAV_ITEMS}>
      {/* ── Scroll HUD Progress ── */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] pointer-events-none">
        <ScrollProgressBar />
      </div>

      <div className="space-y-0">

        {/* ── SECTION 1: Hero ── */}
        <section id="hero" className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden mt-[-200px] pt-[200px]">
          <div className="relative min-h-[50vh] flex items-center pb-12">
            {/* Background image - Doubled width effect and pulled up to cover the gap */}
            <div
              className="absolute inset-x-0 top-[-200px] bottom-0 opacity-30 bg-center transition-all duration-1000 origin-center scale-x-[2]"
              style={{ 
                backgroundImage: 'url(/restag/audit-hero-bg.png)',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
              }}
            />
            {/* Gradient overlay - adjusted for panoramic view and top-fill */}
            <div className={`absolute inset-x-0 top-[-200px] bottom-0 pointer-events-none ${
              isDark 
                ? 'bg-gradient-to-b from-black/95 via-black/30 to-black' 
                : 'bg-gradient-to-b from-[#f8f9fa]/95 via-[#f8f9fa]/30 to-[#f8f9fa]'
            }`} />
            <div className={`absolute inset-x-0 top-[-200px] bottom-0 pointer-events-none opacity-60 ${
              isDark ? 'bg-gradient-to-r from-black via-transparent to-black' : 'bg-gradient-to-r from-[#f8f9fa] via-transparent to-[#f8f9fa]'
            }`} />
            
            {/* Ambient glow - wider and shorter, also pulled up */}
            <div className="absolute top-[calc(50%-100px)] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[300px] rounded-full blur-[200px] opacity-25 pointer-events-none"
              style={{ backgroundColor: theme.colors.primary }} />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
              <HeroRestag
                overline="AUDIT_PROTOCOL_v2.4"
                overlineIcon={ShieldCheck}
                title="Request"
                highlight="Audit"
                description="Submete o teu negócio à auditoria mais precisa do sector. **Gastro-Engineering** aplicado à tua realidade — análise profunda, resultados mensuráveis."
                statusTags={[
                  { label: 'AUDIT_AVAILABLE', color: 'lime', pulse: true },
                  { label: 'SLOTS_LIMITED', color: 'blue' },
                ]}
                actions={
                  <a href="#form" className="px-8 py-3 rounded-full font-bold text-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg inline-flex items-center gap-2"
                    style={{ backgroundColor: theme.colors.primary }}>
                    Iniciar Agora <ChevronRight className="w-4 h-4" />
                  </a>
                }
              />
            </div>
          </div>
        </section>

        {/* ── SECTION 2: Metrics Bar (Identical to /restag THERMAL_STATUS) ── */}
        <div id="metrics" className={`relative w-screen left-1/2 -translate-x-1/2 overflow-hidden border-y backdrop-blur-2xl transition-all duration-300 ${
          isDark 
            ? 'border-white/10 bg-zinc-900/5' 
            : 'border-black/10 bg-black/[0.02]'
        }`}>
          {/* Internal technical background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="max-w-7xl mx-auto px-6 py-20 relative z-10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {METRICS.map((m) => (
                <Metric 
                  key={m.label} 
                  label={m.label} 
                  targetValue={m.targetValue} 
                  suffix={m.suffix} 
                  icon={m.icon} 
                  description={m.description} 
                />
              ))}
            </div>
          </motion.section>
        </div>

        {/* ── SECTION 3: Process (Sticky Scroll Stack) ── */}
        <section id="process" className="max-w-7xl mx-auto px-6 pb-24 pt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
            }`}>
              <Settings className="w-6 h-6" style={{ color: theme.colors.primary }} />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.4em] mb-1" style={{ color: theme.colors.primary }}>GASTRO_ENGINEERING_CYCLE</p>
              <h2 className={`text-3xl font-bold tracking-tight uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>O Processo</h2>
            </div>
          </motion.div>

          {/* Natural sticky stack flow */}
          <div className="flex flex-col gap-[30vh] pb-[10vh]">
            {PROCESS_STEPS.map((step, i) => (
              <div
                key={step.id}
                className="sticky"
                style={{ 
                  top: `${100 + i * 32}px`, 
                  zIndex: i + 1,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative p-8 md:p-12 rounded-[40px] border backdrop-blur-2xl overflow-hidden transition-all duration-300 ${
                    isDark 
                      ? 'border-white/10 bg-zinc-950/95 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
                      : 'border-black/10 bg-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.05)]'
                  }`}
                >
                  {/* Watermark */}
                  <div className={`absolute top-4 right-6 text-[120px] font-black font-mono select-none pointer-events-none leading-none ${
                    isDark ? 'opacity-[0.04]' : 'opacity-[0.02]'
                  }`}>
                    {step.id}
                  </div>
                  {/* Glow accent */}
                  <div className="absolute top-0 left-0 w-1.5 h-full rounded-l-[40px]" style={{ backgroundColor: theme.colors.primary }} />

                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center border shadow-inner transition-colors ${
                      isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                    }`}>
                      <step.icon className="w-7 h-7" style={{ color: theme.colors.primary }} />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.4em] mb-1" style={{ color: theme.colors.primary }}>
                          STEP_{step.id} · {step.title}
                        </p>
                        <h3 className={`text-2xl md:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{step.subtitle}</h3>
                      </div>
                      <p className={`leading-relaxed max-w-2xl ${isDark ? 'text-white/60' : 'text-gray-600'}`}>{step.description}</p>
                      <div className={`pt-4 border-t font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                        isDark ? 'border-white/5 text-white/30' : 'border-black/5 text-gray-400'
                      }`}>
                        {step.meta}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 4: FAQ ── */}
        <section id="faq" className="max-w-4xl mx-auto px-6 pb-24 pt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] mb-2" style={{ color: theme.colors.primary }}>FAQ_SECTION</p>
            <h2 className={`text-3xl font-bold tracking-tight uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>Perguntas Frequentes</h2>
          </motion.div>

          <div className={`space-y-0 divide-y transition-colors duration-300 ${isDark ? 'divide-white/8' : 'divide-black/10'}`}>
            {FAQ_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="w-full flex items-center justify-between py-6 text-left gap-4 group"
                >
                  <span className={`font-medium transition-colors ${isDark ? 'text-white/80 group-hover:text-white' : 'text-gray-800 group-hover:text-black'}`}>{item.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }} className="flex-shrink-0">
                    <ChevronDown className={`w-5 h-5 ${isDark ? 'text-white/40' : 'text-black/40'}`} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className={`pb-6 leading-relaxed text-sm ${isDark ? 'text-white/50' : 'text-gray-600'}`}>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── SECTION 5: Request Form (Final CTA Bento) ── */}
        <section id="form" className="max-w-7xl mx-auto px-6 pb-24 pt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`relative p-8 md:p-16 rounded-[64px] border backdrop-blur-2xl overflow-hidden transition-all duration-300 ${
              isDark 
                ? 'border-white/10 bg-zinc-950/60' 
                : 'border-black/10 bg-white/80 shadow-[0_30px_60px_rgba(0,0,0,0.05)]'
            }`}
          >
            {/* Dot grid background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--dot-color)_1.5px,transparent_1.5px)] bg-[size:32px_32px]"
                style={{ '--dot-color': theme.colors.primary } as React.CSSProperties}
              />
            </div>
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full blur-[100px] opacity-10"
              style={{ backgroundColor: theme.colors.primary }} />

            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-start">
              {/* Left: Info */}
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.4em] mb-3" style={{ color: theme.colors.primary }}>
                    DEPLOY_AUDIT_REQUEST
                  </p>
                  <h2 className={`text-4xl md:text-5xl font-bold tracking-tighter leading-none uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Pronto para<br />
                    <span className="px-2 py-1 rounded-lg" style={{ backgroundColor: theme.colors.primary, color: '#000' }}>
                      o Próximo Nível?
                    </span>
                  </h2>
                </div>
                <p className={`leading-relaxed ${isDark ? 'text-white/50' : 'text-gray-600'}`}>
                  Preenche o formulário e a nossa equipa entra em contacto em menos de 48 horas para agendar a tua auditoria.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: CheckCircle, text: 'Relatório completo em 2-3 semanas' },
                    { icon: Users, text: 'Equipa especializada em Gastro-Engineering' },
                    { icon: ShieldCheck, text: 'Confidencialidade garantida por NDA' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 flex-shrink-0" style={{ color: theme.colors.primary }} />
                      <span className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-700'}`}>{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className={`pt-4 border-t transition-colors ${isDark ? 'border-white/8' : 'border-black/10'}`}>
                  <p className={`font-mono text-[10px] uppercase tracking-[0.3em] transition-colors ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                    Ou contacta diretamente →{' '}
                    <a href="mailto:labs@agencia47.pt" className={`transition-colors underline underline-offset-4 ${isDark ? 'hover:text-white/60' : 'hover:text-black/60'}`}>
                      labs@agencia47.pt
                    </a>
                  </p>
                </div>
              </div>

              {/* Right: Form */}
              <div>
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center text-center py-16 space-y-6"
                    >
                      <div className="w-20 h-20 rounded-3xl flex items-center justify-center border border-white/10"
                        style={{ backgroundColor: `${theme.colors.primary}20` }}>
                        <CheckCircle className="w-10 h-10" style={{ color: theme.colors.primary }} />
                      </div>
                      <div>
                        <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>REQUEST_SUBMITTED</h3>
                        <p className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-600'}`}>Entramos em contacto em menos de 48h.</p>
                      </div>
                      <button
                        onClick={() => { setSubmitted(false); setFormState({ name: '', business: '', email: '', message: '' }); }}
                        className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${
                          isDark ? 'text-white/30 hover:text-white/60' : 'text-gray-450 hover:text-gray-600'
                        }`}
                      >
                        ← Nova submissão
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      {[
                        { id: 'name', label: 'NOME_COMPLETO', placeholder: 'João Silva', type: 'text' },
                        { id: 'business', label: 'NEGÓCIO', placeholder: 'Restaurante O Fado, Lisboa', type: 'text' },
                        { id: 'email', label: 'EMAIL_ADDRESS', placeholder: 'joao@negocio.pt', type: 'email' },
                      ].map((field) => (
                        <div key={field.id} className="space-y-1.5">
                          <label htmlFor={`audit-${field.id}`} className="block font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: theme.colors.primary }}>
                            {field.label}
                          </label>
                          <input
                            id={`audit-${field.id}`}
                            type={field.type}
                            required
                            placeholder={field.placeholder}
                            value={formState[field.id as keyof typeof formState]}
                            onChange={(e) => setFormState(prev => ({ ...prev, [field.id]: e.target.value }))}
                            className={`w-full border rounded-2xl px-4 py-3 text-sm outline-none transition-colors font-mono ${
                              isDark 
                                ? 'bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-white/30' 
                                : 'bg-black/5 border-black/10 text-gray-900 placeholder-black/30 focus:border-black/30'
                            }`}
                          />
                        </div>
                      ))}

                      <div className="space-y-1.5">
                        <label htmlFor="audit-message" className="block font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: theme.colors.primary }}>
                          CONTEXTO_ADICIONAL
                        </label>
                        <textarea
                          id="audit-message"
                          rows={4}
                          placeholder="Descreve brevemente o teu negócio e os principais desafios que enfrentas..."
                          value={formState.message}
                          onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                          className={`w-full border rounded-2xl px-4 py-3 text-sm outline-none transition-colors font-mono resize-none ${
                            isDark 
                              ? 'bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-white/30' 
                              : 'bg-black/5 border-black/10 text-gray-900 placeholder-black/30 focus:border-black/30'
                          }`}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-2xl font-bold text-black uppercase tracking-widest text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:scale-100"
                        style={{ backgroundColor: theme.colors.primary }}
                      >
                        {isSubmitting ? (
                          <>
                            <Activity className="w-4 h-4 animate-spin" />
                            PROCESSING_REQUEST...
                          </>
                        ) : (
                          <>
                            <Terminal className="w-4 h-4" />
                            SUBMIT_AUDIT_REQUEST
                            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>

                      <p className={`text-center font-mono text-[9px] uppercase tracking-widest transition-colors ${isDark ? 'text-white/20' : 'text-gray-400'}`}>
                        ENCRYPTED_TRANSMISSION · GDPR_COMPLIANT
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </section>

      </div>

      <ScrollHUD />
    </RestagLayout>
  );
}


