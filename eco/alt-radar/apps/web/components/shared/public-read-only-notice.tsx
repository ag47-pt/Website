import { LockKeyhole } from "lucide-react";
import { PUBLIC_READ_ONLY_DESCRIPTION } from "@/eco/alt-radar/apps/web/lib/public-access";

export function PublicReadOnlyNotice() {
  return (
    <aside
      aria-label="Modo de acesso público"
      className="mb-3 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-amber-100"
      role="status"
    >
      <LockKeyhole aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-amber-300" />
      <p className="text-[0.65rem] leading-5">
        <strong className="mr-1 uppercase tracking-wider">Portal público · somente leitura.</strong>
        {PUBLIC_READ_ONLY_DESCRIPTION}
      </p>
    </aside>
  );
}
