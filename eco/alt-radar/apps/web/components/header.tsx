"use client";

import { Activity, ChevronDown, Menu, Search, Server, X, Sparkles, Radio } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSystemStatus } from "@/eco/alt-radar/apps/web/lib/api/query";
import type { Chain } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import { formatDateTime } from "@/eco/alt-radar/apps/web/lib/format";
import { useRadarState } from "./radar-state";
import { WebhookSettingsModal } from "./shared/webhook-settings-modal";

const networks: { id: Chain; label: string; mark: string; color: string }[] = [
  { id: "bsc", label: "BSC", mark: "◆", color: "#f4b941" },
  { id: "solana", label: "SOL", mark: "≋", color: "#62a4ff" },
  { id: "ethereum", label: "ETH", mark: "♦", color: "#9fbfff" },
];

export function Header() {
  const { search, setSearch, chains, toggleChain, setNavigationOpen } = useRadarState();
  const [isProviderPanelOpen, setProviderPanelOpen] = useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const status = useSystemStatus();
  const monitoringActive = status.data?.monitoring_active === true;

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/80 px-3 py-3 shadow-[0_1px_0_rgba(255,255,255,0.03),0_12px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:px-5">
      <div className="mx-auto flex max-w-[1760px] items-center gap-2.5">
        <button
          aria-label="Abrir menu"
          className="grid size-10 shrink-0 place-items-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white xl:hidden"
          onClick={() => setNavigationOpen(true)}
          type="button"
        >
          <Menu className="size-5" />
        </button>

        <span className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1.5 text-[0.62rem] font-mono font-bold text-cyan-300 2xl:inline-flex">
          <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Sprint 1 • MVP
        </span>

        <label className="relative min-w-0 flex-1 xl:max-w-[30rem]">
          <span className="sr-only">Buscar token, símbolo, contrato ou par</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <input
            data-testid="global-search"
            className="h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900/80 pl-10 pr-10 text-[0.8rem] font-mono text-zinc-200 placeholder:text-zinc-500 transition-all duration-200 hover:border-zinc-700 focus:border-[#d1ff00]/60 focus:bg-zinc-900 focus:shadow-[0_0_0_3px_rgba(209,255,0,0.1),0_0_20px_rgba(209,255,0,0.05)] focus:outline-none"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar token, símbolo, contrato ou par…"
            type="search"
            value={search}
          />
          {search && (
            <button
              aria-label="Limpar busca"
              className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-white"
              onClick={() => setSearch("")}
              type="button"
            >
              <X className="size-3.5" />
            </button>
          )}
        </label>

        <div aria-label="Filtrar por blockchain" className="hidden items-center gap-1.5 md:flex">
          {networks.map((network) => {
            const isSelected = chains.includes(network.id);
            return (
              <button
                key={network.id}
                aria-pressed={isSelected}
                data-testid={`chain-filter-${network.id}`}
                className={`flex h-10 items-center gap-1.5 rounded-xl border px-3 text-xs font-mono font-bold transition-all ${
                  isSelected
                    ? "border-[#d1ff00]/40 bg-[#d1ff00]/10 text-white shadow-[0_0_12px_rgba(209,255,0,0.1)]"
                    : "border-zinc-800 bg-zinc-900/70 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
                onClick={() => toggleChain(network.id)}
                type="button"
              >
                <span aria-hidden="true" style={{ color: network.color }}>
                  {network.mark}
                </span>
                {network.label}
              </button>
            );
          })}
        </div>

        <div className="relative ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsWebhookModalOpen(true)}
            className="flex h-10 items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 text-xs font-mono font-bold text-zinc-300 hover:border-[#d1ff00]/40 hover:text-white transition-all cursor-pointer"
            title="Configurar Webhook Outbound & Assinatura HMAC"
          >
            <Radio className="size-3.5 text-[#d1ff00]" />
            <span className="hidden md:inline">Webhooks</span>
          </button>

          <Link
            href="/eco/alt-radar?tab=landing"
            className="hidden sm:flex h-10 items-center gap-1.5 rounded-xl border border-[#d1ff00]/40 bg-[#d1ff00]/10 px-3 text-xs font-mono font-bold text-[#d1ff00] hover:bg-[#d1ff00]/20 transition-all shadow-[0_0_12px_rgba(209,255,0,0.1)]"
            title="Ver Página de Engenharia & Specs EvoPro"
          >
            <Sparkles className="size-3.5" />
            <span>EvoPro Specs</span>
          </Link>

          <button
            aria-expanded={isProviderPanelOpen}
            className="flex h-10 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 text-xs font-mono font-semibold text-zinc-300 hover:border-zinc-700 transition-colors"
            onClick={() => setProviderPanelOpen((current) => !current)}
            type="button"
          >
            <span
              className={`size-2 rounded-full ${
                monitoringActive
                  ? "bg-[#d1ff00] shadow-[0_0_8px_rgba(209,255,0,0.6)]"
                  : status.isError
                    ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                    : "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
              }`}
            />
            <span className="hidden lg:inline">
              {monitoringActive
                ? "Monitoramento Ativo"
                : status.isError
                  ? "Provider Demo / Fallback"
                  : "A verificar"}
            </span>
            <Activity className="size-4 text-[#d1ff00]" />
            <ChevronDown className="size-3.5 text-zinc-500" />
          </button>
          {isProviderPanelOpen && (
            <div className="panel absolute right-0 top-[calc(100%+0.55rem)] z-50 w-[min(88vw,22rem)] p-4 border border-zinc-800 bg-zinc-950/95 shadow-2xl rounded-2xl">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Estado dos providers</p>
                  <p className="mt-1 text-xs font-mono text-zinc-400">
                    Última sync: {formatDateTime(status.data?.last_sync_at ?? null)}
                  </p>
                </div>
                {status.data?.demo_mode && (
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[0.62rem] font-mono font-bold text-amber-400">
                    DEMO
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {status.data?.providers.map((provider) => (
                  <div
                    key={provider.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/60 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-white">{provider.name}</p>
                      <p className="truncate text-[0.65rem] font-mono text-zinc-500">{provider.kind}</p>
                    </div>
                    <span
                      className={`text-[0.64rem] font-mono font-bold uppercase ${
                        provider.status === "active"
                          ? "text-[#d1ff00]"
                          : provider.status === "degraded"
                            ? "text-amber-400"
                            : "text-zinc-500"
                      }`}
                    >
                      {provider.mode === "demo" ? "Demo" : provider.status}
                    </span>
                  </div>
                ))}
                {!status.data && (
                  <div className="flex items-center gap-2 rounded-xl bg-zinc-900/50 px-3 py-3 text-xs font-mono text-zinc-400">
                    <Server className="size-4 text-zinc-500" />
                    {status.isError ? "Estado offline (Fallback ativo)" : "A consultar providers…"}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2.5 flex gap-1.5 overflow-x-auto pb-0.5 md:hidden no-scrollbar">
        {networks.map((network) => (
          <button
            key={network.id}
            aria-pressed={chains.includes(network.id)}
            className={`shrink-0 rounded-xl border px-3 py-1.5 text-[0.68rem] font-mono font-bold ${
              chains.includes(network.id)
                ? "border-[#d1ff00]/40 bg-[#d1ff00]/10 text-white"
                : "border-zinc-800 bg-zinc-900 text-zinc-400"
            }`}
            onClick={() => toggleChain(network.id)}
            type="button"
          >
            {network.label}
          </button>
        ))}
      </div>

      <WebhookSettingsModal
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
      />
    </header>
  );
}
