import { z } from "zod";

// ── Product constants ─────────────────────────────────────────────────────────
export const APP_CONFIG = {
  name: "APAAR-Verify",
  tagline: "Smart Student Data Management & Verification",
  description:
    "Automated validation, duplicate detection, anomaly scoring and verifiable credentials for AICTE-approved institutions.",
  version: "0.1.0",
  contact: {
    grievance: "grievance@apaar-verify.dev",
  },
} as const;

// ── Roles ─────────────────────────────────────────────────────────────────────
export const ROLES = [
  "INSTITUTION_ADMIN",
  "INSTITUTION_OPERATOR",
  "AICTE_REGIONAL_OFFICER",
  "AICTE_NATIONAL_OFFICER",
  "AICTE_POLICY_ANALYST",
  "VERIFIER",
  "STUDENT",
  "SYSTEM_ADMIN",
] as const;

export type Role = (typeof ROLES)[number];

// ── Enrolment status ──────────────────────────────────────────────────────────
export const ENROLMENT_STATUS = [
  "ACTIVE",
  "WITHDRAWN",
  "TRANSFERRED",
  "GRADUATED",
] as const;
export type EnrolmentStatus = (typeof ENROLMENT_STATUS)[number];

export const VERIFICATION_STATUS = [
  "SUBMITTED",
  "VALIDATED",
  "FLAGGED",
  "VERIFIED",
] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUS)[number];

// ── Batch status ──────────────────────────────────────────────────────────────
export const BATCH_STATUS = [
  "RECEIVED",
  "PROCESSING",
  "NEEDS_CORRECTION",
  "ACCEPTED",
  "FINAL",
] as const;
export type BatchStatus = (typeof BATCH_STATUS)[number];

// ── Seat categories ───────────────────────────────────────────────────────────
export const DEFAULT_SEAT_CATEGORIES = [
  { code: "GENERAL", label: "General", countsTowardIntake: true },
  { code: "SC", label: "Scheduled Caste", countsTowardIntake: true },
  { code: "ST", label: "Scheduled Tribe", countsTowardIntake: true },
  { code: "OBC", label: "Other Backward Class", countsTowardIntake: true },
  { code: "EWS", label: "Economically Weaker Section", countsTowardIntake: true },
  { code: "PwD", label: "Persons with Disability", countsTowardIntake: true },
  {
    code: "SUPERNUMERARY_TFW",
    label: "Tuition Fee Waiver (Supernumerary)",
    countsTowardIntake: false,
    maxPctOfIntake: 5,
  },
  {
    code: "NRI",
    label: "NRI",
    countsTowardIntake: false,
    maxPctOfIntake: 15,
  },
  { code: "OCI", label: "OCI", countsTowardIntake: false, maxPctOfIntake: 15 },
  { code: "FN", label: "Foreign National", countsTowardIntake: false, maxAbsolute: 10 },
] as const;

// ── Validation rule codes ─────────────────────────────────────────────────────
export const RULE_CODES = [
  "SCHEMA_REQUIRED_FIELDS",
  "APAAR_FORMAT",
  "APAAR_NOT_FOUND",
  "APAAR_IDENTITY_MISMATCH",
  "DUP_IN_BATCH",
  "DUP_ACROSS_INSTITUTIONS",
  "FUZZY_GHOST_CANDIDATE",
  "INTAKE_EXCEEDED",
  "CATEGORY_LIMIT_EXCEEDED",
  "CATEGORY_CONSISTENCY",
  "AGE_PLAUSIBILITY",
  "DATE_WINDOW",
  "PROGRAM_NOT_APPROVED",
  "LATE_SUBMISSION",
] as const;

export type RuleCode = (typeof RULE_CODES)[number];

// ── Zod schemas ───────────────────────────────────────────────────────────────
export const ApaarTokenSchema = z
  .string()
  .regex(/^\d{12}$/, "APAAR ID must be exactly 12 digits");

export const StudentRowSchema = z.object({
  apaar_id: ApaarTokenSchema,
  full_name: z.string().min(2).max(200),
  dob: z.string().date("Date must be YYYY-MM-DD"),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]),
  program_name: z.string().min(2).max(200),
  seat_category: z.string(),
  admission_date: z.string().date(),
  academic_year: z.string().regex(/^\d{4}-\d{2}$/, "Format: 2026-27"),
  nationality: z.string().optional(),
});

export type StudentRow = z.infer<typeof StudentRowSchema>;

// ── API response envelope ─────────────────────────────────────────────────────
export interface ApiSuccess<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
    request_id: string;
  };
}

