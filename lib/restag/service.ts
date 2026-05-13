import { supabase } from '@/lib/supabase';
import type { 
  Restaurant, 
  Reservation, 
  Profile, 
  MenuCategory, 
  MenuItem,
  NodeStatus,
  ReservationStatus
} from '@/types/restag';

// --- RESTAURANTS ---

export async function getRestaurants() {
  const { data, error } = await supabase
    .from('restag_restaurants')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Restaurant[];
}

export async function getRestaurantBySlug(slug: string) {
  const { data, error } = await supabase
    .from('restag_restaurants')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as Restaurant;
}

export async function updateRestaurantStatus(id: string, status: NodeStatus) {
  const { error } = await supabase
    .from('restag_restaurants')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

// --- RESERVATIONS ---

export async function getReservations(restaurantId?: string) {
  let query = supabase
    .from('restag_reservations')
    .select('*, restag_restaurants(name)')
    .order('reservation_date', { ascending: true })
    .order('reservation_time', { ascending: true });

  if (restaurantId) {
    query = query.eq('restaurant_id', restaurantId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateReservationStatus(id: string, status: ReservationStatus) {
  const { error } = await supabase
    .from('restag_reservations')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}

// --- STATS ---

export async function getAdminStats() {
  const [restaurants, reservations] = await Promise.all([
    supabase.from('restag_restaurants').select('id', { count: 'exact' }),
    supabase.from('restag_reservations').select('id', { count: 'exact' }),
  ]);

  return {
    totalRestaurants: restaurants.count || 0,
    totalReservations: reservations.count || 0,
    activeNodes: (await supabase.from('restag_restaurants').select('id', { count: 'exact' }).eq('status', 'active')).count || 0
  };
}

export async function getMerchantStats(restaurantId: string) {
  const { count: totalReservations } = await supabase
    .from('restag_reservations')
    .select('id', { count: 'exact' })
    .eq('restaurant_id', restaurantId);

  const { count: pendingReservations } = await supabase
    .from('restag_reservations')
    .select('id', { count: 'exact' })
    .eq('restaurant_id', restaurantId)
    .eq('status', 'pending');

  return {
    totalReservations: totalReservations || 0,
    pendingReservations: pendingReservations || 0,
  };
}
