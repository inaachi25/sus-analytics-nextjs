// utils/export.ts
import type { CleanedRow } from "@/types";

export function exportToCSV(data: CleanedRow[], filename = "sus_results.csv"): void {
  const headers = ["SUS Score","Q1","Q2","Q3","Q4","Q5","Q6","Q7","Q8","Q9","Q10","Device","User Type","Month","Age"];
  const rows = data.map((r) => [
    r.sus.toFixed(2), r.Q1, r.Q2, r.Q3, r.Q4, r.Q5,
    r.Q6, r.Q7, r.Q8, r.Q9, r.Q10,
    r.device, r.userType, r.month, r.age ?? "",
  ]);

  const csv = [headers, ...rows].map((r) => r.map(String).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
