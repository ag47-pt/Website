import PlanosClient from './PlanosClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Planos e Preços | Agência 47 — Setup + Mensalidade Transparente',
  description:
    'Conheça os planos Startup, Professional e Growth da Agência 47. Transparência total no setup e mensalidades. Sem letras pequenas, foco absoluto no ROI.',
  alternates: { canonical: '/servicos/planos' },
  openGraph: {
    title: 'Planos e Preços | Agência 47 — Alta Performance sem Surpresas',
    description:
      'Planos de websites, SaaS e marketing digital com preços transparentes. Setup único + mensalidade. Escolhe o motor ideal para a tua marca.',
    url: 'https://ag47.pt/servicos/planos',
    siteName: 'Agência 47',
    locale: 'pt_PT',
    type: 'website',
    images: [
      {
        url: 'https://www.ag47.pt/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Agência 47 — Planos e Preços de Alta Performance',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Planos e Preços | Agência 47',
    description:
      'Setup + mensalidade transparente. Escolhe o plano certo para o teu negócio crescer com a Agência 47.',
  },
}

export default function PlanosPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Planos de Serviços Digitais — Agência 47',
    description:
      'Planos Startup, Professional e Growth. Soluções completas com setup único e mensalidades transparentes.',
    brand: {
      '@type': 'Organization',
      name: 'Agência 47',
    },
    offers: {
      '@type': 'AggregateOffer',
      offerCount: '3',
      lowPrice: '0',
      priceCurrency: 'EUR',
      offers: [
        {
          '@type': 'Offer',
          name: 'Plano Startup',
          description: 'O motor inicial para o teu negócio.',
        },
        {
          '@type': 'Offer',
          name: 'Plano Professional',
          description: 'Aceleração constante e performance elevada.',
        },
        {
          '@type': 'Offer',
          name: 'Plano Growth',
          description: 'Domínio total do mercado e escala máxima.',
        },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PlanosClient />
    </>
  )
}
