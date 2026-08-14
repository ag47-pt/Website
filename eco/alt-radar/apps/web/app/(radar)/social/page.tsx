import type { Metadata } from "next";
import { SignalWorkspace } from "@/eco/alt-radar/apps/web/components/dashboard/signal-workspace";

export const metadata: Metadata = { title: "Social" };

export default function SocialPage() {
  return <SignalWorkspace kind="social" />;
}
