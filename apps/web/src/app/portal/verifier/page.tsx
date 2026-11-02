"use client";

import { useState } from "react";
import { 
  Search, 
  QrCode, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Clock, 
  Download, 
  Lock, 
  Key, 
  FileCheck2,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function VerifierPortalPage() {
  const { activeRoleScope } = useAuth();
  const [tokenInput, setTokenInput] = useState("9041-8821-3419");
  const [purpose, setPurpose] = useState("Background verification for Software Engineering role");
  const [verificationState, setVerificationState] = useState<"IDLE" | "REQUESTED" | "APPROVED">("APPROVED");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-emerald-400">AUTHORIZED VERIFIER CONSOLE</span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Consent-Gated Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {activeRoleScope?.scopeName || "Tata Consultancy Services (Authorized Verifier)"}
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="rounded bg-emerald-500/10 px-3 py-1.5 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            DPDP Compliant Access
          </span>
        </div>
      </div>

      {/* Verify Input Box */}
      <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-5">
        <h3 className="text-lg font-bold text-white">Initiate Student Credential Verification</h3>
        <p className="text-xs text-slate-400">
          Enter candidate’s 12-digit APAAR ID or scan credential QR code. Under India’s DPDP Act 2023, the student receives an in-app verification prompt and approves requested fields.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Candidate APAAR ID / Token</label>
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-sm text-white font-mono focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-6">
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Stated Purpose of Verification</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => setVerificationState("APPROVED")}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-md shadow-emerald-600/30"
          >
            <Search className="h-4 w-4" />
            Verify Credential & Fetch Approved Record
          </button>
          <button
            onClick={() => alert("Launching camera scanner interface for printed certificate QR code...")}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
          >
            <QrCode className="h-4 w-4" />
            Scan Certificate QR Code
          </button>
        </div>
      </div>

      {/* Verified Record Result Card */}
      {verificationState === "APPROVED" && (
        <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                    STATUS: VERIFIED & APPROVED
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Consent Expiring in 29 Days</span>
                </div>
                <h3 className="text-xl font-bold text-white">Aryan Verma</h3>
              </div>
            </div>

            <button
              onClick={() => alert("Downloading cryptographic Ed25519 verification attestation proof...")}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 px-4 py-2 text-xs font-bold hover:bg-indigo-600/30 transition"
            >
              <Download className="h-4 w-4" />
              Download Signed Verification Attestation (PDF)
            </button>
          </div>

          {/* Approved Fields Only */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-3.5">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">INSTITUTION</span>
                <span className="text-slate-200 font-semibold">National Institute of Technology, Surat (AICTE 1-1029411)</span>
              </div>
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-3.5">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">PROGRAMME</span>
                <span className="text-slate-200 font-semibold">B.Tech Artificial Intelligence & Data Science</span>
              </div>
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-3.5">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">ACADEMIC YEAR & STATUS</span>
                <span className="text-slate-200 font-semibold">2026-27 • ACTIVE & VALIDATED</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-3.5">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">DATA MINIMIZATION NOTICE</span>
                <span className="text-slate-300 text-xs leading-relaxed block mt-1">
                  Student consented to share Academic Degree and Institution validity only. Date of Birth and Contact Phone remain hidden under DPDP minimization policy.
                </span>
              </div>
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-3.5">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">DIGITAL SIGNATURE (ED25519)</span>
                <span className="font-mono text-xs text-indigo-300 break-all block mt-1">
                  ed25519:6c8e3a2f91b0d7449c2e46b9a80e12f...b189ff4c
                </span>
                <span className="text-[10px] text-teal-400 font-mono mt-1 block">
                  Public Key verified: /.well-known/apaar-verify-keys.json
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

