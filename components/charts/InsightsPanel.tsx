"use client";

import type { AnalysisReport, Recommendation } from "@/types";
import { cn } from "@/utils/cn";

// 1. Define the shape of AI Insights to satisfy TypeScript
interface AIInsights {
  executive_summary?: string;
  key_findings?: string[];
  priority_actions?: string[];
  positive_highlights?: string[];
  benchmark_context?: string;
}

interface Props {
  report: AnalysisReport;
  // Use the interface here instead of Record<string, unknown>
  aiInsights: AIInsights | null;
  aiLoading: boolean;
  onFetchAI: () => void;
}

const TYPE_CONFIG: Record<Recommendation["type"], { color: string; bg: string; icon: string; border: string }> = {
  critical: { color: "#ef4444", bg: "rgba(239,68,68,0.07)", icon: "🔴", border: "rgba(239,68,68,0.3)" },
  warning:  { color: "#f59e0b", bg: "rgba(245,158,11,0.07)", icon: "🟡", border: "rgba(245,158,11,0.25)" },
  info:     { color: "#06b6d4", bg: "rgba(6,182,212,0.07)",  icon: "🔵", border: "rgba(6,182,212,0.25)" },
  success:  { color: "#10b981", bg: "rgba(16,185,129,0.07)", icon: "✅", border: "rgba(16,185,129,0.25)" },
};

export default function InsightsPanel({ report, aiInsights, aiLoading, onFetchAI }: Props) {
  const criticals = report.recommendations.filter((r) => r.type === "critical");
  const warnings = report.recommendations.filter((r) => r.type === "warning");
  const infos = report.recommendations.filter((r) => r.type === "info");
  const successes = report.recommendations.filter((r) => r.type === "success");
  const ordered = [...criticals, ...warnings, ...infos, ...successes];

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">
            💡 Insights & Recommendations
          </h3>
          <p className="text-xs text-white/30 mt-1">{report.summary}</p>
        </div>
        {!aiInsights && (
          <button
            onClick={onFetchAI}
            disabled={aiLoading}
            className={cn(
              "px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200",
              aiLoading
                ? "bg-indigo-500/20 text-indigo-300/50 cursor-wait"
                : "bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:brightness-110 shadow-lg shadow-indigo-500/25"
            )}
          >
            {aiLoading ? "⏳ Generating AI Insights..." : "✨ Generate AI Insights"}
          </button>
        )}
      </div>

      {/* Rule-based recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {ordered.map((rec, i) => {
          const cfg = TYPE_CONFIG[rec.type];
          return (
            <div
              key={i}
              className="rounded-xl p-3.5"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
            >
              <div className="flex items-start gap-2 mb-1.5">
                <span className="text-sm">{cfg.icon}</span>
                <div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: cfg.color }}
                  >
                    {rec.category}
                  </span>
                  <p className="text-xs text-white/70 mt-0.5 leading-relaxed">{rec.insight}</p>
                </div>
              </div>
              <div className="pl-6">
                <p className="text-xs text-white/45 leading-relaxed">
                  <span className="text-white/30">→ </span>{rec.action}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Insights Panel */}
      {aiInsights && (
        <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/[0.06] p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base">✨</span>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
              AI-Generated Analysis
            </span>
            <button
              onClick={() => onFetchAI()}
              disabled={aiLoading}
              className="ml-auto text-[10px] text-indigo-400/60 hover:text-indigo-300 transition-colors"
            >
              ↺ Regenerate
            </button>
          </div>

          {/* Executive summary - Fixed type error by ensuring it's treated as string */}
          {aiInsights.executive_summary && (
            <p className="text-sm text-white/75 leading-relaxed mb-4 pb-4 border-b border-white/[0.07]">
              {aiInsights.executive_summary}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Key findings */}
            {aiInsights.key_findings && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-2.5">
                  Key Findings
                </p>
                {aiInsights.key_findings.map((f, i) => (
                  <div
                    key={i}
                    className="text-xs text-white/65 leading-relaxed mb-2 pl-3 border-l-2 border-indigo-400/30"
                  >
                    {f}
                  </div>
                ))}
              </div>
            )}

            {/* Priority actions */}
            {aiInsights.priority_actions && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-2.5">
                  Priority Actions
                </p>
                {aiInsights.priority_actions.map((a, i) => (
                  <div
                    key={i}
                    className="text-xs text-white/65 leading-relaxed mb-2 pl-3 border-l-2 border-emerald-400/30"
                  >
                    {a}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Positives and benchmark */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/[0.07]">
            {aiInsights.positive_highlights && aiInsights.positive_highlights.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60 mb-2">
                  ✅ What&apos;s Working
                </p>
                {aiInsights.positive_highlights.map((h, i) => (
                  <p key={i} className="text-xs text-white/50 mb-1">{h}</p>
                ))}
              </div>
            )}
            {aiInsights.benchmark_context && (
              <div className="text-xs text-white/45 bg-white/[0.03] rounded-lg p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/30 mb-1">
                  📊 Industry Benchmark
                </p>
                {aiInsights.benchmark_context}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}