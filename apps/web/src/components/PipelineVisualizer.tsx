"use client";

import { useState } from "react";
import { 
  Upload, 
  ShieldCheck, 
  GitMerge, 
  Brain, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  Clock, 
  Layers 
} from "lucide-react";

interface StepDetail {
  id: number;
  title: string;
  subtitle: string;
  speed: string;
  statusText: string;
  description: string;
  features: string[];
  samplePayload: {
    input: string;
    engine: string;
    outcome: string;
  };
}

const PIPELINE_STEPS: StepDetail[] = [
  {
    id: 1,
    title: "1. Vectorized Ingestion",
    subtitle: "High-speed CSV / XLSX / API parsing",
    speed: "< 60s for 100k rows",
    statusText: "AUTOMATED",
    description:
      "Institutions submit student-level data via file upload or ERP API. The ingestion pipeline uses Polars with streaming memory management, computing file hashes and validating data formats in a single vectorized pass.",
    features: [
      "Vectorized Polars ingestion engine with chunked DB COPY",
      "API key machine access for campus ERP synchronization",
      "Automatic column mapping with fuzzy header resolution",
      "SHA-256 batch file integrity fingerprinting",
    ],
    samplePayload: {
      input: "25,000 students CSV batch from Institution 1-10294",
      engine: "Polars Ingestion Worker (Core / Ingestion Module)",
      outcome: "25,000 batch_rows created, SHA256 verified, status: PROCESSING",
    },
  },
  {
    id: 2,
    title: "2. Pluggable 14-Rule Engine",
    subtitle: "Intake caps, supernumerary, age & dates",
    speed: "0.2ms / row",
    statusText: "AUTOMATED",
    description:
      "Evaluates 14 deterministic validation rules: approved intake limits, supernumerary category quotas (TFW 5%, NRI 15%, FN 10), date window compliance, and APAAR format authenticity via the Mock APAAR Registry adapter.",
    features: [
      "Intake cap arithmetic factoring in non-supernumerary seats",
      "Category share boundary enforcement (TFW, NRI, OCI, FN)",
      "Age plausibility checks by academic qualification level",
      "Instant downloadable annotated error CSV with suggested fixes",
    ],
    samplePayload: {
      input: "Row #412: B.Tech CSE, Category: GENERAL, Count: 181 (Cap: 180)",
      engine: "Rule: INTAKE_EXCEEDED (Severity: ERROR)",
      outcome: "Finding recorded: 'Programme intake exceeded by 1 student. Suggested fix: Transfer to valid supernumerary quota.'",
    },
  },
  {
    id: 3,
    title: "3. Duplicate & Ghost Matcher",
    subtitle: "Cross-institution double enrolment detection",
    speed: "Sub-second cluster scan",
    statusText: "AUTOMATED",
    description:
      "Compares student tokens across all 3,800+ institutions. Uses RapidFuzz and Double Metaphone phonetic matching on name and DOB components to catch deliberate identity disguises and double enrolments.",
    features: [
      "Cross-institution active enrolment conflict detector",
      "Double Metaphone phonetic similarity on student names",
      "Fuzzy ghost detection for slight spelling or DOB variations",
      "Auto-freezes verification status and creates joint officer cases",
    ],
    samplePayload: {
      input: "Student 'Rohan Sharma' (DOB: 2004-05-12) active in Inst A & Inst B",
      engine: "Matching Module: DUP_ACROSS_INSTITUTIONS (Confidence: 100%)",
      outcome: "Created duplicate_case #DC-904; alerted both institutions; status FROZEN",
    },
  },
  {
    id: 4,
    title: "4. ML Anomaly & Early Warning",
    subtitle: "IsolationForest & Peer Robust Z-Score",
    speed: "Nightly & streaming",
    statusText: "AUTOMATED",
    description:
      "Computes 3–5 year longitudinal baseline vectors. Flags quota spikes (e.g., sudden NRI surges), 100% cap streaks, and projects daily admission trajectories to warn officers before the admission window closes.",
    features: [
      "IsolationForest unsupervised anomaly detection on quota vectors",
      "Robust z-score (median/MAD) peer group benchmarking",
      "Early-warning admission pace forecast curve (early intervention)",
      "Plain-language explanation synthesis with transparent reason codes",
    ],
    samplePayload: {
      input: "Institution 1-3829 NRI admissions jumped from 4% to 21% YoY",
      engine: "Anomaly Module: NRI_SHARE_SPIKE + IsolationForest score 0.89",
      outcome: "Anomaly flag raised: 'NRI admissions rose 17% above peer median (5%). Clarification requested.'",
    },
  },
  {
    id: 5,
    title: "5. Ed25519 Verifiable Credential",
    subtitle: "Cryptographic QR codes & offline verify",
    speed: "Instant issuance",
    statusText: "AUTOMATED",
    description:
      "When an enrolment is validated, the system automatically signs canonical JSON with Ed25519 (PyNaCl) and produces a verifiable QR code. Employers and universities can verify students offline without accessing any database.",
    features: [
      "Ed25519 asymmetrical signature over canonical enrolment JSON",
      "Public key published at /.well-known/apaar-verify-keys.json",
      "Public verification portal at /v/[short_code] with instant green check",
      "Consent-first verification for employers with field-level student approval",
    ],
    samplePayload: {
      input: "Enrolment ID #ENR-2026-9812 verified and approved",
      engine: "Credentials Module: PyNaCl Ed25519 Keypair Signer",
      outcome: "Signature created, QR generated with target https://apaar-verify.gov/v/8f92a1",
    },
  },
];

