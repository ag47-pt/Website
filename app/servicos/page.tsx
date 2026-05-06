import { Metadata } from 'next'
import ServicosClient from './ServicosClient'

export const metadata: Metadata = {
  title: 'Serviços | Agência 47 — Websites, SaaS, Social Media e Tráfego Pago',
  description:
    'Websites, SaaS, Social Media e Tráfego Pago. Vê todos os serviços da Agência 47 e escolhe o que vai catapultar o teu negócio.',
  alternates: { canonical: '/servicos' },
  openGraph: {
    title: 'Serviços | Agência 47 — Websites, SaaS, Social Media e Tráfego Pago',
    description:
      'Descobre todos os serviços digitais da Agência 47: websites de conversão, SaaS, gestão de redes sociais e tráfego pago em Portugal.',
    url: 'https://ag47.pt/servicos',
    siteName: 'Agência 47',
    locale: 'pt_PT',
    type: 'website',
    images: [
      {
        url: 'https://www.ag47.pt/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Agência 47 — Serviços Digitais de Alta Performance',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Serviços | Agência 47 — Websites, SaaS & Marketing Digital',
    description:
      'Websites, SaaS, Social Media e Tráfego Pago. Catapulta o teu negócio com a Agência 47.',
  },
}

export default function ServicosPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Serviços de Marketing Digital e Desenvolvimento — Agência 47',
    description:
      'Lista completa de serviços da Agência 47, incluindo Websites, SaaS, Social Media e Tráfego Pago.',
    numberOfItems: 4,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Websites de Alta Performance',
        url: 'https://ag47.pt/servicos/websites',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Desenvolvimento SaaS',
        url: 'https://ag47.pt/servicos/saas',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Gestão de Social Media',
        url: 'https://ag47.pt/servicos/social-media',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Tráfego Pago (Ads)',
        url: 'https://ag47.pt/servicos/trafego-pago',
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicosClient />
    </>
  )
}
