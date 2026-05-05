import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { services, servicesBySlug, type ServiceKey } from '@/data/services'
import ServicoDetalheClient from './ServicoDetalheClient'

// Gera rotas estáticas para todos os slugs
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

// Metadata dinâmica por serviço
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = servicesBySlug[slug as ServiceKey]
  if (!service) return {}
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: `/servicos/${service.slug}` },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `https://ag47.pt/servicos/${service.slug}`,
      images: [{ url: service.img, alt: service.cardTitle }],
    },
  }
}

export default async function ServicoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = servicesBySlug[slug as ServiceKey]

  if (!service) notFound()

  return <ServicoDetalheClient service={service} />
}
