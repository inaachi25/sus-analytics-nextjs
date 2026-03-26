// lib/metrics.ts
import type { CleanedRow, SUSMetrics, SegmentedMetric, QAverages, DistributionBucket } from "@/types";

/**
 * Compute all SUS metrics from cleaned respondent data.
 */
export function computeMetrics(data: CleanedRow[]): SUSMetrics | null {
  if (!data.length) return null;

  const scores = data.map((r) => r.sus);
  const mean = average(scores);
  const stdDev = standardDeviation(scores, mean);
  const median = computeMedian(scores);

  const byDevice = groupBySegment(data, "device");
  const byUserType = groupBySegment(data, "userType");
  const byMonth = groupByMonth(data);

  const qAverages = computeQAverages(data);
  const distribution = computeDistribution(scores);

  return {
    mean,
    stdDev,
    median,
    total: data.length,
    byDevice,
    byUserType,
    byMonth,
    qAverages,
    distribution,
    scores,
  };
}

// ─── Internal Helpers ─────────────────────────────────────────────────────────

function average(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function standardDeviation(nums: number[], mean?: number): number {
  const m = mean ?? average(nums);
  const variance = nums.reduce((sum, n) => sum + Math.pow(n - m, 2), 0) / nums.length;
  return Math.sqrt(variance);
}

function computeMedian(sorted_: number[]): number {
  const arr = [...sorted_].sort((a, b) => a - b);
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 === 0 ? (arr[mid - 1] + arr[mid]) / 2 : arr[mid];
}

function groupBySegment(
  data: CleanedRow[],
  key: "device" | "userType"
): SegmentedMetric[] {
  const groups: Record<string, number[]> = {};

  for (const row of data) {
    const k = row[key] || "Unknown";
    if (!groups[k]) groups[k] = [];
    groups[k].push(row.sus);
  }

  return Object.entries(groups)
    .map(([name, vals]) => ({
      name,
      value: Math.round(average(vals) * 10) / 10,
      count: vals.length,
    }))
    .sort((a, b) => b.value - a.value);
}

const MONTH_ORDER = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function groupByMonth(data: CleanedRow[]): SegmentedMetric[] {
  const groups: Record<string, number[]> = {};

  for (const row of data) {
    const m = row.month || "Unknown";
    if (!groups[m]) groups[m] = [];
    groups[m].push(row.sus);
  }

  return Object.entries(groups)
    .map(([name, vals]) => ({
      name,
      value: Math.round(average(vals) * 10) / 10,
      count: vals.length,
    }))
    .sort((a, b) => {
      const ai = MONTH_ORDER.indexOf(a.name);
      const bi = MONTH_ORDER.indexOf(b.name);
      if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
}

function computeQAverages(data: CleanedRow[]): QAverages {
  const result = {} as QAverages;
  for (let q = 1; q <= 10; q++) {
    const key = `Q${q}` as keyof QAverages;
    const vals = data.map((r) => r[key]);
    result[key] = Math.round(average(vals) * 100) / 100;
  }
  return result;
}

const DISTRIBUTION_BUCKETS = [
  { range: "0–25",  min: 0,  max: 25,  color: "#ef4444" },
  { range: "25–50", min: 25, max: 50,  color: "#f97316" },
  { range: "50–68", min: 50, max: 68,  color: "#f59e0b" },
  { range: "68–80", min: 68, max: 80,  color: "#84cc16" },
  { range: "80–100",min: 80, max: 101, color: "#10b981" },
];

function computeDistribution(scores: number[]): DistributionBucket[] {
  return DISTRIBUTION_BUCKETS.map(({ range, min, max, color }) => ({
    range,
    count: scores.filter((s) => s >= min && s < max).length,
    color,
  }));
}
