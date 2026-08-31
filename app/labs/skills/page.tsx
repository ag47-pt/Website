import type { Metadata } from 'next';
import { DesignSystemLabClient } from './DesignSystemLabClient';

const SITE_URL = 'https://ag47.pt';

export const metadata: Metadata = {
  title: 'Design System Lab — Labs Skills | Agência 47 Labs',
  description:
    'Ferramenta determinística para validação de contratos de Design System em Markdown, cálculo matemático de cobertura e bancada de teste visual isolada.',
  alternates: { canonical: '/labs/skills' },
  keywords: [
    'Design System Lab',
    'Labs Skills',
    'Agência 47 Labs',
    'design system validator',
    'coverage engine',
    'component workbench',
    'deterministic design tokens',
    'Next.js 16',
  ],
  openGraph: {
    title: 'Design System Lab — Labs Skills | AG47 Labs',
    description:
      'Transforme seu Design System como documento em um contrato executável, auditável e visualmente testável.',
    url: `${SITE_URL}/labs/skills`,
    siteName: 'Agência 47 Labs',
    locale: 'pt_PT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design System Lab — Labs Skills | AG47 Labs',
    description:
      'Validação de schema de Design System, cálculo de cobertura e bancada universal sem alucinação de LLM.',
  },
};

export default function LabsSkillsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AG47 Design System Lab',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    description:
      'Deterministic Design System validator, coverage engine, and isolated component showcase workbench inside AG47 Labs.',
    url: `${SITE_URL}/labs/skills`,
    author: {
      '@type': 'Organization',
      name: 'Agência 47 Labs',
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="space-y-6">
        <DesignSystemLabClient />
      </div>
    </>
  );
}
