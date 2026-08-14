import type { Metadata } from "next";
import { SystemWorkspace } from "@/eco/alt-radar/apps/web/components/system-workspace";

export const metadata: Metadata = { title: "Configurações" };

export default function SettingsPage() {
  return <SystemWorkspace kind="settings" />;
}
