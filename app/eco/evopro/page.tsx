import { Metadata } from 'next';
import EvoProClient from './EvoProClient';
import { EVOPRO_CONFIG } from '@/data/evopro';

export const metadata: Metadata = {
  title: 'EvoPro — Evolution Protocol | AG47',
  description:
    'Protocolo determinístico de governança e evolução contínua para projetos de software assistidos por agentes de IA. Repository-native, harness-agnostic, model-agnostic, goal-driven e evidence-based.',
  alternates: {
    canonical: '/eco/evopro',
  },
  openGraph: {
    title: 'EvoPro — Evolution Protocol | AG47',
    description:
      'The intelligence can change. The protocol stays with the project. Governança determinística para software que sabe como continuar a evoluir.',
    url: 'https://ag47.pt/eco/evopro',
    siteName: 'Agência 47 — ECO',
    locale: 'pt_PT',
    type: 'website',
    images: [
      {
        url: 'https://ag47.pt/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'EvoPro — Evolution Protocol | AG47 ECO',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EvoPro — Evolution Protocol | AG47',
    description:
      'Protocolo determinístico de evolução para repositórios de software assistidos por IA. Repository-native, evidence-driven, zero bloat.',
  },
  keywords: [
    'EvoPro',
    'Evolution Protocol',
    'AG47',
    'Agência 47',
    'autonomous software evolution',
    'coding agents governance',
    'repository native',
    'harness agnostic',
    'AI software engineering',
    'Code Graph',
    'Gauntlet adversarial review',
    'deterministic judge',
    'AI handoff continuity'
  ],
};

export default function EvoProPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'EvoPro — Evolution Protocol',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Cross-platform',
        softwareVersion: EVOPRO_CONFIG.version,
        description:
          'Deterministic governance kernel for software evolution assisted by AI coding agents. Repository-native, harness-agnostic, evidence-driven, goal-driven.',
        url: EVOPRO_CONFIG.canonicalUrl,
        author: {
          '@type': 'Organization',
          name: 'Agência 47 Labs',
          url: 'https://ag47.pt',
        },
        license: 'https://opensource.org/licenses/MIT',
      },
      {
        '@type': 'SoftwareSourceCode',
        name: 'ag47-evolution-protocol',
        codeRepository: EVOPRO_CONFIG.gitHubUrl,
        programmingLanguage: 'Python',
        runtimePlatform: 'Python >=3.10',
        version: EVOPRO_CONFIG.version,
        license: 'https://opensource.org/licenses/MIT',
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
            item: 'https://ag47.pt/eco/evopro',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'EvoPro',
            item: 'https://ag47.pt/eco/evopro',
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
      <EvoProClient />
    </>
  );
}
