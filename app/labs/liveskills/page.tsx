import type { Metadata } from 'next';
import { PUBLIC_PRESENTATIONS } from './lib/registry';
import { summarize } from './lib/metrics';
import { LiveSkillsLabClient } from './LiveSkillsLabClient';

const SITE_URL = 'https://ag47.pt';

export const metadata: Metadata = {
  title: 'LiveSkills — Evidence-Driven Presentation Engine | Agência 47 Labs',
  description:
    'Motor de apresentações do AG47 Labs: transforma capacidades, projetos e evidências reais em páginas personalizadas para oportunidades específicas, com nível de confiança explícito em cada afirmação.',
  alternates: { canonical: '/labs/liveskills' },
  keywords: [
    'LiveSkills',
    'Agência 47 Labs',
    'evidence-driven presentation',
    'presentation engine',
    'candidatura técnica',
    'evidence graph',
    'Next.js',
  ],
  openGraph: {
    title: 'LiveSkills — Evidence-Driven Presentation Engine | AG47 Labs',
    description:
      'Cada capacidade ligada a um artefacto real. Cada afirmação com nível de confiança explícito. Um motor reutilizável, uma apresentação por oportunidade.',
    url: `${SITE_URL}/labs/liveskills`,
    siteName: 'Agência 47 Labs',
    locale: 'pt_PT',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: 'LiveSkills — AG47 Labs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LiveSkills — Evidence-Driven Presentation Engine | AG47 Labs',
    description:
      'Motor de apresentações orientado a evidência dentro do laboratório da Agência 47.',
  },
};

export default function LiveSkillsPage() {
  const summaries = PUBLIC_PRESENTATIONS.map(summarize);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'LiveSkills',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description:
          'Evidence-driven presentation engine inside AG47 Labs that turns real capabilities, projects and proof into personalised pages for specific opportunities.',
        url: `${SITE_URL}/labs/liveskills`,
        author: {
          '@type': 'Organization',
          name: 'Agência 47 Labs',
          url: SITE_URL,
        },
      },
      {
        '@type': 'ItemList',
        name: 'LiveSkills presentations',
        numberOfItems: summaries.length,
        itemListElement: summaries.map((summary, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: `${summary.organization}${summary.role ? ` — ${summary.role}` : ''}`,
          url: `${SITE_URL}/labs/liveskills/${summary.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'AG47', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Labs', item: `${SITE_URL}/labs` },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'LiveSkills',
            item: `${SITE_URL}/labs/liveskills`,
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
      <LiveSkillsLabClient summaries={summaries} />
    </>
  );
}
