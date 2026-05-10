import {
  createReservation,
  getReservationByToken,
  getRestaurantByIdentifier,
  updateReservation,
} from "@/lib/rest/repository";
import { findAvailableTable, isReservationInAdvanceWindow } from "@/lib/rest/availability";
import type { CreateReservationInput, RestReservation } from "@/lib/rest/types";

export type ReservationCreateErrorCode =
  | "RESTAURANT_NOT_FOUND"
  | "INVALID_PARTY_SIZE"
  | "OUTSIDE_ADVANCE_WINDOW"
  | "SLOT_CONFLICT";

export type ReservationCreateResult =
  | { ok: true; reservation: RestReservation }
  | { ok: false; code: ReservationCreateErrorCode; message: string };

function normalizeSource(source: CreateReservationInput["source"]):
  | "widget"
  | "phone"
  | "walk-in"
  | "google" {
  return source ?? "widget";
}

export async function createReservationWithRules(
  input: CreateReservationInput,
): Promise<ReservationCreateResult> {
  const restaurant = await getRestaurantByIdentifier(input.restaurantId);
  if (!restaurant) {
    return {
      ok: false,
      code: "RESTAURANT_NOT_FOUND",
      message: "Restaurant not found.",
    };
  }

  if (input.partySize < 1 || input.partySize > restaurant.maxPartySize) {
    return {
      ok: false,
      code: "INVALID_PARTY_SIZE",
      message: "Party size outside restaurant limits.",
    };
  }

  const insideWindow = isReservationInAdvanceWindow({
    date: input.reservationDate,
    time: input.reservationTime,
    minAdvanceHours: restaurant.minAdvanceHours,
    maxAdvanceDays: restaurant.maxAdvanceDays,
  });

  if (!insideWindow) {
    return {
      ok: false,
      code: "OUTSIDE_ADVANCE_WINDOW",
      message: "Reservation is outside min/max advance window.",
    };
  }

  const chosenTableId = await findAvailableTable({
    restaurantId: restaurant.id,
    date: input.reservationDate,
    time: input.reservationTime,
    partySize: input.partySize,
    durationMinutes: restaurant.slotDurationMinutes,
  });

  if (!chosenTableId) {
    return {
      ok: false,
      code: "SLOT_CONFLICT",
      message: "No table available for this slot.",
    };
  }

  const reservation = await createReservation({
    restaurantId: restaurant.id,
    guestName: input.guestName,
    guestPhone: input.guestPhone,
    guestEmail: input.guestEmail,
    tableId: chosenTableId,
    partySize: input.partySize,
    reservationDate: input.reservationDate,
    reservationTime: input.reservationTime,
    durationMinutes: restaurant.slotDurationMinutes,
    status: restaurant.depositRequired ? "pending" : "confirmed",
    source: normalizeSource(input.source),
    notes: input.notes,
    confirmationToken: crypto.randomUUID(),
    depositRequired: restaurant.depositRequired,
    depositAmountCents: restaurant.depositAmountCents,
  });

  return {
    ok: true,
    reservation,
  };
}

export async function confirmReservationByToken(
  token: string,
): Promise<RestReservation | null> {
  const current = await getReservationByToken(token);
  if (!current) return null;

  const confirmed = await updateReservation(current.id, {
    status: "confirmed",
  });

  return confirmed ?? null;
}
