import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getBillingLabel, getPlanPrice, normalizePages, normalizePlanKey } from '@/lib/templates';

function cleanRootDomain(value?: string | null) {
  const fallback = 'cookiesdigitalcreations.com';
  const raw = (value || fallback).trim();
  return raw
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .split('/')[0]
    .split(':')[0]
    .toLowerCase();
}

export async function POST(request: Request) {
  const payload = await request.json();
  const rootDomain = cleanRootDomain(process.env.NEXT_PUBLIC_ROOT_DOMAIN);
  const slug = String(payload.slug || '').trim().toLowerCase();
  const link = `${slug}.${rootDomain}`;
  const pathLink = `https://www.${rootDomain}/site/${slug}`;
  const supabase = getSupabaseAdmin();

  if (!slug) return NextResponse.json({ ok: false, error: 'Missing customer website slug.' }, { status: 400 });

  const plan = normalizePlanKey(payload.plan);
  const pages = plan === 'free' ? ['Home'] : normalizePages(payload.pages);
  const calculatedPrice = plan === 'free' ? 0 : getPlanPrice(plan, pages.length);
  const priceLabel = plan === 'free' ? 'Free' : payload.priceLabel || getBillingLabel(plan, pages.length);

  if (!supabase) return NextResponse.json({ ok: true, demo: true, link, pathLink });

  const record = {
    slug,
    business_name: payload.businessName,
    businessName: payload.businessName,
    template: payload.template,
    plan,
    headline: payload.headline,
    description: payload.description,
    phone: payload.phone,
    email: payload.email,
    primaryColor: payload.primaryColor,
    accentColor: payload.accentColor,
    pages,
    billing: plan === 'free' ? 'free' : 'subscription',
    extra_page_count: plan === 'free' ? 0 : payload.extraPageCount || 0,
    monthly_price: calculatedPrice,
    price_label: priceLabel,
    status: 'published',
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase.from('websites').upsert(record, { onConflict: 'slug' });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, link, pathLink });
}
