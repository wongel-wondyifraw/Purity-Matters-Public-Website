"use client";

import React, { useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  User,
  HelpCircle,
  X,
  ArrowDown,
  CheckCircle2,
} from "lucide-react";
import { AnonymousQuestion } from "@/types";
import { searchSemanticQuestions } from "@/lib/semanticSearch";

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
  // Filter questions by keyword and semantic search
  const filteredQuestions = useMemo(() => {
    const sLower = searchQuery.toLowerCase().trim();
    if (!sLower) return questions;

    const semanticResults = searchSemanticQuestions(searchQuery, questions, 20);
    const semanticIds = new Set(semanticResults.map((m) => m.question.id));
    const words = sLower.split(/\s+/).filter((w) => w.length > 0);

    return questions.filter((q) => {
      if (semanticIds.has(q.id)) return true;
      const qLower = (q.question || "").toLowerCase();
      const aLower = (q.answer || "").toLowerCase();
      if (qLower.includes(sLower) || aLower.includes(sLower)) return true;
      return words.some((word) => qLower.includes(word) || aLower.includes(word));
    });
  }, [questions, searchQuery]);

  return (
    <section id="answered-questions-section" className="w-full flex flex-col">
      <div id="answered-questions-container" className="w-full flex flex-col shadow-none">
        {/* Active Search Query Status Bar */}
        {searchQuery && (
          <div
            id="search-status-bar"
            className="flex items-center justify-between pb-3 px-1 text-xs text-neutral-600 font-medium"
          >
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">
                Found {filteredQuestions.length} {filteredQuestions.length === 1 ? "question" : "questions"} for &ldquo;<span className="text-[#202328] font-semibold">{searchQuery}</span>&rdquo;
              </span>
            </div>
            <button
              type="button"
              onClick={onClearSearch}
              className="text-neutral-500 hover:text-[#202328] text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
              title="Clear search query"
            >
              <span>Clear search</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Questions List (No dates, No case types, No shadows) */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-neutral-600 font-medium flex flex-col items-center justify-center gap-2.5">
              <span className="w-6 h-6 border-2 border-black/20 border-t-[#202328] rounded-full animate-spin" />
              <span>Loading answered inquiries...</span>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div
              id="empty-search-state"
              className="py-10 px-6 text-center text-neutral-600 rounded-2xl bg-white border border-black/10 flex flex-col items-center justify-center shadow-none"
            >
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mb-2.5">
                <HelpCircle className="w-5 h-5 text-neutral-400" />
              </div>
              <h3 className="text-sm font-bold text-[#202328] mb-1">
                No answered questions found
              </h3>
              <p className="text-xs text-neutral-600 max-w-md mb-4 leading-relaxed">
                {searchQuery
                  ? `We could not find an answered inquiry matching "${searchQuery}". You can submit this question anonymously below and our pastoral team will answer it.`
                  : "There are currently no answered questions published yet."}
              </p>
              <button
                type="button"
                id="btn-empty-ask-question"
                onClick={onScrollToAsk}
                className="bg-[#202328] hover:bg-black text-[#F6CE46] text-xs font-semibold px-4 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5 shadow-none"
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
                  className="rounded-2xl border border-black/10 hover:border-black/25 bg-white transition-all overflow-hidden shadow-none"
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
