import type { Metadata } from "next";
import { AlertInbox } from "@/components/alerts/alert-inbox";

export const metadata: Metadata = { title: "Inbox de Alertas" };

export default function AlertsPage() {
  return (
    <div className="space-y-3">
      <header>
        <p className="eyebrow">Mudanças relevantes</p>
        <h1 className="mt-1 text-xl font-extrabold tracking-[-0.04em]">Inbox</h1>
        <p className="mt-1 max-w-2xl text-xs leading-5 text-radar-muted">
          Gerencie os alertas determinísticos gerados pelo motor do Radar. Marque como lido,
          confirme ciência ou dispense os avisos.
        </p>
      </header>
      <AlertInbox />
    </div>
  );
}
