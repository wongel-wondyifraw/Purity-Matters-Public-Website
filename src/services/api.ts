import { AnonymousQuestion } from "@/types";
import { DEFAULT_PUBLIC_QUESTIONS } from "@/lib/defaultQuestions";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API ||
  "http://localhost:3001"
).replace(/\/+$/, "");

export async function submitAnonymousQuestion(
  question: string,
  category: string = "General Inquiry"
): Promise<AnonymousQuestion> {
  const res = await fetch(`${API_BASE_URL}/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, category }),
  });

  if (!res.ok) {
    let msg = "Could not submit question";
    try {
      const err = await res.json();
      msg = err.message || msg;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}

export async function fetchPublicWisdomQuestions(
  category?: string,
  search?: string
): Promise<AnonymousQuestion[]> {
  const params = new URLSearchParams();
  if (category && category !== "all") params.append("category", category);
  if (search && search.trim()) params.append("search", search.trim());

  const url = `${API_BASE_URL}/questions/public${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Could not fetch questions from server, using curated wisdom questions:", err);
  }

  // Graceful fallback to default curated questions
  let results = [...DEFAULT_PUBLIC_QUESTIONS];
  if (category && category !== "all") {
    results = results.filter((q) => q.category.toLowerCase() === category.toLowerCase());
  }
  if (search && search.trim()) {
    const s = search.toLowerCase().trim();
    results = results.filter(
      (q) => q.question.toLowerCase().includes(s) || (q.answer && q.answer.toLowerCase().includes(s))
    );
  }
  return results;
}

export async function fetchMyQuestionsStatus(
  ids: number[]
): Promise<AnonymousQuestion[]> {
  if (!ids || ids.length === 0) return [];

  const res = await fetch(`${API_BASE_URL}/questions/my-status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}
