import Link from "next/link";
import {
  AlertTriangle,
  CalendarClock,
  ChartPie,
  Copy,
  Globe2,
  Hourglass,
  UserX,
  Users,
} from "lucide-react";
import {
  RestDashCard,
  restGhostButtonClass,
  restPrimaryButtonClass,
} from "@/components/rest/dashboard-primitives";

type DashboardMetrics = {
  reservationsToday: number;
  totalGuests: number;
  occupancyPeak: number;
  noShowCount: number;
  nextHourReservations: number;
  timeline: number[];
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function toneFromVolume(value: number): string {
  if (value >= 8) return "bg-rose-500/85";
  if (value >= 5) return "bg-amber-400/85";
  return "bg-lime-300/85";
}

export function RestControlPanel(props: {
  locale: string;
  widgetSlug: string;
  metrics: DashboardMetrics;
}) {
  const base = `/rest/${props.locale}`;
  const timelineHours = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <RestDashCard className="relative overflow-hidden p-5">
          <div className="absolute right-4 top-4 text-zinc-600/40">
            <Users className="h-12 w-12" />
          </div>
          <p className="text-sm text-zinc-400">Reservas Hoje</p>
          <p className="mt-1 text-3xl font-semibold text-white">{props.metrics.reservationsToday}</p>
          <p className="mt-2 text-xs text-zinc-500">{props.metrics.totalGuests} pessoas no total</p>
        </RestDashCard>

        <RestDashCard className="relative overflow-hidden p-5">
          <div className="absolute right-4 top-4 text-zinc-600/40">
            <ChartPie className="h-12 w-12" />
          </div>
          <p className="text-sm text-zinc-400">Ocupacao (Pico)</p>
          <p className="mt-1 text-3xl font-semibold text-white">{props.metrics.occupancyPeak}%</p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-lime-300"
              style={{ width: `${clamp(props.metrics.occupancyPeak, 0, 100)}%` }}
            />
          </div>
        </RestDashCard>

        <RestDashCard className="relative overflow-hidden p-5">
          <div className="absolute right-4 top-4 text-zinc-600/40">
            <UserX className="h-12 w-12" />
          </div>
          <p className="text-sm text-zinc-400">No-Shows</p>
          <p className="mt-1 text-3xl font-semibold text-white">{props.metrics.noShowCount}</p>
          <p className="mt-2 text-xs text-zinc-500">Mesas impactadas no periodo</p>
        </RestDashCard>

        <RestDashCard className="relative overflow-hidden p-5">
          <div className="absolute right-4 top-4 text-zinc-600/40">
            <Hourglass className="h-12 w-12" />
          </div>
          <p className="text-sm text-zinc-400">Proximas Reservas</p>
          <p className="mt-1 text-3xl font-semibold text-white">{props.metrics.nextHourReservations}</p>
          <p className="mt-2 text-xs text-zinc-500">na proxima hora</p>
        </RestDashCard>
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="space-y-8 xl:col-span-2">
          <RestDashCard className="p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-white">Timeline do Dia (Volume)</h2>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full border border-lime-300/30 bg-lime-300/10 px-3 py-1 font-semibold text-lime-300">Hoje</span>
                <span className="rounded-full border border-white/10 bg-zinc-800 px-3 py-1 font-semibold text-zinc-400">Amanha</span>
              </div>
            </div>

            <div className="grid h-[280px] grid-cols-12 items-end gap-2">
              {timelineHours.map((hour, index) => {
                const value = props.metrics.timeline[index] ?? 0;
                const barHeight = clamp(value * 14, 14, 240);

                return (
                  <div key={hour} className="flex flex-col items-center gap-2">
                    <div className="relative flex h-[240px] w-full items-end justify-center rounded-md bg-zinc-900/70">
                      <div
                        className={`w-full rounded-md transition ${toneFromVolume(value)}`}
                        style={{ height: `${barHeight}px` }}
                        title={`${hour} - ${value} reservas`}
                      />
                    </div>
                    <span className="text-[10px] text-zinc-500">{hour.slice(0, 2)}h</span>
                  </div>
                );
              })}
            </div>
          </RestDashCard>

          <RestDashCard className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Links e Integracoes</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-zinc-800/70 p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-xl border border-white/10 bg-zinc-900 p-2 text-zinc-300">
                    <Globe2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Pagina Publica</p>
                    <p className="text-xs text-zinc-500">Seu portal de reservas</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <input
                    readOnly
                    value={`ag47.pt/rest/widget/${props.widgetSlug}`}
                    className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-400"
                  />
                  <button type="button" className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-300 transition hover:bg-zinc-800">
                    Copiar
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-800/70 p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-xl border border-white/10 bg-zinc-900 p-2 text-zinc-300">
                    <Copy className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Widget para Site</p>
                    <p className="text-xs text-zinc-500">Incorpore no seu dominio</p>
                  </div>
                </div>
                <button type="button" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:bg-zinc-800">
                  <Copy className="h-3.5 w-3.5" />
                  Copiar codigo embed
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link href={`${base}/dashboard/reservas`} className={restPrimaryButtonClass}>
                Criar reserva
              </Link>
              <Link href={`${base}/dashboard/agenda`} className={restGhostButtonClass}>
                <CalendarClock className="h-4 w-4" />
                Bloquear horario
              </Link>
              <Link href={`${base}/dashboard/pagina-publica`} className={restGhostButtonClass}>
                Abrir pagina publica
              </Link>
            </div>
          </RestDashCard>
        </div>

        <RestDashCard className="flex h-[600px] flex-col p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Alertas</h2>
            <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-xs font-semibold text-rose-300">3</span>
          </div>

          <div className="rest-scrollbar flex-1 space-y-4 overflow-y-auto pr-1">
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-rose-400" />
                <div>
                  <p className="text-sm font-medium text-white">Conflito de Capacidade</p>
                  <p className="mt-1 text-xs text-zinc-300">As 20:00, reservas excedem a capacidade do salao principal em 4 lugares.</p>
                  <button type="button" className="mt-3 rounded-lg border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-100 transition hover:bg-zinc-800">
                    Remanejar
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-lime-300/30 bg-lime-300/10 p-4">
              <div className="flex items-start gap-3">
                <ChartPie className="mt-0.5 h-4 w-4 text-lime-300" />
                <div>
                  <p className="text-sm font-medium text-white">Chegada VIP em breve</p>
                  <p className="mt-1 text-xs text-zinc-300">Mesa 12 chega em 15 minutos. Cliente recorrente no top 5 deste mes.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-800/70 p-4">
              <div className="flex items-start gap-3">
                <Hourglass className="mt-0.5 h-4 w-4 text-amber-400" />
                <div>
                  <p className="text-sm font-medium text-white">Atraso Detectado</p>
                  <p className="mt-1 text-xs text-zinc-400">Mesa 04 esta com 20 minutos de atraso. Avaliar contato com o cliente.</p>
                </div>
              </div>
            </div>
          </div>
        </RestDashCard>
      </section>
    </div>
  );
}
