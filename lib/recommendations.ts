// lib/recommendations.ts
import type { SUSMetrics, AnalysisReport, Recommendation } from "@/types";
import { getSUSGrade, getSUSPercentile, Q_LABELS } from "./sus";

/**
 * Generate a full analysis report from computed metrics.
 */
export function generateReport(metrics: SUSMetrics): AnalysisReport {
  const grade = getSUSGrade(metrics.mean);
  const percentile = getSUSPercentile(metrics.mean);
  const recommendations: Recommendation[] = [];

  // Overall score evaluation
  if (metrics.mean >= 85) {
    recommendations.push({
      type: "success",
      category: "Overall Score",
      insight: `Excellent usability with a SUS score of ${metrics.mean.toFixed(1)} (${grade.desc}).`,
      action: "Maintain current UX standards. Consider A/B testing incremental improvements.",
    });
  } else if (metrics.mean >= 68) {
    recommendations.push({
      type: "info",
      category: "Overall Score",
      insight: `Acceptable usability score of ${metrics.mean.toFixed(1)}. Most users can use the system effectively.`,
      action: "Target specific pain points to push the score above 80.",
    });
  } else {
    recommendations.push({
      type: "critical",
      category: "Overall Score",
      insight: `Below-average SUS score of ${metrics.mean.toFixed(1)} indicates significant usability issues.`,
      action: "Prioritize a usability audit and conduct targeted user testing immediately.",
    });
  }

  // Variability check
  if (metrics.stdDev > 15) {
    recommendations.push({
      type: "warning",
      category: "Consistency",
      insight: `High variability in scores (σ = ${metrics.stdDev.toFixed(1)}) suggests inconsistent user experiences.`,
      action: "Segment users and investigate what differentiates high vs. low scorers.",
    });
  }

  // Q-level analysis
  const { qAverages } = metrics;

  if (qAverages.Q2 > 3.5) {
    recommendations.push({
      type: "critical",
      category: Q_LABELS.Q2,
      insight: `Q2 avg ${qAverages.Q2.toFixed(2)}: Users perceive the system as overly complex.`,
      action: "Reduce cognitive load. Simplify menus, streamline workflows, and eliminate unnecessary features.",
    });
  }

  if (qAverages.Q3 < 2.5) {
    recommendations.push({
      type: "critical",
      category: Q_LABELS.Q3,
      insight: `Q3 avg ${qAverages.Q3.toFixed(2)}: Ease of use is critically low.`,
      action: "Conduct usability testing to identify friction. Redesign key interaction flows.",
    });
  } else if (qAverages.Q3 < 3.5) {
    recommendations.push({
      type: "warning",
      category: Q_LABELS.Q3,
      insight: `Q3 avg ${qAverages.Q3.toFixed(2)}: Ease of use has room for improvement.`,
      action: "Add progressive disclosure and contextual help to assist users.",
    });
  }

  if (qAverages.Q4 > 3.5) {
    recommendations.push({
      type: "warning",
      category: Q_LABELS.Q4,
      insight: `Q4 avg ${qAverages.Q4.toFixed(2)}: Many users feel they need technical support.`,
      action: "Improve in-app documentation, add tooltips, and build a self-service help center.",
    });
  }

  if (qAverages.Q6 > 3.5) {
    recommendations.push({
      type: "warning",
      category: Q_LABELS.Q6,
      insight: `Q6 avg ${qAverages.Q6.toFixed(2)}: Users find the system inconsistent.`,
      action: "Audit UI patterns for consistency. Standardize terminology and visual design.",
    });
  }

  if (qAverages.Q7 < 3.0) {
    recommendations.push({
      type: "critical",
      category: Q_LABELS.Q7,
      insight: `Q7 avg ${qAverages.Q7.toFixed(2)}: Users struggle to learn the system quickly.`,
      action: "Create guided onboarding tours and improve feature discoverability with progressive disclosure.",
    });
  }

  if (qAverages.Q8 > 3.5) {
    recommendations.push({
      type: "warning",
      category: Q_LABELS.Q8,
      insight: `Q8 avg ${qAverages.Q8.toFixed(2)}: Users find the system cumbersome to use.`,
      action: "Streamline common workflows. Reduce the number of steps to complete key tasks.",
    });
  }

  if (qAverages.Q9 < 3.0) {
    recommendations.push({
      type: "warning",
      category: Q_LABELS.Q9,
      insight: `Q9 avg ${qAverages.Q9.toFixed(2)}: Users lack confidence while using the system.`,
      action: "Add confirmation dialogs, undo functionality, and clear error recovery paths.",
    });
  }

  if (qAverages.Q10 > 3.5) {
    recommendations.push({
      type: "info",
      category: Q_LABELS.Q10,
      insight: `Q10 avg ${qAverages.Q10.toFixed(2)}: Users face a steep learning curve.`,
      action: "Invest in onboarding resources: video tutorials, quick-start guides, and interactive demos.",
    });
  }

  // Positive highlights
  if (qAverages.Q1 > 4.0) {
    recommendations.push({
      type: "success",
      category: Q_LABELS.Q1,
      insight: `Q1 avg ${qAverages.Q1.toFixed(2)}: Strong intent to use the system frequently.`,
      action: "Leverage high engagement. Invest in retention features and loyalty programs.",
    });
  }

  if (qAverages.Q5 > 4.0) {
    recommendations.push({
      type: "success",
      category: Q_LABELS.Q5,
      insight: `Q5 avg ${qAverages.Q5.toFixed(2)}: Users find features well integrated.`,
      action: "Continue building cohesive feature sets. Use this as a benchmark for new features.",
    });
  }

  // Device comparison
  if (metrics.byDevice.length >= 2) {
    const best = metrics.byDevice[0];
    const worst = metrics.byDevice[metrics.byDevice.length - 1];
    if (best.value - worst.value > 10) {
      recommendations.push({
        type: "warning",
        category: "Device Parity",
        insight: `Significant SUS gap: ${best.name} (${best.value}) vs ${worst.name} (${worst.value}).`,
        action: `Prioritize UX improvements on ${worst.name}. Conduct device-specific testing.`,
      });
    }
  }

  // New vs Returning
  const newUser = metrics.byUserType.find((u) => u.name === "New");
  const returningUser = metrics.byUserType.find((u) => u.name === "Returning");
  if (newUser && returningUser && returningUser.value - newUser.value > 10) {
    recommendations.push({
      type: "info",
      category: "Onboarding",
      insight: `New users score ${newUser.value} vs returning users ${returningUser.value} — a ${(returningUser.value - newUser.value).toFixed(1)} pt gap.`,
      action: "Invest in onboarding. New user experience needs significant improvement.",
    });
  }

  const summary = buildSummary(metrics.mean, grade.label, grade.desc, percentile, metrics.total);

  return {
    grade: grade.label,
    gradeLabel: grade.desc,
    summary,
    recommendations,
  };
}

function buildSummary(
  mean: number,
  grade: string,
  desc: string,
  percentile: string,
  total: number
): string {
  return `Based on ${total} responses, the system achieved a SUS score of ${mean.toFixed(1)} — Grade ${grade} (${desc}), placing it in the ${percentile} range. ${
    mean >= 85
      ? "Users find the system intuitive and easy to use."
      : mean >= 68
      ? "The system meets usability expectations but has room for targeted improvements."
      : "The system requires significant usability improvements across multiple dimensions."
  }`;
}
