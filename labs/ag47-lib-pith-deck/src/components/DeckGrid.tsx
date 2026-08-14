"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Inbox } from "lucide-react";
import { PitchDeck } from "@/types/deck";
import { DeckCard } from "./DeckCard";

interface DeckGridProps {
  decks: PitchDeck[];
  onSelectDeck: (deck: PitchDeck) => void;
  onResetFilters: () => void;
}

export function DeckGrid({
  decks,
  onSelectDeck,
  onResetFilters,
}: DeckGridProps) {
  if (decks.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-20 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(245,242,235,0.12)] bg-[#12141a] text-[#8c877d]">
          <Inbox className="h-6 w-6" />
        </div>
        <h3 className="font-editorial-title text-2xl text-[#f5f2eb]">
          Nenhum pitch deck encontrado
        </h3>
        <p className="mt-2 text-sm text-[#8c877d]">
          Tente ajustar seus termos de busca ou selecione outra categoria de
          projeto.
        </p>
        <button
          onClick={onResetFilters}
          className="mt-6 inline-flex items-center gap-2 border border-[#ff5722] bg-[#ff5722]/10 px-5 py-2 text-xs font-semibold text-[#ff7043] transition-all hover:bg-[#ff5722] hover:text-white"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Restaurar Todos os Decks</span>
        </button>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Editorial Section Subheading */}
      <div className="mb-6 flex items-center justify-between border-b border-[rgba(245,242,235,0.08)] pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#ff5722]" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#f5f2eb]">
            Mural da Curadoria // Arquivo Ativo
          </span>
        </div>
        <span className="font-mono text-xs text-[#8c877d]">
          ORDENADO POR RELEVÂNCIA
        </span>
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-auto"
      >
        <AnimatePresence mode="popLayout">
          {decks.map((deck, idx) => (
            <DeckCard
              key={deck.id}
              deck={deck}
              onSelect={onSelectDeck}
              index={idx}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
