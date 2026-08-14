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
    <div className="grid min-h-44 place-items-center px-6 py-10 text-center font-mono">
      <div>
        <Inbox className="mx-auto mb-3 size-8 text-zinc-600" strokeWidth={1.5} />
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-zinc-400">{message}</p>
      </div>
    </div>
  );
}

export function ErrorState({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div className="grid min-h-44 place-items-center px-6 py-10 text-center font-mono" role="alert">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl backdrop-blur-md">
        <AlertTriangle className="mx-auto mb-3 size-8 text-rose-500" strokeWidth={1.6} />
        <p className="text-sm font-bold text-white">Provider em Modo Demonstração</p>
        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-zinc-400">{message}</p>
        {retry && (
          <button
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:border-[#d1ff00] hover:text-[#d1ff00]"
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
