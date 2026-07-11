import { notFound } from 'next/navigation';
import { getDemoSite } from '@/lib/demo-sites';
import { getSupabaseAdmin } from '@/lib/supabase';
import { normalizePages } from '@/lib/templates';
import { CustomerSiteView } from '@/lib/site-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type CustomerSiteParams = {
  params: {
    slug: string;
  };
};

function normalizeSite(site: any) {
  const businessName = site.businessName || site.business_name || 'My Business Name';
  return {
    ...site,
    businessName,
    business_name: businessName,
    template: site.template || 'local',
    headline: site.headline || '',
    description: site.description || '',
    primaryColor: site.primaryColor || '#20172f',
    accentColor: site.accentColor || '#c46a2d',
    pages: normalizePages(site.pages)
  };
}

async function getSite(slug: string) {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data } = await supabase
      .from('websites')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    if (data) return normalizeSite(data);
  }
  const demo = getDemoSite(slug);
  return demo ? normalizeSite(demo) : null;
}

export default async function CustomerSitePage({ params }: CustomerSiteParams) {
  const site = await getSite(params.slug);
  if (!site) notFound();

  return <main className="published-site-page">
    <CustomerSiteView site={site} />
  </main>;
}
