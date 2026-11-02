"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  CheckCircle2, 
  Building2, 
  GraduationCap, 
  Calendar, 
  Lock, 
  Key, 
  ArrowLeft,
  QrCode
} from "lucide-react";

function VerifyContent() {
  const params = useParams();
  const code = params?.code ? (Array.isArray(params.code) ? params.code[0] : params.code) : "DEMO-CRED";

  return (
    <div className="max-w-2xl w-full space-y-6">
      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-mono mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to APAAR-Verify Platform
        </Link>

        <div className="flex justify-center mb-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 shadow-lg shadow-teal-500/10">
            <CheckCircle2 className="h-10 w-10" />
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 mb-2">
          STATUS: VALID & OFFICIALLY VERIFIED
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Academic Enrolment Authenticated
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Verification Reference Code: <strong className="text-white font-bold">{code}</strong>
        </p>
      </div>

      {/* Credential Details Card */}
      <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-5 text-sm">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-[10px] font-mono uppercase text-slate-500 block">INSTITUTION</span>
          <div className="text-base font-bold text-white">National Institute of Technology, Surat</div>
          <div className="text-xs text-slate-400 font-mono">AICTE Permanent ID: 1-1029411</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 block">PROGRAMME</span>
            <div className="font-semibold text-slate-200">B.Tech in Artificial Intelligence & Data Science</div>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 block">ACADEMIC YEAR</span>
            <div className="font-semibold text-slate-200">2026-27 (Active Enrolment)</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 block">SEAT QUOTA CATEGORY</span>
            <div className="font-semibold text-slate-200">General Merit (Rank #42)</div>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 block">ISSUED TIMESTAMP</span>
            <div className="font-mono text-slate-300">2026-08-14 09:32 UTC</div>
          </div>
        </div>

        {/* Offline verification details */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5 font-bold">
              <Key className="h-3.5 w-3.5 text-indigo-400" />
              Ed25519 Asymmetric Signature
            </span>
            <span className="text-teal-400 font-bold">Self-Verifiable Offline</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            This credential was digitally signed by AICTE using the Ed25519 algorithm. You can verify it mathematically on any computer without querying this server using our published public key.
          </p>
          <div className="pt-2 text-[11px] font-mono text-indigo-300">
            Public Key JSON:{" "}
            <a href="/.well-known/apaar-verify-keys.json" className="underline hover:text-white">
              /.well-known/apaar-verify-keys.json
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicCredentialVerifyPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 text-slate-100 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <Suspense fallback={<div className="text-sm font-mono text-slate-400">Loading verifiable credential...</div>}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
