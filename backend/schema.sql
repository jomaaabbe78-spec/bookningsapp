-- Kör detta i Supabase SQL Editor

create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password text not null,
  type text not null, -- 'frisör', 'städbolag', etc.
  stripe_customer_id text,
  subscribed boolean default false,
  created_at timestamptz default now()
);

create table services (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  name text not null,
  duration_minutes int not null,
  price numeric not null,
  created_at timestamptz default now()
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  service_id uuid references services(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text default 'confirmed', -- confirmed, cancelled
  paid boolean default false,
  created_at timestamptz default now()
);
