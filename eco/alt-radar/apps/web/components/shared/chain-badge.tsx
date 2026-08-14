import type { Chain } from "@/lib/api/schemas";

const chainConfig: Record<Chain, { label: string; mark: string; className: string }> = {
  bsc: { label: "BSC", mark: "◆", className: "text-radar-warning" },
  solana: { label: "SOL", mark: "≋", className: "text-radar-neutral" },
  ethereum: { label: "ETH", mark: "♦", className: "text-[#a9c6ff]" },
};

export function ChainBadge({ chain }: { chain: Chain }) {
  const config = chainConfig[chain];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-radar-border bg-[#101d27] px-2 py-1 text-[0.65rem] font-extrabold text-radar-ink">
      <span aria-hidden="true" className={config.className}>
        {config.mark}
      </span>
      {config.label}
    </span>
  );
}
