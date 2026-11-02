"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  Globe, 
  BarChart3, 
  Search, 
  UserCircle, 
  ShieldAlert, 
  FileText, 
  ArrowRight, 
  CheckCircle, 
  XCircle,
  Eye,
  Sliders,
  History
} from "lucide-react";

interface RoleCard {
  id: string;
  code: string;
  title: string;
  badge: string;
  icon: typeof Building2;
  color: string;
  description: string;
  allowed: string[];
  denied: string[];
  primaryScreen: string;
  screenHighlights: string[];
  demoUser: {
    email: string;
    roleName: string;
  };
}

const ROLES_DATA: RoleCard[] = [
  {
    id: "inst-admin",
    code: "INSTITUTION_ADMIN",
    title: "Institution Admin / Registrar",
    badge: "Campus Scope",
    icon: Building2,
    color: "from-blue-600 to-indigo-600",
    description:
      "Manages student submissions for own institution. Uploads CSV/XLSX batches, reviews inline suggested fixes, submits version diffs, and answers AICTE clarifications.",
    allowed: [
      "Upload/correct student batches for own institution",
      "View live 14-rule validation reports with suggested fixes",
      "Download annotated error CSV and version diffs",
      "Respond to officer clarification requests with evidence",
    ],
    denied: [
      "Cannot view or query student data of any other institution",
      "Cannot modify approved intake or rule thresholds",
    ],
    primaryScreen: "Institution Dashboard & Upload Wizard",
    screenHighlights: [
      "Upload Wizard with streaming Polars progress",
      "Row-by-row validation table with inline fix editor",
      "Version diff (v1 vs v2: Fixed, Still Failing, New)",
      "Approved Intake vs Actual Enrolment bar charts",
    ],
    demoUser: {
      email: "registrar@iit-surat.ac.in",
      roleName: "Institution Admin (NIT Surat)",
    },
  },
  {
    id: "regional-officer",
    code: "AICTE_REGIONAL_OFFICER",
    title: "AICTE Regional Officer",
    badge: "Regional Scope",
    icon: MapPin,
    color: "from-teal-600 to-cyan-600",
    description:
      "Monitors all technical institutions in assigned region (e.g. Western Region). Reviews high-severity anomaly flags, issues clarification notices with SLA deadlines, and inspects flagged rows.",
    allowed: [
      "Monitor all approved institutions within assigned region",
      "Review & resolve anomaly flags with AI plain-text explanations",
      "Trigger clarification requests with strict SLA countdowns",
      "View student-level data ONLY for flagged cases",
    ],
    denied: [
      "Cannot edit institution data or approved intake",
      "Cannot access institutions outside assigned region",
    ],
    primaryScreen: "Regional Command Center & Flag Queue",
    screenHighlights: [
      "Regional SVG heat map of flag density and intake violations",
      "SLA Escalation funnel (reminders at T-14, T-7, overdue)",
      "Flag queue with IsolationForest anomaly score breakdowns",
      "Early-warning admission trajectory forecast curves",
    ],
    demoUser: {
      email: "officer.western@aicte-india.org",
      roleName: "Regional Officer (Western Region)",
    },
  },
  {
    id: "national-officer",
    code: "AICTE_NATIONAL_OFFICER",
    title: "AICTE National Officer",
    badge: "National Scope",
    icon: Globe,
    color: "from-purple-600 to-indigo-600",
    description:
      "Maintains national technical education oversight. Handles cross-institution duplicate enrolment cases, inter-regional conflicts, and automated escalations.",
    allowed: [
      "Full national visibility across all 3,800+ institutions",
      "Investigate cross-institution duplicate cases side-by-side",
      "Manage escalated violations from regional offices",
      "Publish policy circulars and initiate compliance freezes",
    ],
    denied: [
      "Cannot modify individual institution enrolments",
    ],
    primaryScreen: "National Duplicate Case War Room",
    screenHighlights: [
      "Side-by-side student comparison with phonetic confidence",
      "National intake-vs-enrolment leaderboard",
      "Escalation Ladder tracker (Level 1 → Level 2 → Senior)",
      "Realtime system-wide fraud & duplicate telemetry",
    ],
    demoUser: {
      email: "national.hq@aicte-india.org",
      roleName: "AICTE National Head Office",
    },
  },
  {
    id: "policy-analyst",
    code: "AICTE_POLICY_ANALYST",
    title: "AICTE Policy Analyst",
    badge: "Aggregate Only",
    icon: BarChart3,
    color: "from-amber-600 to-orange-600",
    description:
      "Performs macro-level technical education analytics. Access is strictly aggregated with small-cell suppression (< 5 hidden) to guarantee student privacy.",
    allowed: [
      "Access macro national/regional/state analytics",
      "View intake fill trends, category mix (NRI/TFW/FN), and YoY growth",
      "Generate and export PDF/Excel policy research briefs",
      "Monitor national Data Quality Score distribution",
    ],
    denied: [
      "STRICTLY FORBIDDEN: Cannot view any student-level row or PII",
      "Small-cell suppression enforced at database SQL view level",
    ],
    primaryScreen: "Macro Policy & Enrolment Dashboard",
    screenHighlights: [
      "Intake vs Enrolment fill ratios across engineering branches",
      "Small-cell suppression badge: 'Privacy Guaranteed'",
      "Institution Data Quality percentile distribution",
      "Automated monthly policy briefing export",
    ],
    demoUser: {
      email: "analyst@aicte-india.org",
      roleName: "Policy Analyst (No PII Access)",
    },
  },
  {
    id: "verifier",
    code: "VERIFIER",
    title: "Employer / University Verifier",
    badge: "Consent-Gated",
    icon: Search,
    color: "from-emerald-600 to-teal-600",
    description:
      "Corporate recruiters, higher education admissions, and background verification agencies. Verifies academic credentials with student consent via QR or APAAR token.",
    allowed: [
      "Scan QR code or enter student APAAR token",
      "Verify Ed25519 digital signature instantly offline",
      "Request deep verification with consent from student",
      "Download cryptographically signed proof of verification",
    ],
    denied: [
      "Cannot browse or list any students in the registry",
      "Cannot access fields the student did not explicitly approve",
    ],
    primaryScreen: "Verification Console & Consent Tracker",
    screenHighlights: [
      "Live QR Camera Scanner / File Upload verifier",
      "Consent Status tracker (PENDING → APPROVED → EXPIRED)",
      "Minimalist verifiable credential report (DPDP compliant)",
      "Audit trail of verification history",
    ],
    demoUser: {
      email: "recruiter@tcs.com",
      roleName: "Authorized Corporate Verifier",
    },
  },
  {
    id: "student",
    code: "STUDENT",
    title: "Student Academic Identity",
    badge: "Mobile-First",
    icon: UserCircle,
    color: "from-sky-600 to-blue-600",
    description:
      "The student owns their data. View official verified enrolment credential, manage incoming verification consent requests with granular field toggles, and see full access history.",
    allowed: [
      "Download official signed Ed25519 digital credential + QR",
      "Granularly approve/deny verifier requests (e.g. hide DOB)",
      "Instantly withdraw consent anytime with one click",
      "Full access audit: see who verified your credential and when",
    ],
    denied: [
      "Cannot access records of other students",
    ],
    primaryScreen: "Student Consent & Credential Wallet",
    screenHighlights: [
      "Official Academic Credential Card with signed QR code",
      "Consent Inbox with field toggles (Grades, Category, DOB)",
      "Access Timeline: Who verified me and for what purpose",
      "One-click Right to Withdraw consent button",
    ],
    demoUser: {
      email: "student@sample.edu.in",
      roleName: "Student (APAAR: 9041-8821-3419)",
    },
  },
  {
    id: "admin",
    code: "SYSTEM_ADMIN",
    title: "System Administrator",
    badge: "Platform & Audit",
    icon: ShieldAlert,
    color: "from-rose-600 to-red-600",
    description:
      "Configures the 14 validation rules, seat categories, and escalation policies. Verifies tamper-evident hash-chained audit log integrity.",
    allowed: [
      "Configure validation rule thresholds and toggle active rules",
      "Set seat category parameters (TFW %, NRI %, FN limits)",
      "Manage API keys for institution ERP integrations",
      "Run cryptographic verification on the append-only audit log",
    ],
    denied: [
      "Cannot read student PII by default (break-glass logged)",
    ],
    primaryScreen: "System Administration & Audit Chain Verifier",
    screenHighlights: [
      "Live 'Verify Audit Chain Integrity' button (checks prev_hash + row_hash)",
      "Rule parameter sliders and live preview",
      "API Key generator with rate limit policies",
      "System health, Prometheus metrics, and Celery queue monitors",
    ],
    demoUser: {
      email: "admin@apaar-verify.gov.in",
      roleName: "System Administrator",
    },
  },
];

