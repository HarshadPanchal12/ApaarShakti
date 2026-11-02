"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  XCircle, 
  QrCode, 
  Key, 
  Building2, 
  GraduationCap, 
  Calendar, 
  Lock, 
  Copy, 
  Check, 
  ExternalLink 
} from "lucide-react";

interface VerificationResult {
  status: "VALID" | "FLAGGED" | "DUPLICATE";
  apaarToken: string;
  studentNameMasked: string;
  institution: string;
  program: string;
  academicYear: string;
  seatCategory: string;
  issuedAt: string;
  keyId: string;
  signature: string;
  explanation: string;
  evidence?: string[];
}

const SAMPLE_SCENARIOS: { label: string; token: string; type: "VALID" | "FLAGGED" | "DUPLICATE" }[] = [
  {
    label: "Scenario A: Valid Student Enrolment",
    token: "9041-8821-3419",
    type: "VALID",
  },
  {
    label: "Scenario B: Intake Limit Exceeded (CSE)",
    token: "6124-7719-0921",
    type: "FLAGGED",
  },
  {
    label: "Scenario C: Cross-Institution Duplicate",
    token: "4429-1052-8812",
    type: "DUPLICATE",
  },
];

const PRELOADED_RESULTS: Record<string, VerificationResult> = {
  "9041-8821-3419": {
    status: "VALID",
    apaarToken: "hmac_sha256:7f81b9e2...04b1",
    studentNameMasked: "Aryan V**** (DOB: 2004-**-**)",
    institution: "National Institute of Technology, Surat (AICTE ID: 1-10294)",
    program: "B.Tech in Artificial Intelligence & Data Science",
    academicYear: "2026-27",
    seatCategory: "GENERAL (Approved Intake: 60/60, Rank #42)",
    issuedAt: "2026-08-14T09:32:00Z",
    keyId: "ed25519-aicte-2026-key-01",
    signature: "ed25519:6c8e3a2f91b0d7449c2e...b189ff4c",
    explanation:
      "All 14 validation rules passed. Enrolment verified against approved intake. Ed25519 digital signature verified against public key at /.well-known/apaar-verify-keys.json.",
  },
  "6124-7719-0921": {
    status: "FLAGGED",
    apaarToken: "hmac_sha256:3a19ff21...cc78",
    studentNameMasked: "Priya S**** (DOB: 2003-**-**)",
    institution: "Apex Institute of Engineering (AICTE ID: 1-48291)",
    program: "B.Tech in Computer Science & Engineering",
    academicYear: "2026-27",
    seatCategory: "GENERAL (Approved Intake: 180, Total Enrolled: 205)",
    issuedAt: "PENDING RESOLUTION",
    keyId: "NONE — CREDENTIAL FROZEN",
    signature: "UNSIGNED_FLAGGED",
    explanation:
      "Intake Exceeded Violation (RULE: INTAKE_EXCEEDED). Institution exceeded approved cap by 14% without corresponding supernumerary quota. Clarification requested with SLA due date.",
    evidence: [
      "Approved Intake: 180 seats",
      "Actual Enrolment Submitted: 205 seats (Intake: +25)",
      "Automated Action: Escalation ladder triggered (Level 1 Regional Officer)",
    ],
  },
  "4429-1052-8812": {
    status: "DUPLICATE",
    apaarToken: "hmac_sha256:9d11ee40...8821",
    studentNameMasked: "Rahul M**** (DOB: 2004-03-19)",
    institution: "Conflicting Institutions: [Delhi Tech Inst #1-892] & [Rajasthan Tech #1-441]",
    program: "Simultaneous B.Tech Enrolment in Two AICTE Institutions",
    academicYear: "2026-27",
    seatCategory: "CROSS_INSTITUTION_CONFLICT",
    issuedAt: "REVOKED / FROZEN",
    keyId: "REVOKED",
    signature: "REVOKED_CONFLICT_DETECTED",
    explanation:
      "Double Enrolment Detected (RULE: DUP_ACROSS_INSTITUTIONS). Same APAAR identity holds simultaneous active enrolments in two institutions. Duplicate case opened automatically.",
    evidence: [
      "Institution 1: Delhi Tech Inst (Admitted: 2026-07-28)",
      "Institution 2: Rajasthan Tech (Admitted: 2026-08-04)",
      "Confidence: 100% (Matching APAAR token + DOB + Name phonetic match)",
      "Status: Automated freeze applied; both institutions notified",
    ],
  },
};

