import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

function normalizeEmail(value: string | null) {
  return String(value || '').trim().toLowerCase();
}

function publicSiteFields(site: any) {
  return {
    id: site.id,
    slug: site.slug,
    businessName: site.businessName || site.business_name || '',
    business_name: site.business_name || site.businessName || '',
    template: site.template || 'local',
    plan: site.plan || 'starter',
    billing: site.billing || 'subscription',
    status: site.status || 'published',
    headline: site.headline || '',
    description: site.description || '',
    phone: site.phone || '',
    email: site.email || '',
    primaryColor: site.primaryColor || '#20172f',
    accentColor: site.accentColor || '#c46a2d',
    pages: Array.isArray(site.pages) ? site.pages : ['Home'],
    extra_page_count: site.extra_page_count || 0,
    monthly_price: site.monthly_price || 0,
    price_label: site.price_label || '',
    updated_at: site.updated_at,
    created_at: site.created_at
  };
}

function allowedCustomerUpdateFields(payload: any) {
  const update: Record<string, any> = {};
  const fields = [
    'businessName', 'business_name', 'headline', 'description', 'phone', 'email',
    'primaryColor', 'accentColor', 'pages', 'template'
  ];

  for (const field of fields) {
    if (field in payload) update[field] = payload[field];
  }

  if ('businessName' in payload) update.business_name = payload.businessName;
  if ('business_name' in payload) update.businessName = payload.business_name;
  update.updated_at = new Date().toISOString();
  return update;
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

  return NextResponse.json({ ok: true, site: publicSiteFields(result.site) });
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

  const update = allowedCustomerUpdateFields(payload);
  const { error } = await supabase
    .from('websites')
    .update(update)
    .eq('slug', params.slug);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const { data } = await supabase
    .from('websites')
    .select('*')
    .eq('slug', params.slug)
    .single();

  return NextResponse.json({ ok: true, site: data ? publicSiteFields(data) : null });
}
