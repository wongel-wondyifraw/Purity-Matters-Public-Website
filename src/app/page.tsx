"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Hero } from "@/components/Hero";
import { AskQuestionSection } from "@/components/AskQuestionSection";
import { AllQuestionsCard } from "@/components/AllQuestionsCard";
import { AnonymousQuestion } from "@/types";
import { fetchPublicWisdomQuestions } from "@/services/api";
import { saveQuestionToLocalStorage } from "@/lib/storage";

export default function HomePage() {
  const [questions, setQuestions] = useState<AnonymousQuestion[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadQuestions = useCallback(async (silent = false) => {
    if (!silent) {
      setIsRefreshing(true);
    }
    try {
      const data = await fetchPublicWisdomQuestions();
      if (Array.isArray(data)) {
        setQuestions(data);
      }
    } catch (err) {
      if (!silent) {
        console.warn("Could not load public answered questions:", err);
      }
    } finally {
      setIsLoading(false);
      if (!silent) {
        setIsRefreshing(false);
      }
    }
  }, []);

  // Initial load + silent auto-poll every 8 seconds
  useEffect(() => {
    loadQuestions(false);

    const intervalId = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        loadQuestions(true);
      }
    }, 8000);

    const handleFocus = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        loadQuestions(true);
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [loadQuestions]);

  const handleQuestionSubmitted = (created: AnonymousQuestion) => {
    saveQuestionToLocalStorage(created);
    loadQuestions(true);
  };

  const handleSelectQuestion = (q: AnonymousQuestion) => {
    setSearchQuery(q.question);
    setExpandedId(q.id);
    document
      .getElementById("answered-questions-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleToggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const scrollToAsk = () => {
    document
      .getElementById("ask-question-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="public-website-app" className="min-h-screen flex flex-col bg-[#EBECEF]">
      <main className="flex-1">
        {/* Seamless Unified Upper Canvas with Continuous Flowing Gradient */}
        <div
          id="hero-intake-canvas"
          className="relative w-full overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 110% 70% at 50% 0%, rgba(246, 206, 70, 0.28) 0%, rgba(246, 206, 70, 0.12) 35%, rgba(246, 206, 70, 0.05) 60%, rgba(235, 236, 239, 0) 90%), linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(235, 236, 239, 0) 50%, rgba(235, 236, 239, 0.7) 85%, #EBECEF 100%)",
          }}
        >
          {/* Ambient Gold Light Blooms */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[450px] bg-[#F6CE46]/22 rounded-full blur-[110px] pointer-events-none select-none z-0" />
          <div className="absolute top-1/4 -left-24 w-[450px] h-[550px] bg-[#F6CE46]/14 rounded-full blur-[100px] pointer-events-none select-none z-0" />
          <div className="absolute top-1/3 -right-24 w-[450px] h-[550px] bg-[#F6CE46]/14 rounded-full blur-[100px] pointer-events-none select-none z-0" />

          {/* 1. Hero with Google-like Search Bar & Semantic Recommendations on Top */}
          <Hero
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            allQuestions={questions}
            onSelectQuestion={handleSelectQuestion}
            onScrollToAsk={scrollToAsk}
          />

          {/* 2. Main Centered Content Flow: Answered Questions first, followed by Ask Intake */}
          <section
            id="qa-content-section"
            className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-14 sm:pb-20 relative z-10 space-y-8"
          >
            {/* Answered Questions Results List (Dates & Case Types Removed) */}
            <div id="answered-questions-wrapper" className="w-full">
              <AllQuestionsCard
                questions={questions}
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery("")}
                expandedId={expandedId}
                onToggleExpand={handleToggleExpand}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                onRefresh={() => loadQuestions(false)}
                onScrollToAsk={scrollToAsk}
              />
            </div>

            {/* Ask Anonymous Question Section (Dropdowns & Dates Removed) */}
            <div id="ask-question-wrapper" className="w-full">
              <AskQuestionSection onQuestionSubmitted={handleQuestionSubmitted} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
