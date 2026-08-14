import type { Metadata } from 'next';
import { EcoClient } from './EcoClient';

export const metadata: Metadata = {
  title: 'Ecossistema Digital | Agência 47 ECO',
  description:
    'Explore o ecossistema integrado da Agência 47. Plataformas determinísticas, inteligência financeira, ferramentas autônomas e aplicações conectadas.',
  alternates: {
    canonical: '/eco',
  },
  openGraph: {
    title: 'Ecossistema Digital — AG47 ECO',
    description:
      'Sitemap visual e diretório integrado de aplicações, plataformas e inteligência da Agência 47.',
    url: 'https://ag47.pt/eco',
    siteName: 'Agência 47 — ECO',
    locale: 'pt_PT',
    type: 'website',
  },
};

export default function EcoPage() {
  return <EcoClient />;
}
