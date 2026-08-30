import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPresentation, getRenderableSlugs } from '../lib/registry';
import { summarize } from '../lib/metrics';
import { PresentationClient } from './PresentationClient';

const SITE_URL = 'https://ag47.pt';

/** Pré-renderiza todas as apresentações registadas que não sejam privadas. */
export function generateStaticParams() {
  return getRenderableSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const presentation = getPresentation(slug);
  if (!presentation) return {};

  const url = `${SITE_URL}/labs/liveskills/${presentation.slug}`;
  const { title, description, keywords, noIndex } = presentation.metadata;
  const isUnlisted = presentation.visibility === 'unlisted';

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/labs/liveskills/${presentation.slug}` },
    robots:
      noIndex || isUnlisted
        ? { index: false, follow: false }
        : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Agência 47 Labs — LiveSkills',
      locale: 'en_GB',
      type: 'profile',
      images: [
        {
          url: `${SITE_URL}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: `${presentation.target.organization} — ${presentation.target.role ?? 'LiveSkills presentation'}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function LiveSkillPresentationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const presentation = getPresentation(slug);

  if (!presentation || presentation.visibility === 'private') notFound();

  const summary = summarize(presentation);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: presentation.metadata.title,
        description: presentation.metadata.description,
        url: `${SITE_URL}/labs/liveskills/${presentation.slug}`,
        inLanguage: 'en',
        dateModified: presentation.metadata.updatedAt,
        isPartOf: {
          '@type': 'WebSite',
          name: 'Agência 47',
          url: SITE_URL,
        },
        about: {
          '@type': 'Thing',
          name: `${presentation.target.organization} — ${presentation.target.role ?? 'presentation'}`,
        },
        mentions: presentation.projects.map((project) => ({
          '@type': 'SoftwareApplication',
          name: project.name,
          applicationCategory: 'WebApplication',
          description: project.kicker,
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
          {
            '@type': 'ListItem',
            position: 4,
            name: `${summary.organization} ${summary.index}`,
            item: `${SITE_URL}/labs/liveskills/${presentation.slug}`,
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
      <PresentationClient presentation={presentation} />
    </>
  );
}
