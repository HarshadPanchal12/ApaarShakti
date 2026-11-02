-- ==============================================================================
-- APAAR-Verify Database Schema (SIH26263)
-- Theme: Smart Automation | AICTE Student Verification Platform
-- ==============================================================================

-- Enable UUID and pgcrypto extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. NIST RBAC & Access Control
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(50) PRIMARY KEY, -- e.g. INSTITUTION_ADMIN, AICTE_REGIONAL_OFFICER
    name VARCHAR(100) NOT NULL,
    description TEXT,
    requires_mfa BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
    id VARCHAR(100) PRIMARY KEY, -- resource:action, e.g. batch:upload, flag:review
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id VARCHAR(50) REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(100) REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE, -- linked to supabase auth.users
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    role_id VARCHAR(50) REFERENCES roles(id) ON DELETE CASCADE,
    scope_type VARCHAR(20) DEFAULT 'GLOBAL', -- GLOBAL, REGION, INSTITUTION
    scope_id VARCHAR(100) NULL, -- region_id or institution_id
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id, scope_type, scope_id)
);

-- ------------------------------------------------------------------------------
-- 2. Institutions, Regions, Programs, and Quotas
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL, -- e.g. WR, NR, SR, ER, CR, SWR
    name VARCHAR(100) NOT NULL,
    states TEXT[] NOT NULL
);

CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aicte_permanent_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. 1-1029411
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- Central, State, Private, Deemed
    state VARCHAR(100) NOT NULL,
    region_id UUID REFERENCES regions(id),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- e.g. Computer Science & Engineering
    level VARCHAR(50) NOT NULL DEFAULT 'UG', -- UG, PG, DIPLOMA
    approved_intake INT NOT NULL,
    academic_year VARCHAR(20) NOT NULL, -- e.g. 2026-27
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(institution_id, name, level, academic_year)
);

CREATE TABLE IF NOT EXISTS seat_category_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL, -- GENERAL, SUPERNUMERARY_TFW, NRI, OCI, FN
    label VARCHAR(100) NOT NULL,
    counts_toward_intake BOOLEAN NOT NULL DEFAULT TRUE,
    max_pct_of_intake NUMERIC NULL, -- e.g. 5.0 for TFW, 15.0 for NRI
    max_absolute INT NULL, -- e.g. 10 for FN
    academic_year VARCHAR(20) NOT NULL DEFAULT '2026-27',
    notes TEXT,
    UNIQUE(code, academic_year)
);

-- ------------------------------------------------------------------------------
-- 3. People (Zero-Knowledge & Column Encrypted PII)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apaar_token VARCHAR(128) UNIQUE NOT NULL, -- peppered HMAC-SHA256 for matching
    apaar_enc BYTEA NULL, -- AES encrypted raw APAAR for authorized display only
    full_name_enc BYTEA NULL,
    dob_enc BYTEA NULL,
    gender VARCHAR(20),
    name_normalized VARCHAR(255) NOT NULL, -- lowercase alphanumeric for search
    name_phonetic VARCHAR(255) NOT NULL, -- Double Metaphone code
    dob_year INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE enrolment_status_enum AS ENUM('ACTIVE','WITHDRAWN','TRANSFERRED','GRADUATED');
CREATE TYPE verification_status_enum AS ENUM('SUBMITTED','VALIDATED','FLAGGED','VERIFIED');

CREATE TABLE IF NOT EXISTS enrolments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) NOT NULL,
    admission_date DATE NOT NULL,
    seat_category_code VARCHAR(50) NOT NULL,
    status enrolment_status_enum DEFAULT 'ACTIVE',
    source_batch_id UUID NULL,
    verification_status verification_status_enum DEFAULT 'SUBMITTED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, institution_id, program_id, academic_year)
);

-- ------------------------------------------------------------------------------
-- 4. Ingestion & Validation Engine
-- ------------------------------------------------------------------------------

CREATE TYPE batch_source_enum AS ENUM('UI', 'API');
CREATE TYPE batch_status_enum AS ENUM('RECEIVED','PROCESSING','NEEDS_CORRECTION','ACCEPTED','FINAL');
CREATE TYPE row_status_enum AS ENUM('OK','WARNING','ERROR');
CREATE TYPE severity_enum AS ENUM('ERROR','WARNING','INFO');

