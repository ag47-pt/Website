import type {
  CreateWaitlistInput,
  RestReservation,
  RestRestaurant,
  RestSchedule,
  RestScheduleBlock,
  RestTable,
  RestWaitlistEntry,
} from "@/lib/rest/types";
import { makeRestSupabaseServiceClient } from "@/lib/rest/supabase-server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type RestaurantRow = {
  id: string;
  slug: string;
  name: string;
  timezone: string;
  default_locale: string;
  plan: "starter" | "pro" | "business" | "enterprise";
  min_advance_hours: number;
  max_advance_days: number;
  max_party_size: number;
  slot_duration_minutes: number;
  deposit_required: boolean;
  deposit_amount_cents: number;
};

type TableRow = {
  id: string;
  restaurant_id: string;
  room_id: string;
  room_name: string;
  table_number: string;
  min_covers: number;
  max_covers: number;
  status: "available" | "occupied" | "reserved" | "blocked";
  is_active: boolean;
};

type ScheduleRow = {
  id: string;
  restaurant_id: string;
  day_of_week: number;
  service_label: "Almoco" | "Jantar";
  open_time: string;
  close_time: string;
  is_active: boolean;
};

type ScheduleBlockRow = {
  id: string;
  restaurant_id: string;
  blocked_date: string;
  blocked_from: string | null;
  blocked_to: string | null;
  reason: string | null;
};

type ReservationRow = {
  id: string;
  restaurant_id: string;
  guest_name: string;
  guest_phone: string;
  guest_email: string | null;
  table_id: string;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  duration_minutes: number;
  status: "pending" | "confirmed" | "seated" | "completed" | "cancelled" | "no_show";
  source: "widget" | "phone" | "walk-in" | "google";
  notes: string | null;
  internal_notes: string | null;
  confirmation_token: string;
  created_at: string;
  updated_at: string;
  deposit_required: boolean;
  deposit_amount_cents: number;
  deposit_paid_at: string | null;
};

type WaitlistRow = {
  id: string;
  restaurant_id: string;
  guest_name: string;
  guest_phone: string;
  guest_email: string | null;
  party_size: number;
  requested_date: string;
  requested_time_from: string | null;
  notified_at: string | null;
  converted_to_reservation_id: string | null;
  created_at: string;
};

function normalizeTime(raw: string | null | undefined): string {
  if (!raw) return "00:00";
  return raw.slice(0, 5);
}

function mapRestaurant(row: RestaurantRow): RestRestaurant {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    timezone: row.timezone,
    defaultLocale: (row.default_locale as RestRestaurant["defaultLocale"]) ?? "pt-PT",
    plan: row.plan,
    minAdvanceHours: row.min_advance_hours,
    maxAdvanceDays: row.max_advance_days,
    maxPartySize: row.max_party_size,
    slotDurationMinutes: row.slot_duration_minutes,
    depositRequired: row.deposit_required,
    depositAmountCents: row.deposit_amount_cents,
  };
}

function mapTable(row: TableRow): RestTable {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    roomId: row.room_id,
    roomName: row.room_name,
    tableNumber: row.table_number,
    minCovers: row.min_covers,
    maxCovers: row.max_covers,
    status: row.status,
    isActive: row.is_active,
  };
}

function mapSchedule(row: ScheduleRow): RestSchedule {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    dayOfWeek: row.day_of_week,
    serviceLabel: row.service_label,
    openTime: normalizeTime(row.open_time),
    closeTime: normalizeTime(row.close_time),
    isActive: row.is_active,
  };
}

function mapScheduleBlock(row: ScheduleBlockRow): RestScheduleBlock {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    blockedDate: row.blocked_date,
    blockedFrom: row.blocked_from ? normalizeTime(row.blocked_from) : null,
    blockedTo: row.blocked_to ? normalizeTime(row.blocked_to) : null,
    reason: row.reason ?? undefined,
  };
}

function mapReservation(row: ReservationRow): RestReservation {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    guestName: row.guest_name,
    guestPhone: row.guest_phone,
    guestEmail: row.guest_email ?? undefined,
    tableId: row.table_id,
    partySize: row.party_size,
    reservationDate: row.reservation_date,
    reservationTime: normalizeTime(row.reservation_time),
    durationMinutes: row.duration_minutes,
    status: row.status,
    source: row.source,
    notes: row.notes ?? undefined,
    internalNotes: row.internal_notes ?? undefined,
    confirmationToken: row.confirmation_token,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    depositRequired: row.deposit_required,
    depositAmountCents: row.deposit_amount_cents,
    depositPaidAt: row.deposit_paid_at ?? undefined,
  };
}

