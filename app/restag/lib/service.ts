import { supabase } from './supabase';
import type { 
  Restaurant, 
  Reservation, 
  MenuCategory, 
  MenuItem,
  NodeStatus,
  ReservationStatus,
  StaffAssignment,
  Invitation,
  CustomerCRM
} from '../types';

// --- RESTAURANTS ---

export async function getRestaurants() {
  const { data, error } = await supabase
    .from('restag_restaurants')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Restaurant[];
}

export async function getRestaurantById(id: string) {
  const { data, error } = await supabase
    .from('restag_restaurants')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Restaurant;
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

export async function createRestaurant(restaurant: Partial<Restaurant>) {
  const { data, error } = await supabase
    .from('restag_restaurants')
    .insert([{ ...restaurant, created_at: new Date().toISOString() }])
    .select()
    .single();

  if (error) throw error;
  return data as Restaurant;
}

export async function updateRestaurant(id: string, updates: Partial<Restaurant>) {
  const { error } = await supabase
    .from('restag_restaurants')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

export async function updateRestaurantStatus(id: string, status: NodeStatus) {
  const { error } = await supabase
    .from('restag_restaurants')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

export async function updateRestaurantSettings(id: string, metaData: any) {
  const { error } = await supabase
    .from('restag_restaurants')
    .update({ meta_data: metaData })
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

// --- STAFF & INVITATIONS ---

export async function getStaffAssignments(restaurantId: string) {
  const { data, error } = await supabase
    .from('restag_staff_assignments')
    .select('*, profiles(full_name, role)')
    .eq('restaurant_id', restaurantId);

  if (error) throw error;
  return data as (StaffAssignment & { profiles: { full_name: string | null; role: string } })[];
}

export async function createStaffInvitation(invitation: Omit<Invitation, 'id' | 'created_at' | 'status'>) {
  const { data, error } = await supabase
    .from('restag_invitations')
    .insert([{ 
      ...invitation, 
      status: 'pending',
      created_at: new Date().toISOString() 
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Invitation;
}

export async function getPendingInvitations(restaurantId: string) {
  const { data, error } = await supabase
    .from('restag_invitations')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('status', 'pending');

  if (error) throw error;
  return data as Invitation[];
}

// --- CUSTOMER CRM ---

export async function getRestaurantCustomersCRM(restaurantId: string) {
  const { data, error } = await supabase
    .from('restag_customers')
    .select('*, profiles(full_name)')
    .eq('restaurant_id', restaurantId)
    .order('total_reservations', { ascending: false });

  if (error) throw error;
  return data as (CustomerCRM & { profiles: { full_name: string | null } })[];
}

export async function updateCustomerCRMNotes(customerId: string, notes: string, tags?: string[]) {
  const updates: any = { notes, updated_at: new Date().toISOString() };
  if (tags) {
    updates.tags = tags;
  }

  const { error } = await supabase
    .from('restag_customers')
    .update(updates)
    .eq('id', customerId);

  if (error) throw error;
}

/**
 * Automatically checks for pending invitations associated with the user's email.
 * If found, claims them by:
 * 1. Promoting the profile role to 'staff'.
 * 2. Creating the staff assignment mapping.
 * 3. Marking the invitation status as 'accepted'.
 */
export async function checkAndClaimInvitation(email: string, profileId: string): Promise<boolean> {
  // 1. Fetch pending invitations for this email
  const { data: invitations, error: fetchErr } = await supabase
    .from('restag_invitations')
    .select('*')
    .eq('email', email)
    .eq('status', 'pending');

  if (fetchErr) {
    console.error('[RESTAG_SERVICE] Error fetching pending invitations:', fetchErr);
    return false;
  }

  if (!invitations || invitations.length === 0) {
    return false;
  }

  let claimedAny = false;

  // 2. Process each invitation atomically
  for (const invitation of invitations) {
    // a) Get current profile role
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', profileId)
      .single();

    if (profileErr || !profile) {
      console.error('[RESTAG_SERVICE] Error fetching profile during invitation claim:', profileErr);
      continue;
    }

    // b) Promote 'customer' to 'staff' (preserve admin/merchant statuses)
    if (profile.role === 'customer') {
      const { error: roleErr } = await supabase
        .from('profiles')
        .update({
          role: 'staff',
          updated_at: new Date().toISOString()
        })
        .eq('id', profileId);

      if (roleErr) {
        console.error('[RESTAG_SERVICE] Error promoting role to staff:', roleErr);
        continue;
      }
    }

    // c) Insert staff assignment mapping
    const { error: assignErr } = await supabase
      .from('restag_staff_assignments')
      .insert([{
        profile_id: profileId,
        restaurant_id: invitation.restaurant_id,
        allowed_modules: invitation.allowed_modules,
        permissions: invitation.permissions,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);

    if (assignErr) {
      console.error('[RESTAG_SERVICE] Error creating staff assignment:', assignErr);
      continue;
    }

    // d) Mark invitation status as accepted
    const { error: inviteErr } = await supabase
      .from('restag_invitations')
      .update({
        status: 'accepted',
        updated_at: new Date().toISOString()
      })
      .eq('id', invitation.id);

    if (inviteErr) {
      console.error('[RESTAG_SERVICE] Error updating invitation status:', inviteErr);
    } else {
      claimedAny = true;
    }
  }

  return claimedAny;
}

