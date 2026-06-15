-- ============================================================
-- JalSetu — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. WARDS
create table if not exists wards (
  id              integer primary key,
  name            text not null,
  sector          text,
  current_level   integer default 0,
  tank_capacity   integer,
  pump_status     text default 'Inactive',
  last_refill     text,
  next_supply     text,
  current_volume  text,
  estimated_outflow text,
  supply_schedule jsonb default '[]'
);

-- 2. COMPLAINTS
create table if not exists complaints (
  id          serial primary key,
  ward_id     integer,
  citizen     text,
  category    text,
  description text,
  address     text,
  date        text default 'Just now',
  urgency     text default 'Medium',
  priority    text default 'medium',
  status      text default 'Pending',
  updates     jsonb default '[]',
  created_at  timestamptz default now()
);

-- 3. SCHEDULER EVENTS
create table if not exists scheduler_events (
  id          bigint primary key,
  day         text,
  label       text,
  time        text,
  status      text default 'upcoming',
  top         integer default 80,
  height      integer default 60,
  color_class text
);

-- 4. ASSIGNMENTS
create table if not exists assignments (
  id    bigint primary key,
  name  text,
  time  text,
  icon  text default 'location_on'
);

-- 5. MUNICIPAL CONFIG (single row)
create table if not exists municipal_config (
  id               integer primary key default 1,
  pressure_limit   float default 5.5,
  reservoir_limit  integer default 20,
  sms_alerts       boolean default true,
  leak_siren       boolean default true,
  auto_shutoff     boolean default true,
  whatsapp_alerts  boolean default true,
  email_reports    boolean default false,
  eco_mode         boolean default true,
  threshold        integer default 350
);

-- ============================================================
-- Disable Row Level Security (for dev — enable later in prod)
-- ============================================================
alter table wards              disable row level security;
alter table complaints         disable row level security;
alter table scheduler_events   disable row level security;
alter table assignments        disable row level security;
alter table municipal_config   disable row level security;


-- ============================================================
-- SEED DATA — Wards
-- ============================================================
insert into wards (id, name, sector, current_level, tank_capacity, pump_status, last_refill, next_supply, current_volume, estimated_outflow, supply_schedule) values
(1, 'Ward 1 — Lakshmi Nagar',  'North Sector', 93, 500000, 'Active',   'Today, 06:30 AM', '06:00 PM', '465K L', '32k L/hr', '[{"time":"05:30 AM","duration":"2 hrs","status":"completed"},{"time":"11:30 AM","duration":"1.5 hrs","status":"active"},{"time":"05:30 PM","duration":"2 hrs","status":"upcoming"}]'),
(2, 'Ward 2 — Gandhi Colony',  'North Sector', 45, 400000, 'Active',   'Today, 05:45 AM', '05:30 PM', '180K L', '28k L/hr', '[{"time":"05:30 AM","duration":"2 hrs","status":"completed"},{"time":"11:30 AM","duration":"1.5 hrs","status":"active"},{"time":"05:30 PM","duration":"2 hrs","status":"upcoming"}]'),
(3, 'Ward 3 — Shivaji Peth',   'East Sector',  92, 600000, 'Active',   'Today, 07:00 AM', '01:00 PM', '552K L', '45k L/hr', '[{"time":"06:00 AM","duration":"2 hrs","status":"completed"},{"time":"01:00 PM","duration":"1.5 hrs","status":"upcoming"},{"time":"06:00 PM","duration":"2 hrs","status":"upcoming"}]'),
(4, 'Ward 4 — Subhash Road',   'West Sector',  15, 350000, 'Inactive', 'Yesterday, 06:00 PM', '12:00 PM', '52K L', '18k L/hr', '[{"time":"12:00 PM","duration":"3 hrs","status":"upcoming"}]'),
(5, 'Ward 5 — Nehru Garden',   'South Sector', 30, 450000, 'Active',   'Today, 04:00 AM', '—',       '135K L', '22k L/hr', '[{"time":"04:00 AM","duration":"2 hrs","status":"completed"},{"time":"02:00 PM","duration":"2 hrs","status":"upcoming"}]'),
(6, 'Ward 6 — Sakshi Nagar',   'South Sector', 60, 300000, 'Active',   'Today, 06:00 AM', '12:30 PM', '180K L', '25k L/hr', '[{"time":"06:00 AM","duration":"2 hrs","status":"completed"},{"time":"12:30 PM","duration":"1.5 hrs","status":"upcoming"},{"time":"06:30 PM","duration":"2 hrs","status":"upcoming"}]')
on conflict (id) do nothing;

