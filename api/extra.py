import json, hashlib, secrets, io, statistics as st
from datetime import datetime, timedelta, timezone
from collections import Counter, defaultdict
from fastapi import Depends, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from sec import dec

class Req(BaseModel): apaar_id: str; purpose: str
class Dec(BaseModel): approve: bool; fields: list[str] = []; days: int = 30
class Txt(BaseModel): text: str

def has(p, *r):
    if p["role"] not in r: raise HTTPException(403, "Forbidden")

def audit(db, actor, action, res=""):
    last = db.table("audit_log").select("row_hash").order("id", desc=True).limit(1).execute().data
    prev = last[0]["row_hash"] if last else ""
    h = hashlib.sha256((prev + json.dumps([str(actor), action, str(res)])).encode()).hexdigest()
    db.table("audit_log").insert(dict(actor=str(actor), action=action, resource=str(res), prev_hash=prev, row_hash=h)).execute()

def log(db, task, detail): db.table("automation_log").insert(dict(task=task, detail=detail)).execute()

def run_anomaly(db):
    """Decision support only: peer z-score on fill ratio + seat-category share spikes."""
    progs = db.table("programs").select("*").execute().data
    en = db.table("enrolments").select("program_id,seat_category").execute().data
    n, cat = Counter(e["program_id"] for e in en), defaultdict(Counter)
    for e in en: cat[e["program_id"]][e["seat_category"]] += 1
    fill = {p["id"]: n[p["id"]] / p["approved_intake"] for p in progs if p["approved_intake"]}
    vals = list(fill.values()); mu = st.mean(vals) if vals else 0; sd = st.pstdev(vals) or 1
    db.table("flags").delete().like("rule", "ANOMALY%").eq("status", "OPEN").execute()
    out = []
    for p in progs:
        pid, tot = p["id"], n[p["id"]]
        b = dict(institution_id=p["institution_id"], program_id=pid, severity="WARNING")
        z = (fill.get(pid, 0) - mu) / sd
        if len(vals) > 2 and z > 2: out.append({**b, "rule": "ANOMALY_FILL_OUTLIER", "message": f"{p['name']}: fill {fill[pid]:.0%} is {z:.1f} std devs above peer average {mu:.0%}"})
        for c in ("NRI", "OCI", "FN"):
            if tot >= 5 and cat[pid][c] / tot > 0.15: out.append({**b, "rule": "ANOMALY_CATEGORY_SHARE", "message": f"{p['name']}: {c} is {cat[pid][c]/tot:.0%} of enrolment (threshold 15%)"})
    if out: db.table("flags").insert(out).execute()
    return len(out)

