// components/layout/MappingStep.tsx
"use client";

import type { SheetData } from "@/types";
import { Q_LABELS } from "@/lib/sus";
import { cn } from "@/utils/cn";

const REQUIRED_FIELDS = ["Q1","Q2","Q3","Q4","Q5","Q6","Q7","Q8","Q9","Q10"] as const;
const OPTIONAL_FIELDS = ["Age","Date","Device","UserType"] as const;

interface MappingStepProps {
  fileName: string;
  sheets: SheetData[];
  selectedSheet: string;
  columns: string[];
  mapping: Record<string, string>;
  rawRowCount: number;
  mappingComplete: boolean;
  onSheetChange: (name: string) => void;
  onMappingChange: (field: string, value: string) => void;
  onBack: () => void;
  onProcess: () => void;
}

export default function MappingStep({
  fileName, sheets, selectedSheet, columns, mapping, rawRowCount,
  mappingComplete, onSheetChange, onMappingChange, onBack, onProcess,
}: MappingStepProps) {
  const mappedRequired = REQUIRED_FIELDS.filter((f) => Boolean(mapping[f])).length;

  return (
    <div>
      {/* Main card */}
      <div className="card p-6 mb-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <h2 className="text-lg font-bold mb-0.5">Map Your Columns</h2>
            <p className="text-sm text-white/50">
              File:{" "}
              <span className="text-indigo-300 font-medium">{fileName}</span>
              {" · "}
              <span className="text-white/70">{rawRowCount}</span> rows detected
            </p>
          </div>

          {/* Sheet selector */}
          {sheets.length > 1 && (
            <div>
              <label className="block text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5">
                Active Sheet
              </label>
              <div className="relative">
                <select
                  value={selectedSheet}
                  onChange={(e) => onSheetChange(e.target.value)}
                  className="bg-white/[0.07] border border-white/15 rounded-lg pl-3 pr-8 py-2 text-sm text-white/80 cursor-pointer focus:outline-none focus:border-indigo-400/60"
                >
                  {sheets.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 text-xs">▼</span>
              </div>
            </div>
          )}
        </div>

        {/* Required columns */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
            Required — SUS Questions (Q1–Q10)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {REQUIRED_FIELDS.map((field) => (
              <ColumnSelect
                key={field}
                field={field}
                label={`${field}`}
                sublabel={Q_LABELS[field]?.split(" ").slice(0, 2).join(" ")}
                columns={columns}
                value={mapping[field] || ""}
                onChange={(v) => onMappingChange(field, v)}
                required
              />
            ))}
          </div>
        </div>

        {/* Optional columns */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
            Optional — Segmentation Dimensions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {OPTIONAL_FIELDS.map((field) => (
              <ColumnSelect
                key={field}
                field={field}
                label={field === "UserType" ? "User Type" : field}
                sublabel={field === "UserType" ? "New / Returning" : field === "Date" ? "For monthly trend" : ""}
                columns={columns}
                value={mapping[field] || ""}
                onChange={(v) => onMappingChange(field, v)}
                required={false}
              />
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-32 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${(mappedRequired / 10) * 100}%` }}
              />
            </div>
            <span className="text-xs text-white/40">
              {mappedRequired}/10 required columns mapped
            </span>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={onBack}
              className="px-4 py-2 text-sm text-white/50 border border-white/10 rounded-lg hover:border-white/20 transition-all"
            >
              ← Back
            </button>
            <button
              onClick={onProcess}
              disabled={!mappingComplete}
              className={cn(
                "px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200",
                mappingComplete
                  ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 hover:brightness-110"
                  : "bg-white/10 text-white/30 cursor-not-allowed"
              )}
            >
              Process Data →
            </button>
          </div>
        </div>
      </div>

      {/* Data Preview */}
      {columns.length > 0 && (
        <DataPreviewTable columns={columns} rows={[]} />
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

interface ColumnSelectProps {
  field: string;
  label: string;
  sublabel?: string;
  columns: string[];
  value: string;
  onChange: (v: string) => void;
  required: boolean;
}

function ColumnSelect({ field, label, sublabel, columns, value, onChange, required }: ColumnSelectProps) {
  const mapped = Boolean(value);
  return (
    <div>
      <label className={cn(
        "block text-[10px] font-bold uppercase tracking-wider mb-1.5 transition-colors",
        required
          ? mapped ? "text-emerald-400" : "text-orange-400"
          : "text-white/40"
      )}>
        {label}{required && " *"}
        {sublabel && <span className="ml-1 font-normal normal-case tracking-normal text-white/25">{sublabel}</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full text-xs rounded-lg pl-2.5 pr-7 py-2 text-white/80 cursor-pointer focus:outline-none transition-all",
            mapped
              ? "bg-indigo-500/10 border border-indigo-500/40 focus:border-indigo-400"
              : "bg-white/[0.05] border border-white/10 focus:border-white/25"
          )}
        >
          <option value="">— Select —</option>
          {columns.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/25 text-[10px]">▼</span>
      </div>
    </div>
  );
}

function DataPreviewTable({ columns }: { columns: string[]; rows: Record<string, unknown>[] }) {
  return (
    <div className="card p-5">
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
        Available Columns ({columns.length})
      </h3>
      <div className="flex flex-wrap gap-2">
        {columns.map((col) => (
          <span
            key={col}
            className="text-xs px-2.5 py-1 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white/60 font-mono"
          >
            {col}
          </span>
        ))}
      </div>
    </div>
  );
}