CREATE TABLE IF NOT EXISTS upload_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES user_profiles(id),
    academic_year VARCHAR(20) NOT NULL,
    version INT NOT NULL DEFAULT 1,
    source batch_source_enum DEFAULT 'UI',
    file_hash VARCHAR(64) NOT NULL, -- SHA256
    row_count INT NOT NULL DEFAULT 0,
    accepted_count INT NOT NULL DEFAULT 0,
    warning_count INT NOT NULL DEFAULT 0,
    rejected_count INT NOT NULL DEFAULT 0,
    status batch_status_enum DEFAULT 'RECEIVED',
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    finalized_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS batch_rows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES upload_batches(id) ON DELETE CASCADE,
    row_number INT NOT NULL,
    raw JSONB NOT NULL,
    normalized JSONB NOT NULL,
    row_status row_status_enum DEFAULT 'OK',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS validation_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES upload_batches(id) ON DELETE CASCADE,
    row_id UUID REFERENCES batch_rows(id) ON DELETE CASCADE,
    rule_code VARCHAR(100) NOT NULL,
    severity severity_enum NOT NULL,
    message TEXT NOT NULL,
    suggested_fix TEXT,
    details JSONB
);

-- ------------------------------------------------------------------------------
-- 5. Duplicate Cases & ML Anomaly Detection
-- ------------------------------------------------------------------------------

CREATE TYPE duplicate_case_type_enum AS ENUM('INTRA_BATCH','CROSS_INSTITUTION','FUZZY_GHOST');
CREATE TYPE case_status_enum AS ENUM('OPEN','UNDER_REVIEW','CONFIRMED','DISMISSED');

CREATE TABLE IF NOT EXISTS duplicate_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_type duplicate_case_type_enum NOT NULL,
    student_ids UUID[] NOT NULL,
    enrolment_ids UUID[] NOT NULL,
    confidence NUMERIC(5,2) NOT NULL,
    evidence JSONB NOT NULL,
    status case_status_enum DEFAULT 'OPEN',
    assigned_to UUID REFERENCES user_profiles(id),
    opened_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ NULL
);

CREATE TYPE flag_scope_enum AS ENUM('INSTITUTION','PROGRAM');
CREATE TYPE flag_severity_enum AS ENUM('LOW','MEDIUM','HIGH');
CREATE TYPE flag_status_enum AS ENUM('OPEN','CLARIFICATION_REQUESTED','RESOLVED','DISMISSED');

CREATE TABLE IF NOT EXISTS anomaly_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scope flag_scope_enum NOT NULL,
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
    academic_year VARCHAR(20) NOT NULL,
    flag_type VARCHAR(100) NOT NULL, -- e.g. NRI_SHARE_SPIKE, INTAKE_STREAK_AT_CAP
    score NUMERIC(5,3) NOT NULL, -- IsolationForest or z-score
    severity flag_severity_enum NOT NULL,
    features JSONB NOT NULL,
    reason_codes TEXT[] NOT NULL,
    explanation TEXT NOT NULL,
    status flag_status_enum DEFAULT 'OPEN',
    assigned_to UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS institution_quality_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) NOT NULL,
    score NUMERIC(5,2) NOT NULL, -- 0-100
    components JSONB NOT NULL,
    computed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(institution_id, academic_year)
);

-- ------------------------------------------------------------------------------
-- 6. Smart Automation, Escalations, and Notifications
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS clarification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flag_or_case_ref UUID NOT NULL,
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    raised_by UUID REFERENCES user_profiles(id),
    message TEXT NOT NULL,
    due_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING',
    responded_at TIMESTAMPTZ NULL,
    response TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE notif_channel_enum AS ENUM('IN_APP','EMAIL');

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    channel notif_channel_enum DEFAULT 'IN_APP',
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    read_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS automation_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trigger VARCHAR(100) NOT NULL,
    task VARCHAR(100) NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    finished_at TIMESTAMPTZ NULL,
    status VARCHAR(30) NOT NULL,
    stats JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS escalation_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trigger_type VARCHAR(100) NOT NULL,
    level INT NOT NULL,
    after_hours INT NOT NULL,
    notify_role VARCHAR(50) NOT NULL,
    notify_scope_rule VARCHAR(50) NOT NULL,
    active BOOLEAN DEFAULT TRUE
);

