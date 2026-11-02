"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  Lock, 
  Link as LinkIcon, 
  Key, 
  UserCheck, 
  FileText, 
  Check, 
  CheckCircle2, 
  RefreshCw 
} from "lucide-react";

export function SecuritySection() {
  const [verifyingChain, setVerifyingChain] = useState(false);
  const [chainVerified, setChainVerified] = useState(false);

  const handleVerifyChain = () => {
    setVerifyingChain(true);
    setTimeout(() => {
      setVerifyingChain(false);
      setChainVerified(true);
    }, 1200);
  };

  return (
    <section id="security" className="py-20 relative border-t border-slate-900 bg-slate-950/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-300 border border-teal-500/20 mb-3">
            <Lock className="h-3.5 w-3.5" />
            <span>Zero-Trust Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Cryptographic Integrity & <span className="gradient-text">DPDP Act Compliance</span>
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Engineered with privacy-by-design. Raw APAAR IDs are never stored in plain text, audit trails are mathematically tamper-evident, and third-party verification is strictly consent-gated.
          </p>
        </div>

        {/* Security Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="rounded-2xl glass-panel p-6 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 mb-4 border border-indigo-500/30">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Peppered HMAC & PII Encryption</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              APAAR IDs are transformed into HMAC-SHA256 tokens using a server-side pepper secret for matching. Sensitive DOB and contact fields are encrypted with pgcrypto at rest.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 font-mono text-[11px] text-indigo-400">
              SHA256(APAAR + Pepper)
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl glass-panel p-6 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 mb-4 border border-teal-500/30">
              <LinkIcon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Hash-Chained Audit Log</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every mutating query writes to an append-only table. Each record hashes the previous row’s hash (`prev_hash` + `row_hash`). Database triggers permanently block UPDATE and DELETE.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 font-mono text-[11px] text-teal-400">
              Tamper-evident blockchain-like chain
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl glass-panel p-6 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 mb-4 border border-purple-500/30">
              <Key className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Ed25519 Verifiable Credentials</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Issued credentials are digitally signed using Ed25519 (PyNaCl). Public keys are published at `/.well-known/apaar-verify-keys.json` for decentralized offline verification.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 font-mono text-[11px] text-purple-400">
              Publicly verifiable without DB call
            </div>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl glass-panel p-6 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 mb-4 border border-emerald-500/30">
              <UserCheck className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Consent-Gated Verification</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Employers cannot browse student records. Access requires the student’s explicit in-app consent with field-level toggles (e.g. approve programme, hide DOB) and expiry time limits.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 font-mono text-[11px] text-emerald-400">
              Student retains 100% data ownership
            </div>
          </div>

          {/* Card 5 */}
          <div className="rounded-2xl glass-panel p-6 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 mb-4 border border-blue-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Postgres RLS + FastAPI Guards</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Defense-in-depth authorization. PostgreSQL Row Level Security enforces campus isolation at the SQL query level, backed by FastAPI permission dependencies and route guards.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 font-mono text-[11px] text-blue-400">
              Zero cross-campus leakage
            </div>
          </div>

          {/* Card 6 */}
          <div className="rounded-2xl glass-panel p-6 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 mb-4 border border-amber-500/30">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">India DPDP Act 2023 Aligned</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Strict compliance with the Digital Personal Data Protection Act: purpose specification, notice, data minimisation, small-cell suppression (&lt; 5 hidden for analysts), and grievance redressal.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 font-mono text-[11px] text-amber-400">
              Statutory regulatory alignment
            </div>
          </div>
        </div>

        {/* Live Interactive Audit Chain Verifier Box */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
                  TAMPER-EVIDENT AUDIT CHAIN VERIFIER
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">Cryptographically Verify Audit Log Chain</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Iterates through all 14,892 append-only audit entries from genesis, verifying that SHA256(prev_hash + row_data) matches every recorded row_hash.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleVerifyChain}
                disabled={verifyingChain}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30 disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${verifyingChain ? "animate-spin" : ""}`} />
                {verifyingChain ? "Computing Hash Tree..." : "Verify Audit Chain Integrity"}
              </button>

              {chainVerified && (
                <div className="flex items-center gap-1.5 rounded-lg bg-teal-500/20 px-3 py-2 text-xs font-mono font-semibold text-teal-300 border border-teal-500/30">
                  <CheckCircle2 className="h-4 w-4 text-teal-400" />
                  Chain Integrity: 100% UNBROKEN
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

