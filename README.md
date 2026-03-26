# SUS Analytics Web App

A production-ready Next.js application for analyzing **System Usability Scale (SUS)** survey data. Upload Excel or CSV files, clean and transform data, compute usability metrics, and view interactive dashboards with AI-powered insights.

---

## ✨ Features

- **Drag-and-drop file upload** — `.xlsx`, `.xlsm`, `.csv`
- **Multi-sheet support** — select which sheet to analyze
- **Flexible column mapping** — no hardcoded column names
- **Data cleaning pipeline** — handles missing values, mixed formats, age strings, Excel dates
- **SUS computation** — per-respondent score using the standard formula
- **Metrics engine** — mean, std dev, median, segmented by Device / User Type / Month
- **Question-level analysis** — labeled dimensions + radar chart
- **Rule-based recommendations** — 15+ heuristic rules across all SUS dimensions
- **AI-powered insights** — calls Claude Sonnet via Anthropic API for expert analysis
- **CSV export** — download cleaned + scored data
- **Demo dataset** — 80 synthetic respondents, pre-mapped, ready to explore

---

## 🗂 Project Structure

```
sus-analytics/
├── app/
│   ├── layout.tsx          # Root layout + fonts
│   ├── page.tsx            # Main orchestrator (step machine)
│   └── globals.css         # Tailwind + custom styles
├── components/
│   ├── layout/
│   │   ├── StepIndicator.tsx
│   │   ├── UploadStep.tsx
│   │   ├── MappingStep.tsx
│   │   ├── PreviewStep.tsx
│   │   └── DashboardStep.tsx
│   └── charts/
│       ├── KPICards.tsx
│       ├── DistributionChart.tsx
│       ├── SegmentChart.tsx
│       ├── MonthTrendChart.tsx
│       ├── QuestionAnalysis.tsx
│       └── InsightsPanel.tsx
├── lib/
│   ├── parser.ts           # File parsing (xlsx + csv)
│   ├── cleaner.ts          # Data cleaning pipeline
│   ├── sus.ts              # SUS score logic + grades
│   ├── metrics.ts          # Metrics computation engine
│   ├── recommendations.ts  # Rule-based insights
│   └── demo.ts             # Demo dataset generator
├── store/
│   └── useAppStore.ts      # Zustand global state
├── types/
│   └── index.ts            # All TypeScript types
├── utils/
│   ├── cn.ts               # Tailwind class merge utility
│   └── export.ts           # CSV export
└── public/
    └── demo_sus_survey.csv # Sample 30-row test file
```

---

## 🚀 Local Development

### Prerequisites

- **Node.js** v18 or later
- **npm** v9+ (or pnpm / yarn)

### Steps

```bash
# 1. Clone or unzip the project
cd sus-analytics

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel

### Option A — Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

### Option B — Vercel Dashboard

1. Push the project to a GitHub / GitLab / Bitbucket repo
2. Visit [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Framework will be auto-detected as **Next.js**
5. Click **Deploy** — no environment variables required

---

## 📊 SUS Computation Reference

For each respondent:

| Question | Type | Formula |
|----------|------|---------|
| Q1, Q3, Q5, Q7, Q9 | Positive | `score - 1` |
| Q2, Q4, Q6, Q8, Q10 | Negative | `5 - score` |

```
SUS Score = (sum of 10 transformed scores) × 2.5
```

**Grade scale:**

| Score | Grade | Adjective |
|-------|-------|-----------|
| ≥ 90 | A+ | Best Imaginable |
| ≥ 85 | A | Excellent |
| ≥ 80 | B+ | Good |
| ≥ 70 | B | Good |
| ≥ 68 | C+ | Acceptable |
| ≥ 51 | C | Marginal |
| < 51 | F | Unacceptable |

---

## 📁 Expected File Format

Your Excel or CSV file should have:

- **One row per respondent**
- **Q1–Q10 columns** rated 1–5 (Likert scale)
- Optional: `Age`, `Date`, `Device`, `UserType` columns

Column names don't need to match exactly — you'll map them in the UI.

**Example:**

| Q1 | Q2 | Q3 | ... | Q10 | Age | Date | Device | UserType |
|----|----|----|-----|-----|-----|------|--------|----------|
| 4  | 2  | 5  | ... | 2   | 28  | 2025-03-01 | Desktop | New |

---

## 🧪 Demo Dataset

Use the built-in **"Load Demo Dataset"** button to generate 80 synthetic respondents with realistic score distributions across Desktop/Mobile/Tablet devices and New/Returning user types.

Or upload the included `public/demo_sus_survey.csv` manually.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Validation | Zod |
| File Parsing | xlsx (SheetJS) + PapaParse |
| Charts | Recharts |
| AI Insights | Anthropic Claude API |
| Deploy | Vercel |
