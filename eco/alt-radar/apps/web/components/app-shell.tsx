"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useEcoTheme } from "@/eco/alt-radar/apps/web/lib/use-eco-theme";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { PublicReadOnlyNotice } from "./shared/public-read-only-notice";
import type { RadarNavigationMode } from "../lib/radar-navigation";

interface AppShellProps {
  children: ReactNode;
  navigationMode?: RadarNavigationMode;
}

export function AppShell({ children, navigationMode = "standalone" }: AppShellProps) {
  const { primary } = useEcoTheme();

  return (
    <div
      className="relative min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-clip antialiased"
      style={{ "--primary-color": primary, "--selection-bg": primary } as React.CSSProperties}
    >
      {/* Blueprint Grid Background (same as /eco) */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808020_1px,transparent_1px),linear-gradient(to_bottom,#80808020_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808020_1px,transparent_1px),linear-gradient(to_bottom,#80808020_1px,transparent_1px)] bg-[size:200px_200px] border-l border-t border-gray-800" />
      </div>

      {/* Ambient Nebula Background (matching /eco) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image src="/imgs/universo-nebuloso.webp" alt="" fill className="object-cover" priority />
        </div>
        {/* Dynamic theme-colored glows */}
        <div
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-20 blur-[120px]"
          style={{ backgroundColor: primary }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-15 blur-[150px]"
          style={{ backgroundColor: primary }}
        />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('/noise.png')]" />
      </div>

      <Sidebar navigationMode={navigationMode} />
      <div className="relative z-10 min-w-0 xl:pl-[var(--radar-sidebar-width)] transition-[padding] duration-300">
        <Header />
        <main className="mx-auto w-full max-w-[1760px] p-3 sm:p-5 lg:p-6">
          <PublicReadOnlyNotice />
          {children}
        </main>
      </div>
    </div>
  );
}
