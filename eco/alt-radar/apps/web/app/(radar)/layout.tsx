import type { ReactNode } from "react";
import { AppShell } from "@/eco/alt-radar/apps/web/components/app-shell";

export default function RadarLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
