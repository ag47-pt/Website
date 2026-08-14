import { Metadata } from 'next';
import Universo2DClient from './Universo2DClient';
import { UNIVERSO_2D_DATA } from '@/data/universo-2d';

export const metadata: Metadata = {
  title: 'Universo 2D | Agência 47 — Engenharia de Software, IA & Conversão',
  description:
    'Conheça a plataforma completa da Agência 47 no Universo 2D: Websites ultra-rápidos em Next.js 15, SaaS, IA proprietária, portfólio ao vivo, vantagens e preços transparentes.',
  keywords: [
    'Agência 47',
    'Universo 2D',
    'Desenvolvimento Web Portugal',
    'Next.js 15',
    'Agentes de IA',
    'Landing Pages de Alta Conversão',
    'Software sob Medida',
    'EvoPro',
    'Alt Radar',
    'YouLearn',
    'Preços Websites',
  ],
  authors: [{ name: 'Agência 47 Labs' }],
  creator: 'Agência 47',
  publisher: 'Agência 47',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
    url: 'https://ag47.pt/universo-2d',
    title: 'Universo 2D | Agência 47 — Engenharia de Software, IA & Conversão',
    description:
      'Explore o ecossistema completo da Agência 47: Serviços de elite, portfólio em tempo real, terminal interativo, vantagens e planos transparentes.',
    siteName: 'Agência 47',
    images: [
      {
        url: 'https://ag47.pt/imgs/service_web_design_pt.webp',
        width: 1200,
        height: 630,
        alt: 'Agência 47 — Universo 2D',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Universo 2D | Agência 47',
    description:
      'Hub de engenharia, inteligência artificial e conversão da Agência 47.',
    images: ['https://ag47.pt/imgs/service_web_design_pt.webp'],
  },
  alternates: {
    canonical: 'https://ag47.pt/universo-2d',
  },
};

export default function Universo2DPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: UNIVERSO_2D_DATA.brand.name,
    url: 'https://ag47.pt',
    logo: 'https://ag47.pt/icon.svg',
    description: UNIVERSO_2D_DATA.brand.tagline,
    email: UNIVERSO_2D_DATA.brand.email,
    telephone: '+351912345678',
    sameAs: ['https://github.com/ag47', 'https://instagram.com/agencia47'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Catálogo de Serviços e Planos Agência 47',
      itemListElement: UNIVERSO_2D_DATA.pricingTiers.map((tier, idx) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: tier.name,
          description: tier.tagline,
        },
        price: tier.priceProject,
        priceCurrency: 'EUR',
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Universo2DClient />
    </>
  );
}
