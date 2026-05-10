import {
  getRestaurantByIdentifier,
  listReservations,
  listRestaurantSchedules,
  listRestaurantTables,
  listScheduleBlocks,
} from "@/lib/rest/repository";
import type { RestReservation, SlotAvailability } from "@/lib/rest/types";

function parseDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`);
}

function addMinutes(value: Date, minutes: number): Date {
  return new Date(value.getTime() + minutes * 60 * 1000);
}

function formatHour(date: Date): string {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function overlaps(slotStart: Date, slotEnd: Date, reservation: RestReservation): boolean {
  const reservationStart = parseDateTime(reservation.reservationDate, reservation.reservationTime);
  const reservationEnd = addMinutes(reservationStart, reservation.durationMinutes);
  return reservationStart < slotEnd && reservationEnd > slotStart;
}

export function isReservationInAdvanceWindow(params: {
  date: string;
  time: string;
  minAdvanceHours: number;
  maxAdvanceDays: number;
}): boolean {
  const now = new Date();
  const target = parseDateTime(params.date, params.time);
  const diffMs = target.getTime() - now.getTime();
  const minMs = params.minAdvanceHours * 60 * 60 * 1000;
  const maxMs = params.maxAdvanceDays * 24 * 60 * 60 * 1000;

  return diffMs >= minMs && diffMs <= maxMs;
}

export async function getAvailableSlots(params: {
  restaurantId: string;
  date: string;
  partySize: number;
}): Promise<SlotAvailability[]> {
  const { restaurantId, date, partySize } = params;

  const restaurant = await getRestaurantByIdentifier(restaurantId);
  if (!restaurant) return [];

  if (partySize > restaurant.maxPartySize) return [];

  const blocks = await listScheduleBlocks(restaurant.id, date);
  const wholeDayBlocked = blocks.some((block) => !block.blockedFrom && !block.blockedTo);
  if (wholeDayBlocked) return [];

  const dayOfWeek = new Date(`${date}T00:00:00`).getDay();
  const schedules = await listRestaurantSchedules(restaurant.id, dayOfWeek);
  if (!schedules.length) return [];

  const activeReservations = (await listReservations(restaurant.id, date)).filter(
    (reservation) => ["pending", "confirmed", "seated"].includes(reservation.status),
  );

  const eligibleTables = (await listRestaurantTables(restaurant.id)).filter(
    (table) => table.minCovers <= partySize && table.maxCovers >= partySize,
  );

  const slots: SlotAvailability[] = [];

  for (const schedule of schedules) {
    const start = parseDateTime(date, schedule.openTime);
    const end = parseDateTime(date, schedule.closeTime);

    let current = new Date(start);
    while (current < end) {
      const slotEnd = addMinutes(current, restaurant.slotDurationMinutes);
      const occupiedTableIds = new Set(
        activeReservations
          .filter((reservation) => overlaps(current, slotEnd, reservation))
          .map((reservation) => reservation.tableId),
      );

      const availableTables = eligibleTables.filter((table) => !occupiedTableIds.has(table.id));
      const availableCovers = availableTables.reduce((sum, table) => sum + table.maxCovers, 0);

      slots.push({
        time: formatHour(current),
        availableTables: availableTables.length,
        availableCovers,
        isAvailable: availableTables.length > 0 && availableCovers >= partySize,
      });

      current = addMinutes(current, 30);
    }
  }

  return slots;
}

export function findAvailableTable(params: {
  restaurantId: string;
  date: string;
  time: string;
  partySize: number;
  durationMinutes: number;
}): Promise<string | null> {
  return findAvailableTableImpl(params);
}

async function findAvailableTableImpl(params: {
  restaurantId: string;
  date: string;
  time: string;
  partySize: number;
  durationMinutes: number;
}): Promise<string | null> {
  const tables = (await listRestaurantTables(params.restaurantId)).filter(
    (table) => table.minCovers <= params.partySize && table.maxCovers >= params.partySize,
  );

  const reservations = (await listReservations(params.restaurantId, params.date)).filter(
    (reservation) => ["pending", "confirmed", "seated"].includes(reservation.status),
  );

  const slotStart = parseDateTime(params.date, params.time);
  const slotEnd = addMinutes(slotStart, params.durationMinutes);

  for (const table of tables) {
    const hasConflict = reservations.some((reservation) => {
      if (reservation.tableId !== table.id) return false;
      return overlaps(slotStart, slotEnd, reservation);
    });

    if (!hasConflict) {
      return table.id;
    }
  }

  return null;
}
