'use client'

import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { services } from '@/data/services'
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar'

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.9, ease: [0.27, 1, 0.45, 1] }
  }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function ServicosClient() {
  return (
    <main className="min-h-screen bg-black text-white">
      <style>{`
        @keyframes cardPulse {
          0% { border-color: rgba(59, 130, 246, 0.2); box-shadow: 0 0 20px rgba(59, 130, 246, 0.05); }
          50% { border-color: rgba(168, 85, 247, 0.4); box-shadow: 0 0 30px rgba(168, 85, 247, 0.1); }
          100% { border-color: rgba(236, 72, 153, 0.2); box-shadow: 0 0 20px rgba(236, 72, 153, 0.05); }
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
          className="w-full h-full object-cover opacity-20 blur-[6px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      <div className="relative z-10">
        {/* Nav simples */}
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="font-black text-2xl tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
            >
              AG47
            </Link>
            <Link
              href="/"
              className="text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors flex items-center gap-2"
            >
              <span>←</span> Voltar ao início
            </Link>
          </div>
          <ScrollProgressBar />
        </nav>

        {/* Hero */}
        <section className="pt-40 pb-20 px-6 text-center">
          <div className="max-w-4xl mx-auto bg-black/20 backdrop-blur-lg rounded-[2.5rem] p-10 md:p-16 border border-white/5 shadow-2xl">
            <motion.p 
              initial={{ opacity: 0, letterSpacing: '0.2em' }}
              animate={{ opacity: 1, letterSpacing: '0.5em' }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-[11px] uppercase tracking-[0.5em] text-white/40 mb-4"
            >
              O que fazemos
            </motion.p>
            <motion.h1 
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent"
            >
              Nossos <span className="text-[#ec4899] drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]">Serviços</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/50 max-w-xl mx-auto text-lg font-light leading-relaxed"
            >
              Soluções digitais que funcionam. Escolhe o serviço certo para o teu momento.
            </motion.p>
          </div>
        </section>

        {/* Grid de serviços */}
        <motion.section 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.1 }}
          className="max-w-6xl mx-auto px-6 pb-32 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {services.map((service, i) => (
            <motion.div
              key={service.slug}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href={`/servicos/${service.slug}`}
                className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-white/40 hover:bg-white/[0.08] transition-all duration-500 animate-card-pulse"
              >
                {/* Imagem */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.img}
                    alt={service.cardTitle}
                    className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {service.badge && (
                    <span className="absolute top-5 left-5 bg-gradient-to-r from-blue-500 to-blue-700 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20">
                      {service.badge}
                    </span>
                  )}
                  <span className="absolute bottom-5 left-5 text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400">
                    {service.tag}
                  </span>
                </div>

                {/* Conteúdo */}
                <div className="p-8">
                  <h2 className="text-2xl font-black tracking-tighter mb-3 leading-tight group-hover:text-blue-400 transition-colors">
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
      </div>
    </main>
  )
}
