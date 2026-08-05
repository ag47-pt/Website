"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Chain } from "@/lib/api/schemas";

interface RadarStateValue {
  search: string;
  setSearch: (value: string) => void;
  chains: Chain[];
  toggleChain: (chain: Chain) => void;
  clearChains: () => void;
  isNavigationOpen: boolean;
  setNavigationOpen: (isOpen: boolean) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const SIDEBAR_STORAGE_KEY = "ag47-radar-sidebar-collapsed";
const SIDEBAR_EVENT = "ag47-radar-sidebar-change";

function subscribeSidebar(onChange: () => void) {
  window.addEventListener(SIDEBAR_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(SIDEBAR_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readSidebarCollapsed() {
  return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "1";
}

function toggleSidebarCollapsed() {
  window.localStorage.setItem(SIDEBAR_STORAGE_KEY, readSidebarCollapsed() ? "0" : "1");
  window.dispatchEvent(new Event(SIDEBAR_EVENT));
}

const RadarStateContext = createContext<RadarStateValue | null>(null);

export function RadarStateProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [chains, setChains] = useState<Chain[]>([]);
  const [isNavigationOpen, setNavigationOpen] = useState(false);
  const isSidebarCollapsed = useSyncExternalStore(
    subscribeSidebar,
    readSidebarCollapsed,
    () => false,
  );

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--radar-sidebar-width",
      isSidebarCollapsed ? "4.5rem" : "13.5rem",
    );
  }, [isSidebarCollapsed]);

  const value = useMemo<RadarStateValue>(
    () => ({
      search,
      setSearch,
      chains,
      toggleChain: (chain) =>
        setChains((current) =>
          current.includes(chain)
            ? current.filter((currentChain) => currentChain !== chain)
            : [...current, chain],
        ),
      clearChains: () => setChains([]),
      isNavigationOpen,
      setNavigationOpen,
      isSidebarCollapsed,
      toggleSidebar: toggleSidebarCollapsed,
    }),
    [chains, isNavigationOpen, isSidebarCollapsed, search],
  );

  return <RadarStateContext.Provider value={value}>{children}</RadarStateContext.Provider>;
}

export function useRadarState() {
  const context = useContext(RadarStateContext);
  if (!context) throw new Error("useRadarState deve ser usado dentro de RadarStateProvider.");
  return context;
}
