// lib/sus.ts
import type { SUSGrade } from "@/types";

export const Q_LABELS: Record<string, string> = {
  Q1: "System Use Frequency",
  Q2: "Complexity",
  Q3: "Ease of Use",
  Q4: "Need for Support",
  Q5: "Feature Integration",
  Q6: "Inconsistency",
  Q7: "Quick Learning",
  Q8: "Cumbersome",
  Q9: "Confidence",
  Q10: "Learning Curve",
};

export const Q_POLARITY: Record<string, "positive" | "negative"> = {
  Q1: "positive",
  Q2: "negative",
  Q3: "positive",
  Q4: "negative",
  Q5: "positive",
  Q6: "negative",
  Q7: "positive",
  Q8: "negative",
  Q9: "positive",
  Q10: "negative",
};

/**
 * Transform a single question score per SUS rules:
 * - Odd questions (positive): score - 1
 * - Even questions (negative): 5 - score
 */
export function transformScore(questionIndex: number, rawScore: number): number {
  return questionIndex % 2 === 1 ? rawScore - 1 : 5 - rawScore;
}

/**
 * Compute the SUS score for a single respondent.
 * Returns null if any score is invalid.
 */
export function computeSUSScore(scores: number[]): number | null {
  if (scores.length !== 10) return null;
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    const s = scores[i];
    if (s < 1 || s > 5 || !Number.isInteger(s)) return null;
    sum += transformScore(i + 1, s);
  }
  return sum * 2.5;
}

/**
 * Return a letter grade and description for a SUS score.
 */
export function getSUSGrade(score: number): SUSGrade {
  if (score >= 90) return { label: "A+", desc: "Best Imaginable", color: "#10b981", bgColor: "rgba(16,185,129,0.15)" };
  if (score >= 85) return { label: "A",  desc: "Excellent",       color: "#10b981", bgColor: "rgba(16,185,129,0.12)" };
  if (score >= 80) return { label: "B+", desc: "Good",            color: "#84cc16", bgColor: "rgba(132,204,22,0.12)" };
  if (score >= 70) return { label: "B",  desc: "Good",            color: "#84cc16", bgColor: "rgba(132,204,22,0.10)" };
  if (score >= 68) return { label: "C+", desc: "Acceptable",      color: "#f59e0b", bgColor: "rgba(245,158,11,0.12)" };
  if (score >= 51) return { label: "C",  desc: "Marginal",        color: "#f97316", bgColor: "rgba(249,115,22,0.12)" };
  return              { label: "F",  desc: "Unacceptable",    color: "#ef4444", bgColor: "rgba(239,68,68,0.12)"  };
}

/**
 * Estimate the percentile rank of a SUS score based on Sauro & Lewis (2012).
 */
export function getSUSPercentile(score: number): string {
  if (score >= 96) return "Top 5%";
  if (score >= 89) return "Top 10%";
  if (score >= 83) return "Top 25%";
  if (score >= 68) return "Above Average";
  if (score >= 51) return "Average";
  if (score >= 38) return "Below Average";
  return "Bottom 10%";
}

/**
 * Compute the normalized usability score (0–100%) for a question,
 * accounting for polarity.
 */
export function normalizeQScore(questionIndex: number, avgScore: number): number {
  const transformed = transformScore(questionIndex, avgScore);
  return (transformed / 4) * 100;
}
