import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // <- disable static caching of this route

function toCsv(rows: any[]) {
  const headers = ['created_at', 'email', 'name', 'campus', 'source', 'id'];
  const escape = (v: any) => {
    const s = (v ?? '').toString().replace(/"/g, '""');
    return `"${s}"`;
  };
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push(
      [r.created_at, r.email, r.name ?? '', r.campus ?? '', r.source ?? '', r.id]
        .map(escape)
        .join(',')
    );
  }
  // Use CRLF for maximum Excel compatibility
  return lines.join('\r\n');
}

export async function GET() {
  const url = process.env.SUPABASE_URL as string | undefined;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;
  if (!url || !key) {
    return new NextResponse('Server not configured', { status: 500 });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from('waitlist_subscribers')
    .select('id,email,name,campus,source,created_at')
    .order('created_at', { ascending: false })
    .limit(10000);

  if (error) {
    return new NextResponse('Database error', { status: 500 });
  }

  const csv = toCsv(data || []);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="juxa-waitlist.csv"',
      // Make absolutely sure nothing caches this
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
