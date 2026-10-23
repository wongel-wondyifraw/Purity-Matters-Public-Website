import { AnonymousQuestion } from "@/types";

export interface SemanticMatch {
  question: AnonymousQuestion;
  score: number;
  matchedSnippet: string;
  matchedField: "question" | "answer" | "both";
}

export interface StruggleTopic {
  label: string;
  query: string;
  keywords: string[];
}

// Curated biblical & emotional struggle topics for quick navigation
export const POPULAR_STRUGGLE_TOPICS: StruggleTopic[] = [
  {
    label: "Overcoming Shame & Guilt",
    query: "shame guilt condemnation",
    keywords: ["shame", "guilt", "condemnation", "regret", "unworthy", "failure"],
  },
  {
    label: "Breaking Habitual Loops & Pornography",
    query: "pornography addiction habits",
    keywords: ["pornography", "porn", "habit", "addiction", "compulsive", "lust", "relapse"],
  },
  {
    label: "Restoring Emotional & Sexual Intimacy",
    query: "restore intimacy marriage",
    keywords: ["intimacy", "marriage", "relationship", "spouse", "trust", "connection"],
  },
  {
    label: "God's Grace & Complete Forgiveness",
    query: "forgiveness grace repentance",
    keywords: ["forgiveness", "grace", "repentance", "mercy", "cleansed", "restored"],
  },
  {
    label: "Building Accountability & Boundaries",
    query: "accountability boundaries help",
    keywords: ["accountability", "boundaries", "partner", "confession", "triggers"],
  },
];

// Semantic synonym map
const SYNONYMS: Record<string, string[]> = {
  porn: ["pornography", "compulsive", "addiction", "lust", "triggers"],
  pornography: ["porn", "compulsive", "addiction", "lust", "intimacy"],
  shame: ["guilt", "condemnation", "failure", "regret", "unworthy"],
  guilt: ["shame", "condemnation", "conviction", "repentance"],
  masturbation: ["habit", "relapse", "temptation", "compulsive", "addiction"],
  intimacy: ["marriage", "restoration", "spouse", "connection", "emotional"],
  addiction: ["compulsive", "habit", "pornography", "freedom", "recovery"],
  healing: ["trauma", "restoration", "inner", "wound", "recovery"],
  boundaries: ["accountability", "triggers", "discipline", "protection"],
  temptation: ["triggers", "struggle", "resistance", "spiritual", "warfare"],
};

function getExpandedKeywords(query: string): string[] {
  const words = query
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 1);

  const set = new Set<string>(words);
  for (const word of words) {
    if (SYNONYMS[word]) {
      for (const syn of SYNONYMS[word]) {
        set.add(syn);
      }
    }
  }
  return Array.from(set);
}

function extractSnippet(text: string, searchTerms: string[], maxLen = 110): string {
  if (!text) return "";
  const lowerText = text.toLowerCase();
  
  // Find index of first matching term
  let matchIndex = -1;
  for (const term of searchTerms) {
    const idx = lowerText.indexOf(term.toLowerCase());
    if (idx !== -1 && (matchIndex === -1 || idx < matchIndex)) {
      matchIndex = idx;
    }
  }

  if (matchIndex === -1) {
    return text.length > maxLen ? text.slice(0, maxLen).trim() + "..." : text;
  }

  const start = Math.max(0, matchIndex - 30);
  const end = Math.min(text.length, matchIndex + maxLen);
  let snippet = text.slice(start, end).trim();
  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";
  return snippet;
}

export function searchSemanticQuestions(
  query: string,
  questions: AnonymousQuestion[],
  limit = 4
): SemanticMatch[] {
  if (!query || !query.trim() || !questions || questions.length === 0) {
    return [];
  }

  const trimmed = query.trim().toLowerCase();
  const searchKeywords = getExpandedKeywords(trimmed);

  const scored: SemanticMatch[] = [];

  for (const q of questions) {
    const qText = (q.question || "").toLowerCase();
    const aText = (q.answer || "").toLowerCase();

    let score = 0;
    let matchedInQuestion = false;
    let matchedInAnswer = false;

    // Exact phrase match
    if (qText.includes(trimmed)) {
      score += 120;
      matchedInQuestion = true;
    }
    if (aText.includes(trimmed)) {
      score += 80;
      matchedInAnswer = true;
    }

    // Keyword & synonym matches
    for (const kw of searchKeywords) {
      if (qText.includes(kw)) {
        score += 35;
        matchedInQuestion = true;
      }
      if (aText.includes(kw)) {
        score += 20;
        matchedInAnswer = true;
      }
    }

    if (score > 0) {
      const field =
        matchedInQuestion && matchedInAnswer
          ? "both"
          : matchedInQuestion
          ? "question"
          : "answer";

      const snippet = extractSnippet(
        q.answer || q.question || "",
        searchKeywords
      );

      scored.push({
        question: q,
        score,
        matchedSnippet: snippet,
        matchedField: field,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

export function getRecommendedTopics(query?: string): StruggleTopic[] {
  if (!query || !query.trim()) {
    return POPULAR_STRUGGLE_TOPICS;
  }

  const qLower = query.toLowerCase();
  const matched = POPULAR_STRUGGLE_TOPICS.filter((topic) =>
    topic.keywords.some((k) => qLower.includes(k) || k.includes(qLower))
  );

  return matched.length > 0 ? matched : POPULAR_STRUGGLE_TOPICS.slice(0, 3);
}
