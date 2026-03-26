// components/charts/MonthTrendChart.tsx
"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Dot,
} from "recharts";
import type { SegmentedMetric } from "@/types";

interface Props {
  data: SegmentedMetric[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1e1e32] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-white/80 mb-0.5">{label}</p>
      <p className="text-indigo-300">SUS: {payload[0].value}</p>
      <p className="text-white/40">n = {payload[0].payload.count}</p>
    </div>
  );
};

export default function MonthTrendChart({ data }: Props) {
  if (data.length < 2) {
    return (
      <div className="card p-5 flex items-center justify-center h-48">
        <p className="text-white/30 text-sm">Need 2+ months for trend</p>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
        Monthly SUS Trend
      </h3>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
            axisLine={false} tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={68}
            stroke="rgba(245,158,11,0.35)"
            strokeDasharray="4 4"
            label={{ value: "avg 68", fill: "rgba(245,158,11,0.45)", fontSize: 10, position: "right" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#lineGradient)"
            strokeWidth={2.5}
            dot={<CustomDot />}
            activeDot={{ r: 6, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomDot(props: any) {
  const { cx, cy, value } = props;
  return (
    <circle
      cx={cx} cy={cy} r={4}
      fill="#6366f1"
      stroke="rgba(255,255,255,0.3)"
      strokeWidth={1.5}
    />
  );
}