export function RoleShowcase() {
  const [selectedRole, setSelectedRole] = useState<RoleCard>(ROLES_DATA[0]);

  return (
    <section id="roles" className="py-20 relative border-t border-slate-900 bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-500/20 mb-3">
            <Sliders className="h-3.5 w-3.5" />
            <span>NIST-Style Multi-Role Portals</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for Every Stakeholder <span className="gradient-text">with Zero-Trust RBAC</span>
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Every persona has a dedicated, tailored portal. Access is enforced in three layers: Postgres RLS, FastAPI dependency guards, and Next.js route protection.
          </p>
        </div>

        {/* Role Pills Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {ROLES_DATA.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole.id === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                    : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{role.title.split(" / ")[0]}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"}`}>
                  {role.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Role Showcase Card */}
        <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 6 cols: Info, permissions */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-indigo-400">{selectedRole.code}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-400">{selectedRole.badge}</span>
                </div>
                <h3 className="text-2xl font-bold text-white">{selectedRole.title}</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">{selectedRole.description}</p>
              </div>

              {/* What this role CAN do */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-teal-400 flex items-center gap-1.5 mb-2.5">
                  <CheckCircle className="h-4 w-4" />
                  Authorized Capabilities
                </h4>
                <div className="space-y-1.5">
                  {selectedRole.allowed.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-teal-400 shrink-0 font-bold">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What this role CANNOT do */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-2.5">
                  <XCircle className="h-4 w-4" />
                  Boundary Enforcements & Restrictions
                </h4>
                <div className="space-y-1.5">
                  {selectedRole.denied.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                      <span className="text-rose-400 shrink-0 font-bold">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 6 cols: Screen preview card & Demo Login info */}
            <div className="lg:col-span-6 rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-slate-400">PRIMARY ROLE INTERFACE</span>
                <span className="text-xs font-mono text-indigo-400 font-bold">
                  {selectedRole.primaryScreen}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                  Screen Highlights
                </h4>
                <div className="space-y-2">
                  {selectedRole.screenHighlights.map((hl, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demo Login Card */}
              <div className="rounded-xl bg-indigo-950/40 border border-indigo-500/30 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-indigo-300">PRE-SEEDED DEMO ACCOUNT</span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">
                    Instant Access
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  <div>Email: <strong className="text-white">{selectedRole.demoUser.email}</strong></div>
                  <div>Password: <strong className="text-white">demo2026!</strong></div>
                  <div className="text-[11px] text-slate-400 mt-1">Scope: {selectedRole.demoUser.roleName}</div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => {
                      alert(`Logging into ${selectedRole.title} demo environment...`);
                    }}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow-md shadow-indigo-600/30"
                  >
                    Enter Role Portal
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[11px] text-slate-400">TOTP MFA configured for AICTE roles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

