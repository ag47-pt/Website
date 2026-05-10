import type { ReactNode } from "react";

type OptionalClass = string | undefined | null | false;

function cx(...parts: OptionalClass[]): string {
  return parts.filter(Boolean).join(" ");
}

export const restCardClass =
  "rounded-[24px] border border-white/10 bg-zinc-900/90 p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]";

export const restSubCardClass =
  "rounded-2xl border border-white/10 bg-zinc-800/70 p-4";

export const restChipClass =
  "inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-800/80 px-4 py-2 text-xs font-medium text-zinc-300";

export const restInputClass =
  "w-full rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-lime-300/60 focus:outline-none";

export const restTextareaClass =
  "w-full rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-lime-300/60 focus:outline-none";

export const restSelectClass =
  "w-full rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-2.5 text-sm text-white focus:border-lime-300/60 focus:outline-none";

export const restGhostButtonClass =
  "inline-flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700";

export const restPrimaryButtonClass =
  "inline-flex items-center gap-2 rounded-xl bg-lime-300 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-lime-200";

export function RestDashCard(props: { className?: string; children: ReactNode }) {
  return <section className={cx(restCardClass, props.className)}>{props.children}</section>;
}

export function RestDashSubCard(props: { className?: string; children: ReactNode }) {
  return <section className={cx(restSubCardClass, props.className)}>{props.children}</section>;
}

export function RestChip(props: { className?: string; children: ReactNode }) {
  return <span className={cx(restChipClass, props.className)}>{props.children}</span>;
}
