import type { Metadata } from "next";
import { SystemWorkspace } from "@/components/system-workspace";

export const metadata: Metadata = { title: "Notificações" };

export default function NotificationsPage() {
  return <SystemWorkspace kind="notifications" />;
}
