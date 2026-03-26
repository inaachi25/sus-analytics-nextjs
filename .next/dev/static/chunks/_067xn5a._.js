(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/store/useAppStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "selectCurrentRows",
    ()=>selectCurrentRows,
    "selectMappingComplete",
    ()=>selectMappingComplete,
    "useAppStore",
    ()=>useAppStore
]);
// store/useAppStore.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/index.mjs [app-client] (ecmascript) <locals>");
;
const initialState = {
    step: "upload",
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
    aiLoading: false
};
const useAppStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["create"])((set, get)=>({
        ...initialState,
        setStep: (step)=>set({
                step
            }),
        setFileData: (fileName, sheets)=>{
            const firstSheet = sheets[0];
            const columns = firstSheet?.rows.length ? Object.keys(firstSheet.rows[0]) : [];
            set({
                fileName,
                sheets,
                selectedSheet: firstSheet?.name ?? "",
                columns
            });
        },
        setSelectedSheet: (name)=>{
            const sheet = get().sheets.find((s)=>s.name === name);
            const columns = sheet?.rows.length ? Object.keys(sheet.rows[0]) : [];
            set({
                selectedSheet: name,
                columns
            });
        },
        setMapping: (mapping)=>set({
                mapping
            }),
        updateMappingField: (field, value)=>set((state)=>({
                    mapping: {
                        ...state.mapping,
                        [field]: value
                    }
                })),
        setProcessedData: (cleaned, errors, metrics, report)=>set({
                cleanedData: cleaned,
                processingErrors: errors,
                metrics,
                report
            }),
        setAiInsights: (aiInsights)=>set({
                aiInsights
            }),
        setAiLoading: (aiLoading)=>set({
                aiLoading
            }),
        reset: ()=>set(initialState)
    }));
