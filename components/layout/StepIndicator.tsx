// components/layout/StepIndicator.tsx
"use client";

import { cn } from "@/utils/cn";

const STEPS = [
  { label: "Upload", icon: "↑" },
  { label: "Map Columns", icon: "⇄" },
  { label: "Preview", icon: "◉" },
  { label: "Dashboard", icon: "▦" },
];

interface StepIndicatorProps {
  current: number;
}

export default function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="flex items-center mb-10">
      {STEPS.map((step, i) => {
        const isPast = i < current;
        const isActive = i === current;

        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              {/* Circle */}
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                  isPast && "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30",
                  isActive && "bg-indigo-500 text-white ring-4 ring-indigo-500/30 shadow-lg shadow-indigo-500/30",
                  !isPast && !isActive && "bg-white/[0.06] text-white/25 border border-white/10"
                )}
              >
                {isPast ? "✓" : isActive ? step.icon : i + 1}
              </div>
              {/* Label */}
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap transition-colors duration-300",
                  (isPast || isActive) ? "text-indigo-300" : "text-white/25"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-14 mx-1.5 mb-5 rounded-full transition-all duration-500",
                  i < current ? "bg-indigo-500" : "bg-white/10"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
