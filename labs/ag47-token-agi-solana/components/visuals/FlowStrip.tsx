import { ArrowRight, Boxes, CircleCheck, Coins, MessageSquare, User } from "lucide-react";

const STAGES = [
  { id: "user", label: "User", detail: "signs intent", icon: User },
  { id: "request", label: "Request", detail: "budget + confidence", icon: MessageSquare },
  { id: "agents", label: "Agents", detail: "process + verify", icon: Boxes },
  { id: "result", label: "Result", detail: "delivered with proof", icon: CircleCheck },
  { id: "token", label: "AGI", detail: "metered + burned", icon: Coins },
] as const;

/** Condensed left-to-right lifecycle strip shown above the detailed steps. */
export function FlowStrip() {
  return (
    <ol className="flex flex-col gap-3 md:flex-row md:items-stretch">
      {STAGES.map((stage, index) => {
        const Icon = stage.icon;
        const isLast = index === STAGES.length - 1;

        return (
          <li key={stage.id} className="flex flex-1 items-center gap-3">
            <div className="flex flex-1 flex-col gap-3 rounded-[var(--agi-radius-md)] border border-[var(--agi-line)] bg-white/[0.03] p-5 backdrop-blur-xl">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--agi-line-strong)]"
                style={{ background: "rgba(139, 92, 246, 0.12)" }}
              >
                <Icon aria-hidden className="h-4 w-4" style={{ color: "var(--agi-plum)" }} />
              </span>
              <div>
                <p className="text-sm font-semibold tracking-tight">{stage.label}</p>
                <p className="font-mono text-[0.68rem] text-[var(--agi-subtle)]">{stage.detail}</p>
              </div>
            </div>
            {!isLast ? (
              <ArrowRight
                aria-hidden
                className="hidden h-4 w-4 shrink-0 text-[var(--agi-faint)] md:block"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
