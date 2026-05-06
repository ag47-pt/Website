'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, Variants, useScroll, useTransform } from 'framer-motion'
import { services } from '@/data/services'
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar'
import { usePageScroll } from '@/hooks/usePageScroll'
import { useTheme, ThemeProvider } from '@/context/ThemeContext'
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher'

export default function ServicosClient() {
  return (
    <ThemeProvider>
      <ServicosContent />
    </ThemeProvider>
  )
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
            <Link
              href="/"
              className="text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors flex items-center gap-2"
            >
              <span>←</span> Voltar ao início
            </Link>
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
              
              {/* Indicador de scroll dentro do card */}
              <motion.div 
                style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
                className="mt-14 flex flex-col items-center gap-2 group-hover/hero:scale-110 transition-transform"
              >
                <div 
                  style={{ background: `linear-gradient(to bottom, transparent, ${theme.colors.primary}, transparent)` }}
                  className="w-[1px] h-16 animate-pulse" 
                />
                <span 
                  className="text-[10px] uppercase tracking-[0.3em] text-white/40 group-hover/hero:text-[var(--primary-color)] transition-colors"
                >
                  Clica para explorar
                </span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Grid de serviços */}
        <motion.section 
          id="grid-servicos"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.1 }}
          className="scroll-mt-24 max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {services.map((service, i) => (
            <motion.div
              key={service.slug}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="relative group"
            >
              {/* Luz atrás do card (Ambient Glow) */}
              <div 
                className="absolute -inset-4 opacity-0 group-hover:opacity-100 transition-all duration-700 blur-[40px] -z-10 rounded-[40px]"
                style={{ background: `radial-gradient(circle at center, ${theme.colors.primary}20 0%, transparent 70%)` }}
              />

              <Link
                href={`/servicos/${service.slug}`}
                className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-white/40 hover:bg-white/[0.08] transition-all duration-500 animate-card-pulse"
              >
                {/* Imagem */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.img}
                    alt={service.cardTitle}
                    className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {service.badge && (
                    <span 
                      style={{ background: `linear-gradient(to right, ${theme.colors.secondary}, ${theme.colors.accent})` }}
                      className="absolute top-5 left-5 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg"
                    >
                      {service.badge}
                    </span>
                  )}
                  <span 
                    style={{ color: theme.colors.secondary }}
                    className="absolute bottom-5 left-5 text-[10px] font-bold uppercase tracking-[0.4em]"
                  >
                    {service.tag}
                  </span>
                </div>

                {/* Conteúdo */}
                <div className="p-8">
                  <h2 className="text-2xl font-black tracking-tighter mb-3 leading-tight group-hover:text-[var(--primary-color)] transition-colors">
                    {service.cardTitle}
                  </h2>
                  <p className="text-white/50 text-sm leading-relaxed mb-6 line-clamp-2">
                    {service.metaDescription}
                  </p>
                  <div className="flex items-center gap-2 text-white/70 text-[11px] font-bold uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                    <span>Ver serviço</span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </div>
                </div>

                {/* Número decorativo */}
                <div className="absolute top-5 right-5 text-white/5 font-black text-7xl leading-none select-none group-hover:text-white/10 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.section>

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
