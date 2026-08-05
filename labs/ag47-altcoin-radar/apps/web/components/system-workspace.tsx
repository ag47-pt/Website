"use client";

import {
  Clock3,
  Database,
  FileClock,
  LockKeyhole,
  Radio,
  ServerCog,
  Settings2,
} from "lucide-react";
import { useSystemStatus } from "@/lib/api/query";
import { formatDateTime, getErrorMessage } from "@/lib/format";
import { DataBadges } from "@/components/shared/data-badges";
import { ErrorState, PanelSkeleton } from "@/components/shared/query-state";

export function SystemWorkspace({ kind }: { kind: "logs" | "settings" }) {
  const status = useSystemStatus();
  const isLogs = kind === "logs";

  return (
    <div className="space-y-3">
      <header>
        <p className="eyebrow">
          {isLogs ? "Observabilidade do Sprint 1" : "Configuração operacional"}
        </p>
        <h1 className="mt-1 flex items-center gap-2 text-xl font-extrabold tracking-[-0.04em]">
          {isLogs ? (
            <FileClock className="size-5 text-radar-neutral" />
          ) : (
            <Settings2 className="size-5 text-radar-neutral" />
          )}
          {isLogs ? "Logs" : "Configurações"}
        </h1>
        <p className="mt-1 max-w-2xl text-xs leading-5 text-radar-muted">
          {isLogs
            ? "Estado de sincronização e diagnóstico seguro dos providers, sem payloads sensíveis ou stack traces."
            : "Leitura da configuração pública do frontend. Segredos e credenciais permanecem exclusivamente no backend."}
        </p>
      </header>

      {status.isLoading ? (
        <div className="panel">
          <PanelSkeleton rows={7} />
        </div>
      ) : status.isError ? (
        <div className="panel">
          <ErrorState message={getErrorMessage(status.error)} retry={() => void status.refetch()} />
        </div>
      ) : status.data ? (
        <>
          <div className="flex justify-end">
            <DataBadges demo={status.data.demo_mode} partial={status.data.status === "degraded"} />
          </div>
          {isLogs ? (
            <div className="grid gap-3 lg:grid-cols-[1fr_1.5fr]">
              <section className="panel p-4">
                <h2 className="flex items-center gap-2 text-sm font-extrabold">
                  <Clock3 className="size-4 text-radar-neutral" /> Última leitura
                </h2>
                <dl className="mt-4 space-y-3">
                  <div className="flex justify-between gap-4">
                    <dt className="text-xs text-radar-muted">Estado</dt>
                    <dd
                      className={`text-xs font-extrabold ${status.data.status === "operational" ? "text-radar-positive" : "text-radar-warning"}`}
                    >
                      {status.data.status}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-xs text-radar-muted">Última sincronização</dt>
                    <dd className="text-right text-xs font-bold">
                      {formatDateTime(status.data.last_sync_at)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-xs text-radar-muted">Gerado em</dt>
                    <dd className="text-right text-xs font-bold">
                      {formatDateTime(status.data.generated_at)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-xs text-radar-muted">Base de dados</dt>
                    <dd className="text-right text-xs font-bold">{status.data.database}</dd>
                  </div>
                </dl>
                <p className="mt-4 border-t border-radar-border pt-3 text-[0.63rem] leading-5 text-radar-subtle">
                  O histórico detalhado de logs e exportação fica reservado para um sprint
                  posterior. Esta página já representa o estado de runtime real.
                </p>
              </section>
              <section className="panel overflow-hidden">
                <div className="border-b border-radar-border p-4">
                  <h2 className="flex items-center gap-2 text-sm font-extrabold">
                    <ServerCog className="size-4 text-radar-neutral" /> Providers
                  </h2>
                </div>
                <div className="divide-y divide-radar-border/70">
                  {status.data.providers.map((provider) => (
                    <article key={provider.id} className="grid gap-2 p-3.5 sm:grid-cols-[1fr_auto]">
                      <div>
                        <p className="text-xs font-extrabold">{provider.name}</p>
                        <p className="mt-0.5 text-[0.62rem] text-radar-muted">
                          {provider.kind} • {provider.detail ?? "Sem diagnóstico adicional"}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p
                          className={`text-[0.64rem] font-extrabold uppercase ${provider.status === "active" ? "text-radar-positive" : provider.status === "degraded" ? "text-radar-warning" : "text-radar-subtle"}`}
                        >
                          {provider.status} • {provider.mode}
                        </p>
                        <p className="mt-0.5 text-[0.58rem] text-radar-subtle">
                          {formatDateTime(provider.last_checked_at)}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <section className="panel p-4">
                <Database className="size-5 text-radar-neutral" />
                <h2 className="mt-3 text-sm font-extrabold">API pública</h2>
                <p className="mono mt-2 break-all text-[0.68rem] text-radar-muted">
                  {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}
                </p>
                <p className="mt-3 text-[0.63rem] leading-5 text-radar-subtle">
                  Definida por NEXT_PUBLIC_API_URL. Nenhum segredo é aceite nesta variável.
                </p>
              </section>
              <section className="panel p-4">
                <Radio className="size-5 text-radar-positive" />
                <h2 className="mt-3 text-sm font-extrabold">Monitoramento</h2>
                <p className="mt-2 text-xs font-bold text-radar-ink">
                  {status.data.monitoring_active ? "Ativo" : "Inativo"}
                </p>
                <p className="mt-3 text-[0.63rem] leading-5 text-radar-subtle">
                  O agendamento é controlado pelo backend. Esta interface não executa jobs
                  diretamente.
                </p>
              </section>
              <section className="panel p-4">
                <LockKeyhole className="size-5 text-radar-warning" />
                <h2 className="mt-3 text-sm font-extrabold">Limites de segurança</h2>
                <p className="mt-2 text-xs font-bold text-radar-ink">
                  {status.data.read_only ? "Blockchain read-only" : "Estado não confirmado"}
                </p>
                <p className="mt-3 text-[0.63rem] leading-5 text-radar-subtle">
                  Sem carteira, seed phrase, chave privada ou endpoint de execução financeira.
                </p>
              </section>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
