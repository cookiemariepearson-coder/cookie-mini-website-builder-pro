import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { defaultOfferTitle, getBillingLabel, getPlanPrice, normalizePageContent, normalizePages, normalizePlanKey, normalizeServiceCards, pageOptions } from '@/lib/templates';

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

function parseObject(value: any) {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    } catch {}
  }
  return {};
}

function normalizeAllPageContent(value: any) {
  const raw = parseObject(value);
  const normalized: any = normalizePageContent(raw, pageOptions);
  if (raw._art && typeof raw._art === 'object') {
    normalized._art = {
      title: String(raw._art.title || ''),
      details: String(raw._art.details || '')
    };
  }
  return normalized;
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
  const priceLabel = plan === 'free' ? 'Free' : payload.priceLabel || payload.price_label || getBillingLabel(plan, pages.length);
  const pageContent = normalizeAllPageContent(payload.pageContent || payload.page_content);

  if (!supabase) return NextResponse.json({ ok: true, demo: true, link, pathLink });

  const record = {
    slug,
    business_name: payload.businessName || payload.business_name,
    businessName: payload.businessName || payload.business_name,
    template: payload.template || 'local',
    plan,
    headline: payload.headline || '',
    description: payload.description || '',
    phone: payload.phone || '',
    email: payload.email || payload.customerEmail || '',
    primaryColor: payload.primaryColor || '#20172f',
    accentColor: payload.accentColor || '#c46a2d',
    pages,
    offer_title: payload.offerTitle || payload.offer_title || defaultOfferTitle,
    service_cards: normalizeServiceCards(payload.serviceCards || payload.service_cards, payload.template || 'local'),
    page_content: pageContent,
    billing: plan === 'free' ? 'free' : 'subscription',
    extra_page_count: plan === 'free' ? 0 : Number(payload.extraPageCount || payload.extra_page_count || 0),
    monthly_price: calculatedPrice,
    price_label: priceLabel,
    status: 'published',
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase.from('websites').upsert(record, { onConflict: 'slug' });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, link, pathLink });
}
