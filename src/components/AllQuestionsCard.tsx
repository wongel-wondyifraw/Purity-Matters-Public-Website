"use client";

import React, { useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  User,
  RefreshCw,
  HelpCircle,
  X,
  ArrowDown,
  CheckCircle2,
} from "lucide-react";
import { AnonymousQuestion } from "@/types";

interface AllQuestionsCardProps {
  questions: AnonymousQuestion[];
  searchQuery: string;
  onClearSearch: () => void;
  expandedId: number | null;
  onToggleExpand: (id: number) => void;
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onScrollToAsk: () => void;
}

export function AllQuestionsCard({
  questions,
  searchQuery,
  onClearSearch,
  expandedId,
  onToggleExpand,
  isLoading,
  isRefreshing,
  onRefresh,
  onScrollToAsk,
}: AllQuestionsCardProps) {
  // Filter questions by search query (without case types or category pills)
  const filteredQuestions = useMemo(() => {
    const sLower = searchQuery.toLowerCase().trim();
    if (!sLower) return questions;

    const words = sLower.split(/\s+/).filter((w) => w.length > 0);

    return questions.filter((q) => {
      const qLower = (q.question || "").toLowerCase();
      const aLower = (q.answer || "").toLowerCase();

      // Check if full query is substring or any keyword matches
      if (qLower.includes(sLower) || aLower.includes(sLower)) return true;
      return words.some((word) => qLower.includes(word) || aLower.includes(word));
    });
  }, [questions, searchQuery]);

  return (
    <section id="answered-questions-section" className="w-full flex flex-col">
      <div className="bg-white/95 backdrop-blur-xl border border-black/12 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.06] pb-5 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F6CE46] ring-2 ring-[#202328]/25" />
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#202328]">
                Answered Questions & Biblical Guidance
              </h2>
              <span className="text-xs bg-[#202328] text-white font-bold px-2.5 py-0.5 rounded-full ml-1">
                {filteredQuestions.length}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 font-normal">
              Explore biblical guidance and pastoral counsel provided to our community.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {searchQuery && (
              <button
                type="button"
                onClick={onClearSearch}
                className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1.5 rounded-full font-medium transition-all flex items-center gap-1 cursor-pointer"
                title="Reset search filter"
              >
                <span>Reset search</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              title="Refresh questions"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl text-neutral-600 hover:text-[#202328] hover:bg-black/[0.06] border border-black/10 hover:border-black/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#F6CE46]" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Questions List (No dates, No case types) */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="py-16 text-center text-xs text-neutral-600 font-medium flex flex-col items-center justify-center gap-2.5">
              <span className="w-6 h-6 border-2 border-black/20 border-t-[#202328] rounded-full animate-spin" />
              <span>Loading answered inquiries...</span>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div
              id="empty-search-state"
              className="py-12 px-6 text-center text-neutral-600 rounded-2xl bg-black/[0.02] border border-black/10 flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                <HelpCircle className="w-6 h-6 text-neutral-400" />
              </div>
              <h3 className="text-sm font-bold text-[#202328] mb-1">
                No answered questions found
              </h3>
              <p className="text-xs text-neutral-600 max-w-md mb-5 leading-relaxed">
                {searchQuery
                  ? `We could not find an answered inquiry matching "${searchQuery}". You can submit this question anonymously and our pastoral team will answer it.`
                  : "There are currently no answered questions published yet."}
              </p>
              <button
                type="button"
                id="btn-empty-ask-question"
                onClick={onScrollToAsk}
                className="bg-[#202328] hover:bg-black text-[#F6CE46] text-xs font-semibold px-5 py-2.5 rounded-full shadow-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Ask this question anonymously</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            filteredQuestions.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  id={`all-question-item-${item.id}`}
                  className="rounded-2xl border border-black/10 hover:border-black/25 bg-white transition-all overflow-hidden shadow-2xs"
                >
                  {/* Question Header Row (No dates, No category tag) */}
                  <div
                    onClick={() => onToggleExpand(item.id)}
                    className="p-4 sm:p-5 cursor-pointer flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                          Answered Inquiry
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-[#202328] leading-snug">
                        {item.question}
                      </h3>
                    </div>

                    <div className="shrink-0 pt-1 text-neutral-500">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Counselor Guidance / Answer */}
                  {isExpanded && item.answer && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 border-t border-black/[0.04] animate-in fade-in">
                      <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-[#202328] text-white space-y-3 shadow-xs">
                        <div className="flex items-center justify-between text-xs border-b border-white/15 pb-2.5">
                          <div className="flex items-center gap-2 font-semibold text-[#F6CE46]">
                            <User className="w-3.5 h-3.5" />
                            <span>
                              {item.assignedCounselor || "Pastoral Counseling Team"}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-300 uppercase tracking-wider font-semibold">
                            Biblical Guidance
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-100 whitespace-pre-wrap leading-relaxed font-normal">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
