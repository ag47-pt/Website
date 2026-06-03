export type UserRole = 'ag47_admin' | 'merchant' | 'staff' | 'customer';
export type NodeStatus = 'pending' | 'active' | 'suspended';
export type ReservationStatus = 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';

export type PlanType = 'FREE' | 'MENU_CORE' | 'RESERVATION_PRO' | 'FULL_STACK_ADS';

export interface Subscription {
  plan: PlanType;
  active_modules: ('LP' | 'MENU' | 'RESERVATIONS' | 'ADS' | 'WHATSAPP')[];
  expires_at: string | null;
}

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export interface StaffAssignment {
  id: string;
  profile_id: string;
  restaurant_id: string;
  allowed_modules: ('MENU' | 'RESERVATIONS' | 'ADS' | 'WHATSAPP')[];
  permissions: {
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface Invitation {
  id: string;
  restaurant_id: string;
  email: string;
  allowed_modules: ('MENU' | 'RESERVATIONS' | 'ADS' | 'WHATSAPP')[];
  permissions: {
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;
  };
  status: 'pending' | 'accepted' | 'expired';
  token: string;
  created_at: string;
  expires_at: string;
}

export interface CustomerCRM {
  id: string;
  restaurant_id: string;
  profile_id: string;
  total_reservations: number;
  notes: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  city: string | null;
  status: NodeStatus;
  branding_color: string;
  subscription: Subscription;
  meta_data: any;
  created_at: string;
}

export interface Reservation {
  id: string;
  restaurant_id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  status: ReservationStatus;
  notes: string | null;
  created_at: string;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  display_order: number;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
}
