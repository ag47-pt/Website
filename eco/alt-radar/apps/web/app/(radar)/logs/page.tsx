import type { Metadata } from "next";
import { SystemWorkspace } from "@/components/system-workspace";

export const metadata: Metadata = { title: "Logs" };

export default function LogsPage() {
  return <SystemWorkspace kind="logs" />;
}