const selectCurrentRows = (state)=>{
    const sheet = state.sheets.find((s)=>s.name === state.selectedSheet);
    return sheet?.rows ?? [];
};
const selectMappingComplete = (state)=>{
    const required = [
        "Q1",
        "Q2",
        "Q3",
        "Q4",
        "Q5",
        "Q6",
        "Q7",
        "Q8",
        "Q9",
        "Q10"
    ];
    return required.every((q)=>Boolean(state.mapping[q]));
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/parser.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "autoDetectMapping",
    ()=>autoDetectMapping,
    "extractColumns",
    ()=>extractColumns,
    "parseFile",
    ()=>parseFile
]);
// lib/parser.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/xlsx/xlsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$papaparse$2f$papaparse$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/papaparse/papaparse.min.js [app-client] (ecmascript)");
;
;
async function parseFile(file) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "csv") {
        return parseCsv(file);
    }
    if (ext === "xlsx" || ext === "xlsm") {
        return parseExcel(file);
    }
    throw new Error(`Unsupported file type: .${ext}. Please upload .xlsx, .xlsm, or .csv`);
}
async function parseExcel(file) {
    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);
    const workbook = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["read"](data, {
        type: "array",
        cellDates: true,
        dateNF: "yyyy-mm-dd"
    });
    return workbook.SheetNames.map((name)=>({
            name,
            rows: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].sheet_to_json(workbook.Sheets[name], {
                raw: false,
                defval: "",
                blankrows: false
            })
        }));
}
async function parseCsv(file) {
    return new Promise((resolve, reject)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$papaparse$2f$papaparse$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false,
            complete: (result)=>{
                resolve([
                    {
                        name: file.name.replace(/\.csv$/i, ""),
                        rows: result.data
                    }
                ]);
            },
            error: (err)=>reject(new Error(`CSV parse error: ${err.message}`))
        });
    });
}
function extractColumns(rows) {
    if (!rows.length) return [];
    return Object.keys(rows[0]);
}
function autoDetectMapping(columns) {
    const map = {};
    const lowerCols = columns.map((c)=>c.toLowerCase());
    for(let q = 1; q <= 10; q++){
        const patterns = [
            `q${q}`,
            `question${q}`,
            `question_${q}`,
            `q_${q}`,
            `item${q}`
        ];
        const idx = lowerCols.findIndex((c)=>patterns.includes(c));
        if (idx !== -1) map[`Q${q}`] = columns[idx];
    }
    const optionalMap = {
        Age: [
            "age",
            "respondent_age",
            "user_age"
        ],
        Date: [
            "date",
            "survey_date",
            "response_date",
            "timestamp",
            "created_at"
        ],
        Device: [
            "device",
            "device_type",
            "platform"
        ],
        UserType: [
            "usertype",
            "user_type",
            "type",
            "new_returning",
            "user_status"
        ]
    };
    for (const [field, patterns] of Object.entries(optionalMap)){
        const idx = lowerCols.findIndex((c)=>patterns.some((p)=>c.includes(p)));
        if (idx !== -1) map[field] = columns[idx];
    }
    return map;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/cleaner.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/cleaner.ts
__turbopack_context__.s([
    "cleanData",
    ()=>cleanData,
    "parseAge",
    ()=>parseAge,
    "parseMonth",
    ()=>parseMonth
]);
function cleanData(rawRows, mapping) {
    const cleaned = [];
    const errors = [];
    for(let i = 0; i < rawRows.length; i++){
        const row = rawRows[i];
        const rowNum = i + 2; // +2 for 1-indexed + header
        // Validate and extract Q1-Q10
        const qScores = {};
        let rowValid = true;
        for(let q = 1; q <= 10; q++){
            const key = `Q${q}`;
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
        const device = mapping.Device ? trimStr(row[mapping.Device]) || "Unknown" : "Unknown";
        const userType = mapping.UserType ? normalizeUserType(trimStr(row[mapping.UserType])) : "Unknown";
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
            Q10: qScores.Q10
        });
    }
    return {
        cleaned,
        errors
    };
}
// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseQScore(val) {
    if (val === null || val === undefined || val === "") return null;
    const n = parseFloat(String(val).trim());
    if (isNaN(n) || n < 1 || n > 5) return null;
    return Math.round(n); // Round to nearest integer
}
function computeSUS(scores) {
    let sum = 0;
    for(let q = 1; q <= 10; q++){
        const score = scores[`Q${q}`];
        if (score === undefined) return null;
        sum += q % 2 === 1 ? score - 1 : 5 - score;
    }
    return sum * 2.5;
}
function parseAge(val) {
    if (val === null || val === undefined || val === "") return null;
    const str = String(val);
    const digits = str.replace(/[^\d]/g, "");
    const n = parseInt(digits, 10);
    if (isNaN(n) || n < 1 || n > 120) return null;
    return n;
}
function parseMonth(val) {
    if (val === null || val === undefined || val === "") return "Unknown";
    const str = String(val).trim();
    // Try standard date parse
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
        return d.toLocaleString("default", {
            month: "short"
        });
    }
    // Try Excel serial number
    if (typeof val === "number" || /^\d+$/.test(str)) {
        const serial = parseInt(str, 10);
        if (serial > 0) {
            const excelEpoch = new Date((serial - 25569) * 86400 * 1000);
            if (!isNaN(excelEpoch.getTime()) && excelEpoch.getFullYear() > 1990) {
                return excelEpoch.toLocaleString("default", {
                    month: "short"
                });
            }
        }
    }
    // Try month name extraction
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];
    for (const m of months){
        if (str.toLowerCase().includes(m.toLowerCase())) return m;
    }
    return str.length <= 10 ? str : "Unknown";
}
function trimStr(val) {
    return String(val ?? "").trim();
}
function normalizeUserType(val) {
    const lower = val.toLowerCase();
    if (lower.includes("new") || lower === "first" || lower === "first-time") return "New";
    if (lower.includes("return") || lower.includes("existing") || lower === "repeat") return "Returning";
    return val || "Unknown";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/metrics.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/metrics.ts
__turbopack_context__.s([
    "computeMetrics",
    ()=>computeMetrics
]);
function computeMetrics(data) {
    if (!data.length) return null;
    const scores = data.map((r)=>r.sus);
    const mean = average(scores);
    const stdDev = standardDeviation(scores, mean);
    const median = computeMedian(scores);
    const byDevice = groupBySegment(data, "device");
    const byUserType = groupBySegment(data, "userType");
    const byMonth = groupByMonth(data);
    const qAverages = computeQAverages(data);
    const distribution = computeDistribution(scores);
    return {
        mean,
        stdDev,
        median,
        total: data.length,
        byDevice,
        byUserType,
        byMonth,
        qAverages,
        distribution,
        scores
    };
}
// ─── Internal Helpers ─────────────────────────────────────────────────────────
function average(nums) {
    return nums.reduce((a, b)=>a + b, 0) / nums.length;
}
function standardDeviation(nums, mean) {
    const m = mean ?? average(nums);
    const variance = nums.reduce((sum, n)=>sum + Math.pow(n - m, 2), 0) / nums.length;
    return Math.sqrt(variance);
}
function computeMedian(sorted_) {
    const arr = [
        ...sorted_
    ].sort((a, b)=>a - b);
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 === 0 ? (arr[mid - 1] + arr[mid]) / 2 : arr[mid];
}
function groupBySegment(data, key) {
    const groups = {};
    for (const row of data){
        const k = row[key] || "Unknown";
        if (!groups[k]) groups[k] = [];
        groups[k].push(row.sus);
    }
    return Object.entries(groups).map(([name, vals])=>({
            name,
            value: Math.round(average(vals) * 10) / 10,
            count: vals.length
        })).sort((a, b)=>b.value - a.value);
}
const MONTH_ORDER = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];
function groupByMonth(data) {
    const groups = {};
    for (const row of data){
        const m = row.month || "Unknown";
        if (!groups[m]) groups[m] = [];
        groups[m].push(row.sus);
    }
    return Object.entries(groups).map(([name, vals])=>({
            name,
            value: Math.round(average(vals) * 10) / 10,
            count: vals.length
        })).sort((a, b)=>{
        const ai = MONTH_ORDER.indexOf(a.name);
        const bi = MONTH_ORDER.indexOf(b.name);
        if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
    });
}
function computeQAverages(data) {
    const result = {};
    for(let q = 1; q <= 10; q++){
        const key = `Q${q}`;
        const vals = data.map((r)=>r[key]);
        result[key] = Math.round(average(vals) * 100) / 100;
    }
    return result;
}
const DISTRIBUTION_BUCKETS = [
    {
        range: "0–25",
        min: 0,
        max: 25,
        color: "#ef4444"
    },
    {
        range: "25–50",
        min: 25,
        max: 50,
        color: "#f97316"
    },
    {
        range: "50–68",
        min: 50,
        max: 68,
        color: "#f59e0b"
    },
    {
        range: "68–80",
        min: 68,
        max: 80,
        color: "#84cc16"
    },
    {
        range: "80–100",
        min: 80,
        max: 101,
        color: "#10b981"
    }
];
function computeDistribution(scores) {
    return DISTRIBUTION_BUCKETS.map(({ range, min, max, color })=>({
            range,
            count: scores.filter((s)=>s >= min && s < max).length,
            color
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/sus.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/sus.ts
__turbopack_context__.s([
    "Q_LABELS",
    ()=>Q_LABELS,
    "Q_POLARITY",
    ()=>Q_POLARITY,
    "computeSUSScore",
    ()=>computeSUSScore,
    "getSUSGrade",
    ()=>getSUSGrade,
    "getSUSPercentile",
    ()=>getSUSPercentile,
    "normalizeQScore",
    ()=>normalizeQScore,
    "transformScore",
    ()=>transformScore
]);
const Q_LABELS = {
    Q1: "System Use Frequency",
    Q2: "Complexity",
    Q3: "Ease of Use",
    Q4: "Need for Support",
    Q5: "Feature Integration",
    Q6: "Inconsistency",
    Q7: "Quick Learning",
    Q8: "Cumbersome",
    Q9: "Confidence",
    Q10: "Learning Curve"
};
const Q_POLARITY = {
    Q1: "positive",
    Q2: "negative",
    Q3: "positive",
    Q4: "negative",
    Q5: "positive",
    Q6: "negative",
    Q7: "positive",
    Q8: "negative",
    Q9: "positive",
    Q10: "negative"
};
function transformScore(questionIndex, rawScore) {
    return questionIndex % 2 === 1 ? rawScore - 1 : 5 - rawScore;
}
function computeSUSScore(scores) {
    if (scores.length !== 10) return null;
    let sum = 0;
    for(let i = 0; i < 10; i++){
        const s = scores[i];
        if (s < 1 || s > 5 || !Number.isInteger(s)) return null;
        sum += transformScore(i + 1, s);
    }
    return sum * 2.5;
}
function getSUSGrade(score) {
    if (score >= 90) return {
        label: "A+",
        desc: "Best Imaginable",
        color: "#10b981",
        bgColor: "rgba(16,185,129,0.15)"
    };
    if (score >= 85) return {
        label: "A",
        desc: "Excellent",
        color: "#10b981",
        bgColor: "rgba(16,185,129,0.12)"
    };
    if (score >= 80) return {
        label: "B+",
        desc: "Good",
        color: "#84cc16",
        bgColor: "rgba(132,204,22,0.12)"
    };
    if (score >= 70) return {
        label: "B",
        desc: "Good",
        color: "#84cc16",
        bgColor: "rgba(132,204,22,0.10)"
    };
    if (score >= 68) return {
        label: "C+",
        desc: "Acceptable",
        color: "#f59e0b",
        bgColor: "rgba(245,158,11,0.12)"
    };
    if (score >= 51) return {
        label: "C",
        desc: "Marginal",
        color: "#f97316",
        bgColor: "rgba(249,115,22,0.12)"
    };
    return {
        label: "F",
        desc: "Unacceptable",
        color: "#ef4444",
        bgColor: "rgba(239,68,68,0.12)"
    };
}
function getSUSPercentile(score) {
    if (score >= 96) return "Top 5%";
    if (score >= 89) return "Top 10%";
    if (score >= 83) return "Top 25%";
    if (score >= 68) return "Above Average";
    if (score >= 51) return "Average";
    if (score >= 38) return "Below Average";
    return "Bottom 10%";
}
function normalizeQScore(questionIndex, avgScore) {
    const transformed = transformScore(questionIndex, avgScore);
    return transformed / 4 * 100;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/recommendations.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/recommendations.ts
__turbopack_context__.s([
    "generateReport",
    ()=>generateReport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sus.ts [app-client] (ecmascript)");
;
function generateReport(metrics) {
    const grade = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSUSGrade"])(metrics.mean);
    const percentile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSUSPercentile"])(metrics.mean);
    const recommendations = [];
    // Overall score evaluation
    if (metrics.mean >= 85) {
        recommendations.push({
            type: "success",
            category: "Overall Score",
            insight: `Excellent usability with a SUS score of ${metrics.mean.toFixed(1)} (${grade.desc}).`,
            action: "Maintain current UX standards. Consider A/B testing incremental improvements."
        });
    } else if (metrics.mean >= 68) {
        recommendations.push({
            type: "info",
            category: "Overall Score",
            insight: `Acceptable usability score of ${metrics.mean.toFixed(1)}. Most users can use the system effectively.`,
            action: "Target specific pain points to push the score above 80."
        });
    } else {
        recommendations.push({
            type: "critical",
            category: "Overall Score",
            insight: `Below-average SUS score of ${metrics.mean.toFixed(1)} indicates significant usability issues.`,
            action: "Prioritize a usability audit and conduct targeted user testing immediately."
        });
    }
    // Variability check
    if (metrics.stdDev > 15) {
        recommendations.push({
            type: "warning",
            category: "Consistency",
            insight: `High variability in scores (σ = ${metrics.stdDev.toFixed(1)}) suggests inconsistent user experiences.`,
            action: "Segment users and investigate what differentiates high vs. low scorers."
        });
    }
    // Q-level analysis
    const { qAverages } = metrics;
    if (qAverages.Q2 > 3.5) {
        recommendations.push({
            type: "critical",
            category: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q_LABELS"].Q2,
            insight: `Q2 avg ${qAverages.Q2.toFixed(2)}: Users perceive the system as overly complex.`,
            action: "Reduce cognitive load. Simplify menus, streamline workflows, and eliminate unnecessary features."
        });
    }
    if (qAverages.Q3 < 2.5) {
        recommendations.push({
            type: "critical",
            category: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q_LABELS"].Q3,
            insight: `Q3 avg ${qAverages.Q3.toFixed(2)}: Ease of use is critically low.`,
            action: "Conduct usability testing to identify friction. Redesign key interaction flows."
        });
    } else if (qAverages.Q3 < 3.5) {
        recommendations.push({
            type: "warning",
            category: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q_LABELS"].Q3,
            insight: `Q3 avg ${qAverages.Q3.toFixed(2)}: Ease of use has room for improvement.`,
            action: "Add progressive disclosure and contextual help to assist users."
        });
    }
    if (qAverages.Q4 > 3.5) {
        recommendations.push({
            type: "warning",
            category: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q_LABELS"].Q4,
            insight: `Q4 avg ${qAverages.Q4.toFixed(2)}: Many users feel they need technical support.`,
            action: "Improve in-app documentation, add tooltips, and build a self-service help center."
        });
    }
    if (qAverages.Q6 > 3.5) {
        recommendations.push({
            type: "warning",
            category: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q_LABELS"].Q6,
            insight: `Q6 avg ${qAverages.Q6.toFixed(2)}: Users find the system inconsistent.`,
            action: "Audit UI patterns for consistency. Standardize terminology and visual design."
        });
    }
    if (qAverages.Q7 < 3.0) {
        recommendations.push({
            type: "critical",
            category: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q_LABELS"].Q7,
            insight: `Q7 avg ${qAverages.Q7.toFixed(2)}: Users struggle to learn the system quickly.`,
            action: "Create guided onboarding tours and improve feature discoverability with progressive disclosure."
        });
    }
    if (qAverages.Q8 > 3.5) {
        recommendations.push({
            type: "warning",
            category: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q_LABELS"].Q8,
            insight: `Q8 avg ${qAverages.Q8.toFixed(2)}: Users find the system cumbersome to use.`,
            action: "Streamline common workflows. Reduce the number of steps to complete key tasks."
        });
    }
    if (qAverages.Q9 < 3.0) {
        recommendations.push({
            type: "warning",
            category: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q_LABELS"].Q9,
            insight: `Q9 avg ${qAverages.Q9.toFixed(2)}: Users lack confidence while using the system.`,
            action: "Add confirmation dialogs, undo functionality, and clear error recovery paths."
        });
    }
    if (qAverages.Q10 > 3.5) {
        recommendations.push({
            type: "info",
            category: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q_LABELS"].Q10,
            insight: `Q10 avg ${qAverages.Q10.toFixed(2)}: Users face a steep learning curve.`,
            action: "Invest in onboarding resources: video tutorials, quick-start guides, and interactive demos."
        });
    }
    // Positive highlights
    if (qAverages.Q1 > 4.0) {
        recommendations.push({
            type: "success",
            category: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q_LABELS"].Q1,
            insight: `Q1 avg ${qAverages.Q1.toFixed(2)}: Strong intent to use the system frequently.`,
            action: "Leverage high engagement. Invest in retention features and loyalty programs."
        });
    }
    if (qAverages.Q5 > 4.0) {
        recommendations.push({
            type: "success",
            category: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q_LABELS"].Q5,
            insight: `Q5 avg ${qAverages.Q5.toFixed(2)}: Users find features well integrated.`,
            action: "Continue building cohesive feature sets. Use this as a benchmark for new features."
        });
    }
    // Device comparison
    if (metrics.byDevice.length >= 2) {
        const best = metrics.byDevice[0];
        const worst = metrics.byDevice[metrics.byDevice.length - 1];
        if (best.value - worst.value > 10) {
            recommendations.push({
                type: "warning",
                category: "Device Parity",
                insight: `Significant SUS gap: ${best.name} (${best.value}) vs ${worst.name} (${worst.value}).`,
                action: `Prioritize UX improvements on ${worst.name}. Conduct device-specific testing.`
            });
        }
    }
    // New vs Returning
    const newUser = metrics.byUserType.find((u)=>u.name === "New");
    const returningUser = metrics.byUserType.find((u)=>u.name === "Returning");
    if (newUser && returningUser && returningUser.value - newUser.value > 10) {
        recommendations.push({
            type: "info",
            category: "Onboarding",
            insight: `New users score ${newUser.value} vs returning users ${returningUser.value} — a ${(returningUser.value - newUser.value).toFixed(1)} pt gap.`,
            action: "Invest in onboarding. New user experience needs significant improvement."
        });
    }
    const summary = buildSummary(metrics.mean, grade.label, grade.desc, percentile, metrics.total);
    return {
        grade: grade.label,
        gradeLabel: grade.desc,
        summary,
        recommendations
    };
}
function buildSummary(mean, grade, desc, percentile, total) {
    return `Based on ${total} responses, the system achieved a SUS score of ${mean.toFixed(1)} — Grade ${grade} (${desc}), placing it in the ${percentile} range. ${mean >= 85 ? "Users find the system intuitive and easy to use." : mean >= 68 ? "The system meets usability expectations but has room for targeted improvements." : "The system requires significant usability improvements across multiple dimensions."}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/demo.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/demo.ts
__turbopack_context__.s([
    "DEMO_COLUMN_MAPPING",
    ()=>DEMO_COLUMN_MAPPING,
    "generateDemoDataset",
    ()=>generateDemoDataset
]);
const DEVICES = [
    "Desktop",
    "Mobile",
    "Tablet"
];
const USER_TYPES = [
    "New",
    "Returning"
];
const MONTHS = [
    "2025-01-15",
    "2025-02-08",
    "2025-03-22",
    "2025-04-10",
    "2025-05-17",
    "2025-06-03"
];
function generateDemoDataset() {
    const rows = [];
    for(let i = 0; i < 80; i++){
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
        const clamp = (v)=>Math.min(5, Math.max(1, Math.round(v + (Math.random() - 0.5) * 0.8)));
        rows.push({
            RespondentID: i + 1,
            // Positive questions (Q1,3,5,7,9) - higher is better
            Q1: clamp(adjusted),
            Q2: clamp(6 - adjusted),
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
            UserType: userType
        });
    }
    return rows;
}
const DEMO_COLUMN_MAPPING = {
    Q1: "Q1",
    Q2: "Q2",
    Q3: "Q3",
    Q4: "Q4",
    Q5: "Q5",
    Q6: "Q6",
    Q7: "Q7",
    Q8: "Q8",
    Q9: "Q9",
    Q10: "Q10",
    Age: "Age",
    Date: "Date",
    Device: "Device",
    UserType: "UserType"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/utils/cn.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
// utils/cn.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/layout/StepIndicator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StepIndicator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/cn.ts [app-client] (ecmascript)");
// components/layout/StepIndicator.tsx
"use client";
;
;
const STEPS = [
    {
        label: "Upload",
        icon: "↑"
    },
    {
        label: "Map Columns",
        icon: "⇄"
    },
    {
        label: "Preview",
        icon: "◉"
    },
    {
        label: "Dashboard",
        icon: "▦"
    }
];
function StepIndicator({ current }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center mb-10",
        children: STEPS.map((step, i)=>{
            const isPast = i < current;
            const isActive = i === current;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300", isPast && "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30", isActive && "bg-indigo-500 text-white ring-4 ring-indigo-500/30 shadow-lg shadow-indigo-500/30", !isPast && !isActive && "bg-white/[0.06] text-white/25 border border-white/10"),
                                children: isPast ? "✓" : isActive ? step.icon : i + 1
                            }, void 0, false, {
                                fileName: "[project]/components/layout/StepIndicator.tsx",
                                lineNumber: 28,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap transition-colors duration-300", isPast || isActive ? "text-indigo-300" : "text-white/25"),
                                children: step.label
                            }, void 0, false, {
                                fileName: "[project]/components/layout/StepIndicator.tsx",
                                lineNumber: 39,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/StepIndicator.tsx",
                        lineNumber: 26,
                        columnNumber: 13
                    }, this),
                    i < STEPS.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-0.5 w-14 mx-1.5 mb-5 rounded-full transition-all duration-500", i < current ? "bg-indigo-500" : "bg-white/10")
                    }, void 0, false, {
                        fileName: "[project]/components/layout/StepIndicator.tsx",
                        lineNumber: 51,
                        columnNumber: 15
                    }, this)
                ]
            }, i, true, {
                fileName: "[project]/components/layout/StepIndicator.tsx",
                lineNumber: 25,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/components/layout/StepIndicator.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_c = StepIndicator;
var _c;
__turbopack_context__.k.register(_c, "StepIndicator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/layout/UploadStep.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UploadStep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/cn.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// components/layout/UploadStep.tsx
"use client";
;
;
function UploadStep({ onFileUpload, onLoadDemo }) {
    _s();
    const [dragging, setDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fileRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UploadStep.useCallback[handleDrop]": (e)=>{
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) onFileUpload(file);
        }
    }["UploadStep.useCallback[handleDrop]"], [
        onFileUpload
    ]);
    const handleChange = (e)=>{
        const file = e.target.files?.[0];
        if (file) onFileUpload(file);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-xl mx-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "card p-7",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-xl font-bold mb-1",
                    children: "Upload Survey Data"
                }, void 0, false, {
                    fileName: "[project]/components/layout/UploadStep.tsx",
                    lineNumber: 34,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-white/50 text-sm mb-6",
                    children: [
                        "Upload your SUS survey export to begin automated analysis. Supports ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-indigo-300 font-mono text-xs",
                            children: ".xlsx"
                        }, void 0, false, {
                            fileName: "[project]/components/layout/UploadStep.tsx",
                            lineNumber: 37,
                            columnNumber: 20
                        }, this),
                        ",",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-indigo-300 font-mono text-xs",
                            children: ".xlsm"
                        }, void 0, false, {
                            fileName: "[project]/components/layout/UploadStep.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this),
                        ",",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-indigo-300 font-mono text-xs",
                            children: ".csv"
                        }, void 0, false, {
                            fileName: "[project]/components/layout/UploadStep.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/layout/UploadStep.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    onDrop: handleDrop,
                    onDragOver: (e)=>{
                        e.preventDefault();
                        setDragging(true);
                    },
                    onDragLeave: ()=>setDragging(false),
                    onClick: ()=>fileRef.current?.click(),
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200", dragging ? "border-indigo-400 bg-indigo-500/10" : "border-indigo-500/30 bg-indigo-500/[0.03] hover:border-indigo-400/50 hover:bg-indigo-500/[0.06]"),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-4xl mb-3",
                            children: "📂"
                        }, void 0, false, {
                            fileName: "[project]/components/layout/UploadStep.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-semibold text-white/80 mb-1",
                            children: dragging ? "Drop to upload" : "Drag & drop your file here"
                        }, void 0, false, {
                            fileName: "[project]/components/layout/UploadStep.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-white/40 mb-4",
                            children: "or click to browse"
                        }, void 0, false, {
                            fileName: "[project]/components/layout/UploadStep.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "inline-block bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-sm font-semibold px-5 py-2 rounded-lg",
                            children: "Select File"
                        }, void 0, false, {
                            fileName: "[project]/components/layout/UploadStep.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/layout/UploadStep.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    ref: fileRef,
                    type: "file",
                    accept: ".xlsx,.xlsm,.csv",
                    className: "hidden",
                    onChange: handleChange
                }, void 0, false, {
                    fileName: "[project]/components/layout/UploadStep.tsx",
                    lineNumber: 65,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3 my-5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 h-px bg-white/10"
                        }, void 0, false, {
                            fileName: "[project]/components/layout/UploadStep.tsx",
                            lineNumber: 75,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs text-white/30 font-medium",
                            children: "or try a demo"
                        }, void 0, false, {
                            fileName: "[project]/components/layout/UploadStep.tsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 h-px bg-white/10"
                        }, void 0, false, {
                            fileName: "[project]/components/layout/UploadStep.tsx",
                            lineNumber: 77,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/layout/UploadStep.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onLoadDemo,
                    className: "w-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border border-indigo-400/30 hover:border-indigo-400/60 text-indigo-300 font-semibold py-3 rounded-xl text-sm transition-all duration-200 hover:brightness-110",
                    children: [
                        "✨ Load Demo Dataset ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-white/40 font-normal",
                            children: "(80 responses)"
                        }, void 0, false, {
                            fileName: "[project]/components/layout/UploadStep.tsx",
                            lineNumber: 85,
                            columnNumber: 31
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/layout/UploadStep.tsx",
                    lineNumber: 81,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs font-semibold text-white/40 uppercase tracking-wider mb-2",
                            children: "Expected Format"
                        }, void 0, false, {
                            fileName: "[project]/components/layout/UploadStep.tsx",
                            lineNumber: 90,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-white/50 leading-relaxed",
                            children: "Your file should have one row per respondent with columns for Q1–Q10 (rated 1–5). Optional columns: Age, Date, Device, and User Type. Column names don't need to match exactly — you'll map them in the next step."
                        }, void 0, false, {
                            fileName: "[project]/components/layout/UploadStep.tsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/layout/UploadStep.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/layout/UploadStep.tsx",
            lineNumber: 33,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/layout/UploadStep.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
_s(UploadStep, "K215UmH8egjZoLnE3yrwvQnK2Ks=");
_c = UploadStep;
var _c;
__turbopack_context__.k.register(_c, "UploadStep");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/layout/MappingStep.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MappingStep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sus.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/cn.ts [app-client] (ecmascript)");
// components/layout/MappingStep.tsx
"use client";
;
;
;
const REQUIRED_FIELDS = [
    "Q1",
    "Q2",
    "Q3",
    "Q4",
    "Q5",
    "Q6",
    "Q7",
    "Q8",
    "Q9",
    "Q10"
];
const OPTIONAL_FIELDS = [
    "Age",
    "Date",
    "Device",
    "UserType"
];
function MappingStep({ fileName, sheets, selectedSheet, columns, mapping, rawRowCount, mappingComplete, onSheetChange, onMappingChange, onBack, onProcess }) {
    const mappedRequired = REQUIRED_FIELDS.filter((f)=>Boolean(mapping[f])).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card p-6 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between gap-4 flex-wrap mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg font-bold mb-0.5",
                                        children: "Map Your Columns"
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/MappingStep.tsx",
                                        lineNumber: 38,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-white/50",
                                        children: [
                                            "File:",
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-indigo-300 font-medium",
                                                children: fileName
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/MappingStep.tsx",
                                                lineNumber: 41,
                                                columnNumber: 15
                                            }, this),
                                            " · ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white/70",
                                                children: rawRowCount
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/MappingStep.tsx",
                                                lineNumber: 43,
                                                columnNumber: 15
                                            }, this),
                                            " rows detected"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/layout/MappingStep.tsx",
                                        lineNumber: 39,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/layout/MappingStep.tsx",
                                lineNumber: 37,
                                columnNumber: 11
                            }, this),
                            sheets.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5",
                                        children: "Active Sheet"
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/MappingStep.tsx",
                                        lineNumber: 50,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: selectedSheet,
                                                onChange: (e)=>onSheetChange(e.target.value),
                                                className: "bg-white/[0.07] border border-white/15 rounded-lg pl-3 pr-8 py-2 text-sm text-white/80 cursor-pointer focus:outline-none focus:border-indigo-400/60",
                                                children: sheets.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: s.name,
                                                        children: s.name
                                                    }, s.name, false, {
                                                        fileName: "[project]/components/layout/MappingStep.tsx",
                                                        lineNumber: 60,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/MappingStep.tsx",
                                                lineNumber: 54,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 text-xs",
                                                children: "▼"
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/MappingStep.tsx",
                                                lineNumber: 63,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/layout/MappingStep.tsx",
                                        lineNumber: 53,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/layout/MappingStep.tsx",
                                lineNumber: 49,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/MappingStep.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xs font-bold uppercase tracking-widest text-white/40 mb-3",
                                children: "Required — SUS Questions (Q1–Q10)"
                            }, void 0, false, {
                                fileName: "[project]/components/layout/MappingStep.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3",
                                children: REQUIRED_FIELDS.map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColumnSelect, {
                                        field: field,
                                        label: `${field}`,
                                        sublabel: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q_LABELS"][field]?.split(" ").slice(0, 2).join(" "),
                                        columns: columns,
                                        value: mapping[field] || "",
                                        onChange: (v)=>onMappingChange(field, v),
                                        required: true
                                    }, field, false, {
                                        fileName: "[project]/components/layout/MappingStep.tsx",
                                        lineNumber: 76,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/layout/MappingStep.tsx",
                                lineNumber: 74,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/MappingStep.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xs font-bold uppercase tracking-widest text-white/40 mb-3",
                                children: "Optional — Segmentation Dimensions"
                            }, void 0, false, {
                                fileName: "[project]/components/layout/MappingStep.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
                                children: OPTIONAL_FIELDS.map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColumnSelect, {
                                        field: field,
                                        label: field === "UserType" ? "User Type" : field,
                                        sublabel: field === "UserType" ? "New / Returning" : field === "Date" ? "For monthly trend" : "",
                                        columns: columns,
                                        value: mapping[field] || "",
                                        onChange: (v)=>onMappingChange(field, v),
                                        required: false
                                    }, field, false, {
                                        fileName: "[project]/components/layout/MappingStep.tsx",
                                        lineNumber: 97,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/layout/MappingStep.tsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/MappingStep.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-white/[0.06]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-1.5 w-32 rounded-full bg-white/10 overflow-hidden",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-full bg-indigo-500 rounded-full transition-all duration-500",
                                            style: {
                                                width: `${mappedRequired / 10 * 100}%`
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/MappingStep.tsx",
                                            lineNumber: 115,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/MappingStep.tsx",
                                        lineNumber: 114,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-white/40",
                                        children: [
                                            mappedRequired,
                                            "/10 required columns mapped"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/layout/MappingStep.tsx",
                                        lineNumber: 120,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/layout/MappingStep.tsx",
                                lineNumber: 113,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onBack,
                                        className: "px-4 py-2 text-sm text-white/50 border border-white/10 rounded-lg hover:border-white/20 transition-all",
                                        children: "← Back"
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/MappingStep.tsx",
                                        lineNumber: 126,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onProcess,
                                        disabled: !mappingComplete,
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200", mappingComplete ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 hover:brightness-110" : "bg-white/10 text-white/30 cursor-not-allowed"),
                                        children: "Process Data →"
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/MappingStep.tsx",
                                        lineNumber: 132,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/layout/MappingStep.tsx",
                                lineNumber: 125,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/MappingStep.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/MappingStep.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            columns.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DataPreviewTable, {
                columns: columns,
                rows: []
            }, void 0, false, {
                fileName: "[project]/components/layout/MappingStep.tsx",
                lineNumber: 150,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/layout/MappingStep.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
_c = MappingStep;
function ColumnSelect({ field, label, sublabel, columns, value, onChange, required }) {
    const mapped = Boolean(value);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("block text-[10px] font-bold uppercase tracking-wider mb-1.5 transition-colors", required ? mapped ? "text-emerald-400" : "text-orange-400" : "text-white/40"),
                children: [
                    label,
                    required && " *",
                    sublabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-1 font-normal normal-case tracking-normal text-white/25",
                        children: sublabel
                    }, void 0, false, {
                        fileName: "[project]/components/layout/MappingStep.tsx",
                        lineNumber: 179,
                        columnNumber: 22
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/MappingStep.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: value,
                        onChange: (e)=>onChange(e.target.value),
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full text-xs rounded-lg pl-2.5 pr-7 py-2 text-white/80 cursor-pointer focus:outline-none transition-all", mapped ? "bg-indigo-500/10 border border-indigo-500/40 focus:border-indigo-400" : "bg-white/[0.05] border border-white/10 focus:border-white/25"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "— Select —"
                            }, void 0, false, {
                                fileName: "[project]/components/layout/MappingStep.tsx",
                                lineNumber: 192,
                                columnNumber: 11
                            }, this),
                            columns.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: c,
                                    children: c
                                }, c, false, {
                                    fileName: "[project]/components/layout/MappingStep.tsx",
                                    lineNumber: 194,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/MappingStep.tsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/25 text-[10px]",
                        children: "▼"
                    }, void 0, false, {
                        fileName: "[project]/components/layout/MappingStep.tsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/MappingStep.tsx",
                lineNumber: 181,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/layout/MappingStep.tsx",
        lineNumber: 171,
        columnNumber: 5
    }, this);
}
_c1 = ColumnSelect;
function DataPreviewTable({ columns }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card p-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-xs font-bold uppercase tracking-widest text-white/40 mb-3",
                children: [
                    "Available Columns (",
                    columns.length,
                    ")"
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/MappingStep.tsx",
                lineNumber: 206,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-2",
                children: columns.map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs px-2.5 py-1 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white/60 font-mono",
                        children: col
                    }, col, false, {
                        fileName: "[project]/components/layout/MappingStep.tsx",
                        lineNumber: 211,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/layout/MappingStep.tsx",
                lineNumber: 209,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/layout/MappingStep.tsx",
        lineNumber: 205,
        columnNumber: 5
    }, this);
}
_c2 = DataPreviewTable;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "MappingStep");
__turbopack_context__.k.register(_c1, "ColumnSelect");
__turbopack_context__.k.register(_c2, "DataPreviewTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/utils/export.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// utils/export.ts
__turbopack_context__.s([
    "exportToCSV",
    ()=>exportToCSV
]);
function exportToCSV(data, filename = "sus_results.csv") {
    const headers = [
        "SUS Score",
        "Q1",
        "Q2",
        "Q3",
        "Q4",
        "Q5",
        "Q6",
        "Q7",
        "Q8",
        "Q9",
        "Q10",
        "Device",
        "User Type",
        "Month",
        "Age"
    ];
    const rows = data.map((r)=>[
            r.sus.toFixed(2),
            r.Q1,
            r.Q2,
            r.Q3,
            r.Q4,
            r.Q5,
            r.Q6,
            r.Q7,
            r.Q8,
            r.Q9,
            r.Q10,
            r.device,
            r.userType,
            r.month,
            r.age ?? ""
        ]);
    const csv = [
        headers,
        ...rows
    ].map((r)=>r.map(String).join(",")).join("\n");
    const blob = new Blob([
        csv
    ], {
        type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/layout/PreviewStep.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PreviewStep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sus.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$export$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/export.ts [app-client] (ecmascript)");
// components/layout/PreviewStep.tsx
"use client";
;
;
;
const Q_COLS = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10
];
function PreviewStep({ cleanedData, errors, onBack, onContinue }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "card p-6 mb-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start justify-between flex-wrap gap-3 mb-5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-bold mb-1",
                                    children: "Cleaned Data Preview"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/PreviewStep.tsx",
                                    lineNumber: 25,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 flex-wrap text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center gap-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "w-2 h-2 rounded-full bg-emerald-400 inline-block"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/layout/PreviewStep.tsx",
                                                    lineNumber: 28,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-white/70",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            className: "text-emerald-400",
                                                            children: cleanedData.length
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/layout/PreviewStep.tsx",
                                                            lineNumber: 30,
                                                            columnNumber: 19
                                                        }, this),
                                                        " valid rows"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/layout/PreviewStep.tsx",
                                                    lineNumber: 29,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/layout/PreviewStep.tsx",
                                            lineNumber: 27,
                                            columnNumber: 15
                                        }, this),
                                        errors.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center gap-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "w-2 h-2 rounded-full bg-orange-400 inline-block"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/layout/PreviewStep.tsx",
                                                    lineNumber: 35,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-white/70",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            className: "text-orange-400",
                                                            children: errors.length
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/layout/PreviewStep.tsx",
                                                            lineNumber: 37,
                                                            columnNumber: 21
                                                        }, this),
                                                        " excluded"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/layout/PreviewStep.tsx",
                                                    lineNumber: 36,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/layout/PreviewStep.tsx",
                                            lineNumber: 34,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/layout/PreviewStep.tsx",
                                    lineNumber: 26,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/PreviewStep.tsx",
                            lineNumber: 24,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2.5 flex-wrap",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$export$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["exportToCSV"])(cleanedData),
                                    className: "px-3 py-2 text-xs font-semibold border border-white/10 rounded-lg text-white/50 hover:text-white/70 hover:border-white/20 transition-all",
                                    children: "↓ Export CSV"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/PreviewStep.tsx",
                                    lineNumber: 45,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onBack,
                                    className: "px-4 py-2 text-sm text-white/50 border border-white/10 rounded-lg hover:border-white/20 transition-all",
                                    children: "← Remap"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/PreviewStep.tsx",
                                    lineNumber: 51,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onContinue,
                                    className: "px-5 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-lg shadow-lg shadow-indigo-500/25 hover:brightness-110 transition-all",
                                    children: "View Dashboard →"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/PreviewStep.tsx",
                                    lineNumber: 57,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/PreviewStep.tsx",
                            lineNumber: 44,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/layout/PreviewStep.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overflow-x-auto rounded-xl border border-white/[0.06]",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "w-full text-xs",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "border-b border-white/[0.08]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-white/40",
                                            children: "#"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/PreviewStep.tsx",
                                            lineNumber: 71,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-white/40",
                                            children: "SUS"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/PreviewStep.tsx",
                                            lineNumber: 72,
                                            columnNumber: 17
                                        }, this),
                                        Q_COLS.map((q)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-2 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-white/40",
                                                children: [
                                                    "Q",
                                                    q
                                                ]
                                            }, q, true, {
                                                fileName: "[project]/components/layout/PreviewStep.tsx",
                                                lineNumber: 74,
                                                columnNumber: 19
                                            }, this)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-white/40",
                                            children: "Device"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/PreviewStep.tsx",
                                            lineNumber: 78,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-white/40",
                                            children: "Type"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/PreviewStep.tsx",
                                            lineNumber: 79,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-white/40",
                                            children: "Month"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/PreviewStep.tsx",
                                            lineNumber: 80,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-white/40",
                                            children: "Age"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/PreviewStep.tsx",
                                            lineNumber: 81,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/layout/PreviewStep.tsx",
                                    lineNumber: 70,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/layout/PreviewStep.tsx",
                                lineNumber: 69,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                children: cleanedData.slice(0, 12).map((row, i)=>{
                                    const grade = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSUSGrade"])(row.sus);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2 text-white/30",
                                                children: i + 1
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/PreviewStep.tsx",
                                                lineNumber: 89,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "inline-block px-2 py-0.5 rounded text-xs font-bold font-mono",
                                                    style: {
                                                        background: grade.bgColor,
                                                        color: grade.color
                                                    },
                                                    children: row.sus.toFixed(1)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/layout/PreviewStep.tsx",
                                                    lineNumber: 91,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/PreviewStep.tsx",
                                                lineNumber: 90,
                                                columnNumber: 21
                                            }, this),
                                            Q_COLS.map((q)=>{
                                                const key = `Q${q}`;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-2 py-2 text-center text-white/60",
                                                    children: row[key]
                                                }, q, false, {
                                                    fileName: "[project]/components/layout/PreviewStep.tsx",
                                                    lineNumber: 101,
                                                    columnNumber: 25
                                                }, this);
                                            }),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2 text-white/60 whitespace-nowrap",
                                                children: row.device
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/PreviewStep.tsx",
                                                lineNumber: 106,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2 text-white/60 whitespace-nowrap",
                                                children: row.userType
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/PreviewStep.tsx",
                                                lineNumber: 107,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2 text-white/60",
                                                children: row.month
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/PreviewStep.tsx",
                                                lineNumber: 108,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2 text-white/60",
                                                children: row.age ?? "—"
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/PreviewStep.tsx",
                                                lineNumber: 109,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/components/layout/PreviewStep.tsx",
                                        lineNumber: 88,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/layout/PreviewStep.tsx",
                                lineNumber: 84,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/PreviewStep.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/layout/PreviewStep.tsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, this),
                cleanedData.length > 12 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-center text-xs text-white/30 mt-3",
                    children: [
                        "Showing 12 of ",
                        cleanedData.length,
                        " rows"
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/layout/PreviewStep.tsx",
                    lineNumber: 118,
                    columnNumber: 11
                }, this),
                errors.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                    className: "mt-4 group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                            className: "cursor-pointer text-sm text-orange-400 hover:text-orange-300 select-none transition-colors list-none flex items-center gap-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "group-open:rotate-90 transition-transform inline-block",
                                    children: "▶"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/PreviewStep.tsx",
                                    lineNumber: 127,
                                    columnNumber: 15
                                }, this),
                                errors.length,
                                " excluded rows — click to inspect"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/PreviewStep.tsx",
                            lineNumber: 126,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2 bg-orange-500/[0.07] border border-orange-400/20 rounded-xl p-4 max-h-40 overflow-y-auto",
                            children: errors.slice(0, 30).map((e, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-white/50 font-mono mb-1 last:mb-0",
                                    children: e
                                }, i, false, {
                                    fileName: "[project]/components/layout/PreviewStep.tsx",
                                    lineNumber: 132,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/layout/PreviewStep.tsx",
                            lineNumber: 130,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/layout/PreviewStep.tsx",
                    lineNumber: 125,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/layout/PreviewStep.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/layout/PreviewStep.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c = PreviewStep;
var _c;
__turbopack_context__.k.register(_c, "PreviewStep");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/charts/KPICards.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>KPICards
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// components/charts/KPICards.tsx
"use client";
;
function KPICards({ metrics, grade, percentile }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-2 md:grid-cols-4 gap-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "col-span-2 md:col-span-1 rounded-2xl p-6 relative overflow-hidden",
                style: {
                    background: grade.bgColor,
                    border: `1px solid ${grade.color}33`
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 opacity-10",
                        style: {
                            background: `radial-gradient(circle at top right, ${grade.color}, transparent)`
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/charts/KPICards.tsx",
                        lineNumber: 20,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-bold uppercase tracking-widest mb-2",
                        style: {
                            color: grade.color
                        },
                        children: "Overall SUS Score"
                    }, void 0, false, {
                        fileName: "[project]/components/charts/KPICards.tsx",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-6xl font-black font-mono leading-none mb-1 score-glow",
                        style: {
                            color: grade.color
                        },
                        children: metrics.mean.toFixed(1)
                    }, void 0, false, {
                        fileName: "[project]/components/charts/KPICards.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-semibold text-white/60 mt-2",
                        children: [
                            "Grade",
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-bold",
                                style: {
                                    color: grade.color
                                },
                                children: grade.label
                            }, void 0, false, {
                                fileName: "[project]/components/charts/KPICards.tsx",
                                lineNumber: 32,
                                columnNumber: 11
                            }, this),
                            " · ",
                            grade.desc
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/charts/KPICards.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-white/40 mt-1",
                        children: percentile
                    }, void 0, false, {
                        fileName: "[project]/components/charts/KPICards.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full rounded-full transition-all duration-700",
                            style: {
                                width: `${metrics.mean}%`,
                                background: grade.color
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/charts/KPICards.tsx",
                            lineNumber: 40,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/charts/KPICards.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between text-[9px] text-white/25 mt-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "0"
                            }, void 0, false, {
                                fileName: "[project]/components/charts/KPICards.tsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "68"
                            }, void 0, false, {
                                fileName: "[project]/components/charts/KPICards.tsx",
                                lineNumber: 46,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "100"
                            }, void 0, false, {
                                fileName: "[project]/components/charts/KPICards.tsx",
                                lineNumber: 46,
                                columnNumber: 40
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/charts/KPICards.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/charts/KPICards.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                icon: "📐",
                label: "Std. Deviation",
                value: metrics.stdDev.toFixed(1),
                sub: metrics.stdDev > 15 ? "High variability" : "Consistent scores",
                color: "#8b5cf6"
            }, void 0, false, {
                fileName: "[project]/components/charts/KPICards.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                icon: "👥",
                label: "Total Responses",
                value: String(metrics.total),
                sub: "Valid responses",
                color: "#06b6d4"
            }, void 0, false, {
                fileName: "[project]/components/charts/KPICards.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                icon: "📊",
                label: "Median Score",
                value: metrics.median.toFixed(1),
                sub: `vs mean ${metrics.mean.toFixed(1)}`,
                color: "#f59e0b"
            }, void 0, false, {
                fileName: "[project]/components/charts/KPICards.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/KPICards.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = KPICards;
function MetricCard({ icon, label, value, sub, color }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card p-5 relative overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-10",
                style: {
                    background: color
                }
            }, void 0, false, {
                fileName: "[project]/components/charts/KPICards.tsx",
                lineNumber: 87,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-2xl mb-3",
                children: icon
            }, void 0, false, {
                fileName: "[project]/components/charts/KPICards.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-3xl font-black font-mono leading-none",
                style: {
                    color
                },
                children: value
            }, void 0, false, {
                fileName: "[project]/components/charts/KPICards.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-white/50 font-medium mt-1.5",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/charts/KPICards.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[10px] text-white/30 mt-0.5",
                children: sub
            }, void 0, false, {
                fileName: "[project]/components/charts/KPICards.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/KPICards.tsx",
        lineNumber: 86,
        columnNumber: 5
    }, this);
}
_c1 = MetricCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "KPICards");
__turbopack_context__.k.register(_c1, "MetricCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/charts/DistributionChart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DistributionChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/BarChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Bar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Cell.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$LabelList$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/LabelList.js [app-client] (ecmascript)");
// components/charts/DistributionChart.tsx
"use client";
;
;
const CustomTooltip = ({ active, payload, label })=>{
    if (!active || !payload?.length) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-[#1e1e32] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-semibold text-white/80 mb-0.5",
                children: [
                    "Score range: ",
                    label
                ]
            }, void 0, true, {
                fileName: "[project]/components/charts/DistributionChart.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-white/50",
                children: [
                    payload[0].value,
                    " respondents"
                ]
            }, void 0, true, {
                fileName: "[project]/components/charts/DistributionChart.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/DistributionChart.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = CustomTooltip;
function DistributionChart({ distribution }) {
    const total = distribution.reduce((s, b)=>s + b.count, 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card p-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-xs font-bold uppercase tracking-widest text-white/40 mb-4",
                children: "SUS Score Distribution"
            }, void 0, false, {
                fileName: "[project]/components/charts/DistributionChart.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                width: "100%",
                height: 200,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"], {
                    data: distribution,
                    barCategoryGap: "18%",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                            strokeDasharray: "3 3",
                            stroke: "rgba(255,255,255,0.05)",
                            vertical: false
                        }, void 0, false, {
                            fileName: "[project]/components/charts/DistributionChart.tsx",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                            dataKey: "range",
                            tick: {
                                fill: "rgba(255,255,255,0.4)",
                                fontSize: 11
                            },
                            axisLine: false,
                            tickLine: false
                        }, void 0, false, {
                            fileName: "[project]/components/charts/DistributionChart.tsx",
                            lineNumber: 36,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {
                            tick: {
                                fill: "rgba(255,255,255,0.35)",
                                fontSize: 11
                            },
                            axisLine: false,
                            tickLine: false,
                            allowDecimals: false
                        }, void 0, false, {
                            fileName: "[project]/components/charts/DistributionChart.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                            content: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CustomTooltip, {}, void 0, false, {
                                fileName: "[project]/components/charts/DistributionChart.tsx",
                                lineNumber: 48,
                                columnNumber: 29
                            }, this),
                            cursor: {
                                fill: "rgba(255,255,255,0.03)"
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/charts/DistributionChart.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                            dataKey: "count",
                            radius: [
                                5,
                                5,
                                0,
                                0
                            ],
                            children: [
                                distribution.map((entry, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cell"], {
                                        fill: entry.color,
                                        fillOpacity: 0.85
                                    }, i, false, {
                                        fileName: "[project]/components/charts/DistributionChart.tsx",
                                        lineNumber: 51,
                                        columnNumber: 15
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$LabelList$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LabelList"], {
                                    dataKey: "count",
                                    position: "top",
                                    style: {
                                        fill: "rgba(255,255,255,0.35)",
                                        fontSize: 10
                                    },
                                    formatter: (v)=>v > 0 ? v : ""
                                }, void 0, false, {
                                    fileName: "[project]/components/charts/DistributionChart.tsx",
                                    lineNumber: 53,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/charts/DistributionChart.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/charts/DistributionChart.tsx",
                    lineNumber: 34,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/charts/DistributionChart.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mt-3 flex-wrap gap-1.5",
                children: distribution.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 text-[10px] text-white/40",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-2 h-2 rounded-sm inline-block",
                                style: {
                                    background: b.color
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/charts/DistributionChart.tsx",
                                lineNumber: 67,
                                columnNumber: 13
                            }, this),
                            b.range,
                            total > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white/25",
                                children: [
                                    "(",
                                    Math.round(b.count / total * 100),
                                    "%)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/charts/DistributionChart.tsx",
                                lineNumber: 70,
                                columnNumber: 15
                            }, this)
                        ]
                    }, b.range, true, {
                        fileName: "[project]/components/charts/DistributionChart.tsx",
                        lineNumber: 66,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/charts/DistributionChart.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/DistributionChart.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_c1 = DistributionChart;
var _c, _c1;
__turbopack_context__.k.register(_c, "CustomTooltip");
__turbopack_context__.k.register(_c1, "DistributionChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/charts/SegmentChart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SegmentChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/BarChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Bar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Cell.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$ReferenceLine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/ReferenceLine.js [app-client] (ecmascript)");
// components/charts/SegmentChart.tsx
"use client";
;
;
const CustomTooltip = ({ active, payload, label })=>{
    if (!active || !payload?.length) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-[#1e1e32] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-semibold text-white/80 mb-0.5",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/charts/SegmentChart.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    color: payload[0].fill
                },
                children: [
                    "SUS: ",
                    payload[0].value
                ]
            }, void 0, true, {
                fileName: "[project]/components/charts/SegmentChart.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-white/40",
                children: [
                    "n = ",
                    payload[0].payload.count
                ]
            }, void 0, true, {
                fileName: "[project]/components/charts/SegmentChart.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/SegmentChart.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = CustomTooltip;
const DEFAULT_COLORS = [
    "#6366f1",
    "#8b5cf6",
    "#06b6d4",
    "#10b981",
    "#f59e0b"
];
function SegmentChart({ data, title, colors = DEFAULT_COLORS, horizontal = true }) {
    if (!data.length) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "card p-5 flex items-center justify-center h-48",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-white/30 text-sm",
                children: "No segment data available"
            }, void 0, false, {
                fileName: "[project]/components/charts/SegmentChart.tsx",
                lineNumber: 34,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/charts/SegmentChart.tsx",
            lineNumber: 33,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card p-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-xs font-bold uppercase tracking-widest text-white/40 mb-4",
                children: title
            }, void 0, false, {
                fileName: "[project]/components/charts/SegmentChart.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                width: "100%",
                height: 200,
                children: horizontal ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"], {
                    data: data,
                    layout: "vertical",
                    barCategoryGap: "20%",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                            strokeDasharray: "3 3",
                            stroke: "rgba(255,255,255,0.05)",
                            horizontal: false
                        }, void 0, false, {
                            fileName: "[project]/components/charts/SegmentChart.tsx",
                            lineNumber: 46,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                            type: "number",
                            domain: [
                                0,
                                100
                            ],
                            tick: {
                                fill: "rgba(255,255,255,0.35)",
                                fontSize: 11
                            },
                            axisLine: false,
                            tickLine: false
                        }, void 0, false, {
                            fileName: "[project]/components/charts/SegmentChart.tsx",
                            lineNumber: 47,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {
                            type: "category",
                            dataKey: "name",
                            tick: {
                                fill: "rgba(255,255,255,0.6)",
                                fontSize: 12
                            },
                            axisLine: false,
                            tickLine: false,
                            width: 75
                        }, void 0, false, {
                            fileName: "[project]/components/charts/SegmentChart.tsx",
                            lineNumber: 52,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                            content: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CustomTooltip, {}, void 0, false, {
                                fileName: "[project]/components/charts/SegmentChart.tsx",
                                lineNumber: 57,
                                columnNumber: 31
                            }, this),
                            cursor: {
                                fill: "rgba(255,255,255,0.03)"
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/charts/SegmentChart.tsx",
                            lineNumber: 57,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$ReferenceLine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReferenceLine"], {
                            x: 68,
                            stroke: "rgba(245,158,11,0.4)",
                            strokeDasharray: "4 4"
                        }, void 0, false, {
                            fileName: "[project]/components/charts/SegmentChart.tsx",
                            lineNumber: 58,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                            dataKey: "value",
                            radius: [
                                0,
                                5,
                                5,
                                0
                            ],
                            children: data.map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cell"], {
                                    fill: colors[i % colors.length],
                                    fillOpacity: 0.85
                                }, i, false, {
                                    fileName: "[project]/components/charts/SegmentChart.tsx",
                                    lineNumber: 61,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/charts/SegmentChart.tsx",
                            lineNumber: 59,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/charts/SegmentChart.tsx",
                    lineNumber: 45,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"], {
                    data: data,
                    barCategoryGap: "30%",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                            strokeDasharray: "3 3",
                            stroke: "rgba(255,255,255,0.05)",
                            vertical: false
                        }, void 0, false, {
                            fileName: "[project]/components/charts/SegmentChart.tsx",
                            lineNumber: 67,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                            dataKey: "name",
                            tick: {
                                fill: "rgba(255,255,255,0.5)",
                                fontSize: 12
                            },
                            axisLine: false,
                            tickLine: false
                        }, void 0, false, {
                            fileName: "[project]/components/charts/SegmentChart.tsx",
                            lineNumber: 68,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {
                            domain: [
                                0,
                                100
                            ],
                            tick: {
                                fill: "rgba(255,255,255,0.35)",
                                fontSize: 11
                            },
                            axisLine: false,
                            tickLine: false
                        }, void 0, false, {
                            fileName: "[project]/components/charts/SegmentChart.tsx",
                            lineNumber: 73,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                            content: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CustomTooltip, {}, void 0, false, {
                                fileName: "[project]/components/charts/SegmentChart.tsx",
                                lineNumber: 78,
                                columnNumber: 31
                            }, this),
                            cursor: {
                                fill: "rgba(255,255,255,0.03)"
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/charts/SegmentChart.tsx",
                            lineNumber: 78,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$ReferenceLine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReferenceLine"], {
                            y: 68,
                            stroke: "rgba(245,158,11,0.4)",
                            strokeDasharray: "4 4",
                            label: {
                                value: "68 avg",
                                fill: "rgba(245,158,11,0.5)",
                                fontSize: 10
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/charts/SegmentChart.tsx",
                            lineNumber: 79,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                            dataKey: "value",
                            radius: [
                                5,
                                5,
                                0,
                                0
                            ],
                            children: data.map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cell"], {
                                    fill: colors[i % colors.length],
                                    fillOpacity: 0.85
                                }, i, false, {
                                    fileName: "[project]/components/charts/SegmentChart.tsx",
                                    lineNumber: 82,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/charts/SegmentChart.tsx",
                            lineNumber: 80,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/charts/SegmentChart.tsx",
                    lineNumber: 66,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/charts/SegmentChart.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-2 mt-3",
                children: data.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-1.5 text-[10px] text-white/50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-2 h-2 rounded-full",
                                style: {
                                    background: colors[i % colors.length]
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/charts/SegmentChart.tsx",
                                lineNumber: 93,
                                columnNumber: 13
                            }, this),
                            item.name,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white/30 font-mono",
                                children: item.value
                            }, void 0, false, {
                                fileName: "[project]/components/charts/SegmentChart.tsx",
                                lineNumber: 95,
                                columnNumber: 13
                            }, this)
                        ]
                    }, item.name, true, {
                        fileName: "[project]/components/charts/SegmentChart.tsx",
                        lineNumber: 92,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/charts/SegmentChart.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/SegmentChart.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
_c1 = SegmentChart;
var _c, _c1;
__turbopack_context__.k.register(_c, "CustomTooltip");
__turbopack_context__.k.register(_c1, "SegmentChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/charts/MonthTrendChart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MonthTrendChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/LineChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Line.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$ReferenceLine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/ReferenceLine.js [app-client] (ecmascript)");
// components/charts/MonthTrendChart.tsx
"use client";
;
;
const CustomTooltip = ({ active, payload, label })=>{
    if (!active || !payload?.length) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-[#1e1e32] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-semibold text-white/80 mb-0.5",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/charts/MonthTrendChart.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-indigo-300",
                children: [
                    "SUS: ",
                    payload[0].value
                ]
            }, void 0, true, {
                fileName: "[project]/components/charts/MonthTrendChart.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-white/40",
                children: [
                    "n = ",
                    payload[0].payload.count
                ]
            }, void 0, true, {
                fileName: "[project]/components/charts/MonthTrendChart.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/MonthTrendChart.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = CustomTooltip;
function MonthTrendChart({ data }) {
    if (data.length < 2) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "card p-5 flex items-center justify-center h-48",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-white/30 text-sm",
                children: "Need 2+ months for trend"
            }, void 0, false, {
                fileName: "[project]/components/charts/MonthTrendChart.tsx",
                lineNumber: 29,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/charts/MonthTrendChart.tsx",
            lineNumber: 28,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card p-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-xs font-bold uppercase tracking-widest text-white/40 mb-4",
                children: "Monthly SUS Trend"
            }, void 0, false, {
                fileName: "[project]/components/charts/MonthTrendChart.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                width: "100%",
                height: 200,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LineChart"], {
                    data: data,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                id: "lineGradient",
                                x1: "0",
                                y1: "0",
                                x2: "1",
                                y2: "0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                        offset: "0%",
                                        stopColor: "#6366f1"
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/MonthTrendChart.tsx",
                                        lineNumber: 44,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                        offset: "100%",
                                        stopColor: "#8b5cf6"
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/MonthTrendChart.tsx",
                                        lineNumber: 45,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/charts/MonthTrendChart.tsx",
                                lineNumber: 43,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/charts/MonthTrendChart.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                            strokeDasharray: "3 3",
                            stroke: "rgba(255,255,255,0.05)",
                            vertical: false
                        }, void 0, false, {
                            fileName: "[project]/components/charts/MonthTrendChart.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                            dataKey: "name",
                            tick: {
                                fill: "rgba(255,255,255,0.4)",
                                fontSize: 11
                            },
                            axisLine: false,
                            tickLine: false
                        }, void 0, false, {
                            fileName: "[project]/components/charts/MonthTrendChart.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {
                            domain: [
                                0,
                                100
                            ],
                            tick: {
                                fill: "rgba(255,255,255,0.35)",
                                fontSize: 11
                            },
                            axisLine: false,
                            tickLine: false
                        }, void 0, false, {
                            fileName: "[project]/components/charts/MonthTrendChart.tsx",
                            lineNumber: 54,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                            content: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CustomTooltip, {}, void 0, false, {
                                fileName: "[project]/components/charts/MonthTrendChart.tsx",
                                lineNumber: 59,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/charts/MonthTrendChart.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$ReferenceLine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReferenceLine"], {
                            y: 68,
                            stroke: "rgba(245,158,11,0.35)",
                            strokeDasharray: "4 4",
                            label: {
                                value: "avg 68",
                                fill: "rgba(245,158,11,0.45)",
                                fontSize: 10,
                                position: "right"
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/charts/MonthTrendChart.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                            type: "monotone",
                            dataKey: "value",
                            stroke: "url(#lineGradient)",
                            strokeWidth: 2.5,
                            dot: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CustomDot, {}, void 0, false, {
                                fileName: "[project]/components/charts/MonthTrendChart.tsx",
                                lineNumber: 71,
                                columnNumber: 18
                            }, this),
                            activeDot: {
                                r: 6,
                                fill: "#6366f1",
                                stroke: "#fff",
                                strokeWidth: 2
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/charts/MonthTrendChart.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/charts/MonthTrendChart.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/charts/MonthTrendChart.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/MonthTrendChart.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_c1 = MonthTrendChart;
function CustomDot(props) {
    const { cx, cy, value } = props;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
        cx: cx,
        cy: cy,
        r: 4,
        fill: "#6366f1",
        stroke: "rgba(255,255,255,0.3)",
        strokeWidth: 1.5
    }, void 0, false, {
        fileName: "[project]/components/charts/MonthTrendChart.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
_c2 = CustomDot;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "CustomTooltip");
__turbopack_context__.k.register(_c1, "MonthTrendChart");
__turbopack_context__.k.register(_c2, "CustomDot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/charts/QuestionAnalysis.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QuestionAnalysis
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$RadarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/RadarChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$PolarGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/polar/PolarGrid.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$PolarAngleAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/polar/PolarAngleAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$PolarRadiusAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/polar/PolarRadiusAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Radar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/polar/Radar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sus.ts [app-client] (ecmascript)");
// components/charts/QuestionAnalysis.tsx
"use client";
;
;
;
function QuestionAnalysis({ qAverages }) {
    const radarData = Object.entries(qAverages).map(([q, avg])=>({
            q,
            value: parseFloat(avg.toFixed(2)),
            fullMark: 5
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card p-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-xs font-bold uppercase tracking-widest text-white/40 mb-5",
                children: "Question-Level Analysis (Q1–Q10)"
            }, void 0, false, {
                fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: Object.entries(qAverages).map(([q, avg])=>{
                            const qNum = parseInt(q.slice(1));
                            const score = avg;
                            const normalized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeQScore"])(qNum, score);
                            const color = normalized >= 70 ? "#10b981" : normalized >= 50 ? "#f59e0b" : "#ef4444";
                            const polarity = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q_POLARITY"][q];
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-bold text-indigo-300 font-mono w-6",
                                                        children: q
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                                                        lineNumber: 42,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-white/50",
                                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q_LABELS"][q]
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                                                        lineNumber: 43,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[9px] text-white/25 border border-white/10 rounded px-1 py-0.5",
                                                        children: polarity === "positive" ? "▲ higher=better" : "▼ lower=better"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                                                        lineNumber: 44,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                                                lineNumber: 41,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs font-bold font-mono",
                                                style: {
                                                    color
                                                },
                                                children: score.toFixed(2)
                                            }, void 0, false, {
                                                fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                                                lineNumber: 48,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                                        lineNumber: 40,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-1.5 bg-white/[0.06] rounded-full overflow-hidden",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-full rounded-full transition-all duration-700",
                                            style: {
                                                width: `${normalized}%`,
                                                background: color
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                                            lineNumber: 53,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                                        lineNumber: 52,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between mt-0.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[9px] text-white/20",
                                                children: [
                                                    "Normalized: ",
                                                    normalized.toFixed(0),
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                                                lineNumber: 59,
                                                columnNumber: 19
                                            }, this),
                                            normalized < 50 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[9px] text-red-400/70",
                                                children: "⚠ Needs attention"
                                            }, void 0, false, {
                                                fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                                                lineNumber: 61,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                                        lineNumber: 58,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, q, true, {
                                fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                                lineNumber: 39,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                width: "100%",
                                height: 280,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$RadarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadarChart"], {
                                    data: radarData,
                                    cx: "50%",
                                    cy: "50%",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$PolarGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PolarGrid"], {
                                            stroke: "rgba(255,255,255,0.08)"
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                                            lineNumber: 73,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$PolarAngleAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PolarAngleAxis"], {
                                            dataKey: "q",
                                            tick: {
                                                fill: "rgba(255,255,255,0.45)",
                                                fontSize: 11,
                                                fontWeight: 600
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                                            lineNumber: 74,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$PolarRadiusAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PolarRadiusAxis"], {
                                            angle: 90,
                                            domain: [
                                                0,
                                                5
                                            ],
                                            tick: {
                                                fill: "rgba(255,255,255,0.25)",
                                                fontSize: 9
                                            },
                                            axisLine: false
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                                            lineNumber: 78,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Radar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Radar"], {
                                            name: "Avg Score",
                                            dataKey: "value",
                                            stroke: "#6366f1",
                                            fill: "#6366f1",
                                            fillOpacity: 0.2,
                                            strokeWidth: 2
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                                            lineNumber: 83,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                            contentStyle: {
                                                background: "#1e1e32",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                borderRadius: 10,
                                                fontSize: 12
                                            },
                                            formatter: (val, name, props)=>[
                                                    `${val} — ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Q_LABELS"][props.payload.q]}`,
                                                    "Avg Score"
                                                ]
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                                            lineNumber: 91,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                                    lineNumber: 72,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] text-white/25 text-center mt-1",
                                children: "Radar shows raw averages (1–5 scale)"
                            }, void 0, false, {
                                fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/charts/QuestionAnalysis.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/QuestionAnalysis.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_c = QuestionAnalysis;
var _c;
__turbopack_context__.k.register(_c, "QuestionAnalysis");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/charts/InsightsPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InsightsPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/cn.ts [app-client] (ecmascript)");
// components/charts/InsightsPanel.tsx
"use client";
;
;
const TYPE_CONFIG = {
    critical: {
        color: "#ef4444",
        bg: "rgba(239,68,68,0.07)",
        icon: "🔴",
        border: "rgba(239,68,68,0.3)"
    },
    warning: {
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.07)",
        icon: "🟡",
        border: "rgba(245,158,11,0.25)"
    },
    info: {
        color: "#06b6d4",
        bg: "rgba(6,182,212,0.07)",
        icon: "🔵",
        border: "rgba(6,182,212,0.25)"
    },
    success: {
        color: "#10b981",
        bg: "rgba(16,185,129,0.07)",
        icon: "✅",
        border: "rgba(16,185,129,0.25)"
    }
};
function InsightsPanel({ report, aiInsights, aiLoading, onFetchAI }) {
    const criticals = report.recommendations.filter((r)=>r.type === "critical");
    const warnings = report.recommendations.filter((r)=>r.type === "warning");
    const infos = report.recommendations.filter((r)=>r.type === "info");
    const successes = report.recommendations.filter((r)=>r.type === "success");
    const ordered = [
        ...criticals,
        ...warnings,
        ...infos,
        ...successes
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card p-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between flex-wrap gap-3 mb-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xs font-bold uppercase tracking-widest text-white/40",
                                children: "💡 Insights & Recommendations"
                            }, void 0, false, {
                                fileName: "[project]/components/charts/InsightsPanel.tsx",
                                lineNumber: 33,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-white/30 mt-1",
                                children: report.summary
                            }, void 0, false, {
                                fileName: "[project]/components/charts/InsightsPanel.tsx",
                                lineNumber: 36,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/charts/InsightsPanel.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    !aiInsights && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onFetchAI,
                        disabled: aiLoading,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200", aiLoading ? "bg-indigo-500/20 text-indigo-300/50 cursor-wait" : "bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:brightness-110 shadow-lg shadow-indigo-500/25"),
                        children: aiLoading ? "⏳ Generating AI Insights..." : "✨ Generate AI Insights"
                    }, void 0, false, {
                        fileName: "[project]/components/charts/InsightsPanel.tsx",
                        lineNumber: 39,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/charts/InsightsPanel.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-3 mb-5",
                children: ordered.map((rec, i)=>{
                    const cfg = TYPE_CONFIG[rec.type];
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl p-3.5",
                        style: {
                            background: cfg.bg,
                            border: `1px solid ${cfg.border}`
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start gap-2 mb-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm",
                                        children: cfg.icon
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/InsightsPanel.tsx",
                                        lineNumber: 65,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-bold uppercase tracking-wider",
                                                style: {
                                                    color: cfg.color
                                                },
                                                children: rec.category
                                            }, void 0, false, {
                                                fileName: "[project]/components/charts/InsightsPanel.tsx",
                                                lineNumber: 67,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-white/70 mt-0.5 leading-relaxed",
                                                children: rec.insight
                                            }, void 0, false, {
                                                fileName: "[project]/components/charts/InsightsPanel.tsx",
                                                lineNumber: 73,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/charts/InsightsPanel.tsx",
                                        lineNumber: 66,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/charts/InsightsPanel.tsx",
                                lineNumber: 64,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pl-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-white/45 leading-relaxed",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-white/30",
                                            children: "→ "
                                        }, void 0, false, {
                                            fileName: "[project]/components/charts/InsightsPanel.tsx",
                                            lineNumber: 78,
                                            columnNumber: 19
                                        }, this),
                                        rec.action
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/charts/InsightsPanel.tsx",
                                    lineNumber: 77,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/charts/InsightsPanel.tsx",
                                lineNumber: 76,
                                columnNumber: 15
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/components/charts/InsightsPanel.tsx",
                        lineNumber: 59,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/charts/InsightsPanel.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            aiInsights && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-indigo-400/20 bg-indigo-500/[0.06] p-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-base",
                                children: "✨"
                            }, void 0, false, {
                                fileName: "[project]/components/charts/InsightsPanel.tsx",
                                lineNumber: 90,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs font-bold uppercase tracking-widest text-indigo-300",
                                children: "AI-Generated Analysis"
                            }, void 0, false, {
                                fileName: "[project]/components/charts/InsightsPanel.tsx",
                                lineNumber: 91,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onFetchAI(),
                                disabled: aiLoading,
                                className: "ml-auto text-[10px] text-indigo-400/60 hover:text-indigo-300 transition-colors",
                                children: "↺ Regenerate"
                            }, void 0, false, {
                                fileName: "[project]/components/charts/InsightsPanel.tsx",
                                lineNumber: 94,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/charts/InsightsPanel.tsx",
                        lineNumber: 89,
                        columnNumber: 11
                    }, this),
                    aiInsights.executive_summary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-white/75 leading-relaxed mb-4 pb-4 border-b border-white/[0.07]",
                        children: String(aiInsights.executive_summary)
                    }, void 0, false, {
                        fileName: "[project]/components/charts/InsightsPanel.tsx",
                        lineNumber: 105,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-5",
                        children: [
                            Array.isArray(aiInsights.key_findings) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] font-bold uppercase tracking-wider text-white/35 mb-2.5",
                                        children: "Key Findings"
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/InsightsPanel.tsx",
                                        lineNumber: 114,
                                        columnNumber: 17
                                    }, this),
                                    aiInsights.key_findings.map((f, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-white/65 leading-relaxed mb-2 pl-3 border-l-2 border-indigo-400/30",
                                            children: f
                                        }, i, false, {
                                            fileName: "[project]/components/charts/InsightsPanel.tsx",
                                            lineNumber: 118,
                                            columnNumber: 19
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/charts/InsightsPanel.tsx",
                                lineNumber: 113,
                                columnNumber: 15
                            }, this),
                            Array.isArray(aiInsights.priority_actions) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] font-bold uppercase tracking-wider text-white/35 mb-2.5",
                                        children: "Priority Actions"
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/InsightsPanel.tsx",
                                        lineNumber: 131,
                                        columnNumber: 17
                                    }, this),
                                    aiInsights.priority_actions.map((a, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-white/65 leading-relaxed mb-2 pl-3 border-l-2 border-emerald-400/30",
                                            children: a
                                        }, i, false, {
                                            fileName: "[project]/components/charts/InsightsPanel.tsx",
                                            lineNumber: 135,
                                            columnNumber: 19
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/charts/InsightsPanel.tsx",
                                lineNumber: 130,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/charts/InsightsPanel.tsx",
                        lineNumber: 110,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/[0.07]",
                        children: [
                            Array.isArray(aiInsights.positive_highlights) && aiInsights.positive_highlights.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] font-bold uppercase tracking-wider text-emerald-400/60 mb-2",
                                        children: "✅ What's Working"
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/InsightsPanel.tsx",
                                        lineNumber: 150,
                                        columnNumber: 17
                                    }, this),
                                    aiInsights.positive_highlights.map((h, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-white/50 mb-1",
                                            children: h
                                        }, i, false, {
                                            fileName: "[project]/components/charts/InsightsPanel.tsx",
                                            lineNumber: 154,
                                            columnNumber: 19
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/charts/InsightsPanel.tsx",
                                lineNumber: 149,
                                columnNumber: 15
                            }, this),
                            aiInsights.benchmark_context && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-white/45 bg-white/[0.03] rounded-lg p-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] font-bold uppercase tracking-wider text-white/30 mb-1",
                                        children: "📊 Industry Benchmark"
                                    }, void 0, false, {
                                        fileName: "[project]/components/charts/InsightsPanel.tsx",
                                        lineNumber: 160,
                                        columnNumber: 17
                                    }, this),
                                    String(aiInsights.benchmark_context)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/charts/InsightsPanel.tsx",
                                lineNumber: 159,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/charts/InsightsPanel.tsx",
                        lineNumber: 147,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/charts/InsightsPanel.tsx",
                lineNumber: 88,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/charts/InsightsPanel.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_c = InsightsPanel;
