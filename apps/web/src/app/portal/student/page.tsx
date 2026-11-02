"use client";

import { useState } from "react";
import { 
  UserCircle, 
  QrCode, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Clock, 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  AlertCircle,
  Eye,
  Key
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface ConsentRequest {
  id: string;
  verifierOrg: string;
  purpose: string;
  requestedAt: string;
  expiresInDays: number;
  fields: { key: string; label: string; allowed: boolean }[];
  status: "PENDING" | "APPROVED" | "DENIED";
}

const SAMPLE_CONSENTS: ConsentRequest[] = [
  {
    id: "REQ-2026-441",
    verifierOrg: "Tata Consultancy Services (TCS Campus Recruitment)",
    purpose: "Verification for Graduate Trainee 2026 Cohort Employment",
    requestedAt: "2026-10-29T14:20:00Z",
    expiresInDays: 30,
    fields: [
      { key: "program", label: "Academic Degree & Specialization", allowed: true },
      { key: "institution", label: "Institution & AICTE Approval Status", allowed: true },
      { key: "status", label: "Enrolment Standing (Active/Graduated)", allowed: true },
      { key: "dob", label: "Date of Birth & Age", allowed: false },
      { key: "category", label: "Social Category / Quota Details", allowed: false },
    ],
    status: "APPROVED",
  },
  {
    id: "REQ-2026-442",
    verifierOrg: "Infosys Ltd (Higher Education Verifications)",
    purpose: "Technical Internship Background Verification",
    requestedAt: "2026-10-30T01:10:00Z",
    expiresInDays: 14,
    fields: [
      { key: "program", label: "Academic Degree & Specialization", allowed: true },
      { key: "institution", label: "Institution & AICTE Approval Status", allowed: true },
      { key: "status", label: "Enrolment Standing (Active/Graduated)", allowed: true },
      { key: "dob", label: "Date of Birth & Age", allowed: false },
    ],
    status: "PENDING",
  },
];

export default function StudentPortalPage() {
  const { user } = useAuth();
  const [consents, setConsents] = useState<ConsentRequest[]>(SAMPLE_CONSENTS);

  const toggleField = (reqId: string, fieldKey: string) => {
    setConsents(
      consents.map((c) => {
        if (c.id === reqId) {
          return {
            ...c,
            fields: c.fields.map((f) =>
              f.key === fieldKey ? { ...f, allowed: !f.allowed } : f
            ),
          };
        }
        return c;
      })
    );
  };

  const updateStatus = (reqId: string, status: "APPROVED" | "DENIED") => {
    setConsents(
      consents.map((c) => (c.id === reqId ? { ...c, status } : c))
    );
    alert(`Consent request #${reqId} marked as ${status}. Access ${status === "APPROVED" ? "granted" : "revoked"}.`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-sky-400">STUDENT DATA WALLET</span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-mono">APAAR ID: 9041-8821-3419</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {user?.fullName || "Aryan Verma"}
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="rounded-full bg-teal-500/10 px-3 py-1.5 text-teal-300 font-bold border border-teal-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Verified Academic Citizen
          </span>
        </div>
      </div>

      {/* Official Verifiable Credential Card */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 p-6 sm:p-8 border border-indigo-500/30 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/30 text-indigo-400 font-bold border border-indigo-500/40">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <div className="text-xs text-indigo-400 font-mono font-bold">ALL INDIA COUNCIL FOR TECHNICAL EDUCATION</div>
              <h2 className="text-lg font-bold text-white">Official Academic Enrolment Credential</h2>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
            <ShieldCheck className="h-3.5 w-3.5" />
            Ed25519 Cryptographically Signed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left 8 cols: Info */}
          <div className="md:col-span-8 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 text-[10px] font-mono uppercase block">STUDENT NAME</span>
                <span className="text-sm font-bold text-white">{user?.fullName || "Aryan Verma"}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] font-mono uppercase block">APAAR TOKEN (HMAC)</span>
                <span className="text-xs font-mono text-indigo-300 font-bold">9041-8821-3419</span>
              </div>
            </div>

            <div>
              <span className="text-slate-500 text-[10px] font-mono uppercase block">APPROVED INSTITUTION</span>
              <span className="text-slate-200 font-medium">National Institute of Technology, Surat (AICTE 1-1029411)</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 text-[10px] font-mono uppercase block">PROGRAMME</span>
                <span className="text-slate-200 font-medium">B.Tech Artificial Intelligence & Data Science</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] font-mono uppercase block">ACADEMIC YEAR</span>
                <span className="text-slate-200 font-medium">2026-27 (Valid Active Enrolment)</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-slate-500 text-[10px] font-mono uppercase block">DIGITAL SIGNATURE HASH</span>
              <span className="text-[11px] font-mono text-indigo-400 break-all block mt-0.5">
                ed25519:6c8e3a2f91b0d7449c2e...b189ff4c
              </span>
            </div>
          </div>

          {/* Right 4 cols: QR Code & Print Snippet */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-white text-slate-900 text-center">
            <div className="p-2 border border-slate-300 rounded-xl mb-2">
              <QrCode className="h-28 w-28 text-slate-950" />
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-800">SCAN TO VERIFY OFFLINE</span>
            <span className="text-[9px] text-slate-500 font-mono">https://apaar-verify.dev/v/8f92a1</span>
          </div>
        </div>
      </div>

      {/* DPDP Consent Management Inbox */}
      <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Lock className="h-4 w-4 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Third-Party Verification Requests (Consent Inbox)</h3>
            </div>
            <p className="text-xs text-slate-400">
              India DPDP Act 2023: You decide which organizations can view your credential, which fields they see, and can withdraw consent anytime.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {consents.map((req) => (
            <div key={req.id} className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono font-bold text-indigo-400">{req.id}</span>
                    <span className="text-slate-500">•</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        req.status === "APPROVED"
                          ? "bg-teal-500/20 text-teal-300"
                          : req.status === "DENIED"
                          ? "bg-rose-500/20 text-rose-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{req.verifierOrg}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{req.purpose}</p>
                </div>

                <div className="flex items-center gap-2">
                  {req.status === "APPROVED" ? (
                    <button
                      onClick={() => updateStatus(req.id, "DENIED")}
                      className="py-1.5 px-3 rounded-lg border border-rose-500/30 text-rose-400 text-xs font-semibold hover:bg-rose-500/10 transition"
                    >
                      Withdraw Consent (Instant Revoke)
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => updateStatus(req.id, "APPROVED")}
                        className="py-1.5 px-3 rounded-lg bg-teal-600 text-white text-xs font-bold hover:bg-teal-500 transition"
                      >
                        Approve Selected Fields
                      </button>
                      <button
                        onClick={() => updateStatus(req.id, "DENIED")}
                        className="py-1.5 px-3 rounded-lg border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition"
                      >
                        Deny
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Granular Field Toggles */}
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  Granular Field Disclosure Controls:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {req.fields.map((field) => (
                    <label
                      key={field.key}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition"
                    >
                      <span className="text-slate-300">{field.label}</span>
                      <input
                        type="checkbox"
                        checked={field.allowed}
                        onChange={() => toggleField(req.id, field.key)}
                        className="accent-indigo-500 h-4 w-4 rounded cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

