import type { Metadata } from "next";
import { SignalWorkspace } from "@/components/dashboard/signal-workspace";

export const metadata: Metadata = { title: "Risco" };

export default function RiskPage() {
  return <SignalWorkspace kind="risk" />;
}
