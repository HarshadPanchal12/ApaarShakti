// APAAR-Verify — Product Constants
// Single source of truth — change here, reflects everywhere

export const APP_CONFIG = {
  name: "APAAR-Verify",
  tagline: "Smart Student Data Management & Verification",
  fullName: "APAAR-Verify Platform",
  description:
    "India's automated student enrolment verification platform. AICTE-grade validation, duplicate detection, anomaly scoring and cryptographic credentials — all without manual intervention.",
  version: "0.1.0",
  sih: {
    problemId: "SIH26263",
    theme: "Smart Automation",
    year: 2026,
    organization: "AICTE",
  },
  contact: {
    grievance: "grievance@apaar-verify.dev",
    support: "support@apaar-verify.dev",
  },
  legal: {
    dpdpNote:
      "This platform processes student data under India's Digital Personal Data Protection Act, 2023. Data is collected for the purpose of academic verification only, with student consent required for third-party access.",
  },
} as const;

export const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Verify", href: "#verify" },
  { label: "For Institutions", href: "#roles" },
  { label: "Security", href: "#security" },
] as const;

export const DEMO_STATS = {
  institutions: 3847,
  studentsVerified: 2_84_650,
  hoursAutomated: 142320,
  flagsRaised: 1243,
  credentialsIssued: 2_41_880,
  accuracy: 99.7,
} as const;

export const ROLES_OVERVIEW = [
  {
    role: "INSTITUTION_ADMIN",
    label: "Institution Admin",
    icon: "Building2",
    description: "Upload student data, track validation results, respond to clarifications.",
    color: "indigo",
    href: "/auth/login?role=institution",
  },
  {
    role: "AICTE_REGIONAL_OFFICER",
    label: "Regional Officer",
    icon: "MapPin",
    description: "Monitor institutions in your region, review flags, manage escalations.",
    color: "teal",
    href: "/auth/login?role=regional-officer",
  },
  {
    role: "AICTE_NATIONAL_OFFICER",
    label: "National Officer",
    icon: "Globe",
    description: "Cross-region oversight, duplicate cases, national dashboards.",
    color: "violet",
    href: "/auth/login?role=national-officer",
  },
  {
    role: "AICTE_POLICY_ANALYST",
    label: "Policy Analyst",
    icon: "BarChart3",
    description: "Aggregate trends, policy dashboards — no student-level data.",
    color: "amber",
    href: "/auth/login?role=analyst",
  },
  {
    role: "VERIFIER",
    label: "Employer / Verifier",
    icon: "Search",
    description: "Consent-gated student verification via APAAR token or QR scan.",
    color: "emerald",
    href: "/auth/login?role=verifier",
  },
  {
    role: "STUDENT",
    label: "Student",
    icon: "UserCircle",
    description: "Manage consent, download your credential, track who accessed your record.",
    color: "sky",
    href: "/auth/login?role=student",
  },
] as const;

export const AUTOMATION_STEPS = [
  {
    step: 1,
    label: "Institution Uploads",
    sublabel: "CSV / XLSX / API",
    icon: "Upload",
    color: "indigo",
  },
  {
    step: 2,
    label: "14-Rule Validation",
    sublabel: "APAAR check · intake · duplicates",
    icon: "ShieldCheck",
    color: "blue",
  },
  {
    step: 3,
    label: "Duplicate Detection",
    sublabel: "Fuzzy + phonetic matching",
    icon: "GitMerge",
    color: "violet",
  },
  {
    step: 4,
    label: "ML Anomaly Scoring",
    sublabel: "IsolationForest · peer z-score",
    icon: "Brain",
    color: "purple",
  },
  {
    step: 5,
    label: "Credential Issued",
    sublabel: "Ed25519 signature · QR code",
    icon: "QrCode",
    color: "teal",
  },
] as const;

export const SECURITY_FEATURES = [
  {
    icon: "Lock",
    title: "PII Encrypted at Rest",
    desc: "DOB and contact fields encrypted with pgcrypto. APAAR IDs stored as peppered HMAC tokens — never in plain text.",
  },
  {
    icon: "Link",
    title: "Hash-Chained Audit Log",
    desc: "Every action writes to an append-only tamper-evident log. Chain integrity is publicly verifiable.",
  },
  {
    icon: "Key",
    title: "Ed25519 Credentials",
    desc: "Verifiable student credentials signed with Ed25519. Anyone can verify offline using the public key at /.well-known/.",
  },
  {
    icon: "UserCheck",
    title: "Consent-First Verification",
    desc: "Third-party access requires explicit student consent with field-level granularity and expiry. Withdraw anytime.",
  },
  {
    icon: "Shield",
    title: "NIST RBAC + RLS",
    desc: "Defense-in-depth: role-based access enforced at database (RLS), API (FastAPI guards), and UI layers.",
  },
  {
    icon: "FileText",
    title: "DPDP Act Aligned",
    desc: "Built around India's Digital Personal Data Protection Act 2023 — notice, consent, purpose limitation, minimisation.",
  },
] as const;

