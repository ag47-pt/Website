"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { supabase } from "@/config/supabase";
import type { RestReservation, RestReservationStatus } from "@/lib/rest/types";

type ReservationsApiPayload = {
  reservations?: RestReservation[];
};

type ReservationPatchPayload = {
  reservation?: RestReservation;
  error?: string;
};

function buildSlotTimes(startHour: number, endHour: number): string[] {
  const slots: string[] = [];

  for (let hour = startHour; hour <= endHour; hour += 1) {
    for (const minute of [0, 30]) {
      if (hour === endHour && minute > 0) continue;
      const hh = String(hour).padStart(2, "0");
      const mm = String(minute).padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }
  }

  return slots;
}

const dragSlotTimes = buildSlotTimes(12, 23);

const quickActions: Array<{ status: RestReservationStatus; label: string }> = [
  { status: "confirmed", label: "Confirmar" },
  { status: "seated", label: "Sentar" },
  { status: "completed", label: "Completar" },
  { status: "no_show", label: "No-show" },
  { status: "cancelled", label: "Cancelar" },
];

const statusTone: Record<RestReservationStatus, string> = {
  pending: "bg-amber-100 text-amber-900",
  confirmed: "bg-sky-100 text-sky-900",
  seated: "bg-emerald-100 text-emerald-900",
  completed: "bg-zinc-200 text-zinc-900",
  cancelled: "bg-zinc-100 text-zinc-700",
  no_show: "bg-rose-100 text-rose-900",
};

function sortReservations(items: RestReservation[]): RestReservation[] {
  return [...items].sort((left, right) => {
    const leftKey = `${left.reservationDate}T${left.reservationTime}`;
    const rightKey = `${right.reservationDate}T${right.reservationTime}`;
    return leftKey.localeCompare(rightKey);
  });
}

function formatSyncTime(isoDate: string | null): string {
  if (!isoDate) return "--:--:--";
  const value = new Date(isoDate);
  if (Number.isNaN(value.getTime())) return "--:--:--";
  return value.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

async function readErrorResponse(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { error?: string };
    if (payload.error) return payload.error;
  } catch {
    // ignore JSON parse errors and use status fallback
  }

  return `Falha na operacao (${response.status}).`;
}

