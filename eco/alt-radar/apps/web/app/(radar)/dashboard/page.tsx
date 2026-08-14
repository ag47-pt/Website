import type { Metadata } from "next";
import { DashboardView } from "@/eco/alt-radar/apps/web/components/dashboard/dashboard-view";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return <DashboardView />;
}
