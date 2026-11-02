-- Run in Supabase SQL editor. RLS is on with no policies: only the API (service key) can touch data.
create table institutions(id uuid primary key default gen_random_uuid(), aicte_id text unique, name text, state text, type text);
create table programs(id uuid primary key default gen_random_uuid(), institution_id uuid references institutions, name text, approved_intake int, academic_year text);
create table profiles(id uuid primary key references auth.users, role text check (role in ('institution','officer')), institution_id uuid references institutions);
create table enrolments(id uuid primary key default gen_random_uuid(), institution_id uuid references institutions, program_id uuid references programs,
  apaar_id text, name text, dob date, gender text, seat_category text default 'GENERAL', admission_date date, status text default 'ACTIVE',
  cred_code text unique, signature text, created_at timestamptz default now());
create index on enrolments(apaar_id);
create table flags(id uuid primary key default gen_random_uuid(), institution_id uuid references institutions, program_id uuid references programs,
  apaar_id text, rule text, severity text, message text, status text default 'OPEN', created_at timestamptz default now());
alter table institutions enable row level security; alter table programs enable row level security; alter table profiles enable row level security;
alter table enrolments enable row level security; alter table flags enable row level security;
-- Demo data
insert into institutions(aicte_id,name,state,type) values ('1-DEMO001','Demo Institute of Technology','Maharashtra','Engineering'),('1-DEMO002','Sample College of Engineering','Gujarat','Engineering');
insert into programs(institution_id,name,approved_intake,academic_year) select id,'CSE',3,'2026-27' from institutions;
insert into programs(institution_id,name,approved_intake,academic_year) select id,'ECE',60,'2026-27' from institutions;
-- After creating users in Authentication > Users, link them:
-- insert into profiles values ('<USER_UUID>','officer',null);
-- insert into profiles values ('<USER_UUID>','institution',(select id from institutions where aicte_id='1-DEMO001'));
