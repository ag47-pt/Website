'use client'

import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar'
import { services } from '@/data/services'

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  whileInView: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
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

const renderHighlightedTitle = (text: string) => {
  const parts = text.split(/(\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <span key={i} className="text-[#ec4899] drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]">
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
};

function HeroSection({ service }: { service: (typeof services)[number] }) {
  return (
    <section className="relative pt-40 pb-28 px-6 overflow-hidden">
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1.05, opacity: 0.35 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img
          src={service.img}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
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
            className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-7 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent whitespace-pre-line"
          >
            {renderHighlightedTitle(service.heroTitle)}
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
            <a
              href="#contacto"
              className="inline-flex items-center gap-3 bg-white text-black font-black text-sm uppercase tracking-widest px-8 py-4 rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300"
            >
              {service.heroCta}
              <span>→</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ResultsBar({ service }: { service: (typeof services)[number] }) {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="border-y border-white/10 bg-white/[0.02] backdrop-blur-xl"
    >
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {service.results.map((r, i) => (
          <motion.div 
            key={r.label} 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="text-3xl md:text-4xl font-black text-white mb-1">{r.value}</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">{r.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

function ValueProps({ service }: { service: (typeof services)[number] }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <motion.div 
        variants={fadeInUp}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-16"
      >
        <p className="text-[11px] uppercase tracking-[0.5em] text-white/30 mb-3">O que recebes</p>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
          Porquê escolher a Agência 47
        </h2>
      </motion.div>
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {service.valueProps.map((vp) => (
          <motion.div
            key={vp.title}
            variants={fadeInUp}
            className="group p-7 rounded-2xl border border-white/8 bg-white/[0.025] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-400"
          >
            <div className="text-3xl mb-4">{vp.icon}</div>
            <h3 className="font-black text-lg mb-2 tracking-tight">{vp.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed">{vp.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

function ProcessSection({ service }: { service: (typeof services)[number] }) {
  return (
    <section className="bg-white/[0.02] border-y border-white/8 py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <p className="text-[11px] uppercase tracking-[0.5em] text-white/30 mb-3">Como funciona</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter">O processo</h2>
        </motion.div>
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-0"
        >
          {service.process.map((step, i) => (
            <motion.div
              key={step.step}
              variants={fadeInUp}
              className="flex gap-8 items-start py-8 border-b border-white/8 last:border-none group"
            >
              <div className="shrink-0 w-16 text-right">
                <span className="text-4xl font-black text-white/10 group-hover:text-white/20 transition-colors leading-none">
                  {step.step}
                </span>
              </div>
              <div>
                <h3 className="font-black text-xl mb-1.5 tracking-tight">{step.title}</h3>
                <p className="text-white/50 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function FaqSection({ service }: { service: (typeof services)[number] }) {
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
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter">FAQ</h2>
      </motion.div>
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-4"
      >
        {service.faqs.map((faq) => (
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

function CtaSection({ service }: { service: (typeof services)[number] }) {
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
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
            {service.ctaTitle}
          </h2>
          <p className="text-white/50 text-lg mb-10 leading-relaxed">{service.ctaBody}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contacto@ag47.pt"
              className="inline-flex items-center justify-center gap-2 bg-white text-black font-black text-sm uppercase tracking-widest px-8 py-4 rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] transition-all duration-300"
            >
              Falar connosco →
            </a>
            <Link
              href="/servicos"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-black text-sm uppercase tracking-widest px-8 py-4 rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              Ver todos os serviços
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function ServicoDetalheClient({ service }: { service: (typeof services)[number] }) {
  return (
    <main className="min-h-screen bg-black text-white">
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
            <Link
              href="/"
              className="font-black text-2xl tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
            >
              AG47
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/servicos"
                className="text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors hidden sm:block"
              >
                Serviços
              </Link>
              <a
                href="#contacto"
                className="text-[10px] uppercase tracking-[0.3em] bg-white text-black font-black px-4 py-2 rounded-full hover:scale-105 transition-all"
              >
                Contacto
              </a>
            </div>
          </div>
          <ScrollProgressBar />
        </nav>

        <HeroSection service={service} />
        <ResultsBar service={service} />
        <ValueProps service={service} />
        <ProcessSection service={service} />
        <FaqSection service={service} />
        <CtaSection service={service} />

        <footer className="border-t border-white/8 py-8 text-center">
          <p className="text-white/20 text-[10px] uppercase tracking-[0.5em]">
            Agência 47 · {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </main>
  )
}
