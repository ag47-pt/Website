"use client";

import { useEffect, useState } from "react";

import {
  Bell,
  BellRing,
  Briefcase,
  ChartNoAxesCombined,
  FileClock,
  FlaskConical,
  Gauge,
  PanelLeftClose,
  PanelLeftOpen,
  Settings2,
  ShieldAlert,
  Star,
  UsersRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEvolution } from "@/lib/api/query";
import { evolution as evolutionFallback } from "@/lib/evolution";
import { LogoMark } from "./logo-mark";
import { useRadarState } from "./radar-state";

function EvolutionCard() {
  const { data } = useEvolution();
  const evolution = data
    ? {
        phase: data.phase,
        phaseTitle: data.phase_title,
        now: data.now,
        completedSteps: data.completed_steps,
        totalSteps: data.total_steps,
        goal: data.goal,
      }
    : evolutionFallback;
  const progress = Math.round((evolution.completedSteps / evolution.totalSteps) * 100);
  return (
    <div
      data-testid="evolution-card"
      className="rounded-xl border border-radar-border bg-gradient-to-b from-[#0d1d29]/80 to-[#0a1620]/80 p-3.5 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.03)] backdrop-blur-md"
    >
      <p className="eyebrow text-[0.58rem]">Motor de evolução</p>
      <div className="mt-1.5 flex items-center gap-2 text-xs font-bold text-radar-ink">
        <span className="size-2 animate-pulse rounded-full bg-radar-positive shadow-[0_0_0_4px_rgb(78_229_154_/_0.12),0_0_12px_rgb(78_229_154_/_0.5)]" />
        {evolution.phase} • {evolution.phaseTitle}
      </div>
      <p className="mt-1.5 text-[0.68rem] leading-4.5 text-radar-muted">{evolution.now}</p>
      <div
        role="progressbar"
        aria-label="Progresso da fase fundacional"
        aria-valuenow={evolution.completedSteps}
        aria-valuemin={0}
        aria-valuemax={evolution.totalSteps}
        className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/[0.06]"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-radar-positive/60 to-radar-positive shadow-[0_0_8px_rgb(78_229_154_/_0.5)] transition-[width] duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-1 flex items-center justify-between text-[0.58rem] font-bold text-radar-subtle">
        <span>
          {evolution.completedSteps}/{evolution.totalSteps} sprints
        </span>
        <span className="mono">{progress}%</span>
      </div>
      <p className="mt-2 border-t border-white/[0.05] pt-2 text-[0.6rem] leading-4 text-radar-subtle">
        <span className="font-bold text-radar-muted">Norte:</span> {evolution.goal}
      </p>
    </div>
  );
}

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/oportunidades", label: "Oportunidades", icon: ChartNoAxesCombined },
  { href: "/alertas", label: "Alertas", icon: Bell },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/lab", label: "Laboratório", icon: FlaskConical },
  { href: "/social", label: "Social", icon: UsersRound },
  { href: "/risco", label: "Risco", icon: ShieldAlert },
  { href: "/watchlist", label: "Watchlist", icon: Star },
  { href: "/notificacoes", label: "Notificações", icon: BellRing },
  { href: "/logs", label: "Logs", icon: FileClock },
  { href: "/configuracoes", label: "Configurações", icon: Settings2 },
] as const;


