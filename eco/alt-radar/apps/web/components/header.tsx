"use client";

import { ChevronDown, Menu, Search, Server, X, Sparkles, Radio, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSystemStatus } from "@/eco/alt-radar/apps/web/lib/api/query";
import type { Chain } from "@/eco/alt-radar/apps/web/lib/api/schemas";
import { formatDateTime } from "@/eco/alt-radar/apps/web/lib/format";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { useTheme } from "@/context/ThemeContext";
import { useRadarState } from "./radar-state";
import { SpotlightSearchModal } from "./shared/spotlight-search-modal";

const networks: { id: Chain; label: string; mark: string; color: string }[] = [
  { id: "bsc", label: "BSC", mark: "◆", color: "#f59e0b" },
  { id: "solana", label: "SOL", mark: "≋", color: "#00d9ff" },
  { id: "ethereum", label: "ETH", mark: "♦", color: "#818cf8" },
];

export function Header() {
  const { search, setSearch, chains, toggleChain, setNavigationOpen } = useRadarState();
  const [isProviderPanelOpen, setProviderPanelOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const status = useSystemStatus();
  const monitoringActive = status.data?.monitoring_active === true;
  const runtimeLabel = status.isLoading
    ? "A consultar"
    : status.isError
      ? "Indisponível"
      : status.data?.demo_mode
        ? "Demo"
        : monitoringActive
          ? "Ativo"
          : status.data?.status === "degraded"
            ? "Degradado"
            : "Inativo";
  const telemetryLabel = monitoringActive
    ? "TELEMETRIA_ATIVA"
    : status.isError
      ? "API_INDISPONÍVEL"
      : "TELEMETRIA_NÃO_CONFIRMADA";
  const { primary } = useEcoTheme();
  const { themeName, toggleTheme } = useTheme();

  // Listen for ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-white/20 bg-white/5 backdrop-blur-2xl px-3 py-3 shadow-2xl sm:px-5 transition-all duration-300 relative overflow-hidden">
      {/* Glass shine beam effect following /eco and /labs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-[150%] bg-gradient-to-r from-transparent via-white/5 to-transparent animate-glass-shine mix-blend-overlay" />
      </div>

      <ScrollProgressBar />

      <div className="relative z-10 mx-auto flex max-w-[1760px] items-center gap-2.5">
        <button
          aria-label="Abrir menu"
          className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 xl:hidden transition-colors"
          onClick={() => setNavigationOpen(true)}
          type="button"
        >
          <Menu className="size-4" />
        </button>

        {/* Return link to Eco Hub following canonical /eco pattern */}
        <Link
          href="/eco"
          className="hidden sm:inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-1.5 text-[10px] font-mono font-black tracking-widest uppercase transition-all duration-300 hover:scale-105"
          style={{
            borderColor: `${primary}50`,
            backgroundColor: `${primary}15`,
            color: primary,
            boxShadow: `0 0 12px ${primary}20`,
          }}
          title="Voltar ao Eco Hub Geral"
        >
          <ArrowLeft className="size-3" />
          <span>ECO HUB</span>
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded tracking-widest font-black uppercase bg-black/60 text-white border border-white/10">
            MAP
          </span>
        </Link>

        <div className="h-5 w-[1px] bg-white/10 mx-1 hidden 2xl:block" />

        <span className="hidden 2xl:inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[9px] font-mono font-bold tracking-wider uppercase text-zinc-400">
          <span
            className={`size-1.5 rounded-full ${monitoringActive ? "animate-pulse" : ""}`}
            style={{
              backgroundColor: status.isError ? "#f43f5e" : monitoringActive ? primary : "#f59e0b",
              boxShadow: monitoringActive ? `0 0 6px ${primary}` : "none",
            }}
          />
          {telemetryLabel}
        </span>

        {/* Global Search with ⌘K & Spotlight Trigger */}
        <div className="relative min-w-0 flex-1 xl:max-w-[28rem]">
          <span className="sr-only">Buscar token, símbolo, contrato ou par</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-zinc-400" />
          <input
            data-testid="global-search"
            className="h-9 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-14 text-[11px] font-mono text-zinc-200 placeholder:text-zinc-500 backdrop-blur-md transition-all duration-200 hover:border-white/20 focus:bg-black/50 focus:outline-none cursor-pointer"
            onClick={() => setIsSpotlightOpen(true)}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar token, símbolo, contrato ou par…"
            type="search"
            value={search}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = `${primary}90`;
              e.currentTarget.style.boxShadow = `0 0 0 3px ${primary}20, 0 0 20px ${primary}15`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "";
              e.currentTarget.style.boxShadow = "";
            }}
          />

          {/* Right Icon Button inside search field */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {search && (
              <button
                aria-label="Limpar busca"
                className="grid size-5 place-items-center rounded-md text-zinc-400 hover:bg-white/10 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearch("");
                }}
                type="button"
              >
                <X className="size-3" />
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsSpotlightOpen(true);
              }}
              title="Abrir Spotlight de Oportunidades (⌘K)"
              className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/40 hover:bg-white/10 px-1.5 py-0.5 text-[8px] font-mono font-bold text-zinc-300 hover:text-white transition-all cursor-pointer"
              style={{ borderColor: `${primary}30` }}
            >
              <kbd className="text-[8px] font-mono">⌘K</kbd>
            </button>
          </div>
        </div>

        {/* Blockchain Chain Filters */}
        <div aria-label="Filtrar por blockchain" className="hidden items-center gap-1.5 md:flex">
          {networks.map((network) => {
            const isSelected = chains.includes(network.id);
            return (
              <button
                key={network.id}
                aria-pressed={isSelected}
                data-testid={`chain-filter-${network.id}`}
                className={`flex h-9 items-center gap-1.5 rounded-xl border px-3 text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
                  isSelected
                    ? "text-white font-black"
                    : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/10 hover:text-zinc-200"
                }`}
                style={
                  isSelected
                    ? {
                        borderColor: `${primary}60`,
                        backgroundColor: `${primary}15`,
                        boxShadow: `0 0 12px ${primary}25`,
                      }
                    : {}
                }
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

        {/* Right Actions */}
        <div className="relative ml-auto flex items-center gap-2">
          <Link
            href="/eco/alt-radar?tab=configuracoes"
            className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer shadow-sm"
            title="Abrir a configuração real de Webhook Outbound e assinatura HMAC"
          >
            <Radio className="size-3" style={{ color: primary }} />
            <span className="hidden lg:inline">Webhooks</span>
          </Link>

          <Link
            href="/eco/alt-radar?tab=landing"
            className="hidden sm:flex h-9 items-center gap-1.5 rounded-xl border px-3 text-[10px] font-mono font-black uppercase tracking-wider transition-all hover:scale-105"
            style={{
              borderColor: `${primary}50`,
              backgroundColor: `${primary}15`,
              color: primary,
              boxShadow: `0 0 12px ${primary}20`,
            }}
            title="Ver Página de Engenharia & Specs EvoPro"
          >
            <Sparkles className="size-3" style={{ color: primary }} />
            <span>SPECS</span>
            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded tracking-widest font-black uppercase bg-black/60 text-white border border-white/10">
              EVO
            </span>
          </Link>

          <div className="flex items-center" title="Alternar Design System [T]">
            <ThemeSwitcher onToggle={toggleTheme} themeName={themeName} />
          </div>

          <button
            aria-expanded={isProviderPanelOpen}
            className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-300 hover:border-white/20 hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => setProviderPanelOpen((current) => !current)}
            type="button"
          >
            <span
              className={`size-2 rounded-full ${
                monitoringActive
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                  : status.isError
                    ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                    : "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
              }`}
            />
            <span className="hidden xl:inline">{runtimeLabel}</span>
            <ChevronDown className="size-3 text-zinc-400" />
          </button>

          {isProviderPanelOpen && (
            <div className="absolute right-0 top-[calc(100%+0.55rem)] z-50 w-[min(88vw,22rem)] p-4 border border-white/20 bg-[#0a0a0a]/95 backdrop-blur-2xl shadow-2xl rounded-2xl">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[8px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400">
                    ESTADO DOS PROVIDERS
                  </p>
                  <p className="mt-1 text-[10px] font-mono text-zinc-400">
                    Última sync: {formatDateTime(status.data?.last_sync_at ?? null)}
                  </p>
                </div>
                {status.data?.demo_mode && (
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[8px] font-mono font-bold text-amber-400">
                    DEMO
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {status.data?.providers.map((provider) => (
                  <div
                    key={provider.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-white">{provider.name}</p>
                      <p className="truncate text-[9px] font-mono text-zinc-400">{provider.kind}</p>
                    </div>
                    <span
                      className={`text-[9px] font-mono font-bold uppercase ${
                        provider.status === "active"
                          ? "text-emerald-400"
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
                  <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-3 text-xs font-mono text-zinc-400">
                    <Server className="size-4 text-zinc-500" />
                    {status.isError
                      ? "API indisponível — nenhum fallback de dados ativo"
                      : "A consultar providers…"}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 flex gap-1.5 overflow-x-auto pb-0.5 md:hidden no-scrollbar">
        {networks.map((network) => (
          <button
            key={network.id}
            aria-pressed={chains.includes(network.id)}
            className={`shrink-0 rounded-xl border px-3 py-1.5 text-[9px] font-mono font-bold tracking-wider uppercase transition-all ${
              chains.includes(network.id)
                ? "text-white font-black"
                : "border-white/10 bg-white/5 text-zinc-400"
            }`}
            style={
              chains.includes(network.id)
                ? { borderColor: `${primary}60`, backgroundColor: `${primary}15` }
                : {}
            }
            onClick={() => toggleChain(network.id)}
            type="button"
          >
            {network.label}
          </button>
        ))}
      </div>

      <SpotlightSearchModal isOpen={isSpotlightOpen} onClose={() => setIsSpotlightOpen(false)} />
    </header>
  );
}
