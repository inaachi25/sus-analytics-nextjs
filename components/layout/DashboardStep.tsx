// components/layout/DashboardStep.tsx
"use client";

import type { SUSMetrics, AnalysisReport, CleanedRow } from "@/types";
import { getSUSGrade, getSUSPercentile } from "@/lib/sus";
import { exportToCSV } from "@/utils/export";

import KPICards from "@/components/charts/KPICards";
import DistributionChart from "@/components/charts/DistributionChart";
import SegmentChart from "@/components/charts/SegmentChart";
import MonthTrendChart from "@/components/charts/MonthTrendChart";
import QuestionAnalysis from "@/components/charts/QuestionAnalysis";
import InsightsPanel from "@/components/charts/InsightsPanel";

interface DashboardStepProps {
  metrics: SUSMetrics;
  report: AnalysisReport;
  cleanedData: CleanedRow[];
  fileName: string;
  aiInsights: Record<string, unknown> | null;
  aiLoading: boolean;
  onSetAiInsights: (insights: Record<string, unknown> | null) => void;
  onSetAiLoading: (loading: boolean) => void;
  onBack: () => void;
  onReset: () => void;
}

export default function DashboardStep({
  metrics, report, cleanedData, fileName,
  aiInsights, aiLoading, onSetAiInsights, onSetAiLoading,
  onBack, onReset,
}: DashboardStepProps) {
  const grade = getSUSGrade(metrics.mean);
  const percentile = getSUSPercentile(metrics.mean);

  const fetchAIInsights = async () => {
    onSetAiLoading(true);
    onSetAiInsights(null);

    try {
      const { recommendations } = report;
      const insightTexts = recommendations.map((r) => r.insight).join("; ");

      const prompt = `You are a senior UX researcher analyzing System Usability Scale (SUS) survey results.

Survey Results Summary:
- Overall SUS Score: ${metrics.mean.toFixed(1)} / 100 (Grade: ${grade.label} — ${grade.desc})
- Standard Deviation: ${metrics.stdDev.toFixed(1)} (${metrics.stdDev > 15 ? "high variability" : "low variability"})
- Total Responses: ${metrics.total}
- Percentile: ${percentile}

Question Averages (1–5 scale):
${Object.entries(metrics.qAverages).map(([q, v]) => `  ${q}: ${(v as number).toFixed(2)}`).join("\n")}

Segmented Scores:
  By Device: ${metrics.byDevice.map((d) => `${d.name} = ${d.value} (n=${d.count})`).join(", ")}
  By User Type: ${metrics.byUserType.map((u) => `${u.name} = ${u.value} (n=${u.count})`).join(", ")}

Rule-based insights already identified: ${insightTexts}

Provide a concise, expert analysis. Respond ONLY with a valid JSON object — no preamble, no markdown fences:
{
  "executive_summary": "2–3 sentences for stakeholders",
  "key_findings": ["finding 1", "finding 2", "finding 3"],
  "priority_actions": ["action 1 (impact: high)", "action 2 (impact: medium)", "action 3 (impact: medium)"],
  "benchmark_context": "How this score compares to industry SUS averages",
  "positive_highlights": ["what is working well 1", "what is working well 2"]
}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();
      const raw = data.content?.find((b: { type: string }) => b.type === "text")?.text ?? "{}";
      const clean = raw.replace(/```json|```/g, "").trim();
      onSetAiInsights(JSON.parse(clean));
    } catch (err) {
      console.error("AI insights error:", err);
      // Graceful fallback
      onSetAiInsights({
        executive_summary: report.summary,
        key_findings: report.recommendations.slice(0, 3).map((r) => r.insight),
        priority_actions: report.recommendations
          .filter((r) => r.type === "critical" || r.type === "warning")
          .slice(0, 3)
          .map((r) => r.action),
        benchmark_context: `Industry SUS average is ~68. Your score of ${metrics.mean.toFixed(1)} is ${metrics.mean >= 68 ? "above" : "below"} average.`,
        positive_highlights: report.recommendations
          .filter((r) => r.type === "success")
          .map((r) => r.insight),
      });
    }

    onSetAiLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold mb-0.5">Analytics Dashboard</h2>
          <p className="text-xs text-white/40">{fileName} · {metrics.total} respondents analyzed</p>
        </div>
        <div className="flex gap-2.5 flex-wrap">
          <button
            onClick={() => exportToCSV(cleanedData, `sus_results_${Date.now()}.csv`)}
            className="px-3 py-2 text-xs font-semibold border border-white/10 rounded-lg text-white/50 hover:text-white/70 hover:border-white/20 transition-all"
          >
            ↓ Export CSV
          </button>
          <button
            onClick={onBack}
            className="px-3 py-2 text-sm text-white/50 border border-white/10 rounded-lg hover:border-white/20 transition-all"
          >
            ← Preview
          </button>
          <button
            onClick={onReset}
            className="px-3 py-2 text-sm text-indigo-300 bg-indigo-500/15 border border-indigo-400/30 rounded-lg hover:border-indigo-400/50 transition-all"
          >
            ↑ New Upload
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <KPICards metrics={metrics} grade={grade} percentile={percentile} />

      {/* Charts — Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DistributionChart distribution={metrics.distribution} />
        <SegmentChart data={metrics.byDevice} title="SUS by Device" colors={["#6366f1","#8b5cf6","#06b6d4","#10b981"]} />
      </div>

      {/* Charts — Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SegmentChart data={metrics.byUserType} title="New vs. Returning Users" colors={["#8b5cf6","#06b6d4"]} horizontal={false} />
        <MonthTrendChart data={metrics.byMonth} />
      </div>

      {/* Question Analysis */}
      <QuestionAnalysis qAverages={metrics.qAverages} />

      {/* Insights */}
      <InsightsPanel
        report={report}
        aiInsights={aiInsights}
        aiLoading={aiLoading}
        onFetchAI={fetchAIInsights}
      />
    </div>
  );
}