function NavigationLinks({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const { setNavigationOpen } = useRadarState();

  return (
    <nav aria-label="Navegação principal" className="mt-8 flex flex-1 flex-col gap-1 shrink-0">
      {navigation.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            aria-current={isActive ? "page" : undefined}
            data-testid={`nav-${href.slice(1)}`}
            title={collapsed ? label : undefined}
            className={`group relative flex min-h-9 items-center gap-3 rounded-lg text-[0.83rem] font-semibold transition-all duration-200 ${
              collapsed ? "justify-center px-0" : "px-3.5"
            } ${
              isActive
                ? "bg-gradient-to-r from-[#0d2c26] to-[#0a1e22] text-radar-ink shadow-[inset_0_1px_0_rgb(255_255_255_/_0.04),0_0_18px_rgb(78_229_154_/_0.06)] ring-1 ring-radar-positive/15"
                : "text-radar-muted hover:bg-white/[0.035] hover:text-radar-ink"
            } ${!isActive && !collapsed ? "hover:translate-x-0.5" : ""}`}
            href={href}
            onClick={() => setNavigationOpen(false)}
          >
            {isActive && (
              <span className="absolute inset-y-2 -left-3.5 w-0.5 rounded-full bg-radar-positive shadow-[0_0_10px_rgb(78_229_154_/_0.6)]" />
            )}
            <Icon
              aria-hidden="true"
              className={`size-[1.18rem] shrink-0 ${isActive ? "text-radar-positive" : "text-radar-subtle group-hover:text-radar-muted"}`}
              strokeWidth={1.8}
            />
            {!collapsed && label}
            {collapsed && <span className="sr-only">{label}</span>}
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
      <div className="flex items-center justify-between shrink-0">
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
      <div className="mt-8 shrink-0">
        <EvolutionCard />
      </div>
    </>
  );
}

function SidebarResizer() {
  const { setSidebarWidth } = useRadarState();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      // 160px min, 480px max
      const newWidth = Math.min(Math.max(e.clientX, 160), 480);
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    
    document.body.classList.add("is-sidebar-resizing");
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.classList.remove("is-sidebar-resizing");
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDragging, setSidebarWidth]);

  return (
    <div
      className={`absolute top-0 right-0 w-1.5 h-full cursor-col-resize z-50 transition-colors group ${
        isDragging ? "bg-radar-positive/20" : "hover:bg-radar-border-strong/50 bg-transparent"
      }`}
      onMouseDown={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
    >
      <div
        className={`absolute top-1/2 -translate-y-1/2 -left-0.5 w-1 h-8 rounded-full transition-colors ${
          isDragging ? "bg-radar-positive" : "bg-radar-border-strong opacity-0 group-hover:opacity-100"
        }`}
      />
    </div>
  );
}

export function Sidebar() {
  const { isNavigationOpen, setNavigationOpen, isSidebarCollapsed, toggleSidebar } =
    useRadarState();
  const ToggleIcon = isSidebarCollapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden w-[var(--radar-sidebar-width)] border-r border-radar-border bg-gradient-to-b from-[#08131d]/90 to-[#050d14]/90 backdrop-blur-2xl transition-[width] duration-300 xl:flex xl:flex-col ${
          isSidebarCollapsed ? "items-center p-3" : "py-4 px-2"
        }`}
      >
        {!isSidebarCollapsed && <SidebarResizer />}
        <div className="flex flex-1 w-full flex-col overflow-y-auto overflow-x-hidden no-scrollbar pb-2">
          {isSidebarCollapsed ? (
            <>
              <div className="flex shrink-0 justify-center">
                <LogoMark compact />
              </div>
              <NavigationLinks collapsed />
            </>
          ) : (
            <SidebarContent />
          )}
        </div>
        <button
          aria-label={isSidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          aria-expanded={!isSidebarCollapsed}
          data-testid="sidebar-toggle"
          className={`mt-3 shrink-0 flex min-h-9 items-center justify-center gap-2 rounded-lg border border-radar-border bg-white/[0.02] text-[0.72rem] font-bold text-radar-subtle transition-colors hover:border-radar-border-strong hover:text-radar-ink ${
            isSidebarCollapsed ? "w-9" : "w-full"
          }`}
          onClick={toggleSidebar}
          type="button"
        >
          <ToggleIcon className="size-4" strokeWidth={1.8} />
          {!isSidebarCollapsed && "Recolher"}
        </button>
      </aside>
      {isNavigationOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            aria-label="Fechar menu"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setNavigationOpen(false)}
            type="button"
          />
          <aside className="relative flex h-full w-[min(88vw,20rem)] flex-col border-r border-radar-border bg-[#07111a] py-4 px-2 shadow-2xl">
            <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden no-scrollbar pb-2">
              <SidebarContent mobile />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
