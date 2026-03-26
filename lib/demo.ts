// lib/demo.ts
import type { RawRow } from "@/types";

const DEVICES = ["Desktop", "Mobile", "Tablet"];
const USER_TYPES = ["New", "Returning"];
const MONTHS = [
  "2025-01-15", "2025-02-08", "2025-03-22",
  "2025-04-10", "2025-05-17", "2025-06-03",
];

/**
 * Generate a realistic demo SUS dataset with 80 respondents.
 * Scores are biased to produce a mean around 72-78 (Good range).
 */
export function generateDemoDataset(): RawRow[] {
  const rows: RawRow[] = [];

  for (let i = 0; i < 80; i++) {
    const device = DEVICES[Math.floor(Math.random() * DEVICES.length)];
    const userType = USER_TYPES[Math.floor(Math.random() * USER_TYPES.length)];
    const date = MONTHS[Math.floor(Math.random() * MONTHS.length)];

    // Base usability score between 2.8 and 4.2
    const base = 2.8 + Math.random() * 1.4;

    // Mobile users have slightly lower scores
    const deviceBias = device === "Mobile" ? -0.3 : 0;
    // New users have slightly lower scores
    const userBias = userType === "New" ? -0.25 : 0;
    const adjusted = base + deviceBias + userBias;

    const clamp = (v: number) => Math.min(5, Math.max(1, Math.round(v + (Math.random() - 0.5) * 0.8)));

    rows.push({
      RespondentID: i + 1,
      // Positive questions (Q1,3,5,7,9) - higher is better
      Q1: clamp(adjusted),
      Q2: clamp(6 - adjusted), // Negative - lower is better
      Q3: clamp(adjusted),
      Q4: clamp(6 - adjusted),
      Q5: clamp(adjusted),
      Q6: clamp(6 - adjusted),
      Q7: clamp(adjusted - 0.2),
      Q8: clamp(6 - adjusted),
      Q9: clamp(adjusted + 0.1),
      Q10: clamp(6 - adjusted + 0.2),
      Age: `${Math.floor(18 + Math.random() * 47)} years old`,
      Date: date,
      Device: device,
      UserType: userType,
    });
  }

  return rows;
}

export const DEMO_COLUMN_MAPPING = {
  Q1: "Q1", Q2: "Q2", Q3: "Q3", Q4: "Q4", Q5: "Q5",
  Q6: "Q6", Q7: "Q7", Q8: "Q8", Q9: "Q9", Q10: "Q10",
  Age: "Age",
  Date: "Date",
  Device: "Device",
  UserType: "UserType",
};
