"use client";

import Link from "next/link";
import { 
  Building2, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  HelpCircle, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Sparkles 
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function InstitutionDashboardPage() {
  const { activeRoleScope } = useAuth();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-indigo-400">AICTE ID: {activeRoleScope?.scopeId || "1-1029411"}</span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Academic Cycle: 2026-27</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {activeRoleScope?.scopeName || "National Institute of Technology, Surat"}
          </h1>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/portal/institution/upload"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-blue-500 transition"
          >
            <UploadCloud className="h-4 w-4" />
            Upload Student Batch (CSV/XLSX)
          </Link>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1 */}
        <div className="rounded-2xl glass-panel p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>SUBMITTED ROWS</span>
            <FileText className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">1,840</div>
          <div className="text-[11px] text-slate-400 mt-1">Batch v2.0 (Active)</div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl glass-panel p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>ACCEPTED / VALID</span>
            <CheckCircle2 className="h-4 w-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-teal-400 font-mono">1,812</div>
          <div className="text-[11px] text-teal-400/80 mt-1">98.5% First-Pass Rate</div>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl glass-panel p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>WITH WARNINGS</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">24</div>
          <div className="text-[11px] text-amber-400/80 mt-1">Non-critical Quota Notes</div>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl glass-panel p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>ERRORS / REJECTED</span>
            <XCircle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 font-mono">4</div>
          <div className="text-[11px] text-rose-400/80 mt-1">Needs Correction</div>
        </div>

        {/* Card 5: Quality Score */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 p-5">
          <div className="flex items-center justify-between text-indigo-300 text-xs font-mono mb-2">
            <span>DATA QUALITY SCORE</span>
            <Sparkles className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">94.8 <span className="text-xs text-indigo-300">/ 100</span></div>
          <div className="text-[11px] text-teal-400 mt-1 font-semibold">Top 8th Percentile (Region)</div>
        </div>
      </div>

      {/* Main Grid: Attention Items & Intake Fill Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Programme Fill vs Approved Intake */}
        <div className="lg:col-span-7 rounded-2xl glass-panel p-6 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Programme Enrolment vs Approved Intake</h3>
              <p className="text-xs text-slate-400">Strictly monitored under AICTE Approval Process Handbook (APH)</p>
            </div>
            <span className="text-xs font-mono text-teal-400 font-bold">Cycle 2026-27</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Programme 1 */}
            <div>
              <div className="flex justify-between items-center mb-1.5 font-medium">
                <span className="text-slate-200">B.Tech Computer Science & Engineering</span>
                <span className="text-slate-400 font-mono">
                  <strong className="text-white">180</strong> / 180 Intake (100% Full)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: "100%" }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Supernumerary: 9 TFW, 4 NRI</span>
                <span className="text-teal-400">Within Prescribed Limits</span>
              </div>
            </div>

            {/* Programme 2 */}
            <div>
              <div className="flex justify-between items-center mb-1.5 font-medium">
                <span className="text-slate-200">B.Tech Electronics & Communication Engineering</span>
                <span className="text-slate-400 font-mono">
                  <strong className="text-white">118</strong> / 120 Intake (98.3%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: "98.3%" }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>2 seats available</span>
                <span className="text-slate-400">Admission Open</span>
              </div>
            </div>

            {/* Programme 3 */}
            <div>
              <div className="flex justify-between items-center mb-1.5 font-medium">
                <span className="text-slate-200">B.Tech Artificial Intelligence & Data Science</span>
                <span className="text-slate-400 font-mono">
                  <strong className="text-white">60</strong> / 60 Intake (100% Full)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: "100%" }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Supernumerary: 3 TFW</span>
                <span className="text-teal-400">Verified</span>
              </div>
            </div>

            {/* Programme 4 */}
            <div>
              <div className="flex justify-between items-center mb-1.5 font-medium">
                <span className="text-slate-200">B.Tech Mechanical Engineering</span>
                <span className="text-slate-400 font-mono">
                  <strong className="text-white">54</strong> / 60 Intake (90%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: "90%" }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>6 seats available</span>
                <span className="text-slate-400">Admission Open</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Action Items & Clarifications */}
        <div className="lg:col-span-5 space-y-4">
          {/* Clarification Box */}
          <div className="rounded-2xl bg-amber-950/20 border border-amber-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                CLARIFICATION REQUIRED
              </span>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                SLA: 48h Remaining
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Notice #CR-2026-081 (Western Region)</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              &quot;Clarification requested on 4 student records uploaded with low-confidence APAAR name similarity scores. Please upload birth certificate or 10th marksheet proof.&quot;
            </p>
            <div className="mt-3">
              <Link
                href="/portal/institution/clarifications"
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-amber-200"
              >
                Submit Response & Document Evidence →
              </Link>
            </div>
          </div>

          {/* Automated Task Box */}
          <div className="rounded-2xl glass-panel p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-teal-400 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                AUTOMATED DISPATCH
              </span>
              <span className="text-[10px] text-slate-500 font-mono">10m ago</span>
            </div>
            <h4 className="text-sm font-bold text-white">1,812 Ed25519 Credentials Issued</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Enrolment records verified without human exceptions. Official digital QR certificates issued to students.
            </p>
            <div className="mt-3">
              <Link
                href="/portal/institution/credentials"
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300"
              >
                View Issued Credentials Registry →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

