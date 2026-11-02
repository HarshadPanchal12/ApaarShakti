-- ==============================================================================
-- APAAR-Verify Seed Data & NIST RBAC Setup
-- ==============================================================================

-- 1. Insert Roles
INSERT INTO roles (id, name, description, requires_mfa) VALUES
('INSTITUTION_ADMIN', 'Institution Administrator', 'Registrar / Admin of technical institution', FALSE),
('INSTITUTION_OPERATOR', 'Institution Data Operator', 'Data-entry operator with draft upload privileges', FALSE),
('AICTE_REGIONAL_OFFICER', 'AICTE Regional Officer', 'Regional monitoring and exception review officer', TRUE),
('AICTE_NATIONAL_OFFICER', 'AICTE National Officer', 'National head-office oversight & inter-state duplicate manager', TRUE),
('AICTE_POLICY_ANALYST', 'AICTE Policy Analyst', 'Aggregate macro analytics and reports (no PII)', FALSE),
('VERIFIER', 'Credential Verifier', 'Employer or higher ed institution verifying credentials', FALSE),
('STUDENT', 'Student Academic Citizen', 'Student data owner granting/withdrawing consent', FALSE),
('SYSTEM_ADMIN', 'System Administrator', 'Rule configurations, security, and audit integrity', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Permissions
INSERT INTO permissions (id, resource, action, description) VALUES
('batch:upload', 'batch', 'upload', 'Upload student CSV/XLSX batches'),
('batch:submit', 'batch', 'submit', 'Submit batch for final AICTE validation'),
('batch:view_own', 'batch', 'view_own', 'View batches uploaded by own institution'),
('batch:view_all', 'batch', 'view_all', 'View all batches across institutions'),
('flag:review', 'flag', 'review', 'Review and resolve anomaly flags'),
('flag:escalate', 'flag', 'escalate', 'Escalate flag to national level'),
('student:view_flagged', 'student', 'view_flagged', 'Inspect student PII for flagged exceptions'),
('student:view_all', 'student', 'view_all', 'Inspect student records globally'),
('credential:issue', 'credential', 'issue', 'Issue signed Ed25519 credentials'),
('credential:verify', 'credential', 'verify', 'Verify QR or credential token'),
('rules:configure', 'rules', 'configure', 'Configure validation rules and quotas'),
('audit:read', 'audit', 'read', 'Inspect tamper-evident audit logs')
ON CONFLICT (id) DO NOTHING;

-- 3. Link Role Permissions
INSERT INTO role_permissions (role_id, permission_id) VALUES
('INSTITUTION_ADMIN', 'batch:upload'),
('INSTITUTION_ADMIN', 'batch:submit'),
('INSTITUTION_ADMIN', 'batch:view_own'),
('INSTITUTION_OPERATOR', 'batch:upload'),
('INSTITUTION_OPERATOR', 'batch:view_own'),
('AICTE_REGIONAL_OFFICER', 'batch:view_all'),
('AICTE_REGIONAL_OFFICER', 'flag:review'),
('AICTE_REGIONAL_OFFICER', 'student:view_flagged'),
('AICTE_NATIONAL_OFFICER', 'batch:view_all'),
('AICTE_NATIONAL_OFFICER', 'flag:review'),
('AICTE_NATIONAL_OFFICER', 'flag:escalate'),
('AICTE_NATIONAL_OFFICER', 'student:view_flagged'),
('VERIFIER', 'credential:verify'),
('SYSTEM_ADMIN', 'rules:configure'),
('SYSTEM_ADMIN', 'audit:read')
ON CONFLICT DO NOTHING;

-- 4. Default AICTE Regions
INSERT INTO regions (code, name, states) VALUES
('WR', 'Western Region', ARRAY['Maharashtra', 'Gujarat', 'Goa']),
('NR', 'Northern Region', ARRAY['Uttar Pradesh', 'Uttarakhand']),
('NW', 'North-Western Region', ARRAY['Punjab', 'Haryana', 'Delhi', 'Rajasthan', 'Chandigarh']),
('SR', 'Southern Region', ARRAY['Tamil Nadu', 'Puducherry']),
('SWR', 'South-Western Region', ARRAY['Karnataka', 'Kerala']),
('CR', 'Central Region', ARRAY['Madhya Pradesh', 'Chhattisgarh', 'Gujarat'])
ON CONFLICT (code) DO NOTHING;

-- 5. Default Seat Categories (AICTE Approval Process Handbook Defaults)
INSERT INTO seat_category_config (code, label, counts_toward_intake, max_pct_of_intake, max_absolute, academic_year, notes) VALUES
('GENERAL', 'General Merit Quota', TRUE, NULL, NULL, '2026-27', 'Standard intake seats'),
('SC', 'Scheduled Caste Quota', TRUE, NULL, NULL, '2026-27', 'Constitutional reservation'),
('ST', 'Scheduled Tribe Quota', TRUE, NULL, NULL, '2026-27', 'Constitutional reservation'),
('OBC', 'Other Backward Classes', TRUE, NULL, NULL, '2026-27', 'Constitutional reservation'),
('EWS', 'Economically Weaker Section', TRUE, NULL, NULL, '2026-27', 'Central quota'),
('SUPERNUMERARY_TFW', 'Tuition Fee Waiver', FALSE, 5.0, NULL, '2026-27', 'Supernumerary (up to 5% over intake)'),
('NRI', 'Non-Resident Indian Quota', FALSE, 15.0, NULL, '2026-27', 'Supernumerary (up to 15% over intake)'),
('OCI', 'Overseas Citizen of India', FALSE, 15.0, NULL, '2026-27', 'Supernumerary approved quota'),
('FN', 'Foreign National Quota', FALSE, NULL, 10, '2026-27', 'Supernumerary absolute cap 10')
ON CONFLICT (code, academic_year) DO NOTHING;

-- 6. Default Escalation Policies
INSERT INTO escalation_policies (trigger_type, level, after_hours, notify_role, notify_scope_rule, active) VALUES
('CLARIFICATION_OVERDUE', 1, 48, 'AICTE_REGIONAL_OFFICER', 'SAME_REGION', TRUE),
('CLARIFICATION_OVERDUE', 2, 96, 'AICTE_NATIONAL_OFFICER', 'GLOBAL', TRUE),
('INTAKE_VIOLATION_HIGH', 1, 0, 'AICTE_REGIONAL_OFFICER', 'SAME_REGION', TRUE),
('CROSS_INSTITUTION_DUPLICATE', 1, 0, 'AICTE_NATIONAL_OFFICER', 'GLOBAL', TRUE)
ON CONFLICT DO NOTHING;

