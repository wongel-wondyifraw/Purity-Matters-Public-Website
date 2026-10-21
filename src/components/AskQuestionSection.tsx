"use client";

import React, { useState, useEffect } from "react";
import { Send, CheckCircle2, AlertCircle, ChevronDown, X } from "lucide-react";
import { QuestionCategory, QUESTION_CATEGORIES, AnonymousQuestion } from "@/types";
import { submitAnonymousQuestion } from "@/services/api";
import { saveQuestionToLocalStorage } from "@/lib/storage";

interface AskQuestionSectionProps {
  onQuestionSubmitted: (created: AnonymousQuestion) => void;
}

export function AskQuestionSection({ onQuestionSubmitted }: AskQuestionSectionProps) {
  const [questionText, setQuestionText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>("Habitual Triggers");
  const [customTopic, setCustomTopic] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const charCount = questionText.trim().length;
  const isValid = charCount >= 10;

  // Auto-dismiss toast notification after 4 seconds
  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const categoryToSubmit =
      selectedCategory === "Other"
        ? (customTopic.trim() || "Other")
        : selectedCategory;

    try {
      const created = await submitAnonymousQuestion(questionText.trim(), categoryToSubmit);
      // Save to localStorage for client-side tracking
      saveQuestionToLocalStorage(created);
      setShowToast(true);
      setQuestionText("");
      setCustomTopic("");
      onQuestionSubmitted(created);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="ask-question-section" className="w-full h-full flex flex-col">
      {/* Floating Toast Notification */}
      {showToast && (
        <div
          id="question-received-toast"
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#202328] text-white px-4 py-3.5 rounded-2xl shadow-xl border border-white/10 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F6CE46]/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-[#F6CE46]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Question received!</p>
              <p className="text-[11px] text-neutral-300">Your inquiry was submitted anonymously.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white/85 backdrop-blur-xl border border-black/[0.08] rounded-3xl p-6 sm:p-8 shadow-sm flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-black/[0.06] pb-5 mb-5 min-h-[64px]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F6CE46]" />
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#202328]">
                Confidential Inquiry
              </h2>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-red-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-4 sm:space-y-5">
          <div className="space-y-4 sm:space-y-5 flex-1 flex flex-col">
            {/* Category Dropdown Selector */}
            <div>
              <label
                htmlFor="category-select"
                className="text-xs font-bold uppercase tracking-wider text-[#202328] block mb-2"
              >
                1. Select Ministry Topic
              </label>
              <div className="relative">
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as QuestionCategory)}
                  className="w-full appearance-none bg-[#EBECEF]/50 focus:bg-white text-xs sm:text-sm text-[#202328] font-medium py-3 px-4 pr-10 rounded-2xl border border-black/15 focus:border-[#202328] focus:ring-1 focus:ring-[#202328] outline-none transition-all cursor-pointer"
                >
                  {QUESTION_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="text-[#202328] bg-white py-1">
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Optional Custom Topic Input when 'Other' is chosen */}
              {selectedCategory === "Other" && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    id="custom-topic-input"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="Specify your topic (e.g. Identity, Addiction, Healing)..."
                    className="w-full bg-[#EBECEF]/40 focus:bg-white text-xs sm:text-sm text-[#202328] placeholder-neutral-400 p-3 rounded-xl border border-black/15 focus:border-[#202328] focus:ring-1 focus:ring-[#202328] outline-none transition-all"
                  />
                </div>
              )}
            </div>

            {/* Question Textarea */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="question-input" className="text-xs font-bold uppercase tracking-wider text-[#202328]">
                  2. Write Your Confidential Question
                </label>
                <span className={`text-[11px] font-mono ${charCount < 10 ? "text-neutral-400" : "text-emerald-700 font-semibold"}`}>
                  {charCount} characters (min 10)
                </span>
              </div>

              <div className="relative flex-1 flex flex-col">
                <textarea
                  id="question-input"
                  required
                  rows={5}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Describe your situation, struggle, or spiritual concern with honesty. You don't need to hold back—this is a safe, compassionate space..."
                  className="w-full flex-1 min-h-[160px] bg-[#EBECEF]/40 focus:bg-white text-xs sm:text-sm text-[#202328] placeholder-neutral-400 p-4 rounded-2xl border border-black/15 focus:border-[#202328] focus:ring-1 focus:ring-[#202328] outline-none transition-all resize-y leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit Bar */}
          <div className="flex items-center justify-end pt-3 mt-auto">
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              id="btn-submit-question"
              className={`w-full sm:w-auto px-6 py-2.5 rounded-full font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                isValid && !isSubmitting
                  ? "bg-[#202328] hover:bg-black text-white"
                  : "bg-black/10 text-neutral-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting Privately...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-[#F6CE46]" />
                  <span>Send Anonymous Question</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

