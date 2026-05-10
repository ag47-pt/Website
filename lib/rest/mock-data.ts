import type {
  CreateWaitlistInput,
  RestReservation,
  RestRestaurant,
  RestSchedule,
  RestScheduleBlock,
  RestTable,
  RestWaitlistEntry,
} from "@/lib/rest/types";

const now = new Date();
const yyyy = now.getUTCFullYear();
const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
const dd = String(now.getUTCDate()).padStart(2, "0");
const today = `${yyyy}-${mm}-${dd}`;

const tomorrowDate = new Date(now);
tomorrowDate.setUTCDate(tomorrowDate.getUTCDate() + 1);
const tyyyy = tomorrowDate.getUTCFullYear();
const tmm = String(tomorrowDate.getUTCMonth() + 1).padStart(2, "0");
const tdd = String(tomorrowDate.getUTCDate()).padStart(2, "0");
const tomorrow = `${tyyyy}-${tmm}-${tdd}`;

const restaurants: RestRestaurant[] = [
  {
    id: "rest-demo-1",
    slug: "demo-lisboa",
    name: "Bistro LX Demo",
    timezone: "Europe/Lisbon",
    defaultLocale: "pt-PT",
    plan: "pro",
    minAdvanceHours: 1,
    maxAdvanceDays: 60,
    maxPartySize: 10,
    slotDurationMinutes: 90,
    depositRequired: false,
    depositAmountCents: 0,
  },
];

const tables: RestTable[] = [
  {
    id: "t-01",
    restaurantId: "rest-demo-1",
    roomId: "room-indoors",
    roomName: "Interior",
    tableNumber: "1",
    minCovers: 1,
    maxCovers: 2,
    status: "available",
    isActive: true,
  },
  {
    id: "t-02",
    restaurantId: "rest-demo-1",
    roomId: "room-indoors",
    roomName: "Interior",
    tableNumber: "2",
    minCovers: 1,
    maxCovers: 2,
    status: "available",
    isActive: true,
  },
  {
    id: "t-03",
    restaurantId: "rest-demo-1",
    roomId: "room-indoors",
    roomName: "Interior",
    tableNumber: "3",
    minCovers: 2,
    maxCovers: 4,
    status: "available",
    isActive: true,
  },
  {
    id: "t-04",
    restaurantId: "rest-demo-1",
    roomId: "room-indoors",
    roomName: "Interior",
    tableNumber: "4",
    minCovers: 2,
    maxCovers: 4,
    status: "reserved",
    isActive: true,
  },
  {
    id: "t-05",
    restaurantId: "rest-demo-1",
    roomId: "room-terrace",
    roomName: "Esplanada",
    tableNumber: "5",
    minCovers: 2,
    maxCovers: 6,
    status: "available",
    isActive: true,
  },
  {
    id: "t-06",
    restaurantId: "rest-demo-1",
    roomId: "room-terrace",
    roomName: "Esplanada",
    tableNumber: "6",
    minCovers: 2,
    maxCovers: 6,
    status: "available",
    isActive: true,
  },
  {
    id: "t-07",
    restaurantId: "rest-demo-1",
    roomId: "room-bar",
    roomName: "Bar",
    tableNumber: "7",
    minCovers: 1,
    maxCovers: 2,
    status: "occupied",
    isActive: true,
  },
  {
    id: "t-08",
    restaurantId: "rest-demo-1",
    roomId: "room-bar",
    roomName: "Bar",
    tableNumber: "8",
    minCovers: 4,
    maxCovers: 8,
    status: "available",
    isActive: true,
  },
];

const schedules: RestSchedule[] = [
  { id: "sch-0-a", restaurantId: "rest-demo-1", dayOfWeek: 0, serviceLabel: "Almoco", openTime: "12:00", closeTime: "15:00", isActive: true },
  { id: "sch-0-b", restaurantId: "rest-demo-1", dayOfWeek: 0, serviceLabel: "Jantar", openTime: "19:00", closeTime: "23:00", isActive: true },
  { id: "sch-1-a", restaurantId: "rest-demo-1", dayOfWeek: 1, serviceLabel: "Almoco", openTime: "12:00", closeTime: "15:00", isActive: true },
  { id: "sch-1-b", restaurantId: "rest-demo-1", dayOfWeek: 1, serviceLabel: "Jantar", openTime: "19:00", closeTime: "23:00", isActive: true },
  { id: "sch-2-a", restaurantId: "rest-demo-1", dayOfWeek: 2, serviceLabel: "Almoco", openTime: "12:00", closeTime: "15:00", isActive: true },
  { id: "sch-2-b", restaurantId: "rest-demo-1", dayOfWeek: 2, serviceLabel: "Jantar", openTime: "19:00", closeTime: "23:00", isActive: true },
  { id: "sch-3-a", restaurantId: "rest-demo-1", dayOfWeek: 3, serviceLabel: "Almoco", openTime: "12:00", closeTime: "15:00", isActive: true },
  { id: "sch-3-b", restaurantId: "rest-demo-1", dayOfWeek: 3, serviceLabel: "Jantar", openTime: "19:00", closeTime: "23:00", isActive: true },
  { id: "sch-4-a", restaurantId: "rest-demo-1", dayOfWeek: 4, serviceLabel: "Almoco", openTime: "12:00", closeTime: "15:00", isActive: true },
  { id: "sch-4-b", restaurantId: "rest-demo-1", dayOfWeek: 4, serviceLabel: "Jantar", openTime: "19:00", closeTime: "23:00", isActive: true },
  { id: "sch-5-a", restaurantId: "rest-demo-1", dayOfWeek: 5, serviceLabel: "Almoco", openTime: "12:00", closeTime: "16:00", isActive: true },
  { id: "sch-5-b", restaurantId: "rest-demo-1", dayOfWeek: 5, serviceLabel: "Jantar", openTime: "19:00", closeTime: "23:30", isActive: true },
  { id: "sch-6-a", restaurantId: "rest-demo-1", dayOfWeek: 6, serviceLabel: "Almoco", openTime: "12:00", closeTime: "16:00", isActive: true },
  { id: "sch-6-b", restaurantId: "rest-demo-1", dayOfWeek: 6, serviceLabel: "Jantar", openTime: "19:00", closeTime: "23:30", isActive: true },
];

