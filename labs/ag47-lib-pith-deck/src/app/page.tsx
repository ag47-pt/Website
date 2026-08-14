"use client";

import React, { useState, useMemo } from "react";
import { PITCH_DECKS } from "@/data/decks";
import { DeckCategory, DeckStatus, PitchDeck } from "@/types/deck";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FilterBar } from "@/components/FilterBar";
import { DeckGrid } from "@/components/DeckGrid";
import { DeckModal } from "@/components/DeckModal";
import { Footer } from "@/components/Footer";

export default function PitchDeckLibraryPage() {
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
    <main className="min-h-screen bg-[#090a0d] text-[#f5f2eb] relative selection:bg-[#ff5722] selection:text-white">
      {/* Top Navbar */}
      <Navbar deckCount={PITCH_DECKS.length} />

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

      {/* Editorial Footer */}
      <Footer />
    </main>
  );
}