function mapWaitlist(row: WaitlistRow): RestWaitlistEntry {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    guestName: row.guest_name,
    guestPhone: row.guest_phone,
    guestEmail: row.guest_email ?? undefined,
    partySize: row.party_size,
    requestedDate: row.requested_date,
    requestedTimeFrom: row.requested_time_from
      ? normalizeTime(row.requested_time_from)
      : undefined,
    notifiedAt: row.notified_at ?? undefined,
    convertedToReservationId: row.converted_to_reservation_id ?? undefined,
    createdAt: row.created_at,
  };
}

function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export async function getRestaurantById(id: string): Promise<RestRestaurant | undefined> {
  const client = makeRestSupabaseServiceClient();
  const { data, error } = await client
    .from("rest_restaurants")
    .select("*")
    .eq("id", id)
    .maybeSingle<RestaurantRow>();

  if (error) throw error;
  return data ? mapRestaurant(data) : undefined;
}

export async function getRestaurantBySlug(slug: string): Promise<RestRestaurant | undefined> {
  const client = makeRestSupabaseServiceClient();
  const { data, error } = await client
    .from("rest_restaurants")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<RestaurantRow>();

  if (error) throw error;
  return data ? mapRestaurant(data) : undefined;
}

export async function getRestaurantByIdentifier(
  identifier: string,
): Promise<RestRestaurant | undefined> {
  if (isUuid(identifier)) {
    const byId = await getRestaurantById(identifier);
    if (byId) return byId;
  }

  return getRestaurantBySlug(identifier);
}

export async function listRestaurantTables(restaurantId: string): Promise<RestTable[]> {
  const client = makeRestSupabaseServiceClient();
  const { data, error } = await client
    .from("rest_tables")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("is_active", true)
    .order("table_number", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => mapTable(row as TableRow));
}

export async function listRestaurantSchedules(
  restaurantId: string,
  dayOfWeek: number,
): Promise<RestSchedule[]> {
  const client = makeRestSupabaseServiceClient();
  const { data, error } = await client
    .from("rest_schedules")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("day_of_week", dayOfWeek)
    .eq("is_active", true)
    .order("open_time", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => mapSchedule(row as ScheduleRow));
}

export async function listScheduleBlocks(
  restaurantId: string,
  date: string,
): Promise<RestScheduleBlock[]> {
  const client = makeRestSupabaseServiceClient();
  const { data, error } = await client
    .from("rest_schedule_blocks")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("blocked_date", date);

  if (error) throw error;
  return (data ?? []).map((row) => mapScheduleBlock(row as ScheduleBlockRow));
}

export async function listReservations(
  restaurantId: string,
  date?: string,
): Promise<RestReservation[]> {
  const client = makeRestSupabaseServiceClient();
  let query = client
    .from("rest_reservations")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("reservation_date", { ascending: true })
    .order("reservation_time", { ascending: true });

  if (date) {
    query = query.eq("reservation_date", date);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row) => mapReservation(row as ReservationRow));
}

export async function getReservationById(id: string): Promise<RestReservation | undefined> {
  const client = makeRestSupabaseServiceClient();
  const { data, error } = await client
    .from("rest_reservations")
    .select("*")
    .eq("id", id)
    .maybeSingle<ReservationRow>();

  if (error) throw error;
  return data ? mapReservation(data) : undefined;
}

export async function getReservationByToken(
  token: string,
): Promise<RestReservation | undefined> {
  const client = makeRestSupabaseServiceClient();
  const { data, error } = await client
    .from("rest_reservations")
    .select("*")
    .eq("confirmation_token", token)
    .maybeSingle<ReservationRow>();

  if (error) throw error;
  return data ? mapReservation(data) : undefined;
}

export async function createReservation(
  reservation: Omit<RestReservation, "id" | "createdAt" | "updatedAt">,
): Promise<RestReservation> {
  const client = makeRestSupabaseServiceClient();
  const { data, error } = await client
    .from("rest_reservations")
    .insert({
      restaurant_id: reservation.restaurantId,
      guest_name: reservation.guestName,
      guest_phone: reservation.guestPhone,
      guest_email: reservation.guestEmail ?? null,
      table_id: reservation.tableId,
      party_size: reservation.partySize,
      reservation_date: reservation.reservationDate,
      reservation_time: reservation.reservationTime,
      duration_minutes: reservation.durationMinutes,
      status: reservation.status,
      source: reservation.source,
      notes: reservation.notes ?? null,
      internal_notes: reservation.internalNotes ?? null,
      confirmation_token: reservation.confirmationToken,
      deposit_required: reservation.depositRequired,
      deposit_amount_cents: reservation.depositAmountCents,
      deposit_paid_at: reservation.depositPaidAt ?? null,
    })
    .select("*")
    .single<ReservationRow>();

  if (error) throw error;
  return mapReservation(data);
}

