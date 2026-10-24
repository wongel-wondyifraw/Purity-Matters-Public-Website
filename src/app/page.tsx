"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Hero } from "@/components/Hero";
import { AskQuestionSection } from "@/components/AskQuestionSection";
import { QuestionReaderModal } from "@/components/QuestionReaderModal";
import { AnonymousQuestion } from "@/types";
import { fetchPublicWisdomQuestions } from "@/services/api";
import { saveQuestionToLocalStorage } from "@/lib/storage";

export default function HomePage() {
  const [questions, setQuestions] = useState<AnonymousQuestion[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedQuestion, setSelectedQuestion] = useState<AnonymousQuestion | null>(null);
  const [isReaderOpen, setIsReaderOpen] = useState<boolean>(false);
  const [isAskVisible, setIsAskVisible] = useState<boolean>(false);

  const loadQuestions = useCallback(async (silent = false) => {
    try {
      const data = await fetchPublicWisdomQuestions();
      if (Array.isArray(data)) {
        setQuestions(data);
      }
    } catch (err) {
      if (!silent) {
        console.warn("Could not load public answered questions:", err);
      }
    }
  }, []);

  // Initial load + silent auto-poll every 12 seconds
  useEffect(() => {
    loadQuestions(false);

    const intervalId = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        loadQuestions(true);
      }
    }, 12000);

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

  // Open intake section automatically if URL hash or param specifies it
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (
        window.location.hash === "#ask-question-section" ||
        window.location.search.includes("ask")
      ) {
        setIsAskVisible(true);
        setTimeout(() => {
          document.getElementById("ask-question-section")?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  }, []);

  const handleQuestionSubmitted = (created: AnonymousQuestion) => {
    saveQuestionToLocalStorage(created);
    loadQuestions(true);
  };

  const handleSelectQuestion = (q: AnonymousQuestion) => {
    setSelectedQuestion(q);
    setIsReaderOpen(true);
  };

  const scrollToAsk = () => {
    setIsAskVisible(true);
    setTimeout(() => {
      const el = document.getElementById("qa-content-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => {
          const input = document.getElementById("question-input");
          if (input) input.focus();
        }, 500);
      }
    }, 60);
  };

  const handleCloseAsk = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setIsAskVisible(false);
    }, 450);
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

          {/* 1. Hero with Google-like Search Bar & Centered Action Buttons (Screen 1) */}
          <Hero
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            allQuestions={questions}
            onSelectQuestion={handleSelectQuestion}
            onScrollToAsk={scrollToAsk}
          />

          {/* 2. Main Content Flow: Intake section fills the screen without leaving space on top (Screen 2) */}
          {isAskVisible && (
            <section
              id="qa-content-section"
              className="w-full min-h-screen min-h-[100dvh] flex flex-col items-center justify-center py-6 sm:py-10 px-3 sm:px-6 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-500"
            >
              <div id="ask-question-wrapper" className="w-full max-w-4xl">
                <AskQuestionSection
                  onQuestionSubmitted={handleQuestionSubmitted}
                  onClose={handleCloseAsk}
                />
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Question Reader Modal: Opens when a suggestion is clicked */}
      <QuestionReaderModal
        question={selectedQuestion}
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
      />
    </div>
  );
}
