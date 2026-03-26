// store/useAppStore.ts
import { create } from "zustand";
import type {
  AppStep,
  SheetData,
  ColumnMapping,
  CleanedRow,
  SUSMetrics,
  AnalysisReport,
} from "@/types";

interface AppState {
  // Navigation
  step: AppStep;
  setStep: (step: AppStep) => void;

  // File data
  fileName: string;
  sheets: SheetData[];
  selectedSheet: string;
  columns: string[];
  setFileData: (fileName: string, sheets: SheetData[]) => void;
  setSelectedSheet: (name: string) => void;

  // Column mapping
  mapping: Partial<ColumnMapping>;
  setMapping: (mapping: Partial<ColumnMapping>) => void;
  updateMappingField: (field: string, value: string) => void;

  // Processed data
  cleanedData: CleanedRow[];
  processingErrors: string[];
  metrics: SUSMetrics | null;
  report: AnalysisReport | null;
  setProcessedData: (
    cleaned: CleanedRow[],
    errors: string[],
    metrics: SUSMetrics | null,
    report: AnalysisReport | null
  ) => void;

  // AI insights
  aiInsights: Record<string, unknown> | null;
  aiLoading: boolean;
  setAiInsights: (insights: Record<string, unknown> | null) => void;
  setAiLoading: (loading: boolean) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  step: "upload" as AppStep,
  fileName: "",
  sheets: [],
  selectedSheet: "",
  columns: [],
  mapping: {},
  cleanedData: [],
  processingErrors: [],
  metrics: null,
  report: null,
  aiInsights: null,
  aiLoading: false,
};

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  setFileData: (fileName, sheets) => {
    const firstSheet = sheets[0];
    const columns = firstSheet?.rows.length
      ? Object.keys(firstSheet.rows[0])
      : [];
    set({ fileName, sheets, selectedSheet: firstSheet?.name ?? "", columns });
  },

  setSelectedSheet: (name) => {
    const sheet = get().sheets.find((s) => s.name === name);
    const columns = sheet?.rows.length ? Object.keys(sheet.rows[0]) : [];
    set({ selectedSheet: name, columns });
  },

  setMapping: (mapping) => set({ mapping }),

  updateMappingField: (field, value) =>
    set((state) => ({ mapping: { ...state.mapping, [field]: value } })),

  setProcessedData: (cleaned, errors, metrics, report) =>
    set({ cleanedData: cleaned, processingErrors: errors, metrics, report }),

  setAiInsights: (aiInsights) => set({ aiInsights }),
  setAiLoading: (aiLoading) => set({ aiLoading }),

  reset: () => set(initialState),
}));

// ─── Selectors ─────────────────────────────────────────────────────────────

export const selectCurrentRows = (state: AppState) => {
  const sheet = state.sheets.find((s) => s.name === state.selectedSheet);
  return sheet?.rows ?? [];
};

export const selectMappingComplete = (state: AppState): boolean => {
  const required = ["Q1","Q2","Q3","Q4","Q5","Q6","Q7","Q8","Q9","Q10"] as const;
  return required.every((q) => Boolean(state.mapping[q]));
};
