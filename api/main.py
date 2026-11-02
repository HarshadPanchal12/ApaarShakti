import os, csv, io, re, secrets, hashlib
from difflib import SequenceMatcher
from collections import Counter
from fastapi import FastAPI, Depends, Header, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
from nacl.signing import SigningKey
from dotenv import load_dotenv
load_dotenv()
import extra
from sec import enc

# Supabase newly introduced opaque keys (sb_publishable_..., sb_secret_...) alongside JWTs; bypass the old regex check in supabase-py
import supabase._sync.client as _sc
_orig_match = _sc.re.match
_sc.re.match = lambda pattern, string: True if pattern and "A-Za-z0-9-_=" in str(pattern) else _orig_match(pattern, string)

db = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_KEY"])
sk = SigningKey(bytes.fromhex(os.environ["SIGNING_KEY"]))
SUPERNUM = float(os.getenv("SUPERNUMERARY_PCT", "0.05"))  # demo default; confirm real limits in AICTE APH
web_origin = os.getenv("WEB_ORIGIN", "*")
origins = [o.strip() for o in web_origin.split(",")] if web_origin != "*" else ["*"]
app = FastAPI(title="APAAR-Verify Lite")
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["*"], allow_headers=["*"])

def key_user(k):
    r = db.table("api_keys").select("*").eq("key_hash", hashlib.sha256(k.encode()).hexdigest()).eq("revoked", False).execute().data
    if not r: raise HTTPException(401, "Invalid API key")
    return {"id": r[0]["id"], "role": "institution", "institution_id": r[0]["institution_id"]}

def user(authorization: str = Header(None), x_api_key: str = Header(None)):
    if x_api_key: return key_user(x_api_key)
    if not authorization: raise HTTPException(401, "Missing credentials")
    try: u = db.auth.get_user(authorization.split()[-1]).user
    except Exception: raise HTTPException(401, "Invalid token")
    p = db.table("profiles").select("*").eq("id", u.id).execute().data
    if not p: raise HTTPException(403, "No profile assigned")
    return p[0]

def need(p, role):
    if p["role"] != role: raise HTTPException(403, "Forbidden")

def payload(code, inst, prog, year): return f"{code}|{inst}|{prog}|{year}".encode()

@app.get("/me")
def me(p=Depends(user)): return p

