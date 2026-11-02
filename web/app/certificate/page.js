"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Suspense } from "react";
import { Printer, ShieldCheck, ExternalLink, AlertTriangle, RefreshCw, Lock } from "lucide-react";

function CertificateContent() {
  const params = useSearchParams();
  const code = params.get("code");
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/verify/${code}`)
      .then(r => r.json())
      .then(d => { setInfo(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [code]);

  const verifyUrl = `${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}/verify?code=${code}`;

  if (!code) return (
    <div className="card" style={{ textAlign: "center", padding: 40 }}>
      <p style={{ color: "var(--gov-muted)" }}>No credential code specified.</p>
    </div>
  );

  if (loading) return (
    <div className="card" style={{ textAlign: "center", padding: 40 }}>
      <RefreshCw size={28} className="spinner text-blue-800" style={{ margin: "0 auto 12px" }} />
      <p style={{ color: "var(--gov-muted)" }}>Retrieving cryptographic verification parameters…</p>
    </div>
  );

  if (!info?.valid) return (
    <div className="card" style={{ textAlign: "center", padding: 40 }}>
      <AlertTriangle size={36} className="text-rose-700" style={{ margin: "0 auto 12px" }} />
      <h3 style={{ color: "var(--gov-red)", marginBottom: 8 }}>Invalid Credential Record</h3>
      <p style={{ color: "var(--gov-muted)" }}>This code does not match an active approved enrolment.</p>
    </div>
  );

  return (
    <>
      <div className="page-title-bar noprint">
        <h2>Verifiable Certificate Footer Block</h2>
        <p>Standardized QR Embed for Degree Certificates & Student ID Cards · AICTE Smart Automation</p>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Certificate Block */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ height: 6, background: "linear-gradient(90deg, #FF6B00 33.33%, white 33.33%, white 66.67%, #138808 66.67%)" }}></div>

          <div style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="22" cy="22" r="22" fill="#003087"/>
                <circle cx="22" cy="22" r="16" fill="none" stroke="#FFB347" strokeWidth="1.2"/>
                <circle cx="22" cy="22" r="3.5" fill="#FFB347"/>
                {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg,i) => (
                  <line key={i} x1="22" y1="22"
                    x2={22 + 12 * Math.sin(deg * Math.PI/180)}
                    y2={22 - 12 * Math.cos(deg * Math.PI/180)}
                    stroke="#FFB347" strokeWidth="1" opacity="0.7"
                  />
                ))}
              </svg>
              <div>
                <div style={{ fontSize: 10, color: "var(--gov-saffron)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
                  All India Council for Technical Education
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--gov-navy)", marginTop: 2 }}>
                  APAAR Verified Enrolment Certification
                </div>
                <div style={{ fontSize: 11, color: "var(--gov-muted)", marginTop: 2 }}>
                  Ministry of Education, Government of India
                </div>
              </div>
            </div>

            <div className="cert-block">
              <QRCodeSVG
                value={verifyUrl}
                size={100}
                fgColor="#003087"
                style={{ flexShrink: 0 }}
              />
              <div className="cert-info">
                <h3>{info.institution}</h3>
                <p>Program: <strong>{info.program}</strong> ({info.year})</p>
                <p>Credential Code: <span className="apaar-id">{code}</span></p>
                <p style={{ marginTop: 8 }}>
                  <span className="badge badge-active" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <ShieldCheck size={11} />
                    <span>Ed25519 Cryptographically Signed</span>
                  </span>
                </p>
                <p style={{ marginTop: 6, fontSize: 11 }}>Scan to verify institutional authenticity</p>
              </div>
            </div>

            <div style={{
              marginTop: 20, padding: "10px 16px",
              background: "#F8FAFF", borderRadius: 8,
              fontSize: 11, color: "var(--gov-muted)",
              display: "flex", alignItems: "center", gap: 8
            }}>
              <Lock size={13} />
              <span>
                Digitally authenticated with asymmetric Ed25519 signature · Zero private identifying data exposed · DPDP Act 2023 Compliant
              </span>
            </div>
          </div>

          <div style={{ height: 4, background: "linear-gradient(90deg, #FF6B00 33.33%, white 33.33%, white 66.67%, #138808 66.67%)" }}></div>
        </div>

        <div className="btn-group noprint" style={{ marginTop: 16 }}>
          <button className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={14} />
            <span>Print Certificate Footer</span>
          </button>
          <a href={`/verify?code=${code}`} className="btn btn-outline" style={{ textDecoration: "none" }}>
            <ExternalLink size={14} />
            <span>Inspect Signature Online</span>
          </a>
        </div>
      </div>
    </>
  );
}

export default function Certificate() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: 40 }}><RefreshCw size={24} className="spinner" /></div>}>
      <CertificateContent />
    </Suspense>
  );
}
