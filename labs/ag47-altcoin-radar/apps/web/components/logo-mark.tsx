import { RadioTower } from "lucide-react";

export function LogoMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-radar-positive/35 bg-[#0b2119] text-radar-positive">
        <RadioTower aria-hidden="true" className="size-6" strokeWidth={1.8} />
      </span>
      {!compact && (
        <span className="min-w-0">
          <span className="block truncate text-[1.04rem] font-extrabold tracking-[-0.035em] text-radar-ink">
            AG47 <span className="font-semibold">Altcoin Radar</span>
          </span>
          <span className="mt-0.5 block text-[0.58rem] font-bold uppercase tracking-[0.18em] text-radar-subtle">
            Intelligence desk
          </span>
        </span>
      )}
    </div>
  );
}
