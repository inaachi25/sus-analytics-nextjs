// components/charts/SegmentChart.tsx
"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import type { SegmentedMetric } from "@/types";

interface Props {
  data: SegmentedMetric[];
  title: string;
  colors?: string[];
  horizontal?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1e1e32] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-white/80 mb-0.5">{label}</p>
      <p style={{ color: payload[0].fill }}>SUS: {payload[0].value}</p>
      <p className="text-white/40">n = {payload[0].payload.count}</p>
    </div>
  );
};

const DEFAULT_COLORS = ["#6366f1","#8b5cf6","#06b6d4","#10b981","#f59e0b"];

export default function SegmentChart({ data, title, colors = DEFAULT_COLORS, horizontal = true }: Props) {
  if (!data.length) {
    return (
      <div className="card p-5 flex items-center justify-center h-48">
        <p className="text-white/30 text-sm">No segment data available</p>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">{title}</h3>

      <ResponsiveContainer width="100%" height={200}>
        {horizontal ? (
          <BarChart data={data} layout="vertical" barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis
              type="number" domain={[0, 100]}
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              type="category" dataKey="name"
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
              axisLine={false} tickLine={false} width={75}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <ReferenceLine x={68} stroke="rgba(245,158,11,0.4)" strokeDasharray="4 4" />
            <Bar dataKey="value" radius={[0, 5, 5, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <BarChart data={data} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <ReferenceLine y={68} stroke="rgba(245,158,11,0.4)" strokeDasharray="4 4" label={{ value: "68 avg", fill: "rgba(245,158,11,0.5)", fontSize: 10 }} />
            <Bar dataKey="value" radius={[5, 5, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>

      {/* Legend pills */}
      <div className="flex flex-wrap gap-2 mt-3">
        {data.map((item, i) => (
          <span key={item.name} className="flex items-center gap-1.5 text-[10px] text-white/50">
            <span className="w-2 h-2 rounded-full" style={{ background: colors[i % colors.length] }} />
            {item.name}
            <span className="text-white/30 font-mono">{item.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
