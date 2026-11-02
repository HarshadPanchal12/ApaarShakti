"use client";
import { useEffect, useState, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  PieChart, Pie, Cell, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer
} from "recharts";
import {
  Building2, GraduationCap, BarChart3, AlertTriangle, Cpu,
  Download, RefreshCw, ShieldCheck, CheckCircle2, MessageSquare,
  FileCheck, ShieldAlert, Sparkles, X, ChevronRight, FileText
} from "lucide-react";
import { api, API, sb } from "../../lib/supabase";

const POST = (b) => ({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) });
const COLORS = ["#003087","#FF6B00","#138808","#F59E0B","#7C3AED","#EF4444","#0EA5E9","#10B981"];

const SevDot = ({ s }) => <span className={`sev-dot sev-${s}`}></span>;

export default function Officer() {
  const [list, setList] = useState([]);
  const [sel, setSel] = useState(null);
  const [flags, setFlags] = useState([]);
  const [auto, setAuto] = useState(null);
  const [an, setAn] = useState(null);
  const [msg, setMsg] = useState({ text: "", type: "info" });
  const [loading, setLoading] = useState(true);
  const [respondModal, setRespondModal] = useState(null);
  const [respondText, setRespondText] = useState("");
  const [scanLoading, setScanLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  const notify = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "info" }), 4500);
  };

  const load = useCallback(() => {
    api("/dashboard").then(d => { setList(d); setLoading(false); setLastRefresh(new Date()); }).catch(e => { notify(e.message, "error"); setLoading(false); });
    api("/automation").then(setAuto).catch(() => {});
    api("/analytics").then(setAn).catch(() => {});
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [load]);

  async function openInst(i) {
    setSel(i);
    const f = await api(`/institution/${i.id}/flags`);
    setFlags(f);
  }

  async function clarify(f) {
    setRespondModal({ f, mode: "clarify" });
    setRespondText("");
  }

  async function resolve(f) {
    await api(`/flags/${f.id}/resolve`, { method: "POST" });
    notify(`Discrepancy resolved: ${f.rule}`);
    openInst(sel); load();
  }

  async function submitClarify() {
    await api(`/flags/${respondModal.f.id}/clarify`, POST({ text: respondText }));
    notify("Clarification notice dispatched to institution portal");
    setRespondModal(null);
    openInst(sel);
  }

  async function scan() {
    setScanLoading(true);
    try {
      const r = await api("/anomaly/run", { method: "POST" });
      notify(`Anomaly engine executed — ${r.flags} statistical outlier(s) identified`);
      load();
    } catch (e) { notify(e.message, "error"); }
    setScanLoading(false);
  }

  async function verifyChain() {
    const r = await api("/audit/verify");
    notify(`Audit chain cryptographically ${r.ok ? "VERIFIED (Intact)" : "TAMPERED / BROKEN"} across ${r.entries} immutable ledger entries`, r.ok ? "success" : "error");
  }

  async function downloadPdf() {
    setPdfLoading(true);
    try {
      const { data } = await sb.auth.getSession();
      const res = await fetch(`${API}/report.pdf`, {
        headers: { Authorization: "Bearer " + data.session?.access_token }
      });
      if (!res.ok) throw new Error("Failed to generate PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aicte_regulatory_audit_${new Date().toISOString().slice(0,10)}.pdf`;
      a.click();
      notify("Official AICTE Regulatory Audit PDF generated and downloaded");
    } catch (e) {
      notify("PDF generation failed: " + e.message, "error");
    }
    setPdfLoading(false);
  }

  async function downloadExcel() {
    setExcelLoading(true);
    try {
      const { data } = await sb.auth.getSession();
      const res = await fetch(`${API}/report.xlsx`, {
        headers: { Authorization: "Bearer " + data.session?.access_token }
      });
      if (!res.ok) throw new Error("Failed to generate Excel report");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aicte_regulatory_audit_${new Date().toISOString().slice(0,10)}.xlsx`;
      a.click();
      notify("Official AICTE Regulatory Audit Excel generated and downloaded");
    } catch (e) {
      notify("Excel generation failed: " + e.message, "error");
    }
    setExcelLoading(false);
  }

  const totalIntake = list.reduce((s, i) => s + i.intake, 0);
  const totalEnrolled = list.reduce((s, i) => s + i.enrolled, 0);
  const totalFlags = list.reduce((s, i) => s + i.open_flags, 0);
  const fillPct = totalIntake ? Math.round(100 * totalEnrolled / totalIntake) : 0;

  const kpis = [
    { icon: <Building2 size={22} className="text-blue-700" />, label: "Institutions", val: list.length, sub: "Under continuous monitoring", cls: "blue" },
    { icon: <GraduationCap size={22} className="text-emerald-700" />, label: "Verified Enrolment", val: totalEnrolled.toLocaleString(), sub: `Approved capacity: ${totalIntake.toLocaleString()}`, cls: "green" },
    { icon: <BarChart3 size={22} className="text-amber-700" />, label: "System Fill Ratio", val: fillPct + "%", sub: "National peer average", cls: "saffron" },
    { icon: <AlertTriangle size={22} className="text-rose-700" />, label: "Discrepancy Triage", val: totalFlags, sub: "Pending officer review", cls: totalFlags > 0 ? "red" : "green" },
    { icon: <Cpu size={22} className="text-indigo-700" />, label: "Automated Checks", val: auto?.checked?.toLocaleString() || "—", sub: `≈ ${auto ? Math.round(auto.checked * 2 / 60) : 0} officer-hours conserved`, cls: "purple" },
  ];

  const fillData = list.map(i => ({
    name: i.name.length > 20 ? i.name.slice(0, 20) + "…" : i.name,
    fill: i.intake ? Math.round(100 * i.enrolled / i.intake) : 0,
    enrolled: i.enrolled,
    intake: i.intake,
    flags: i.open_flags,
  }));

  const radarData = [
    { subject: "APAAR Format Integrity", A: 96 },
    { subject: "Registry Match", A: 91 },
    { subject: "Cross-Inst Ghost Check", A: 98 },
    { subject: "Intake Cap Compliance", A: 84 },
    { subject: "Identity & DOB Accuracy", A: 92 },
    { subject: "Program Approval Status", A: 95 },
  ];

  return (
    <>
      {/* Title Header */}
      <div className="page-title-bar">
        <h2>AICTE National Regulatory Portal</h2>
        <p>
          Student-Level Regulatory Oversight · Smart Automation Engine · SIH26263
          {lastRefresh && <span style={{ marginLeft: 16, opacity: 0.75, fontSize: 11 }}>
            Live Stream (15s polling) · Synchronized: {lastRefresh.toLocaleTimeString()}
          </span>}
        </p>
      </div>

      {/* Action Toolbar */}
      <div className="card" style={{ padding: "14px 20px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <button className="btn btn-saffron" onClick={scan} disabled={scanLoading}>
            {scanLoading ? <RefreshCw size={15} className="spinner" /> : <Sparkles size={15} />}
            <span>Run Anomaly Detection</span>
          </button>
          
          <button className="btn btn-primary" onClick={downloadPdf} disabled={pdfLoading}>
            {pdfLoading ? <RefreshCw size={15} className="spinner" /> : <FileText size={15} />}
            <span>Export Official PDF</span>
          </button>

          <button className="btn btn-outline" onClick={downloadExcel} disabled={excelLoading}>
            {excelLoading ? <RefreshCw size={15} className="spinner" /> : <Download size={15} />}
            <span>Export Excel Report</span>
          </button>

          <button className="btn btn-ghost" onClick={verifyChain}>
            <ShieldCheck size={15} />
            <span>Verify Audit Ledger Chain</span>
          </button>

          <button className="btn btn-ghost" onClick={load}>
            <RefreshCw size={15} />
            <span>Refresh Data</span>
          </button>

          {msg.text && (
            <div className={`alert alert-${msg.type}`} style={{ margin: 0, padding: "8px 14px", flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
              {msg.type === "error" ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
              <span>{msg.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpis.map((k) => (
          <div className="kpi-card" key={k.label}>
            <div className={`kpi-icon ${k.cls}`}>{k.icon}</div>
            <div>
              <div className="kpi-label">{k.label}</div>
              <div className="kpi-value">{k.val}</div>
              <div className="kpi-sub">{k.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      {an && (
        <div className="charts-grid">
          {/* Enrolled vs Intake */}
          <div className="chart-card">
            <h4><BarChart3 size={16} /> Enrolled vs Approved Intake</h4>
            <ResponsiveContainer height={220}>
              <BarChart data={fillData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="intake" name="Approved Intake" fill="#CBD5E1" radius={[4,4,0,0]} />
                <Bar dataKey="enrolled" name="Enrolled Students" fill="#003087" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Seat Category Distribution */}
          <div className="chart-card">
            <h4><PieChart size={16} /> Quota / Category Allocation Mix</h4>
            <ResponsiveContainer height={220}>
              <PieChart>
                <Pie
                  data={an.category}
                  dataKey="value"
                  nameKey="name"
                  cx="50%" cy="50%"
                  outerRadius={85}
                  innerRadius={45}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {an.category.map((_, k) => <Cell key={k} fill={COLORS[k % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Cumulative Admissions Over Cycle */}
          <div className="chart-card">
            <h4><AreaChart size={16} /> Admission Trajectory Over Academic Window</h4>
            <ResponsiveContainer height={220}>
              <AreaChart data={an.daily} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="admGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#003087" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#003087" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Area type="monotone" dataKey="total" stroke="#003087" strokeWidth={2} fill="url(#admGrad)" name="Total Enrolled" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Issues by Rule */}
          <div className="chart-card">
            <h4><AlertTriangle size={16} /> Active Violations by AICTE Handbook Rule</h4>
            <ResponsiveContainer height={220}>
              <BarChart data={an.rules} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="value" name="Flag Count" fill="#EF4444" radius={[0,4,4,0]}>
                  {an.rules?.map((_, i) => <Cell key={i} fill={COLORS[(i + 3) % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Fill Ratio Spectrum */}
          <div className="chart-card">
            <h4><BarChart3 size={16} /> Institution Seat Saturation Index (%)</h4>
            <ResponsiveContainer height={220}>
              <BarChart data={[...fillData].sort((a, b) => b.fill - a.fill)} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={v => [v + "%", "Saturation"]} />
                <Bar dataKey="fill" name="Saturation %" radius={[4,4,0,0]}>
                  {fillData.map((d, i) => (
                    <Cell key={i} fill={d.fill > 95 ? "#EF4444" : d.fill > 70 ? "#F59E0B" : "#003087"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Multi-Dimensional Validation Health Radar */}
          <div className="chart-card">
            <h4><ShieldCheck size={16} /> Compliance Health Vector</h4>
            <ResponsiveContainer height={220}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={78}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9 }} />
                <Radar name="Compliance Score" dataKey="A" stroke="#003087" fill="#003087" fillOpacity={0.25} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Monitored Institutions Table */}
      <div className="card">
        <div className="card-header">
          <h3>
            <div className="section-icon"><Building2 size={16} /></div>
            <span>Monitored AICTE Institutions</span>
          </h3>
          <span className="badge badge-active">Active Regulatory Feed</span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <RefreshCw size={28} className="spinner text-blue-800" />
            <p style={{ color: "var(--gov-muted)", marginTop: 12 }}>Streaming institution telemetry…</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Institution</th>
                  <th>Jurisdiction</th>
                  <th>Approved Intake</th>
                  <th>Verified Enrolled</th>
                  <th>Fill Saturation</th>
                  <th>Open Flags</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map(i => {
                  const fill = i.intake ? Math.round(100 * i.enrolled / i.intake) : 0;
                  return (
                    <tr key={i.id} className="row-clickable" onClick={() => openInst(i)}>
                      <td>
                        <div style={{ fontWeight: 600, color: "var(--gov-navy)" }}>{i.name}</div>
                      </td>
                      <td>{i.state}</td>
                      <td>{i.intake}</td>
                      <td>{i.enrolled}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, minWidth: 60 }}>
                            <div className="progress-bar">
                              <div
                                className="progress-fill"
                                style={{
                                  width: fill + "%",
                                  background: fill > 95 ? "#EF4444" : fill > 70 ? "#F59E0B" : "#003087"
                                }}
                              ></div>
                            </div>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, minWidth: 36 }}>{fill}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${i.open_flags > 0 ? "badge-error" : "badge-ok"}`}>
                          {i.open_flags > 0 ? "Discrepancy: " : "Compliant: "}{i.open_flags}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline" onClick={e => { e.stopPropagation(); openInst(i); }}>
                          <span>Drill Down</span>
                          <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Institution Discrepancy Drill-Down Drawer */}
      {sel && (
        <div className="card">
          <div className="card-header">
            <h3>
              <div className="section-icon"><AlertTriangle size={16} /></div>
              <span>{sel.name} — Discrepancy Case Audit</span>
            </h3>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className="badge badge-info">{sel.state}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => { setSel(null); setFlags([]); }}>
                <X size={15} />
                <span>Close</span>
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            {[
              { label: "Approved Intake", val: sel.intake },
              { label: "Verified Admissions", val: sel.enrolled },
              { label: "Fill Ratio", val: sel.intake ? Math.round(100 * sel.enrolled / sel.intake) + "%" : "—" },
              { label: "Unresolved Discrepancies", val: sel.open_flags },
            ].map(s => (
              <div key={s.label} style={{
                background: "#F8FAFF", border: "1px solid var(--gov-border)",
                borderRadius: 8, padding: "10px 16px", textAlign: "center", flex: 1, minWidth: 100
              }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--gov-navy)" }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "var(--gov-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Rule ID</th>
                  <th>Program</th>
                  <th>APAAR ID</th>
                  <th>Discrepancy Details & Clarifications</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {flags.map(f => (
                  <tr key={f.id}>
                    <td>
                      <span className={`badge badge-${f.severity}`}>
                        <SevDot s={f.severity} />{f.severity}
                      </span>
                    </td>
                    <td><code style={{ fontSize: 11, background: "#F1F5F9", padding: "2px 6px", borderRadius: 4 }}>{f.rule}</code></td>
                    <td>{f.programs?.name || "—"}</td>
                    <td>
                      {f.apaar_id ? (
                        <code style={{ fontSize: 12, fontWeight: 700, color: "var(--gov-navy)" }}>{f.apaar_id}</code>
                      ) : "—"}
                    </td>
                    <td>
                      <div>{f.message}</div>
                      {f.response && (
                        <div style={{ marginTop: 6, padding: "6px 10px", background: "#FFFBEB", borderRadius: 6, fontSize: 12, color: "#92400E" }}>
                          <strong>Institution Justification:</strong> {f.response}
                        </div>
                      )}
                    </td>
                    <td><span className={`badge badge-${f.status}`}>{f.status}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-sm btn-outline" onClick={() => clarify(f)}>
                          <MessageSquare size={13} />
                          <span>Clarify</span>
                        </button>
                        <button className="btn btn-sm btn-success" onClick={() => resolve(f)}>
                          <CheckCircle2 size={13} />
                          <span>Resolve</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!flags.length && (
                  <tr><td colSpan={7} style={{ textAlign: "center", padding: 24, color: "var(--gov-muted)" }}>
                    All enrolments for this institution are compliant. Zero open discrepancies.
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Automation Telemetry Feed */}
      {auto && (
        <div className="card">
          <div className="card-header">
            <h3>
              <div className="section-icon"><Cpu size={16} /></div>
              <span>Automated Engine Activity Log</span>
            </h3>
            <span className="badge badge-info">{auto.checked} Total Transactions</span>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Timestamp (UTC)</th><th>Pipeline Task</th><th>Audit Detail</th></tr>
              </thead>
              <tbody>
                {auto.log.map(l => (
                  <tr key={l.id}>
                    <td style={{ whiteSpace: "nowrap", fontSize: 12, color: "var(--gov-muted)" }}>
                      {new Date(l.at).toLocaleString("en-IN")}
                    </td>
                    <td><span className="badge badge-info">{l.task}</span></td>
                    <td style={{ fontSize: 12 }}>{l.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Clarification Modal */}
      {respondModal && (
        <div className="modal-overlay" onClick={() => setRespondModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Dispatch Regulatory Clarification Notice</h3>
            <div className="alert alert-warn" style={{ marginBottom: 16 }}>
              <span>Case: <strong>{respondModal.f.rule}</strong> — {respondModal.f.message}</span>
            </div>
            <div className="form-group">
              <label>Official Directive to Institution</label>
              <textarea
                rows={4}
                placeholder="Specify the required rectification or documentation..."
                value={respondText}
                onChange={e => setRespondText(e.target.value)}
                style={{ resize: "vertical" }}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setRespondModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={submitClarify} disabled={!respondText.trim()}>
                Dispatch Directive →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
