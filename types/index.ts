// types/index.ts

export interface RawRow {
  [key: string]: string | number | boolean | null | undefined;
}

export interface ColumnMapping {
  Q1: string;
  Q2: string;
  Q3: string;
  Q4: string;
  Q5: string;
  Q6: string;
  Q7: string;
  Q8: string;
  Q9: string;
  Q10: string;
  Age?: string;
  Date?: string;
  Device?: string;
  UserType?: string;
}

export interface CleanedRow {
  sus: number;
  age: number | null;
  month: string;
  device: string;
  userType: string;
  Q1: number;
  Q2: number;
  Q3: number;
  Q4: number;
  Q5: number;
  Q6: number;
  Q7: number;
  Q8: number;
  Q9: number;
  Q10: number;
}

export interface SegmentedMetric {
  name: string;
  value: number;
  count: number;
}

export interface DistributionBucket {
  range: string;
  count: number;
  color: string;
}

export interface QAverages {
  Q1: number;
  Q2: number;
  Q3: number;
  Q4: number;
  Q5: number;
  Q6: number;
  Q7: number;
  Q8: number;
  Q9: number;
  Q10: number;
}

export interface SUSMetrics {
  mean: number;
  stdDev: number;
  median: number;
  total: number;
  byDevice: SegmentedMetric[];
  byUserType: SegmentedMetric[];
  byMonth: SegmentedMetric[];
  qAverages: QAverages;
  distribution: DistributionBucket[];
  scores: number[];
}

export interface SheetData {
  name: string;
  rows: RawRow[];
}

export interface ProcessingResult {
  cleaned: CleanedRow[];
  errors: string[];
}

export interface Recommendation {
  type: "critical" | "warning" | "info" | "success";
  category: string;
  insight: string;
  action: string;
}

export interface AnalysisReport {
  grade: string;
  gradeLabel: string;
  summary: string;
  recommendations: Recommendation[];
}

export interface SUSGrade {
  label: string;
  desc: string;
  color: string;
  bgColor: string;
}

export type AppStep = "upload" | "mapping" | "preview" | "dashboard";
