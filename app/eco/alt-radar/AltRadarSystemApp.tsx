"use client";

import { useSearchParams } from "next/navigation";
import { AppProviders } from "@/eco/alt-radar/apps/web/app/providers";
import { AppShell } from "@/eco/alt-radar/apps/web/components/app-shell";
import { DashboardView } from "@/eco/alt-radar/apps/web/components/dashboard/dashboard-view";
import { OpportunitiesView } from "@/eco/alt-radar/apps/web/components/opportunities/opportunities-view";
import { WatchlistView } from "@/eco/alt-radar/apps/web/components/watchlist/watchlist-view";
import { AlertInbox } from "@/eco/alt-radar/apps/web/components/alerts/alert-inbox";
import { SystemWorkspace } from "@/eco/alt-radar/apps/web/components/system-workspace";
import { PortfolioView } from "@/eco/alt-radar/apps/web/components/portfolio/portfolio-view";
import { LabView } from "@/eco/alt-radar/apps/web/components/lab/lab-view";
import { SocialView } from "@/eco/alt-radar/apps/web/components/social/social-view";
import { RiskView } from "@/eco/alt-radar/apps/web/components/risk/risk-view";
import AltRadarClient from "./AltRadarClient";

function AltRadarMainContent() {
  const searchParams = useSearchParams();
  const tab = searchParams ? searchParams.get("tab") : null;

  // Por padrão ao entrar em /eco/alt-radar, cai direto em EvoPro Specs
  if (!tab || tab === "landing" || tab === "specs") {
    return <AltRadarClient />;
  }

  return (
    <AppShell>
      {tab === "dashboard" && <DashboardView />}
      {tab === "oportunidades" && <OpportunitiesView />}
      {tab === "watchlist" && <WatchlistView />}
      {tab === "alertas" && <AlertInbox />}
      {tab === "portfolio" && <PortfolioView />}
      {tab === "lab" && <LabView />}
      {tab === "social" && <SocialView />}
      {tab === "risco" && <RiskView />}
      {tab === "logs" && <SystemWorkspace kind="logs" />}
      {tab === "configuracoes" && <SystemWorkspace kind="settings" />}
      {tab === "notificacoes" && <SystemWorkspace kind="notifications" />}
    </AppShell>
  );
}

export default function AltRadarSystemApp() {
  return (
    <AppProviders>
      <AltRadarMainContent />
    </AppProviders>
  );
}
