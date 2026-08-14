import type { ReactNode } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="min-w-0 xl:pl-[var(--radar-sidebar-width)]">
        <Header />
        <main className="mx-auto w-full max-w-[1760px] p-3 sm:p-5">{children}</main>
      </div>
    </div>
  );
}
