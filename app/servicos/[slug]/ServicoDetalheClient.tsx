// SEO: metadata (title, description, openGraph, twitter, canonical) + JSON-LD (Service + FAQPage)
// is defined in the parent Server Component: app/servicos/[slug]/page.tsx
'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, Variants, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar'
import { CountUp } from '@/components/ui/CountUp'
import { services } from '@/data/services'
import { usePageScroll } from '@/hooks/usePageScroll'
import { useTheme, ThemeProvider } from '@/context/ThemeContext'
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher'

/**
 * Utilitário para renderizar títulos com destaque colorido.
 */
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

export default function ServicoDetalheClient({ 
  service 
}: { 
  service: (typeof services)[number] 
}) {
  return <ServicoDetalheContent service={service} />
}

function ServicoDetalheContent({ 
  service 
}: { 
  service: (typeof services)[number] 
}) {
  const { theme, themeName, toggleTheme } = useTheme()
  const scrollOffset = usePageScroll()
  const displayPercent = Math.round(theme.branding.startingPercent + (scrollOffset * (100 - theme.branding.startingPercent)))

  // Variants dinâmicas baseadas no tema
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
    <main className="min-h-screen bg-black text-white">
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
        {/* Navbar */}
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
              <Link 
                href="/servicos/planos"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-90"
                aria-label="Preços"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
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

        <HeroSection 
          service={service} 
          theme={theme} 
          onStartClick={() => {
            const element = document.getElementById('proxima-sessao');
            if (element) {
              const offset = 100; // Offset para compensar o navbar sticky
              const elementPosition = element.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
              });
            }
          }}
        />
        <ResultsBar service={service} theme={theme} />
        <ValueProps service={service} theme={theme} fadeInUp={fadeInUp} staggerContainer={staggerContainer} />
        <ProcessSection service={service} theme={theme} fadeInUp={fadeInUp} staggerContainer={staggerContainer} />
        <FaqSection service={service} theme={theme} fadeInUp={fadeInUp} staggerContainer={staggerContainer} />
        <CtaSection service={service} theme={theme} />

        <footer className="border-t border-white/8 py-8 text-center">
          <p className="text-white/20 text-[10px] uppercase tracking-[0.5em]">
            Agência 47 · {new Date().getFullYear()}
          </p>
        </footer>

        {/* Indicador de Percentagem de Scroll (Ag47 Style) */}
        <div className="fixed bottom-10 right-10 z-50 flex items-baseline gap-1 select-none pointer-events-none">
          <span className="text-8xl md:text-[10rem] font-black tracking-tighter text-white/5 tabular-nums leading-none">
            {displayPercent}
          </span>
          <span 
            style={{ color: theme.colors.scrollPercentage, filter: `drop-shadow(0 0 15px ${theme.colors.scrollPercentage}80)` }}
            className="text-2xl font-black"
          >
            %
          </span>
        </div>
      </div>
    </main>
  )
}

/**
 * Secções Internas (Componentes Auxiliares)
 */

