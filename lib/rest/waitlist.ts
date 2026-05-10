import { getAvailableSlots } from "@/lib/rest/availability";
import {
  getWaitlistEntryById,
  updateReservation,
  updateWaitlistEntry,
} from "@/lib/rest/repository";
import { createReservationWithRules } from "@/lib/rest/reservations";
import type { RestReservation, RestWaitlistEntry, SlotAvailability } from "@/lib/rest/types";

export type ConvertWaitlistErrorCode =
  | "WAITLIST_NOT_FOUND"
  | "WAITLIST_ALREADY_CONVERTED"
  | "NO_AVAILABLE_SLOT"
  | "CONVERT_FAILED";

export type ConvertWaitlistResult =
  | {
      ok: true;
      reservation: RestReservation;
      waitlistEntry: RestWaitlistEntry;
    }
  | {
      ok: false;
      code: ConvertWaitlistErrorCode;
      message: string;
    };

function normalizeTime(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  return raw.slice(0, 5);
}

function prioritizeSlots(
  slots: SlotAvailability[],
  preferredTime: string | undefined,
): SlotAvailability[] {
  const available = slots.filter((slot) => slot.isAvailable);
  if (!preferredTime) return available;

  const afterPreferred = available.filter((slot) => slot.time >= preferredTime);
  if (afterPreferred.length > 0) return afterPreferred;

  return available;
}

export async function convertWaitlistEntryToReservation(
  waitlistEntryId: string,
  options?: {
    forceConfirmed?: boolean;
  },
): Promise<ConvertWaitlistResult> {
  const waitlistEntry = await getWaitlistEntryById(waitlistEntryId);

  if (!waitlistEntry) {
    return {
      ok: false,
      code: "WAITLIST_NOT_FOUND",
      message: "Waitlist entry not found.",
    };
  }

  if (waitlistEntry.convertedToReservationId) {
    return {
      ok: false,
      code: "WAITLIST_ALREADY_CONVERTED",
      message: "Waitlist entry was already converted.",
    };
  }

  const preferredTime = normalizeTime(waitlistEntry.requestedTimeFrom);
  const slots = await getAvailableSlots({
    restaurantId: waitlistEntry.restaurantId,
    date: waitlistEntry.requestedDate,
    partySize: waitlistEntry.partySize,
  });

  const candidateSlots = prioritizeSlots(slots, preferredTime);
  if (candidateSlots.length === 0) {
    return {
      ok: false,
      code: "NO_AVAILABLE_SLOT",
      message: "No available slot to convert this waitlist entry.",
    };
  }

  for (const slot of candidateSlots) {
    const created = await createReservationWithRules({
      restaurantId: waitlistEntry.restaurantId,
      guestName: waitlistEntry.guestName,
      guestPhone: waitlistEntry.guestPhone,
      guestEmail: waitlistEntry.guestEmail,
      partySize: waitlistEntry.partySize,
      reservationDate: waitlistEntry.requestedDate,
      reservationTime: slot.time,
      source: "phone",
      notes: "Converted from waitlist",
    });

    if (!created.ok) {
      if (created.code === "SLOT_CONFLICT") {
        continue;
      }

      return {
        ok: false,
        code: "CONVERT_FAILED",
        message: created.message,
      };
    }

    let reservation = created.reservation;

    if (options?.forceConfirmed && reservation.status !== "confirmed") {
      const confirmedReservation = await updateReservation(reservation.id, {
        status: "confirmed",
      });

      if (!confirmedReservation) {
        return {
          ok: false,
          code: "CONVERT_FAILED",
          message: "Reservation was created but could not be confirmed.",
        };
      }

      reservation = confirmedReservation;
    }

    const updatedWaitlist = await updateWaitlistEntry(waitlistEntry.id, {
      convertedToReservationId: reservation.id,
      notifiedAt: new Date().toISOString(),
    });

    return {
      ok: true,
      reservation,
      waitlistEntry: updatedWaitlist ?? {
        ...waitlistEntry,
        convertedToReservationId: reservation.id,
        notifiedAt: new Date().toISOString(),
      },
    };
  }

  return {
    ok: false,
    code: "NO_AVAILABLE_SLOT",
    message: "No available slot to convert this waitlist entry.",
  };
}