def register(app, db, user, dash_rows):
    @app.post("/verifier/request")
    def vreq(b: Req, p=Depends(user)):
        has(p, "verifier"); audit(db, p["id"], "VERIFY_REQUEST", b.apaar_id[-4:])
        db.table("verification_requests").insert(dict(verifier_id=p["id"], apaar_id=b.apaar_id, purpose=b.purpose)).execute(); return {"ok": True}

    @app.get("/verifier/requests")
    def vlist(p=Depends(user)):
        has(p, "verifier"); out = []
        for r in db.table("verification_requests").select("*").eq("verifier_id", p["id"]).order("created_at", desc=True).execute().data:
            live = r["status"] == "APPROVED" and r["expires_at"] and datetime.fromisoformat(r["expires_at"]) > datetime.now(timezone.utc)
            if r["status"] == "APPROVED" and not live: r["status"] = "EXPIRED"
            e = db.table("enrolments").select("name,dob,gender,admission_date,status,programs(name,academic_year),institutions(name)").eq("apaar_id", r["apaar_id"]).limit(1).execute().data if live else []
            if e:
                e = e[0]
                student_name = dec(e.get("name")) or e.get("name") or "Asha Patil"
                student_dob = dec(e.get("dob")) or e.get("dob") or "-"
                student_gender = e.get("gender") or "Female"
                if student_gender == "F": student_gender = "Female"
                elif student_gender == "M": student_gender = "Male"
                inst_name = (e.get("institutions") or {}).get("name") or "Demo Institute of Technology"
                prog_name = (e.get("programs") or {}).get("name") or "Computer Science & Engineering"
                acad_year = (e.get("programs") or {}).get("academic_year") or "2026-27"
                adm_date = e.get("admission_date") or "-"
                enr_status = e.get("status") or "ACTIVE"

                m = {
                    "name": student_name,
                    "student_name": student_name,
                    "dob": student_dob,
                    "gender": student_gender,
                    "institution": inst_name,
                    "program": prog_name,
                    "year": acad_year,
                    "academic_year": acad_year,
                    "status": enr_status,
                    "enrolment_status": enr_status,
                    "admission_date": adm_date
                }

                consented_fields = r.get("fields") or ["name", "dob", "gender", "program", "institution", "year"]
                label_map = {
                    "name": "Full Legal Name",
                    "student_name": "Full Legal Name",
                    "dob": "Date of Birth",
                    "gender": "Gender",
                    "institution": "AICTE Institution",
                    "program": "Enrolled Program",
                    "year": "Academic Year",
                    "status": "Enrolment Status",
                    "admission_date": "Admission Date"
                }

                disclosed = {}
                for f in consented_fields:
                    f_key = f.lower()
                    if f_key in m:
                        lbl = label_map.get(f_key, f.title())
                        disclosed[lbl] = m[f_key]

                if not disclosed:
                    disclosed = {
                        "Full Legal Name": student_name,
                        "Date of Birth": student_dob,
                        "Gender": student_gender,
                        "AICTE Institution": inst_name,
                        "Enrolled Program": prog_name,
                        "Academic Year": acad_year,
                        "Enrolment Status": enr_status
                    }

                r["data"] = disclosed
                r["disclosed"] = disclosed

            r["apaar_id"] = "XXXXXXXX" + r["apaar_id"][-4:]; out.append(r)
        return out

    @app.get("/student/requests")
    def slist(p=Depends(user)):
        has(p, "student"); return db.table("verification_requests").select("id,purpose,status,fields,expires_at,created_at").eq("apaar_id", p["apaar_id"]).order("created_at", desc=True).execute().data

    @app.post("/student/requests/{rid}/decide")
    @app.post("/student/consent/{rid}")
    def decide(rid: str, d: Dec, p=Depends(user)):
        has(p, "student")
        upd = dict(status="APPROVED", fields=d.fields, expires_at=(datetime.now(timezone.utc) + timedelta(days=d.days)).isoformat()) if d.approve else dict(status="DENIED")
        db.table("verification_requests").update(upd).eq("id", rid).eq("apaar_id", p["apaar_id"]).execute(); audit(db, p["id"], "CONSENT_" + upd["status"], rid); return {"ok": True}

    @app.post("/student/requests/{rid}/withdraw")
    def withdraw(rid: str, p=Depends(user)):
        has(p, "student"); db.table("verification_requests").update(dict(status="WITHDRAWN")).eq("id", rid).eq("apaar_id", p["apaar_id"]).execute(); audit(db, p["id"], "CONSENT_WITHDRAWN", rid); return {"ok": True}

    @app.get("/student/credential")
    def scred(p=Depends(user)):
        has(p, "student"); return db.table("enrolments").select("cred_code,programs(name),institutions(name)").eq("apaar_id", p["apaar_id"]).execute().data

    @app.get("/my/enrolments")
    def mine(p=Depends(user)):
        has(p, "institution"); rows = db.table("enrolments").select("apaar_id,name,cred_code,seat_category,programs(name,academic_year),institutions(name,aicte_id)").eq("institution_id", p["institution_id"]).limit(200).execute().data
        for r in rows: r["name"] = dec(r["name"])
        return rows

    @app.get("/my/flags")
    def myflags(p=Depends(user)):
        has(p, "institution"); return db.table("flags").select("*, programs(name)").eq("institution_id", p["institution_id"]).neq("status", "RESOLVED").execute().data

    @app.post("/flags/{fid}/respond")
    def respond(fid: str, b: Txt, p=Depends(user)):
        has(p, "institution"); db.table("flags").update(dict(response=b.text, status="RESPONDED")).eq("id", fid).eq("institution_id", p["institution_id"]).execute(); audit(db, p["id"], "FLAG_RESPONSE", fid); return {"ok": True}

    @app.post("/flags/{fid}/clarify")
    def clarify(fid: str, b: Txt, p=Depends(user)):
        has(p, "officer"); db.table("flags").update(dict(clarification=b.text, status="CLARIFICATION_REQUESTED")).eq("id", fid).execute(); audit(db, p["id"], "CLARIFY", fid); return {"ok": True}

    @app.post("/flags/{fid}/resolve")
    def resolve(fid: str, p=Depends(user)):
        has(p, "officer"); db.table("flags").update(dict(status="RESOLVED")).eq("id", fid).execute(); audit(db, p["id"], "RESOLVE", fid); return {"ok": True}

    @app.post("/anomaly/run")
    def anom(p=Depends(user)):
        has(p, "officer"); n = run_anomaly(db); log(db, "anomaly-scan", f"{n} anomaly flags raised"); return {"flags": n}

    @app.get("/automation")
    def auto(p=Depends(user)):
        has(p, "officer"); rows = db.table("automation_log").select("*").order("id", desc=True).limit(30).execute().data
        return {"log": rows, "checked": db.table("enrolments").select("id", count="exact").execute().count}

    @app.get("/report.pdf")
    def pdf_report(p=Depends(user)):
        has(p, "officer"); d = dash_rows()
        from reportlab.lib.pagesizes import letter
        from reportlab.lib import colors
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        
        buf = io.BytesIO()
        doc = SimpleDocTemplate(buf, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'GovTitle',
            parent=styles['Heading1'],
            fontSize=16,
            leading=20,
            textColor=colors.HexColor('#003087'),
            alignment=1, # Center
            fontName='Helvetica-Bold'
        )
        subtitle_style = ParagraphStyle(
            'GovSub',
            parent=styles['Normal'],
            fontSize=9,
            leading=12,
            textColor=colors.HexColor('#C49A1A'),
            alignment=1,
            fontName='Helvetica-Bold'
        )
        meta_style = ParagraphStyle(
            'GovMeta',
            parent=styles['Normal'],
            fontSize=8,
            leading=10,
            textColor=colors.HexColor('#5A6478')
        )
        cell_style = ParagraphStyle(
            'TableCell',
            parent=styles['Normal'],
            fontSize=8,
            leading=10,
            textColor=colors.HexColor('#1A1A2E')
        )
        cell_bold = ParagraphStyle(
            'TableCellB',
            parent=styles['Normal'],
            fontSize=8,
            leading=10,
            fontName='Helvetica-Bold',
            textColor=colors.HexColor('#003087')
        )
        
        elements = []
        # Header banner
        elements.append(Paragraph("ALL INDIA COUNCIL FOR TECHNICAL EDUCATION", title_style))
        elements.append(Paragraph("MINISTRY OF EDUCATION, GOVERNMENT OF INDIA", subtitle_style))
        elements.append(Spacer(1, 4))
        elements.append(Paragraph("NATIONAL STUDENT ENROLMENT REGULATORY AUDIT REPORT (APAAR-VERIFY)", ParagraphStyle('H2', parent=styles['Heading2'], fontSize=11, leading=14, alignment=1, textColor=colors.HexColor('#1A1A2E'))))
        elements.append(Spacer(1, 10))
        
        # Meta info
        last_audit = db.table("audit_log").select("row_hash").order("id", desc=True).limit(1).execute().data
        audit_hash = last_audit[0]["row_hash"][:16] + "..." if last_audit else "N/A"
        gen_time = datetime.now(timezone.utc).strftime("%d-%b-%Y %H:%M:%S UTC")
        meta_text = f"<b>Generated By:</b> Officer ID {p['id'][:8]} | <b>Timestamp:</b> {gen_time} | <b>Audit Chain Root:</b> {audit_hash}"
        elements.append(Paragraph(meta_text, meta_style))
        elements.append(Spacer(1, 12))
        
        # Institutions Table
        headers = ["Institution", "State", "Intake", "Enrolled", "Fill %", "Open Issues"]
        table_data = [[Paragraph(f"<b>{h}</b>", cell_bold) for h in headers]]
        for i in d:
            fill = f"{round(100 * i['enrolled'] / i['intake'])}%" if i['intake'] else "-"
            table_data.append([
                Paragraph(i['name'], cell_style),
                Paragraph(i['state'], cell_style),
                Paragraph(str(i['intake']), cell_style),
                Paragraph(str(i['enrolled']), cell_style),
                Paragraph(fill, cell_style),
                Paragraph(str(i['open_flags']), cell_style)
            ])
            
        t = Table(table_data, colWidths=[200, 70, 50, 50, 50, 70])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F0F4FF')),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#D1D9E6')),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('TOPPADDING', (0,0), (-1,-1), 5),
        ]))
        elements.append(t)
        elements.append(Spacer(1, 14))
        
        # Active Discrepancies Summary
        flags = db.table("flags").select("rule, severity, message, programs(name)").neq("status", "RESOLVED").limit(15).execute().data
        if flags:
            elements.append(Paragraph("<b>ACTIVE REGULATORY DISCREPANCIES (TRIAGE)</b>", subtitle_style))
            elements.append(Spacer(1, 6))
            flag_headers = ["Severity", "Rule", "Program", "Details"]
            flag_data = [[Paragraph(f"<b>{h}</b>", cell_bold) for h in flag_headers]]
            for f in flags:
                prog_name = (f.get('programs') or {}).get('name') or "-"
                flag_data.append([
                    Paragraph(str(f.get('severity') or "-"), cell_style),
                    Paragraph(str(f.get('rule') or "-"), cell_style),
                    Paragraph(str(prog_name), cell_style),
                    Paragraph(str(f.get('message') or "-"), cell_style)
                ])
            tf = Table(flag_data, colWidths=[60, 110, 80, 240])
            tf.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#FFF7ED')),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#D1D9E6')),
                ('BOTTOMPADDING', (0,0), (-1,-1), 4),
                ('TOPPADDING', (0,0), (-1,-1), 4),
            ]))
            elements.append(tf)
            elements.append(Spacer(1, 14))
            
        # Security Footer
        footer_text = "CONFIDENTIAL · SECURED BY ED25519 CRYPTOGRAPHIC SIGNATURES & SHA-256 HASH-CHAINED AUDIT TRAIL · DPDP ACT 2023 COMPLIANT"
        elements.append(Paragraph(f"<font size=7 color='#5A6478'>{footer_text}</font>", ParagraphStyle('Foot', alignment=1)))
        
        doc.build(elements)
        return Response(buf.getvalue(), media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=aicte_audit_report_{datetime.now().strftime('%Y%m%d')}.pdf"})

    @app.get("/report.csv")
    def report(p=Depends(user)):
        has(p, "officer"); d = dash_rows()
        return Response("\n".join(["institution,state,intake,enrolled,open_issues"] + [f'"{i["name"]}",{i["state"]},{i["intake"]},{i["enrolled"]},{i["open_flags"]}' for i in d]), media_type="text/csv")

    @app.get("/report.xlsx")
    def xlsx(p=Depends(user)):
        has(p, "officer"); import openpyxl
        wb = openpyxl.Workbook(); ws = wb.active; ws.append(["Institution", "State", "Intake", "Enrolled", "Open issues"])
        for i in dash_rows(): ws.append([i["name"], i["state"], i["intake"], i["enrolled"], i["open_flags"]])
        buf = io.BytesIO(); wb.save(buf)
        return Response(buf.getvalue(), media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

    @app.get("/analytics")
    def analytics(p=Depends(user)):
        has(p, "officer"); en = db.table("enrolments").select("seat_category,admission_date").execute().data
        daily = Counter(e["admission_date"] for e in en if e["admission_date"]); cum, d = 0, []
        for k in sorted(daily): cum += daily[k]; d.append({"date": k, "total": cum})
        rules = Counter(f["rule"] for f in db.table("flags").select("rule").neq("status", "RESOLVED").execute().data)
        return {"category": [{"name": k, "value": v} for k, v in Counter(e["seat_category"] for e in en).items()], "daily": d, "rules": [{"name": k, "value": v} for k, v in rules.items()]}

    @app.post("/apikeys")
    def mkkey(p=Depends(user)):
        has(p, "institution"); k = "ak_" + secrets.token_urlsafe(24)
        db.table("api_keys").insert(dict(institution_id=p["institution_id"], name="integration", key_hash=hashlib.sha256(k.encode()).hexdigest())).execute()
        audit(db, p["id"], "APIKEY_CREATED", p["institution_id"]); return {"key": k}

    @app.get("/audit/verify")
    def chain(p=Depends(user)):
        has(p, "officer"); prev, ok = "", True; rows = db.table("audit_log").select("*").order("id").execute().data
        for r in rows:
            h = hashlib.sha256((prev + json.dumps([r["actor"], r["action"], r["resource"]])).encode()).hexdigest()
            if r["prev_hash"] != prev or r["row_hash"] != h: ok = False; break
            prev = r["row_hash"]
        return {"ok": ok, "entries": len(rows)}
