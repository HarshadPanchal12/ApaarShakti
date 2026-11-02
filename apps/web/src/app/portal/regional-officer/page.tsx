"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  MapPin, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Building2, 
  Brain, 
  ChevronRight, 
  ShieldAlert, 
  HelpCircle, 
  Sparkles,
  BarChart2,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface FlagItem {
  id: string;
  institutionName: string;
  institutionId: string;
  program: string;
  flagType: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  score: number;
  reasonCode: string;
  plainExplanation: string;
  features: { label: string; value: string; peerMedian: string }[];
  status: "OPEN" | "CLARIFICATION_REQUESTED" | "RESOLVED";
}

const REGIONAL_FLAGS: FlagItem[] = [
  {
    id: "FLAG-2026-081",
    institutionName: "Apex Institute of Engineering & Technology",
    institutionId: "1-48291",
    program: "B.Tech Computer Science & Engineering",
    flagType: "INTAKE_CAP_VIOLATION",
    severity: "HIGH",
    score: 0.94,
    reasonCode: "INTAKE_EXCEEDED_NON_SUPERNUMERARY",
    plainExplanation:
      "CSE enrolment stands at 205 students against approved intake of 180 (+13.8% over legal cap). No valid supernumerary justification provided in file submission.",
    features: [
      { label: "Approved Intake", value: "180 seats", peerMedian: "180 seats" },
      { label: "Submitted Admissions", value: "205 seats", peerMedian: "172 seats" },
      { label: "Supernumerary Share", value: "0% TFW", peerMedian: "4.8% TFW" },
    ],
    status: "OPEN",
  },
  {
    id: "FLAG-2026-082",
    institutionName: "Vidyapeeth College of Engineering",
    institutionId: "1-38294",
    program: "B.Tech Information Technology",
    flagType: "NRI_QUOTA_SPIKE",
    severity: "HIGH",
    score: 0.88,
    reasonCode: "NRI_SHARE_SPIKE_YOY",
    plainExplanation:
      "NRI admissions spiked from 4% in 2025-26 to 21% in 2026-27 (peer median: 5.2%). Institution has maintained 100% capacity streak for 3 consecutive years.",
    features: [
      { label: "NRI Share Current Year", value: "21.0%", peerMedian: "5.2%" },
      { label: "NRI Share Prior Year", value: "4.1%", peerMedian: "4.8%" },
      { label: "Proximity to Cap Streak", value: "3 Years at 100%", peerMedian: "1 Year" },
    ],
    status: "CLARIFICATION_REQUESTED",
  },
  {
    id: "FLAG-2026-083",
    institutionName: "Modern Technical Academy, Pune",
    institutionId: "1-88219",
    program: "B.Tech Mechanical Engineering",
    flagType: "IDENTITY_ANOMALY_CLUSTER",
    severity: "MEDIUM",
    score: 0.65,
    reasonCode: "LOW_CONFIDENCE_APAAR_CLUSTER",
    plainExplanation:
      "8 student records submitted with name similarity scores < 80% compared to Mock APAAR Registry records. Indicates possible batch clerical corruption.",
    features: [
      { label: "Discrepancy Count", value: "8 records", peerMedian: "0.2 records" },
      { label: "Avg Name Similarity", value: "74.2%", peerMedian: "99.1%" },
      { label: "DOB Match Rate", value: "100%", peerMedian: "100%" },
    ],
    status: "OPEN",
  },
];

const MONITORED_INSTITUTIONS = [
  {
    name: "National Institute of Technology, Surat",
    id: "1-1029411",
    state: "Gujarat",
    intake: 600,
    enrolled: 588,
    fillRatio: "98.0%",
    qualityScore: 94.8,
    flagsCount: 0,
    status: "COMPLIANT",
  },
  {
    name: "Apex Institute of Engineering & Technology",
    id: "1-48291",
    state: "Maharashtra",
    intake: 420,
    enrolled: 445,
    fillRatio: "105.9%",
    qualityScore: 68.2,
    flagsCount: 2,
    status: "VIOLATION",
  },
  {
    name: "Vidyapeeth College of Engineering",
    id: "1-38294",
    state: "Maharashtra",
    intake: 360,
    enrolled: 360,
    fillRatio: "100.0%",
    qualityScore: 81.5,
    flagsCount: 1,
    status: "FLAGGED",
  },
  {
    name: "Goa College of Engineering, Farmagudi",
    id: "1-19284",
    state: "Goa",
    intake: 300,
    enrolled: 284,
    fillRatio: "94.6%",
    qualityScore: 92.0,
    flagsCount: 0,
    status: "COMPLIANT",
  },
];

