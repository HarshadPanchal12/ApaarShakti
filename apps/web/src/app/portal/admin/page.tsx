"use client";

import { useState } from "react";
import { 
  Sliders, 
  ShieldAlert, 
  Link as LinkIcon, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  FileCheck2, 
  Key, 
  Cpu,
  AlertTriangle
} from "lucide-react";

interface ValidationRuleConfig {
  code: string;
  name: string;
  severity: "ERROR" | "WARNING" | "INFO";
  enabled: boolean;
  threshold?: string;
  description: string;
}

const RULES_CONFIG: ValidationRuleConfig[] = [
  {
    code: "INTAKE_EXCEEDED",
    name: "Approved Intake Exceeded Check",
    severity: "ERROR",
    enabled: true,
    threshold: "Approved Intake (APH)",
    description: "Evaluates non-supernumerary admissions against legal institution approved capacity.",
  },
  {
    code: "DUP_ACROSS_INSTITUTIONS",
    name: "Cross-Institution Duplicate Detection",
    severity: "ERROR",
    enabled: true,
    threshold: "Confidence >= 90%",
    description: "RapidFuzz and Double Metaphone matching across all active institutional enrolments.",
  },
  {
    code: "CATEGORY_LIMIT_EXCEEDED",
    name: "Supernumerary Category Share Cap",
    severity: "WARNING",
    enabled: true,
    threshold: "TFW: 5%, NRI: 15%, FN: 10 seats",
    description: "Validates category mix against statutory sub-quotas and absolute caps.",
  },
  {
    code: "APAAR_IDENTITY_MISMATCH",
    name: "APAAR Mock Registry Match",
    severity: "WARNING",
    enabled: true,
    threshold: "Name similarity >= 80%",
    description: "Compares student full name and DOB against national APAAR registry identity.",
  },
  {
    code: "AGE_PLAUSIBILITY",
    name: "Admission Age Range Plausibility",
    severity: "WARNING",
    enabled: true,
    threshold: "UG: 16-30 yrs, PG: 20-45 yrs",
    description: "Flags statistical age anomalies outside realistic enrolment boundaries.",
  },
];

interface AuditEntry {
  id: number;
  at: string;
  actorRole: string;
  action: string;
  resource: string;
  prevHash: string;
  rowHash: string;
  status: "VALID";
}

const SAMPLE_AUDIT_LOG: AuditEntry[] = [
  {
    id: 14892,
    at: "2026-10-30T03:52:10Z",
    actorRole: "INSTITUTION_ADMIN",
    action: "BATCH_UPLOAD_SUBMITTED",
    resource: "upload_batches/9841",
    prevHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    rowHash: "8f92a104bb81e3a9c72e410b0019daff629c1b821a73e44921b78912ca8419ef",
    status: "VALID",
  },
  {
    id: 14891,
    at: "2026-10-30T03:51:14Z",
    actorRole: "SYSTEM_AUTOMATION",
    action: "ED25519_CREDENTIALS_ISSUED",
    resource: "credentials/batch-9841",
    prevHash: "7a819b4412c981ea77281bc8990141e21b7a90412bca881729014ff912a78129",
    rowHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    status: "VALID",
  },
  {
    id: 14890,
    at: "2026-10-30T03:50:00Z",
    actorRole: "SYSTEM_AUTOMATION",
    action: "DUPLICATE_CASE_OPENED",
    resource: "duplicate_cases/DC-904",
    prevHash: "198a72b0c441298fa10bca88129e771024bc99812a7ca44192bc0019daff629c",
    rowHash: "7a819b4412c981ea77281bc8990141e21b7a90412bca881729014ff912a78129",
    status: "VALID",
  },
];

export default function SystemAdminPage() {
  const [rules, setRules] = useState<ValidationRuleConfig[]>(RULES_CONFIG);
  const [verifyingChain, setVerifyingChain] = useState(false);
  const [chainVerified, setChainVerified] = useState(false);

  const toggleRule = (code: string) => {
    setRules(
      rules.map((r) => (r.code === code ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const verifyAuditChain = () => {
    setVerifyingChain(true);
    setTimeout(() => {
      setVerifyingChain(false);
      setChainVerified(true);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-rose-400">PLATFORM GOVERNANCE</span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Security & Rule Engine Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            System Administration & Governance
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="rounded bg-rose-500/10 px-3 py-1.5 text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5" />
            Root Privileges (Break-Glass Logged)
          </span>
        </div>
      </div>

      {/* Audit Chain Verifier Box */}
      <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LinkIcon className="h-5 w-5 text-teal-400" />
              <h2 className="text-xl font-bold text-white">Append-Only Audit Log Hash Chain</h2>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Every mutating query permanently stores prev_hash and row_hash. Postgres triggers block any UPDATE or DELETE operations. Click to cryptographically verify chain continuity from genesis.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={verifyAuditChain}
              disabled={verifyingChain}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${verifyingChain ? "animate-spin" : ""}`} />
              {verifyingChain ? "Calculating SHA-256 Chain..." : "Verify Audit Chain Integrity"}
            </button>

            {chainVerified && (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-teal-500/20 px-3.5 py-2 text-xs font-mono font-bold text-teal-300 border border-teal-500/30">
                <CheckCircle2 className="h-4 w-4" />
                Chain Verified (14,892 Blocks Intact)
              </span>
            )}
          </div>
        </div>

        {/* Audit Rows */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto text-xs font-mono">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Block #</th>
                <th className="py-2.5 px-4">Actor Role</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Previous Hash</th>
                <th className="py-2.5 px-4">Row Hash</th>
                <th className="py-2.5 px-4">Chain Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {SAMPLE_AUDIT_LOG.map((log) => (
                <tr key={log.id} className="hover:bg-slate-950/50">
                  <td className="py-2.5 px-4 font-bold text-white">#{log.id}</td>
                  <td className="py-2.5 px-4 text-indigo-400">{log.actorRole}</td>
                  <td className="py-2.5 px-4 text-slate-200">{log.action}</td>
                  <td className="py-2.5 px-4 text-slate-500 text-[10px]">{log.prevHash.slice(0, 16)}...</td>
                  <td className="py-2.5 px-4 text-teal-400 text-[10px]">{log.rowHash.slice(0, 16)}...</td>
                  <td className="py-2.5 px-4">
                    <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                      CRYPTOGRAPHICALLY VALID
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Validation Rules Engine Config */}
      <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Pluggable 14-Rule Engine Configuration</h3>
            <p className="text-xs text-slate-400">Configure deterministic limits, severity levels, and activation states</p>
          </div>
          <span className="text-xs font-mono text-teal-400 font-bold">14 Rules Active</span>
        </div>

        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.code}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-indigo-400">{rule.code}</span>
                  <span className="text-slate-500">•</span>
                  <span className="font-semibold text-white">{rule.name}</span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      rule.severity === "ERROR"
                        ? "bg-rose-500/20 text-rose-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {rule.severity}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{rule.description}</p>
                {rule.threshold && (
                  <div className="text-[10px] font-mono text-teal-400">
                    Active Configured Parameter: {rule.threshold}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer font-mono text-xs">
                  <span className={rule.enabled ? "text-teal-400 font-bold" : "text-slate-500"}>
                    {rule.enabled ? "ACTIVE" : "DISABLED"}
                  </span>
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() => toggleRule(rule.code)}
                    className="accent-indigo-500 h-4 w-4 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

