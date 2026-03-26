
import { useState, useCallback, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, Cell, ReferenceLine
} from "recharts";

// ─── Constants ───────────────────────────────────────────────────────────────
const Q_LABELS = {
  Q1:"System Use Frequency", Q2:"Complexity", Q3:"Ease of Use",
  Q4:"Need for Support", Q5:"Feature Integration", Q6:"Inconsistency",
  Q7:"Quick Learning", Q8:"Cumbersome", Q9:"Confidence", Q10:"Learning Curve"
};
const REQUIRED = ["Q1","Q2","Q3","Q4","Q5","Q6","Q7","Q8","Q9","Q10"];
const OPTIONAL = ["Age","Date","Device","UserType"];
const MONTH_ORDER = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DEMO_COLS = [...REQUIRED, ...OPTIONAL];

// ─── SUS Logic ───────────────────────────────────────────────────────────────
function computeSUSRow(row, mapping) {
  let sum = 0;
  for (let q = 1; q <= 10; q++) {
    const v = parseFloat(row[mapping[`Q${q}`]]);
    if (isNaN(v) || v < 1 || v > 5) return null;
    sum += q % 2 === 1 ? v - 1 : 5 - v;
  }
  return sum * 2.5;
}

function parseMonth(val) {
  if (!val) return "Unknown";
  const d = new Date(String(val));
  if (!isNaN(d.getTime())) return d.toLocaleString("default", { month: "short" });
  if (typeof val === "number" && val > 10000) {
    const ed = new Date((val - 25569) * 86400000);
    if (!isNaN(ed.getTime())) return ed.toLocaleString("default", { month: "short" });
  }
  for (const m of MONTH_ORDER) if (String(val).includes(m)) return m;
  return "Unknown";
}

function normalizeUserType(v) {
  const s = String(v || "").toLowerCase().trim();
  if (s.includes("new") || s === "first") return "New";
  if (s.includes("return") || s.includes("exist") || s === "repeat") return "Returning";
  return String(v || "").trim() || "Unknown";
}

function processData(rows, mapping) {
  const cleaned = [], errors = [];
  rows.forEach((row, i) => {
    for (let q = 1; q <= 10; q++) {
      const col = mapping[`Q${q}`];
      const v = parseFloat(row[col]);
      if (!col || isNaN(v) || v < 1 || v > 5) {
        errors.push(`Row ${i + 2}: Q${q} invalid — "${row[col]}"`);
        return;
      }
    }
    const sus = computeSUSRow(row, mapping);
    if (sus === null) return;
    const qScores = {};
    for (let q = 1; q <= 10; q++) qScores[`Q${q}`] = parseFloat(row[mapping[`Q${q}`]]);
    const age = mapping.Age ? parseInt(String(row[mapping.Age]).replace(/\D/g, ""), 10) || null : null;
    cleaned.push({
      sus, age,
      month: mapping.Date ? parseMonth(row[mapping.Date]) : "Unknown",
      device: String(row[mapping.Device] || "Unknown").trim() || "Unknown",
      userType: normalizeUserType(row[mapping.UserType] || ""),
      ...qScores
    });
  });
  return { cleaned, errors };
}

