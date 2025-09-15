# Juxa — Vercel-Ready Landing Page (with Admin & Notifications)

This project deploys on **Vercel** and includes:
- Landing page with waitlist form
- `/api/subscribe` → Supabase upsert + optional Slack + optional Email (Resend)
- `/admin` (server-rendered) to view recent signups (protected with Basic Auth)
- `/api/admin/export` to download CSV (also protected)

## 1) Supabase
- Create a project → Settings → API → copy Project URL, Service Role Key, Anon Key
- Run `supabase/waitlist.sql` in Supabase SQL editor

## 2) Environment variables
Create `.env.local` (for local dev) and add these (set the same on Vercel → Project → Settings → Environment Variables):
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (required)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional)
- `BASIC_AUTH_USER`, `BASIC_AUTH_PASS` (to protect /admin and /api/admin/*)
- `SLACK_WEBHOOK_URL` (optional)
- `RESEND_API_KEY`, `NOTIFY_EMAIL_FROM`, `NOTIFY_EMAIL_TO` (optional)

## 3) Local dev
```bash
npm i
npm run dev
# http://localhost:3000 → landing
# http://localhost:3000/admin → admin (use BASIC_AUTH_USER/PASS)
```

## 4) Deploy on Vercel
- Push to a GitHub repo
- Import into Vercel → set the same environment variables → Deploy
- In Vercel → Domains: add **getjuxa.com** and follow the DNS steps it shows
- Done: https://getjuxa.com
