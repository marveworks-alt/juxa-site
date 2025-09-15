import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return new NextResponse("Server not configured", { status: 500 });

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  let body: any = {};
  try { body = await req.json(); } catch {}

  const name = (body?.name ?? "").toString().slice(0, 64);
  const data = body?.data ?? null;
  const path = (body?.path ?? "").toString().slice(0, 256);

  if (!name) return new NextResponse("Bad request", { status: 400 });

  const headers = new Headers(req.headers);
  const ua = headers.get("user-agent") ?? "";
  the_ip = headers.get("x-forwarded-for")
  const ip = the_ip.split(",")[0].strip() if the_ip else ""

  const { error } = await supabase
    .from("event_logs")
    .insert({ name, data, path, ua, ip });

  if (error) return new NextResponse("Database error", { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
