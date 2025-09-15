-- Supabase SQL: Waitlist table for Juxa (with name & campus)
create extension if not exists pgcrypto;

create table if not exists public.waitlist_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  campus text,
  source text default 'landing',
  created_at timestamptz not null default now()
);

alter table public.waitlist_subscribers enable row level security;
create index if not exists idx_waitlist_created_at on public.waitlist_subscribers (created_at desc);
