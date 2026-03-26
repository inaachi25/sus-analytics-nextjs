// app/page.tsx
"use client";

import { useAppStore, selectCurrentRows, selectMappingComplete } from "@/store/useAppStore";
import { parseFile, autoDetectMapping } from "@/lib/parser";
import { cleanData } from "@/lib/cleaner";
import { computeMetrics } from "@/lib/metrics";
import { generateReport } from "@/lib/recommendations";
import { generateDemoDataset, DEMO_COLUMN_MAPPING } from "@/lib/demo";
import type { ColumnMapping } from "@/types";

import StepIndicator from "@/components/layout/StepIndicator";
import UploadStep from "@/components/layout/UploadStep";
import MappingStep from "@/components/layout/MappingStep";
import PreviewStep from "@/components/layout/PreviewStep";
import DashboardStep from "@/components/layout/DashboardStep";

export default function HomePage() {
  const store = useAppStore();
  const currentRows = useAppStore(selectCurrentRows);
  const mappingComplete = useAppStore(selectMappingComplete);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleFileUpload = async (file: File) => {
    try {
      const sheets = await parseFile(file);
      store.setFileData(file.name, sheets);

      // Auto-detect mapping from first sheet columns
      const cols = sheets[0]?.rows.length ? Object.keys(sheets[0].rows[0]) : [];
      const detected = autoDetectMapping(cols);
      store.setMapping(detected as Partial<ColumnMapping>);

      store.setStep("mapping");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to parse file");
    }
  };

  const handleLoadDemo = () => {
    const rows = generateDemoDataset();
    store.setFileData("demo_sus_survey.xlsx", [{ name: "SUS Survey", rows }]);
    store.setMapping(DEMO_COLUMN_MAPPING as Partial<ColumnMapping>);
    store.setStep("mapping");
  };

  const handleProcess = () => {
    const rows = currentRows;
    const mapping = store.mapping as ColumnMapping;
    const { cleaned, errors } = cleanData(rows, mapping);
    const metrics = computeMetrics(cleaned);
    const report = metrics ? generateReport(metrics) : null;
    store.setProcessedData(cleaned, errors, metrics, report);
    store.setStep("preview");
  };

  const handleReset = () => store.reset();

  // ─── Step Guards ──────────────────────────────────────────────────────────

  const STEPS = ["upload", "mapping", "preview", "dashboard"];
  const currentIndex = STEPS.indexOf(store.step);

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
              📊
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                SUS Analytics
              </h1>
              <p className="text-xs text-white/40 font-semibold tracking-widest uppercase">
                System Usability Scale · Insights Engine
              </p>
            </div>
          </div>
        </header>

        {/* Step Indicator */}
        <StepIndicator current={currentIndex} />

        {/* Step Content */}
        <div className="animate-slide-up">
          {store.step === "upload" && (
            <UploadStep
              onFileUpload={handleFileUpload}
              onLoadDemo={handleLoadDemo}
            />
          )}

          {store.step === "mapping" && (
            <MappingStep
              fileName={store.fileName}
              sheets={store.sheets}
              selectedSheet={store.selectedSheet}
              columns={store.columns}
              mapping={store.mapping}
              rawRowCount={currentRows.length}
              mappingComplete={mappingComplete}
              onSheetChange={store.setSelectedSheet}
              onMappingChange={store.updateMappingField}
              onBack={() => store.setStep("upload")}
              onProcess={handleProcess}
            />
          )}

          {store.step === "preview" && store.cleanedData.length > 0 && (
            <PreviewStep
              cleanedData={store.cleanedData}
              errors={store.processingErrors}
              onBack={() => store.setStep("mapping")}
              onContinue={() => store.setStep("dashboard")}
            />
          )}

          {store.step === "dashboard" && store.metrics && store.report && (
            <DashboardStep
              metrics={store.metrics}
              report={store.report}
              cleanedData={store.cleanedData}
              fileName={store.fileName}
              aiInsights={store.aiInsights}
              aiLoading={store.aiLoading}
              onSetAiInsights={store.setAiInsights}
              onSetAiLoading={store.setAiLoading}
              onBack={() => store.setStep("preview")}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </main>
  );
}
