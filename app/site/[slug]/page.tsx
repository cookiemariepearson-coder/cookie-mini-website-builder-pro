import { notFound } from 'next/navigation';
import { getDemoSite, getTemplateServices } from '@/lib/demo-sites';
import { getSupabaseAdmin } from '@/lib/supabase';

type CustomerSiteParams = {
  params: {
    slug: string;
  };
};

async function getSite(slug: string) {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data } = await supabase.from('websites').select('*').eq('slug', slug).eq('status', 'published').single();
    if (data) return data;
  }
  return getDemoSite(slug);
}

export default async function CustomerSitePage({ params }: CustomerSiteParams) {
  const site = await getSite(params.slug);
  if (!site) notFound();
  const services = getTemplateServices(site.template);
  const pages = site.pages || ['Home'];
  return <main className="site-preview" style={{marginTop:24, marginBottom:24}}>
    <header className="site-header" style={{background: site.primaryColor || '#20172f', color: 'white'}}>
      <strong>{site.businessName}</strong><span className="small" style={{color:'rgba(255,255,255,.82)'}}>{pages.join(' • ')}</span>
    </header>
    <section className="site-hero" style={{background: `linear-gradient(135deg, ${site.primaryColor || '#20172f'}, ${site.accentColor || '#c46a2d'})`, color:'white'}}>
      <span className="badge" style={{color: site.primaryColor || '#20172f'}}>Official Website</span>
      <h1>{site.headline}</h1>
      <p style={{color:'rgba(255,255,255,.88)'}}>{site.description}</p>
      <a className="btn gold" href={`mailto:${site.email || ''}`}>Contact Now</a>
    </section>
    <section className="site-section">
      <h2>What We Offer</h2>
      <div className="service-grid">
        {services.map((s: any) => <div className="service-card" key={s.title}><h3>{s.title}</h3><p>{s.text}</p></div>)}
      </div>
    </section>
    {pages.filter((p: string) => p !== 'Home').map((p: string) => <section className="site-section" key={p}><h2>{p}</h2><p>This page is ready to be customized with images, text, products, testimonials, booking details, forms, or customer-specific content.</p></section>)}
    <footer className="site-footer"><strong>{site.businessName}</strong><br/>{site.phone || ''} {site.phone && site.email ? '•' : ''} {site.email || ''}</footer>
  </main>;
}
