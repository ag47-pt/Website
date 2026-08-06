import { site } from "@/lib/content";

export function Logo() {
  return (
    <a href="#top" className="flex items-center gap-3">
      <span
        aria-hidden
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--agi-line-strong)]"
        style={{
          background: "linear-gradient(140deg, rgba(139,92,246,0.32), rgba(34,211,238,0.14))",
          boxShadow: "0 0 22px rgba(139, 92, 246, 0.32)",
        }}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="3" fill="var(--agi-plum)" />
          <circle cx="12" cy="12" r="8" stroke="var(--agi-plum)" strokeOpacity="0.5" />
          <circle cx="12" cy="4" r="1.6" fill="var(--agi-cyan)" />
          <circle cx="19" cy="16" r="1.6" fill="var(--agi-cyan)" />
          <circle cx="5" cy="16" r="1.6" fill="var(--agi-cyan)" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-sm font-semibold tracking-tight">
          {site.name} <span className="text-[var(--agi-subtle)]">({site.ticker})</span>
        </span>
        <span className="mt-1 font-mono text-[0.6rem] tracking-[0.18em] text-[var(--agi-subtle)] uppercase">
          {site.organism}
        </span>
      </span>
    </a>
  );
}