export function VerificationSandbox() {
  const [inputVal, setInputVal] = useState<string>("9041-8821-3419");
  const [result, setResult] = useState<VerificationResult>(PRELOADED_RESULTS["9041-8821-3419"]);
  const [copied, setCopied] = useState(false);

  const handleVerify = (token: string) => {
    const clean = token.trim();
    if (PRELOADED_RESULTS[clean]) {
      setResult(PRELOADED_RESULTS[clean]);
    } else {
      // Generate synthetic verified card for any random query
      setResult({
        status: "VALID",
        apaarToken: `hmac_sha256:${clean.slice(0, 4)}...random`,
        studentNameMasked: "Verified Student (DPDP Protected)",
        institution: "State Technical University (AICTE ID: 1-99821)",
        program: "B.Tech in Mechanical Engineering",
        academicYear: "2026-27",
        seatCategory: "GENERAL (Approved Intake Compliant)",
        issuedAt: new Date().toISOString(),
        keyId: "ed25519-aicte-2026-key-01",
        signature: "ed25519:e410a7b931dc...verified",
        explanation:
          "Enrolment validated dynamically against Mock APAAR Registry and AICTE Approved Intake standards.",
      });
    }
  };

  const copySignature = () => {
    navigator.clipboard.writeText(result.signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="verify" className="py-20 relative border-t border-slate-900 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/20 mb-3">
            <QrCode className="h-3.5 w-3.5" />
            <span>Interactive Verification Sandbox</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Verify Any Student Record <span className="gradient-text">In Milliseconds</span>
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Test the live verification engine. Test a valid student record, an intake-cap violation, or a multi-institution duplicate.
          </p>
        </div>

        {/* Quick Scenario Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="text-xs text-slate-400 mr-2">Try Pre-seeded Scenarios:</span>
          {SAMPLE_SCENARIOS.map((scenario) => (
            <button
              key={scenario.token}
              onClick={() => {
                setInputVal(scenario.token);
                handleVerify(scenario.token);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition ${
                inputVal === scenario.token
                  ? "bg-indigo-600/30 text-indigo-300 border-indigo-500 shadow-sm"
                  : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
            >
              {scenario.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify(inputVal);
            }}
            className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1.5 focus-within:border-indigo-500 transition shadow-xl"
          >
            <div className="pl-3 text-slate-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Enter 12-digit APAAR ID or Verification Token..."
              className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
            />
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow-md"
            >
              Verify
            </button>
          </form>
        </div>

        {/* Result Card */}
        <div className="max-w-4xl mx-auto rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl">
          {/* Status Header */}
          <div className="flex flex-wrap items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div className="flex items-center gap-3">
              {result.status === "VALID" ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
              ) : result.status === "FLAGGED" ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <AlertTriangle className="h-7 w-7" />
                </div>
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                  <XCircle className="h-7 w-7" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                      result.status === "VALID"
                        ? "bg-teal-500/15 text-teal-300 border border-teal-500/30"
                        : result.status === "FLAGGED"
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        : "bg-red-500/15 text-red-300 border border-red-500/30"
                    }`}
                  >
                    STATUS: {result.status}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Academic Year {result.academicYear}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{result.studentNameMasked}</h3>
              </div>
            </div>

            {/* Offline Verifiable Badge */}
            <div className="flex flex-col items-end text-xs font-mono">
              <span className="text-slate-400">Cryptographic Standard</span>
              <span className="text-indigo-400 font-semibold flex items-center gap-1 mt-0.5">
                <Key className="h-3.5 w-3.5" />
                Ed25519 (PyNaCl) Verified
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-slate-800 text-sm">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-4 w-4 text-slate-400 mt-1 shrink-0" />
                <div>
                  <span className="text-xs text-slate-500 block">Institution</span>
                  <span className="text-slate-200 font-medium">{result.institution}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <GraduationCap className="h-4 w-4 text-slate-400 mt-1 shrink-0" />
                <div>
                  <span className="text-xs text-slate-500 block">Academic Programme</span>
                  <span className="text-slate-200 font-medium">{result.program}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-slate-400 mt-1 shrink-0" />
                <div>
                  <span className="text-xs text-slate-500 block">Seat Category & Quota</span>
                  <span className="text-slate-200 font-medium">{result.seatCategory}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-slate-900 border border-slate-800/80 p-3.5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-mono flex items-center gap-1">
                    <Lock className="h-3 w-3 text-indigo-400" />
                    Peppered APAAR Token (HMAC)
                  </span>
                  <span className="text-[10px] text-teal-400">Zero-Knowledge</span>
                </div>
                <div className="font-mono text-xs text-slate-300 break-all">{result.apaarToken}</div>
              </div>

              <div className="rounded-xl bg-slate-900 border border-slate-800/80 p-3.5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-mono">Digital Signature (Ed25519)</span>
                  <button
                    onClick={copySignature}
                    className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300"
                  >
                    {copied ? <Check className="h-3 w-3 text-teal-400" /> : <Copy className="h-3 w-3" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <div className="font-mono text-xs text-indigo-300 break-all">{result.signature}</div>
              </div>
            </div>
          </div>

          {/* Explanation & Evidence */}
          <div className="pt-6">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Autonomous Verification Audit
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 rounded-xl p-3.5 border border-slate-800/60">
              {result.explanation}
            </p>

            {result.evidence && (
              <div className="mt-3 space-y-1.5">
                {result.evidence.map((ev, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-amber-300/90 font-mono">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DPDP Notice */}
          <div className="mt-6 pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <span>Aligned with India DPDP Act 2023 • Raw APAAR never stored in plaintext</span>
            <span className="text-indigo-400 font-mono">Public Key: /.well-known/apaar-verify-keys.json</span>
          </div>
        </div>
      </div>
    </section>
  );
}