export async function updateReservation(
  id: string,
  changes: Partial<Omit<RestReservation, "id" | "createdAt" | "restaurantId">>,
): Promise<RestReservation | undefined> {
  const client = makeRestSupabaseServiceClient();

  const updatePayload: Record<string, unknown> = {};

  if (changes.guestName !== undefined) updatePayload.guest_name = changes.guestName;
  if (changes.guestPhone !== undefined) updatePayload.guest_phone = changes.guestPhone;
  if (changes.guestEmail !== undefined) updatePayload.guest_email = changes.guestEmail ?? null;
  if (changes.tableId !== undefined) updatePayload.table_id = changes.tableId;
  if (changes.partySize !== undefined) updatePayload.party_size = changes.partySize;
  if (changes.reservationDate !== undefined)
    updatePayload.reservation_date = changes.reservationDate;
  if (changes.reservationTime !== undefined)
    updatePayload.reservation_time = changes.reservationTime;
  if (changes.durationMinutes !== undefined)
    updatePayload.duration_minutes = changes.durationMinutes;
  if (changes.status !== undefined) updatePayload.status = changes.status;
  if (changes.source !== undefined) updatePayload.source = changes.source;
  if (changes.notes !== undefined) updatePayload.notes = changes.notes ?? null;
  if (changes.internalNotes !== undefined)
    updatePayload.internal_notes = changes.internalNotes ?? null;
  if (changes.confirmationToken !== undefined)
    updatePayload.confirmation_token = changes.confirmationToken;
  if (changes.depositRequired !== undefined)
    updatePayload.deposit_required = changes.depositRequired;
  if (changes.depositAmountCents !== undefined)
    updatePayload.deposit_amount_cents = changes.depositAmountCents;
  if (changes.depositPaidAt !== undefined)
    updatePayload.deposit_paid_at = changes.depositPaidAt ?? null;

  const { data, error } = await client
    .from("rest_reservations")
    .update(updatePayload)
    .eq("id", id)
    .select("*")
    .maybeSingle<ReservationRow>();

  if (error) throw error;
  return data ? mapReservation(data) : undefined;
}

export async function createWaitlistEntry(
  data: CreateWaitlistInput,
): Promise<RestWaitlistEntry> {
  const client = makeRestSupabaseServiceClient();
  const { data: row, error } = await client
    .from("rest_waitlist")
    .insert({
      restaurant_id: data.restaurantId,
      guest_name: data.guestName,
      guest_phone: data.guestPhone,
      guest_email: data.guestEmail ?? null,
      party_size: data.partySize,
      requested_date: data.requestedDate,
      requested_time_from: data.requestedTimeFrom ?? null,
    })
    .select("*")
    .single<WaitlistRow>();

  if (error) throw error;
  return mapWaitlist(row);
}

export async function listWaitlist(
  restaurantId: string,
  date?: string,
): Promise<RestWaitlistEntry[]> {
  const client = makeRestSupabaseServiceClient();

  let query = client
    .from("rest_waitlist")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .is("converted_to_reservation_id", null)
    .order("created_at", { ascending: false });

  if (date) {
    query = query.eq("requested_date", date);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row) => mapWaitlist(row as WaitlistRow));
}

export async function getWaitlistEntryById(
  id: string,
): Promise<RestWaitlistEntry | undefined> {
  const client = makeRestSupabaseServiceClient();
  const { data, error } = await client
    .from("rest_waitlist")
    .select("*")
    .eq("id", id)
    .maybeSingle<WaitlistRow>();

  if (error) throw error;
  return data ? mapWaitlist(data) : undefined;
}

export async function updateWaitlistEntry(
  id: string,
  changes: {
    notifiedAt?: string | null;
    convertedToReservationId?: string | null;
  },
): Promise<RestWaitlistEntry | undefined> {
  const client = makeRestSupabaseServiceClient();

  const payload: Record<string, string | null> = {};

  if (changes.notifiedAt !== undefined) {
    payload.notified_at = changes.notifiedAt;
  }

  if (changes.convertedToReservationId !== undefined) {
    payload.converted_to_reservation_id = changes.convertedToReservationId;
  }

  const { data, error } = await client
    .from("rest_waitlist")
    .update(payload)
    .eq("id", id)
    .select("*")
    .maybeSingle<WaitlistRow>();

  if (error) throw error;
  return data ? mapWaitlist(data) : undefined;
}

export async function countRestaurants(): Promise<number> {
  const client = makeRestSupabaseServiceClient();
  const { count, error } = await client
    .from("rest_restaurants")
    .select("id", { count: "exact" })
    .limit(1);

  if (error) throw error;
  return count ?? 0;
}