const scheduleBlocks: RestScheduleBlock[] = [
  {
    id: "blk-maintenance",
    restaurantId: "rest-demo-1",
    blockedDate: today,
    blockedFrom: "16:00",
    blockedTo: "17:00",
    reason: "Troca de turno",
  },
];

const reservationsSeed: RestReservation[] = [
  {
    id: "res-001",
    restaurantId: "rest-demo-1",
    guestName: "Marta Silva",
    guestPhone: "+351910000001",
    guestEmail: "marta@example.com",
    tableId: "t-03",
    partySize: 4,
    reservationDate: tomorrow,
    reservationTime: "12:30",
    durationMinutes: 90,
    status: "confirmed",
    source: "widget",
    confirmationToken: "tok-res-001",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    depositRequired: false,
    depositAmountCents: 0,
  },
  {
    id: "res-002",
    restaurantId: "rest-demo-1",
    guestName: "Rui Andrade",
    guestPhone: "+351910000002",
    guestEmail: "rui@example.com",
    tableId: "t-05",
    partySize: 5,
    reservationDate: tomorrow,
    reservationTime: "20:00",
    durationMinutes: 90,
    status: "pending",
    source: "phone",
    confirmationToken: "tok-res-002",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    depositRequired: false,
    depositAmountCents: 0,
  },
];

const waitlistSeed: RestWaitlistEntry[] = [
  {
    id: "wl-001",
    restaurantId: "rest-demo-1",
    guestName: "Tiago Neves",
    guestPhone: "+351910000010",
    partySize: 2,
    requestedDate: tomorrow,
    requestedTimeFrom: "21:30",
    createdAt: new Date().toISOString(),
  },
];

const reservationStore: RestReservation[] = [...reservationsSeed];
const waitlistStore: RestWaitlistEntry[] = [...waitlistSeed];

export function listRestaurants(): RestRestaurant[] {
  return restaurants;
}

export function getRestaurantBySlug(slug: string): RestRestaurant | undefined {
  return restaurants.find((restaurant) => restaurant.slug === slug);
}

export function getRestaurantById(id: string): RestRestaurant | undefined {
  return restaurants.find((restaurant) => restaurant.id === id);
}

export function listRestaurantTables(restaurantId: string): RestTable[] {
  return tables.filter((table) => table.restaurantId === restaurantId && table.isActive);
}

export function listRestaurantSchedules(restaurantId: string, dayOfWeek: number): RestSchedule[] {
  return schedules.filter(
    (schedule) =>
      schedule.restaurantId === restaurantId &&
      schedule.dayOfWeek === dayOfWeek &&
      schedule.isActive,
  );
}

export function listScheduleBlocks(restaurantId: string, date: string): RestScheduleBlock[] {
  return scheduleBlocks.filter(
    (block) => block.restaurantId === restaurantId && block.blockedDate === date,
  );
}

export function listReservations(restaurantId: string, date?: string): RestReservation[] {
  return reservationStore.filter((reservation) => {
    if (reservation.restaurantId !== restaurantId) return false;
    if (date && reservation.reservationDate !== date) return false;
    return true;
  });
}

export function getReservationById(id: string): RestReservation | undefined {
  return reservationStore.find((reservation) => reservation.id === id);
}

export function getReservationByToken(token: string): RestReservation | undefined {
  return reservationStore.find((reservation) => reservation.confirmationToken === token);
}

export function createReservation(
  reservation: Omit<RestReservation, "id" | "createdAt" | "updatedAt">,
): RestReservation {
  const entry: RestReservation = {
    ...reservation,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  reservationStore.push(entry);
  return entry;
}

export function updateReservation(
  id: string,
  changes: Partial<Omit<RestReservation, "id" | "createdAt" | "restaurantId">>,
): RestReservation | undefined {
  const index = reservationStore.findIndex((reservation) => reservation.id === id);
  if (index < 0) return undefined;

  reservationStore[index] = {
    ...reservationStore[index],
    ...changes,
    updatedAt: new Date().toISOString(),
  };

  return reservationStore[index];
}

export function createWaitlistEntry(data: CreateWaitlistInput): RestWaitlistEntry {
  const entry: RestWaitlistEntry = {
    id: crypto.randomUUID(),
    restaurantId: data.restaurantId,
    guestName: data.guestName,
    guestPhone: data.guestPhone,
    guestEmail: data.guestEmail,
    partySize: data.partySize,
    requestedDate: data.requestedDate,
    requestedTimeFrom: data.requestedTimeFrom,
    createdAt: new Date().toISOString(),
  };

  waitlistStore.push(entry);
  return entry;
}

export function listWaitlist(restaurantId: string, date?: string): RestWaitlistEntry[] {
  return waitlistStore.filter((entry) => {
    if (entry.restaurantId !== restaurantId) return false;
    if (date && entry.requestedDate !== date) return false;
    return true;
  });
}
