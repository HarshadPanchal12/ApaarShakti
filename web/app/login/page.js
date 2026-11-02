"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2, GraduationCap, Users, Briefcase,
  Lock, ArrowRight, ShieldAlert, RefreshCw
} from "lucide-react";
import { sb, api } from "../../lib/supabase";

const HOME = {
  officer: "/officer",
  institution: "/institution",
  student: "/student",
  verifier: "/verifier"
};

export default function Login() {
  const [email, setE] = useState("");
  const [pw, setP] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const r = useRouter();

  async function loginAs(targetEmail, targetPw) {
    setE(targetEmail);
    setP(targetPw);
    setErr("");
    setLoading(true);
    try {
      await sb.auth.signOut();
      const { error } = await sb.auth.signInWithPassword({ email: targetEmail, password: targetPw });
      if (error) throw error;
      const me = await api("/me");
      r.push(HOME[me.role] || "/");
    } catch (e) {
      setErr(e.message);
      setLoading(false);
    }
  }

  async function go() {
    if (!email || !pw) { setErr("Please supply both credentials to proceed."); return; }
    setLoading(true); setErr("");
    try {
      const { error } = await sb.auth.signInWithPassword({ email, password: pw });
      if (error) throw error;
      const me = await api("/me");
      r.push(HOME[me.role] || "/");
    } catch (e) {
      setErr(e.message);
      setLoading(false);
    }
  }

  return (
    <div className="login-page" style={{ position: "fixed", inset: 0, zIndex: 999 }}>
      <div className="login-box">
        <div className="login-logo">
          <svg width="56" height="56" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", margin: "0 auto 10px" }}>
            <circle cx="30" cy="30" r="30" fill="#003087"/>
            <circle cx="30" cy="30" r="22" fill="none" stroke="#FFB347" strokeWidth="1.8"/>
            <circle cx="30" cy="30" r="5" fill="#FFB347"/>
            {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => (
              <line key={i}
                x1="30" y1="30"
                x2={30 + 16 * Math.sin(deg * Math.PI/180)}
                y2={30 - 16 * Math.cos(deg * Math.PI/180)}
                stroke="#FFB347" strokeWidth="1.2" opacity="0.75"
              />
            ))}
            <text x="30" y="55" textAnchor="middle" fontSize="6" fill="#FFD4A8" fontWeight="bold">AICTE</text>
          </svg>
          <h2>APAAR-Verify Portal</h2>
          <p>Ministry of Education · AICTE</p>
        </div>

        <div className="login-divider"></div>

        {err && (
          <div className="alert alert-error" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldAlert size={16} />
            <span>{err}</span>
          </div>
        )}

        <div className="form-group">
          <label>Official Institutional / Regulatory Email</label>
          <input
            type="email"
            placeholder="officer@aicte.gov or institution@demo.edu"
            value={email}
            onChange={e => setE(e.target.value)}
            onKeyDown={e => e.key === "Enter" && go()}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>Authentication Passcode</label>
          <input
            type="password"
            placeholder="••••••••"
            value={pw}
            onChange={e => setP(e.target.value)}
            onKeyDown={e => e.key === "Enter" && go()}
          />
        </div>

        <button
          onClick={go}
          disabled={loading}
          style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 14 }}
        >
          {loading ? <RefreshCw size={14} className="spinner" /> : <Lock size={14} />}
          <span>{loading ? "Authenticating Token…" : "Authenticate & Access Portal"}</span>
        </button>

        <div className="login-divider"></div>

        <div style={{ marginBottom: 8, fontSize: 11, fontWeight: 700, color: "#5A6478", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Demo 1-Click Role Login:
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
          {[
            { ic: <Building2 size={20} color="#003087" />, label: "AICTE Officer", e: "officer@aicte.gov" },
            { ic: <GraduationCap size={20} color="#003087" />, label: "Institution", e: "institution@demo.edu" },
            { ic: <Users size={20} color="#003087" />, label: "Student", e: "student@demo.edu" },
            { ic: <Briefcase size={20} color="#003087" />, label: "Verifier", e: "verifier@demo.com" }
          ].map(({ ic, label, e }) => (
            <button
              key={label}
              type="button"
              disabled={loading}
              onClick={() => loginAs(e, "Password123!")}
              style={{
                textAlign: "center", padding: "10px 4px",
                background: email === e ? "#E0EDFF" : "#F8FAFF",
                border: email === e ? "2px solid #003087" : "1px solid #D1D9E6",
                borderRadius: 8, fontSize: 11, color: "#003087", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s ease",
                boxShadow: email === e ? "0 2px 6px rgba(0,48,135,0.2)" : "0 1px 2px rgba(0,0,0,0.05)"
              }}
              title={`Click to instantly log in as ${label}`}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>{ic}</div>
              <div style={{ fontWeight: 700, lineHeight: 1.2 }}>{label}</div>
            </button>
          ))}
        </div>

        <div className="login-footer">
          Secured by Supabase Auth · OAuth 2.0 / JWT · Ed25519 Signatures · DPDP Act 2023<br/>
          <a href="/verify" style={{ color: "var(--gov-navy)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4, marginTop: 4 }}>
            <span>Public Credential Verification (No Sign-In Required)</span>
            <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
