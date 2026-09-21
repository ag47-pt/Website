import { Metadata } from 'next'
import { servicesItemList } from '@/data/services'
import ServicosClient from './ServicosClient'

export const metadata: Metadata = {
  title: 'Serviços Digitais, IA & Automação | Agência 47',
  description:
    'Websites, SaaS, conteúdo, tráfego pago, IA e automação, soluções para restaurantes e digitalização de negócios. Explora as ofertas da Agência 47.',
  alternates: { canonical: '/servicos' },
  openGraph: {
    title: 'Serviços Digitais, IA & Automação | Agência 47',
    description:
      'Explora websites, SaaS, conteúdo, tráfego pago, IA, restauração e digitalização de negócios em Portugal.',
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
    title: 'Serviços Digitais, IA & Automação | Agência 47',
    description:
      'Websites, SaaS, conteúdo, tráfego pago, IA, restauração e digitalização. Descobre a solução para o teu negócio.',
  },
}

export default function ServicosPage() {
  const jsonLd = servicesItemList

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
