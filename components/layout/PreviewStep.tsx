// components/layout/PreviewStep.tsx
"use client";

import type { CleanedRow } from "@/types";
import { getSUSGrade } from "@/lib/sus";
import { exportToCSV } from "@/utils/export";
import { cn } from "@/utils/cn";

interface PreviewStepProps {
  cleanedData: CleanedRow[];
  errors: string[];
  onBack: () => void;
  onContinue: () => void;
}

const Q_COLS = [1,2,3,4,5,6,7,8,9,10];

export default function PreviewStep({ cleanedData, errors, onBack, onContinue }: PreviewStepProps) {
  return (
    <div>
      <div className="card p-6 mb-4">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
          <div>
            <h2 className="text-lg font-bold mb-1">Cleaned Data Preview</h2>
            <div className="flex items-center gap-3 flex-wrap text-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                <span className="text-white/70">
                  <strong className="text-emerald-400">{cleanedData.length}</strong> valid rows
                </span>
              </span>
              {errors.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                  <span className="text-white/70">
                    <strong className="text-orange-400">{errors.length}</strong> excluded
                  </span>
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2.5 flex-wrap">
            <button
              onClick={() => exportToCSV(cleanedData)}
              className="px-3 py-2 text-xs font-semibold border border-white/10 rounded-lg text-white/50 hover:text-white/70 hover:border-white/20 transition-all"
            >
              ↓ Export CSV
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 text-sm text-white/50 border border-white/10 rounded-lg hover:border-white/20 transition-all"
            >
              ← Remap
            </button>
            <button
              onClick={onContinue}
              className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-lg shadow-lg shadow-indigo-500/25 hover:brightness-110 transition-all"
            >
              View Dashboard →
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">#</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">SUS</th>
                {Q_COLS.map((q) => (
                  <th key={q} className="px-2 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-white/40">
                    Q{q}
                  </th>
                ))}
                <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Device</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Type</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Month</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">Age</th>
              </tr>
            </thead>
            <tbody>
              {cleanedData.slice(0, 12).map((row, i) => {
                const grade = getSUSGrade(row.sus);
                return (
                  <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-3 py-2 text-white/30">{i + 1}</td>
                    <td className="px-3 py-2">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-bold font-mono"
                        style={{ background: grade.bgColor, color: grade.color }}
                      >
                        {row.sus.toFixed(1)}
                      </span>
                    </td>
                    {Q_COLS.map((q) => {
                      const key = `Q${q}` as keyof CleanedRow;
                      return (
                        <td key={q} className="px-2 py-2 text-center text-white/60">
                          {row[key] as number}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-white/60 whitespace-nowrap">{row.device}</td>
                    <td className="px-3 py-2 text-white/60 whitespace-nowrap">{row.userType}</td>
                    <td className="px-3 py-2 text-white/60">{row.month}</td>
                    <td className="px-3 py-2 text-white/60">{row.age ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {cleanedData.length > 12 && (
          <p className="text-center text-xs text-white/30 mt-3">
            Showing 12 of {cleanedData.length} rows
          </p>
        )}

        {/* Errors accordion */}
        {errors.length > 0 && (
          <details className="mt-4 group">
            <summary className="cursor-pointer text-sm text-orange-400 hover:text-orange-300 select-none transition-colors list-none flex items-center gap-1.5">
              <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
              {errors.length} excluded rows — click to inspect
            </summary>
            <div className="mt-2 bg-orange-500/[0.07] border border-orange-400/20 rounded-xl p-4 max-h-40 overflow-y-auto">
              {errors.slice(0, 30).map((e, i) => (
                <p key={i} className="text-xs text-white/50 font-mono mb-1 last:mb-0">{e}</p>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
