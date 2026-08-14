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
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEvolution } from "@/eco/alt-radar/apps/web/lib/api/query";
import { evolution as evolutionFallback } from "@/eco/alt-radar/apps/web/lib/evolution";
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
      className="rounded-xl border border-zinc-800/80 bg-zinc-900/80 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md"
    >
      <p className="eyebrow text-[0.58rem] text-zinc-400">Motor de evolução</p>
      <div className="mt-1.5 flex items-center gap-2 text-xs font-bold text-white">
        <span className="size-2 animate-pulse rounded-full bg-[#d1ff00] shadow-[0_0_0_4px_rgba(209,255,0,0.15),0_0_12px_rgba(209,255,0,0.6)]" />
        {evolution.phase} • {evolution.phaseTitle}
      </div>
      <p className="mt-1.5 text-[0.68rem] leading-4.5 text-zinc-400">{evolution.now}</p>
      <div
        role="progressbar"
        aria-label="Progresso da fase fundacional"
        aria-valuenow={evolution.completedSteps}
        aria-valuemin={0}
        aria-valuemax={evolution.totalSteps}
        className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-zinc-800"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#d1ff00]/60 to-[#d1ff00] shadow-[0_0_10px_rgba(209,255,0,0.6)] transition-[width] duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-1 flex items-center justify-between text-[0.58rem] font-mono font-bold text-zinc-400">
        <span>
          {evolution.completedSteps}/{evolution.totalSteps} sprints
        </span>
        <span className="text-[#d1ff00]">{progress}%</span>
      </div>
      <p className="mt-2 border-t border-zinc-800/80 pt-2 text-[0.6rem] leading-4 text-zinc-500">
        <span className="font-bold text-zinc-400">Norte:</span> {evolution.goal}
      </p>
    </div>
  );
}

const navigation = [
  { tab: "dashboard", label: "Dashboard", icon: Gauge },
  { tab: "oportunidades", label: "Oportunidades", icon: ChartNoAxesCombined },
  { tab: "alertas", label: "Alertas", icon: Bell },
  { tab: "portfolio", label: "Portfolio", icon: Briefcase },
  { tab: "lab", label: "Laboratório", icon: FlaskConical },
  { tab: "social", label: "Social", icon: UsersRound },
  { tab: "risco", label: "Risco", icon: ShieldAlert },
  { tab: "watchlist", label: "Watchlist", icon: Star },
  { tab: "notificacoes", label: "Notificações", icon: BellRing },
  { tab: "logs", label: "Logs", icon: FileClock },
  { tab: "configuracoes", label: "Configurações", icon: Settings2 },
  { tab: "landing", label: "EvoPro Showcase", icon: Sparkles },
] as const;

function NavigationLinks({ collapsed = false }: { collapsed?: boolean }) {
  const searchParams = useSearchParams();
  const currentTab = searchParams ? (searchParams.get("tab") || "dashboard") : "dashboard";
  const { setNavigationOpen } = useRadarState();

  return (
    <nav aria-label="Navegação principal" className="mt-6 flex flex-1 flex-col gap-1 shrink-0 font-mono">
      {navigation.map(({ tab, label, icon: Icon }) => {
        const href = tab === "landing" ? "/eco/alt-radar" : `/eco/alt-radar?tab=${tab}`;
        const isActive = currentTab === tab;
        return (
          <Link
            key={tab}
            aria-current={isActive ? "page" : undefined}
            data-testid={`nav-${tab}`}
            title={collapsed ? label : undefined}
            className={`group relative flex min-h-9 items-center gap-3 rounded-xl text-[0.8rem] font-semibold transition-all duration-200 ${
              collapsed ? "justify-center px-0" : "px-3"
            } ${
              isActive
                ? "bg-zinc-900 text-white shadow-[0_0_18px_rgba(209,255,0,0.08)] ring-1 ring-[#d1ff00]/30"
                : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
            } ${!isActive && !collapsed ? "hover:translate-x-0.5" : ""}`}
            href={href}
            onClick={() => setNavigationOpen(false)}
          >
            {isActive && (
              <span className="absolute inset-y-2 -left-2.5 w-1 rounded-full bg-[#d1ff00] shadow-[0_0_10px_rgba(209,255,0,0.8)]" />
            )}
            <Icon
              aria-hidden="true"
              className={`size-[1.15rem] shrink-0 transition-colors ${isActive ? "text-[#d1ff00]" : "text-zinc-500 group-hover:text-zinc-300"}`}
              strokeWidth={1.8}
            />
            {!collapsed && <span className="truncate">{label}</span>}
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
            className="grid size-9 place-items-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
            onClick={() => setNavigationOpen(false)}
            type="button"
          >
            <X className="size-5" />
          </button>
        )}
      </div>
      <NavigationLinks />
      <div className="mt-6 shrink-0">
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
        isDragging ? "bg-[#d1ff00]/30" : "hover:bg-zinc-700/50 bg-transparent"
      }`}
      onMouseDown={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
    >
      <div
        className={`absolute top-1/2 -translate-y-1/2 -left-0.5 w-1 h-8 rounded-full transition-colors ${
          isDragging ? "bg-[#d1ff00]" : "bg-zinc-700 opacity-0 group-hover:opacity-100"
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
        className={`fixed inset-y-0 left-0 z-30 hidden w-[var(--radar-sidebar-width)] border-r border-zinc-800/80 bg-zinc-950/95 backdrop-blur-2xl transition-[width] duration-300 xl:flex xl:flex-col ${
          isSidebarCollapsed ? "items-center p-3" : "py-4 px-3"
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
          className={`mt-3 shrink-0 flex min-h-9 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 text-[0.72rem] font-mono font-bold text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white ${
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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setNavigationOpen(false)}
            type="button"
          />
          <aside className="relative flex h-full w-[min(88vw,20rem)] flex-col border-r border-zinc-800 bg-zinc-950 py-4 px-3 shadow-2xl">
            <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden no-scrollbar pb-2">
              <SidebarContent mobile />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
