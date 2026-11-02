-- Run AFTER schema.sql and schema_v2.sql
create table apaar_registry(apaar_id text primary key, name text, dob date);   -- MOCK registry; swap for the real APAAR integration
alter table apaar_registry enable row level security;
insert into apaar_registry values ('100000000001','Asha Patil','2007-04-12'),('100000000002','Rahul Mehta','2007-01-30'),('100000000003','Neha Shah','2007-06-02'),
  ('100000000004','Imran Khan','2006-11-19'),('100000000005','Kiran Rao','2007-02-14');
insert into apaar_registry select (100000000000+g)::text, 'Student '||g, date '2007-01-01' from generate_series(6,500) g;
create table api_keys(id uuid primary key default gen_random_uuid(), institution_id uuid references institutions, name text, key_hash text unique, revoked boolean default false, created_at timestamptz default now());
alter table api_keys enable row level security;
alter table enrolments alter column dob type text using dob::text;   -- name and dob are stored Fernet-encrypted
