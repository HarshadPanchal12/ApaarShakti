"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Sparkles, 
  FileCheck2, 
  AlertTriangle,
  QrCode
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 shadow-inner backdrop-blur-md mb-6 animate-pulse">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Problem Statement SIH26263 • AICTE National Education Regulator</span>
            <span className="hidden sm:inline-block text-slate-500">•</span>
            <span className="hidden sm:inline-block text-teal-400 font-semibold">Theme: Smart Automation</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Autonomous Student Data Integrity &{" "}
            <span className="gradient-text">Instant APAAR Verification</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            AICTE currently receives only statistical totals. <strong className="text-white">APAAR-Verify</strong> automates student-level validation keyed by national APAAR ID—flagging cross-institution ghost enrolments, detecting intake cap tampering with IsolationForest ML, and issuing Ed25519 cryptographic credentials.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#verify"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition"
            >
              <QrCode className="h-4 w-4" />
              Live Verification Sandbox
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="#pipeline"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition"
            >
              <Zap className="h-4 w-4 text-amber-400" />
              View 5-Stage Automation Pipeline
            </Link>
          </div>

          {/* Automation Rule Mantra */}
          <p className="mt-4 text-xs text-slate-400">
            Automates 100% of routine ingestion, duplicate checking, and credential signing. Humans handle <span className="text-indigo-400 font-medium">exceptions only</span>.
          </p>
        </div>

        {/* Live System Preview Card */}
        <div className="mt-14 relative mx-auto max-w-5xl rounded-2xl glass-panel p-4 sm:p-6 shadow-2xl border border-slate-800">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-4 mb-4 gap-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono font-semibold text-slate-300">LIVE AUTOMATION ENGINE STATUS</span>
              <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-mono text-indigo-300 border border-indigo-500/30">
                100,000 rows &lt; 60s
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Academic Cycle: 2026-27</span>
              <span>•</span>
              <span className="text-emerald-400">Ed25519 Active</span>
            </div>
          </div>

          {/* Synthetic live detection ticker */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Metric 1 */}
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Cross-Institution Ghosts</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                  <AlertTriangle className="h-3 w-3" />
                  Auto-Frozen
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-white font-mono">34 Cases</div>
              <p className="mt-1 text-xs text-slate-400">
                Identified across 18 regional institutions using RapidFuzz & phonetic matching.
              </p>
            </div>

            {/* Metric 2 */}
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Approved Intake Compliance</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-white font-mono">99.4% Valid</div>
              <p className="mt-1 text-xs text-slate-400">
                14-Rule engine evaluated against AICTE Approval Process Handbook standards.
              </p>
            </div>

            {/* Metric 3 */}
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Smart Automation Impact</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                  <Zap className="h-3 w-3" />
                  Hours Saved
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-indigo-400 font-mono">142,320 hrs</div>
              <p className="mt-1 text-xs text-slate-400">
                Calculated dynamically from automated first-pass validation without human triage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

