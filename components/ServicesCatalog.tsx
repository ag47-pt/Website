'use client'

import { motion, type Variants } from 'framer-motion'
import { catalogServices } from '@/data/services'
import { useTheme } from '@/context/ThemeContext'
import { AttributionLink } from '@/components/ServiceContactLink'

export function ServicesCatalog({ fadeInUp, staggerContainer }: { fadeInUp: Variants; staggerContainer: Variants }) {
  const { theme } = useTheme()
  return (

        <motion.section
          id="grid-servicos"
          aria-label="Catálogo completo de serviços"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.1 }}
          className="scroll-mt-24 max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {catalogServices.map((service, i) => (
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

              <AttributionLink
                href={`/servicos/${service.slug}`}
                className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-white/40 hover:bg-white/[0.08] transition-all duration-500 animate-card-pulse focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white h-full"
              >
                {/* Imagem */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.img}
                    width={800}
                    height={450}
                    loading="lazy"
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
                  <p className="text-sm text-white/80 mb-4">{service.offers.find((offer) => offer.active)?.priceLabel}</p>
                  <div className="flex items-center gap-2 text-white/70 text-[11px] font-bold uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                    <span>Ver soluções</span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </div>
                </div>

                {/* Número decorativo */}
                <div className="absolute top-5 right-5 text-white/5 font-black text-7xl leading-none select-none group-hover:text-white/10 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </div>
              </AttributionLink>
            </motion.div>
          ))}
        </motion.section>

  )
}
