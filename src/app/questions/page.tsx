"use client";

import React, { useState, useEffect, useMemo, Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  User,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Send,
  Share2,
  Check,
  Sparkles,
} from "lucide-react";
import { AnonymousQuestion, QUESTION_CATEGORIES } from "@/types";
import { fetchPublicWisdomQuestions } from "@/services/api";
import { searchSemanticQuestions } from "@/lib/semanticSearch";

function QuestionsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialIdParam = searchParams.get("id");
  const initialId = initialIdParam ? parseInt(initialIdParam, 10) : null;

  const [questions, setQuestions] = useState<AnonymousQuestion[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<number | null>(initialId);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const loadQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchPublicWisdomQuestions();
      if (Array.isArray(data)) {
        setQuestions(data);
      }
    } catch (err) {
      console.warn("Could not load public answered questions:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  // Scroll to question if initialId is present after loading
  useEffect(() => {
    if (initialId && !isLoading) {
      setExpandedId(initialId);
      const timer = setTimeout(() => {
        const el = document.getElementById(`question-card-${initialId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [initialId, isLoading]);

  // Filter questions with semantic search + keyword search + category filter
  const filteredQuestions = useMemo(() => {
    let result = [...questions];

    // 1. Filter by category
    if (selectedCategory !== "All") {
      result = result.filter(
        (q) => (q.category || "").toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // 2. Filter by search query
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) {
      return result;
    }

    const semanticMatches = searchSemanticQuestions(searchQuery, result, 30);
    const semanticIds = new Set(semanticMatches.map((m) => m.question.id));
    const words = trimmed.split(/\s+/).filter((w) => w.length > 0);

    return result.filter((q) => {
      if (semanticIds.has(q.id)) return true;
      const qLower = (q.question || "").toLowerCase();
      const aLower = (q.answer || "").toLowerCase();
      if (qLower.includes(trimmed) || aLower.includes(trimmed)) return true;
      return words.some((w) => qLower.includes(w) || aLower.includes(w));
    });
  }, [questions, selectedCategory, searchQuery]);

  const handleToggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCopyLink = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/questions?id=${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  return (
    <div id="all-questions-page" className="min-h-screen flex flex-col bg-[#EBECEF]">
      {/* Top Navigation Bar */}
      <header
        id="questions-nav-bar"
        className="w-full bg-white/80 backdrop-blur-md border-b border-black/10 sticky top-0 z-40"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Back to Home Link */}
          <Link
            href="/"
            id="nav-back-home"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#202328] hover:text-black py-2 px-3 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          {/* Center Brand Identity */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F6CE46] ring-2 ring-[#202328]/20" />
            <span className="text-sm sm:text-base font-extrabold tracking-tight text-[#202328]">
              Purity Matters
            </span>
          </div>

          {/* Ask Question Quick Link */}
          <Link
            href="/#ask-question-section"
            id="nav-ask-question-btn"
            className="bg-[#202328] hover:bg-black text-[#F6CE46] text-xs font-bold px-3.5 sm:px-4 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-none"
          >
            <Send className="w-3 h-3 text-[#F6CE46]" />
            <span className="hidden sm:inline">Ask Anonymously</span>
            <span className="sm:hidden">Ask</span>
          </Link>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Page Hero Header */}
        <section id="questions-header-section" className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6CE46]/25 border border-[#F6CE46]/40 text-[#202328] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Confidential Pastoral Care & Wisdom</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#202328]">
            All Answered Questions
          </h1>

          <p className="text-xs sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Browse through real inquiries submitted by individuals walking the journey toward sexual purity, freedom, and emotional healing—answered with compassionate biblical counsel.
          </p>
        </section>

        {/* Search & Filtering Control Panel */}
        <section id="questions-search-panel" className="space-y-4">
          {/* Main Search Input */}
          <div
            id="questions-search-bar"
            className="relative w-full bg-white border border-black/15 hover:border-black/30 focus-within:border-[#202328] rounded-2xl transition-all shadow-xs"
          >
            <div className="flex items-center px-4 sm:px-5 h-13 sm:h-14 gap-3">
              <div className="shrink-0 text-neutral-400">
                {searchQuery ? (
                  <Sparkles className="w-5 h-5 text-[#202328]" />
                ) : (
                  <Search className="w-5 h-5 text-neutral-400" />
                )}
              </div>

              <input
                type="text"
                id="search-all-questions-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across questions, topics, or biblical guidance..."
                autoComplete="off"
                spellCheck="false"
                className="flex-1 bg-transparent text-xs sm:text-sm text-[#202328] placeholder-neutral-500 outline-none border-none ring-0 focus:ring-0 font-medium"
              />

              {searchQuery && (
                <button
                  type="button"
                  id="btn-clear-questions-search"
                  onClick={() => setSearchQuery("")}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div
            id="category-filter-chips"
            className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar"
          >
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === "All"
                  ? "bg-[#202328] text-[#F6CE46]"
                  : "bg-white text-neutral-600 hover:text-black border border-black/10"
              }`}
            >
              <span>All Topics</span>
            </button>

            {QUESTION_CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#202328] text-[#F6CE46]"
                      : "bg-white text-neutral-600 hover:text-black border border-black/10"
                  }`}
                >
                  <span>{category}</span>
                </button>
              );
            })}
          </div>

          {/* Results Summary Bar */}
          <div
            id="search-results-summary"
            className="flex items-center justify-between text-xs text-neutral-500 px-1 pt-1"
          >
            <span>
              Showing {filteredQuestions.length}{" "}
              {filteredQuestions.length === 1 ? "question" : "questions"}
              {searchQuery && (
                <span>
                  {" "}
                  for &ldquo;
                  <span className="text-[#202328] font-bold">{searchQuery}</span>
                  &rdquo;
                </span>
              )}
              {selectedCategory !== "All" && (
                <span>
                  {" "}
                  in <span className="text-[#202328] font-semibold">{selectedCategory}</span>
                </span>
              )}
            </span>

            {(searchQuery || selectedCategory !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="text-xs text-neutral-600 hover:text-black font-semibold underline underline-offset-2 transition-colors cursor-pointer"
              >
                <span>Reset filters</span>
              </button>
            )}
          </div>
        </section>

        {/* Questions Cards List - Easy to Read Format */}
        <section id="questions-list-section" className="space-y-4">
          {isLoading ? (
            <div className="py-20 text-center text-xs text-neutral-600 flex flex-col items-center justify-center gap-3">
              <span className="w-7 h-7 border-2 border-black/20 border-t-[#202328] rounded-full animate-spin" />
              <span>Loading answered inquiries...</span>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div
              id="empty-questions-state"
              className="py-14 px-6 text-center text-neutral-600 rounded-3xl bg-white border border-black/10 flex flex-col items-center justify-center shadow-none"
            >
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                <HelpCircle className="w-6 h-6 text-neutral-400" />
              </div>
              <h3 className="text-base font-bold text-[#202328] mb-1">
                No matching answered questions found
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-md mb-5 leading-relaxed">
                {searchQuery
                  ? `We could not find an answered inquiry matching "${searchQuery}". You can submit this question anonymously and our pastoral team will answer it.`
                  : "No questions found under this topic filter."}
              </p>
              <Link
                href="/#ask-question-section"
                className="bg-[#202328] hover:bg-black text-[#F6CE46] text-xs font-semibold px-5 py-2.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 shadow-none"
              >
                <Send className="w-3.5 h-3.5 text-[#F6CE46]" />
                <span>Ask your question anonymously</span>
              </Link>
            </div>
          ) : (
            filteredQuestions.map((item) => {
              const isExpanded = expandedId === item.id;
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  id={`question-card-${item.id}`}
                  className="rounded-3xl border border-black/10 hover:border-black/25 bg-white transition-all overflow-hidden shadow-xs hover:shadow-md"
                >
                  {/* Card Header Row (Clickable Accordion) */}
                  <div
                    onClick={() => handleToggleExpand(item.id)}
                    className="p-5 sm:p-6 cursor-pointer flex items-start justify-between gap-4 select-none"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      {/* Meta Tags Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>Answered Inquiry</span>
                        </div>

                        {item.category && (
                          <span className="text-[11px] font-semibold text-neutral-600 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                            {item.category}
                          </span>
                        )}
                      </div>

                      {/* Prominent Question Heading for Easy Reading */}
                      <h2 className="text-base sm:text-lg font-bold text-[#202328] leading-snug">
                        {item.question}
                      </h2>
                    </div>

                    {/* Toggle and Share Buttons */}
                    <div className="shrink-0 flex items-center gap-1 text-neutral-500 pt-1">
                      <button
                        type="button"
                        onClick={(e) => handleCopyLink(e, item.id)}
                        className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors cursor-pointer"
                        title="Copy direct link to question"
                      >
                        {isCopied ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Share2 className="w-4 h-4" />
                        )}
                      </button>

                      <div className="p-2 rounded-full hover:bg-neutral-100 text-[#202328] transition-colors">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-[#202328]" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[#202328]" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Answer / Guidance Container */}
                  {isExpanded && item.answer && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 border-t border-black/[0.06] animate-in fade-in duration-200">
                      <div className="mt-4 p-5 sm:p-7 rounded-2xl bg-[#202328] text-white space-y-4">
                        {/* Pastoral Attribution Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-white/15 pb-3">
                          <div className="flex items-center gap-2 font-semibold text-[#F6CE46]">
                            <User className="w-4 h-4" />
                            <span>
                              {item.assignedCounselor || "Pastoral Counseling Team"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-neutral-300 uppercase tracking-wider font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#F6CE46]" />
                            <span>Biblical Counseling & Guidance</span>
                          </div>
                        </div>

                        {/* Pastoral Guidance Text formatted for high readability */}
                        <div className="text-xs sm:text-sm text-neutral-100 whitespace-pre-wrap leading-relaxed font-normal">
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>

        {/* Footer Callout to Ask a Question */}
        <section
          id="questions-footer-cta"
          className="rounded-3xl bg-white border border-black/10 p-6 sm:p-8 text-center space-y-4 shadow-xs"
        >
          <div className="w-10 h-10 rounded-full bg-[#F6CE46]/30 flex items-center justify-center mx-auto text-[#202328]">
            <Send className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-[#202328]">
              Didn&apos;t find your specific question?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto">
              You can submit your question anonymously at any time. Our pastoral counseling team reviews and answers each struggle with compassion.
            </p>
          </div>

          <Link
            href="/#ask-question-section"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#202328] hover:bg-black text-[#F6CE46] font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
          >
            <span>Ask Anonymously</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </section>
      </main>
    </div>
  );
}

export default function QuestionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#EBECEF]">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-neutral-600">
            <span className="w-5 h-5 border-2 border-black/20 border-t-[#202328] rounded-full animate-spin" />
            <span>Loading inquiries...</span>
          </div>
        </div>
      }
    >
      <QuestionsContent />
    </Suspense>
  );
}
