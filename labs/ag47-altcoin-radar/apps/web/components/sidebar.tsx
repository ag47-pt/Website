"use client";

import {
  Bell,
  ChartNoAxesCombined,
  FileClock,
  Gauge,
  Settings2,
  ShieldAlert,
  Star,
  UsersRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "./logo-mark";
import { useRadarState } from "./radar-state";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/oportunidades", label: "Oportunidades", icon: ChartNoAxesCombined },
  { href: "/alertas", label: "Alertas", icon: Bell },
  { href: "/social", label: "Social", icon: UsersRound },
  { href: "/risco", label: "Risco", icon: ShieldAlert },
  { href: "/watchlist", label: "Watchlist", icon: Star },
  { href: "/logs", label: "Logs", icon: FileClock },
  { href: "/configuracoes", label: "Configurações", icon: Settings2 },
] as const;

function NavigationLinks() {
  const pathname = usePathname();
  const { setNavigationOpen } = useRadarState();

  return (
    <nav aria-label="Navegação principal" className="mt-8 flex flex-1 flex-col gap-1.5">
      {navigation.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            aria-current={isActive ? "page" : undefined}
            data-testid={`nav-${href.slice(1)}`}
            className={`group relative flex min-h-11 items-center gap-3 rounded-lg px-3.5 text-[0.83rem] font-semibold transition-colors ${
              isActive
                ? "bg-[#0e2a2b] text-radar-ink"
                : "text-radar-muted hover:bg-white/[0.035] hover:text-radar-ink"
            }`}
            href={href}
            onClick={() => setNavigationOpen(false)}
          >
            {isActive && (
              <span className="absolute inset-y-2 -left-3.5 w-0.5 rounded-full bg-radar-positive" />
            )}
            <Icon
              aria-hidden="true"
              className={`size-[1.18rem] ${isActive ? "text-radar-positive" : "text-radar-subtle group-hover:text-radar-muted"}`}
              strokeWidth={1.8}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarContent({ mobile = false }: { mobile?: boolean }) {
  const { setNavigationOpen } = useRadarState();
  return (
    <>
      <div className="flex items-center justify-between">
        <LogoMark />
        {mobile && (
          <button
            aria-label="Fechar menu"
            className="grid size-10 place-items-center rounded-lg border border-radar-border text-radar-muted hover:text-radar-ink"
            onClick={() => setNavigationOpen(false)}
            type="button"
          >
            <X className="size-5" />
          </button>
        )}
      </div>
      <NavigationLinks />
      <div className="rounded-xl border border-radar-border bg-[#0c1a24] p-3.5">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold text-radar-ink">
          <span className="size-2 rounded-full bg-radar-positive shadow-[0_0_0_4px_rgb(85_223_138_/_0.1)]" />
          Sprint 1 • Read-only
        </div>
        <p className="text-[0.7rem] leading-5 text-radar-muted">
          Descoberta, score explicável e alertas. Sem execução de operações.
        </p>
      </div>
    </>
  );
}

export function Sidebar() {
  const { isNavigationOpen, setNavigationOpen } = useRadarState();
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[var(--radar-sidebar-width)] border-r border-radar-border bg-[#07111a]/95 p-4 xl:flex xl:flex-col">
        <SidebarContent />
      </aside>
      {isNavigationOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            aria-label="Fechar menu"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setNavigationOpen(false)}
            type="button"
          />
          <aside className="relative flex h-full w-[min(88vw,20rem)] flex-col border-r border-radar-border bg-[#07111a] p-4 shadow-2xl">
            <SidebarContent mobile />
          </aside>
        </div>
      )}
    </>
  );
}
