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
      siteName: 'Agência 47',
      locale: 'pt_PT',
      type: 'website',
      images: [
        {
          url: `https://ag47.pt${service.img}`,
          width: 1200,
          height: 630,
          alt: `${service.cardTitle} — Agência 47`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: service.metaTitle,
      description: service.metaDescription,
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

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.cardTitle,
      description: service.metaDescription,
      provider: {
        '@type': 'Organization',
        name: 'Agência 47',
        url: 'https://ag47.pt',
      },
      areaServed: {
        '@type': 'Country',
        name: 'Portugal',
      },
      url: `https://ag47.pt/servicos/${service.slug}`,
    },
    ...(service.faqs?.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: service.faqs.map((faq: { q: string; a: string }) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
              },
            })),
          },
        ]
      : []),
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicoDetalheClient service={service} />
    </>
  )
}
