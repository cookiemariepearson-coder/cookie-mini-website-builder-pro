import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../../lib/supabaseAdmin';

const allowed = [
  'status',
  'plan',
  'extra_pages',
  'monthly_price',
  'customer_email',
  'business_name',
  'admin_notes'
];

export async function POST(req) {
  try {
    const { pin, slug, updates } = await req.json();
    if (pin !== process.env.ADMIN_PIN) {
      return NextResponse.json({ ok: false, error: 'Invalid PIN' }, { status: 401 });
    }
    if (!slug) {
      return NextResponse.json({ ok: false, error: 'Missing website slug.' }, { status: 400 });
    }

    const safe = {};
    allowed.forEach((key) => {
      if (updates?.[key] !== undefined) safe[key] = updates[key];
    });

    if (safe.extra_pages !== undefined) safe.extra_pages = Number(safe.extra_pages || 0);
    if (safe.monthly_price !== undefined) safe.monthly_price = Number(safe.monthly_price || 0);
    safe.updated_at = new Date().toISOString();

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('websites').update(safe).eq('slug', slug);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
