// components/charts/DistributionChart.tsx
"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from "recharts";
import type { DistributionBucket } from "@/types";

interface Props {
  distribution: DistributionBucket[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1e1e32] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-white/80 mb-0.5">Score range: {label}</p>
      <p className="text-white/50">{payload[0].value} respondents</p>
    </div>
  );
};

export default function DistributionChart({ distribution }: Props) {
  const total = distribution.reduce((s, b) => s + b.count, 0);

  return (
    <div className="card p-5">
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
        SUS Score Distribution
      </h3>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={distribution} barCategoryGap="18%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="range"
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="count" radius={[5, 5, 0, 0]}>
            {distribution.map((entry, i) => (
              <Cell key={i} fill={entry.color} fillOpacity={0.85} />
            ))}
            <LabelList
              dataKey="count"
              position="top"
              style={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
              formatter={(v: number) => v > 0 ? v : ""}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center justify-between mt-3 flex-wrap gap-1.5">
        {distribution.map((b) => (
          <div key={b.range} className="flex items-center gap-1.5 text-[10px] text-white/40">
            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: b.color }} />
            {b.range}
            {total > 0 && (
              <span className="text-white/25">({Math.round((b.count / total) * 100)}%)</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
