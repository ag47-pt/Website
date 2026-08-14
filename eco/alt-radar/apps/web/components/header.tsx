"use client";

import { Activity, ChevronDown, Menu, Search, Server, X } from "lucide-react";
import { useState } from "react";
import { useSystemStatus } from "@/lib/api/query";
import type { Chain } from "@/lib/api/schemas";
import { formatDateTime } from "@/lib/format";
import { useRadarState } from "./radar-state";

const networks: { id: Chain; label: string; mark: string; color: string }[] = [
  { id: "bsc", label: "BSC", mark: "◆", color: "#f4b941" },
  { id: "solana", label: "SOL", mark: "≋", color: "#62a4ff" },
  { id: "ethereum", label: "ETH", mark: "♦", color: "#9fbfff" },
];

export function Header() {
  const { search, setSearch, chains, toggleChain, setNavigationOpen } = useRadarState();
  const [isProviderPanelOpen, setProviderPanelOpen] = useState(false);
  const status = useSystemStatus();
  const monitoringActive = status.data?.monitoring_active === true;

  return (
    <header className="sticky top-0 z-20 border-b border-radar-border bg-[#050c12]/70 px-3 py-3 shadow-[0_1px_0_rgb(255_255_255_/_0.04),0_12px_32px_rgb(0_0_0_/_0.35)] backdrop-blur-2xl sm:px-5">
      <div className="mx-auto flex max-w-[1720px] items-center gap-2.5">
        <button
          aria-label="Abrir menu"
          className="grid size-11 shrink-0 place-items-center rounded-xl border border-radar-border text-radar-muted xl:hidden"
          onClick={() => setNavigationOpen(true)}
          type="button"
        >
          <Menu className="size-5" />
        </button>

        <span className="hidden shrink-0 rounded-lg border border-radar-neutral/25 bg-[#111f34] px-2.5 py-2 text-[0.62rem] font-extrabold text-[#a8c7ff] 2xl:inline-flex">
          Sprint 1 • MVP
        </span>

        <label className="relative min-w-0 flex-1 xl:max-w-[32rem]">
          <span className="sr-only">Buscar token, símbolo, contrato ou par</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-[1.05rem] -translate-y-1/2 text-radar-subtle" />
          <input
            data-testid="global-search"
            className="h-11 w-full rounded-xl border border-radar-border bg-[#0a151e] pl-10 pr-10 text-[0.78rem] text-radar-ink placeholder:text-radar-subtle transition-all duration-200 hover:border-radar-border-strong focus:border-radar-positive/70 focus:shadow-[0_0_0_3px_rgb(78_229_154_/_0.12),0_0_24px_rgb(78_229_154_/_0.08)] focus:outline-none"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar token, símbolo, contrato ou par…"
            type="search"
            value={search}
          />
          {search && (
            <button
              aria-label="Limpar busca"
              className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-radar-subtle hover:bg-white/5 hover:text-radar-ink"
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
                className={`flex h-11 items-center gap-2 rounded-xl border px-3 text-xs font-extrabold transition-colors ${
                  isSelected
                    ? "border-radar-positive/45 bg-[#10251f] text-radar-ink"
                    : "border-radar-border bg-[#09141d] text-radar-muted hover:border-radar-border-strong hover:text-radar-ink"
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

        <div className="relative ml-auto">
          <button
            aria-expanded={isProviderPanelOpen}
            className="flex h-11 items-center gap-2 rounded-xl border border-radar-border bg-[#09141d] px-3 text-xs font-bold text-radar-muted hover:border-radar-border-strong"
            onClick={() => setProviderPanelOpen((current) => !current)}
            type="button"
          >
            <span
              className={`size-2 rounded-full ${
                monitoringActive
                  ? "bg-radar-positive"
                  : status.isError
                    ? "bg-radar-critical"
                    : "bg-radar-warning"
              }`}
            />
            <span className="hidden lg:inline">
              {monitoringActive
                ? "Monitoramento ativo"
                : status.isError
                  ? "Provider indisponível"
                  : "A verificar"}
            </span>
            <Activity className="size-4 text-radar-positive" />
            <ChevronDown className="size-3.5" />
          </button>
          {isProviderPanelOpen && (
            <div className="panel absolute right-0 top-[calc(100%+0.55rem)] z-50 w-[min(88vw,22rem)] p-3.5">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Estado dos providers</p>
                  <p className="mt-1 text-xs text-radar-muted">
                    Última sync: {formatDateTime(status.data?.last_sync_at ?? null)}
                  </p>
                </div>
                {status.data?.demo_mode && (
                  <span className="rounded-full border border-radar-warning/30 bg-[#2c220d] px-2 py-1 text-[0.62rem] font-extrabold text-radar-warning">
                    DEMO
                  </span>
                )}
              </div>
              <div className="space-y-1.5">
                {status.data?.providers.map((provider) => (
                  <div
                    key={provider.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.045] bg-black/10 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-radar-ink">{provider.name}</p>
                      <p className="truncate text-[0.65rem] text-radar-subtle">{provider.kind}</p>
                    </div>
                    <span
                      className={`text-[0.64rem] font-extrabold uppercase ${
                        provider.status === "active"
                          ? "text-radar-positive"
                          : provider.status === "degraded"
                            ? "text-radar-warning"
                            : "text-radar-subtle"
                      }`}
                    >
                      {provider.mode === "demo" ? "Demo" : provider.status}
                    </span>
                  </div>
                ))}
                {!status.data && (
                  <div className="flex items-center gap-2 rounded-lg bg-black/15 px-3 py-3 text-xs text-radar-muted">
                    <Server className="size-4" />
                    {status.isError ? "Estado indisponível" : "A consultar providers…"}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 flex gap-1.5 overflow-x-auto pb-0.5 md:hidden">
        {networks.map((network) => (
          <button
            key={network.id}
            aria-pressed={chains.includes(network.id)}
            className={`shrink-0 rounded-lg border px-3 py-1.5 text-[0.68rem] font-bold ${
              chains.includes(network.id)
                ? "border-radar-positive/45 bg-[#10251f] text-radar-ink"
                : "border-radar-border bg-[#09141d] text-radar-muted"
            }`}
            onClick={() => toggleChain(network.id)}
            type="button"
          >
            {network.label}
          </button>
        ))}
      </div>
    </header>
  );
}
