"use client";

import { useState } from "react";
import { 
  Zap, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  Cpu, 
  RotateCcw,
  Sparkles,
  Sliders,
  FileCheck2,
  Calendar
} from "lucide-react";

interface AutomationLog {
  id: string;
  trigger: string;
  task: string;
  startedAt: string;
  durationMs: number;
  status: "SUCCESS" | "ESCALATED" | "TRIGGERED";
  summary: string;
  hoursSaved: number;
}

const AUTOMATION_LOGS: AutomationLog[] = [
  {
    id: "RUN-9841",
    trigger: "BATCH_UPLOAD_RECEIVED",
    task: "Vectorized 14-Rule Evaluation & Ingestion",
    startedAt: "2026-10-30T03:52:10Z",
    durationMs: 420,
    status: "SUCCESS",
    summary: "Evaluated 25,000 rows across 14 rules. 24,964 approved, 12 errors annotated with fixes.",
    hoursSaved: 1250,
  },
  {
    id: "RUN-9840",
    trigger: "STUDENT_VERIFICATION_COMPLETE",
    task: "Ed25519 Cryptographic Signer & QR Dispatch",
    startedAt: "2026-10-30T03:51:14Z",
    durationMs: 48,
    status: "SUCCESS",
    summary: "Asynchronously signed 1,812 student credential records. Public verification links active.",
    hoursSaved: 151,
  },
  {
    id: "RUN-9839",
    trigger: "CROSS_INSTITUTION_SCAN",
    task: "Multi-Institution RapidFuzz Deduplication Scan",
    startedAt: "2026-10-30T03:50:00Z",
    durationMs: 890,
    status: "TRIGGERED",
    summary: "Caught 1 new duplicate enrolment conflict between Inst 1-892 and 1-441. Enrolments frozen.",
    hoursSaved: 40,
  },
  {
    id: "RUN-9838",
    trigger: "SLA_TIMER_EXPIRED",
    task: "Escalation Ladder Trigger (Level 1 → Level 2)",
    startedAt: "2026-10-30T03:00:00Z",
    durationMs: 110,
    status: "ESCALATED",
    summary: "Institution 1-48291 clarification notice overdue > 48h. Automatically escalated to National Officer.",
    hoursSaved: 12,
  },
  {
    id: "RUN-9837",
    trigger: "NIGHTLY_SCHEDULED_CRON",
    task: "IsolationForest Longitudinal Anomaly Scorer",
    startedAt: "2026-10-30T02:00:00Z",
    durationMs: 3420,
    status: "SUCCESS",
    summary: "Scored 3,847 institutions against 3-year history. 7 new anomaly flags synthesized with plain-text summaries.",
    hoursSaved: 640,
  },
];

export default function AutomationCenterPage() {
  const [minsPerRow, setMinsPerRow] = useState(3);
  const totalStudents = 284650;
  const calculatedHours = Math.round((totalStudents * minsPerRow) / 60);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-amber-400">SIH26263 CORE THEME</span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Autonomous Regulatory Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Smart Automation Center
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="rounded bg-emerald-500/10 px-3 py-1.5 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            Autonomous Execution Engine: 100% OPERATIONAL
          </span>
        </div>
      </div>

      {/* Hero Metric Banner: Hours Saved */}
      <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                142,320+ Regulatory Hours Saved
              </h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              By replacing manual paper-checking and desk cross-referencing with vectorized Polars validation, RapidFuzz deduplication, and automated Ed25519 credential signing, APAAR-Verify automates all routine work. Humans intervene exclusively on high-confidence exceptions.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">ESTIMATE ASSUMPTION</span>
                <span className="text-white font-mono font-bold">{minsPerRow} mins / manual student verification</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">STUDENTS VALIDATED</span>
                <span className="text-white font-mono font-bold">284,650 students</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">FULL-TIME OFFICER MONTHS FREED</span>
                <span className="text-amber-400 font-mono font-bold">~889 officer months</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-xl bg-slate-900 border border-slate-800 p-5 text-center">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
              ESTIMATED MAN-HOURS SAVED
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-amber-400 font-mono">
              {calculatedHours.toLocaleString()}
            </div>
            <span className="text-xs text-slate-400 block mt-1">Autonomous hours saved to date</span>
          </div>
        </div>
      </div>

      {/* Automation Telemetry & Funnel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl glass-panel p-4 border border-slate-800">
          <span className="text-slate-500 text-[10px] font-mono uppercase block">TOTAL AUTOMATION RUNS</span>
          <span className="text-2xl font-bold text-white font-mono">14,892</span>
          <span className="text-[11px] text-teal-400 block mt-1">99.98% Success Rate</span>
        </div>
        <div className="rounded-xl glass-panel p-4 border border-slate-800">
          <span className="text-slate-500 text-[10px] font-mono uppercase block">FIRST-PASS AUTO DISPATCH</span>
          <span className="text-2xl font-bold text-teal-400 font-mono">98.5%</span>
          <span className="text-[11px] text-slate-400 block mt-1">No human needed</span>
        </div>
        <div className="rounded-xl glass-panel p-4 border border-slate-800">
          <span className="text-slate-500 text-[10px] font-mono uppercase block">AUTO-ESCALATED NOTICES</span>
          <span className="text-2xl font-bold text-amber-400 font-mono">4</span>
          <span className="text-[11px] text-amber-400/80 block mt-1">Level 2 triggered by SLA</span>
        </div>
        <div className="rounded-xl glass-panel p-4 border border-slate-800">
          <span className="text-slate-500 text-[10px] font-mono uppercase block">ED25519 CREDENTIALS ISSUED</span>
          <span className="text-2xl font-bold text-indigo-400 font-mono">241,880</span>
          <span className="text-[11px] text-slate-400 block mt-1">Signed via PyNaCl</span>
        </div>
      </div>

      {/* Live Automation Execution Timeline (automation_runs) */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-white">
            RECENT AUTONOMOUS EXECUTION RUNS (AUTOMATION_RUNS TABLE)
          </span>
          <span className="text-xs font-mono text-emerald-400">Telemetry: Streaming</span>
        </div>

        <div className="divide-y divide-slate-800/80 text-xs">
          {AUTOMATION_LOGS.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-900/40 transition">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-indigo-400 font-bold">{log.id}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-white font-semibold">{log.task}</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-slate-400">{log.startedAt.split("T")[1].replace("Z", "")} UTC</span>
                  <span className="text-teal-400">{log.durationMs}ms</span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold ${
                      log.status === "SUCCESS"
                        ? "bg-teal-500/20 text-teal-300"
                        : log.status === "ESCALATED"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-purple-500/20 text-purple-300"
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">{log.summary}</p>
              <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-amber-400">
                <Clock className="h-3 w-3" />
                <span>Regulatory Effort Saved in this run: ~{log.hoursSaved} man-hours</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

