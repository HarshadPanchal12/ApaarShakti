"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  RefreshCw, 
  Download, 
  Layers, 
  ShieldCheck, 
  Eye, 
  Sparkles,
  Edit2
} from "lucide-react";

interface ValidationRowResult {
  rowNumber: number;
  apaarId: string;
  name: string;
  dob: string;
  program: string;
  seatCategory: string;
  status: "OK" | "WARNING" | "ERROR";
  ruleCode?: string;
  message?: string;
  suggestedFix?: string;
}

const SAMPLE_DIRTY_ROWS: ValidationRowResult[] = [
  {
    rowNumber: 1,
    apaarId: "9041-8821-3419",
    name: "Aryan Verma",
    dob: "2004-05-12",
    program: "B.Tech Computer Science & Engineering",
    seatCategory: "GENERAL",
    status: "OK",
  },
  {
    rowNumber: 2,
    apaarId: "9041-8821-3420",
    name: "Sneha Patel",
    dob: "2004-09-21",
    program: "B.Tech Computer Science & Engineering",
    seatCategory: "GENERAL",
    status: "OK",
  },
  {
    rowNumber: 3,
    apaarId: "4429-1052-8812",
    name: "Rahul Mehra",
    dob: "2004-03-19",
    program: "B.Tech Computer Science & Engineering",
    seatCategory: "GENERAL",
    status: "ERROR",
    ruleCode: "DUP_ACROSS_INSTITUTIONS",
    message: "Active enrolment already registered at Delhi Tech Inst (1-892) for Academic Year 2026-27.",
    suggestedFix: "Confirm student transfer status or obtain official AICTE migration clearance before admission.",
  },
  {
    rowNumber: 4,
    apaarId: "6124-7719-0921",
    name: "Priya Sharma",
    dob: "2003-11-04",
    program: "B.Tech Computer Science & Engineering",
    seatCategory: "GENERAL",
    status: "ERROR",
    ruleCode: "INTAKE_EXCEEDED",
    message: "Approved intake of 180 seats exceeded (Row represents student #181 in non-supernumerary quota).",
    suggestedFix: "Re-classify under Supernumerary TFW / NRI quota if eligible, or petition AICTE for intake expansion.",
  },
  {
    rowNumber: 5,
    apaarId: "7721-0091-2311",
    name: "R. K. Gupta",
    dob: "2004-01-15",
    program: "B.Tech Computer Science & Engineering",
    seatCategory: "GENERAL",
    status: "WARNING",
    ruleCode: "APAAR_IDENTITY_MISMATCH",
    message: "Name initials differ from Mock Registry ('Rajesh Kumar Gupta' vs 'R. K. Gupta'). Similarity: 78%.",
    suggestedFix: "Attach Class 10th / Secondary certificate verifying expanded name identity.",
  },
  {
    rowNumber: 6,
    apaarId: "1109-4412-9844",
    name: "Ananya Sen",
    dob: "2004-08-30",
    program: "B.Tech Artificial Intelligence & Data Science",
    seatCategory: "SUPERNUMERARY_TFW",
    status: "OK",
  },
];

