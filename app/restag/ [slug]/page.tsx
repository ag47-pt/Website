import { restaurants, RestaurantLP } from '@/data/restaurants';
import { RestagDetailClient } from '../components/RestagDetailClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = restaurants.find((r: RestaurantLP) => r.slug === slug);
  
  if (!restaurant) return { title: 'Not Found' };

  return {
    title: `${restaurant.cardTitle} | Restag Labs`,
    description: restaurant.metaDescription,
  };
}

export async function generateStaticParams() {
  return restaurants.map((restaurant: RestaurantLP) => ({
    slug: restaurant.slug,
  }));
}

export default async function RestaurantPage({ params }: Props) {
  const { slug } = await params;
  const restaurant = restaurants.find((r: RestaurantLP) => r.slug === slug);

  if (!restaurant) {
    notFound();
  }

  return <RestagDetailClient restaurant={restaurant} />;
}
