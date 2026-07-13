import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import {
  defaultOfferTitle,
  getBillingLabel,
  getExtraPageCount,
  getPlanPrice,
  normalizePageContent,
  normalizePages,
  normalizePlanKey,
  normalizeServiceCards,
  pageOptions,
  type PlanKey
} from '@/lib/templates';

export const dynamic = 'force-dynamic';

function normalizeEmail(value: string | null) {
  return String(value || '').trim().toLowerCase();
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

function publicSiteFields(site: any) {
  const plan = normalizePlanKey(site.plan);
  const pages = plan === 'free' ? ['Home'] : normalizePages(site.pages);
  const extra_page_count = Number(site.extra_page_count || 0);
  return {
    id: site.id,
    slug: site.slug,
    businessName: site.businessName || site.business_name || '',
    business_name: site.business_name || site.businessName || '',
    template: site.template || 'local',
    plan,
    billing: site.billing || (plan === 'free' ? 'free' : 'subscription'),
    status: site.status || 'published',
    headline: site.headline || '',
    description: site.description || '',
    phone: site.phone || '',
    email: site.email || '',
    primaryColor: site.primaryColor || '#20172f',
    accentColor: site.accentColor || '#c46a2d',
    pages,
    offerTitle: site.offerTitle || site.offer_title || defaultOfferTitle,
    offer_title: site.offer_title || site.offerTitle || defaultOfferTitle,
    serviceCards: normalizeServiceCards(site.serviceCards || site.service_cards, site.template || 'local'),
    service_cards: normalizeServiceCards(site.serviceCards || site.service_cards, site.template || 'local'),
    pageContent: normalizeAllPageContent(site.pageContent || site.page_content),
    page_content: normalizeAllPageContent(site.pageContent || site.page_content),
    extra_page_count,
    monthly_price: site.monthly_price || getPlanPrice(plan, pages.length),
    price_label: site.price_label || getBillingLabel(plan, pages.length),
    updated_at: site.updated_at,
    created_at: site.created_at
  };
}

function buildCustomerUpdate(payload: any, existing: any) {
  const update: Record<string, any> = {};
  const existingPlan: PlanKey = normalizePlanKey(existing.plan);
  const pages = existingPlan === 'free' ? ['Home'] : normalizePages(payload.pages || existing.pages);
  const paidExtraPages = Number(existing.extra_page_count || 0);
  const requiredExtraPages = existingPlan === 'free' ? 0 : getExtraPageCount(existingPlan, pages.length);

  if (requiredExtraPages > paidExtraPages) {
    return {
      error: `Extra page checkout required before saving this page selection. Your ${existingPlan} plan includes ${existingPlan === 'business' ? 3 : 1} page${existingPlan === 'business' ? 's' : ''}. Extra pages are $10/month per page.`,
      status: 402,
      update: null
    };
  }

  const textFields = ['businessName', 'business_name', 'headline', 'description', 'phone', 'email', 'primaryColor', 'accentColor', 'template'];
  for (const field of textFields) {
    if (field in payload) update[field] = payload[field];
  }

  if ('businessName' in payload) update.business_name = payload.businessName;
  if ('business_name' in payload) update.businessName = payload.business_name;

  update.pages = pages;
  update.offer_title = payload.offerTitle || payload.offer_title || existing.offer_title || defaultOfferTitle;
  update.service_cards = normalizeServiceCards(payload.serviceCards || payload.service_cards || existing.service_cards, payload.template || existing.template || 'local');
  update.page_content = normalizeAllPageContent(payload.pageContent || payload.page_content || existing.page_content);

  update.extra_page_count = paidExtraPages;
  update.monthly_price = payload.monthly_price || getPlanPrice(existingPlan, pages.length);
  update.price_label = payload.price_label || getBillingLabel(existingPlan, pages.length);
  update.status = 'published';
  update.updated_at = new Date().toISOString();

  return { error: null, status: 200, update };
}

async function loadSiteForCustomer(slug: string, email: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: 'Supabase is not connected.', site: null };

  const { data, error } = await supabase
    .from('websites')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return { error: 'Website not found. Check the website name/subdomain.', site: null };

  const savedEmail = normalizeEmail(data.email);
  const incomingEmail = normalizeEmail(email);
  if (!savedEmail || !incomingEmail || savedEmail !== incomingEmail) {
    return { error: 'Email does not match this website record. Use the email entered when the website was created.', site: null };
  }

  return { error: null, site: data };
}

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const url = new URL(request.url);
  const email = request.headers.get('x-customer-email') || url.searchParams.get('email') || '';
  const result = await loadSiteForCustomer(params.slug, email);

  if (result.error || !result.site) {
    return NextResponse.json({ ok: false, error: result.error || 'Website not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, site: publicSiteFields(result.site) }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  const payload = await request.json();
  const email = request.headers.get('x-customer-email') || payload.customerEmail || payload.email || '';
  const result = await loadSiteForCustomer(params.slug, email);

  if (result.error || !result.site) {
    return NextResponse.json({ ok: false, error: result.error || 'Website not found.' }, { status: 404 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ ok: false, error: 'Supabase is not connected.' }, { status: 500 });

  const built = buildCustomerUpdate(payload, result.site);
  if (built.error || !built.update) {
    return NextResponse.json({ ok: false, error: built.error }, { status: built.status || 400 });
  }

  const { error } = await supabase
    .from('websites')
    .update(built.update)
    .eq('slug', params.slug);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const { data } = await supabase
    .from('websites')
    .select('*')
    .eq('slug', params.slug)
    .single();

  return NextResponse.json({ ok: true, site: data ? publicSiteFields(data) : null }, { headers: { 'Cache-Control': 'no-store' } });
}
