import type { ReactNode } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-[#d1ff00] selection:text-black font-sans overflow-x-hidden antialiased">
      {/* Blueprint Grid Background (EvoPro Standard) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
            linear-gradient(to right, rgba(209, 255, 0, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(209, 255, 0, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 40px 40px, 200px 200px, 200px 200px'
        }}
      />

      {/* Subtle Ambient Radial Lighting */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-[#d1ff00]/[0.025] to-transparent blur-3xl pointer-events-none z-0"
      />

      <Sidebar />
      <div className="relative z-10 min-w-0 xl:pl-[var(--radar-sidebar-width)] transition-[padding] duration-300">
        <Header />
        <main className="mx-auto w-full max-w-[1760px] p-3 sm:p-5 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
