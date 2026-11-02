"use client";
import { useEffect, useState, useRef } from "react";
import {
  Upload, AlertTriangle, Award, Key, CheckCircle2,
  FileCheck, ShieldAlert, Sparkles, MessageSquare,
  FileSpreadsheet, Terminal, RefreshCw, X, ChevronRight, Info
} from "lucide-react";
import { api } from "../../lib/supabase";

export default function Institution() {
  const [key, setKey] = useState("");
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");
  const [fl, setFl] = useState([]);
  const [en, setEn] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [respondModal, setRespondModal] = useState(null);
  const [respondText, setRespondText] = useState("");
  const [tab, setTab] = useState("upload");
  const fileRef = useRef(null);

  const load = () => {
    api("/my/flags").then(setFl).catch(e => setErr(e.message));
    api("/my/enrolments").then(setEn).catch(() => {});
  };
  useEffect(() => {
    load();
  }, []);

  async function upload(file) {
    if (!file) return;
    setErr(""); setRes(null); setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await api("/validate", { method: "POST", body: fd });
      setRes(r);
      load();
      setTab("issues");
    } catch (x) {
      setErr(x.message);
    }
    setLoading(false);
  }

  function onFileChange(e) { upload(e.target.files[0]); }

  function onDrop(e) {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith(".csv") || f.name.endsWith(".xlsx"))) upload(f);
    else setErr("Please upload a CSV or Excel format student roster.");
  }

  async function respond(id) {
    await api(`/flags/${id}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: respondText })
    });
    setRespondModal(null);
    setRespondText("");
    load();
  }

  async function mk() {
    const r = await api("/apikeys", { method: "POST" });
    setKey(r.key);
  }

  const openFlags = fl.filter(f => f.status !== "RESOLVED");
  const errFlags = fl.filter(f => f.severity === "ERROR");

  return (
    <>
      <div className="page-title-bar">
        <h2>Institution Enrolment Administration</h2>
        <p>Student Data Ingestion · Real-Time Compliance Validation · Autonomous Credential Generation</p>
      </div>

      {/* Summary KPIs */}
      {res && (
        <div className="kpi-grid" style={{ marginBottom: 20 }}>
          {[
            { icon: <FileSpreadsheet size={22} className="text-blue-700" />, label: "Processed Batch", val: `${res.rows} rows`, cls: "blue" },
            { icon: <CheckCircle2 size={22} className="text-emerald-700" />, label: "Accepted & Enrolled", val: res.accepted, cls: "green" },
            { icon: <AlertTriangle size={22} className="text-rose-700" />, label: "Discrepancies", val: res.flags.length, cls: res.flags.length > 0 ? "red" : "green" },
            { icon: <Award size={22} className="text-amber-700" />, label: "Signed Credentials", val: res.accepted, cls: "saffron" },
          ].map(k => (
            <div className="kpi-card" key={k.label}>
              <div className={`kpi-icon ${k.cls}`}>{k.icon}</div>
              <div>
                <div className="kpi-label">{k.label}</div>
                <div className="kpi-value">{k.val}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="tab-bar">
        <button className={`tab-btn ${tab === "upload" ? "active" : ""}`} onClick={() => setTab("upload")}>
          <Upload size={14} />
          <span>Upload Student Roster</span>
        </button>
        <button className={`tab-btn ${tab === "issues" ? "active" : ""}`} onClick={() => setTab("issues")}>
          <AlertTriangle size={14} />
          <span>Compliance Issues</span>
          {openFlags.length > 0 && <span className="tab-count">{openFlags.length}</span>}
        </button>
        <button className={`tab-btn ${tab === "credentials" ? "active" : ""}`} onClick={() => setTab("credentials")}>
          <Award size={14} />
          <span>Issued Credentials</span>
          {en.length > 0 && <span className="tab-count">{en.length}</span>}
        </button>
        <button className={`tab-btn ${tab === "api" ? "active" : ""}`} onClick={() => setTab("api")}>
          <Key size={14} />
          <span>ERP Automated API</span>
        </button>
      </div>

      {/* Upload Tab */}
      {tab === "upload" && (
        <div className="card">
          <div className="card-header">
            <h3>
              <div className="section-icon"><Upload size={16} /></div>
              <span>Batch Ingestion Engine</span>
            </h3>
          </div>

          {err && (
            <div className="alert alert-error" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ShieldAlert size={16} />
              <span>{err}</span>
            </div>
          )}

          {res && !loading && (
            <div className={`alert ${res.flags.length === 0 ? "alert-success" : "alert-warn"}`} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {res.flags.length === 0 ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>
                <strong>{res.accepted} of {res.rows} records enrolled successfully</strong> ·{" "}
                {res.flags.length} issue{res.flags.length !== 1 ? "s" : ""} flagged ·{" "}
                {res.accepted} cryptographic credentials generated with Ed25519 digital signatures.
              </span>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept=".csv,.xlsx"
            className="hidden-input"
            onChange={onFileChange}
          />

          <div
            className={`upload-zone ${dragOver ? "drag-over" : ""}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            {loading ? (
              <>
                <RefreshCw size={36} className="spinner text-blue-800" style={{ margin: "0 auto 12px" }} />
                <h4>Executing 14-Rule Autonomous Validation Pipeline…</h4>
                <p>Verifying APAAR format, registry identity, duplicate existence, approved intake bounds</p>
              </>
            ) : (
              <>
                <div className="upload-icon" style={{ display: "flex", justifyContent: "center" }}>
                  <Upload size={40} className="text-blue-800" />
                </div>
                <h4>Select or Drag & Drop Student Roster File</h4>
                <p>Accepted formats: .csv, .xlsx · AICTE Approved Process Handbook Compliant</p>
                <p style={{ marginTop: 8, fontSize: 11, color: "var(--gov-muted)" }}>
                  Required Schema: apaar_id · name · dob · gender · program · seat_category · admission_date
                </p>
              </>
            )}
          </div>

          <div style={{ marginTop: 20 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--gov-navy)", marginBottom: 12 }}>
              Autonomous Compliance Checks Executed on Upload:
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
              {[
                ["APAAR Format Rule", "Enforces strict 12-digit numeric national identifier syntax"],
                ["Batch Redundancy", "Prevents duplicate student submissions within the same batch"],
                ["Registry Cross-Match", "Validates APAAR ID existence in national student database"],
                ["Fuzzy Identity Match", "80% ratio threshold on student name & DOB to catch ghost identities"],
                ["AICTE Approved Program", "Verifies program approval status for this specific institution ID"],
                ["Cross-Institution Ghost Check", "Flags students enrolled concurrently across other institutions"],
                ["Approved Intake Cap", "Enforces quota ceiling bounds with supernumerary tolerance checks"],
                ["Ed25519 Cryptographic Seal", "Issues private-key signed tamper-evident credentials automatically"],
              ].map(([title, desc], idx) => (
                <div key={title} style={{
                  display: "flex", gap: 10, alignItems: "flex-start",
                  padding: "10px 12px", background: "#F8FAFF",
                  border: "1px solid var(--gov-border)", borderRadius: 8
                }}>
                  <CheckCircle2 size={16} className="text-blue-800" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--gov-navy)" }}>{title}</div>
                    <div style={{ fontSize: 11, color: "var(--gov-muted)" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Issues Tab */}
      {tab === "issues" && (
        <div className="card">
          <div className="card-header">
            <h3>
              <div className="section-icon"><AlertTriangle size={16} /></div>
              <span>Discrepancy Triage & Response</span>
            </h3>
            <div style={{ display: "flex", gap: 8 }}>
              {errFlags.length > 0 && <span className="badge badge-error">Critical: {errFlags.length}</span>}
              <span className="badge badge-warn">Open: {openFlags.length}</span>
            </div>
          </div>

          {openFlags.length === 0 && (
            <div style={{ textAlign: "center", padding: 40 }}>
              <CheckCircle2 size={44} className="text-emerald-700" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ color: "var(--gov-navy)", marginBottom: 8 }}>Zero Compliance Discrepancies</h3>
              <p style={{ color: "var(--gov-muted)" }}>All submitted student records satisfy AICTE regulatory criteria.</p>
            </div>
          )}

          {openFlags.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Severity</th>
                    <th>Rule Identifier</th>
                    <th>APAAR ID</th>
                    <th>Diagnostic Message</th>
                    <th>AICTE Clarification Query</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {openFlags.map(f => (
                    <tr key={f.id}>
                      <td>
                        <span className={`badge badge-${f.severity}`}>
                          <span className={`sev-dot sev-${f.severity}`}></span>
                          {f.severity}
                        </span>
                      </td>
                      <td>
                        <code style={{ fontSize: 11, background: "#F1F5F9", padding: "2px 6px", borderRadius: 4 }}>
                          {f.rule}
                        </code>
                      </td>
                      <td>
                        {f.apaar_id ? (
                          <code style={{ fontSize: 12, fontWeight: 700, color: "var(--gov-navy)" }}>{f.apaar_id}</code>
                        ) : "—"}
                      </td>
                      <td style={{ maxWidth: 220 }}>{f.message}</td>
                      <td>
                        {f.clarification ? (
                          <div style={{ background: "#FFFBEB", padding: "6px 10px", borderRadius: 6, fontSize: 12, color: "#92400E" }}>
                            <strong>Official AICTE Query:</strong> {f.clarification}
                          </div>
                        ) : <span style={{ color: "var(--gov-muted)", fontSize: 12 }}>—</span>}
                      </td>
                      <td><span className={`badge badge-${f.status}`}>{f.status}</span></td>
                      <td>
                        <button
                          className="btn btn-sm btn-saffron"
                          onClick={() => { setRespondModal(f); setRespondText(""); }}
                        >
                          <MessageSquare size={13} />
                          <span>Respond</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Credentials Tab */}
      {tab === "credentials" && (
        <div className="card">
          <div className="card-header">
            <h3>
              <div className="section-icon"><Award size={16} /></div>
              <span>Issued Cryptographic Credentials</span>
            </h3>
            <span className="badge badge-active">{en.length} Enrolments Verified</span>
          </div>

          {en.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--gov-muted)" }}>
              No credentials generated yet. Submit a valid student roster to begin.
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>APAAR ID</th>
                    <th>Student Name</th>
                    <th>Program</th>
                    <th>Seat Category</th>
                    <th>Cryptographic Status</th>
                    <th>Certificate Action</th>
                  </tr>
                </thead>
                <tbody>
                  {en.map((e, idx) => (
                    <tr key={e.cred_code}>
                      <td style={{ color: "var(--gov-muted)", fontSize: 12 }}>{idx + 1}</td>
                      <td><code style={{ fontSize: 12, fontWeight: 700, color: "var(--gov-navy)" }}>{e.apaar_id}</code></td>
                      <td style={{ fontWeight: 600 }}>{e.name}</td>
                      <td><span className="badge badge-info">{e.programs?.name}</span></td>
                      <td><span className="badge badge-gray">{e.seat_category}</span></td>
                      <td><span className="badge badge-active">Ed25519 Validated</span></td>
                      <td>
                        <a
                          href={`/certificate?code=${e.cred_code}`}
                          className="btn btn-sm btn-outline"
                          style={{ textDecoration: "none" }}
                        >
                          <span>Print Footer QR</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ERP System Integration Tab */}
      {tab === "api" && (
        <div className="card">
          <div className="card-header">
            <h3>
              <div className="section-icon"><Terminal size={16} /></div>
              <span>Direct ERP System Integration (Headless Pipeline)</span>
            </h3>
          </div>
          <div className="alert alert-info" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Info size={16} />
            <span>
              Connect campus management systems (SAP Student Lifecycle, TCS iON, Camu, Jenzabar) to stream admissions directly into the autonomous validation pipeline.
            </span>
          </div>
          <div className="form-group" style={{ maxWidth: 320 }}>
            <label>Cryptographic API Token</label>
            <button className="btn btn-primary" onClick={mk}>
              <Key size={14} />
              <span>Generate New API Key</span>
            </button>
          </div>
          {key && (
            <>
              <div className="alert alert-warn" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <AlertTriangle size={16} />
                <span><strong>Store this API token securely.</strong> It cannot be retrieved after leaving this page.</span>
              </div>
              <pre>{`# Secure Integration Token:
${key}

# Automated Roster Ingestion via cURL:
curl -X POST ${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/validate \\
  -H "X-API-Key: ${key}" \\
  -F "file=@admissions_roster.csv"

# Response Payload (200 OK):
# { "rows": 11, "accepted": 6, "flags": [...], "status": "COMPLETED" }`}</pre>
            </>
          )}
        </div>
      )}

      {/* Response Modal */}
      {respondModal && (
        <div className="modal-overlay" onClick={() => setRespondModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Submit Formal Clarification to AICTE</h3>
            <div className="alert alert-warn" style={{ marginBottom: 16 }}>
              <span>
                <strong>Violation: {respondModal.rule}</strong> — {respondModal.message}
              </span>
            </div>
            <div className="form-group">
              <label>Official Institutional Justification / Rectification</label>
              <textarea
                rows={4}
                placeholder="Cite AICTE Approval Order or resolution reference..."
                value={respondText}
                onChange={e => setRespondText(e.target.value)}
                style={{ resize: "vertical" }}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setRespondModal(null)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={() => respond(respondModal.id)}
                disabled={!respondText.trim()}
              >
                Submit Response →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
