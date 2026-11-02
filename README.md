# APAAR-Verify Lite (SIH26263)
Institutions upload APAAR-keyed student CSVs → API validates (APAAR format, duplicates in file/across institutions, approved programs, intake) → officers see institutions and drill into discrepancies → each accepted enrolment gets an Ed25519-signed credential verifiable at `/verify?code=...`.

## Setup
0. Run `supabase/schema_v3.sql` last (mock APAAR registry, API keys, encrypted name/DOB). Generate `FIELD_KEY` (command in `api/.env.example`). Also run `supabase/schema_v2.sql` after `schema.sql` (adds student/verifier roles, consent, audit, automation).
1. Supabase: create project, run `supabase/schema.sql`, add 2 users (Authentication), then link them with the `profiles` inserts at the bottom of the schema (one `officer`, one `institution`).
2. API: `cd api && cp .env.example .env` (fill Supabase URL + **service** key, generate SIGNING_KEY) → `pip install -r requirements.txt && uvicorn main:app --reload`
3. Web: `cd web && cp .env.local.example .env.local` (URL, anon key) → `npm i && npm run dev`
4. Log in as institution → upload `sample/students.csv` → log in as officer to see flags (CSE approved intake is 3 in the demo data, so the sample triggers INTAKE_EXCEEDED).

## Roles
institution (upload, respond, certificate QR) · officer (dashboard, clarify/resolve, anomaly scan, CSV report, audit chain, automation center) · verifier (request) · student (approve/withdraw consent). `/verify` is public.

## Notes
- Roles are enforced in the API (JWT checked via Supabase); RLS denies direct DB access.
- APAAR registry is mocked as a 12-digit format check; swap in a real provider later. Supernumerary % is a demo default (`SUPERNUMERARY_PCT`); confirm real limits in the AICTE APH.
- Intake check runs per uploaded file. Student name/DOB are stored plain in this lite build.

## v3 additions
Mock APAAR registry check (name/DOB), cumulative intake across uploads, institution API keys (`X-API-Key`), encrypted name/DOB, charts + 10s live refresh, CSV/Excel reports.
Reset demo data between runs: `delete from flags; delete from enrolments;`