export default function RegionalOfficerPage() {
  const { activeRoleScope } = useAuth();
  const [selectedFlag, setSelectedFlag] = useState<FlagItem>(REGIONAL_FLAGS[0]);
  const [flags, setFlags] = useState<FlagItem[]>(REGIONAL_FLAGS);

  const handleResolveFlag = (flagId: string) => {
    setFlags(
      flags.map((f) => (f.id === flagId ? { ...f, status: "RESOLVED" } : f))
    );
    alert(`Flag #${flagId} marked as RESOLVED by Regional Officer.`);
  };

  const handleRequestClarification = (flagId: string) => {
    setFlags(
      flags.map((f) => (f.id === flagId ? { ...f, status: "CLARIFICATION_REQUESTED" } : f))
    );
    alert(`Clarification Notice with 72h SLA SLA issued to institution registrar.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-teal-400">REGIONAL OFFICE SCOPE</span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">States: Maharashtra, Gujarat, Goa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Western Regional Command Center
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="rounded bg-teal-500/10 px-3 py-1.5 text-teal-400 font-bold border border-teal-500/30 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            Active Region: WR
          </span>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl glass-panel p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>INSTITUTIONS MONITORED</span>
            <Building2 className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">482</div>
          <div className="text-[11px] text-teal-400 mt-1">96.8% Submissions Received</div>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>OPEN ANOMALY FLAGS</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">7 Active</div>
          <div className="text-[11px] text-slate-400 mt-1">Auto-assigned by workload</div>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>INTAKE COMPLIANCE RATE</span>
            <CheckCircle2 className="h-4 w-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-teal-400 font-mono">98.5%</div>
          <div className="text-[11px] text-teal-400 mt-1">Within approved quotas</div>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>EARLY-WARNING RISKS</span>
            <TrendingUp className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 font-mono">3 Programmes</div>
          <div className="text-[11px] text-slate-400 mt-1">Projected over-intake pace</div>
        </div>
      </div>

      {/* Main Grid: Regional Flag Queue & Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 cols: Flag Queue List */}
        <div className="lg:col-span-6 rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">IsolationForest Anomaly Flags Queue</h3>
              <p className="text-xs text-slate-400">Auto-detected exceptions requiring officer review</p>
            </div>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              AICTE Decision Support
            </span>
          </div>

          <div className="space-y-3">
            {flags.map((flag) => {
              const isSelected = selectedFlag.id === flag.id;
              return (
                <div
                  key={flag.id}
                  onClick={() => setSelectedFlag(flag)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 border-indigo-500 shadow-md shadow-indigo-600/10"
                      : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          flag.severity === "HIGH"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {flag.severity} RISK
                      </span>
                      <span className="text-xs font-mono text-slate-400">{flag.id}</span>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        flag.status === "RESOLVED"
                          ? "bg-teal-500/15 text-teal-300"
                          : flag.status === "CLARIFICATION_REQUESTED"
                          ? "bg-amber-500/15 text-amber-300"
                          : "bg-rose-500/15 text-rose-300"
                      }`}
                    >
                      {flag.status.replace("_", " ")}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{flag.institutionName}</h4>
                  <p className="text-xs text-indigo-400 font-mono mt-0.5">{flag.program}</p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{flag.plainExplanation}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 6 cols: Flag Detailed Inspector & AI Explainability */}
        <div className="lg:col-span-6 rounded-2xl glass-panel p-6 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-mono text-slate-500">INSPECTING EXCEPTION</span>
              <h3 className="text-base font-bold text-white mt-0.5">{selectedFlag.id}</h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-mono block">ANOMALY SCORE</span>
              <span className="text-lg font-mono font-bold text-amber-400">{selectedFlag.score}</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-mono uppercase text-slate-400 mb-1 block">Institution & Program</span>
            <div className="text-sm font-bold text-white">{selectedFlag.institutionName}</div>
            <div className="text-xs text-slate-400 font-mono">ID: {selectedFlag.institutionId} • {selectedFlag.program}</div>
          </div>

          {/* Plain Language Summary Box */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
            <div className="flex items-center gap-1.5 text-xs font-mono text-indigo-400 font-bold mb-1.5">
              <Brain className="h-3.5 w-3.5" />
              PLAIN-LANGUAGE REGULATORY SUMMARY
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedFlag.plainExplanation}
            </p>
          </div>

          {/* Model Features Transparency */}
          <div>
            <span className="text-xs font-mono uppercase text-slate-400 mb-2 block">
              Feature Vector vs Regional Peer Median
            </span>
            <div className="space-y-2">
              {selectedFlag.features.map((feat, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 text-xs border border-slate-800/80">
                  <span className="text-slate-300">{feat.label}</span>
                  <div className="text-right font-mono">
                    <span className="text-white font-bold">{feat.value}</span>
                    <span className="text-slate-500 text-[10px] block">Peer Median: {feat.peerMedian}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={() => handleRequestClarification(selectedFlag.id)}
              className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition shadow-md shadow-indigo-600/30 text-center"
            >
              Issue Clarification Notice (72h SLA)
            </button>
            <button
              onClick={() => handleResolveFlag(selectedFlag.id)}
              className="py-2 px-4 rounded-xl border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-bold hover:bg-teal-500/20 transition"
            >
              Mark Resolved
            </button>
          </div>
        </div>
      </div>

      {/* Monitored Institutions Table */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-white">REGIONAL ADMISSIONS MONITOR & DATA QUALITY</span>
          <span className="text-xs font-mono text-teal-400">Total: 482 Institutions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Institution Name & AICTE ID</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Intake Cap</th>
                <th className="py-3 px-4">Enrolled Students</th>
                <th className="py-3 px-4">Fill Ratio</th>
                <th className="py-3 px-4">Quality Score</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {MONITORED_INSTITUTIONS.map((inst) => (
                <tr key={inst.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{inst.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{inst.id}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{inst.state}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{inst.intake}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">{inst.enrolled}</td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className={inst.fillRatio.includes("105") ? "text-rose-400 font-bold" : "text-teal-400"}>
                      {inst.fillRatio}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                    {inst.qualityScore} / 100
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {inst.status === "COMPLIANT" ? (
                      <span className="inline-flex items-center gap-1 rounded bg-teal-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-teal-300 border border-teal-500/30">
                        <CheckCircle2 className="h-3 w-3" />
                        COMPLIANT
                      </span>
                    ) : inst.status === "VIOLATION" ? (
                      <span className="inline-flex items-center gap-1 rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-rose-300 border border-rose-500/30">
                        <AlertTriangle className="h-3 w-3" />
                        CAP EXCEEDED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300 border border-amber-500/30">
                        <AlertTriangle className="h-3 w-3" />
                        FLAGGED
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

