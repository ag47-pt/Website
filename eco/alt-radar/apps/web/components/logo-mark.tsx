"use client";

import Link from "next/link";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";
import {
  getRadarHref,
  type RadarNavigationMode,
} from "@/eco/alt-radar/apps/web/lib/radar-navigation";

interface LogoMarkProps {
  compact?: boolean;
  navigationMode?: RadarNavigationMode;
}

export function LogoMark({ compact = false, navigationMode = "standalone" }: LogoMarkProps) {
  const { primary } = useEcoTheme();

  return (
    <Link
      href={getRadarHref("dashboard", navigationMode)}
      className="flex items-center gap-3 group transition-transform hover:scale-[1.02]"
    >
      {/* Brand Icon Badge - Following E47 / L47 Eco/Labs Pattern */}
      <div
        className="w-9 h-9 flex items-center justify-center font-black text-black text-[10px] hover:scale-110 transition-transform rounded-xl shadow-lg shrink-0"
        style={{ backgroundColor: primary, boxShadow: `0 0 16px ${primary}40` }}
      >
        E47
      </div>

      {!compact && (
        <div className="hidden sm:block min-w-0">
          <span className="text-[9px] block leading-none text-zinc-500 font-mono tracking-widest uppercase">
            ECOSYSTEM_RADAR
          </span>
          <span className="text-xs font-black tracking-[0.2em] uppercase text-white group-hover:text-white/80 transition-colors flex items-center gap-1.5 mt-0.5">
            Alt Radar
            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded tracking-widest font-black uppercase bg-black/60 text-white border border-white/10">
              READ ONLY
            </span>
          </span>
        </div>
      )}
    </Link>
  );
}
