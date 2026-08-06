"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

type Trace = {
  agent: string;
  role: string;
  detail: string;
  confidence: number;
};

const TRACE: readonly Trace[] = [
  { agent: "ingest.chain", role: "perception", detail: "412 events normalised · provenance attached", confidence: 100 },
  { agent: "ingest.market", role: "perception", detail: "6 venues reconciled · 2 outliers flagged", confidence: 98 },
  { agent: "risk.liquidity", role: "reasoning", detail: "depth model applied · scored 0.71", confidence: 88 },
  { agent: "risk.contract", role: "reasoning", detail: "authority checks passed · 1 warning", confidence: 92 },
  { agent: "verify.alpha", role: "verification", detail: "re-derived from evidence set · agrees", confidence: 95 },
  { agent: "verify.beta", role: "verification", detail: "dissent on liquidity horizon · logged", confidence: 74 },
  { agent: "settle.spl", role: "settlement", detail: "0.0412 AGI debited · 30% burned", confidence: 100 },
];

const ROLE_COLOR: Record<string, string> = {
  perception: "var(--agi-cyan)",
  reasoning: "var(--agi-violet)",
  verification: "var(--agi-plum)",
  settlement: "var(--agi-blue)",
};

/**
 * Mock console showing one request moving through the pipeline.
 * Illustrative of the protocol's shape — it is not connected to a live network.
 */
export function ConsolePanel({ className }: { className?: string }) {
  const [visible, setVisible] = useState(1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const raf = window.requestAnimationFrame(() => setVisible(TRACE.length));
      return () => window.cancelAnimationFrame(raf);
    }

    const interval = window.setInterval(() => {
      setVisible((current) => (current >= TRACE.length ? 1 : current + 1));
    }, 1100);

    return () => window.clearInterval(interval);
  }, []);

  const settled = visible === TRACE.length;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--agi-radius-lg)] border border-[var(--agi-line)] bg-[rgba(8,6,15,0.72)] backdrop-blur-2xl",
        className,
      )}
      style={{ boxShadow: "0 40px 120px -30px rgba(99, 102, 241, 0.35)" }}
    >
      <div className="flex items-center justify-between border-b border-[var(--agi-line)] px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span
              className="agi-pulse-ring absolute inline-flex h-full w-full rounded-full"
              style={{ background: "var(--agi-cyan)" }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ background: "var(--agi-cyan)" }}
            />
          </span>
          <span className="font-mono text-[0.7rem] tracking-[0.18em] text-[var(--agi-subtle)] uppercase">
            organism · request trace
          </span>
        </div>
        <span className="font-mono text-[0.7rem] text-[var(--agi-subtle)]">devnet</span>
      </div>

      <div className="flex flex-col gap-2 px-5 py-5">
        <AnimatePresence initial={false}>
          {TRACE.slice(0, visible).map((trace) => (
            <motion.div
              key={trace.agent}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 rounded-[var(--agi-radius-sm)] border border-white/[0.05] bg-white/[0.02] px-3 py-2.5"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  background: ROLE_COLOR[trace.role],
                  boxShadow: `0 0 10px ${ROLE_COLOR[trace.role]}`,
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-[0.74rem] text-[var(--agi-ink)]">
                  {trace.agent}
                </p>
                <p className="truncate text-[0.72rem] text-[var(--agi-subtle)]">{trace.detail}</p>
              </div>
              <span className="shrink-0 font-mono text-[0.72rem] text-[var(--agi-muted)] tabular-nums">
                {trace.confidence}%
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--agi-line)] px-5 py-3">
        <span className="font-mono text-[0.7rem] text-[var(--agi-subtle)]">
          {settled ? "result verified · dissent recorded" : "processing…"}
        </span>
        <span
          className="font-mono text-[0.7rem] tabular-nums transition-colors duration-500"
          style={{ color: settled ? "var(--agi-cyan)" : "var(--agi-subtle)" }}
        >
          conf 0.91
        </span>
      </div>
    </div>
  );
}