export function ReservationsTimelineClient(props: {
  restaurantId: string;
  initialReservations: RestReservation[];
  tableNumberById: Record<string, string>;
}) {
  const [reservations, setReservations] = useState<RestReservation[]>(() =>
    sortReservations(props.initialReservations),
  );
  const [activeReservationId, setActiveReservationId] = useState<string | null>(
    props.initialReservations[0]?.id ?? null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    props.initialReservations[0]?.reservationDate ?? new Date().toISOString().slice(0, 10),
  );
  const [draggingReservationId, setDraggingReservationId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<"connecting" | "online" | "error">(
    "connecting",
  );
  const [isPending, startTransition] = useTransition();

  const tableColumns = useMemo(
    () =>
      Object.entries(props.tableNumberById)
        .map(([id, tableNumber]) => ({ id, tableNumber }))
        .sort((left, right) => left.tableNumber.localeCompare(right.tableNumber)),
    [props.tableNumberById],
  );

  const dateOptions = useMemo(
    () =>
      [...new Set(reservations.map((reservation) => reservation.reservationDate))].sort((left, right) =>
        left.localeCompare(right),
      ),
    [reservations],
  );

  const activeDate = useMemo(() => {
    if (dateOptions.length === 0) return selectedDate;
    if (dateOptions.includes(selectedDate)) return selectedDate;
    return dateOptions[0];
  }, [dateOptions, selectedDate]);

  const dragDateOptions = useMemo(() => {
    const merged = [...dateOptions];

    if (selectedDate && !merged.includes(selectedDate)) {
      merged.push(selectedDate);
    }

    return merged.sort((left, right) => left.localeCompare(right));
  }, [dateOptions, selectedDate]);

  const dateReservations = useMemo(
    () =>
      reservations.filter((reservation) => reservation.reservationDate === activeDate),
    [activeDate, reservations],
  );

  const activeIndex = useMemo(() => {
    if (!activeReservationId) return -1;
    return reservations.findIndex((reservation) => reservation.id === activeReservationId);
  }, [activeReservationId, reservations]);

  const refreshReservations = useCallback(async () => {
    try {
      const response = await fetch(
        `/rest/api/reservas?restaurantId=${encodeURIComponent(props.restaurantId)}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(await readErrorResponse(response));
      }

      const payload = (await response.json()) as ReservationsApiPayload;
      const nextReservations = sortReservations(payload.reservations ?? []);

      setReservations(nextReservations);
      setActiveReservationId((current) => {
        if (current && nextReservations.some((reservation) => reservation.id === current)) {
          return current;
        }

        return nextReservations[0]?.id ?? null;
      });
      setLastSyncAt(new Date().toISOString());
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Falha ao atualizar lista de reservas.",
      );
    }
  }, [props.restaurantId]);

  const updateReservationStatus = useCallback(
    (reservationId: string, nextStatus: RestReservationStatus) => {
      const previous = reservations.find((reservation) => reservation.id === reservationId);
      if (!previous || previous.status === nextStatus) return;

      setReservations((current) =>
        sortReservations(
          current.map((reservation) =>
            reservation.id === reservationId
              ? {
                  ...reservation,
                  status: nextStatus,
                }
              : reservation,
          ),
        ),
      );

      startTransition(() => {
        void (async () => {
          try {
            const response = await fetch(`/rest/api/reservas/${reservationId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: nextStatus }),
            });

            if (!response.ok) {
              throw new Error(await readErrorResponse(response));
            }

            const payload = (await response.json()) as ReservationPatchPayload;
            if (!payload.reservation) {
              throw new Error("Resposta invalida ao atualizar reserva.");
            }

            setReservations((current) =>
              sortReservations(
                current.map((reservation) =>
                  reservation.id === reservationId ? payload.reservation! : reservation,
                ),
              ),
            );
            setLastSyncAt(new Date().toISOString());
            setErrorMessage(null);
          } catch (error) {
            setReservations((current) =>
              sortReservations(
                current.map((reservation) =>
                  reservation.id === reservationId ? previous : reservation,
                ),
              ),
            );
            setErrorMessage(
              error instanceof Error
                ? error.message
                : "Falha ao atualizar status da reserva.",
            );
          }
        })();
      });
    },
    [reservations],
  );

  const moveReservationToSlot = useCallback(
    (
      reservationId: string,
      tableId: string,
      reservationDate: string,
      reservationTime: string,
    ) => {
      const previous = reservations.find((reservation) => reservation.id === reservationId);
      if (!previous) return;

      const unchanged =
        previous.tableId === tableId &&
        previous.reservationDate === reservationDate &&
        previous.reservationTime === reservationTime;
      if (unchanged) return;

      setReservations((current) =>
        sortReservations(
          current.map((reservation) =>
            reservation.id === reservationId
              ? {
                  ...reservation,
                  tableId,
                  reservationDate,
                  reservationTime,
                }
              : reservation,
          ),
        ),
      );

      startTransition(() => {
        void (async () => {
          try {
            const response = await fetch(`/rest/api/reservas/${reservationId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                tableId,
                reservationDate,
                reservationTime,
              }),
            });

            if (!response.ok) {
              throw new Error(await readErrorResponse(response));
            }

            const payload = (await response.json()) as ReservationPatchPayload;
            if (!payload.reservation) {
              throw new Error("Resposta invalida ao mover reserva.");
            }

            setReservations((current) =>
              sortReservations(
                current.map((reservation) =>
                  reservation.id === reservationId ? payload.reservation! : reservation,
                ),
              ),
            );
            setLastSyncAt(new Date().toISOString());
            setErrorMessage(null);
          } catch (error) {
            setReservations((current) =>
              sortReservations(
                current.map((reservation) =>
                  reservation.id === reservationId ? previous : reservation,
                ),
              ),
            );
            setErrorMessage(
              error instanceof Error ? error.message : "Falha ao mover reserva.",
            );
          }
        })();
      });
    },
    [reservations],
  );

  useEffect(() => {
    const initialSync = window.setTimeout(() => {
      void refreshReservations();
    }, 0);

    const onReservationCreated = () => {
      void refreshReservations();
    };

    const channel = supabase
      .channel(`rest-dashboard-${props.restaurantId}`)
      .on(
        "broadcast",
        { event: "reservation_changed" },
        () => {
          void refreshReservations();
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setRealtimeStatus("online");
          return;
        }

        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setRealtimeStatus("error");
          setErrorMessage("Realtime indisponivel. Use Atualizar para sincronizar.");
          return;
        }

        if (status === "CLOSED") {
          setRealtimeStatus("connecting");
        }
      });

    window.addEventListener("rest:reservation-created", onReservationCreated);

    return () => {
      window.clearTimeout(initialSync);
      window.removeEventListener("rest:reservation-created", onReservationCreated);
      void supabase.removeChannel(channel);
    };
  }, [props.restaurantId, refreshReservations]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();
      const isTypingTarget =
        tagName === "input" ||
        tagName === "textarea" ||
        target?.getAttribute("contenteditable") === "true";

      if (isTypingTarget || reservations.length === 0) return;

      const key = event.key.toLowerCase();

      if (key === "k") {
        event.preventDefault();
        setActiveReservationId((current) => {
          const currentIndex = reservations.findIndex(
            (reservation) => reservation.id === current,
          );
          const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % reservations.length;
          return reservations[nextIndex]?.id ?? null;
        });
        return;
      }

      if (!activeReservationId) return;

      if (key === "c") {
        event.preventDefault();
        updateReservationStatus(activeReservationId, "confirmed");
        return;
      }

      if (key === "s") {
        event.preventDefault();
        updateReservationStatus(activeReservationId, "seated");
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeReservationId, reservations, updateReservationStatus]);

  if (reservations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-black/20 bg-white/60 p-6 text-sm text-slate-600 dark:border-white/20 dark:bg-white/5 dark:text-slate-300">
        Sem reservas para exibir.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-black/10 bg-white/60 px-4 py-3 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
        <p>
          Atalhos: <span className="font-semibold">K</span> proxima reserva,
          <span className="font-semibold"> C</span> confirmar,
          <span className="font-semibold"> S</span> sentar.
        </p>
        <div className="flex items-center gap-3">
          {dateOptions.length > 0 ? (
            <select
              value={activeDate}
              onChange={(event) => {
                setSelectedDate(event.target.value);
              }}
              className="rounded-full border border-black/20 bg-transparent px-3 py-1 text-xs font-semibold dark:border-white/20"
            >
              {dateOptions.map((date) => (
                <option key={date} value={date} className="text-black">
                  {date}
                </option>
              ))}
            </select>
          ) : null}
          <span
            className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
              realtimeStatus === "online"
                ? "bg-emerald-100 text-emerald-800"
                : realtimeStatus === "error"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-amber-100 text-amber-800"
            }`}
          >
            Realtime {realtimeStatus}
          </span>
          <span>Sync: {formatSyncTime(lastSyncAt)}</span>
          <button
            type="button"
            onClick={() => {
              void refreshReservations();
            }}
            className="rounded-full border border-black/20 px-3 py-1 font-semibold transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            Atualizar
          </button>
        </div>
      </div>

      {errorMessage ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-700 dark:border-rose-400/20 dark:bg-rose-950/20 dark:text-rose-200">
          {errorMessage}
        </p>
      ) : null}

      <section className="space-y-2 rounded-xl border border-black/10 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
          Drag and Drop por Data/Mesa/Horario
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-300">
          Arraste uma reserva para qualquer data visivel, mesa e horario.
        </p>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-top">
            <div className="space-y-4">
              {dragDateOptions.map((dragDate) => (
                <div key={`drag-date-${dragDate}`} className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                    Data {dragDate}
                    {dragDate === activeDate ? " • selecionada" : ""}
                  </p>
                  <div className="grid min-w-[920px] grid-cols-[88px_repeat(auto-fit,minmax(140px,1fr))] gap-2">
                    <div className="rounded-lg border border-black/10 bg-white/60 px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-black/10 dark:text-slate-300">
                      Hora
                    </div>
                    {tableColumns.map((table) => (
                      <div
                        key={`${dragDate}-header-${table.id}`}
                        className="rounded-lg border border-black/10 bg-white/60 px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-black/10 dark:text-slate-300"
                      >
                        Mesa {table.tableNumber}
                      </div>
                    ))}

                    {dragSlotTimes.map((slotTime) => (
                      <div key={`${dragDate}-slot-row-${slotTime}`} className="contents">
                        <div
                          key={`${dragDate}-time-${slotTime}`}
                          className="rounded-lg border border-black/10 bg-white/40 px-2 py-2 text-center text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-black/10 dark:text-slate-300"
                        >
                          {slotTime}
                        </div>
                        {tableColumns.map((table) => {
                          const cellReservations = reservations.filter(
                            (reservation) =>
                              reservation.reservationDate === dragDate &&
                              reservation.tableId === table.id &&
                              reservation.reservationTime === slotTime,
                          );

                          const cellId = `${dragDate}|${table.id}|${slotTime}`;
                          const isDropTarget = dropTarget === cellId;

                          return (
                            <div
                              key={`${dragDate}-${slotTime}-${table.id}`}
                              onDragOver={(event) => {
                                event.preventDefault();
                                if (dropTarget !== cellId) {
                                  setDropTarget(cellId);
                                }
                              }}
                              onDragLeave={() => {
                                if (dropTarget === cellId) {
                                  setDropTarget(null);
                                }
                              }}
                              onDrop={(event) => {
                                event.preventDefault();
                                const reservationId = event.dataTransfer.getData("text/plain");
                                setDropTarget(null);
                                setDraggingReservationId(null);
                                if (!reservationId) return;
                                moveReservationToSlot(reservationId, table.id, dragDate, slotTime);
                              }}
                              className={`min-h-[56px] rounded-lg border p-2 transition ${
                                isDropTarget
                                  ? "border-sky-300 bg-sky-100/70 dark:border-sky-400/50 dark:bg-sky-900/30"
                                  : "border-black/10 bg-white/50 dark:border-white/10 dark:bg-black/10"
                              }`}
                            >
                              <div className="space-y-1">
                                {cellReservations.map((reservation) => (
                                  <button
                                    key={reservation.id}
                                    type="button"
                                    draggable
                                    onDragStart={(event) => {
                                      event.dataTransfer.setData("text/plain", reservation.id);
                                      event.dataTransfer.effectAllowed = "move";
                                      setDraggingReservationId(reservation.id);
                                    }}
                                    onDragEnd={() => {
                                      setDraggingReservationId(null);
                                      setDropTarget(null);
                                    }}
                                    onClick={() => {
                                      setActiveReservationId(reservation.id);
                                    }}
                                    className={`w-full rounded-md border px-2 py-1 text-left text-[11px] font-semibold transition ${
                                      draggingReservationId === reservation.id
                                        ? "border-sky-300 bg-sky-100/80 text-sky-900 dark:border-sky-400/50 dark:bg-sky-900/40 dark:text-sky-100"
                                        : "border-black/10 bg-white text-slate-700 hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
                                    }`}
                                  >
                                    {reservation.guestName}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-3">
        {reservations.map((reservation, index) => {
          const isActive = reservation.id === activeReservationId;
          const tableLabel =
            props.tableNumberById[reservation.tableId] ?? reservation.tableId.slice(0, 8);

          return (
            <div
              key={reservation.id}
              className={`space-y-3 rounded-xl border p-4 transition ${
                isActive
                  ? "border-sky-300 bg-sky-50/60 ring-2 ring-sky-200 dark:border-sky-400/50 dark:bg-sky-950/20 dark:ring-sky-500/30"
                  : "border-black/10 bg-white/80 dark:border-white/10 dark:bg-black/10"
              }`}
              onClick={() => {
                setActiveReservationId(reservation.id);
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    #{index + 1} {reservation.guestName}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {reservation.reservationDate} • {reservation.reservationTime} • {reservation.partySize} pessoas
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusTone[reservation.status]}`}
                  >
                    {reservation.status}
                  </span>
                  <span className="rounded-full border border-black/10 px-3 py-1 text-xs dark:border-white/10">
                    Mesa {tableLabel}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.status}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      updateReservationStatus(reservation.id, action.status);
                    }}
                    disabled={isPending || reservation.status === action.status}
                    className="rounded-full border border-black/15 px-3 py-1 text-xs font-semibold transition enabled:hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/20 dark:enabled:hover:bg-white/10"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {activeIndex >= 0 ? (
        <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          Reserva ativa: #{activeIndex + 1}
        </p>
      ) : null}
    </div>
  );
}
