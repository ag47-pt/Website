"use client";

import React, { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PITCH_DECKS } from "./data";
import { DeckCategory, DeckStatus, PitchDeck } from "./types";
import { HeroSection } from "./components/HeroSection";
import { FilterBar } from "./components/FilterBar";
import { DeckGrid } from "./components/DeckGrid";
import { DeckModal } from "./components/DeckModal";

export function PitchDeckClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<DeckCategory>("Todas");
  const [selectedStatus, setSelectedStatus] = useState<DeckStatus>("Todos");
  const [selectedDeck, setSelectedDeck] = useState<PitchDeck | null>(null);

  // Filtered decks computation
  const filteredDecks = useMemo(() => {
    return PITCH_DECKS.filter((deck) => {
      // 1. Search Query Filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = deck.title.toLowerCase().includes(query);
        const matchesSubtitle = deck.subtitle.toLowerCase().includes(query);
        const matchesDescription = deck.description.toLowerCase().includes(query);
        const matchesAuthor = deck.author.name.toLowerCase().includes(query);
        const matchesTags = deck.tags.some((tag) =>
          tag.toLowerCase().includes(query)
        );
        const matchesCategory = deck.category.toLowerCase().includes(query);

        if (
          !matchesTitle &&
          !matchesSubtitle &&
          !matchesDescription &&
          !matchesAuthor &&
          !matchesTags &&
          !matchesCategory
        ) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== "Todas" && deck.category !== selectedCategory) {
        return false;
      }

      // 3. Status Filter
      if (selectedStatus !== "Todos" && deck.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedStatus]);

  // Modal navigation helpers
  const currentDeckIndex = useMemo(() => {
    if (!selectedDeck) return -1;
    return filteredDecks.findIndex((d) => d.id === selectedDeck.id);
  }, [selectedDeck, filteredDecks]);

  const handlePrevDeck = () => {
    if (filteredDecks.length === 0) return;
    if (currentDeckIndex > 0) {
      setSelectedDeck(filteredDecks[currentDeckIndex - 1]);
    } else {
      setSelectedDeck(filteredDecks[filteredDecks.length - 1]);
    }
  };

  const handleNextDeck = () => {
    if (filteredDecks.length === 0) return;
    if (currentDeckIndex < filteredDecks.length - 1) {
      setSelectedDeck(filteredDecks[currentDeckIndex + 1]);
    } else {
      setSelectedDeck(filteredDecks[0]);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Todas");
    setSelectedStatus("Todos");
  };

  const scrollToMural = () => {
    const muralEl = document.getElementById("mural-decks");
    if (muralEl) {
      muralEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFeaturedClick = () => {
    setSelectedStatus("Em destaque");
    setSelectedCategory("Todas");
    setSearchQuery("");
    scrollToMural();
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex justify-between items-center pb-2">
        <Link
          href="/labs"
          className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          VOLTAR PARA O LABORATÓRIO
        </Link>
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          AG47 // PITCH_DECK_LIBRARY
        </span>
      </div>

      {/* Hero Section */}
      <HeroSection
        totalDecks={PITCH_DECKS.length}
        onExploreClick={scrollToMural}
        onFeaturedClick={handleFeaturedClick}
      />

      {/* Dynamic Sticky Filter & Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        totalFiltered={filteredDecks.length}
        totalAll={PITCH_DECKS.length}
        onResetFilters={handleResetFilters}
      />

      {/* Curated Deck Mural Grid */}
      <DeckGrid
        decks={filteredDecks}
        onSelectDeck={setSelectedDeck}
        onResetFilters={handleResetFilters}
      />

      {/* Full Detail Modal & Interactive Slide Viewer */}
      <DeckModal
        deck={selectedDeck}
        onClose={() => setSelectedDeck(null)}
        onPrevDeck={handlePrevDeck}
        onNextDeck={handleNextDeck}
        hasPrev={filteredDecks.length > 1}
        hasNext={filteredDecks.length > 1}
      />
    </div>
  );
}
