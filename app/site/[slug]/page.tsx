import { notFound } from 'next/navigation';
import { getSupabaseAdmin } from '@/lib/supabase';
import { CustomerSiteView } from '@/lib/site-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type CustomerSiteParams = {
  params: {
    slug: string;
  };
};

async function getSite(slug: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('websites')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return null;
  return data;
}

export default async function CustomerSitePage({ params }: CustomerSiteParams) {
  const site = await getSite(params.slug);
  if (!site) notFound();

  return <main style={{marginTop: 24, marginBottom: 24}}>
    <CustomerSiteView site={site} />
  </main>;
}
