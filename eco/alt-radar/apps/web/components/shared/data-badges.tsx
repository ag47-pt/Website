"use client";

import { CircleAlert, FlaskConical, History } from "lucide-react";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";

export function DataBadges({
  demo,
  partial,
  stale,
}: {
  demo?: boolean;
  partial?: boolean;
  stale?: boolean;
}) {
  const { primary } = useEcoTheme();

  if (!demo && !partial && !stale) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5" aria-label="Estado dos dados">
      {demo && (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[0.62rem] font-mono font-bold uppercase tracking-wider text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
          <FlaskConical className="size-3 text-amber-400" /> Modo Demonstração
        </span>
      )}
      {partial && (
        <span
          className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.62rem] font-mono font-bold uppercase tracking-wider"
          style={{
            borderColor: `${primary}50`,
            backgroundColor: `${primary}15`,
            color: primary,
            boxShadow: `0 0 10px ${primary}20`,
          }}
        >
          <CircleAlert className="size-3" style={{ color: primary }} /> Dados Parciais
        </span>
      )}
      {stale && (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[0.62rem] font-mono font-bold uppercase tracking-wider text-amber-300">
          <History className="size-3 text-amber-400" /> Desatualizados
        </span>
      )}
    </div>
  );
}
