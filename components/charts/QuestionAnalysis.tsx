// components/charts/QuestionAnalysis.tsx
"use client";

import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, Tooltip, ResponsiveContainer,
} from "recharts";
import type { QAverages } from "@/types";
import { Q_LABELS, Q_POLARITY, normalizeQScore } from "@/lib/sus";

interface Props {
  qAverages: QAverages;
}

export default function QuestionAnalysis({ qAverages }: Props) {
  const radarData = Object.entries(qAverages).map(([q, avg]) => ({
    q,
    value: parseFloat((avg as number).toFixed(2)),
    fullMark: 5,
  }));

  return (
    <div className="card p-5">
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">
        Question-Level Analysis (Q1–Q10)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar breakdown */}
        <div className="space-y-3">
          {Object.entries(qAverages).map(([q, avg]) => {
            const qNum = parseInt(q.slice(1));
            const score = avg as number;
            const normalized = normalizeQScore(qNum, score);
            const color = normalized >= 70 ? "#10b981" : normalized >= 50 ? "#f59e0b" : "#ef4444";
            const polarity = Q_POLARITY[q];

            return (
              <div key={q}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-300 font-mono w-6">{q}</span>
                    <span className="text-xs text-white/50">{Q_LABELS[q]}</span>
                    <span className="text-[9px] text-white/25 border border-white/10 rounded px-1 py-0.5">
                      {polarity === "positive" ? "▲ higher=better" : "▼ lower=better"}
                    </span>
                  </div>
                  <span className="text-xs font-bold font-mono" style={{ color }}>
                    {score.toFixed(2)}
                  </span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${normalized}%`, background: color }}
                  />
                </div>
                <div className="flex justify-between mt-0.5">
                  <span className="text-[9px] text-white/20">Normalized: {normalized.toFixed(0)}%</span>
                  {normalized < 50 && (
                    <span className="text-[9px] text-red-400/70">⚠ Needs attention</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Radar chart */}
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} cx="50%" cy="50%">
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis
                dataKey="q"
                tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 600 }}
              />
              <PolarRadiusAxis
                angle={90} domain={[0, 5]}
                tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9 }}
                axisLine={false}
              />
              <Radar
                name="Avg Score"
                dataKey="value"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  background: "#1e1e32",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  fontSize: 12,
                }}
                formatter={(val: number, name: string, props: any) => [
                  `${val} — ${Q_LABELS[props.payload.q]}`,
                  "Avg Score"
                ]}
              />
            </RadarChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-white/25 text-center mt-1">
            Radar shows raw averages (1–5 scale)
          </p>
        </div>
      </div>
    </div>
  );
}
