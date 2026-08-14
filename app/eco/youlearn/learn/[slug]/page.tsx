import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getKnowledgeObjectBySlug, getAllKnowledgeSlugs } from '@/eco/youlearn/data';
import { LearningPageClient } from './LearningPageClient';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllKnowledgeSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const knowledge = getKnowledgeObjectBySlug(slug);

  if (!knowledge) {
    return {
      title: 'Knowledge Experience Not Found | YouLearn AG47',
    };
  }

  const ogImage = knowledge.thumbnail || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80';

  return {
    title: `${knowledge.title} — YouLearn | AG47`,
    description: knowledge.description,
    alternates: {
      canonical: `/eco/youlearn/learn/${slug}`,
    },
    openGraph: {
      title: `${knowledge.title} — YouLearn`,
      description: knowledge.description,
      url: `https://ag47.pt/eco/youlearn/learn/${slug}`,
      siteName: 'YouLearn · Agência 47',
      locale: 'pt_PT',
      type: 'article',
      publishedTime: knowledge.createdAt,
      modifiedTime: knowledge.updatedAt,
      authors: [knowledge.source.author.name],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: knowledge.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${knowledge.title} — YouLearn`,
      description: knowledge.description,
      images: [ogImage],
    },
    keywords: [
      ...knowledge.topics,
      ...knowledge.tags,
      knowledge.category,
      knowledge.source.author.name,
      'YouLearn',
      'AG47',
    ],
  };
}

export default async function LearningPage({ params }: Props) {
  const { slug } = await params;
  const knowledge = getKnowledgeObjectBySlug(slug);

  if (!knowledge) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: knowledge.title,
    alternativeHeadline: knowledge.subtitle,
    description: knowledge.description,
    image: knowledge.thumbnail,
    author: {
      '@type': 'Person',
      name: knowledge.source.author.name,
      url: knowledge.source.author.profileUrl || knowledge.source.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Agência 47 Labs',
      url: 'https://ag47.pt',
    },
    datePublished: knowledge.createdAt,
    dateModified: knowledge.updatedAt,
    timeRequired: `PT${knowledge.learning.estimatedLearningMinutes}M`,
    educationalLevel: knowledge.learning.difficulty,
    keywords: knowledge.topics.join(', '),
    about: {
      '@type': 'Thing',
      name: knowledge.category,
    },
    isBasedOn: {
      '@type': 'CreativeWork',
      name: knowledge.source.title,
      url: knowledge.source.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LearningPageClient knowledge={knowledge} />
    </>
  );
}
