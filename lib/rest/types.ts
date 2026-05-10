export const REST_LOCALES = ["pt-PT", "en-GB", "es-ES"] as const;

export type RestLocale = (typeof REST_LOCALES)[number];

export type RestReservationStatus =
  | "pending"
  | "confirmed"
  | "seated"
  | "completed"
  | "cancelled"
  | "no_show";

export type RestTableStatus = "available" | "occupied" | "reserved" | "blocked";

export interface RestRestaurant {
  id: string;
  slug: string;
  name: string;
  timezone: string;
  defaultLocale: RestLocale;
  plan: "starter" | "pro" | "business" | "enterprise";
  minAdvanceHours: number;
  maxAdvanceDays: number;
  maxPartySize: number;
  slotDurationMinutes: number;
  depositRequired: boolean;
  depositAmountCents: number;
}

export interface RestTable {
  id: string;
  restaurantId: string;
  roomId: string;
  roomName: string;
  tableNumber: string;
  minCovers: number;
  maxCovers: number;
  status: RestTableStatus;
  isActive: boolean;
}

export interface RestSchedule {
  id: string;
  restaurantId: string;
  dayOfWeek: number;
  serviceLabel: "Almoco" | "Jantar";
  openTime: string;
  closeTime: string;
  isActive: boolean;
}

export interface RestScheduleBlock {
  id: string;
  restaurantId: string;
  blockedDate: string;
  blockedFrom: string | null;
  blockedTo: string | null;
  reason?: string;
}

export interface RestReservation {
  id: string;
  restaurantId: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  tableId: string;
  partySize: number;
  reservationDate: string;
  reservationTime: string;
  durationMinutes: number;
  status: RestReservationStatus;
  source: "widget" | "phone" | "walk-in" | "google";
  notes?: string;
  internalNotes?: string;
  confirmationToken: string;
  createdAt: string;
  updatedAt: string;
  depositRequired: boolean;
  depositAmountCents: number;
  depositPaidAt?: string;
}

export interface RestWaitlistEntry {
  id: string;
  restaurantId: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  partySize: number;
  requestedDate: string;
  requestedTimeFrom?: string;
  notifiedAt?: string;
  convertedToReservationId?: string;
  createdAt: string;
}

export interface SlotAvailability {
  time: string;
  availableCovers: number;
  availableTables: number;
  isAvailable: boolean;
}

export interface CreateReservationInput {
  restaurantId: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  partySize: number;
  reservationDate: string;
  reservationTime: string;
  source?: "widget" | "phone" | "walk-in" | "google";
  notes?: string;
}

export interface CreateWaitlistInput {
  restaurantId: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  partySize: number;
  requestedDate: string;
  requestedTimeFrom?: string;
}
