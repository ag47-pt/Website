"use client";

import { useSearchParams } from "next/navigation";
import { AppProviders } from "@/eco/alt-radar/apps/web/app/providers";
import { AppShell } from "@/eco/alt-radar/apps/web/components/app-shell";
import { DashboardView } from "@/eco/alt-radar/apps/web/components/dashboard/dashboard-view";
import { OpportunitiesView } from "@/eco/alt-radar/apps/web/components/opportunities/opportunities-view";
import { WatchlistView } from "@/eco/alt-radar/apps/web/components/watchlist/watchlist-view";
import { AlertInbox } from "@/eco/alt-radar/apps/web/components/alerts/alert-inbox";
import { SystemWorkspace } from "@/eco/alt-radar/apps/web/components/system-workspace";
import AltRadarClient from "./AltRadarClient";

function AltRadarMainContent() {
  const searchParams = useSearchParams();
  const tab = searchParams ? (searchParams.get("tab") || "dashboard") : "dashboard";

  if (tab === "landing") {
    return <AltRadarClient />;
  }

  return (
    <AppShell>
      {tab === "dashboard" && <DashboardView />}
      {tab === "oportunidades" && <OpportunitiesView />}
      {tab === "watchlist" && <WatchlistView />}
      {tab === "alertas" && <AlertInbox />}
      {tab === "logs" && <SystemWorkspace kind="logs" />}
      {tab === "configuracoes" && <SystemWorkspace kind="settings" />}
      {tab === "notificacoes" && <SystemWorkspace kind="notifications" />}
      {["portfolio", "lab", "social", "risco"].includes(tab) && <DashboardView />}
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
