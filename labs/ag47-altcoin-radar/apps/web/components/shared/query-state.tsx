import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";

export function PanelSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div aria-busy="true" aria-label="A carregar dados" className="space-y-3 p-4">
      <div className="skeleton h-5 w-40" />
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="skeleton h-12 w-full" />
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
    <div className="grid min-h-44 place-items-center px-6 py-10 text-center">
      <div>
        <Inbox className="mx-auto mb-3 size-7 text-radar-subtle" strokeWidth={1.5} />
        <p className="text-sm font-bold text-radar-ink">{title}</p>
        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-radar-muted">{message}</p>
      </div>
    </div>
  );
}

export function ErrorState({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div className="grid min-h-44 place-items-center px-6 py-10 text-center" role="alert">
      <div>
        <AlertTriangle className="mx-auto mb-3 size-7 text-radar-critical" strokeWidth={1.6} />
        <p className="text-sm font-bold text-radar-ink">Provider indisponível</p>
        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-radar-muted">{message}</p>
        {retry && (
          <button
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-radar-border bg-[#0d1c26] px-3 py-2 text-xs font-bold text-radar-ink hover:border-radar-positive/40"
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