-- ============================================================
-- SEED DATA — Complaints
-- ============================================================
insert into complaints (id, ward_id, citizen, category, description, address, date, urgency, priority, status, updates) values
(1043, 2, 'Rajesh Kumar',  'Contaminated Supply', 'Water is muddy and yellow',                                   '123 Main St',                  'Just now',              'High',   'high',   'In Progress', '[{"time":"Just now","message":"Complaint received."},{"time":"Just now","message":"Status: In Progress"}]'),
(1042, 4, 'Rajesh Sharma', 'Pipe Leakage',         'Water leaking near the community park entrance gate.',        'Plot 24, North Avenue Road',   'Today, 08:15 AM',       'High',   'high',   'Pending',     '[{"time":"Today, 08:15 AM","message":"Complaint registered."}]'),
(1041, 2, 'Priya Patel',   'Low Pressure',         'Water pressure extremely low on 3rd floor.',                  'Flat 302, Sector B',           'Today, 07:30 AM',       'Medium', 'medium', 'In Progress', '[{"time":"Today, 07:30 AM","message":"Assigned to North Sector team."},{"time":"Today, 09:15 AM","message":"Technician dispatched."}]'),
(1040, 5, 'Amit Kumar',    'No Supply Alert',       'No water supply since morning.',                              'G-12, Sector D',               'Yesterday, 09:00 PM',   'High',   'high',   'In Progress', '[{"time":"Yesterday, 09:00 PM","message":"Complaint registered."}]'),
(1039, 1, 'Sunita Devi',   'Contaminated Supply',  'Muddy water output observed in tap flow.',                    'Line 3, Sector A',             'Yesterday, 06:45 PM',   'High',   'high',   'In Progress', '[{"time":"Yesterday, 06:45 PM","message":"Complaint registered."}]'),
(1038, 3, 'Vikram Singh',  'Contaminated Supply',  'Water smells heavily of bleach/chlorine.',                    'Shivaji Peth main road',       '2 days ago',            'Medium', 'medium', 'Resolved',    '[{"time":"2 days ago","message":"Registered."},{"time":"2 days ago","message":"Chlorine level balanced. Resolved."}]'),
(1037, 6, 'Meena Joshi',   'Meter Reading Issue',  'Digital billing meter display is blank.',                     'Housing Block 4, Sector S',    '3 days ago',            'Low',    'low',    'Resolved',    '[{"time":"3 days ago","message":"Registered."},{"time":"3 days ago","message":"Meter replaced and calibrated."}]')
on conflict (id) do nothing;

-- ============================================================
-- SEED DATA — Scheduler Events
-- ============================================================
insert into scheduler_events (id, day, label, time, status, top, height, color_class) values
(1, 'Tue', 'Ward 12-B Flow',  '07:30 - 10:30', 'completed',  40,  80, 'border-primary text-primary bg-primary-container/20 hover:bg-primary-container/30'),
(2, 'Wed', 'Main Trunk Line', '08:00 - 12:00', 'active',     53, 107, 'border-secondary text-secondary bg-secondary/10 shadow-lg shadow-secondary/5 ring-1 ring-secondary/20'),
(3, 'Fri', 'Maintenance',     '15:00 - 17:30', 'maintenance',240,  67, 'border-tertiary text-tertiary bg-tertiary-container/20 hover:bg-tertiary-container/30')
on conflict (id) do nothing;

-- ============================================================
-- SEED DATA — Assignments
-- ============================================================
insert into assignments (id, name, time, icon) values
(1, 'Ward 04 - East Sector',  'Tomorrow, 06:00 AM',  'location_on'),
(2, 'Ward 18 - Industrial',   'June 14, 11:30 PM',   'location_on')
on conflict (id) do nothing;

-- ============================================================
-- SEED DATA — Municipal Config
-- ============================================================
insert into municipal_config (id, pressure_limit, reservoir_limit, sms_alerts, leak_siren, auto_shutoff, whatsapp_alerts, email_reports, eco_mode, threshold)
values (1, 5.5, 20, true, true, true, true, false, true, 350)
on conflict (id) do nothing;
