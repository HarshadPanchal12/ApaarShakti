"use client";
import { useEffect, useState } from "react";
import {
  Award, ShieldCheck, Lock, CheckCircle2,
  XCircle, Clock, AlertCircle, RefreshCw, UserCheck
} from "lucide-react";
import { api } from "../../lib/supabase";

const FIELD_LABELS = {
  name: "Full Legal Name",
  dob: "Date of Birth",
  gender: "Gender Identity",
  program: "Enrolled Program",
  institution: "AICTE Institution",
  year: "Academic Year Window",
};

export default function Student() {
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [err, setErr] = useState("");
  const [consentModal, setConsentModal] = useState(null);
  const [selectedFields, setSelectedFields] = useState([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);

  const load = () => {
    api("/me").then(setProfile).catch(e => setErr(e.message));
    api("/student/requests").then(setRequests).catch(() => {});
  };
  useEffect(() => {
    load();
  }, []);

  function openConsent(req) {
    setConsentModal(req);
    setSelectedFields(["program", "institution"]);
    setDays(30);
  }

  async function approve() {
    setLoading(true);
    await api(`/student/requests/${consentModal.id}/decide`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approve: true, fields: selectedFields, days }),
    });
    setConsentModal(null); setLoading(false); load();
  }

  async function deny() {
    setLoading(true);
    await api(`/student/requests/${consentModal.id}/decide`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approve: false, fields: [], days: 0 }),
    });
    setConsentModal(null); setLoading(false); load();
  }

  function toggleField(f) {
    setSelectedFields(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  }

  const pendingReqs = requests.filter(r => r.status === "PENDING");
  const approvedReqs = requests.filter(r => r.status === "APPROVED");

  return (
    <>
      <div className="page-title-bar">
        <h2>Student Digital Credential & Privacy Locker</h2>
        <p>Personal APAAR Credential · Granular Field-Level Consent Manager · DPDP Act 2023</p>
      </div>

      {err && (
        <div className="alert alert-error" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <AlertCircle size={16} />
          <span>{err}</span>
        </div>
      )}

      {/* Credential Card */}
      {profile && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <h3>
              <div className="section-icon"><Award size={16} /></div>
              <span>Verified Student APAAR Credential</span>
            </h3>
            <span className="badge badge-active" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <ShieldCheck size={11} />
              <span>Ed25519 Validated</span>
            </span>
          </div>
          <div className="cert-block">
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: 72, height: 72, background: "var(--gov-navy)",
                borderRadius: 8, display: "flex", alignItems: "center",
                justifyContent: "center", color: "white"
              }}>
                <UserCheck size={32} />
              </div>
            </div>
            <div className="cert-info">
              <h3>National Student Identity</h3>
              <p>APAAR ID: <span className="apaar-id">{profile.apaar_id || "Active Enrolment Recorded"}</span></p>
              <p>Regulatory Authority: All India Council for Technical Education (AICTE)</p>
              <p style={{ marginTop: 8 }}>
                <span className="badge badge-ok">Cryptographically Authenticated</span>&nbsp;
                <span className="badge badge-info">DPDP Act 2023 Protected</span>
              </p>
            </div>
          </div>
          <div className="alert alert-info" style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Lock size={16} />
            <span>
              Your sensitive personal information (Date of Birth, Name) is protected by <strong>Fernet symmetric envelope encryption</strong> at rest.
              Third parties cannot access any records without your explicit, time-bounded consent.
            </span>
          </div>
        </div>
      )}

      {/* Verification Requests */}
      <div className="card">
        <div className="card-header">
          <h3>
            <div className="section-icon"><Lock size={16} /></div>
            <span>Consent Authorizations</span>
          </h3>
          {pendingReqs.length > 0 && <span className="badge badge-warn">Pending Requests: {pendingReqs.length}</span>}
        </div>

        {pendingReqs.length === 0 && approvedReqs.length === 0 && (
          <div style={{ textAlign: "center", padding: 32, color: "var(--gov-muted)" }}>
            <Clock size={36} className="text-gray-400" style={{ margin: "0 auto 12px" }} />
            <p>No active verification requests from employers or academic institutions.</p>
          </div>
        )}

        {pendingReqs.length > 0 && (
          <>
            <div className="alert alert-warn" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <AlertCircle size={16} />
              <span>You have <strong>{pendingReqs.length}</strong> pending verification request(s) requiring your consent decision.</span>
            </div>
            {pendingReqs.map(req => (
              <div className="consent-card" key={req.id}>
                <div className="req-from">Requester Organization: {req.verifier_name || "Authorized Third-Party Verifier"}</div>
                <div className="req-purpose">Stated Legal Verification Purpose: {req.purpose}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button className="btn btn-success btn-sm" onClick={() => openConsent(req)}>
                    <CheckCircle2 size={13} />
                    <span>Review & Grant Consent</span>
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => { setConsentModal(req); deny(); }}>
                    <XCircle size={13} />
                    <span>Decline Access</span>
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {approvedReqs.length > 0 && (
          <>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--gov-navy)", margin: "20px 0 12px" }}>
              Active Authorized Disclosures
            </h4>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Verifier Entity</th><th>Stated Purpose</th><th>Disclosed Field Vectors</th><th>Consent Expiry</th><th>Status</th></tr></thead>
                <tbody>
                  {approvedReqs.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>{r.verifier_name || "Third Party"}</td>
                      <td style={{ fontSize: 12, color: "var(--gov-muted)" }}>{r.purpose}</td>
                      <td>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {(r.fields || []).map(f => (
                            <span key={f} className="badge badge-info" style={{ fontSize: 10 }}>{FIELD_LABELS[f] || f}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{ fontSize: 12 }}>{r.expires_at ? new Date(r.expires_at).toLocaleDateString("en-IN") : "—"}</td>
                      <td><span className="badge badge-active">Active Consent</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Consent Modal */}
      {consentModal && (
        <div className="modal-overlay" onClick={() => setConsentModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Authorize Granular Field Disclosure</h3>
            <div className="alert alert-info" style={{ marginBottom: 16 }}>
              <span>
                <strong>{consentModal.verifier_name || "An employer or institution"}</strong> requested credential verification.<br/>
                Purpose: <em>{consentModal.purpose}</em>
              </span>
            </div>

            <div className="form-group">
              <label>Select field vectors to disclose (Data Minimization Principle)</label>
              <div className="field-chips">
                {Object.entries(FIELD_LABELS).map(([key, label]) => (
                  <span
                    key={key}
                    className={`field-chip ${selectedFields.includes(key) ? "selected" : ""}`}
                    onClick={() => toggleField(key)}
                  >
                    {selectedFields.includes(key) ? "✓" : "+"} {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Authorization Validity Window (Days)</label>
              <input
                type="number"
                min="1" max="365"
                value={days}
                onChange={e => setDays(Number(e.target.value))}
                style={{ maxWidth: 120 }}
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setConsentModal(null)}>Cancel</button>
              <button className="btn btn-danger btn-sm" onClick={deny}>Decline</button>
              <button
                className="btn btn-success"
                onClick={approve}
                disabled={selectedFields.length === 0 || loading}
              >
                {loading ? <RefreshCw size={13} className="spinner" /> : <CheckCircle2 size={13} />}
                <span>Grant Consent</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
