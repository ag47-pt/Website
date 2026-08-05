"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Chain } from "@/lib/api/schemas";

interface RadarStateValue {
  search: string;
  setSearch: (value: string) => void;
  chains: Chain[];
  toggleChain: (chain: Chain) => void;
  clearChains: () => void;
  isNavigationOpen: boolean;
  setNavigationOpen: (isOpen: boolean) => void;
}

const RadarStateContext = createContext<RadarStateValue | null>(null);

export function RadarStateProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [chains, setChains] = useState<Chain[]>([]);
  const [isNavigationOpen, setNavigationOpen] = useState(false);

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
    }),
    [chains, isNavigationOpen, search],
  );

  return <RadarStateContext.Provider value={value}>{children}</RadarStateContext.Provider>;
}

export function useRadarState() {
  const context = useContext(RadarStateContext);
  if (!context) throw new Error("useRadarState deve ser usado dentro de RadarStateProvider.");
  return context;
}