function computeMetrics(data) {
  if (!data.length) return null;
  const scores = data.map(r => r.sus);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((a, b) => a + (b - mean) ** 2, 0) / scores.length;
  const stdDev = Math.sqrt(variance);
  const sorted = [...scores].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

  const group = (key, sortByMonth = false) => {
    const g = {};
    data.forEach(r => { const k = r[key] || "Unknown"; (g[k] = g[k] || []).push(r.sus); });
    const result = Object.entries(g).map(([name, vals]) => ({
      name, count: vals.length,
      value: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10
    }));
    if (sortByMonth) return result.sort((a, b) => {
      const ai = MONTH_ORDER.indexOf(a.name), bi = MONTH_ORDER.indexOf(b.name);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
    return result.sort((a, b) => b.value - a.value);
  };

  const qAverages = {};
  for (let q = 1; q <= 10; q++) {
    const vals = data.map(r => r[`Q${q}`]);
    qAverages[`Q${q}`] = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 100) / 100;
  }

  const BUCKETS = [
    { range: "0–25",   min: 0,  max: 25,  color: "#ef4444" },
    { range: "25–50",  min: 25, max: 50,  color: "#f97316" },
    { range: "50–68",  min: 50, max: 68,  color: "#f59e0b" },
    { range: "68–80",  min: 68, max: 80,  color: "#84cc16" },
    { range: "80–100", min: 80, max: 101, color: "#10b981" },
  ];

  return {
    mean, stdDev, median, total: data.length, scores,
    byDevice: group("device"),
    byUserType: group("userType"),
    byMonth: group("month", true),
    qAverages,
    distribution: BUCKETS.map(b => ({ ...b, count: scores.filter(s => s >= b.min && s < b.max).length }))
  };
}

function getSUSGrade(score) {
  if (score >= 90) return { label: "A+", desc: "Best Imaginable", color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)" };
  if (score >= 85) return { label: "A",  desc: "Excellent",       color: "#10b981", bg: "rgba(16,185,129,0.10)", border: "rgba(16,185,129,0.22)" };
  if (score >= 80) return { label: "B+", desc: "Good",            color: "#84cc16", bg: "rgba(132,204,22,0.10)", border: "rgba(132,204,22,0.22)" };
  if (score >= 70) return { label: "B",  desc: "Good",            color: "#84cc16", bg: "rgba(132,204,22,0.08)", border: "rgba(132,204,22,0.20)" };
  if (score >= 68) return { label: "C+", desc: "Acceptable",      color: "#f59e0b", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.25)" };
  if (score >= 51) return { label: "C",  desc: "Marginal",        color: "#f97316", bg: "rgba(249,115,22,0.10)", border: "rgba(249,115,22,0.22)" };
  return              { label: "F",  desc: "Unacceptable",    color: "#ef4444", bg: "rgba(239,68,68,0.10)",  border: "rgba(239,68,68,0.22)"  };
}

function generateInsights(metrics) {
  const { mean, stdDev, qAverages, byDevice, byUserType } = metrics;
  const items = [], actions = [];

  if (mean >= 85)      items.push({ type: "success",  text: "🏆 Excellent usability — users find the system highly intuitive." });
  else if (mean >= 68) items.push({ type: "info",     text: "✅ Good usability — most users are satisfied with the system." });
  else                { items.push({ type: "critical", text: "⚠️ Below average usability — significant improvements are needed." }); actions.push("Prioritize a full usability audit and run targeted user testing."); }

  if (stdDev > 15) { items.push({ type: "warning", text: `📊 High score variability (σ=${stdDev.toFixed(1)}) — inconsistent experiences across users.` }); actions.push("Segment users to identify which cohorts are underserved."); }
  if (qAverages.Q2 > 3.5) { items.push({ type: "critical", text: "🔴 Q2: System perceived as too complex." }); actions.push("Reduce cognitive load — simplify navigation and key workflows."); }
  if (qAverages.Q3 < 2.5) { items.push({ type: "critical", text: "🔴 Q3: Ease of use is critically low." }); actions.push("Redesign core interaction flows and run moderated usability tests."); }
  else if (qAverages.Q3 < 3.5) { items.push({ type: "warning", text: "🟡 Q3: Ease of use has room for improvement." }); actions.push("Add progressive disclosure and contextual help tooltips."); }
  if (qAverages.Q4 > 3.5) { items.push({ type: "warning", text: "🟡 Q4: Users feel they need excessive support." }); actions.push("Build a self-service help center and improve in-app documentation."); }
  if (qAverages.Q6 > 3.5) { items.push({ type: "warning", text: "🟡 Q6: System perceived as inconsistent." }); actions.push("Audit UI patterns and standardize visual language across all screens."); }
  if (qAverages.Q7 < 3.0) { items.push({ type: "critical", text: "🔴 Q7: Users struggle to learn the system quickly." }); actions.push("Create guided onboarding tours and improve feature discoverability."); }
  if (qAverages.Q9 < 3.0) { items.push({ type: "warning", text: "🟡 Q9: User confidence is low." }); actions.push("Add undo functionality, progress indicators, and clear error recovery paths."); }
  if (qAverages.Q1 > 4.0) items.push({ type: "success", text: "✅ Q1: Strong intent to use the system frequently — high engagement signal." });
  if (qAverages.Q5 > 4.0) items.push({ type: "success", text: "✅ Q5: Features are well integrated — users appreciate the cohesion." });

  if (byDevice.length >= 2) {
    const gap = byDevice[0].value - byDevice[byDevice.length - 1].value;
    if (gap > 10) { items.push({ type: "warning", text: `🟡 Device gap: ${byDevice[0].name} (${byDevice[0].value}) vs ${byDevice[byDevice.length-1].name} (${byDevice[byDevice.length-1].value}) — ${gap.toFixed(1)} pt spread.` }); actions.push(`Prioritize ${byDevice[byDevice.length-1].name} UX improvements.`); }
  }
  const newU = byUserType.find(u => u.name === "New");
  const retU = byUserType.find(u => u.name === "Returning");
  if (newU && retU && retU.value - newU.value > 10) {
    items.push({ type: "info", text: `🔵 Onboarding gap: new users score ${newU.value} vs returning ${retU.value} (${(retU.value - newU.value).toFixed(1)} pt).` });
    actions.push("Invest in onboarding — new user experience needs significant improvement.");
  }

  if (!actions.length) actions.push("No critical issues detected. Continue monitoring and iterate on minor improvements.");
  return { items, actions };
}

// ─── Demo Data ────────────────────────────────────────────────────────────────
function generateDemo() {
  const DEVICES = ["Desktop", "Mobile", "Tablet"];
  const TYPES = ["New", "Returning"];
  const DATES = ["2025-01-15","2025-02-10","2025-03-05","2025-04-20","2025-05-12","2025-06-01"];
  return Array.from({ length: 80 }, (_, i) => {
    const device = DEVICES[i % 3], type = TYPES[i % 2];
    const base = 2.8 + Math.random() * 1.4
      + (device === "Mobile" ? -0.3 : 0)
      + (type === "New" ? -0.25 : 0);
    const c = v => Math.min(5, Math.max(1, Math.round(v + (Math.random() - 0.5) * 0.9)));
    return {
      Q1: c(base),     Q2: c(6 - base), Q3: c(base),      Q4: c(6 - base),
      Q5: c(base),     Q6: c(6 - base), Q7: c(base - 0.2),Q8: c(6 - base),
      Q9: c(base+0.1), Q10: c(6-base+0.2),
      Age: `${18 + Math.floor(Math.random() * 47)} years old`,
      Date: DATES[i % DATES.length],
      Device: device, UserType: type
    };
  });
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const CARD = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
  padding: "20px 24px",
};
const BTN_PRIMARY = {
  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
  border: "none", borderRadius: 10, padding: "9px 22px",
  color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
};
const BTN_GHOST = {
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10, padding: "8px 16px",
  color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer",
};
const TT = {
  background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10, fontSize: 12, color: "#e2e8f0",
};

// ─── Shared Tooltip ───────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ ...TT, padding: "10px 14px" }}>
      <p style={{ margin: "0 0 4px", fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: 0, color: p.color || p.fill || "#a5b4fc" }}>
          {p.name || "SUS"}: <strong>{p.value}</strong>
          {p.payload?.count ? <span style={{ color: "rgba(255,255,255,0.3)", marginLeft: 6 }}>n={p.payload.count}</span> : null}
        </p>
      ))}
    </div>
  );
};

