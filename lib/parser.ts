// lib/parser.ts
import * as XLSX from "xlsx";
import Papa from "papaparse";
import type { RawRow, SheetData } from "@/types";

/**
 * Parse an uploaded file (xlsx, xlsm, or csv) into sheets of row data.
 */
export async function parseFile(file: File): Promise<SheetData[]> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "csv") {
    return parseCsv(file);
  }

  if (ext === "xlsx" || ext === "xlsm") {
    return parseExcel(file);
  }

  throw new Error(`Unsupported file type: .${ext}. Please upload .xlsx, .xlsm, or .csv`);
}

async function parseExcel(file: File): Promise<SheetData[]> {
  const buffer = await file.arrayBuffer();
  const data = new Uint8Array(buffer);
  const workbook = XLSX.read(data, {
    type: "array",
    cellDates: true,
    dateNF: "yyyy-mm-dd",
  });

  return workbook.SheetNames.map((name) => ({
    name,
    rows: XLSX.utils.sheet_to_json<RawRow>(workbook.Sheets[name], {
      raw: false,
      defval: "",
      blankrows: false,
    }),
  }));
}

async function parseCsv(file: File): Promise<SheetData[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<RawRow>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (result) => {
        resolve([
          {
            name: file.name.replace(/\.csv$/i, ""),
            rows: result.data,
          },
        ]);
      },
      error: (err) => reject(new Error(`CSV parse error: ${err.message}`)),
    });
  });
}

/**
 * Extract column names from the first row of a sheet.
 */
export function extractColumns(rows: RawRow[]): string[] {
  if (!rows.length) return [];
  return Object.keys(rows[0]);
}

/**
 * Auto-detect column mapping from common naming patterns.
 */
export function autoDetectMapping(columns: string[]): Partial<Record<string, string>> {
  const map: Partial<Record<string, string>> = {};
  const lowerCols = columns.map((c) => c.toLowerCase());

  for (let q = 1; q <= 10; q++) {
    const patterns = [
      `q${q}`,
      `question${q}`,
      `question_${q}`,
      `q_${q}`,
      `item${q}`,
    ];
    const idx = lowerCols.findIndex((c) => patterns.includes(c));
    if (idx !== -1) map[`Q${q}`] = columns[idx];
  }

  const optionalMap: Record<string, string[]> = {
    Age: ["age", "respondent_age", "user_age"],
    Date: ["date", "survey_date", "response_date", "timestamp", "created_at"],
    Device: ["device", "device_type", "platform"],
    UserType: ["usertype", "user_type", "type", "new_returning", "user_status"],
  };

  for (const [field, patterns] of Object.entries(optionalMap)) {
    const idx = lowerCols.findIndex((c) => patterns.some((p) => c.includes(p)));
    if (idx !== -1) map[field] = columns[idx];
  }

  return map;
}
