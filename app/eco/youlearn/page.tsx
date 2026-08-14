import { Metadata } from 'next';
import { DEMO_LIBRARY_ENTRIES, getAllCategories } from '@/eco/youlearn/data';
import { YouLearnLibraryClient } from './YouLearnLibraryClient';

export const metadata: Metadata = {
  title: 'YouLearn — Visual Knowledge Library | AG47',
  description:
    'Explore visual, high-density structured knowledge modules deconstructed from hours of deep-dive technical talks, masterclasses, and system architecture lectures.',
  alternates: {
    canonical: '/eco/youlearn',
  },
  openGraph: {
    title: 'YouLearn — Visual Knowledge Library | AG47',
    description:
      'Transform 2-hour technical deep-dives into 10-minute visual learning experiences. Query-Key-Value attention, Systems Dynamics, and Production Agentic RAG.',
    url: 'https://ag47.pt/eco/youlearn',
    siteName: 'Agência 47 — ECO',
    locale: 'pt_PT',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'YouLearn — Visual Knowledge Library',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YouLearn — Visual Knowledge Library | AG47',
    description:
      'High-compression visual learning experiences deconstructed from complex external sources.',
  },
  keywords: [
    'YouLearn',
    'AG47',
    'visual learning',
    'knowledge library',
    'AI learning',
    'Transformers Karpathy',
    'Systems Thinking',
    'Agentic RAG',
    'knowledge compression',
  ],
};

export default function YouLearnLibraryPage() {
  const categories = getAllCategories();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'YouLearn — Visual Knowledge Library',
    description:
      'Visual knowledge library deconstructing long-form video lectures and papers into high-density interactive learning modules.',
    url: 'https://ag47.pt/eco/youlearn',
    publisher: {
      '@type': 'Organization',
      name: 'Agência 47 Labs',
      url: 'https://ag47.pt',
    },
    hasPart: DEMO_LIBRARY_ENTRIES.map((entry) => ({
      '@type': 'LearningResource',
      name: entry.title,
      description: entry.description,
      url: `https://ag47.pt/eco/youlearn/learn/${entry.slug}`,
      timeRequired: `PT${entry.estimatedLearningMinutes}M`,
      educationalLevel: entry.difficulty,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <YouLearnLibraryClient
        initialEntries={DEMO_LIBRARY_ENTRIES}
        categories={categories}
      />
    </>
  );
}
