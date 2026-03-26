// lib/cleaner.ts
import type { RawRow, CleanedRow, ColumnMapping, ProcessingResult } from "@/types";

/**
 * Clean and transform raw survey rows using the provided column mapping.
 */
export function cleanData(rawRows: RawRow[], mapping: ColumnMapping): ProcessingResult {
  const cleaned: CleanedRow[] = [];
  const errors: string[] = [];

  for (let i = 0; i < rawRows.length; i++) {
    const row = rawRows[i];
    const rowNum = i + 2; // +2 for 1-indexed + header

    // Validate and extract Q1-Q10
    const qScores: Record<string, number> = {};
    let rowValid = true;

    for (let q = 1; q <= 10; q++) {
      const key = `Q${q}` as keyof ColumnMapping;
      const col = mapping[key];

      if (!col) {
        errors.push(`Row ${rowNum}: Q${q} not mapped — skipping`);
        rowValid = false;
        break;
      }

      const rawVal = row[col];
      const parsed = parseQScore(rawVal);

      if (parsed === null) {
        errors.push(`Row ${rowNum}: Q${q} has invalid value "${rawVal}" (expected 1-5)`);
        rowValid = false;
        break;
      }

      qScores[`Q${q}`] = parsed;
    }

    if (!rowValid) continue;

    // Compute SUS
    const sus = computeSUS(qScores);
    if (sus === null) {
      errors.push(`Row ${rowNum}: SUS computation failed`);
      continue;
    }

    // Optional fields
    const age = mapping.Age ? parseAge(row[mapping.Age]) : null;
    const month = mapping.Date ? parseMonth(row[mapping.Date]) : "Unknown";
    const device = mapping.Device
      ? trimStr(row[mapping.Device]) || "Unknown"
      : "Unknown";
    const userType = mapping.UserType
      ? normalizeUserType(trimStr(row[mapping.UserType]))
      : "Unknown";

    cleaned.push({
      sus,
      age,
      month,
      device,
      userType,
      Q1: qScores.Q1,
      Q2: qScores.Q2,
      Q3: qScores.Q3,
      Q4: qScores.Q4,
      Q5: qScores.Q5,
      Q6: qScores.Q6,
      Q7: qScores.Q7,
      Q8: qScores.Q8,
      Q9: qScores.Q9,
      Q10: qScores.Q10,
    });
  }

  return { cleaned, errors };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseQScore(val: string | number | boolean | null | undefined): number | null {
  if (val === null || val === undefined || val === "") return null;
  const n = parseFloat(String(val).trim());
  if (isNaN(n) || n < 1 || n > 5) return null;
  return Math.round(n); // Round to nearest integer
}

function computeSUS(scores: Record<string, number>): number | null {
  let sum = 0;
  for (let q = 1; q <= 10; q++) {
    const score = scores[`Q${q}`];
    if (score === undefined) return null;
    sum += q % 2 === 1 ? score - 1 : 5 - score;
  }
  return sum * 2.5;
}

/**
 * Parse age from various formats:
 * - "25" → 25
 * - "25 years old" → 25
 * - "Age: 30" → 30
 */
export function parseAge(val: string | number | boolean | null | undefined): number | null {
  if (val === null || val === undefined || val === "") return null;
  const str = String(val);
  const digits = str.replace(/[^\d]/g, "");
  const n = parseInt(digits, 10);
  if (isNaN(n) || n < 1 || n > 120) return null;
  return n;
}

/**
 * Parse date from various formats and return 3-letter month name.
 * - "2025-10-12" → "Oct"
 * - "October 2025" → "Oct"
 * - Excel serial date numbers → converted via offset
 */
export function parseMonth(val: string | number | boolean | null | undefined): string {
  if (val === null || val === undefined || val === "") return "Unknown";

  const str = String(val).trim();

  // Try standard date parse
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return d.toLocaleString("default", { month: "short" });
  }

  // Try Excel serial number
  if (typeof val === "number" || /^\d+$/.test(str)) {
    const serial = parseInt(str, 10);
    if (serial > 0) {
      const excelEpoch = new Date((serial - 25569) * 86400 * 1000);
      if (!isNaN(excelEpoch.getTime()) && excelEpoch.getFullYear() > 1990) {
        return excelEpoch.toLocaleString("default", { month: "short" });
      }
    }
  }

  // Try month name extraction
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  for (const m of months) {
    if (str.toLowerCase().includes(m.toLowerCase())) return m;
  }

  return str.length <= 10 ? str : "Unknown";
}

function trimStr(val: string | number | boolean | null | undefined): string {
  return String(val ?? "").trim();
}

function normalizeUserType(val: string): string {
  const lower = val.toLowerCase();
  if (lower.includes("new") || lower === "first" || lower === "first-time") return "New";
  if (lower.includes("return") || lower.includes("existing") || lower === "repeat") return "Returning";
  return val || "Unknown";
}
