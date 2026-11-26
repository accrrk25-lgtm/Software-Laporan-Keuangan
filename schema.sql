-- FinanceOS initial schema (PostgreSQL / Supabase)
-- Apply in a fresh project after reviewing company-specific requirements.

create extension if not exists pgcrypto;

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  currency_code char(3) not null default 'IDR',
  timezone text not null default 'Asia/Jakarta',
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.company_members (
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('super_admin','finance_manager','accounting_manager','accounting_staff','finance_staff','viewer')),
  created_at timestamptz not null default now(),
  primary key (company_id, user_id)
);

create table if not exists public.fiscal_periods (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  period_name text not null,
  start_date date not null,
  end_date date not null,
  status text not null default 'open' check (status in ('open','closed','locked')),
  check (end_date >= start_date),
  unique(company_id, period_name)
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  account_code text not null,
  account_name text not null,
  account_type text not null check (account_type in ('asset','liability','equity','revenue','expense')),
  normal_balance text not null check (normal_balance in ('debit','credit')),
  parent_id uuid references public.accounts(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(company_id, account_code)
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  customer_code text,
  customer_name text not null,
  created_at timestamptz not null default now(),
  unique(company_id, customer_code)
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  supplier_code text,
  supplier_name text not null,
  created_at timestamptz not null default now(),
  unique(company_id, supplier_code)
);

create table if not exists public.import_batches (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  uploaded_by uuid references auth.users(id),
  file_name text not null,
  file_path text,
  source_type text not null default 'excel' check (source_type in ('excel','csv')),
  status text not null default 'uploaded' check (status in ('uploaded','validated','partially_rejected','posted','failed')),
  total_rows integer not null default 0,
  accepted_rows integer not null default 0,
  rejected_rows integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.journals (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  period_id uuid references public.fiscal_periods(id),
  journal_number text not null,
  journal_date date not null,
  description text,
  source text not null default 'manual' check (source in ('manual','excel_import')),
  import_batch_id uuid references public.import_batches(id),
  status text not null default 'draft' check (status in ('draft','posted','void')),
  created_by uuid references auth.users(id),
  posted_by uuid references auth.users(id),
  posted_at timestamptz,
  created_at timestamptz not null default now(),
  unique(company_id, journal_number)
);

create table if not exists public.journal_details (
  id uuid primary key default gen_random_uuid(),
  journal_id uuid not null references public.journals(id) on delete cascade,
  account_id uuid not null references public.accounts(id),
  description text,
  debit numeric(20,2) not null default 0 check (debit >= 0),
  credit numeric(20,2) not null default 0 check (credit >= 0),
  customer_id uuid references public.customers(id),
  supplier_id uuid references public.suppliers(id),
  check (not (debit > 0 and credit > 0)),
  check (debit > 0 or credit > 0)
);

create table if not exists public.import_errors (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.import_batches(id) on delete cascade,
  row_number integer not null,
  field_name text,
  error_message text not null,
  raw_data jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_accounts_company on public.accounts(company_id);
create index if not exists idx_journals_company_date on public.journals(company_id, journal_date);
create index if not exists idx_journals_status on public.journals(status);
create index if not exists idx_journal_details_account on public.journal_details(account_id);
create index if not exists idx_import_batches_company on public.import_batches(company_id, created_at desc);

-- Enable RLS. Production policies must be added before exposing tables to client access.
alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.company_members enable row level security;
alter table public.fiscal_periods enable row level security;
alter table public.accounts enable row level security;
alter table public.customers enable row level security;
alter table public.suppliers enable row level security;
alter table public.import_batches enable row level security;
alter table public.journals enable row level security;
alter table public.journal_details enable row level security;
alter table public.import_errors enable row level security;
alter table public.audit_logs enable row level security;

-- IMPORTANT:
-- This starter schema intentionally has no permissive policies.
-- Add company-scoped RLS policies and server-side role checks before production use.
-- Never put SUPABASE_SERVICE_ROLE_KEY in browser/client code.