@app.post("/validate")
async def validate(file: UploadFile = File(...), p=Depends(user)):
    need(p, "institution"); inst = p["institution_id"]
    rows = list(csv.DictReader(io.StringIO((await file.read()).decode("utf-8-sig"))))
    progs = {x["name"]: x for x in db.table("programs").select("*").eq("institution_id", inst).execute().data}
    ids = [(r.get("apaar_id") or "").strip() for r in rows]
    ex = db.table("enrolments").select("apaar_id,institution_id").in_("apaar_id", ids).execute().data
    others = {e["apaar_id"] for e in ex if e["institution_id"] != inst}; mine = {e["apaar_id"] for e in ex if e["institution_id"] == inst}
    reg = {x["apaar_id"]: x for x in db.table("apaar_registry").select("*").in_("apaar_id", ids).execute().data}
    existing = Counter(e["program_id"] for e in db.table("enrolments").select("program_id,seat_category").eq("institution_id", inst).eq("status", "ACTIVE").execute().data if e["seat_category"] != "SUPERNUMERARY")
    seen, flags, ok = set(), [], []
    def flag(a, rule, sev, msg, pr=None):
        flags.append(dict(institution_id=inst, program_id=pr["id"] if pr else None, apaar_id=a, rule=rule, severity=sev, message=msg))
    for r in rows:
        a = (r.get("apaar_id") or "").strip(); pr = progs.get(r.get("program")); g = reg.get(a)
        if not re.fullmatch(r"\d{12}", a): flag(a, "APAAR_FORMAT", "ERROR", "APAAR ID must be 12 digits"); continue
        if a in seen: flag(a, "DUP_IN_BATCH", "ERROR", "Repeated in this file", pr); continue
        seen.add(a)
        if not g: flag(a, "APAAR_NOT_FOUND", "ERROR", "Not found in APAAR registry (mock)", pr); continue
        if SequenceMatcher(None, (r.get("name") or "").lower(), g["name"].lower()).ratio() < 0.8 or (r.get("dob") or "") != g["dob"]:
            flag(a, "IDENTITY_MISMATCH", "ERROR", "Name or DOB does not match the APAAR record", pr); continue
        if not pr: flag(a, "PROGRAM_NOT_APPROVED", "ERROR", f"Program '{r.get('program')}' not approved for this institution"); continue
        if a in mine: flag(a, "ALREADY_ENROLLED", "WARNING", "Already enrolled at this institution (earlier upload)", pr); continue
        if a in others: flag(a, "DUP_ACROSS_INSTITUTIONS", "ERROR", "Already enrolled at another institution", pr); continue
        ok.append((a, r, pr))
    cnt = Counter(pr["id"] for _, r, pr in ok if (r.get("seat_category") or "GENERAL").upper() != "SUPERNUMERARY")
    for pr in progs.values():
        c = cnt.get(pr["id"], 0) + existing.get(pr["id"], 0)
        if c > pr["approved_intake"]:
            sev = "ERROR" if c > pr["approved_intake"] * (1 + SUPERNUM) else "WARNING"
            flag(None, "INTAKE_EXCEEDED", sev, f"{pr['name']}: {c} enrolled (cumulative) vs approved intake {pr['approved_intake']}", pr)
    recs = []
    for a, r, pr in ok:
        code = secrets.token_urlsafe(8)
        sig = sk.sign(payload(code, inst, pr["id"], pr["academic_year"])).signature.hex()
        recs.append(dict(institution_id=inst, program_id=pr["id"], apaar_id=a, name=enc(r.get("name")), dob=enc(r.get("dob")), gender=r.get("gender"),
                         seat_category=(r.get("seat_category") or "GENERAL").upper(), admission_date=r.get("admission_date") or None, cred_code=code, signature=sig))
    if recs: db.table("enrolments").insert(recs).execute()
    if flags: db.table("flags").insert(flags).execute()
    extra.log(db, "auto-validate", f"{len(rows)} rows checked, {len(recs)} accepted, {len(flags)} issues, {len(recs)} credentials issued")
    extra.audit(db, p["id"], "UPLOAD", inst); extra.run_anomaly(db)
    return {"rows": len(rows), "accepted": len(recs), "flags": flags}

def dash_rows():
    ins = db.table("institutions").select("*, programs(id,approved_intake)").execute().data
    en = Counter(r["institution_id"] for r in db.table("enrolments").select("institution_id").execute().data)
    fl = Counter(r["institution_id"] for r in db.table("flags").select("institution_id").neq("status", "RESOLVED").execute().data)
    return [dict(id=i["id"], name=i["name"], state=i["state"], intake=sum(x["approved_intake"] for x in i["programs"]),
                 enrolled=en.get(i["id"], 0), open_flags=fl.get(i["id"], 0)) for i in ins]

@app.get("/dashboard")
def dashboard(p=Depends(user)):
    need(p, "officer"); return dash_rows()

extra.register(app, db, user, dash_rows)

@app.get("/institution/{iid}/flags")
def inst_flags(iid: str, p=Depends(user)):
    need(p, "officer")
    return db.table("flags").select("*, programs(name)").eq("institution_id", iid).neq("status", "RESOLVED").order("created_at", desc=True).execute().data

@app.get("/verify/{code}")  # public: returns no personal data
def verify(code: str):
    r = db.table("enrolments").select("*, programs(name,academic_year), institutions(name)").eq("cred_code", code).execute().data
    if not r: return {"valid": False}
    r = r[0]
    try:
        sk.verify_key.verify(payload(code, r["institution_id"], r["program_id"], r["programs"]["academic_year"]), bytes.fromhex(r["signature"]))
        valid = r["status"] == "ACTIVE"
    except Exception: valid = False
    return {"valid": valid, "institution": r["institutions"]["name"], "program": r["programs"]["name"], "year": r["programs"]["academic_year"], "status": r["status"]}
