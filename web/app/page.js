"use client";
import {
  ShieldCheck, Search, Users, BarChart3, Lock,
  Award, Sparkles, Database, FileSpreadsheet,
  CheckCircle2, ArrowRight, Building2, GraduationCap, Briefcase
} from "lucide-react";

export default function Home() {
  const features = [
    { icon: <Search size={24} className="text-blue-800" />, title: "APAAR-Keyed Validation", desc: "Every student record is validated against the 12-digit national APAAR ID the moment it is submitted — no batch delays." },
    { icon: <Users size={24} className="text-blue-800" />, title: "Ghost Student Detection", desc: "Cross-institution duplicate enrolments identified in real time using national-level APAAR registry cross-checks." },
    { icon: <BarChart3 size={24} className="text-blue-800" />, title: "Intake Cap Enforcement", desc: "AICTE Approval Process Handbook intake limits enforced automatically per program, including supernumerary quotas." },
    { icon: <Sparkles size={24} className="text-blue-800" />, title: "Zero Manual Routine Work", desc: "100% of routine validation, credential signing and audit logging runs autonomously. Officers handle only exceptions." },
    { icon: <Lock size={24} className="text-blue-800" />, title: "DPDP Act 2023 Compliance", desc: "Sensitive PII encrypted at rest. Third-party verification requires student consent with granular field-level access control." },
    { icon: <Award size={24} className="text-blue-800" />, title: "Ed25519 Digital Credentials", desc: "Every enrolled student receives an unforgeable cryptographically-signed QR credential printable on degree certificates." },
    { icon: <Database size={24} className="text-blue-800" />, title: "Anomaly Intelligence", desc: "Peer Z-score statistical engine flags quota spikes and fill-rate outliers across institutions — explained in plain language." },
    { icon: <FileSpreadsheet size={24} className="text-blue-800" />, title: "ERP API Integration", desc: "Institutions can push CSV rosters directly from SAP, TCS iON or any ERP via secure API key without manual login." },
  ];

  const steps = [
    { n: "01", title: "Institution Submits", desc: "Upload APAAR-keyed student roster via portal or direct ERP API integration." },
    { n: "02", title: "Autonomous Pipeline", desc: "14-rule engine runs: format, registry, identity, duplicates, intake caps and anomalies." },
    { n: "03", title: "Regulatory Oversight", desc: "Officer dashboard shows all institutions with real-time fill rates, open flags and analytics." },
    { n: "04", title: "Cryptographic Verification", desc: "Scan QR on certificate. Ed25519 signature verified. Student controls what data is shared." },
  ];

  const roles = [
    { icon: <Building2 size={24} className="text-blue-800" />, title: "AICTE Officers", desc: "Monitor all institutions, run anomaly scans, resolve discrepancies, export regulatory audit PDFs." },
    { icon: <GraduationCap size={24} className="text-blue-800" />, title: "Approved Institutions", desc: "Upload enrolment data, see instant automated feedback, respond to AICTE clarifications." },
    { icon: <Users size={24} className="text-blue-800" />, title: "Students", desc: "View digital credentials, approve or withdraw field-level consent for verifiers." },
    { icon: <Briefcase size={24} className="text-blue-800" />, title: "Employers & Verifiers", desc: "Request background verification with a stated purpose. Access only consented, decrypted fields." },
  ];

  const stats = [
    { val: "100K+", label: "Throughput Capacity", sub: "Records validated under 60s" },
    { val: "14 Rules", label: "Automated Inspection", sub: "AICTE APH standards compliant" },
    { val: "Ed25519", label: "Cryptographic Signing", sub: "Tamper-evident credential seal" },
    { val: "Zero", label: "Manual Routine Triage", sub: "Autonomous first-pass execution" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="hero-gov">
        <div className="hero-gov-content">
          <div className="eyebrow">
            SIH26263 · Smart Automation · AICTE National Regulator
          </div>
          <h1>
            From enrolment totals<br />to <span>verified student data.</span>
          </h1>
          <p>
            AICTE currently receives only aggregate statistics. APAAR-Verify transforms this —
            automating student-level validation, detecting cross-institution ghost enrolments,
            enforcing intake caps, and issuing Ed25519 cryptographic credentials instantly.
          </p>
          <div className="hero-cta-row">
            <a className="hero-btn hero-btn-primary" href="/login">
              <span>Access Regulatory Portal</span>
              <ArrowRight size={16} />
            </a>
            <a className="hero-btn hero-btn-outline" href="/verify">
              <ShieldCheck size={16} />
              <span>Verify a Credential</span>
            </a>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <div className="kpi-grid" style={{ marginBottom: 32 }}>
        {stats.map((s) => (
          <div className="kpi-card" key={s.label}>
            <div>
              <div className="kpi-label">{s.label}</div>
              <div className="kpi-value" style={{ fontSize: 22 }}>{s.val}</div>
              <div className="kpi-sub">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="tricolor"></div>

      {/* Features */}
      <div className="section-header">
        <h2>Autonomous Validation & Security Matrix</h2>
        <div className="section-divider"></div>
      </div>
      <div className="features-grid">
        {features.map((f) => (
          <div className="feature-card" key={f.title}>
            <div style={{ marginBottom: 12 }}>{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="tricolor"></div>

      {/* How it works */}
      <div className="section-header">
        <h2>End-to-End Architectural Pipeline</h2>
        <div className="section-divider"></div>
      </div>
      <div className="steps-grid">
        {steps.map((s) => (
          <div className="step-card" key={s.n}>
            <div className="step-num">{s.n}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="tricolor"></div>

      {/* Who it serves */}
      <div className="section-header">
        <h2>Integrated Stakeholder Portals</h2>
        <div className="section-divider"></div>
      </div>
      <div className="features-grid">
        {roles.map((r) => (
          <div className="feature-card" key={r.title}>
            <div style={{ marginBottom: 12 }}>{r.icon}</div>
            <h3>{r.title}</h3>
            <p>{r.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA bottom */}
      <div className="card" style={{ textAlign: "center", padding: "36px 24px", background: "linear-gradient(135deg,#F0F4FF,#FFF7ED)" }}>
        <h2 style={{ fontFamily: "'Noto Serif',serif", color: "var(--gov-navy)", marginBottom: 10 }}>
          Experience Continuous Student Data Integrity
        </h2>
        <p style={{ color: "var(--gov-muted)", marginBottom: 20, fontSize: 14 }}>
          Log in with your authorized credentials or cryptographically inspect any issued credential code.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/login" className="btn btn-primary">
            <span>Login to Portal</span>
            <ArrowRight size={14} />
          </a>
          <a href="/verify" className="btn btn-saffron">
            <ShieldCheck size={14} />
            <span>Verify Credential Code</span>
          </a>
        </div>
      </div>
    </>
  );
}