export function PipelineVisualizer() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const current = PIPELINE_STEPS.find((s) => s.id === activeStep) || PIPELINE_STEPS[0];

  return (
    <section id="pipeline" className="py-20 relative border-t border-slate-900 bg-slate-950/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-300 border border-teal-500/20 mb-3">
            <Layers className="h-3.5 w-3.5" />
            <span>End-to-End Autonomous Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How APAAR-Verify <span className="gradient-text">Automates the Routine</span>
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Every file or API push flows through 5 automated checkpoints. Humans only review when an anomaly flag or cross-institution duplicate is raised.
          </p>
        </div>

        {/* Step Buttons Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-8">
          {PIPELINE_STEPS.map((step) => {
            const isActive = step.id === activeStep;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`flex flex-col text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-950/80 border-indigo-500 shadow-lg shadow-indigo-500/20"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className={`text-xs font-mono font-bold ${
                      isActive ? "text-indigo-400" : "text-slate-500"
                    }`}
                  >
                    STEP 0{step.id}
                  </span>
                  <span className="text-[10px] rounded bg-emerald-500/15 px-1.5 py-0.2 font-mono text-emerald-400 font-semibold border border-emerald-500/30">
                    AUTO
                  </span>
                </div>
                <div
                  className={`text-sm font-semibold truncate ${
                    isActive ? "text-white" : "text-slate-300"
                  }`}
                >
                  {step.title.split(". ")[1]}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{step.speed}</div>
              </button>
            );
          })}
        </div>

        {/* Active Step Deep-Dive Card */}
        <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 cols: description & features */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-mono font-bold text-sm">
                  {current.id}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-white">{current.title}</h3>
                  <p className="text-xs text-indigo-400 font-mono">{current.subtitle}</p>
                </div>
              </div>

              <p className="mt-4 text-slate-300 text-sm leading-relaxed">{current.description}</p>

              <div className="mt-6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  Key Capabilities in this Stage
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {current.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 5 cols: Live engine simulation box */}
            <div className="lg:col-span-5 rounded-xl bg-slate-900 border border-slate-800 p-5 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-indigo-400" />
                  PIPELINE TELEMETRY
                </span>
                <span className="text-teal-400 font-bold">{current.speed}</span>
              </div>

              <div className="space-y-3 text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px]">INCOMING INPUT:</span>
                  <div className="mt-1 p-2 rounded bg-slate-950 border border-slate-800/80 text-indigo-300 break-words">
                    {current.samplePayload.input}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">EXECUTING ENGINE:</span>
                  <div className="mt-1 p-2 rounded bg-slate-950 border border-slate-800/80 text-amber-300 break-words">
                    {current.samplePayload.engine}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">AUTOMATED RESULT:</span>
                  <div className="mt-1 p-2 rounded bg-slate-950 border border-slate-800/80 text-teal-300 break-words">
                    {current.samplePayload.outcome}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Human Review Required?</span>
                <span className="text-emerald-400 font-bold">No — Auto Processed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

