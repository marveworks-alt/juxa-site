import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Ensure Node runtime (service role cannot run at the edge)
export const runtime = 'nodejs';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const slackWebhook = process.env.SLACK_WEBHOOK_URL || '';
const resendApiKey = process.env.RESEND_API_KEY || '';
const notifyEmailTo = process.env.NOTIFY_EMAIL_TO || '';
const notifyEmailFrom = process.env.NOTIFY_EMAIL_FROM || '';

const supabase = (supabaseUrl && supabaseServiceRoleKey)
  ? createClient(supabaseUrl, supabaseServiceRoleKey, { auth: { persistSession: false } })
  : null;

type Payload = { email?: string; name?: string; campus?: string; source?: string };

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clean(s?: string, max = 120) {
  return (s ?? '').toString().trim().slice(0, max);
}

export async function POST(req: Request) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const body = (await req.json()) as Payload;
    const email = clean(body.email?.toLowerCase());
    const name = clean(body.name, 80);
    const campus = clean(body.campus, 120);
    const source = clean(body.source || 'landing', 64);

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('waitlist_subscribers')
      .upsert({ email, name, campus, source }, { onConflict: 'email' })
      .select('id')
      .single();

    if (error) {
      console.error('[subscribe] db error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Optional Slack notification
    if (slackWebhook) {
      try {
        await fetch(slackWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `New Juxa signup\n• Email: ${email}\n• Name: ${name || '-'}\n• Campus: ${campus || '-'}\n• Source: ${source}`,
          }),
        });
      } catch (e) {
        console.warn('[subscribe] Slack notification failed:', e);
      }
    }

    // Optional Email (Resend)
    if (resendApiKey && notifyEmailTo && notifyEmailFrom) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(resendApiKey);
        const recipients = notifyEmailTo.split(',').map(s => s.trim()).filter(Boolean);
        await resend.emails.send({
          from: notifyEmailFrom,
          to: recipients,
          subject: 'New Juxa waitlist signup',
          text: `Email: ${email}\nName: ${name || '-'}\nCampus: ${campus || '-'}\nSource: ${source}`,
        });
      } catch (e) {
        console.warn('[subscribe] Email notification failed:', e);
      }
    }

    return NextResponse.json({ ok: true, id: data?.id ?? null }, { status: 201 });
  } catch (e) {
    console.error('[subscribe] error:', e);
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
