import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  const payload = await request.json();
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cookiesdigitalcreations.com';
  const link = `${payload.slug}.${rootDomain}`;
  const supabase = getSupabaseAdmin();

  // Demo mode: without Supabase env variables, the builder still shows what the live link will be.
  if (!supabase) {
    return NextResponse.json({ ok: true, demo: true, link });
  }

  const record = {
    slug: payload.slug,
    business_name: payload.businessName,
    businessName: payload.businessName,
    template: payload.template,
    plan: payload.plan,
    headline: payload.headline,
    description: payload.description,
    phone: payload.phone,
    email: payload.email,
    primaryColor: payload.primaryColor,
    accentColor: payload.accentColor,
    pages: payload.pages,
    billing: payload.billing || 'subscription',
    extra_page_count: payload.extraPageCount || 0,
    monthly_price: payload.price || null,
    price_label: payload.priceLabel || null,
    status: 'published',
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase.from('websites').upsert(record, { onConflict: 'slug' });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, link });
}