-- ------------------------------------------------------------------------------
-- 7. Verifiable Credentials & Student Consent (DPDP Act)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS verifier_orgs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- EMPLOYER, UNIVERSITY, BACKGROUND_CHECK
    status VARCHAR(20) DEFAULT 'ACTIVE',
    contact_email VARCHAR(255) NOT NULL,
    approved_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrolment_id UUID REFERENCES enrolments(id) ON DELETE CASCADE,
    short_code VARCHAR(32) UNIQUE NOT NULL, -- for /v/<short_code>
    payload JSONB NOT NULL,
    payload_hash VARCHAR(64) NOT NULL,
    signature VARCHAR(128) NOT NULL, -- Ed25519 signature
    key_id VARCHAR(100) NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ NULL,
    revocation_reason TEXT NULL
);

CREATE TABLE IF NOT EXISTS consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    verifier_org_id UUID REFERENCES verifier_orgs(id),
    purpose TEXT NOT NULL,
    fields_allowed TEXT[] NOT NULL,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    withdrawn_at TIMESTAMPTZ NULL
);

CREATE TYPE verif_status_enum AS ENUM('PENDING_CONSENT','APPROVED','DENIED','EXPIRED','COMPLETED');

CREATE TABLE IF NOT EXISTS verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verifier_org_id UUID REFERENCES verifier_orgs(id),
    requested_by UUID REFERENCES user_profiles(id),
    student_id UUID REFERENCES students(id),
    credential_id UUID REFERENCES credentials(id),
    status verif_status_enum DEFAULT 'PENDING_CONSENT',
    result JSONB NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. Governance, API Keys, and Tamper-Evident Audit Log
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    prefix VARCHAR(16) NOT NULL,
    key_hash VARCHAR(64) NOT NULL,
    scopes TEXT[] NOT NULL,
    last_used_at TIMESTAMPTZ NULL,
    revoked_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    at TIMESTAMPTZ DEFAULT NOW(),
    actor_id UUID NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100) NOT NULL,
    ip VARCHAR(45) NULL,
    details JSONB NULL,
    prev_hash VARCHAR(64) NOT NULL,
    row_hash VARCHAR(64) NOT NULL
);

-- Trigger to prevent any modification or deletion of audit_log
CREATE OR REPLACE FUNCTION prevent_audit_tampering()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'audit_log is append-only: UPDATE or DELETE is strictly forbidden.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_tampering ON audit_log;
CREATE TRIGGER trg_audit_tampering
BEFORE UPDATE OR DELETE ON audit_log
FOR EACH ROW EXECUTE FUNCTION prevent_audit_tampering();

-- ------------------------------------------------------------------------------
-- 9. Aggregate Views with Small-Cell Suppression (< 5 hidden)
-- ------------------------------------------------------------------------------

CREATE OR REPLACE VIEW v_enrolment_by_institution AS
SELECT 
    i.id AS institution_id,
    i.aicte_permanent_id,
    i.name AS institution_name,
    i.state,
    r.name AS region_name,
    p.name AS program_name,
    p.approved_intake,
    e.academic_year,
    CASE WHEN COUNT(e.id) < 5 THEN NULL ELSE COUNT(e.id) END AS actual_enrolment,
    CASE WHEN COUNT(e.id) < 5 THEN TRUE ELSE FALSE END AS is_suppressed
FROM institutions i
JOIN regions r ON i.region_id = r.id
JOIN programs p ON p.institution_id = i.id
LEFT JOIN enrolments e ON e.program_id = p.id AND e.status = 'ACTIVE'
GROUP BY i.id, i.aicte_permanent_id, i.name, i.state, r.name, p.name, p.approved_intake, e.academic_year;

