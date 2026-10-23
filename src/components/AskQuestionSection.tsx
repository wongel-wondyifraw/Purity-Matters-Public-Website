"use client";

import React, { useState, useEffect } from "react";
import { Send, CheckCircle2, AlertCircle, X, ShieldCheck } from "lucide-react";
import { AnonymousQuestion } from "@/types";
import { submitAnonymousQuestion } from "@/services/api";
import { saveQuestionToLocalStorage } from "@/lib/storage";

interface AskQuestionSectionProps {
  onQuestionSubmitted: (created: AnonymousQuestion) => void;
}

export function AskQuestionSection({ onQuestionSubmitted }: AskQuestionSectionProps) {
  const [questionText, setQuestionText] = useState("");
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

    try {
      // Direct question submission without category dropdown or case types
      const created = await submitAnonymousQuestion(questionText.trim(), "General Inquiry");
      saveQuestionToLocalStorage(created);
      setShowToast(true);
      setQuestionText("");
      onQuestionSubmitted(created);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="ask-question-section" className="w-full flex flex-col">
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
            className="text-neutral-300 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white/95 backdrop-blur-xl border border-black/12 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.06] pb-5 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F6CE46] ring-2 ring-[#202328]/25" />
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#202328]">
                Ask Your Question Anonymously
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 font-normal">
              Can&apos;t find your struggle answered above? Submit your question in absolute confidence.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Anonymous</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-red-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form - Question Submission Only (No Case Types or Dates) */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="question-input"
                className="text-xs font-bold uppercase tracking-wider text-[#202328]"
              >
                Your Question or Struggle
              </label>
              <span
                className={`text-[11px] font-mono ${
                  charCount < 10
                    ? "text-neutral-500 font-medium"
                    : "text-emerald-700 font-bold"
                }`}
              >
                {charCount} characters (min 10)
              </span>
            </div>

            <div className="relative flex flex-col">
              <textarea
                id="question-input"
                required
                rows={5}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Describe what you are struggling with, questions on sexual purity, guilt, emotional healing, or scripture guidance. You don't need to hold back—this is a safe, compassionate, and completely anonymous space..."
                className="w-full min-h-[150px] bg-[#EBECEF]/40 focus:bg-white text-xs sm:text-sm text-[#202328] placeholder-neutral-500 p-4 rounded-2xl border border-black/20 focus:border-[#202328] focus:ring-1 focus:ring-[#202328] outline-none transition-all resize-y leading-relaxed"
              />
            </div>
          </div>

          {/* Footer Submit Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-neutral-500">
              No email, name, or account required. All counseling is grounded in Scripture.
            </p>

            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              id="btn-submit-question"
              className={`w-full sm:w-auto px-6 py-2.5 rounded-full font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
                isValid && !isSubmitting
                  ? "bg-[#202328] hover:bg-black text-white cursor-pointer"
                  : "bg-neutral-200 text-neutral-500 border border-neutral-300 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting Privately...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-[#F6CE46]" />
                  <span>Send Anonymous Question</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
