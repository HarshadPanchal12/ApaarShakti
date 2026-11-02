-- ==============================================================================
-- APAAR-Verify Lite Combined Schema (SIH26263)
-- Run this entire script in Supabase SQL Editor in one click!
-- ==============================================================================

-- 1. Core Reference & User Profiles
CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aicte_id TEXT UNIQUE,
    name TEXT,
    state TEXT,
    type TEXT
);

CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    name TEXT,
    approved_intake INT,
    academic_year TEXT
);

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    role TEXT CHECK (role IN ('institution', 'officer', 'verifier', 'student')),
    institution_id UUID REFERENCES institutions(id),
    apaar_id TEXT
);

-- 2. Mock APAAR Registry (Format & Verification check)
CREATE TABLE IF NOT EXISTS apaar_registry (
    apaar_id TEXT PRIMARY KEY,
    name TEXT,
    dob DATE
);

-- 3. Student Enrolments & Discrepancy Flags
CREATE TABLE IF NOT EXISTS enrolments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    apaar_id TEXT,
    name TEXT,
    dob TEXT, -- Fernet-encrypted
    gender TEXT,
    seat_category TEXT DEFAULT 'GENERAL',
    admission_date DATE,
    status TEXT DEFAULT 'ACTIVE',
    cred_code TEXT UNIQUE,
    signature TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_enrolments_apaar ON enrolments(apaar_id);

CREATE TABLE IF NOT EXISTS flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
    apaar_id TEXT,
    rule TEXT,
    severity TEXT,
    message TEXT,
    status TEXT DEFAULT 'OPEN',
    clarification TEXT,
    response TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Third-Party Verification & Student Consent
CREATE TABLE IF NOT EXISTS verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verifier_id UUID,
    apaar_id TEXT,
    purpose TEXT,
    status TEXT DEFAULT 'PENDING',
    fields TEXT[],
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Automation Center & Cryptographic Audit Log
CREATE TABLE IF NOT EXISTS automation_log (
    id BIGSERIAL PRIMARY KEY,
    task TEXT,
    detail TEXT,
    at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    actor TEXT,
    action TEXT,
    resource TEXT,
    prev_hash TEXT,
    row_hash TEXT,
    at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Institution ERP API Keys
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    name TEXT,
    key_hash TEXT UNIQUE,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Enable RLS (Service Key bypasses RLS for API-level enforcement)
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrolments ENABLE ROW LEVEL SECURITY;
ALTER TABLE flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE apaar_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- 8. Seed Demo Institutions & Programs
INSERT INTO institutions (aicte_id, name, state, type) VALUES
('1-DEMO001', 'Demo Institute of Technology', 'Maharashtra', 'Engineering'),
('1-DEMO002', 'Sample College of Engineering', 'Gujarat', 'Engineering')
ON CONFLICT (aicte_id) DO NOTHING;

INSERT INTO programs (institution_id, name, approved_intake, academic_year)
SELECT id, 'CSE', 3, '2026-27' FROM institutions
WHERE NOT EXISTS (SELECT 1 FROM programs WHERE programs.institution_id = institutions.id AND name = 'CSE');

INSERT INTO programs (institution_id, name, approved_intake, academic_year)
SELECT id, 'ECE', 60, '2026-27' FROM institutions
WHERE NOT EXISTS (SELECT 1 FROM programs WHERE programs.institution_id = institutions.id AND name = 'ECE');

-- 9. Seed Mock APAAR Registry
INSERT INTO apaar_registry (apaar_id, name, dob) VALUES
('100000000001', 'Asha Patil', '2007-04-12'),
('100000000002', 'Rahul Mehta', '2007-01-30'),
('100000000003', 'Neha Shah', '2007-06-02'),
('100000000004', 'Imran Khan', '2006-11-19'),
('100000000005', 'Kiran Rao', '2007-02-14')
ON CONFLICT (apaar_id) DO NOTHING;

INSERT INTO apaar_registry
SELECT (100000000000 + g)::TEXT, 'Student ' || g, DATE '2007-01-01'
FROM generate_series(6, 500) g
ON CONFLICT (apaar_id) DO NOTHING;

