-- Cookie Mini Website Builder Pro Supabase Schema
-- Run this inside Supabase SQL Editor.

create extension if not exists "uuid-ossp";

create table if not exists public.websites (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid null references auth.users(id) on delete set null,
  slug text unique not null,
  business_name text,
  "businessName" text,
  template text default 'local',
  plan text default 'starter',
  billing text default 'subscription',
  extra_page_count integer default 0,
  monthly_price integer null,
  price_label text null,
  headline text,
  description text,
  phone text,
  email text,
  "primaryColor" text default '#20172f',
  "accentColor" text default '#c46a2d',
  pages jsonb default '["Home"]'::jsonb,
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists websites_slug_idx on public.websites(slug);
create index if not exists websites_owner_idx on public.websites(owner_id);

alter table public.websites enable row level security;

-- Public visitors can view published websites.
create policy "Public can read published websites"
  on public.websites for select
  using (status = 'published');

-- Logged-in customers can view their own drafts and published sites.
create policy "Owners can read own websites"
  on public.websites for select
  using (auth.uid() = owner_id);

-- Logged-in customers can create their own websites.
create policy "Owners can insert own websites"
  on public.websites for insert
  with check (auth.uid() = owner_id);

-- Logged-in customers can update their own websites.
create policy "Owners can update own websites"
  on public.websites for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- NOTE: The starter API route uses SUPABASE_SERVICE_ROLE_KEY for admin publishing.
-- For a full production version, replace admin upsert with authenticated user checks and subscription payment verification.


create index if not exists websites_status_idx on public.websites(status);
comment on table public.websites is 'Customer websites published by Cookie Mini Website Builder Pro.';
