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
} from "@/eco/alt-radar/apps/web/lib/api/query";
import { formatDateTime, getErrorMessage } from "@/eco/alt-radar/apps/web/lib/format";
import { DataBadges } from "@/eco/alt-radar/apps/web/components/shared/data-badges";
import { ErrorState, PanelSkeleton } from "@/eco/alt-radar/apps/web/components/shared/query-state";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";

export function SystemWorkspace({ kind }: { kind: "logs" | "settings" | "notifications" }) {
  const status = useSystemStatus();
  const isLogs = kind === "logs";
  const isNotifications = kind === "notifications";
  const { primary } = useEcoTheme();

  return (
    <div className="space-y-3 font-mono">
      <header>
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-zinc-400">
          {isLogs
            ? "Observabilidade do Sprint 1"
            : isNotifications
              ? "Histórico e Auditoria de Disparos"
              : "Configuração operacional"}
        </p>
        <h1 className="mt-1 flex items-center gap-2 text-xl font-bold tracking-tight text-white font-sans">
          {isLogs ? (
            <FileClock className="size-5" style={{ color: primary }} />
          ) : isNotifications ? (
            <Bell className="size-5" style={{ color: primary }} />
          ) : (
            <Settings2 className="size-5" style={{ color: primary }} />
          )}
          {isLogs ? "Logs" : isNotifications ? "Notificações" : "Configurações"}
        </h1>
        <p className="mt-1 max-w-2xl text-xs leading-5 text-zinc-400">
          {isLogs
            ? "Estado de sincronização e diagnóstico seguro dos providers, sem payloads sensíveis ou stack traces."
            : isNotifications
              ? "Histórico completo de entregas do bot, payloads enviados, latência e diagnóstico de falhas em tempo real."
              : "Leitura da configuração pública do frontend. Segredos e credenciais permanecem exclusivamente no backend."}
        </p>
      </header>

      {status.isLoading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-xl">
          <PanelSkeleton rows={7} />
        </div>
      ) : status.isError ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-xl">
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
              <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-xl">
                <h2 className="flex items-center gap-2 text-sm font-bold text-white font-sans">
                  <Clock3 className="size-4 text-cyan-400" /> Última leitura
                </h2>
                <dl className="mt-4 space-y-3 font-mono">
                  <div className="flex justify-between gap-4">
                    <dt className="text-xs text-zinc-400">Estado</dt>
                    <dd
                      className={`text-xs font-bold ${status.data.status === "operational" ? "text-emerald-400" : "text-amber-400"}`}
                    >
                      {status.data.status}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-xs text-zinc-400">Última sincronização</dt>
                    <dd className="text-right text-xs font-bold text-white">
                      {formatDateTime(status.data.last_sync_at)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-xs text-zinc-400">Gerado em</dt>
                    <dd className="text-right text-xs font-bold text-white">
                      {formatDateTime(status.data.generated_at)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-xs text-zinc-400">Base de dados</dt>
                    <dd className="text-right text-xs font-bold text-white">{status.data.database}</dd>
                  </div>
                </dl>
                <p className="mt-4 border-t border-white/10 pt-3 text-[0.63rem] leading-5 text-zinc-500">
                  O histórico detalhado de logs e exportação fica reservado para um sprint
                  posterior. Esta página já representa o estado de runtime real.
                </p>
              </section>
              <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden">
                <div className="border-b border-white/10 p-4">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-white font-sans">
                    <ServerCog className="size-4 text-cyan-400" /> Providers
                  </h2>
                </div>
                <div className="divide-y divide-white/5 font-mono">
                  {status.data.providers.map((provider) => {
                    const hasCircuit = provider.circuit_state !== undefined;
                    return (
                      <article key={provider.id} className="grid gap-2 p-3.5 sm:grid-cols-[1fr_auto] items-center hover:bg-white/[0.02] transition-colors">
                        <div>
                          <p className="text-xs font-bold text-white">{provider.name}</p>
                          <p className="mt-0.5 text-[0.62rem] text-zinc-400">
                            {provider.kind} • {provider.detail ?? "Sem diagnóstico adicional"}
                          </p>
                          {hasCircuit && (
                            <div className="mt-1.5 flex flex-wrap gap-2 text-[0.58rem]">
                              <span className={`px-1.5 py-0.5 rounded-lg font-bold uppercase ${
                                provider.circuit_state === "closed" ? "bg-emerald-950/50 text-emerald-300 border border-emerald-500/30" :
                                provider.circuit_state === "open" ? "bg-rose-950/50 text-rose-300 border border-rose-500/30 font-black animate-pulse" :
                                "bg-amber-950/50 text-amber-300 border border-amber-500/30"
                              }`}>
                                Circuito: {provider.circuit_state}
                              </span>
                              {provider.consecutive_failures !== undefined && provider.consecutive_failures > 0 && (
                                <span className="bg-amber-950/40 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded-lg font-bold">
                                  Falhas: {provider.consecutive_failures}
                                </span>
                              )}
                              {provider.latency_ms !== null && provider.latency_ms !== undefined && (
                                <span className="bg-white/5 text-zinc-400 border border-white/10 px-1.5 py-0.5 rounded-lg font-medium">
                                  Latência: {provider.latency_ms.toFixed(0)}ms
                                </span>
                              )}
                              {provider.remaining_cooldown !== null && provider.remaining_cooldown !== undefined && provider.remaining_cooldown > 0 && (
                                <span className="bg-rose-950/50 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded-lg font-bold animate-pulse">
                                  Resfriamento: {provider.remaining_cooldown.toFixed(0)}s
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col sm:items-end justify-between gap-2">
                          <div className="text-left sm:text-right">
                            <p
                              className={`text-[0.64rem] font-bold uppercase ${provider.status === "active" ? "text-emerald-400" : provider.status === "degraded" ? "text-amber-400" : "text-zinc-500"}`}
                            >
                              {provider.status} • {provider.mode}
                            </p>
                            <p className="mt-0.5 text-[0.58rem] text-zinc-500">
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
              <h2 className="text-xs font-bold text-zinc-400">Exportação Epistemológica</h2>
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
                <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-xl">
                  <Database className="size-5 text-cyan-400" />
                  <h2 className="mt-3 text-sm font-bold text-white font-sans">API pública</h2>
                  <p className="mt-2 break-all text-[0.68rem] text-zinc-400">
                    {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}
                  </p>
                  <p className="mt-3 text-[0.63rem] leading-5 text-zinc-500">
                    Definida por NEXT_PUBLIC_API_URL. Nenhum segredo é aceite nesta variável.
                  </p>
                </section>
                <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-xl">
                  <Radio className="size-5 text-emerald-400" />
                  <h2 className="mt-3 text-sm font-bold text-white font-sans">Monitoramento</h2>
                  <p className="mt-2 text-xs font-bold text-white">
                    {status.data.monitoring_active ? "Ativo" : "Inativo"}
                  </p>
                  <p className="mt-3 text-[0.63rem] leading-5 text-zinc-500">
                    O agendamento é controlado pelo backend. Esta interface não executa jobs
                    diretamente.
                  </p>
                </section>
                <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-xl">
                  <LockKeyhole className="size-5 text-amber-400" />
                  <h2 className="mt-3 text-sm font-bold text-white font-sans">Limites de segurança</h2>
                  <p className="mt-2 text-xs font-bold text-white">
                    {status.data.read_only ? "Blockchain read-only" : "Estado não confirmado"}
                  </p>
                  <p className="mt-3 text-[0.63rem] leading-5 text-zinc-500">
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
      className="inline-flex items-center gap-1 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 px-2.5 py-1 text-[0.58rem] font-bold text-rose-300 disabled:opacity-50 transition-colors cursor-pointer"
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
  const { primary } = useEcoTheme();

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
    <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-4 mt-4 space-y-4 font-mono">
      <div>
        <h2 className="text-sm font-bold flex items-center gap-2 text-white font-sans">
          <Bell className="size-4" style={{ color: primary }} /> Filtros de Notificação do Telegram
        </h2>
        <p className="text-[0.62rem] text-zinc-400 mt-1 leading-relaxed">
          Configure as regras mínimas estatísticas para que um alerta seja despachado ativamente para o canal do Telegram Bot.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-bold text-white mb-1.5">Severidade Mínima: {minSeverity.toFixed(1)}/1.0</label>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.1"
              value={minSeverity}
              onChange={(e) => setMinSeverity(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-black/40 border border-white/10 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[0.55rem] text-zinc-500 mt-1 block">Apenas alertas com severidade de sinal maior ou igual a esta nota.</span>
          </div>

          <div>
            <label className="block font-bold text-white mb-1.5">Confiança Mínima: {minConfidence.toFixed(1)}/1.0</label>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.1"
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-black/40 border border-white/10 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[0.55rem] text-zinc-500 mt-1 block">Apenas alertas com grau de confiança estatística maior ou igual a este limite.</span>
          </div>
        </div>

        <div>
          <label className="block font-bold text-white mb-1.5">Blockchains Permitidas</label>
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
                  className={`px-3 py-1 rounded-xl text-[0.62rem] font-bold border transition-all cursor-pointer ${
                    active ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_8px_rgba(0,217,255,0.15)]" : "bg-[#050c12] border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  {chain.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 mt-2 space-y-3">
          <h3 className="text-xs font-bold flex items-center gap-1.5 text-white font-sans">
            <Link2 className="size-3.5 text-cyan-400" /> Webhook Outbound (Discord / Slack / n8n)
          </h3>
          <p className="text-[0.55rem] text-zinc-400 leading-relaxed">
            Configure uma URL de Webhook para receber alertas de Edge via HTTP POST assinado com HMAC SHA-256.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block font-bold text-zinc-300 mb-1">URL do Webhook</label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full h-8 rounded-xl border border-white/10 bg-[#050c12] px-2.5 text-[0.62rem] text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/60"
              />
            </div>
            <div>
              <label className="block font-bold text-zinc-300 mb-1">Chave Secreta (HMAC)</label>
              <input
                type="password"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                placeholder="Segredo de assinatura HMAC SHA-256"
                className="w-full h-8 rounded-xl border border-white/10 bg-[#050c12] px-2.5 text-[0.62rem] text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/60"
              />
            </div>
          </div>
          {settingsQuery.data?.webhook_configured && (
            <div className="flex items-center gap-2">
              <span className="text-[0.55rem] text-emerald-400 font-bold">✓ Webhook configurado</span>
              <button
                type="button"
                disabled={testWebhook.isPending}
                onClick={() => testWebhook.mutate()}
                className="inline-flex items-center gap-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 text-[0.55rem] font-bold text-zinc-300 disabled:opacity-50 cursor-pointer transition-colors"
              >
                <Send className="size-2.5" />
                {testWebhook.isPending ? "Testando..." : "Testar Envio"}
              </button>
              {testWebhook.data && (
                <span className={`text-[0.55rem] font-bold ${testWebhook.data.success ? "text-emerald-400" : "text-rose-400"}`}>
                  {testWebhook.data.success ? `OK (${testWebhook.data.status_code})` : `Falha: ${testWebhook.data.error ?? "Erro desconhecido"}`}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-white/10">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="inline-flex items-center gap-1 rounded-xl px-4 py-2 text-[0.68rem] font-bold text-black transition-all disabled:opacity-50 cursor-pointer shadow-lg"
            style={{ backgroundColor: primary, boxShadow: `0 0 15px ${primary}40` }}
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
  const { primary } = useEcoTheme();

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl mt-4 overflow-hidden font-mono">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 p-4">
        <div>
          <h2 className="text-sm font-bold flex items-center gap-2 text-white font-sans">
            <Radio className="size-4" style={{ color: primary }} /> Fila de Entrega de Notificações
          </h2>
          <p className="text-[0.62rem] text-zinc-400 mt-0.5">
            Logs de disparos da fila assíncrona do Telegram Bot com seus payloads e diagnósticos.
          </p>
        </div>

        <div>
          <select
            className="h-8 rounded-xl border border-white/10 bg-black/40 px-2.5 text-[0.62rem] text-white focus:outline-none"
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
        <div className="p-8 text-center text-xs text-zinc-500">
          Nenhuma tentativa de entrega registrada para o filtro atual.
        </div>
      ) : (
        <div className="divide-y divide-white/5 text-[0.6rem]">
          {notificationsQuery.data.items.map((delivery) => {
            const isSuccess = delivery.status === "success";
            const isFailed = delivery.status === "failed";
            const errorVal = delivery.provider_response?.error;
            const errorMsg = typeof errorVal === "string" ? errorVal : undefined;
            const durationVal = delivery.provider_response?.duration_ms;
            const durationStr = typeof durationVal === "number" || typeof durationVal === "string" ? String(durationVal) : undefined;

            return (
              <article key={delivery.id} className="p-3.5 hover:bg-white/[0.02] transition-colors grid gap-2 sm:grid-cols-[1fr_auto] items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white">Token: {delivery.token_symbol ?? "Desconhecido"}</span>
                    <span className="text-zinc-400">• Canal: {delivery.channel}</span>
                    <span className={`px-1.5 py-0.5 rounded-lg font-bold uppercase text-[0.52rem] ${
                      isSuccess ? "bg-emerald-950/50 text-emerald-300 border border-emerald-500/30" :
                      isFailed ? "bg-rose-950/50 text-rose-300 border border-rose-500/30" :
                      "bg-amber-950/50 text-amber-300 border border-amber-500/30"
                    }`}>
                      {delivery.status}
                    </span>
                  </div>
                  {durationStr && (
                    <p className="text-zinc-500 text-[0.55rem]">
                      Duração: {parseFloat(durationStr).toFixed(0)}ms
                    </p>
                  )}
                  {errorMsg && (
                    <p className="text-rose-300 font-medium text-[0.55rem] bg-rose-950/40 px-2 py-1 rounded-lg border border-rose-500/30">
                      Erro: {errorMsg}
                    </p>
                  )}
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-zinc-400">{formatDateTime(delivery.created_at)}</p>
                  <p className="text-[0.52rem] text-zinc-500 mt-0.5 truncate max-w-[200px]" title={delivery.alert_id}>
                    ID Alerta: {delivery.alert_id.substring(0, 8)}...
                  </p>
                </div>
              </article>
            );
          })}

          <footer className="flex items-center justify-between border-t border-white/10 px-3.5 py-2.5 bg-white/[0.01]">
            <p className="text-[0.58rem] text-zinc-400">
              Total: {notificationsQuery.data.total} envios
            </p>
            <div className="flex items-center gap-1.5">
              <button
                className="grid size-7 place-items-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white disabled:opacity-35 transition-colors cursor-pointer"
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="size-3.5" />
              </button>
              <span className="text-[0.58rem] text-zinc-400">
                {page}/{Math.max(1, notificationsQuery.data.pages)}
              </span>
              <button
                className="grid size-7 place-items-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white disabled:opacity-35 transition-colors cursor-pointer"
                disabled={page >= notificationsQuery.data.pages}
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronRight className="size-3.5" />
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
  const { primary } = useEcoTheme();

  if (chainStatus.isLoading) return <PanelSkeleton rows={3} />;
  if (chainStatus.isError) {
    return <ErrorState message={getErrorMessage(chainStatus.error)} retry={() => void chainStatus.refetch()} />;
  }
  if (!chainStatus.data?.chains.length) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-4 mt-4 font-mono">
        <p className="text-xs text-zinc-500 text-center">Nenhuma rede monitorada.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl mt-4 overflow-hidden font-mono">
      <div className="border-b border-white/10 p-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-white font-sans">
          <Globe className="size-4" style={{ color: primary }} /> Matriz de Saúde Multi-Chain
        </h2>
        <p className="text-[0.62rem] text-zinc-400 mt-0.5">
          Status de cobertura por ecossistema de blockchain nas últimas 24 horas.
        </p>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
        {chainStatus.data.chains.map((chain) => {
          const statusColor =
            chain.status === "green"
              ? "text-emerald-300 border-emerald-500/30 bg-emerald-950/30"
              : chain.status === "yellow"
                ? "text-amber-300 border-amber-500/30 bg-amber-950/30"
                : "text-rose-300 border-rose-500/30 bg-rose-950/30";
          return (
            <article
              key={chain.chain}
              className={`rounded-xl border p-3.5 transition-colors ${statusColor}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase">{chain.chain}</p>
                <span
                  className={`size-2.5 rounded-full ${
                    chain.status === "green"
                      ? "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                      : chain.status === "yellow"
                        ? "bg-amber-400 animate-pulse"
                        : "bg-rose-400 animate-pulse"
                  }`}
                />
              </div>
              <dl className="mt-3 space-y-1.5 text-[0.6rem]">
                <div className="flex justify-between">
                  <dt className="text-zinc-400">Tokens ativos</dt>
                  <dd className="font-bold text-white">{chain.tokens_active}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-400">Liquidez rastreada</dt>
                  <dd className="font-bold text-white">${chain.liquidity_tracked.toLocaleString("en-US", { maximumFractionDigits: 0 })}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-400">Alertas (24h)</dt>
                  <dd className="font-bold text-white">{chain.alerts_24h}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-400">Taxa de sucesso</dt>
                  <dd className="font-bold text-emerald-400">{chain.provider_success_rate.toFixed(0)}%</dd>
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
  const { primary } = useEcoTheme();

  return (
    <div className="flex items-center gap-2 font-mono">
      <select
        className="h-8 rounded-xl border border-white/10 bg-black/40 px-2.5 text-[0.62rem] text-white focus:outline-none"
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
        className="inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-[0.58rem] font-bold disabled:opacity-50 transition-all cursor-pointer"
        style={{ borderColor: `${primary}50`, backgroundColor: `${primary}15`, color: primary }}
      >
        <Download className="size-3" />
        {downloadMutation.isPending ? "Exportando..." : "Exportar Dataset"}
      </button>
    </div>
  );
}
