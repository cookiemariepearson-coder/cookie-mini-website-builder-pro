import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { verifyAdminPin } from '@/lib/admin-auth';

export async function GET(request: Request) {
  const auth = verifyAdminPin(request);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ ok: false, error: 'Supabase is not connected.' }, { status: 500 });

  const { data, error } = await supabase
    .from('websites')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const sites = data || [];
  const stats = {
    total: sites.length,
    published: sites.filter((site: any) => site.status === 'published').length,
    paused: sites.filter((site: any) => site.status === 'paused').length,
    draft: sites.filter((site: any) => site.status === 'draft').length,
    monthlyRevenue: sites
      .filter((site: any) => site.status === 'published')
      .reduce((sum: number, site: any) => sum + Number(site.monthly_price || 0), 0)
  };

  return NextResponse.json({ ok: true, sites, stats });
}
