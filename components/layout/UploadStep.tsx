// components/layout/UploadStep.tsx
"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/utils/cn";

interface UploadStepProps {
  onFileUpload: (file: File) => void;
  onLoadDemo: () => void;
}

export default function UploadStep({ onFileUpload, onLoadDemo }: UploadStepProps) {
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileUpload(file);
    },
    [onFileUpload]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileUpload(file);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="card p-7">
        <h2 className="text-xl font-bold mb-1">Upload Survey Data</h2>
        <p className="text-white/50 text-sm mb-6">
          Upload your SUS survey export to begin automated analysis.
          Supports <span className="text-indigo-300 font-mono text-xs">.xlsx</span>,{" "}
          <span className="text-indigo-300 font-mono text-xs">.xlsm</span>,{" "}
          <span className="text-indigo-300 font-mono text-xs">.csv</span>
        </p>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => fileRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200",
            dragging
              ? "border-indigo-400 bg-indigo-500/10"
              : "border-indigo-500/30 bg-indigo-500/[0.03] hover:border-indigo-400/50 hover:bg-indigo-500/[0.06]"
          )}
        >
          <div className="text-4xl mb-3">📂</div>
          <p className="font-semibold text-white/80 mb-1">
            {dragging ? "Drop to upload" : "Drag & drop your file here"}
          </p>
          <p className="text-sm text-white/40 mb-4">or click to browse</p>
          <span className="inline-block bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-sm font-semibold px-5 py-2 rounded-lg">
            Select File
          </span>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xlsm,.csv"
          className="hidden"
          onChange={handleChange}
        />

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-white/30 font-medium">or try a demo</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Demo button */}
        <button
          onClick={onLoadDemo}
          className="w-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border border-indigo-400/30 hover:border-indigo-400/60 text-indigo-300 font-semibold py-3 rounded-xl text-sm transition-all duration-200 hover:brightness-110"
        >
          ✨ Load Demo Dataset <span className="text-white/40 font-normal">(80 responses)</span>
        </button>

        {/* Format hints */}
        <div className="mt-5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
            Expected Format
          </p>
          <p className="text-xs text-white/50 leading-relaxed">
            Your file should have one row per respondent with columns for Q1–Q10 (rated 1–5).
            Optional columns: Age, Date, Device, and User Type. Column names don&apos;t need to match exactly — you&apos;ll map them in the next step.
          </p>
        </div>
      </div>
    </div>
  );
}
