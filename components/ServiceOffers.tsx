import type { ServiceLP } from '@/data/services'
import { ServiceContactLink } from '@/components/ServiceContactLink'

export function ServiceOffers({ service }: { service: ServiceLP }) {
  const offers = service.offers.filter((offer) => offer.active)
  if (!offers.length) return null
  return (
    <section id="ofertas" aria-labelledby="ofertas-title" className="max-w-6xl mx-auto px-6 py-16 scroll-mt-24">
      <h2 id="ofertas-title" className="text-3xl md:text-5xl font-black tracking-tight mb-5">Soluções para o teu negócio</h2>
      <p className="text-white/60 mb-8 max-w-3xl">Preços iniciais e prazos indicativos, sujeitos ao âmbito, aos materiais e aos acessos necessários. IVA, licenças, mensalidades e condições finais são confirmados na proposta. Os prazos contam após validação e receção dos materiais.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <article key={offer.id} id={`oferta-${offer.id}`} className="flex flex-col min-w-0 rounded-3xl border border-white/10 bg-white/[0.03] p-6 scroll-mt-24">
            <h3 className="font-bold text-xl mb-3">{offer.title}</h3>
            <p className="text-white/70 text-sm mb-4">{offer.shortDescription}</p>
            <p className="font-bold text-2xl mb-2">{offer.priceLabel}</p>
            <p className="text-sm text-white/60 mb-5">Prazo indicativo: {offer.deliveryLabel}{offer.recurring ? ' · Serviço recorrente' : ''}</p>
            <p className="text-sm mb-3">{offer.outcome}</p>
            <p className="text-sm text-white/60 mb-3">Para: {offer.audience.join(', ')}.</p>
            <ul className="list-disc pl-5 text-sm text-white/75 space-y-2 mb-6">
              {offer.included.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <ServiceContactLink service={service.cardTitle} offer={offer.title} className="mt-auto inline-flex justify-center rounded-full border border-white/30 px-5 py-3 text-sm font-bold hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" aria-label={`Pedir informação: ${offer.title}`}>Pedir informação →</ServiceContactLink>
          </article>
        ))}
      </div>
    </section>
  )
}
