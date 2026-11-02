"use client";

import { useState } from "react";
import { 
  Zap, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  RotateCcw,
  Sliders
} from "lucide-react";

interface AutomationRow {
  trigger: string;
  automatedAction: string;
  humanIntervention: string;
  sla: string;
  statusBadge: string;
}

const AUTOMATED_ACTIONS: AutomationRow[] = [
  {
    trigger: "File Uploaded / API Push",
    automatedAction: "Vectorized parsing → 14-rule evaluation → multi-institution dedupe → anomaly scoring → instant institution notification.",
    humanIntervention: "Zero. Fully autonomous in < 60s.",
    sla: "Instant (< 60s)",
    statusBadge: "100% AUTOMATED",
  },
  {
    trigger: "Batch Contains Violations",
    automatedAction: "Generates annotated error CSV with inline suggested fixes. Sets automated reminder schedule (T+2d, T+5d).",
    humanIntervention: "Institution fixes rows; officer not disturbed.",
    sla: "Instant generation",
    statusBadge: "100% AUTOMATED",
  },
  {
    trigger: "Admission Window Nearing Close",
    automatedAction: "Daily time-series forecast projects final enrolment from daily pace. Alerts institution and regional officer before cap is exceeded.",
    humanIntervention: "Officer only intervenes if early-warning projects over-intake.",
    sla: "Daily 02:00 AM job",
    statusBadge: "SCHEDULED ML",
  },
  {
    trigger: "High-Severity Anomaly Flag",
    automatedAction: "Auto-assigns flag to regional officer with lowest current active load. Generates clarification notice with SLA due date.",
    humanIntervention: "Officer reviews de-identified features & suggested resolution.",
    sla: "Realtime trigger",
    statusBadge: "AUTO-ASSIGNED",
  },
  {
    trigger: "Clarification Notice Overdue",
    automatedAction: "Escalation ladder triggers automatically: Regional Officer (L1) → National Officer (L2) → Senior Director (L3).",
    humanIntervention: "Automatic notification escalation without manual follow-up.",
    sla: "After 72 hrs",
    statusBadge: "AUTO-ESCALATION",
  },
  {
    trigger: "Cross-Institution Duplicate Found",
    automatedAction: "Freezes verification status of affected student in both institutions; generates joint case file with phonetic evidence.",
    humanIntervention: "Officers only confirm dismissal or cancel fraudulent admission.",
    sla: "Sub-second",
    statusBadge: "AUTO-FREEZE",
  },
  {
    trigger: "Enrolment Successfully Verified",
    automatedAction: "Asynchronously signs canonical enrolment JSON with Ed25519 private key. Emits QR code URL and updates verification status.",
    humanIntervention: "Zero. Automatic credential issuance.",
    sla: "Instant (< 50ms)",
    statusBadge: "CRYPTOGRAPHIC",
  },
  {
    trigger: "Third-Party Consent Expiry",
    automatedAction: "Revokes employer verification access immediately at 23:59:59. Notifies student via in-app timeline.",
    humanIntervention: "Zero. Enforced at API middleware layer.",
    sla: "Automated cron",
    statusBadge: "DPDP PRIVACY",
  },
];

export function SmartAutomationSection() {
  const [rowsCount, setRowsCount] = useState<number>(25000);
  const [minsPerRow, setMinsPerRow] = useState<number>(3);

  // Dynamic hours saved calculation
  const totalHours = Math.round((rowsCount * minsPerRow) / 60);

  return (
    <section id="automation" className="py-20 relative border-t border-slate-900 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-500/20 mb-3">
            <Zap className="h-3.5 w-3.5" />
            <span>Theme: Smart Automation in Action</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Humans Handle Exceptions. <span className="gradient-text">The Platform Does the Rest.</span>
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Every routine task—ingestion, validation, duplicate matching, anomaly scoring, escalation, report generation, and credential issuing—is executed autonomously.
          </p>
        </div>

        {/* Interactive Hours Saved Calculator Card */}
        <div className="mb-14 rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-400" />
                <h3 className="text-xl font-bold text-white">Smart Automation Hours Saved Estimator</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Before APAAR-Verify, checking a student record manually against approved intake, supernumerary quotas, and cross-state institutions took an estimated 2–5 minutes per student across multiple desk officers.
              </p>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
                    <span>Students Processed:</span>
                    <span className="text-white font-bold">{rowsCount.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="5000"
                    value={rowsCount}
                    onChange={(e) => setRowsCount(Number(e.target.value))}
                    className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
                    <span>Manual Time / Student:</span>
                    <span className="text-white font-bold">{minsPerRow} minutes</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={minsPerRow}
                    onChange={(e) => setMinsPerRow(Number(e.target.value))}
                    className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-xl bg-slate-900 border border-slate-800 p-6 text-center">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                ESTIMATED REGULATORY EFFORT SAVED
              </span>
              <div className="mt-2 text-4xl sm:text-5xl font-extrabold text-amber-400 font-mono">
                {totalHours.toLocaleString()} <span className="text-xl font-normal text-slate-400">hours</span>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Equivalent to ~{Math.round(totalHours / 160)} full-time regulatory desk officer months freed for high-priority policy and institution audits.
              </p>
            </div>
          </div>
        </div>

        {/* Automated Actions Table */}
        <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300">
              AUTONOMOUS ACTIONS REGISTRY (AUTOMATION_RUNS)
            </span>
            <span className="text-xs font-mono text-teal-400">Status: Active & Event-Driven</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">Event Trigger</th>
                  <th className="py-3.5 px-6">Automated Platform Action</th>
                  <th className="py-3.5 px-6">Human Role</th>
                  <th className="py-3.5 px-6">SLA Target</th>
                  <th className="py-3.5 px-6">Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {AUTOMATED_ACTIONS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition">
                    <td className="py-4 px-6 font-semibold text-white whitespace-nowrap">
                      {row.trigger}
                    </td>
                    <td className="py-4 px-6 text-slate-300 max-w-md leading-relaxed">
                      {row.automatedAction}
                    </td>
                    <td className="py-4 px-6 text-slate-400 whitespace-nowrap">
                      {row.humanIntervention}
                    </td>
                    <td className="py-4 px-6 font-mono text-indigo-300 whitespace-nowrap">
                      {row.sla}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded bg-teal-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-teal-300 border border-teal-500/30">
                        <Zap className="h-2.5 w-2.5" />
                        {row.statusBadge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

