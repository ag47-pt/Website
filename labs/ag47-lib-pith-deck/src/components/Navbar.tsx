"use client";

import React from "react";
import { Sparkles, Layers, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  deckCount: number;
}

export function Navbar({ deckCount }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(245,242,235,0.08)] bg-[#090a0d]/85 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand & Lab Edition */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-9 w-9 items-center justify-center border border-[rgba(245,242,235,0.12)] bg-[#12141a] text-[#ff5722] shadow-sm">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-[#f5f2eb]">
                AG47 // LABS
              </span>
              <span className="inline-flex items-center rounded-full border border-[rgba(255,87,34,0.3)] bg-[#ff5722]/10 px-2 py-0.5 text-[10px] font-medium text-[#ff7043]">
                VOL. 2026
              </span>
            </div>
            <p className="text-[11px] text-[#8c877d]">
              Pitch Deck Archive & Strategic Library
            </p>
          </div>
        </div>

        {/* Central Metadata Indicator (Desktop) */}
        <div className="hidden items-center gap-6 md:flex">
          <div className="flex items-center gap-2 border-l border-r border-[rgba(245,242,235,0.08)] px-4 py-1 text-xs text-[#8c877d]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="font-mono text-[11px] text-[#f5f2eb]">
              {deckCount} DECKS
            </span>
            <span className="text-[11px]">INDEXADOS</span>
          </div>
          <div className="text-[11px] font-mono text-[#8c877d]">
            CURADORIA EXECUTIVA
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <a
            href="#mural-decks"
            className="group flex items-center gap-1.5 border border-[rgba(245,242,235,0.12)] bg-[#12141a] px-3.5 py-1.5 text-xs font-medium text-[#f5f2eb] transition-all hover:border-[#ff5722]/40 hover:bg-[#181b22] hover:text-white"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#ff5722]" />
            <span>Navegar Mural</span>
            <ArrowUpRight className="h-3 w-3 text-[#8c877d] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
          </a>
        </div>
      </div>
    </header>
  );
}