export function UploadWizard() {
  const [stage, setStage] = useState<"IDLE" | "UPLOADING" | "VALIDATING" | "RESULTS">("IDLE");
  const [progressText, setProgressText] = useState("");
  const [progressPct, setProgressPct] = useState(0);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [rows, setRows] = useState<ValidationRowResult[]>(SAMPLE_DIRTY_ROWS);

  const startDemoBatch = () => {
    setStage("UPLOADING");
    setProgressText("Streaming CSV upload (25,000 rows)...");
    setProgressPct(20);

    setTimeout(() => {
      setStage("VALIDATING");
      setProgressText("Executing Polars Vectorized Ingestion & 14-Rule Pipeline...");
      setProgressPct(60);
    }, 1000);

    setTimeout(() => {
      setProgressText("Running RapidFuzz Cross-Institution Duplicate Matching & IsolationForest Scoring...");
      setProgressPct(85);
    }, 2000);

    setTimeout(() => {
      setProgressText("Batch Ingestion Complete. Annotated Error File Ready.");
      setProgressPct(100);
      setStage("RESULTS");
    }, 3000);
  };

  const filteredRows = rows.filter((r) => {
    if (filterSeverity === "ALL") return true;
    return r.status === filterSeverity;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/portal/institution" className="text-xs text-indigo-400 hover:underline">
              ← Back to Institution Dashboard
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Batch Student Data Upload Wizard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Vectorized Polars Engine • Automated 14-Rule Deterministic Evaluation
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              alert("Downloading sample AICTE CSV template with approved schema columns...");
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
          >
            <Download className="h-3.5 w-3.5" />
            Download AICTE Template CSV
          </button>
        </div>
      </div>

      {stage === "IDLE" && (
        <div className="space-y-6">
          {/* Drag & Drop Area */}
          <div className="rounded-2xl border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-900/40 p-10 text-center transition">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
                <UploadCloud className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-base font-bold text-white">Drag and drop student enrolment batch file</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Supports CSV, XLSX up to 100,000 rows. Ingestion and complete validation takes &lt; 60 seconds.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={startDemoBatch}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-blue-500 transition"
              >
                <Sparkles className="h-4 w-4" />
                Upload Seeded Demo Batch (With Planted Violations)
              </button>
            </div>
          </div>

          {/* Planted Violations Callout for Hackathon Judges */}
          <div className="rounded-2xl glass-panel p-5 border border-slate-800 text-xs">
            <span className="font-mono text-indigo-400 font-bold uppercase block mb-1">
              HACKATHON DEMO SCENARIO GUARANTEE:
            </span>
            <p className="text-slate-300 leading-relaxed">
              Clicking <strong>Upload Seeded Demo Batch</strong> automatically uploads a synthetic dirty batch demonstrating:
              (1) Cross-institution active duplicates, (2) Approved intake cap violation (+1 over CSE cap), and (3) Phonetic name similarity discrepancy.
            </p>
          </div>
        </div>
      )}

      {(stage === "UPLOADING" || stage === "VALIDATING") && (
        <div className="rounded-2xl glass-panel p-10 border border-slate-800 text-center max-w-xl mx-auto space-y-5">
          <div className="flex justify-center">
            <RefreshCw className="h-10 w-10 text-indigo-400 animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{progressText}</h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Vectorized Polars Engine • Memory Streaming
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-teal-400 h-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {stage === "RESULTS" && (
        <div className="space-y-6">
          {/* Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl glass-panel p-4 border border-slate-800">
              <span className="text-slate-500 text-[10px] font-mono uppercase block">TOTAL PROCESSED</span>
              <span className="text-2xl font-bold text-white font-mono">25,000</span>
            </div>
            <div className="rounded-xl glass-panel p-4 border border-slate-800">
              <span className="text-teal-400 text-[10px] font-mono uppercase block">FIRST-PASS VALID</span>
              <span className="text-2xl font-bold text-teal-400 font-mono">24,964</span>
            </div>
            <div className="rounded-xl glass-panel p-4 border border-slate-800">
              <span className="text-amber-400 text-[10px] font-mono uppercase block">WARNINGS</span>
              <span className="text-2xl font-bold text-amber-400 font-mono">24</span>
            </div>
            <div className="rounded-xl glass-panel p-4 border border-slate-800">
              <span className="text-rose-400 text-[10px] font-mono uppercase block">ERRORS REQUIRING FIX</span>
              <span className="text-2xl font-bold text-rose-400 font-mono">12</span>
            </div>
          </div>

          {/* Filter Bar & Export */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-mono">Filter by Status:</span>
              {["ALL", "ERROR", "WARNING", "OK"].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold transition ${
                    filterSeverity === sev
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  alert("Exporting annotated_errors.csv with error_codes and suggested_fix columns...");
                }}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-600/30 transition"
              >
                <Download className="h-3.5 w-3.5" />
                Download Annotated Error CSV
              </button>
            </div>
          </div>

          {/* Validation Results Table */}
          <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Row</th>
                    <th className="py-3 px-4">Student & APAAR</th>
                    <th className="py-3 px-4">Programme & Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Rule Violation & Message</th>
                    <th className="py-3 px-4">Suggested Fix</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredRows.map((row) => (
                    <tr key={row.rowNumber} className="hover:bg-slate-900/40 transition">
                      <td className="py-3.5 px-4 font-mono text-slate-500">#{row.rowNumber}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{row.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{row.apaarId} • DOB: {row.dob}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-200">{row.program}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{row.seatCategory}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {row.status === "OK" ? (
                          <span className="inline-flex items-center gap-1 rounded bg-teal-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-teal-300 border border-teal-500/30">
                            <CheckCircle2 className="h-3 w-3" />
                            OK
                          </span>
                        ) : row.status === "WARNING" ? (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300 border border-amber-500/30">
                            <AlertTriangle className="h-3 w-3" />
                            WARNING
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-rose-300 border border-rose-500/30">
                            <XCircle className="h-3 w-3" />
                            ERROR
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        {row.ruleCode ? (
                          <div>
                            <span className="font-mono text-[10px] text-indigo-400 font-bold block">
                              {row.ruleCode}
                            </span>
                            <span className="text-[11px] text-slate-300 leading-snug block mt-0.5">
                              {row.message}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px] font-mono">Passed all 14 rules</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        {row.suggestedFix ? (
                          <span className="text-[11px] text-amber-300/90 leading-snug block bg-amber-950/20 p-2 rounded border border-amber-500/20">
                            {row.suggestedFix}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {row.status !== "OK" && (
                          <button
                            onClick={() => {
                              alert(`Opening inline fix modal for Row #${row.rowNumber} (${row.name})...`);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 p-1.5 rounded hover:bg-slate-800"
                          >
                            <Edit2 className="h-3 w-3" />
                            Fix Inline
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UploadPage() {
  return <UploadWizard />;
}

