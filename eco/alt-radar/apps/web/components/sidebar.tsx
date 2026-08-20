"use client";

import { useEffect, useState } from "react";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";

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
import {
  getRadarHref,
  getStandaloneRadarTab,
  type RadarNavigationMode,
} from "@/eco/alt-radar/apps/web/lib/radar-navigation";

function EvolutionCard() {
  const { data } = useEvolution();
  const { primary } = useEcoTheme();
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
      className="rounded-2xl border border-white/10 bg-white/5 p-3.5 shadow-xl backdrop-blur-xl hover:border-white/20 transition-all group"
    >
      <div className="flex items-center justify-between">
        <p className="text-[8px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400">
          MOTOR DE EVOLUÇÃO
        </p>
        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded tracking-widest font-black uppercase bg-black/60 text-white border border-white/10">
          v1.0
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs font-black text-white tracking-wide uppercase font-sans">
        <span
          className="size-2 animate-pulse rounded-full shrink-0"
          style={{
            backgroundColor: primary,
            boxShadow: `0 0 0 4px ${primary}25, 0 0 12px ${primary}`,
          }}
        />
        <span className="truncate">
          {evolution.phase} • {evolution.phaseTitle}
        </span>
      </div>

      <p className="mt-1.5 text-[10px] leading-4 text-zinc-400 font-mono line-clamp-2">
        {evolution.now}
      </p>

      <div
        role="progressbar"
        aria-label="Progresso da fase fundacional"
        aria-valuenow={evolution.completedSteps}
        aria-valuemin={0}
        aria-valuemax={evolution.totalSteps}
        className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10 relative"
      >
        <div
          className="h-full rounded-full transition-[width] duration-700 relative"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(to right, ${primary}, ${primary}90)`,
            boxShadow: `0 0 10px ${primary}80`,
          }}
        />
      </div>

      <div className="mt-1.5 flex items-center justify-between text-[9px] font-mono font-bold text-zinc-400">
        <span>
          {evolution.completedSteps}/{evolution.totalSteps} etapas
        </span>
        <span style={{ color: primary }} className="font-black">
          {progress}%
        </span>
      </div>

      <p className="mt-2 border-t border-white/5 pt-2 text-[9px] leading-3.5 text-zinc-400 font-mono line-clamp-2">
        <span className="font-bold text-zinc-300">NORTE:</span> {evolution.goal}
      </p>
    </div>
  );
}

interface NavItem {
  tab: string;
  label: string;
  icon: typeof Gauge;
  badge?: string;
}

const navigation: readonly NavItem[] = [
  { tab: "dashboard", label: "Dashboard", icon: Gauge, badge: "CORE" },
  { tab: "oportunidades", label: "Oportunidades", icon: ChartNoAxesCombined, badge: "READ" },
  { tab: "alertas", label: "Alertas", icon: Bell },
  { tab: "portfolio", label: "Portfolio", icon: Briefcase },
  { tab: "lab", label: "Laboratório", icon: FlaskConical },
  { tab: "social", label: "Social", icon: UsersRound },
  { tab: "risco", label: "Risco", icon: ShieldAlert },
  { tab: "watchlist", label: "Watchlist", icon: Star },
  { tab: "notificacoes", label: "Notificações", icon: BellRing },
  { tab: "logs", label: "Logs", icon: FileClock },
  { tab: "configuracoes", label: "Configurações", icon: Settings2 },
  { tab: "landing", label: "EvoPro Specs", icon: Sparkles, badge: "EVO" },
];

function NavigationLinks({
  collapsed = false,
  navigationMode,
}: {
  collapsed?: boolean;
  navigationMode: RadarNavigationMode;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentTab =
    navigationMode === "embedded"
      ? searchParams?.get("tab") || "landing"
      : getStandaloneRadarTab(pathname);
  const { setNavigationOpen } = useRadarState();
  const { primary } = useEcoTheme();

  return (
    <nav
      aria-label="Navegação principal"
      className="mt-5 flex flex-1 flex-col gap-1 shrink-0 font-mono"
    >
      {navigation.map(({ tab, label, icon: Icon, badge }) => {
        const href = getRadarHref(tab, navigationMode);
        const isActive = currentTab === tab;
        return (
          <Link
            key={tab}
            aria-current={isActive ? "page" : undefined}
            data-testid={`nav-${tab}`}
            title={collapsed ? label : undefined}
            className={`group relative flex min-h-9 items-center gap-3 rounded-xl text-[10px] font-bold tracking-[0.14em] uppercase transition-all duration-200 ${
              collapsed ? "justify-center px-0" : "px-3 py-2"
            } ${
              isActive
                ? "font-black border"
                : "text-white/70 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10"
            } ${!isActive && !collapsed ? "hover:translate-x-0.5" : ""}`}
            href={href}
            onClick={() => setNavigationOpen(false)}
            style={
              isActive
                ? {
                    borderColor: `${primary}50`,
                    backgroundColor: `${primary}15`,
                    color: primary,
                    boxShadow: `0 0 16px ${primary}25`,
                  }
                : {}
            }
          >
            {isActive && (
              <span
                className="absolute inset-y-1.5 -left-1.5 w-1 rounded-r-full"
                style={{ backgroundColor: primary, boxShadow: `0 0 10px ${primary}` }}
              />
            )}
            <Icon
              aria-hidden="true"
              className={`size-4 shrink-0 transition-colors ${!isActive ? "text-zinc-400 group-hover:text-white" : ""}`}
              strokeWidth={isActive ? 2.2 : 1.8}
              style={isActive ? { color: primary } : {}}
            />
            {!collapsed && (
              <div className="flex items-center justify-between flex-1 min-w-0">
                <span className="truncate">{label}</span>
                {badge && (
                  <span
                    className={`text-[8px] font-mono px-1.5 py-0.2 rounded tracking-widest font-black uppercase ${
                      isActive
                        ? "bg-black/60 text-white border border-white/20"
                        : "bg-white/5 text-zinc-400 border border-white/5 group-hover:text-zinc-200"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </div>
            )}
            {collapsed && <span className="sr-only">{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarContent({
  mobile = false,
  navigationMode,
}: {
  mobile?: boolean;
  navigationMode: RadarNavigationMode;
}) {
  const { setNavigationOpen } = useRadarState();
  return (
    <>
      <div className="flex items-center justify-between shrink-0 pb-2 border-b border-white/10">
        <LogoMark navigationMode={navigationMode} />
        {mobile && (
          <button
            aria-label="Fechar menu"
            className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setNavigationOpen(false)}
            type="button"
          >
            <X className="size-5" />
          </button>
        )}
      </div>
      <NavigationLinks navigationMode={navigationMode} />
      <div className="mt-5 shrink-0">
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
      // 180px min, 480px max
      const newWidth = Math.min(Math.max(e.clientX, 180), 480);
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
        isDragging ? "bg-white/20" : "hover:bg-white/10 bg-transparent"
      }`}
      onMouseDown={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
    >
      <div
        className={`absolute top-1/2 -translate-y-1/2 -left-0.5 w-1 h-8 rounded-full transition-colors ${
          isDragging ? "bg-white/60" : "bg-zinc-600 opacity-0 group-hover:opacity-100"
        }`}
      />
    </div>
  );
}

export function Sidebar({
  navigationMode = "standalone",
}: {
  navigationMode?: RadarNavigationMode;
}) {
  const { isNavigationOpen, setNavigationOpen, isSidebarCollapsed, toggleSidebar } =
    useRadarState();
  const ToggleIcon = isSidebarCollapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden w-[var(--radar-sidebar-width)] border-r border-white/20 bg-white/5 backdrop-blur-2xl shadow-2xl transition-[width] duration-300 xl:flex xl:flex-col ${
          isSidebarCollapsed ? "items-center p-3" : "py-4 px-3.5"
        }`}
      >
        {/* Glass shine beam effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-[150%] bg-gradient-to-b from-transparent via-white/[0.04] to-transparent animate-glass-shine mix-blend-overlay" />
        </div>

        {!isSidebarCollapsed && <SidebarResizer />}
        <div className="relative z-10 flex flex-1 w-full flex-col overflow-y-auto overflow-x-hidden no-scrollbar pb-2">
          {isSidebarCollapsed ? (
            <>
              <div className="flex shrink-0 justify-center pb-2 border-b border-white/10">
                <LogoMark compact navigationMode={navigationMode} />
              </div>
              <NavigationLinks collapsed navigationMode={navigationMode} />
            </>
          ) : (
            <SidebarContent navigationMode={navigationMode} />
          )}
        </div>
        <button
          aria-label={isSidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          aria-expanded={!isSidebarCollapsed}
          data-testid="sidebar-toggle"
          className={`relative z-10 mt-3 shrink-0 flex min-h-9 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-400 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white ${
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
          <aside className="relative flex h-full w-[min(88vw,20rem)] flex-col border-r border-white/20 bg-[#0a0a0a]/95 backdrop-blur-2xl py-4 px-3.5 shadow-2xl">
            <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden no-scrollbar pb-2">
              <SidebarContent mobile navigationMode={navigationMode} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
