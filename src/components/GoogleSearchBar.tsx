"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, Sparkles, MessageCircleQuestion, ArrowRight } from "lucide-react";
import { AnonymousQuestion } from "@/types";
import {
  searchSemanticQuestions,
  SemanticMatch,
} from "@/lib/semanticSearch";

interface GoogleSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  allQuestions: AnonymousQuestion[];
  onSelectQuestion: (question: AnonymousQuestion) => void;
}

export function GoogleSearchBar({
  searchQuery,
  onSearchChange,
  allQuestions,
  onSelectQuestion,
}: GoogleSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const semanticMatches: SemanticMatch[] = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchSemanticQuestions(searchQuery, allQuestions, 5);
  }, [searchQuery, allQuestions]);

  const showDropdown = isFocused && semanticMatches.length > 0;

  const handleClear = () => {
    onSearchChange("");
    inputRef.current?.focus();
  };

  const handleQuestionClick = (q: AnonymousQuestion) => {
    onSelectQuestion(q);
    setIsFocused(false);
  };

  return (
    <div
      ref={containerRef}
      id="google-search-container"
      className="relative w-full max-w-3xl mx-auto z-30"
    >
      {/* Search Input Bar (Google Pill Style) */}
      <div
        id="google-search-bar"
        className={`w-full bg-white transition-all duration-200 border ${
          showDropdown
            ? "rounded-t-3xl rounded-b-none border-black/20 shadow-[0_12px_36px_rgba(0,0,0,0.12)] ring-2 ring-[#202328]"
            : "rounded-full border-black/15 shadow-[0_4px_22px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] focus-within:shadow-[0_10px_35px_rgba(246,206,70,0.3)] focus-within:border-[#202328] focus-within:ring-2 focus-within:ring-[#202328]"
        }`}
      >
        <div className="flex items-center px-5 sm:px-6 h-14 sm:h-16 gap-3 sm:gap-4">
          {/* Search Icon */}
          <div className="shrink-0 text-neutral-500">
            <Search className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            id="google-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsFocused(false);
              }
            }}
            placeholder="Search existing struggles or questions (e.g. shame, pornography, lust, forgiveness)..."
            autoComplete="off"
            spellCheck="false"
            className="flex-1 bg-transparent text-sm sm:text-base text-[#202328] placeholder-neutral-500 outline-none font-medium"
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

          {/* Search Badge / Action */}
          <div className="shrink-0 pl-1 border-l border-black/10 flex items-center">
            <button
              type="button"
              onClick={() => {
                setIsFocused(false);
                document
                  .getElementById("answered-questions-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              id="btn-submit-search"
              className="bg-[#202328] hover:bg-black text-[#F6CE46] text-xs font-bold px-3.5 sm:px-4 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Search</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Semantic Search Recommendations Dropdown (Google Autocomplete / Instant Results) */}
      {showDropdown && (
        <div
          id="semantic-recommendations-dropdown"
          className="absolute left-0 right-0 top-full bg-white rounded-b-3xl border-x border-b border-black/20 shadow-[0_16px_40px_rgba(0,0,0,0.16)] overflow-hidden divide-y divide-black/[0.06] animate-in fade-in slide-in-from-top-1 duration-150 z-40"
        >
          {/* Matched Questions Section */}
          <div id="matched-questions-group" className="p-3 sm:p-4">
            <div className="flex items-center gap-1.5 px-2 mb-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              <Sparkles className="w-3.5 h-3.5 text-[#F6CE46]" />
              <span>Recommended Answered Questions</span>
            </div>

            <div className="space-y-1">
              {semanticMatches.map((match) => (
                <button
                  key={match.question.id}
                  type="button"
                  onClick={() => handleQuestionClick(match.question)}
                  className="w-full text-left p-2.5 sm:p-3 rounded-2xl hover:bg-neutral-50 transition-all flex items-start gap-3 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-xl bg-[#202328] text-[#F6CE46] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                    <MessageCircleQuestion className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-[#202328] group-hover:text-black line-clamp-1">
                      {match.question.question}
                    </p>
                    {match.matchedSnippet && (
                      <p className="text-[11px] sm:text-xs text-neutral-600 line-clamp-2 mt-0.5 leading-relaxed font-normal">
                        <span className="font-semibold text-neutral-800">Counsel: </span>
                        {match.matchedSnippet}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 self-center text-neutral-400 group-hover:text-[#202328] transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
