import { cn } from "@/lib/cn";

/** Soft, slow-drifting colour fields used as atmosphere behind sections. */
export function Aurora({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className="agi-drift absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full opacity-45 blur-[130px]"
        style={{
          background: "radial-gradient(circle, var(--agi-violet) 0%, transparent 62%)",
        }}
      />
      <div
        className="agi-drift absolute -right-32 top-1/3 h-[30rem] w-[30rem] rounded-full opacity-30 blur-[120px]"
        style={{
          animationDelay: "-6s",
          background: "radial-gradient(circle, var(--agi-cyan) 0%, transparent 65%)",
        }}
      />
      <div
        className="agi-drift absolute -left-40 bottom-0 h-[34rem] w-[34rem] rounded-full opacity-25 blur-[130px]"
        style={{
          animationDelay: "-12s",
          background: "radial-gradient(circle, var(--agi-indigo) 0%, transparent 65%)",
        }}
      />
    </div>
  );
}