var _c;
__turbopack_context__.k.register(_c, "InsightsPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/layout/DashboardStep.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardStep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sus.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$export$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/export.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$KPICards$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/charts/KPICards.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$DistributionChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/charts/DistributionChart.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$SegmentChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/charts/SegmentChart.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$MonthTrendChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/charts/MonthTrendChart.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$QuestionAnalysis$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/charts/QuestionAnalysis.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$InsightsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/charts/InsightsPanel.tsx [app-client] (ecmascript)");
// components/layout/DashboardStep.tsx
"use client";
;
;
;
;
;
;
;
;
;
function DashboardStep({ metrics, report, cleanedData, fileName, aiInsights, aiLoading, onSetAiInsights, onSetAiLoading, onBack, onReset }) {
    const grade = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSUSGrade"])(metrics.mean);
    const percentile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSUSPercentile"])(metrics.mean);
    const fetchAIInsights = async ()=>{
        onSetAiLoading(true);
        onSetAiInsights(null);
        try {
            const { recommendations } = report;
            const insightTexts = recommendations.map((r)=>r.insight).join("; ");
            const prompt = `You are a senior UX researcher analyzing System Usability Scale (SUS) survey results.

Survey Results Summary:
- Overall SUS Score: ${metrics.mean.toFixed(1)} / 100 (Grade: ${grade.label} — ${grade.desc})
- Standard Deviation: ${metrics.stdDev.toFixed(1)} (${metrics.stdDev > 15 ? "high variability" : "low variability"})
- Total Responses: ${metrics.total}
- Percentile: ${percentile}

Question Averages (1–5 scale):
${Object.entries(metrics.qAverages).map(([q, v])=>`  ${q}: ${v.toFixed(2)}`).join("\n")}

Segmented Scores:
  By Device: ${metrics.byDevice.map((d)=>`${d.name} = ${d.value} (n=${d.count})`).join(", ")}
  By User Type: ${metrics.byUserType.map((u)=>`${u.name} = ${u.value} (n=${u.count})`).join(", ")}

Rule-based insights already identified: ${insightTexts}

Provide a concise, expert analysis. Respond ONLY with a valid JSON object — no preamble, no markdown fences:
{
  "executive_summary": "2–3 sentences for stakeholders",
  "key_findings": ["finding 1", "finding 2", "finding 3"],
  "priority_actions": ["action 1 (impact: high)", "action 2 (impact: medium)", "action 3 (impact: medium)"],
  "benchmark_context": "How this score compares to industry SUS averages",
  "positive_highlights": ["what is working well 1", "what is working well 2"]
}`;
            const res = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 1000,
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                })
            });
            const data = await res.json();
            const raw = data.content?.find((b)=>b.type === "text")?.text ?? "{}";
            const clean = raw.replace(/```json|```/g, "").trim();
            onSetAiInsights(JSON.parse(clean));
        } catch (err) {
            console.error("AI insights error:", err);
            // Graceful fallback
            onSetAiInsights({
                executive_summary: report.summary,
                key_findings: report.recommendations.slice(0, 3).map((r)=>r.insight),
                priority_actions: report.recommendations.filter((r)=>r.type === "critical" || r.type === "warning").slice(0, 3).map((r)=>r.action),
                benchmark_context: `Industry SUS average is ~68. Your score of ${metrics.mean.toFixed(1)} is ${metrics.mean >= 68 ? "above" : "below"} average.`,
                positive_highlights: report.recommendations.filter((r)=>r.type === "success").map((r)=>r.insight)
            });
        }
        onSetAiLoading(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between flex-wrap gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold mb-0.5",
                                children: "Analytics Dashboard"
                            }, void 0, false, {
                                fileName: "[project]/components/layout/DashboardStep.tsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-white/40",
                                children: [
                                    fileName,
                                    " · ",
                                    metrics.total,
                                    " respondents analyzed"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/layout/DashboardStep.tsx",
                                lineNumber: 110,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/DashboardStep.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2.5 flex-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$export$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["exportToCSV"])(cleanedData, `sus_results_${Date.now()}.csv`),
                                className: "px-3 py-2 text-xs font-semibold border border-white/10 rounded-lg text-white/50 hover:text-white/70 hover:border-white/20 transition-all",
                                children: "↓ Export CSV"
                            }, void 0, false, {
                                fileName: "[project]/components/layout/DashboardStep.tsx",
                                lineNumber: 113,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onBack,
                                className: "px-3 py-2 text-sm text-white/50 border border-white/10 rounded-lg hover:border-white/20 transition-all",
                                children: "← Preview"
                            }, void 0, false, {
                                fileName: "[project]/components/layout/DashboardStep.tsx",
                                lineNumber: 119,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onReset,
                                className: "px-3 py-2 text-sm text-indigo-300 bg-indigo-500/15 border border-indigo-400/30 rounded-lg hover:border-indigo-400/50 transition-all",
                                children: "↑ New Upload"
                            }, void 0, false, {
                                fileName: "[project]/components/layout/DashboardStep.tsx",
                                lineNumber: 125,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/DashboardStep.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/DashboardStep.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$KPICards$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                metrics: metrics,
                grade: grade,
                percentile: percentile
            }, void 0, false, {
                fileName: "[project]/components/layout/DashboardStep.tsx",
                lineNumber: 135,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$DistributionChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        distribution: metrics.distribution
                    }, void 0, false, {
                        fileName: "[project]/components/layout/DashboardStep.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$SegmentChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        data: metrics.byDevice,
                        title: "SUS by Device",
                        colors: [
                            "#6366f1",
                            "#8b5cf6",
                            "#06b6d4",
                            "#10b981"
                        ]
                    }, void 0, false, {
                        fileName: "[project]/components/layout/DashboardStep.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/DashboardStep.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$SegmentChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        data: metrics.byUserType,
                        title: "New vs. Returning Users",
                        colors: [
                            "#8b5cf6",
                            "#06b6d4"
                        ],
                        horizontal: false
                    }, void 0, false, {
                        fileName: "[project]/components/layout/DashboardStep.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$MonthTrendChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        data: metrics.byMonth
                    }, void 0, false, {
                        fileName: "[project]/components/layout/DashboardStep.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/DashboardStep.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$QuestionAnalysis$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                qAverages: metrics.qAverages
            }, void 0, false, {
                fileName: "[project]/components/layout/DashboardStep.tsx",
                lineNumber: 150,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$charts$2f$InsightsPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                report: report,
                aiInsights: aiInsights,
                aiLoading: aiLoading,
                onFetchAI: fetchAIInsights
            }, void 0, false, {
                fileName: "[project]/components/layout/DashboardStep.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/layout/DashboardStep.tsx",
        lineNumber: 105,
        columnNumber: 5
    }, this);
}
_c = DashboardStep;
var _c;
__turbopack_context__.k.register(_c, "DashboardStep");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useAppStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/useAppStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/parser.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cleaner$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/cleaner.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/metrics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$recommendations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/recommendations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/demo.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$StepIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/StepIndicator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$UploadStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/UploadStep.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$MappingStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/MappingStep.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$PreviewStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/PreviewStep.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$DashboardStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/DashboardStep.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// app/page.tsx
"use client";
;
;
;
;
;
;
;
;
;
;
;
function HomePage() {
    _s();
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useAppStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])();
    const currentRows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useAppStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useAppStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectCurrentRows"]);
    const mappingComplete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useAppStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useAppStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectMappingComplete"]);
    // ─── Handlers ─────────────────────────────────────────────────────────────
    const handleFileUpload = async (file)=>{
        try {
            const sheets = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseFile"])(file);
            store.setFileData(file.name, sheets);
            // Auto-detect mapping from first sheet columns
            const cols = sheets[0]?.rows.length ? Object.keys(sheets[0].rows[0]) : [];
            const detected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["autoDetectMapping"])(cols);
            store.setMapping(detected);
            store.setStep("mapping");
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to parse file");
        }
    };
    const handleLoadDemo = ()=>{
        const rows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateDemoDataset"])();
        store.setFileData("demo_sus_survey.xlsx", [
            {
                name: "SUS Survey",
                rows
            }
        ]);
        store.setMapping(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEMO_COLUMN_MAPPING"]);
        store.setStep("mapping");
    };
    const handleProcess = ()=>{
        const rows = currentRows;
        const mapping = store.mapping;
        const { cleaned, errors } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cleaner$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cleanData"])(rows, mapping);
        const metrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computeMetrics"])(cleaned);
        const report = metrics ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$recommendations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateReport"])(metrics) : null;
        store.setProcessedData(cleaned, errors, metrics, report);
        store.setStep("preview");
    };
    const handleReset = ()=>store.reset();
    // ─── Step Guards ──────────────────────────────────────────────────────────
    const STEPS = [
        "upload",
        "mapping",
        "preview",
        "dashboard"
    ];
    const currentIndex = STEPS.indexOf(store.step);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen py-8 px-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-6xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "mb-10",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 mb-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30",
                                children: "📊"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 71,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-2xl font-black tracking-tight text-white",
                                        children: "SUS Analytics"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 75,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-white/40 font-semibold tracking-widest uppercase",
                                        children: "System Usability Scale · Insights Engine"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 78,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 74,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 70,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 69,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$StepIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    current: currentIndex
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 86,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-slide-up",
                    children: [
                        store.step === "upload" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$UploadStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            onFileUpload: handleFileUpload,
                            onLoadDemo: handleLoadDemo
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 91,
                            columnNumber: 13
                        }, this),
                        store.step === "mapping" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$MappingStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            fileName: store.fileName,
                            sheets: store.sheets,
                            selectedSheet: store.selectedSheet,
                            columns: store.columns,
                            mapping: store.mapping,
                            rawRowCount: currentRows.length,
                            mappingComplete: mappingComplete,
                            onSheetChange: store.setSelectedSheet,
                            onMappingChange: store.updateMappingField,
                            onBack: ()=>store.setStep("upload"),
                            onProcess: handleProcess
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 98,
                            columnNumber: 13
                        }, this),
                        store.step === "preview" && store.cleanedData.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$PreviewStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            cleanedData: store.cleanedData,
                            errors: store.processingErrors,
                            onBack: ()=>store.setStep("mapping"),
                            onContinue: ()=>store.setStep("dashboard")
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 114,
                            columnNumber: 13
                        }, this),
                        store.step === "dashboard" && store.metrics && store.report && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$DashboardStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            metrics: store.metrics,
                            report: store.report,
                            cleanedData: store.cleanedData,
                            fileName: store.fileName,
                            aiInsights: store.aiInsights,
                            aiLoading: store.aiLoading,
                            onSetAiInsights: store.setAiInsights,
                            onSetAiLoading: store.setAiLoading,
                            onBack: ()=>store.setStep("preview"),
                            onReset: handleReset
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 123,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 67,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_s(HomePage, "ssEUk2iyEFAnkGZ54D6Y17xrgVY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useAppStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useAppStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$useAppStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = HomePage;
var _c;
__turbopack_context__.k.register(_c, "HomePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_067xn5a._.js.map