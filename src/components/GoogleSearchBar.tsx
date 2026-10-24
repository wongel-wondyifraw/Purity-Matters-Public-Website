"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Sparkles, ArrowUpRight } from "lucide-react";
import { AnonymousQuestion } from "@/types";
import { searchSemanticQuestions } from "@/lib/semanticSearch";

interface GoogleSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  allQuestions?: AnonymousQuestion[];
  onSelectQuestion?: (question: AnonymousQuestion) => void;
}

export function GoogleSearchBar({
  searchQuery,
  onSearchChange,
  allQuestions = [],
  onSelectQuestion,
}: GoogleSearchBarProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Compute semantic matches when query has text
  const suggestions = useMemo(() => {
    const q = searchQuery.trim();
    if (!q || allQuestions.length === 0) return [];
    return searchSemanticQuestions(q, allQuestions, 5);
  }, [searchQuery, allQuestions]);

  // Expand ONLY when focused, query is non-empty, AND there are similar results!
  const hasSimilarResults = suggestions.length > 0;
  const showDropdown = isFocused && searchQuery.trim().length > 0 && hasSimilarResults;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  const handleClear = () => {
    onSearchChange("");
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchQuery.trim();

    // If an item in suggestions is highlighted with keyboard
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      const selected = suggestions[selectedIndex].question;
      handlePickQuestion(selected);
      return;
    }

    setIsFocused(false);
    if (trimmed) {
      router.push(`/questions?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/questions");
    }
  };

  const handlePickQuestion = (q: AnonymousQuestion) => {
    setIsFocused(false);
    if (onSelectQuestion) {
      onSelectQuestion(q);
    } else {
      router.push(`/questions?id=${q.id}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Escape") {
      setIsFocused(false);
      setSelectedIndex(-1);
    }
  };

  return (
    <div
      ref={containerRef}
      id="google-search-container"
      className="relative w-full max-w-3xl mx-auto z-30"
    >
      {/* Search Box Container: Fixed 28px/32px pill radius permanently to prevent oval/egg distortion */}
      <div
        id="google-search-box"
        className={`w-full bg-white border rounded-[28px] sm:rounded-[32px] overflow-hidden transition-[box-shadow,border-color] duration-200 ease-out ${
          showDropdown
            ? "shadow-[0_20px_50px_rgba(0,0,0,0.12)] border-black/25 ring-1 ring-black/10"
            : "shadow-none border-black/15 hover:border-black/30 focus-within:border-[#202328]"
        }`}
      >
        {/* Main Input Row */}
        <form
          onSubmit={handleSearchSubmit}
          id="google-search-input-row"
          className="flex items-center px-5 sm:px-6 h-14 sm:h-16 gap-3 sm:gap-4 relative"
        >
          {/* Search / Sparkle Icon */}
          <div className="shrink-0 text-neutral-500">
            {searchQuery.trim().length > 0 ? (
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#202328]" />
            ) : (
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-400" />
            )}
          </div>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            id="google-search-input"
            value={searchQuery}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search struggles or questions (e.g. shame, pornography, lust, forgiveness)..."
            autoComplete="off"
            spellCheck="false"
            className="flex-1 bg-transparent text-sm sm:text-base text-[#202328] placeholder-neutral-500 outline-none border-none ring-0 focus:ring-0 focus:outline-none font-medium"
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              type="button"
              id="btn-clear-search"
              onClick={handleClear}
              className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-[#202328] transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Search Action Button */}
          <div className="shrink-0 pl-1 border-l border-black/10 flex items-center">
            <button
              type="submit"
              id="btn-submit-search"
              className="bg-[#202328] hover:bg-black text-[#F6CE46] text-xs font-bold px-3.5 sm:px-4 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-none ring-0 focus:ring-0"
            >
              <span>Search</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Subtle Divider Line with Smooth Fade */}
        <div
          className={`h-[1px] bg-black/[0.08] w-full transition-opacity duration-200 ${
            showDropdown ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Smooth Grid Accordion Expansion for Suggestions */}
        <div
          id="google-suggestions-wrapper"
          style={{
            display: "grid",
            gridTemplateRows: showDropdown ? "1fr" : "0fr",
            opacity: showDropdown ? 1 : 0,
            transition:
              "grid-template-rows 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease",
          }}
          className="w-full text-left"
        >
          <div className="overflow-hidden">
            <div id="semantic-suggestions-list" className="py-2.5">
              <div className="px-5 py-1.5 flex items-center justify-between text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#202328]" />
                  <span>Similar Answered Questions</span>
                </span>
                <span>Click to read</span>
              </div>

              {suggestions.map((item, index) => {
                const isSelected = selectedIndex === index;
                return (
                  <div
                    key={item.question.id}
                    id={`suggestion-item-${item.question.id}`}
                    onClick={() => handlePickQuestion(item.question)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`px-5 py-3 flex items-start justify-between gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-neutral-100/90 text-black"
                        : "hover:bg-neutral-50 text-[#202328]"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="mt-0.5 text-neutral-400 shrink-0">
                        <Search className="w-4 h-4 text-neutral-500" />
                      </div>

                      <div className="space-y-0.5 min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-semibold text-[#202328] line-clamp-1">
                          {item.question.question}
                        </p>
                        {item.matchedSnippet && (
                          <p className="text-[11px] text-neutral-600 line-clamp-1">
                            {item.matchedSnippet}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-[#202328] bg-[#F6CE46]/30 px-2.5 py-1 rounded-full group-hover:bg-[#F6CE46]">
                      <span>Read</span>
                      <ArrowRight className="w-3 h-3 text-[#202328]" />
                    </div>
                  </div>
                );
              })}

              {/* Footer link: Search all questions */}
              <div
                onClick={handleSearchSubmit}
                className="mt-1 px-5 py-2.5 bg-neutral-50/80 hover:bg-neutral-100/90 flex items-center justify-between text-xs font-semibold text-[#202328] cursor-pointer border-t border-black/[0.06] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Search all questions for &ldquo;{searchQuery}&rdquo;</span>
                </span>
                <div className="flex items-center gap-1 text-xs text-neutral-600 font-normal">
                  <span>Explore All</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
