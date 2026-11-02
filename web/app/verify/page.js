"use client";
import { useState } from "react";
import {
  ShieldCheck, ShieldAlert, Search, CheckCircle2,
  Lock, Building2, GraduationCap, Calendar, RefreshCw
} from "lucide-react";

export default function Verify() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function verify() {
    const c = code.trim();
    if (!c) { setErr("Please enter a valid credential code."); return; }
    setLoading(true); setErr(""); setResult(null);
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/verify/${c}`);
      setResult(await r.json());
    } catch { setErr("Verification service currently unreachable. Please retry momentarily."); }
    setLoading(false);
  }

  return (
    <>
      <div className="page-title-bar">
        <h2>Cryptographic Credential Verification</h2>
        <p>Public Verification Interface · Offline-Capable Ed25519 Signature Inspection · DPDP Act 2023 Compliant</p>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div className="card">
          <div className="card-header">
            <h3>
              <div className="section-icon"><Search size={16} /></div>
              <span>Credential Verification Engine</span>
            </h3>
          </div>

          <div className="alert alert-info" style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Lock size={16} />
            <span style={{ fontSize: 13 }}>
              Enter the unique credential code located on the student&apos;s degree certificate footer or student ID card.
              Signature verification is executed without disclosing private identifying information.
            </span>
          </div>

          {err && (
            <div className="alert alert-error" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ShieldAlert size={16} />
              <span>{err}</span>
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <input
              placeholder="Unique Credential Code (e.g. 2F2pZsZiL7E)"
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={e => e.key === "Enter" && verify()}
              style={{ flex: 1 }}
            />
            <button
              className="btn btn-primary"
              onClick={verify}
              disabled={loading}
              style={{ flexShrink: 0 }}
            >
              {loading ? <RefreshCw size={14} className="spinner" /> : <ShieldCheck size={14} />}
              <span>Verify Signature</span>
            </button>
          </div>

          {result && (
            <div style={{ marginTop: 24 }}>
              {result.valid ? (
                <div style={{
                  background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)",
                  border: "2px solid #22C55E",
                  borderRadius: 12,
                  padding: "24px",
                  textAlign: "center"
                }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                    <CheckCircle2 size={48} className="text-emerald-700" />
                  </div>
                  <h3 style={{ color: "#14532D", fontSize: 18, marginBottom: 4 }}>Authentic AICTE Credential Verified</h3>
                  <p style={{ color: "#166534", marginBottom: 20, fontSize: 13 }}>
                    Cryptographic signature is mathematically valid · Issued under official AICTE approved intake
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, textAlign: "left" }}>
                    {[
                      [<Building2 key="inst" size={13} />, "AICTE Approved Institution", result.institution],
                      [<GraduationCap key="prog" size={13} />, "Approved Academic Program", result.program],
                      [<Calendar key="yr" size={13} />, "Academic Enrolment Window", result.year],
                      [<ShieldCheck key="st" size={13} />, "Regulatory Status", result.status],
                    ].map(([icon, label, val], idx) => (
                      <div key={idx} style={{
                        background: "white", border: "1px solid #BBF7D0",
                        borderRadius: 8, padding: "10px 14px"
                      }}>
                        <div style={{ fontSize: 11, color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: 5 }}>
                          {icon}
                          <span>{label}</span>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#14532D", marginTop: 2 }}>{val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 16, padding: "8px 14px", background: "white", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "#166534" }}>
                    <Lock size={12} />
                    <span>Cryptographic proof generated by Ed25519 signature algorithm · Zero PII disclosure</span>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: "#FEF2F2", border: "2px solid #EF4444",
                  borderRadius: 12, padding: 24, textAlign: "center"
                }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                    <ShieldAlert size={48} className="text-rose-700" />
                  </div>
                  <h3 style={{ color: "#B91C1C", fontSize: 18, marginBottom: 4 }}>Invalid or Tampered Credential</h3>
                  <p style={{ color: "#991B1B", fontSize: 13 }}>
                    This credential code does not correspond to any valid AICTE enrolment record,
                    or the underlying cryptographic signature failed verification.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
