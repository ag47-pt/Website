"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

type CountUpProps = {
  value: number;
  decimals?: number;
  suffix?: string;
  /** Units added per second once the count-up has settled, to suggest live throughput. */
  drift?: number;
  durationMs?: number;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function CountUp({
  value,
  decimals = 0,
  suffix = "",
  drift = 0,
  durationMs = 1600,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  // Vertical-only inset: a percentage applied to all sides would also shrink the
  // root horizontally, and narrow left-aligned counters would never intersect.
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let raf = 0;
    let settled = false;

    const tick = (now: number) => {
      const elapsed = now - start;

      if (reduceMotion || elapsed >= durationMs) {
        settled = true;
        setDisplay(value);
        return;
      }

      setDisplay(value * easeOut(elapsed / durationMs));
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);

    // Throughput drift ticks once per second rather than once per frame, so the
    // counter keeps moving without re-rendering at 60fps for the life of the page.
    const interval =
      drift > 0 && !reduceMotion
        ? window.setInterval(() => {
            if (!settled) return;
            setDisplay((current) => current + drift);
          }, 1000)
        : 0;

    return () => {
      window.cancelAnimationFrame(raf);
      if (interval) window.clearInterval(interval);
    };
  }, [inView, value, durationMs, drift]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
