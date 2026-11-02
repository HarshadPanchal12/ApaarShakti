-- Run AFTER schema.sql
alter table profiles drop constraint profiles_role_check;
alter table profiles add constraint profiles_role_check check (role in ('institution','officer','verifier','student'));
alter table profiles add column apaar_id text;  -- for student role
alter table flags add column clarification text, add column response text;
create table verification_requests(id uuid primary key default gen_random_uuid(), verifier_id uuid, apaar_id text, purpose text,
  status text default 'PENDING', fields text[], expires_at timestamptz, created_at timestamptz default now());
create table automation_log(id bigserial primary key, task text, detail text, at timestamptz default now());
create table audit_log(id bigserial primary key, actor text, action text, resource text, prev_hash text, row_hash text, at timestamptz default now());
alter table verification_requests enable row level security; alter table automation_log enable row level security; alter table audit_log enable row level security;
-- Extra demo users (create in Authentication first):
-- insert into profiles(id,role) values ('<UUID>','verifier');
-- insert into profiles(id,role,apaar_id) values ('<UUID>','student','100000000001');
