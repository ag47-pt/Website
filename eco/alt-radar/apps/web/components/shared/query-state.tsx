"use client";

import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";

export function PanelSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div aria-busy="true" aria-label="A carregar dados" className="space-y-3 p-4">
      <div className="h-5 w-40 animate-pulse rounded-xl bg-white/5" />
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-12 w-full animate-pulse rounded-xl bg-white/5" />
      ))}
    </div>
  );
}

export function EmptyState({
  title = "Nenhum dado encontrado",
  message = "Ajuste os filtros ou aguarde a próxima sincronização.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="grid min-h-44 place-items-center px-6 py-10 text-center font-mono">
      <div>
        <Inbox className="mx-auto mb-3 size-8 text-zinc-500" strokeWidth={1.5} />
        <p className="text-sm font-bold text-white font-sans">{title}</p>
        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-zinc-400">{message}</p>
      </div>
    </div>
  );
}

export function ErrorState({ message, retry }: { message: string; retry?: () => void }) {
  const { primary } = useEcoTheme();

  return (
    <div className="grid min-h-44 place-items-center px-6 py-10 text-center font-mono" role="alert">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
        <AlertTriangle className="mx-auto mb-3 size-8 text-rose-400" strokeWidth={1.6} />
        <p className="text-sm font-bold text-white font-sans">Provider em Modo Demonstração</p>
        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-zinc-400">{message}</p>
        {retry && (
          <button
            className="mt-4 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer"
            style={{
              borderColor: `${primary}50`,
              backgroundColor: `${primary}15`,
              color: primary,
              boxShadow: `0 0 12px ${primary}20`,
            }}
            onClick={retry}
            type="button"
          >
            <RefreshCw className="size-3.5" /> Tentar novamente
          </button>
        )}
      </div>
    </div>
  );
}
