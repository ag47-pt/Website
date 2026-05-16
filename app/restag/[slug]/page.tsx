import { getRestaurantBySlug, getRestaurants } from '@/lib/restag/service';
import { RestagDetailClient } from '../components/RestagDetailClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { RestaurantLP } from '@/data/restaurants';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

function mapDbToLP(dbRestaurant: any): RestaurantLP {
  const meta = dbRestaurant.meta_data || {};
  const gallery = meta.gallery || [];
  
  return {
    slug: dbRestaurant.slug,
    tag: meta.tag || '',
    cardTitle: meta.cardTitle || dbRestaurant.name,
    cardSubtitle: meta.cardSubtitle || dbRestaurant.name,
    img: meta.img || gallery[0] || '/restag/franguia_gallery_0.png',
    badge: meta.badge || '',
    metaTitle: meta.metaTitle || `${dbRestaurant.name} | Restag`,
    metaDescription: meta.metaDescription || dbRestaurant.description || '',
    heroLabel: meta.heroLabel || 'Experience',
    heroTitle: meta.heroTitle || dbRestaurant.name,
    heroSubtitle: meta.heroSubtitle || dbRestaurant.description || '',
    descriptionLong: meta.descriptionLong || dbRestaurant.description || '',
    heroCta: meta.heroCta || 'Reservar Mesa',
    address: dbRestaurant.address || '',
    cuisine: meta.cuisine || '',
    priceRange: meta.priceRange || '',
    rating: meta.rating || 0,
    location: meta.location || { lat: 38.8029, lng: -9.3817 },
    valueProps: meta.valueProps || [],
    process: meta.process || [],
    results: meta.results || [],
    faqs: meta.faqs || [],
    ctaTitle: meta.ctaTitle || 'Pronto para uma *experiência* inesquecível?',
    ctaBody: meta.ctaBody || 'Escolhe a tua data e deixa o resto connosco.',
    menu: meta.menu || [],
    giftCards: meta.giftCards || [],
    reservationSettings: meta.reservationSettings || { maxPartySize: 8, intervals: 30, notice: '2 hours' },
    phone: meta.phone || '',
    operatingHours: meta.operatingHours || {},
    gallery: gallery,
    features: meta.features || [],
    video: meta.video,
    videoWatermark: meta.videoWatermark,
    brandingColor: dbRestaurant.branding_color || meta.brandingColor,
    effectsEnabled: meta.effectsEnabled !== undefined ? meta.effectsEnabled : true,
    plan: dbRestaurant.subscription?.plan || meta.plan || 'FREE',
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const restaurant = await getRestaurantBySlug(slug);
    const lpData = mapDbToLP(restaurant);
    return {
      title: `${lpData.cardTitle.replace(/\*/g, '')} | Restag Labs`,
      description: lpData.metaDescription,
    };
  } catch (e) {
    return { title: 'Restag' };
  }
}

export async function generateStaticParams() {
  try {
    const restaurants = await getRestaurants();
    return restaurants.map((r) => ({
      slug: r.slug,
    }));
  } catch (e) {
    return [];
  }
}

export default async function RestaurantPage({ params }: Props) {
  const { slug } = await params;
  
  try {
    const dbRestaurant = await getRestaurantBySlug(slug);
    const restaurant = mapDbToLP(dbRestaurant);
    return <RestagDetailClient restaurant={restaurant} />;
  } catch (e) {
    notFound();
  }
}
