"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  GitMerge, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Globe, 
  Building2, 
  Calendar, 
  ShieldAlert, 
  Sparkles,
  Lock,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface DuplicateCase {
  id: string;
  studentName: string;
  apaarTokenMasked: string;
  confidence: number;
  evidence: string[];
  instA: {
    name: string;
    id: string;
    program: string;
    admittedDate: string;
    seatCategory: string;
  };
  instB: {
    name: string;
    id: string;
    program: string;
    admittedDate: string;
    seatCategory: string;
  };
  status: "OPEN" | "CONFIRMED_FRAUD" | "DISMISSED";
}

const DUPLICATE_CASES: DuplicateCase[] = [
  {
    id: "DC-2026-904",
    studentName: "Rahul Mehra",
    apaarTokenMasked: "hmac_sha256:9d11ee40...8821",
    confidence: 100,
    evidence: [
      "Matching APAAR token hash across two separate university databases",
      "DOB match (2004-03-19) and phonetic name equality (Double Metaphone: RHL MR)",
      "Simultaneous active status in Academic Year 2026-27",
    ],
    instA: {
      name: "Delhi Institute of Technology & Management",
      id: "1-89210",
      program: "B.Tech Computer Science & Engineering",
      admittedDate: "2026-07-28",
      seatCategory: "GENERAL (Merit Round 1)",
    },
    instB: {
      name: "Rajasthan Institute of Engineering & Technology",
      id: "1-44109",
      program: "B.Tech Information Technology",
      admittedDate: "2026-08-04",
      seatCategory: "MANAGEMENT_QUOTA",
    },
    status: "OPEN",
  },
  {
    id: "DC-2026-905",
    studentName: "Amandeep Kaur",
    apaarTokenMasked: "hmac_sha256:3c88bb19...2201",
    confidence: 96.5,
    evidence: [
      "Fuzzy candidate: slight spelling variation ('Amandeep Kaur' vs 'Aman Deep Kaur')",
      "Identical DOB (2004-11-14) and 10th Roll Number credential",
      "Enrolled in two distant technical universities simultaneously",
    ],
    instA: {
      name: "Punjab Technical University Campus",
      id: "1-99214",
      program: "B.Tech Electronics & Comm. Engg",
      admittedDate: "2026-07-30",
      seatCategory: "STATE_QUOTA",
    },
    instB: {
      name: "Himachal State Engineering Institute",
      id: "1-77123",
      program: "B.Tech Computer Science & Engineering",
      admittedDate: "2026-08-08",
      seatCategory: "OPEN_ALL_INDIA",
    },
    status: "OPEN",
  },
];

export default function NationalOfficerPage() {
  const { activeRoleScope } = useAuth();
  const [selectedCase, setSelectedCase] = useState<DuplicateCase>(DUPLICATE_CASES[0]);
  const [cases, setCases] = useState<DuplicateCase[]>(DUPLICATE_CASES);

  const handleConfirmFraud = (id: string) => {
    setCases(
      cases.map((c) => (c.id === id ? { ...c, status: "CONFIRMED_FRAUD" } : c))
    );
    alert(`Case #${id} confirmed as unauthorized dual enrolment. Automated compliance notice dispatched to both institutions.`);
  };

  const handleDismiss = (id: string) => {
    setCases(
      cases.map((c) => (c.id === id ? { ...c, status: "DISMISSED" } : c))
    );
    alert(`Case #${id} dismissed. Enrolment status unfrozen.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-purple-400">NATIONAL HEADQUARTERS</span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">All India Council for Technical Education</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            National Duplicate Enrolment War Room
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="rounded bg-purple-500/10 px-3 py-1.5 text-purple-400 font-bold border border-purple-500/30 flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            National Scope: 34 Active Conflicts
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl glass-panel p-5 border border-slate-800">
          <span className="text-xs font-mono text-slate-400 uppercase block mb-1">CROSS-INSTITUTION DUPLICATES</span>
          <div className="text-3xl font-extrabold text-white font-mono">34 Cases</div>
          <span className="text-xs text-rose-400 mt-1 block">Auto-frozen verification status</span>
        </div>
        <div className="rounded-2xl glass-panel p-5 border border-slate-800">
          <span className="text-xs font-mono text-slate-400 uppercase block mb-1">AVERAGE MATCH CONFIDENCE</span>
          <div className="text-3xl font-extrabold text-teal-400 font-mono">98.4%</div>
          <span className="text-xs text-slate-400 mt-1 block">RapidFuzz + Double Metaphone</span>
        </div>
        <div className="rounded-2xl glass-panel p-5 border border-slate-800">
          <span className="text-xs font-mono text-slate-400 uppercase block mb-1">ESCALATION LEVEL 2</span>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">4 Notices</div>
          <span className="text-xs text-amber-400/80 mt-1 block">Overdue regional clarifications</span>
        </div>
      </div>

      {/* Side-by-Side Comparison War Room */}
      <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-indigo-400">{selectedCase.id}</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs font-mono text-teal-400 font-bold">{selectedCase.confidence}% MATCH CONFIDENCE</span>
            </div>
            <h3 className="text-xl font-bold text-white">Student: {selectedCase.studentName}</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleConfirmFraud(selectedCase.id)}
              className="py-2 px-4 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition shadow-md shadow-rose-600/30"
            >
              Confirm Fraud & Issue Show-Cause Notice
            </button>
            <button
              onClick={() => handleDismiss(selectedCase.id)}
              className="py-2 px-4 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800"
            >
              Dismiss (Valid Transfer)
            </button>
          </div>
        </div>

        {/* Side-by-Side Enrolment Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Institution A Card */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-indigo-400">INSTITUTION A (RECORD 1)</span>
              <span className="text-[10px] font-mono text-slate-500">Admitted: {selectedCase.instA.admittedDate}</span>
            </div>
            <div className="text-sm font-bold text-white">{selectedCase.instA.name}</div>
            <div className="text-xs text-slate-400 font-mono">AICTE ID: {selectedCase.instA.id}</div>
            <div className="pt-2 text-xs space-y-1.5 text-slate-300">
              <div><strong>Programme:</strong> {selectedCase.instA.program}</div>
              <div><strong>Quota:</strong> {selectedCase.instA.seatCategory}</div>
              <div><strong>Enrolment Status:</strong> <span className="text-rose-400 font-bold">ACTIVE (FROZEN)</span></div>
            </div>
          </div>

          {/* Institution B Card */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-purple-400">INSTITUTION B (RECORD 2)</span>
              <span className="text-[10px] font-mono text-slate-500">Admitted: {selectedCase.instB.admittedDate}</span>
            </div>
            <div className="text-sm font-bold text-white">{selectedCase.instB.name}</div>
            <div className="text-xs text-slate-400 font-mono">AICTE ID: {selectedCase.instB.id}</div>
            <div className="pt-2 text-xs space-y-1.5 text-slate-300">
              <div><strong>Programme:</strong> {selectedCase.instB.program}</div>
              <div><strong>Quota:</strong> {selectedCase.instB.seatCategory}</div>
              <div><strong>Enrolment Status:</strong> <span className="text-rose-400 font-bold">ACTIVE (FROZEN)</span></div>
            </div>
          </div>
        </div>

        {/* Algorithmic Evidence Breakdown */}
        <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-4">
          <span className="text-xs font-mono uppercase text-slate-400 font-bold block mb-2">
            Automated Cross-Match Evidence:
          </span>
          <div className="space-y-1.5 text-xs text-slate-300">
            {selectedCase.evidence.map((ev, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-teal-400 font-bold">•</span>
                <span>{ev}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

