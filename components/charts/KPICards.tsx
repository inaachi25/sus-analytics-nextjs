// components/charts/KPICards.tsx
"use client";

import type { SUSMetrics, SUSGrade } from "@/types";

interface KPICardsProps {
  metrics: SUSMetrics;
  grade: SUSGrade;
  percentile: string;
}

export default function KPICards({ metrics, grade, percentile }: KPICardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Hero SUS Score card */}
      <div
        className="col-span-2 md:col-span-1 rounded-2xl p-6 relative overflow-hidden"
        style={{ background: grade.bgColor, border: `1px solid ${grade.color}33` }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: `radial-gradient(circle at top right, ${grade.color}, transparent)` }}
        />
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: grade.color }}>
          Overall SUS Score
        </p>
        <p className="text-6xl font-black font-mono leading-none mb-1 score-glow" style={{ color: grade.color }}>
          {metrics.mean.toFixed(1)}
        </p>
        <p className="text-sm font-semibold text-white/60 mt-2">
          Grade{" "}
          <span className="font-bold" style={{ color: grade.color }}>{grade.label}</span>
          {" · "}
          {grade.desc}
        </p>
        <p className="text-xs text-white/40 mt-1">{percentile}</p>

        {/* SUS scale bar */}
        <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${metrics.mean}%`, background: grade.color }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-white/25 mt-1">
          <span>0</span><span>68</span><span>100</span>
        </div>
      </div>

      {/* Std Dev */}
      <MetricCard
        icon="📐"
        label="Std. Deviation"
        value={metrics.stdDev.toFixed(1)}
        sub={metrics.stdDev > 15 ? "High variability" : "Consistent scores"}
        color="#8b5cf6"
      />

      {/* Total */}
      <MetricCard
        icon="👥"
        label="Total Responses"
        value={String(metrics.total)}
        sub="Valid responses"
        color="#06b6d4"
      />

      {/* Median */}
      <MetricCard
        icon="📊"
        label="Median Score"
        value={metrics.median.toFixed(1)}
        sub={`vs mean ${metrics.mean.toFixed(1)}`}
        color="#f59e0b"
      />
    </div>
  );
}

function MetricCard({
  icon, label, value, sub, color,
}: {
  icon: string; label: string; value: string; sub: string; color: string;
}) {
  return (
    <div className="card p-5 relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-10"
        style={{ background: color }}
      />
      <div className="text-2xl mb-3">{icon}</div>
      <p className="text-3xl font-black font-mono leading-none" style={{ color }}>
        {value}
      </p>
      <p className="text-xs text-white/50 font-medium mt-1.5">{label}</p>
      <p className="text-[10px] text-white/30 mt-0.5">{sub}</p>
    </div>
  );
}
