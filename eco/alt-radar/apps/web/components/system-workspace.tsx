/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Database,
  FileClock,
  LockKeyhole,
  Radio,
  RefreshCw,
  ServerCog,
  Settings2,
  Download,
  Globe,
  Link2,
  Send,
} from "lucide-react";
import {
  useSystemStatus,
  useResetCircuitMutation,
  useUserNotificationSettings,
  useUpdateUserNotificationSettingsMutation,
  useSystemNotifications,
  useChainStatus,
  useTestWebhookMutation,
  useDownloadTruthDataset,
} from "@/lib/api/query";
import { formatDateTime, getErrorMessage } from "@/lib/format";
import { DataBadges } from "@/components/shared/data-badges";
import { ErrorState, PanelSkeleton } from "@/components/shared/query-state";

export function SystemWorkspace({ kind }: { kind: "logs" | "settings" | "notifications" }) {
  const status = useSystemStatus();
  const isLogs = kind === "logs";
  const isNotifications = kind === "notifications";

  return (
    <div className="space-y-3">
      <header>
        <p className="eyebrow">
          {isLogs
            ? "Observabilidade do Sprint 1"
            : isNotifications
              ? "Histórico e Auditoria de Disparos"
              : "Configuração operacional"}
        </p>
        <h1 className="mt-1 flex items-center gap-2 text-xl font-extrabold tracking-[-0.04em]">
          {isLogs ? (
            <FileClock className="size-5 text-radar-neutral" />
          ) : isNotifications ? (
            <Bell className="size-5 text-radar-neutral" />
          ) : (
            <Settings2 className="size-5 text-radar-neutral" />
          )}
          {isLogs ? "Logs" : isNotifications ? "Notificações" : "Configurações"}
        </h1>
        <p className="mt-1 max-w-2xl text-xs leading-5 text-radar-muted">
          {isLogs
            ? "Estado de sincronização e diagnóstico seguro dos providers, sem payloads sensíveis ou stack traces."
            : isNotifications
              ? "Histórico completo de entregas do bot, payloads enviados, latência e diagnóstico de falhas em tempo real."
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
            <>
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
                  {status.data.providers.map((provider) => {
                    const hasCircuit = provider.circuit_state !== undefined;
                    return (
                      <article key={provider.id} className="grid gap-2 p-3.5 sm:grid-cols-[1fr_auto] items-center">
                        <div>
                          <p className="text-xs font-extrabold">{provider.name}</p>
                          <p className="mt-0.5 text-[0.62rem] text-radar-muted">
                            {provider.kind} • {provider.detail ?? "Sem diagnóstico adicional"}
                          </p>
                          {hasCircuit && (
                            <div className="mt-1.5 flex flex-wrap gap-2 text-[0.58rem]">
                              <span className={`px-1.5 py-0.5 rounded font-extrabold uppercase ${
                                provider.circuit_state === "closed" ? "bg-radar-positive/10 text-radar-positive" :
                                provider.circuit_state === "open" ? "bg-radar-critical/10 text-radar-critical font-black animate-pulse" :
                                "bg-radar-warning/10 text-radar-warning"
                              }`}>
                                Circuito: {provider.circuit_state}
                              </span>
                              {provider.consecutive_failures !== undefined && provider.consecutive_failures > 0 && (
                                <span className="bg-radar-border/45 text-radar-warning px-1.5 py-0.5 rounded font-bold">
                                  Falhas: {provider.consecutive_failures}
                                </span>
                              )}
                              {provider.latency_ms !== null && provider.latency_ms !== undefined && (
                                <span className="bg-radar-border/45 text-radar-subtle px-1.5 py-0.5 rounded font-medium">
                                  Latência: {provider.latency_ms.toFixed(0)}ms
                                </span>
                              )}
                              {provider.remaining_cooldown !== null && provider.remaining_cooldown !== undefined && provider.remaining_cooldown > 0 && (
                                <span className="bg-radar-critical/10 text-radar-critical px-1.5 py-0.5 rounded font-bold animate-pulse">
                                  Resfriamento: {provider.remaining_cooldown.toFixed(0)}s
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col sm:items-end justify-between gap-2">
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
                          
                          {hasCircuit && (provider.circuit_state === "open" || provider.circuit_state === "half-open") && (
                            <ResetCircuitButton providerId={provider.id} />
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            </div>
            <div className="flex items-center justify-between mt-1">
              <h2 className="text-xs font-extrabold text-radar-muted">Exportação Epistemológica</h2>
              <ExportDatasetButton />
            </div>
            <MultiChainHealthMatrix />
            <NotificationDeliveryLogs />
          </>
          ) : isNotifications ? (
            <>
              <NotificationDeliveryLogs />
              <NotificationSettingsForm />
            </>
          ) : (
            <>
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
              <NotificationSettingsForm />
            </>
          )}
        </>
      ) : null}
    </div>
  );
}

function ResetCircuitButton({ providerId }: { providerId: string }) {
  const resetCircuit = useResetCircuitMutation();

  return (
    <button
      className="inline-flex items-center gap-1 rounded bg-radar-critical/20 hover:bg-radar-critical/30 border border-radar-critical/40 px-2 py-0.5 text-[0.58rem] font-extrabold text-radar-ink disabled:opacity-50"
      disabled={resetCircuit.isPending}
      onClick={() => resetCircuit.mutate(providerId)}
      type="button"
    >
      <RefreshCw className={`size-2.5 ${resetCircuit.isPending ? "animate-spin" : ""}`} />
      {resetCircuit.isPending ? "Reiniciando..." : "Manutenção / Reset"}
    </button>
  );
}

function NotificationSettingsForm() {
  const settingsQuery = useUserNotificationSettings();
  const updateMutation = useUpdateUserNotificationSettingsMutation();

  const [minSeverity, setMinSeverity] = useState(0.0);
  const [minConfidence, setMinConfidence] = useState(0.0);
  const [allowedChains, setAllowedChains] = useState<string[]>(["all"]);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const testWebhook = useTestWebhookMutation();

  useEffect(() => {
    if (settingsQuery.data) {
      setMinSeverity(settingsQuery.data.min_severity);
      setMinConfidence(settingsQuery.data.min_confidence);
      setAllowedChains(settingsQuery.data.allowed_chains);
      if (settingsQuery.data.webhook_url) setWebhookUrl(settingsQuery.data.webhook_url);
    }
  }, [settingsQuery.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      min_severity: minSeverity,
      min_confidence: minConfidence,
      allowed_chains: allowedChains,
      webhook_url: webhookUrl || undefined,
      webhook_secret: webhookSecret || undefined,
    });
  };

  const handleChainToggle = (chain: string) => {
    if (chain === "all") {
      setAllowedChains(["all"]);
      return;
    }
    
    let updated = allowedChains.filter(c => c !== "all");
    if (updated.includes(chain)) {
      updated = updated.filter(c => c !== chain);
      if (updated.length === 0) updated = ["all"];
    } else {
      updated.push(chain);
    }
    setAllowedChains(updated);
  };

  if (settingsQuery.isLoading) return <PanelSkeleton rows={3} />;

  return (
    <section className="panel p-4 mt-4 space-y-4">
      <div>
        <h2 className="text-sm font-extrabold flex items-center gap-2">
          <Bell className="size-4 text-radar-neutral" /> Filtros de Notificação do Telegram
        </h2>
        <p className="text-[0.62rem] text-radar-muted mt-1 leading-relaxed">
          Configure as regras mínimas estatísticas para que um alerta seja despachado ativamente para o canal do Telegram Bot.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-bold text-radar-ink mb-1.5">Severidade Mínima: {minSeverity.toFixed(1)}/1.0</label>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.1"
              value={minSeverity}
              onChange={(e) => setMinSeverity(parseFloat(e.target.value))}
              className="w-full h-1 bg-[#09151e] border border-radar-border rounded-lg appearance-none cursor-pointer accent-radar-positive"
            />
            <span className="text-[0.55rem] text-radar-muted mt-1 block">Apenas alertas com severidade de sinal maior ou igual a esta nota.</span>
          </div>

          <div>
            <label className="block font-bold text-radar-ink mb-1.5">Confiança Mínima: {minConfidence.toFixed(1)}/1.0</label>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.1"
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
              className="w-full h-1 bg-[#09151e] border border-radar-border rounded-lg appearance-none cursor-pointer accent-radar-positive"
            />
            <span className="text-[0.55rem] text-radar-muted mt-1 block">Apenas alertas com grau de confiança estatística maior ou igual a este limite.</span>
          </div>
        </div>

        <div>
          <label className="block font-bold text-radar-ink mb-1.5">Blockchains Permitidas</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "Todas as Chains" },
              { id: "solana", label: "Solana" },
              { id: "ethereum", label: "Ethereum" },
              { id: "bsc", label: "BNB Chain" },
            ].map(chain => {
              const active = allowedChains.includes(chain.id);
              return (
                <button
                  key={chain.id}
                  type="button"
                  onClick={() => handleChainToggle(chain.id)}
                  className={`px-3 py-1 rounded-md text-[0.62rem] font-bold border transition-colors ${
                    active ? "bg-radar-positive/20 border-radar-positive text-radar-positive" : "bg-[#09151e] border-radar-border text-radar-muted hover:text-radar-ink"
                  }`}
                >
                  {chain.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-radar-border/40 pt-4 mt-2 space-y-3">
          <h3 className="text-xs font-extrabold flex items-center gap-1.5 text-radar-ink">
            <Link2 className="size-3.5 text-radar-neutral" /> Webhook Outbound (Discord / Slack / n8n)
          </h3>
          <p className="text-[0.55rem] text-radar-muted leading-relaxed">
            Configure uma URL de Webhook para receber alertas de Edge via HTTP POST assinado com HMAC SHA-256.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block font-bold text-radar-ink mb-1">URL do Webhook</label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full h-7 rounded border border-radar-border bg-[#09151e] px-2 text-[0.62rem] text-radar-ink placeholder:text-radar-subtle"
              />
            </div>
            <div>
              <label className="block font-bold text-radar-ink mb-1">Chave Secreta (HMAC)</label>
              <input
                type="password"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                placeholder="Segredo de assinatura HMAC SHA-256"
                className="w-full h-7 rounded border border-radar-border bg-[#09151e] px-2 text-[0.62rem] text-radar-ink placeholder:text-radar-subtle"
              />
            </div>
          </div>
          {settingsQuery.data?.webhook_configured && (
            <div className="flex items-center gap-2">
              <span className="text-[0.55rem] text-radar-positive font-bold">✓ Webhook configurado</span>
              <button
                type="button"
                disabled={testWebhook.isPending}
                onClick={() => testWebhook.mutate()}
                className="inline-flex items-center gap-1 rounded bg-radar-border/30 hover:bg-radar-border/50 border border-radar-border px-2 py-0.5 text-[0.55rem] font-bold text-radar-ink disabled:opacity-50"
              >
                <Send className="size-2.5" />
                {testWebhook.isPending ? "Testando..." : "Testar Envio"}
              </button>
              {testWebhook.data && (
                <span className={`text-[0.55rem] font-bold ${testWebhook.data.success ? "text-radar-positive" : "text-radar-critical"}`}>
                  {testWebhook.data.success ? `OK (${testWebhook.data.status_code})` : `Falha: ${testWebhook.data.error ?? "Erro desconhecido"}`}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-radar-border/40">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="inline-flex items-center gap-1 rounded bg-radar-positive/20 hover:bg-radar-positive/30 border border-radar-positive/45 px-3 py-1.5 text-[0.62rem] font-extrabold text-radar-positive disabled:opacity-50"
          >
            {updateMutation.isPending ? "Salvando..." : "Salvar Configurações"}
          </button>
        </div>
      </form>
    </section>
  );
}

function NotificationDeliveryLogs() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const notificationsQuery = useSystemNotifications(page, 10, statusFilter === "all" ? undefined : statusFilter);

  return (
    <section className="panel mt-4 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-radar-border p-4">
        <div>
          <h2 className="text-sm font-extrabold flex items-center gap-2">
            <Radio className="size-4 text-radar-neutral" /> Fila de Entrega de Notificações
          </h2>
          <p className="text-[0.62rem] text-radar-muted mt-0.5">
            Logs de disparos da fila assíncrona do Telegram Bot com seus payloads e diagnósticos.
          </p>
        </div>

        <div>
          <select
            className="h-7 rounded border border-radar-border bg-[#09151e] px-2 text-[0.62rem] text-radar-ink"
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            value={statusFilter}
          >
            <option value="all">Todos os envios</option>
            <option value="success">Sucesso</option>
            <option value="failed">Falhas</option>
            <option value="pending">Pendentes</option>
          </select>
        </div>
      </div>

      {notificationsQuery.isLoading ? (
        <PanelSkeleton rows={5} />
      ) : notificationsQuery.isError ? (
        <ErrorState message={getErrorMessage(notificationsQuery.error)} retry={() => void notificationsQuery.refetch()} />
      ) : !notificationsQuery.data?.items.length ? (
        <div className="p-8 text-center text-xs text-radar-muted">
          Nenhuma tentativa de entrega registrada para o filtro atual.
        </div>
      ) : (
        <div className="divide-y divide-radar-border/40 text-[0.6rem]">
          {notificationsQuery.data.items.map((delivery) => {
            const isSuccess = delivery.status === "success";
            const isFailed = delivery.status === "failed";
            const errorVal = delivery.provider_response?.error;
            const errorMsg = typeof errorVal === "string" ? errorVal : undefined;
            const durationVal = delivery.provider_response?.duration_ms;
            const durationStr = typeof durationVal === "number" || typeof durationVal === "string" ? String(durationVal) : undefined;

            return (
              <article key={delivery.id} className="p-3.5 hover:bg-white/[0.01] transition-colors grid gap-2 sm:grid-cols-[1fr_auto] items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-radar-ink">Token: {delivery.token_symbol ?? "Desconhecido"}</span>
                    <span className="text-radar-muted">• Canal: {delivery.channel}</span>
                    <span className={`px-1.5 py-0.5 rounded font-black uppercase text-[0.52rem] ${
                      isSuccess ? "bg-radar-positive/10 text-radar-positive" :
                      isFailed ? "bg-radar-critical/10 text-radar-critical" :
                      "bg-radar-warning/10 text-radar-warning"
                    }`}>
                      {delivery.status}
                    </span>
                  </div>
                  {durationStr && (
                    <p className="text-radar-subtle text-[0.55rem]">
                      Duração: {parseFloat(durationStr).toFixed(0)}ms
                    </p>
                  )}
                  {errorMsg && (
                    <p className="text-radar-critical font-medium text-[0.55rem] bg-radar-critical/5 px-2 py-1 rounded border border-radar-critical/20">
                      Erro: {errorMsg}
                    </p>
                  )}
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-radar-muted font-mono">{formatDateTime(delivery.created_at)}</p>
                  <p className="text-[0.52rem] text-radar-subtle mt-0.5 truncate max-w-[200px]" title={delivery.alert_id}>
                    ID Alerta: {delivery.alert_id.substring(0, 8)}...
                  </p>
                </div>
              </article>
            );
          })}

          <footer className="flex items-center justify-between border-t border-radar-border/40 px-3.5 py-2.5 bg-white/[0.01]">
            <p className="text-[0.58rem] text-radar-muted">
              Total: {notificationsQuery.data.total} envios
            </p>
            <div className="flex items-center gap-1.5">
              <button
                className="grid size-6 place-items-center rounded border border-radar-border disabled:opacity-35"
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="size-3" />
              </button>
              <span className="mono text-[0.58rem] text-radar-muted">
                {page}/{Math.max(1, notificationsQuery.data.pages)}
              </span>
              <button
                className="grid size-6 place-items-center rounded border border-radar-border disabled:opacity-35"
                disabled={page >= notificationsQuery.data.pages}
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronRight className="size-3" />
              </button>
            </div>
          </footer>
        </div>
      )}
    </section>
  );
}

function MultiChainHealthMatrix() {
  const chainStatus = useChainStatus();

  if (chainStatus.isLoading) return <PanelSkeleton rows={3} />;
  if (chainStatus.isError) {
    return <ErrorState message={getErrorMessage(chainStatus.error)} retry={() => void chainStatus.refetch()} />;
  }
  if (!chainStatus.data?.chains.length) {
    return (
      <section className="panel p-4 mt-4">
        <p className="text-xs text-radar-muted text-center">Nenhuma rede monitorada.</p>
      </section>
    );
  }

  return (
    <section className="panel mt-4 overflow-hidden">
      <div className="border-b border-radar-border p-4">
        <h2 className="flex items-center gap-2 text-sm font-extrabold">
          <Globe className="size-4 text-radar-neutral" /> Matriz de Saúde Multi-Chain
        </h2>
        <p className="text-[0.62rem] text-radar-muted mt-0.5">
          Status de cobertura por ecossistema de blockchain nas últimas 24 horas.
        </p>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
        {chainStatus.data.chains.map((chain) => {
          const statusColor =
            chain.status === "green"
              ? "text-radar-positive border-radar-positive/30 bg-radar-positive/5"
              : chain.status === "yellow"
                ? "text-radar-warning border-radar-warning/30 bg-radar-warning/5"
                : "text-radar-critical border-radar-critical/30 bg-radar-critical/5";
          return (
            <article
              key={chain.chain}
              className={`rounded-lg border p-3.5 transition-colors ${statusColor}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-extrabold uppercase">{chain.chain}</p>
                <span
                  className={`size-2.5 rounded-full ${
                    chain.status === "green"
                      ? "bg-radar-positive"
                      : chain.status === "yellow"
                        ? "bg-radar-warning animate-pulse"
                        : "bg-radar-critical animate-pulse"
                  }`}
                />
              </div>
              <dl className="mt-3 space-y-1.5 text-[0.6rem]">
                <div className="flex justify-between">
                  <dt className="text-radar-muted">Tokens ativos</dt>
                  <dd className="font-bold">{chain.tokens_active}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-radar-muted">Liquidez rastreada</dt>
                  <dd className="font-bold">${chain.liquidity_tracked.toLocaleString("en-US", { maximumFractionDigits: 0 })}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-radar-muted">Alertas (24h)</dt>
                  <dd className="font-bold">{chain.alerts_24h}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-radar-muted">Taxa de sucesso</dt>
                  <dd className="font-bold">{chain.provider_success_rate.toFixed(0)}%</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ExportDatasetButton() {
  const downloadMutation = useDownloadTruthDataset();
  const [format, setFormat] = useState<"json" | "csv">("json");

  return (
    <div className="flex items-center gap-2">
      <select
        className="h-7 rounded border border-radar-border bg-[#09151e] px-2 text-[0.62rem] text-radar-ink"
        value={format}
        onChange={(e) => setFormat(e.target.value as "json" | "csv")}
      >
        <option value="json">JSON</option>
        <option value="csv">CSV</option>
      </select>
      <button
        type="button"
        disabled={downloadMutation.isPending}
        onClick={() => downloadMutation.mutate(format)}
        className="inline-flex items-center gap-1 rounded bg-radar-positive/20 hover:bg-radar-positive/30 border border-radar-positive/45 px-2.5 py-1 text-[0.58rem] font-extrabold text-radar-positive disabled:opacity-50"
      >
        <Download className="size-3" />
        {downloadMutation.isPending ? "Exportando..." : "Exportar Dataset"}
      </button>
    </div>
  );
}

