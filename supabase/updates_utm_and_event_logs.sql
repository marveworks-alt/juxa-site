-- Add UTM + referrer columns to waitlist_subscribers
alter table public.waitlist_subscribers
  add column if not exists utm_source   text,
  add column if not exists utm_medium   text,
  add column if not exists utm_campaign text,
  add column if not exists referrer     text;

create index if not exists idx_ws_utm_source   on public.waitlist_subscribers (utm_source);
create index if not exists idx_ws_utm_medium   on public.waitlist_subscribers (utm_medium);
create index if not exists idx_ws_utm_campaign on public.waitlist_subscribers (utm_campaign);

-- Create event_logs for tiny analytics
create table if not exists public.event_logs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  data jsonb,
  path text,
  ua text,
  ip text,
  created_at timestamptz not null default now()
);

alter table public.event_logs enable row level security;
create index if not exists idx_event_logs_created_at on public.event_logs (created_at desc);
