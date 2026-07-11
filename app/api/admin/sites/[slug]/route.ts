import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { verifyAdminPin } from '@/lib/admin-auth';

function allowedUpdateFields(payload: any) {
  const update: Record<string, any> = {};
  const fields = [
    'businessName', 'business_name', 'template', 'plan', 'headline', 'description',
    'phone', 'email', 'primaryColor', 'accentColor', 'pages', 'billing',
    'extra_page_count', 'monthly_price', 'price_label', 'status'
  ];

  for (const field of fields) {
    if (field in payload) update[field] = payload[field];
  }

  if ('businessName' in payload) update.business_name = payload.businessName;
  if ('business_name' in payload) update.businessName = payload.business_name;
  update.updated_at = new Date().toISOString();
  return update;
}

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const auth = verifyAdminPin(request);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ ok: false, error: 'Supabase is not connected.' }, { status: 500 });

  const { data, error } = await supabase
    .from('websites')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 404 });
  return NextResponse.json({ ok: true, site: data });
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  const auth = verifyAdminPin(request);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ ok: false, error: 'Supabase is not connected.' }, { status: 500 });

  const payload = await request.json();
  const update = allowedUpdateFields(payload);
  const { error } = await supabase
    .from('websites')
    .update(update)
    .eq('slug', params.slug);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  const auth = verifyAdminPin(request);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ ok: false, error: 'Supabase is not connected.' }, { status: 500 });

  const { error } = await supabase
    .from('websites')
    .update({ status: 'paused', updated_at: new Date().toISOString() })
    .eq('slug', params.slug);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
