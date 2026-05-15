import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { restaurants } from '../data/restaurants';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('🌱 Seeding restaurants...');

  for (const r of restaurants) {
    const { data, error } = await supabase
      .from('restag_restaurants')
      .upsert({
        slug: r.slug,
        name: r.cardTitle.replace(/\*/g, ''),
        description: r.metaDescription,
        address: r.address,
        branding_color: r.brandingColor || '#D1FF00',
        status: 'active',
        meta_data: r
      }, { onConflict: 'slug' })
      .select();

    if (error) {
      console.error(`❌ Error seeding ${r.slug}:`, error.message);
    } else {
      console.log(`✅ Seeded ${r.slug}`);
    }
  }

  console.log('✨ Seeding complete!');
}

seed();
