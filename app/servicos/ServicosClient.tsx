// SEO: metadata (title, description, openGraph, twitter, canonical)
// is defined in the parent Server Component: app/servicos/page.tsx
'use client'

import { useRef } from 'react'
import { AttributionLink as Link, ServiceContactLink } from '@/components/ServiceContactLink'
import { motion, Variants, useScroll, useTransform } from 'framer-motion'
import { ServicesCatalog } from '@/components/ServicesCatalog'
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar'
import { usePageScroll } from '@/hooks/usePageScroll'
import { useTheme, ThemeProvider } from '@/context/ThemeContext'
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher'

export default function ServicosClient() {
  return <ServicosContent />
}

function ServicosContent() {
  const scrollOffset = usePageScroll()
  const { theme, themeName, toggleTheme } = useTheme()

  const fadeInUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: theme.animations.duration, ease: theme.animations.ease }
    }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const displayPercent = Math.round(theme.branding.startingPercent + (scrollOffset * (100 - theme.branding.startingPercent)))

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"]
  })

  // Transformações invertidas: Card começa visível e desaparece para cima
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, -150])

  return (
    <main className="min-h-screen bg-black text-white">
      <style>{`
        :root {
          --primary-color: ${theme.colors.primary};
          --secondary-color: ${theme.colors.secondary};
          --accent-color: ${theme.colors.accent};
          --highlight-color: ${theme.colors.highlight};
        }
        @keyframes cardPulse {
          0% { border-color: var(--primary-color); box-shadow: 0 0 15px var(--primary-color)20; }
          50% { border-color: var(--accent-color); box-shadow: 0 0 35px var(--accent-color)40; }
          100% { border-color: var(--primary-color); box-shadow: 0 0 15px var(--primary-color)20; }
        }
        .animate-card-pulse {
          animation: cardPulse 4s infinite alternate ease-in-out;
        }
      `}</style>
      {/* Fundo nebulosa */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/imgs/universo-nebuloso.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-30 blur-[4px]"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10">
        {/* Nav simples */}
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
                className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-lg border border-white/30 flex items-center justify-center text-white transition-all active:scale-90"
                aria-label="Preços"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </Link>
            </div>
          </div>
          <ScrollProgressBar />
        </nav>

        {/* Hero Sticky Scroll - Invertido */}
        <section ref={heroRef} className="relative h-[150vh] z-10">
          <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
            <motion.div 
              style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
              onClick={() => {
                const element = document.getElementById('grid-servicos');
                if (element) {
                  const offset = 120; // Compensação para o navbar sticky
                  const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                  window.scrollTo({
                    top: elementPosition - offset,
                    behavior: 'smooth'
                  });
                }
              }}
              className="max-w-3xl mx-auto bg-black/40 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center relative overflow-hidden cursor-pointer group/hero"
            >
              {/* Glow decorativo de fundo no card */}
              <div 
                className="absolute -top-32 -left-32 w-64 h-64 blur-[100px] rounded-full opacity-30 transition-colors duration-1000" 
                style={{ backgroundColor: theme.colors.primary }}
              />
              <div 
                className="absolute -bottom-32 -right-32 w-64 h-64 blur-[100px] rounded-full opacity-20 transition-colors duration-1000" 
                style={{ backgroundColor: theme.colors.secondary }}
              />

              <motion.p 
                initial={{ opacity: 0, letterSpacing: '0.2em' }}
                animate={{ opacity: 1, letterSpacing: '0.5em' }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-[11px] uppercase tracking-[0.5em] text-white/60 mb-6 relative z-10"
              >
                O que fazemos
              </motion.p>
              <motion.h1 
                className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent relative z-10"
              >
                Nossos <span style={{ color: theme.colors.primary, filter: `drop-shadow(0 0 20px ${theme.colors.primary}70)` }}>Serviços</span>
              </motion.h1>
              <motion.p 
                className="text-white/70 max-w-full mx-auto text-lg md:text-xl font-light leading-relaxed relative z-10 px-4"
              >
                Soluções digitais de alta performance. <br />
                Escolhe o serviço certo para o teu momento.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 relative z-10"
              >
                <Link 
                  href="/servicos/planos"
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 group"
                >
                  Ver Tabela de Preços 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </motion.div>
              
              {/* Indicador de scroll dentro do card (Estilo Mouse) */}
              <motion.div 
                style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
                className="mt-14 flex flex-col items-center gap-2 group-hover/hero:scale-110 transition-transform cursor-pointer"
                onClick={() => {
                  const grid = document.getElementById('grid-servicos');
                  if (grid) {
                    window.scrollTo({
                      top: grid.offsetTop - 100,
                      behavior: 'smooth'
                    });
                  }
                }}
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
            </motion.div>
          </div>
        </section>

        <ServicesCatalog fadeInUp={fadeInUp} staggerContainer={staggerContainer} />

        <section id="contacto" aria-labelledby="catalog-contact-title" className="max-w-3xl mx-auto px-6 pb-24 text-center scroll-mt-24">
          <h2 id="catalog-contact-title" className="text-3xl font-black mb-5">Vamos encontrar a solução para o teu negócio</h2>
          <ServiceContactLink service="Catálogo de serviços AG47" className="inline-flex rounded-full bg-white text-black px-8 py-4 font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Falar connosco →</ServiceContactLink>
        </section>

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