function HeroSection({ 
  service, 
  theme, 
  onStartClick 
}: { 
  service: any, 
  theme: any,
  onStartClick?: () => void 
}) {
  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden">
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1.05, opacity: 0.5 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img
          src={service.img}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="bg-black/30 backdrop-blur-xl rounded-[3rem] p-12 md:p-20 border border-white/5 shadow-2xl">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[11px] uppercase tracking-[0.5em] text-white/40 mb-5"
          >
            {service.heroLabel}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-7 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent whitespace-pre-line"
          >
            {renderHighlightedTitle(service.heroTitle, theme)}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-white/60 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10"
          >
            {service.heroSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <button
              onClick={onStartClick}
              style={{ backgroundColor: theme.colors.primary }}
              className="inline-flex items-center gap-3 text-black font-black text-sm uppercase tracking-widest px-8 py-4 rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300 cursor-pointer"
            >
              Começar Agora
              <span className="text-xl">→</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ScrollIndicator({ targetId, theme, extraOffsetVp = 0 }: { targetId: string, theme: any, extraOffsetVp?: number }) {
  return (
    <motion.div 
      onClick={() => {
        const nextSection = document.getElementById(targetId);
        if (nextSection) {
          const offset = 100;
          const elementPosition = nextSection.getBoundingClientRect().top + window.pageYOffset;
          const extraPx = extraOffsetVp * window.innerHeight;
          
          window.scrollTo({
            top: elementPosition - offset + extraPx,
            behavior: 'smooth'
          });
        }
      }}
      whileHover={{ scale: 1.1, opacity: 0.8 }}
      className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer pointer-events-auto transition-all duration-300 z-10"
      style={{ color: `${theme.colors.primary}40` }}
    >
      <div className="flex items-center gap-3">
        <div className="w-5 h-8 border-2 rounded-full flex justify-center p-1" style={{ borderColor: `${theme.colors.primary}20` }}>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1.5 rounded-full" 
            style={{ backgroundColor: theme.colors.primary }}
          />
        </div>
        <motion.div 
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          className="text-lg"
          style={{ color: `${theme.colors.primary}60` }}
        >
          ↓
        </motion.div>
      </div>
      <p 
        className="text-[8px] uppercase tracking-[0.4em] font-black mt-1"
        style={{ color: `${theme.colors.primary}40` }}
      >
        Clica para explorar
      </p>
    </motion.div>
  );
}

function ResultsBar({ service, theme }: { service: any, theme: any }) {
  const [activeLegend, setActiveLegend] = useState<number | null>(null)
  
  return (
    <section id="proxima-sessao" className="relative bg-white/[0.04] backdrop-blur-md border-y border-white/10 py-16 my-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {service.results.map((r: any, i: number) => (
          <div 
            key={r.label} 
            className="text-center group cursor-pointer relative"
            onClick={() => setActiveLegend(activeLegend === i ? null : i)}
          >
            <div className="text-4xl md:text-5xl font-black tracking-tighter mb-1 flex items-baseline justify-center gap-0.5">
              <span style={{ color: theme.colors.highlight }}>
                <CountUp value={String(r.value)} duration={2.5} />
              </span>
              <span style={{ color: theme.colors.primary }} className="text-xl">{r.suffix}</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">{r.label}</div>
            
            {r.desc && (
              <div 
                style={{ color: theme.colors.primary }}
                className={`mt-2 text-[8px] font-bold uppercase tracking-widest transition-all duration-300 ${activeLegend === i ? 'opacity-100 scale-110' : 'opacity-60'}`}
              >
                {activeLegend === i ? 'Fechar ×' : 'Ver detalhe +'}
              </div>
            )}
            
            <AnimatePresence>
              {activeLegend === i && r.desc && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.27, 1, 0.45, 1] }}
                  className="overflow-hidden"
                >
                  <p 
                    style={{ color: theme.colors.secondary }}
                    className="mt-4 text-sm leading-relaxed font-medium italic border-t border-white/10 pt-4"
                  >
                    {r.desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        </div>
      </div>

      {/* Indicador de Scroll */}
      <ScrollIndicator targetId="value-props" theme={theme} />
    </section>
  )
}

function ValueProps({ service, theme, fadeInUp, staggerContainer }: any) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section id="value-props" className="max-w-6xl mx-auto px-6 py-9">
      <motion.div 
        variants={fadeInUp}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-16"
      >
        <p className="text-[11px] uppercase tracking-[0.5em] text-white/30 mb-3">O que recebes</p>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
          {renderHighlightedTitle('Porquê escolher a *Agência 47*', theme)}
        </h2>
      </motion.div>
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {service.valueProps.map((vp: any, i: number) => (
          <motion.div
            key={vp.title}
            variants={fadeInUp}
            onClick={() => vp.detail && setActiveIndex(activeIndex === i ? null : i)}
            className={`group p-7 rounded-2xl border transition-all duration-500 flex flex-col h-full ${
              activeIndex === i 
              ? 'bg-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)]' 
              : 'bg-white/[0.03] border-white/5 hover:border-white/20'
            } ${vp.detail ? 'cursor-pointer' : 'cursor-default'}`}
            style={{ borderColor: activeIndex === i ? theme.colors.primary : undefined }}
          >
            <div className="text-3xl mb-4">{vp.icon}</div>
            <h3 className="font-black text-lg mb-2 tracking-tight">{vp.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-4">{vp.body}</p>
            
            {vp.detail && (
              <AnimatePresence>
                {activeIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden border-t border-white/10 pt-4 mt-auto"
                  >
                    <p 
                      style={{ color: theme.colors.primary }}
                      className="text-sm leading-relaxed font-light italic opacity-90"
                    >
                      "{vp.detail}"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
            
            {vp.detail && activeIndex !== i && (
              <div 
                className="mt-auto pt-4 text-[10px] uppercase tracking-widest text-white/20 transition-colors"
                style={{ color: activeIndex === i ? theme.colors.primary : undefined }}
              >
                Saber mais +
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
      
      {/* Indicador de Scroll para a próxima sessão */}
      <div className="relative mt-16 h-10">
        <ScrollIndicator targetId="processo" theme={theme} extraOffsetVp={1.5} />
      </div>
    </section>
  )
}

function ProcessSection({ service, theme, fadeInUp, staggerContainer }: any) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const scale = useTransform(scrollYProgress, [0, 0.6], [0.47, 1])

  return (
    <section id="processo" ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 min-h-[100dvh] flex items-center justify-center bg-white/[0.04] backdrop-blur-md border-y border-white/10 py-10 md:py-0">
        <motion.div 
          style={{ scale }}
          className="max-w-4xl mx-auto px-6 w-full py-6 md:py-20"
        >
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-8 md:mb-12"
          >
            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.5em] text-white mb-2 md:mb-3">Como funciona</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
              O processo
            </h2>
          </motion.div>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-0"
          >
            {service.process.map((step: any, i: number) => (
              <motion.div
                key={step.step}
                variants={fadeInUp}
                onClick={() => step.detail && setActiveStep(activeStep === i ? null : i)}
                className={`flex gap-4 md:gap-8 items-start py-4 md:py-8 border-b border-white/10 last:border-none group transition-all duration-500 rounded-xl px-4 -mx-4 ${
                  activeStep === i ? 'bg-white/5' : 'hover:bg-white/[0.02]'
                } ${step.detail ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className="shrink-0 w-10 md:w-16 text-right">
                  <span 
                    className={`text-2xl md:text-4xl font-black transition-colors leading-none ${
                      activeStep === i ? '' : 'text-white/30 group-hover:text-white/60'
                    }`}
                    style={{ color: activeStep === i ? theme.colors.primary : undefined }}
                  >
                    {step.step}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 
                    className={`font-black text-base md:text-xl mb-1 tracking-tight transition-colors ${
                      activeStep === i ? '' : 'text-white'
                    }`}
                    style={{ color: activeStep === i ? theme.colors.primary : undefined }}
                  >
                    {step.title}
                  </h3>
                  <p className={`transition-opacity duration-500 text-white leading-snug ${
                    activeStep === i ? 'opacity-40 text-[13px] md:text-sm' : 'text-sm md:font-light'
                  }`}>
                    {step.desc}
                  </p>
                  
                  {step.detail && (
                    <AnimatePresence>
                      {activeStep === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/10"
                        >
                          <p className="text-white text-sm md:text-base leading-relaxed font-light italic">
                            "{step.detail}"
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
                {step.detail && activeStep !== i && (
                  <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/40 group-hover:text-[var(--primary-color)] self-center transition-colors">
                    Saber mais +
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function FaqSection({ service, theme, fadeInUp, staggerContainer }: any) {
  return (
    <section className="max-w-3xl mx-auto px-6 py-24">
      <motion.div 
        variants={fadeInUp}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-14"
      >
        <p className="text-[11px] uppercase tracking-[0.5em] text-white/30 mb-3">Dúvidas frequentes</p>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
          FAQ
        </h2>
      </motion.div>
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-4"
      >
        {service.faqs.map((faq: any) => (
          <motion.details
            key={faq.q}
            variants={fadeInUp}
            className="group border border-white/10 rounded-2xl bg-white/[0.02] hover:border-white/20 transition-colors overflow-hidden"
          >
            <summary className="px-7 py-5 font-bold text-sm cursor-pointer list-none flex justify-between items-center gap-4">
              <span>{faq.q}</span>
              <span className="text-white/30 group-open:rotate-45 transition-transform duration-300 text-xl shrink-0">+</span>
            </summary>
            <div className="px-7 pb-6 text-white/55 text-sm leading-relaxed border-t border-white/8 pt-4">
              {faq.a}
            </div>
          </motion.details>
        ))}
      </motion.div>
    </section>
  )
}

function CtaSection({ service, theme }: { service: any, theme: any }) {
  return (
    <section id="contacto" className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-14"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-6 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
            {renderHighlightedTitle(service.ctaTitle, theme)}
          </h2>
          <p className="text-white/50 text-lg mb-10 leading-relaxed">{service.ctaBody}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contacto@ag47.pt"
              style={{ backgroundColor: theme.colors.primary }}
              className="inline-flex items-center justify-center gap-2 text-black font-black text-sm uppercase tracking-widest px-8 py-4 rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300"
            >
              Falar connosco →
            </a>
            <Link
              href="/servicos#grid-servicos"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-black text-sm uppercase tracking-widest px-8 py-4 rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              Ver todos os serviços
            </Link>
          </div>
          
          <div className="mt-10 pt-8 border-t border-white/5">
            <Link 
              href="/servicos/planos"
              style={{ color: `${theme.colors.primary}60` }}
              className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] hover:text-white transition-all duration-300 font-black inline-block"
            >
              Consulte a nossa tabela de preços completa →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
