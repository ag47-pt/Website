"use client";

import Link from "next/link";
import { useMemo, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  BookOpenText,
  CalendarDays,
  ChartPie,
  Code2,
  ExternalLink,
  Globe2,
  Settings,
  UtensilsCrossed,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import type { RestLocale } from "@/lib/rest/types";
import {
  restGhostButtonClass,
  restPrimaryButtonClass,
} from "@/components/rest/dashboard-primitives";

type DashboardShellProps = {
  locale: RestLocale;
  appName: string;
  children: React.ReactNode;
};

type HeaderMeta = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
};

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
};

function withAlpha(hex: string, alpha: number): string {
  const clean = hex.replace("#", "").trim();
  const value =
    clean.length === 3
      ? clean
          .split("")
          .map((part) => `${part}${part}`)
          .join("")
      : clean;

  if (!/^[\da-fA-F]{6}$/.test(value)) {
    return `rgba(209,255,0,${alpha})`;
  }

  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function resolveHeader(pathname: string, locale: RestLocale): HeaderMeta {
  const base = `/rest/${locale}/dashboard`;

  if (pathname.startsWith(`${base}/reservas/`)) {
    return {
      title: "Detalhe da Reserva",
      subtitle: "Contexto completo da reserva, historico e notas internas.",
      ctaLabel: "Voltar para Reservas",
      ctaHref: `${base}/reservas`,
    };
  }

  if (pathname.startsWith(`${base}/reservas`)) {
    return {
      title: "Lista de Reservas",
      subtitle: "Gerencie status, horarios, alocacao de mesas e espera.",
      ctaLabel: "Nova Reserva",
      ctaHref: `${base}/reservas`,
    };
  }

  if (pathname.startsWith(`${base}/agenda`)) {
    return {
      title: "Agenda e Calendario",
      subtitle: "Controle bloqueios, conflitos e capacidade semanal.",
      ctaLabel: "Novo Bloqueio",
      ctaHref: `${base}/agenda`,
    };
  }

  if (pathname.startsWith(`${base}/configuracoes`)) {
    return {
      title: "Configuracoes",
      subtitle: "Perfil do restaurante, regras de reserva e integracoes.",
      ctaLabel: "Salvar Alteracoes",
      ctaHref: `${base}/configuracoes`,
    };
  }

  if (pathname.startsWith(`${base}/pagina-publica`)) {
    return {
      title: "Pagina Publica",
      subtitle: "Preview da experiencia do cliente e fluxo de reservas.",
      ctaLabel: "Abrir Pagina",
      ctaHref: `${base}/pagina-publica`,
    };
  }

  if (pathname.startsWith(`${base}/widget`)) {
    return {
      title: "Widget e Embed",
      subtitle: "Configuracao visual e codigo para incorporar no site.",
      ctaLabel: "Copiar Embed",
      ctaHref: `${base}/widget`,
    };
  }

  return {
    title: "Visao Geral",
    subtitle: "Acompanhe desempenho operacional e alertas em tempo real.",
    ctaLabel: "Abrir Reservas",
    ctaHref: `${base}/reservas`,
  };
}

export function RestDashboardShell({ locale, appName, children }: DashboardShellProps) {
  const pathname = usePathname();
  const { theme } = useTheme();

  const accent = theme.colors.primary;
  const accentSoft = withAlpha(accent, 0.12);
  const accentBorder = withAlpha(accent, 0.3);
  const accentGlow = withAlpha(accent, 0.22);

  const styleVars = useMemo(() => {
    return {
      "--rest-accent": accent,
      "--rest-accent-soft": accentSoft,
      "--rest-accent-border": accentBorder,
      "--rest-accent-glow": accentGlow,
    } as CSSProperties;
  }, [accent, accentBorder, accentGlow, accentSoft]);

  const navItems = useMemo<NavItem[]>(() => {
    const base = `/rest/${locale}/dashboard`;

    return [
      {
        label: "Dashboard",
        href: base,
        icon: ChartPie,
        isActive: pathname === base,
      },
      {
        label: "Reservas",
        href: `${base}/reservas`,
        icon: BookOpenText,
        isActive: pathname.startsWith(`${base}/reservas`),
      },
      {
        label: "Agenda",
        href: `${base}/agenda`,
        icon: CalendarDays,
        isActive: pathname.startsWith(`${base}/agenda`),
      },
      {
        label: "Configuracoes",
        href: `${base}/configuracoes`,
        icon: Settings,
        isActive: pathname.startsWith(`${base}/configuracoes`),
      },
      {
        label: "Pagina Publica",
        href: `${base}/pagina-publica`,
        icon: Globe2,
        isActive: pathname.startsWith(`${base}/pagina-publica`),
      },
      {
        label: "Widget",
        href: `${base}/widget`,
        icon: Code2,
        isActive: pathname.startsWith(`${base}/widget`),
      },
    ];
  }, [locale, pathname]);

  const header = useMemo(() => resolveHeader(pathname, locale), [locale, pathname]);

  return (
    <div className="rest-skin rest-mesh-bg min-h-screen text-white" style={styleVars}>
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-zinc-950/80 backdrop-blur-xl lg:flex">
          <div className="border-b border-white/5 p-6">
            <Link href={`/rest/${locale}/dashboard`} className="group inline-flex w-full items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-900"
                style={{ boxShadow: `0 0 20px ${accentGlow}` }}
              >
                <UtensilsCrossed className="h-5 w-5" style={{ color: accent }} />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Rest.AG</p>
                <p className="font-semibold text-white">{appName}</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                  style={
                    item.isActive
                      ? {
                          color: accent,
                          borderColor: accentBorder,
                          backgroundColor: accentSoft,
                        }
                      : undefined
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/5 p-4">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900/80 p-3">
              <div>
                <p className="text-sm font-medium text-white">Sarah Jenkins</p>
                <p className="text-xs text-zinc-500">Manager</p>
              </div>
              <button
                type="button"
                className="rounded-lg border border-white/10 p-2 text-zinc-500 transition hover:text-white"
                aria-label="Sair"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        <main className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/5 bg-black/70 px-4 py-5 backdrop-blur-xl sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-white sm:text-3xl">{header.title}</h1>
                <p className="mt-1 text-sm text-zinc-400">{header.subtitle}</p>
              </div>

              <div className="flex items-center gap-3">
                <Link href={header.ctaHref} className={restPrimaryButtonClass}>
                  {header.ctaLabel}
                </Link>
                <button type="button" className={restGhostButtonClass}>
                  <Bell className="h-4 w-4" />
                  <span>Alertas</span>
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1600px] flex-1 p-4 sm:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
