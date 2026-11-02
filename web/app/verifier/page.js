"use client";
import { useEffect, useState } from "react";
import {
  FileText, Send, CheckCircle2, Clock,
  ShieldCheck, AlertCircle, RefreshCw, Building2
} from "lucide-react";
import { api } from "../../lib/supabase";

export default function Verifier() {
  const [apaarId, setApaarId] = useState("");
  const [purpose, setPurpose] = useState("");
  const [requests, setRequests] = useState([]);
  const [msg, setMsg] = useState({ text: "", type: "info" });
  const [loading, setLoading] = useState(false);

  const load = () => {
    api("/verifier/requests").then(setRequests).catch(() => {});
  };
  useEffect(() => {
    load();
  }, []);

  const notify = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "info" }), 4500);
  };

  async function submit() {
    if (!apaarId.match(/^\d{12}$/)) { notify("APAAR ID must be an exact 12-digit numeric identifier.", "error"); return; }
    if (!purpose.trim()) { notify("A lawful verification purpose must be documented.", "error"); return; }
    setLoading(true);
    try {
      await api("/verifier/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apaar_id: apaarId, purpose }),
      });
      notify("Verification request logged. Awaiting student consent authorization.");
      setApaarId(""); setPurpose("");
      load();
    } catch (e) { notify(e.message, "error"); }
    setLoading(false);
  }

  const pending = requests.filter(r => r.status === "PENDING");
  const approved = requests.filter(r => r.status === "APPROVED");

  return (
    <>
      <div className="page-title-bar">
        <h2>Authorized Verifier Portal</h2>
        <p>Pre-Employment & Academic Credential Checks · Consent-Governed Data Disclosure · DPDP Act 2023</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20, alignItems: "start" }}>
        {/* Request Form */}
        <div className="card" style={{ position: "sticky", top: 80 }}>
          <div className="card-header">
            <h3>
              <div className="section-icon"><FileText size={16} /></div>
              <span>Initiate Verification Request</span>
            </h3>
          </div>

          <div className="alert alert-info" style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 12 }}>
              In accordance with DPDP Act 2023 principles, the student must review your stated purpose and authorize disclosure before data access is granted.
            </span>
          </div>

          {msg.text && (
            <div className={`alert alert-${msg.type}`} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {msg.type === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              <span>{msg.text}</span>
            </div>
          )}

          <div className="form-group">
            <label>Student APAAR Identifier</label>
            <input
              placeholder="12-digit APAAR ID"
              value={apaarId}
              onChange={e => setApaarId(e.target.value.replace(/\D/g, "").slice(0, 12))}
              maxLength={12}
            />
            <div style={{ fontSize: 11, color: "var(--gov-muted)", marginTop: 4 }}>
              {apaarId.length}/12 Digits Entered
            </div>
          </div>

          <div className="form-group">
            <label>Formal Verification Purpose</label>
            <textarea
              rows={3}
              placeholder="e.g. Pre-employment credential authentication for Associate Engineer role..."
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              style={{ resize: "none" }}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={submit}
            disabled={loading}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {loading ? <RefreshCw size={14} className="spinner" /> : <Send size={14} />}
            <span>Dispatch Request to Student</span>
          </button>
        </div>

        {/* Requests Feed */}
        <div>
          {/* KPI Mini */}
          <div className="kpi-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="kpi-card">
              <div className="kpi-icon blue"><FileText size={20} className="text-blue-700" /></div>
              <div>
                <div className="kpi-label">Total Requests</div>
                <div className="kpi-value">{requests.length}</div>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon saffron"><Clock size={20} className="text-amber-700" /></div>
              <div>
                <div className="kpi-label">Pending Consent</div>
                <div className="kpi-value">{pending.length}</div>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon green"><ShieldCheck size={20} className="text-emerald-700" /></div>
              <div>
                <div className="kpi-label">Approved & Disclosed</div>
                <div className="kpi-value">{approved.length}</div>
              </div>
            </div>
          </div>

          {/* Approved Requests */}
          {approved.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3>
                  <div className="section-icon"><ShieldCheck size={16} /></div>
                  <span>Authorized Disclosures</span>
                </h3>
              </div>
              {approved.map(r => (
                <div key={r.id} style={{
                  border: "1px solid var(--gov-border)", borderRadius: 10, padding: 16,
                  marginBottom: 12, background: "#F0FDF4", borderLeft: "4px solid var(--gov-green)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <code style={{ fontWeight: 700, color: "var(--gov-navy)", fontSize: 14 }}>{r.apaar_id}</code>
                    <span className="badge badge-active">Authorized Access</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--gov-muted)", marginBottom: 10 }}>
                    Legal Purpose: {r.purpose}
                  </div>
                  {(r.disclosed || r.data) && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gov-green)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                        <CheckCircle2 size={14} />
                        <span>Student-Consented Decrypted Credential Data:</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
                        {Object.entries(r.disclosed || r.data).map(([k, v]) => (
                          <div key={k} style={{ background: "white", border: "1px solid var(--gov-border)", borderRadius: 8, padding: "10px 14px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                            <div style={{ fontSize: 10, color: "var(--gov-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{k}</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--gov-navy)", marginTop: 2 }}>{v || "—"}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {r.expires_at && (
                    <div style={{ marginTop: 8, fontSize: 11, color: "var(--gov-muted)" }}>
                      Authorization Expiry: {new Date(r.expires_at).toLocaleDateString("en-IN")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pending */}
          {pending.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3>
                  <div className="section-icon"><Clock size={16} /></div>
                  <span>Awaiting Student Authorization</span>
                </h3>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>APAAR ID</th><th>Purpose</th><th>Requested At</th><th>Status</th></tr></thead>
                  <tbody>
                    {pending.map(r => (
                      <tr key={r.id}>
                        <td><code style={{ fontWeight: 700, color: "var(--gov-navy)" }}>{r.apaar_id}</code></td>
                        <td style={{ fontSize: 12, color: "var(--gov-muted)" }}>{r.purpose}</td>
                        <td style={{ fontSize: 12 }}>{r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN") : "—"}</td>
                        <td><span className="badge badge-warn">Pending Consent</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {requests.length === 0 && (
            <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--gov-muted)" }}>
              No active or historical verification requests on record.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
