"use client";

import React, { useEffect } from "react";
import { X, CheckCircle2, User, ArrowRight, ShieldCheck } from "lucide-react";
import { AnonymousQuestion } from "@/types";
import Link from "next/link";

interface QuestionReaderModalProps {
  question: AnonymousQuestion | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuestionReaderModal({
  question,
  isOpen,
  onClose,
}: QuestionReaderModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !question) return null;

  return (
    <div
      id="question-reader-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="question-reader-modal"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          id="question-modal-header"
          className="flex items-center justify-between px-6 py-4 border-b border-black/[0.08] bg-[#F8F9FA]"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F6CE46] ring-2 ring-[#202328]/20" />
            <span className="text-xs font-bold text-[#202328] uppercase tracking-wider">
              Answered Inquiry
            </span>
            {question.category && (
              <span className="text-[11px] font-semibold text-neutral-600 bg-neutral-200/70 px-2.5 py-0.5 rounded-full">
                {question.category}
              </span>
            )}
          </div>

          <button
            type="button"
            id="btn-close-modal"
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-500 hover:text-black hover:bg-neutral-200/80 transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div
          id="question-modal-body"
          className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1 text-left"
        >
          {/* Question Text */}
          <div id="modal-question-block" className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verified Pastoral Care</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#202328] leading-snug">
              {question.question}
            </h2>
          </div>

          {/* Pastoral Answer Container */}
          <div
            id="modal-answer-block"
            className="rounded-2xl bg-[#202328] text-white p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between text-xs border-b border-white/15 pb-3">
              <div className="flex items-center gap-2 font-semibold text-[#F6CE46]">
                <User className="w-4 h-4" />
                <span>
                  {question.assignedCounselor || "Pastoral Counseling Team"}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-neutral-300 uppercase tracking-wider font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F6CE46]" />
                <span>Biblical Guidance</span>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-neutral-100 whitespace-pre-wrap leading-relaxed font-normal">
              <p>{question.answer || "Guidance pending pastoral review."}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          id="question-modal-footer"
          className="flex items-center justify-between px-6 py-4 border-t border-black/[0.08] bg-[#F8F9FA] gap-3"
        >
          <Link
            href={`/questions?id=${question.id}`}
            onClick={onClose}
            className="text-xs font-semibold text-[#202328] hover:text-black hover:underline flex items-center gap-1.5 transition-colors"
          >
            <span>Open in All Questions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            id="btn-modal-dismiss"
            onClick={onClose}
            className="bg-[#202328] hover:bg-black text-[#F6CE46] text-xs font-bold px-5 py-2.5 rounded-full transition-all cursor-pointer"
          >
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
}
