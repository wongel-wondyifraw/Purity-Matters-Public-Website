"use client";

import React from "react";
import { ArrowDown, Sparkles } from "lucide-react";
import { AnonymousQuestion } from "@/types";
import { GoogleSearchBar } from "@/components/GoogleSearchBar";

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  allQuestions: AnonymousQuestion[];
  onSelectQuestion: (question: AnonymousQuestion) => void;
  onScrollToAsk: () => void;
}

export function Hero({
  searchQuery,
  onSearchChange,
  allQuestions,
  onSelectQuestion,
  onScrollToAsk,
}: HeroProps) {
  return (
    <section
      id="hero-section"
      className="relative w-full pt-10 pb-8 sm:pt-16 sm:pb-12 overflow-hidden flex flex-col items-center justify-center text-center"
    >
      {/* Floating Anonymity & Security Small SVGs Across the Full Width */}
      {/* 1. Incognito Fedora & Shades (Far Left Top) */}
      <div
        id="float-svg-incognito"
        className="absolute top-6 left-4 sm:left-10 lg:left-20 xl:left-32 pointer-events-none select-none z-0 opacity-40 animate-float-1"
        style={{ filter: "drop-shadow(0 0 12px rgba(246, 206, 70, 0.8))" }}
      >
        <svg
          viewBox="0 0 48 48"
          className="w-7 h-7 sm:w-8 sm:h-8 text-[#202328]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 20 C13 10, 17 8, 24 8 C31 8, 35 10, 36 20 Z" fill="currentColor" />
          <path d="M12 19 C18 18, 30 18, 36 19 L36 21 C30 20, 18 20, 12 21 Z" fill="#F6CE46" />
          <path d="M4 22 C12 19, 36 19, 44 22 C46 23, 42 24, 34 24 C22 25, 10 24, 4 22 Z" fill="currentColor" />
          <rect x="11" y="27" width="10" height="7" rx="3" fill="currentColor" />
          <rect x="27" y="27" width="10" height="7" rx="3" fill="currentColor" />
          <path d="M21 30 C23 29, 25 29, 27 30" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>

      {/* 2. Anonymous Mask (Far Right Top) */}
      <div
        id="float-svg-mask"
        className="absolute top-8 right-5 sm:right-12 lg:right-20 xl:right-32 pointer-events-none select-none z-0 opacity-40 animate-float-2"
        style={{ filter: "drop-shadow(0 0 12px rgba(246, 206, 70, 0.8))" }}
      >
        <svg
          viewBox="0 0 48 48"
          className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 text-[#202328]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 6 C13 6, 8 15, 8 25 C8 35, 16 43, 24 43 C32 43, 40 35, 40 25 C40 15, 35 6, 24 6 Z"
            stroke="currentColor"
            strokeWidth="2.2"
            fill="currentColor"
            fillOpacity="0.06"
          />
          <path d="M14 20 C17 18, 20 18, 21 20 C19 22, 16 22, 14 20 Z" fill="#F6CE46" />
          <path d="M34 20 C31 18, 28 18, 27 20 C29 22, 32 22, 34 20 Z" fill="#F6CE46" />
          <path d="M17 31 C20 30, 22 29, 24 29 C26 29, 28 30, 31 31" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="24" cy="36" r="1.3" fill="#F6CE46" />
        </svg>
      </div>

      {/* 3. Security Padlock (Far Left Mid) */}
      <div
        id="float-svg-lock"
        className="absolute top-1/2 -translate-y-8 left-3 sm:left-8 lg:right-auto lg:left-16 xl:left-24 pointer-events-none select-none z-0 opacity-35 animate-float-3"
        style={{ filter: "drop-shadow(0 0 12px rgba(246, 206, 70, 0.8))" }}
      >
        <svg
          viewBox="0 0 48 48"
          className="w-6 h-6 sm:w-7 sm:h-7 text-[#202328]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 20 V15 C16 10.5, 19.5 7, 24 7 C28.5 7, 32 10.5, 32 15 V20"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <rect x="11" y="20" width="26" height="21" rx="5" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2.2" />
          <circle cx="24" cy="29" r="2.5" fill="#F6CE46" />
          <path d="M24 31.5 V35" stroke="#F6CE46" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* 4. Privacy Shield with Keyhole (Far Right Mid) */}
      <div
        id="float-svg-shield"
        className="absolute top-1/2 -translate-y-4 right-3 sm:right-8 lg:right-16 xl:right-24 pointer-events-none select-none z-0 opacity-35 animate-float-1"
        style={{ filter: "drop-shadow(0 0 12px rgba(246, 206, 70, 0.8))" }}
      >
        <svg
          viewBox="0 0 48 48"
          className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 text-[#202328]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 6 L38 11 C38 27, 32 36, 24 42 C16 36, 10 27, 10 11 L24 6 Z"
            stroke="currentColor"
            strokeWidth="2.4"
            fill="currentColor"
            fillOpacity="0.08"
          />
          <circle cx="24" cy="20" r="2.5" fill="#F6CE46" />
          <path d="M23 22 L22 28 L26 28 L25 22 Z" fill="#F6CE46" />
        </svg>
      </div>

      {/* Foreground Hero Content (Centered) */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center flex flex-col items-center justify-center">
        {/* Brand Top Headline: Purity Matters with Yellow Dot */}
        <div
          id="brand-top-headline"
          className="flex items-center justify-center gap-2.5 sm:gap-3.5 mb-2 sm:mb-3 text-center"
        >
          <span
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#F6CE46] ring-2 ring-[#202328]/20 shadow-[0_0_18px_#F6CE46] animate-pulse shrink-0"
            aria-hidden="true"
          />
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#202328] text-center">
            Purity Matters
          </h1>
          <span
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full opacity-0 pointer-events-none shrink-0"
            aria-hidden="true"
          />
        </div>

        {/* Prominent Question Headline: "What Are You Struggling With?" */}
        <div
          id="question-invitation-headline"
          className="w-full flex items-center justify-center text-center mb-2 sm:mb-3"
        >
          <h2 className="inline-flex items-center justify-center gap-2 text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#202328] text-center">
            <span className="text-center">What Are You Struggling With</span>
            <svg
              viewBox="0 0 14 22"
              className="w-5 h-7 sm:w-7 sm:h-10 md:w-8 md:h-11 inline-block text-[#202328] -mb-1 shrink-0"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="?"
            >
              <path
                d="M2.5 5.5 C2.5 2 11.5 2 11.5 6 C11.5 9 7 9.8 7 13.5"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <circle
                cx="7"
                cy="18.5"
                r="2.5"
                fill="#F6CE46"
                stroke="#202328"
                strokeWidth="0.8"
                style={{ filter: "drop-shadow(0 0 8px rgba(246, 206, 70, 1))" }}
              />
            </svg>
          </h2>
        </div>

        {/* Sub-headline */}
        <p
          id="sub-headline-confidentiality"
          className="text-sm sm:text-base md:text-lg font-medium tracking-tight text-[#202328]/80 mb-6 sm:mb-8 text-center max-w-2xl"
        >
          Search answered inquiries, biblical wisdom, and pastoral guidance in absolute confidentiality.
        </p>

        {/* Google-Style Search Bar with Semantic Recommendations */}
        <div className="w-full mb-6">
          <GoogleSearchBar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            allQuestions={allQuestions}
            onSelectQuestion={onSelectQuestion}
          />
        </div>

        {/* Smooth Link to Ask Question */}
        <div className="flex items-center justify-center text-center">
          <button
            type="button"
            id="btn-hero-scroll-ask"
            onClick={onScrollToAsk}
            className="text-xs font-semibold text-[#202328] hover:text-black underline underline-offset-4 decoration-[#F6CE46] decoration-2 transition-all cursor-pointer flex items-center gap-1.5 py-1"
          >
            <span>Can&apos;t find your question? Ask Anonymously</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#202328]" />
          </button>
        </div>
      </div>
    </section>
  );
}
