import * as React from 'react';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

type Row = {
  id: string;
  email: string;
  name: string | null;
  campus: string | null;
  source: string | null;
  created_at: string;
};

async function getRows(): Promise<Row[]> {
  const url = process.env.SUPABASE_URL as string | undefined;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;
  if (!url || !key) return [];

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from('waitlist_subscribers')
    .select('id,email,name,campus,source,created_at')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (error) {
    console.error('[admin] fetch error:', error);
    return [];
  }
  return data as Row[];
}

export default async function AdminPage() {
  const rows = await getRows();

  return (
    <main className="min-h-screen bg-[#0E1116] text-white p-6">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-2xl font-bold">Juxa — Waitlist Admin</h1>
        <p className="mt-1 text-sm text-white/70">Protected area. Use the Export button to download CSV.</p>

        <div className="mt-4 flex items-center gap-3">
          <a
            href="/api/admin/export"
            className="inline-flex items-center rounded-full bg-[#1FA7A0] px-4 py-2 text-sm font-semibold text-black hover:brightness-110"
          >
            Export CSV
          </a>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/10">
          <table className="min-w-full text-sm">
            <thead className="text-white/80">
              <tr className="text-left">
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Campus</th>
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-3 py-2 whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2">{r.email}</td>
                  <td className="px-3 py-2">{r.name || ""}</td>
                  <td className="px-3 py-2">{r.campus || ""}</td>
                  <td className="px-3 py-2">{r.source || ""}</td>
                  <td className="px-3 py-2 text-white/50">{r.id}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-3 py-6 text-white/60" colSpan={6}>No rows yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
