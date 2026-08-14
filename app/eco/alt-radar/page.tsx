import { Suspense } from 'react';
import { Metadata } from 'next';
import AltRadarSystemApp from './AltRadarSystemApp';
import { ALT_RADAR_CONFIG } from '@/data/alt-radar';

export const metadata: Metadata = {
  title: 'Alt Radar — Altcoin Intelligence & Discovery | AG47',
  description:
    'Radar inteligente de descoberta, análise autônoma de risco, scoring explicável e alertas de altcoins no ecossistema AG47.',
  alternates: {
    canonical: '/eco/alt-radar',
  },
  openGraph: {
    title: 'Alt Radar — AG47 ECO',
    description:
      'Plataforma de inteligência, descoberta e monitorização de altcoins do ecossistema AG47.',
    url: 'https://ag47.pt/eco/alt-radar',
    siteName: 'Agência 47 — ECO',
    locale: 'pt_PT',
    type: 'website',
    images: [
      {
        url: 'https://ag47.pt/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Alt Radar — AG47 Altcoin Intelligence Engine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alt Radar — AG47 ECO',
    description:
      'Radar inteligente de descoberta e análise de risco para altcoins.',
  },
  keywords: [
    'Alt Radar',
    'Altcoin Radar',
    'AG47',
    'Agência 47',
    'Crypto Intelligence',
    'DeFi Security',
    'Smart Contract Audit',
    'Token Discovery'
  ],
};

export default function AltRadarPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: ALT_RADAR_CONFIG.name,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Cross-platform',
        softwareVersion: ALT_RADAR_CONFIG.version,
        description: ALT_RADAR_CONFIG.tagline,
        url: ALT_RADAR_CONFIG.canonicalUrl,
        author: {
          '@type': 'Organization',
          name: 'Agência 47 ECO',
          url: 'https://ag47.pt',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'AG47',
            item: 'https://ag47.pt',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'ECO',
            item: 'https://ag47.pt/eco/alt-radar',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Alt Radar',
            item: 'https://ag47.pt/eco/alt-radar',
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={null}>
        <AltRadarSystemApp />
      </Suspense>
    </>
  );
}
