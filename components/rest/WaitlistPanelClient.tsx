"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/config/supabase";
import type { RestReservation, RestWaitlistEntry } from "@/lib/rest/types";

type ConvertWaitlistPayload = {
  reservation?: RestReservation;
  waitlistEntry?: RestWaitlistEntry;
  error?: string;
};

type WaitlistApiPayload = {
  waitlist?: RestWaitlistEntry[];
};

async function readErrorResponse(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as ConvertWaitlistPayload;
    if (payload.error) return payload.error;
  } catch {
    // ignore parse errors and fallback to status
  }

  return `Falha na operacao (${response.status}).`;
}

export function WaitlistPanelClient(props: {
  restaurantId: string;
  initialEntries: RestWaitlistEntry[];
}) {
  const [entries, setEntries] = useState<RestWaitlistEntry[]>(props.initialEntries);
  const [convertingState, setConvertingState] = useState<{
    entryId: string;
    mode: "convert" | "confirm";
  } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshEntries = useCallback(async () => {
    try {
      const response = await fetch(
        `/rest/api/waitlist?restaurantId=${encodeURIComponent(props.restaurantId)}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(await readErrorResponse(response));
      }

      const payload = (await response.json()) as WaitlistApiPayload;
      setEntries(payload.waitlist ?? []);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Falha ao atualizar waitlist.",
      );
    }
  }, [props.restaurantId]);

  useEffect(() => {
    const initialSync = window.setTimeout(() => {
      void refreshEntries();
    }, 0);

    const channel = supabase
      .channel(`rest-dashboard-${props.restaurantId}`)
      .on(
        "broadcast",
        { event: "waitlist_changed" },
        () => {
          void refreshEntries();
        },
      )
      .subscribe();

    return () => {
      window.clearTimeout(initialSync);
      void supabase.removeChannel(channel);
    };
  }, [props.restaurantId, refreshEntries]);

  const sortedEntries = useMemo(
    () =>
      [...entries].sort((left, right) => {
        const leftKey = `${left.requestedDate}T${left.requestedTimeFrom ?? "00:00"}`;
        const rightKey = `${right.requestedDate}T${right.requestedTimeFrom ?? "00:00"}`;
        return leftKey.localeCompare(rightKey);
      }),
    [entries],
  );

  const convertEntry = async (entryId: string, forceConfirmed: boolean) => {
    setConvertingState({
      entryId,
      mode: forceConfirmed ? "confirm" : "convert",
    });
    setErrorMessage(null);
    setMessage(null);

    try {
      const response = await fetch(`/rest/api/waitlist/${entryId}/convert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          forceConfirmed,
        }),
      });

      if (!response.ok) {
        throw new Error(await readErrorResponse(response));
      }

      const payload = (await response.json()) as ConvertWaitlistPayload;
      if (!payload.reservation) {
        throw new Error("Resposta invalida ao converter waitlist.");
      }

      setEntries((current) => current.filter((entry) => entry.id !== entryId));
      const baseMessage = `Reserva criada para ${payload.reservation.guestName} às ${payload.reservation.reservationTime}.`;

      setMessage(
        forceConfirmed
          ? `${baseMessage} Status confirmado.`
          : baseMessage,
      );

      window.dispatchEvent(
        new CustomEvent("rest:reservation-created", {
          detail: {
            reservationId: payload.reservation.id,
          },
        }),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Falha ao converter item da waitlist.",
      );
    } finally {
      setConvertingState(null);
    }
  };

  return (
    <div className="space-y-3">
      {message ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-950/20 dark:text-emerald-200">
          {message}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-700 dark:border-rose-400/20 dark:bg-rose-950/20 dark:text-rose-200">
          {errorMessage}
        </p>
      ) : null}

      {sortedEntries.length === 0 ? (
        <p className="rounded-xl border border-dashed border-black/20 bg-white/60 p-6 text-sm text-slate-600 dark:border-white/20 dark:bg-white/5 dark:text-slate-300">
          Sem entradas na waitlist.
        </p>
      ) : (
        sortedEntries.map((entry) => (
          <article
            key={entry.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/10 bg-white/80 p-4 dark:border-white/10 dark:bg-black/10"
          >
            <div>
              <p className="font-semibold">{entry.guestName}</p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {entry.requestedDate}
                {entry.requestedTimeFrom ? ` • a partir de ${entry.requestedTimeFrom}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full border border-black/10 px-3 py-1 dark:border-white/10">
                {entry.partySize} pessoas
              </span>
              <span className="rounded-full border border-black/10 px-3 py-1 dark:border-white/10">
                {entry.guestPhone}
              </span>
              <button
                type="button"
                onClick={() => {
                  void convertEntry(entry.id, false);
                }}
                disabled={convertingState?.entryId === entry.id}
                className="rounded-full border border-black/15 px-3 py-1 text-xs font-semibold transition enabled:hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/20 dark:enabled:hover:bg-white/10"
              >
                {convertingState?.entryId === entry.id && convertingState.mode === "convert"
                  ? "Convertendo..."
                  : "Converter"}
              </button>
              <button
                type="button"
                onClick={() => {
                  void convertEntry(entry.id, true);
                }}
                disabled={convertingState?.entryId === entry.id}
                className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition enabled:hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-emerald-400/40 dark:bg-emerald-950/20 dark:text-emerald-200 dark:enabled:hover:bg-emerald-900/30"
              >
                {convertingState?.entryId === entry.id && convertingState.mode === "confirm"
                  ? "Confirmando..."
                  : "Converter e Confirmar"}
              </button>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