// ─── Step Indicator ───────────────────────────────────────────────────────────
const STEP_NAMES = ["Upload", "Map Columns", "Preview", "Dashboard"];
function StepIndicator({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
      {STEP_NAMES.map((name, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, transition: "all 0.3s",
              background: i <= current ? "#6366f1" : "rgba(255,255,255,0.06)",
              color: i <= current ? "#fff" : "rgba(255,255,255,0.22)",
              border: i === current ? "2px solid rgba(165,180,252,0.55)" : "2px solid transparent",
              boxShadow: i === current ? "0 0 0 4px rgba(99,102,241,0.22)" : "none",
            }}>
              {i < current ? "✓" : i + 1}
            </div>
            <span style={{
              fontSize: 10, fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.07em", whiteSpace: "nowrap",
              color: i <= current ? "#a5b4fc" : "rgba(255,255,255,0.22)",
            }}>{name}</span>
          </div>
          {i < STEP_NAMES.length - 1 && (
            <div style={{
              width: 52, height: 2, margin: "0 6px 20px",
              background: i < current ? "#6366f1" : "rgba(255,255,255,0.08)",
              borderRadius: 2, transition: "background 0.4s",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Upload Step ──────────────────────────────────────────────────────────────
function UploadStep({ onLoadDemo }) {
  const [drag, setDrag] = useState(false);
  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={CARD}>
        <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800 }}>Upload Survey Data</h2>
        <p style={{ margin: "0 0 24px", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>
          Upload your SUS survey export to begin automated analysis.
          Accepts{" "}
          {[".xlsx", ".xlsm", ".csv"].map(ext => (
            <code key={ext} style={{ color: "#a5b4fc", background: "rgba(99,102,241,0.15)", padding: "1px 5px", borderRadius: 4, margin: "0 2px", fontSize: 12 }}>{ext}</code>
          ))}
        </p>

        {/* Drop Zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); }}
          style={{
            border: `2px dashed ${drag ? "#6366f1" : "rgba(99,102,241,0.3)"}`,
            borderRadius: 14, padding: "48px 24px", textAlign: "center",
            background: drag ? "rgba(99,102,241,0.08)" : "transparent",
            transition: "all 0.2s", cursor: "pointer", marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 10 }}>📂</div>
          <p style={{ margin: "0 0 4px", fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>
            {drag ? "Drop to upload" : "Drag & drop your file here"}
          </p>
          <p style={{ margin: "0 0 16px", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
            File parsing works in the full Next.js app
          </p>
          <span style={{
            display: "inline-block", background: "rgba(99,102,241,0.18)",
            border: "1px solid rgba(99,102,241,0.4)", borderRadius: 8,
            padding: "7px 18px", fontSize: 13, fontWeight: 600, color: "#a5b4fc",
          }}>Browse Files</span>
        </div>

        <div style={{ textAlign: "center", marginBottom: 16, fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
          — or try the interactive demo —
        </div>

        <button
          onClick={onLoadDemo}
          style={{
            ...BTN_PRIMARY, width: "100%", padding: 14,
            background: "linear-gradient(135deg,rgba(99,102,241,0.22),rgba(139,92,246,0.22))",
            border: "1px solid rgba(99,102,241,0.35)", color: "#a5b4fc",
          }}
        >
          ✨ Load Demo Dataset{" "}
          <span style={{ opacity: 0.5, fontWeight: 400 }}>(80 synthetic responses, pre-mapped)</span>
        </button>

        <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10 }}>
          <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.3)" }}>Expected Format</p>
          <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>
            One row per respondent · Q1–Q10 rated 1–5 · Optional: Age, Date, Device, User Type.
            Column names don't need to match — you'll map them in the next step.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Mapping Step ─────────────────────────────────────────────────────────────
function MappingStep({ columns, mapping, rowCount, onUpdate, onBack, onProcess }) {
  const mapped = REQUIRED.filter(f => mapping[f]).length;
  const complete = mapped === 10;

  const SelectField = ({ field, label, required }) => (
    <div>
      <label style={{
        display: "block", fontSize: 10, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.06em",
        marginBottom: 5,
        color: required ? (mapping[field] ? "#34d399" : "#fb923c") : "rgba(255,255,255,0.4)",
      }}>
        {label}{required && " *"}
        {field.startsWith("Q") && (
          <span style={{ fontSize: 9, fontWeight: 400, color: "rgba(255,255,255,0.2)", marginLeft: 4 }}>
            {Q_LABELS[field]?.split(" ").slice(0, 2).join(" ")}
          </span>
        )}
      </label>
      <div style={{ position: "relative" }}>
        <select
          value={mapping[field] || ""}
          onChange={e => onUpdate(field, e.target.value)}
          style={{
            width: "100%",
            background: mapping[field] ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${mapping[field] ? "rgba(99,102,241,0.45)" : "rgba(255,255,255,0.1)"}`,
            borderRadius: 8, padding: "7px 28px 7px 10px",
            color: "#e2e8f0", fontSize: 12, cursor: "pointer",
            WebkitAppearance: "none",
          }}
        >
          <option value="">— Select —</option>
          {columns.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", fontSize: 9, color: "rgba(255,255,255,0.25)", pointerEvents: "none" }}>▼</span>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={CARD}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800 }}>Map Your Columns</h2>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
              Demo dataset · <strong style={{ color: "#a5b4fc" }}>{rowCount}</strong> rows detected
            </p>
          </div>
        </div>

        {/* Required */}
        <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.35)" }}>
          Required — SUS Questions *
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(155px,1fr))", gap: 10, marginBottom: 22 }}>
          {REQUIRED.map(f => <SelectField key={f} field={f} label={f} required={true} />)}
        </div>

        {/* Optional */}
        <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.35)" }}>
          Optional — Segmentation Dimensions
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(155px,1fr))", gap: 10, marginBottom: 22 }}>
          {OPTIONAL.map(f => <SelectField key={f} field={f} label={f === "UserType" ? "User Type" : f} required={false} />)}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 120, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${mapped / 10 * 100}%`, background: "#6366f1", borderRadius: 4, transition: "width 0.4s" }} />
            </div>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{mapped}/10 mapped</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onBack} style={BTN_GHOST}>← Back</button>
            <button
              onClick={onProcess}
              disabled={!complete}
              style={{ ...BTN_PRIMARY, opacity: complete ? 1 : 0.4, cursor: complete ? "pointer" : "not-allowed" }}
            >
              Process Data →
            </button>
          </div>
        </div>
      </div>

      {/* Column chips */}
      <div style={CARD}>
        <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.3)" }}>
          Available Columns ({columns.length})
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {columns.map(c => (
            <span key={c} style={{ fontSize: 11, padding: "3px 10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "rgba(255,255,255,0.55)", fontFamily: "monospace" }}>{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Preview Step ─────────────────────────────────────────────────────────────
function PreviewStep({ cleaned, errors, onBack, onContinue }) {
  return (
    <div style={CARD}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 800 }}>Cleaned Data Preview</h2>
          <div style={{ display: "flex", gap: 16, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            <span>✅ <strong style={{ color: "#34d399" }}>{cleaned.length}</strong> valid rows</span>
            {errors.length > 0 && <span>⚠️ <strong style={{ color: "#fb923c" }}>{errors.length}</strong> excluded</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onBack} style={BTN_GHOST}>← Remap</button>
          <button onClick={onContinue} style={BTN_PRIMARY}>View Dashboard →</button>
        </div>
      </div>

      <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              {["#","SUS","Q1","Q2","Q3","Q4","Q5","Q6","Q7","Q8","Q9","Q10","Device","Type","Month","Age"].map(h => (
                <th key={h} style={{ padding: "8px 10px", textAlign: h === "#" || h === "SUS" ? "left" : "center", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cleaned.slice(0, 12).map((row, i) => {
              const g = getSUSGrade(row.sus);
              return (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "7px 10px", color: "rgba(255,255,255,0.25)" }}>{i + 1}</td>
                  <td style={{ padding: "7px 10px" }}>
                    <span style={{ background: g.bg, color: g.color, border: `1px solid ${g.border}`, borderRadius: 6, padding: "2px 8px", fontWeight: 700, fontFamily: "monospace", fontSize: 12 }}>
                      {row.sus.toFixed(1)}
                    </span>
                  </td>
                  {[1,2,3,4,5,6,7,8,9,10].map(q => (
                    <td key={q} style={{ padding: "7px 6px", textAlign: "center", color: "rgba(255,255,255,0.6)" }}>{row[`Q${q}`]}</td>
                  ))}
                  <td style={{ padding: "7px 10px", color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap" }}>{row.device}</td>
                  <td style={{ padding: "7px 10px", color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap" }}>{row.userType}</td>
                  <td style={{ padding: "7px 10px", color: "rgba(255,255,255,0.6)" }}>{row.month}</td>
                  <td style={{ padding: "7px 10px", color: "rgba(255,255,255,0.6)" }}>{row.age ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {cleaned.length > 12 && (
        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 10 }}>
          Showing 12 of {cleaned.length} rows
        </p>
      )}
      {errors.length > 0 && (
        <details style={{ marginTop: 14 }}>
          <summary style={{ cursor: "pointer", fontSize: 13, color: "#fb923c", userSelect: "none", listStyle: "none" }}>
            ⚠️ {errors.length} excluded rows — click to inspect
          </summary>
          <div style={{ marginTop: 8, background: "rgba(251,146,60,0.07)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: 8, padding: "10px 14px", maxHeight: 140, overflowY: "auto" }}>
            {errors.slice(0, 20).map((e, i) => (
              <p key={i} style={{ margin: "0 0 3px", fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: "monospace" }}>{e}</p>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ metrics, onBack, onReset }) {
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const grade = getSUSGrade(metrics.mean);
  const { items: insightItems, actions } = generateInsights(metrics);

  const fetchAI = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const prompt = `You are a senior UX researcher analyzing SUS survey results. Respond ONLY with a valid JSON object — no markdown, no backticks, no explanation.

Data:
- SUS Score: ${metrics.mean.toFixed(1)} / 100  (Grade ${grade.label} — ${grade.desc})
- Std Dev: ${metrics.stdDev.toFixed(1)}, N=${metrics.total}
- Q1–Q10 averages: ${Object.entries(metrics.qAverages).map(([k,v]) => `${k}=${v}`).join(", ")}
- By device: ${metrics.byDevice.map(d => `${d.name}=${d.value}(n=${d.count})`).join(", ")}
- By user type: ${metrics.byUserType.map(u => `${u.name}=${u.value}(n=${u.count})`).join(", ")}

Return exactly this JSON shape:
{"executive_summary":"2-3 sentence stakeholder-ready summary","key_findings":["finding 1","finding 2","finding 3"],"priority_actions":["action 1 (impact: high)","action 2 (impact: medium)","action 3 (impact: medium)"],"benchmark_context":"How this compares to industry SUS averages (avg ~68, good ≥80, excellent ≥85)","positive_highlights":["strength 1","strength 2"]}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const raw = data.content?.find(b => b.type === "text")?.text || "{}";
      setAiResult(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch (e) {
      // Graceful fallback using rule-based data
      setAiResult({
        executive_summary: `Based on ${metrics.total} responses, the system achieved a SUS score of ${metrics.mean.toFixed(1)} (Grade ${grade.label} — ${grade.desc}). ${metrics.mean >= 68 ? "The system meets usability expectations but has specific areas for improvement." : "Significant usability issues require immediate attention."}`,
        key_findings: insightItems.slice(0, 3).map(i => i.text.replace(/^[🔴🟡✅🏆🔵📊⚠️]\s*/, "")),
        priority_actions: actions.slice(0, 3),
        benchmark_context: `Industry SUS average is ~68. Your score of ${metrics.mean.toFixed(1)} places the system ${metrics.mean >= 85 ? "in the top tier (excellent)" : metrics.mean >= 68 ? "above average (good)" : "below average (needs improvement)"}.`,
        positive_highlights: insightItems.filter(i => i.type === "success").map(i => i.text.replace(/^✅\s*/, "")),
      });
    }
    setAiLoading(false);
  };

  const radarData = Object.entries(metrics.qAverages).map(([q, v]) => ({ q, value: v, fullMark: 5 }));
  const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: "0 0 3px", fontSize: 18, fontWeight: 800 }}>Analytics Dashboard</h2>
          <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{metrics.total} respondents analyzed</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onBack} style={BTN_GHOST}>← Preview</button>
          <button onClick={onReset} style={{ ...BTN_GHOST, color: "#a5b4fc", borderColor: "rgba(99,102,241,0.3)" }}>↑ New Upload</button>
        </div>
      </div>

      {/* ── KPIs ──────────────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
        {/* Hero */}
        <div style={{ background: grade.bg, border: `1px solid ${grade.border}`, borderRadius: 16, padding: "22px 24px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 90, height: 90, background: `radial-gradient(circle at top right,${grade.color}30,transparent)`, borderRadius: "0 16px 0 90px" }} />
          <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: grade.color }}>Overall SUS Score</p>
          <p style={{ margin: "0 0 3px", fontSize: 54, fontWeight: 900, fontFamily: "monospace", color: grade.color, lineHeight: 1 }}>{metrics.mean.toFixed(1)}</p>
          <p style={{ margin: "0 0 10px", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
            Grade <strong style={{ color: grade.color }}>{grade.label}</strong> · {grade.desc}
          </p>
          <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${metrics.mean}%`, background: grade.color, borderRadius: 4 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "rgba(255,255,255,0.2)", marginTop: 4 }}>
            <span>0</span><span>68</span><span>100</span>
          </div>
        </div>

        {[
          { icon: "📐", label: "Std. Deviation", value: metrics.stdDev.toFixed(1), sub: metrics.stdDev > 15 ? "High variability" : "Consistent scores", color: "#8b5cf6" },
          { icon: "👥", label: "Total Responses", value: String(metrics.total), sub: "Valid responses", color: "#06b6d4" },
          { icon: "📊", label: "Median Score",    value: metrics.median.toFixed(1), sub: `vs mean ${metrics.mean.toFixed(1)}`, color: "#f59e0b" },
        ].map(({ icon, label, value, sub, color }) => (
          <div key={label} style={{ ...CARD, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, background: color, opacity: 0.07, borderRadius: "0 16px 0 60px" }} />
            <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
            <p style={{ margin: "0 0 4px", fontSize: 30, fontWeight: 900, fontFamily: "monospace", color }}>{value}</p>
            <p style={{ margin: "0 0 2px", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{label}</p>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Charts Row 1 ──────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={CARD}>
          <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.35)" }}>SUS Score Distribution</p>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={metrics.distribution} barCategoryGap="18%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="range" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="count" radius={[5, 5, 0, 0]} name="Responses">
                {metrics.distribution.map((b, i) => <Cell key={i} fill={b.color} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
            {metrics.distribution.map(b => (
              <div key={b.range} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: b.color, display: "inline-block" }} />
                {b.range}
              </div>
            ))}
          </div>
        </div>

        <div style={CARD}>
          <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.35)" }}>SUS by Device</p>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={metrics.byDevice} layout="vertical" barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }} axisLine={false} tickLine={false} width={68} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <ReferenceLine x={68} stroke="rgba(245,158,11,0.4)" strokeDasharray="4 4" />
              <Bar dataKey="value" radius={[0, 5, 5, 0]} name="SUS">
                {metrics.byDevice.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Charts Row 2 ──────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={CARD}>
          <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.35)" }}>New vs. Returning Users</p>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={metrics.byUserType} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <ReferenceLine y={68} stroke="rgba(245,158,11,0.35)" strokeDasharray="4 4" label={{ value: "avg 68", fill: "rgba(245,158,11,0.5)", fontSize: 10, position: "right" }} />
              <Bar dataKey="value" radius={[5, 5, 0, 0]} name="SUS">
                {metrics.byUserType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={CARD}>
          <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.35)" }}>Monthly SUS Trend</p>
          {metrics.byMonth.length >= 2 ? (
            <ResponsiveContainer width="100%" height={190}>
              <LineChart data={metrics.byMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine y={68} stroke="rgba(245,158,11,0.35)" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} name="SUS"
                  dot={{ fill: "#6366f1", r: 4, stroke: "rgba(255,255,255,0.3)", strokeWidth: 1.5 }}
                  activeDot={{ r: 6, fill: "#6366f1" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 190, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
              Need 2+ months for trend line
            </div>
          )}
        </div>
      </div>

      {/* ── Question Analysis ─────────────────────────────────────────────── */}
      <div style={CARD}>
        <p style={{ margin: "0 0 18px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.35)" }}>
          Question-Level Analysis (Q1–Q10)
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Bars */}
          <div>
            {Object.entries(metrics.qAverages).map(([q, avg]) => {
              const qNum = parseInt(q.slice(1));
              const isOdd = qNum % 2 === 1;
              const norm = ((isOdd ? avg - 1 : 5 - avg) / 4) * 100;
              const color = norm >= 70 ? "#10b981" : norm >= 50 ? "#f59e0b" : "#ef4444";
              return (
                <div key={q} style={{ marginBottom: 11 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#a5b4fc", fontFamily: "monospace", minWidth: 24 }}>{q}</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{Q_LABELS[q]}</span>
                      <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 3, padding: "1px 4px" }}>
                        {isOdd ? "▲" : "▼"}{isOdd ? " higher=better" : " lower=better"}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: "monospace" }}>{Number(avg).toFixed(2)}</span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${norm}%`, background: color, borderRadius: 4, transition: "width 0.7s" }} />
                  </div>
                  {norm < 45 && (
                    <p style={{ margin: "2px 0 0", fontSize: 9, color: "rgba(239,68,68,0.6)" }}>⚠ Needs attention</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Radar */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <ResponsiveContainer width="100%" height={270}>
              <RadarChart data={radarData} cx="50%" cy="50%">
                <PolarGrid stroke="rgba(255,255,255,0.07)" />
                <PolarAngleAxis dataKey="q" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 700 }} />
                <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }} axisLine={false} />
                <Radar name="Avg Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.18} strokeWidth={2} />
                <Tooltip contentStyle={TT} formatter={(v, n, p) => [`${v} / 5 — ${Q_LABELS[p.payload.q]}`, "Avg"]} />
              </RadarChart>
            </ResponsiveContainer>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: -8 }}>
              Raw 1–5 scale averages
            </p>
          </div>
        </div>
      </div>

      {/* ── Insights Panel ────────────────────────────────────────────────── */}
      <div style={CARD}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>💡 Insights & Recommendations</h3>
          {!aiResult && (
            <button
              onClick={fetchAI}
              disabled={aiLoading}
              style={{ ...BTN_PRIMARY, fontSize: 12, padding: "8px 18px", opacity: aiLoading ? 0.65 : 1, cursor: aiLoading ? "wait" : "pointer" }}
            >
              {aiLoading ? "⏳ Generating AI Insights..." : "✨ Generate AI Insights"}
            </button>
          )}
        </div>

        {/* Rule-based grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: aiResult ? 18 : 0 }}>
          <div>
            <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.3)" }}>Key Findings</p>
            {insightItems.map((ins, i) => {
              const border = ins.type === "critical" ? "#ef4444" : ins.type === "warning" ? "#f59e0b" : ins.type === "success" ? "#10b981" : "#06b6d4";
              return (
                <div key={i} style={{ borderLeft: `3px solid ${border}`, paddingLeft: 10, marginBottom: 8, fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.55, background: `${border}09`, borderRadius: "0 7px 7px 0", padding: "8px 10px 8px 12px" }}>
                  {ins.text}
                </div>
              );
            })}
          </div>
          <div>
            <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.3)" }}>Recommended Actions</p>
            {actions.map((a, i) => (
              <div key={i} style={{ borderLeft: "3px solid #10b981", paddingLeft: 10, marginBottom: 8, fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.55, background: "rgba(16,185,129,0.06)", borderRadius: "0 7px 7px 0", padding: "8px 10px 8px 12px" }}>
                → {a}
              </div>
            ))}
          </div>
        </div>

        {/* AI result */}
        {aiResult && (
          <div style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 14, padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span>✨</span>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#a5b4fc" }}>AI-Generated Analysis</span>
              <button
                onClick={() => { setAiResult(null); }}
                style={{ marginLeft: "auto", fontSize: 11, color: "rgba(165,180,252,0.4)", background: "transparent", border: "none", cursor: "pointer" }}
              >
                ↺ Clear
              </button>
            </div>

            {aiResult.executive_summary && (
              <p style={{ margin: "0 0 16px", paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>
                {aiResult.executive_summary}
              </p>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {Array.isArray(aiResult.key_findings) && (
                <div>
                  <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.3)" }}>Key Findings</p>
                  {aiResult.key_findings.map((f, i) => (
                    <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 7, paddingLeft: 10, borderLeft: "2px solid rgba(99,102,241,0.45)", lineHeight: 1.55 }}>{f}</div>
                  ))}
                </div>
              )}
              {Array.isArray(aiResult.priority_actions) && (
                <div>
                  <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.3)" }}>Priority Actions</p>
                  {aiResult.priority_actions.map((a, i) => (
                    <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 7, paddingLeft: 10, borderLeft: "2px solid rgba(16,185,129,0.45)", lineHeight: 1.55 }}>{a}</div>
                  ))}
                </div>
              )}
            </div>

            {(aiResult.benchmark_context || (Array.isArray(aiResult.positive_highlights) && aiResult.positive_highlights.length > 0)) && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {Array.isArray(aiResult.positive_highlights) && aiResult.positive_highlights.length > 0 && (
                  <div>
                    <p style={{ margin: "0 0 7px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(52,211,153,0.6)" }}>✅ Strengths</p>
                    {aiResult.positive_highlights.map((h, i) => (
                      <p key={i} style={{ margin: "0 0 5px", fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{h}</p>
                    ))}
                  </div>
                )}
                {aiResult.benchmark_context && (
                  <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "12px 14px" }}>
                    <p style={{ margin: "0 0 5px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.25)" }}>📊 Benchmark</p>
                    <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.55 }}>{aiResult.benchmark_context}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0);
  const [rows, setRows] = useState([]);
  const [mapping, setMapping] = useState({});
  const [cleaned, setCleaned] = useState([]);
  const [errors, setErrors] = useState([]);
  const [metrics, setMetrics] = useState(null);

  const DEFAULT_MAPPING = Object.fromEntries(DEMO_COLS.map(c => [c, c]));

  const loadDemo = () => {
    const r = generateDemo();
    setRows(r);
    setMapping(DEFAULT_MAPPING);
    setStep(1);
  };

  const handleProcess = () => {
    const { cleaned: c, errors: e } = processData(rows, mapping);
    setCleaned(c);
    setErrors(e);
    setMetrics(computeMetrics(c));
    setStep(2);
  };

  const reset = () => {
    setStep(0); setRows([]); setMapping({});
    setCleaned([]); setErrors([]); setMetrics(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#0f0f1a 0%,#1a1a2e 45%,#16213e 100%)",
      fontFamily: "'Outfit',system-ui,sans-serif",
      color: "#e2e8f0",
      padding: "32px 16px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        select { -webkit-appearance: none; -moz-appearance: none; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.5); border-radius: 3px; }
        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
          }}>📊</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em" }}>SUS Analytics</h1>
            <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              System Usability Scale · Insights Engine
            </p>
          </div>
        </div>

        <StepIndicator current={step} />

        {step === 0 && <UploadStep onLoadDemo={loadDemo} />}

        {step === 1 && (
          <MappingStep
            columns={DEMO_COLS}
            mapping={mapping}
            rowCount={rows.length}
            onUpdate={(f, v) => setMapping(m => ({ ...m, [f]: v }))}
            onBack={() => setStep(0)}
            onProcess={handleProcess}
          />
        )}

        {step === 2 && cleaned.length > 0 && (
          <PreviewStep
            cleaned={cleaned}
            errors={errors}
            onBack={() => setStep(1)}
            onContinue={() => setStep(3)}
          />
        )}

        {step === 3 && metrics && (
          <Dashboard
            metrics={metrics}
            onBack={() => setStep(2)}
            onReset={reset}
          />
        )}

      </div>
    </div>
  );
}
