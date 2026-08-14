'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { LibraryEntry } from '@/eco/youlearn/schema/types';
import { filterKnowledgeEntries } from '@/eco/youlearn/lib/library';
import { YouLearnNavbar } from './components/YouLearnNavbar';
import { YouLearnHero } from './components/YouLearnHero';
import { KnowledgeFilters } from './components/KnowledgeFilters';
import { KnowledgeCard } from './components/KnowledgeCard';
import { LibraryEmptyState } from './components/LibraryEmptyState';
import { Sparkles, Layers, BookOpen, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface YouLearnLibraryClientProps {
  initialEntries: LibraryEntry[];
  categories: string[];
}

export function YouLearnLibraryClient({ initialEntries, categories }: YouLearnLibraryClientProps) {
  const [entries, setEntries] = useState<LibraryEntry[]>(initialEntries);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/eco/youlearn/entries');
      const data = await res.json();
      if (data.success && data.entries) {
        setEntries(data.entries);
      }
    } catch (err) {
      console.error('[YouLearn Client] Failed to refresh library entries:', err);
    }
  };

  // Dynamically load latest entries on mount
  useEffect(() => {
    fetchEntries();
  }, []);

  const handleIngestSuccess = async (slug: string) => {
    console.log(`[YouLearn Client] Ingestion successful for slug: ${slug}, reloading entries...`);
    await fetchEntries();
  };

  const filteredEntries = useMemo(() => {
    return filterKnowledgeEntries(entries, {
      query: searchQuery,
      category: selectedCategory,
      difficulty: selectedDifficulty,
      featuredOnly,
    });
  }, [entries, searchQuery, selectedCategory, selectedDifficulty, featuredOnly]);

  const featuredEntry = useMemo(() => {
    return entries.find((e) => e.featured);
  }, [entries]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setFeaturedOnly(false);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#D1FF00] selection:text-black">
      {/* Top Navbar */}
      <YouLearnNavbar onIngestSuccess={handleIngestSuccess} />

      {/* Hero Section */}
      <YouLearnHero
        entries={entries}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Library Body */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Filter Controls */}
        <KnowledgeFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedDifficulty={selectedDifficulty}
          onSelectDifficulty={setSelectedDifficulty}
          featuredOnly={featuredOnly}
          onToggleFeatured={() => setFeaturedOnly((prev) => !prev)}
          onReset={handleReset}
          resultCount={filteredEntries.length}
        />

        {/* Content Cards Grid */}
        {filteredEntries.length === 0 ? (
          <LibraryEmptyState
            query={searchQuery}
            category={selectedCategory}
            onReset={handleReset}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEntries.map((entry) => (
              <KnowledgeCard
                key={entry.id}
                entry={entry}
                featured={entry.featured && !searchQuery && selectedCategory === 'All'}
              />
            ))}
          </div>
        )}

        {/* Future Automation Pipeline Vision Banner */}
        <section className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-8 md:p-10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#D1FF00]/5 blur-[100px] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D1FF00]/30 bg-[#D1FF00]/10 px-3 py-1 text-xs font-mono text-[#D1FF00] mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Next Architecture Phase</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Automated URL → Knowledge Object Pipeline
              </h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                The YouLearn schema is 100% decoupled from presentation. Soon, the{' '}
                <span className="text-[#D1FF00] font-mono">YouLearn Skill</span> will ingest any YouTube video,
                extract frames, verify transcripts with multimodal AI, and automatically publish structured
                Learning Pages.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div className="rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs font-mono text-zinc-400">
                <span className="text-emerald-400">YouTube URL</span>
                <span className="text-zinc-600"> → </span>
                <span className="text-[#D1FF00]">YouLearn Skill</span>
                <span className="text-zinc-600"> → </span>
                <span className="text-white">Learning Page</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-zinc-950/80 py-10 mt-12 text-center text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#D1FF00]" />
            <span className="font-bold text-white">YouLearn</span>
            <span>· Part of Agência 47 Ecosystem</span>
          </div>

          <div className="flex items-center gap-6 text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">
              AG47 Home
            </Link>
            <Link href="/eco/evopro" className="hover:text-white transition-colors">
              EvoPro
            </Link>
            <Link href="/eco/alt-radar" className="hover:text-white transition-colors">
              Alt Radar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
