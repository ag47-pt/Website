import { CircleAlert, FlaskConical, History } from "lucide-react";

export function DataBadges({
  demo,
  partial,
  stale,
}: {
  demo?: boolean;
  partial?: boolean;
  stale?: boolean;
}) {
  if (!demo && !partial && !stale) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5" aria-label="Estado dos dados">
      {demo && (
        <span className="inline-flex items-center gap-1 rounded-full border border-radar-warning/30 bg-[#2c220d] px-2 py-1 text-[0.62rem] font-extrabold uppercase tracking-wide text-radar-warning">
          <FlaskConical className="size-3" /> Modo demonstração
        </span>
      )}
      {partial && (
        <span className="inline-flex items-center gap-1 rounded-full border border-radar-neutral/30 bg-[#132840] px-2 py-1 text-[0.62rem] font-extrabold uppercase tracking-wide text-radar-neutral">
          <CircleAlert className="size-3" /> Dados parciais
        </span>
      )}
      {stale && (
        <span className="inline-flex items-center gap-1 rounded-full border border-radar-warning/30 bg-[#2c220d] px-2 py-1 text-[0.62rem] font-extrabold uppercase tracking-wide text-radar-warning">
          <History className="size-3" /> Desatualizados
        </span>
      )}
    </div>
  );
}
