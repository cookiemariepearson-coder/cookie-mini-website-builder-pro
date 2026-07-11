'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  EXTRA_PAGE_PRICE,
  getBillingLabel,
  getExtraPageCount,
  getPlanPrice,
  plans,
  templates,
  type PlanKey,
  type TemplateKey
} from '@/lib/templates';

const pageOptions = ['Home', 'About', 'Services', 'Products', 'Gallery', 'Testimonials', 'Contact', 'FAQ'];

function normalizeCheckoutUrl(rawUrl?: string) {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('gumroad.com') && !parsed.searchParams.has('wanted')) {
      parsed.searchParams.set('wanted', 'true');
    }
    return parsed.toString();
  } catch {
    return '';
  }
}

function normalizePlan(value: any): PlanKey {
  return value === 'business' || value === 'premium' ? value : 'starter';
}

export default function CustomerEditSitePage({ params }: { params: { slug: string } }) {
  const [email, setEmail] = useState('');
  const [site, setSite] = useState<any>(null);
  const [message, setMessage] = useState('Loading website editor...');
  const [saving, setSaving] = useState(false);
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cookiesdigitalcreations.com';
  const extraPageCheckoutUrl = normalizeCheckoutUrl(process.env.NEXT_PUBLIC_EXTRA_PAGE_SUBSCRIPTION_CHECKOUT_URL);

  useEffect(() => {
    const savedEmail = localStorage.getItem('cookie-customer-email') || '';
    setEmail(savedEmail);
    if (savedEmail) loadSite(savedEmail);
    else setMessage('Enter the email used when your website was created.');
  }, []);

  async function loadSite(emailToUse = email) {
    const customerEmail = emailToUse.trim().toLowerCase();
    if (!customerEmail) {
      setMessage('Please enter the email used when your website was created.');
      return;
    }

    try {
      setMessage('Loading your website...');
      const response = await fetch(`/api/customer/sites/${params.slug}?email=${encodeURIComponent(customerEmail)}&t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'x-customer-email': customerEmail }
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'Could not load site.');
      const loaded = data.site;
      setSite({
        ...loaded,
        businessName: loaded.businessName || loaded.business_name || '',
        plan: normalizePlan(loaded.plan),
        template: loaded.template || 'local',
        pages: Array.isArray(loaded.pages) ? loaded.pages : ['Home']
      });
      localStorage.setItem('cookie-customer-email', customerEmail);
      localStorage.setItem('cookie-customer-slug', params.slug);
      setMessage('Website loaded. Make changes, then save. The preview below updates as you edit.');
    } catch (error: any) {
      setMessage(error.message || 'Could not load site.');
    }
  }

  function update(field: string, value: any) {
    setSite((current: any) => ({ ...current, [field]: value }));
  }

  function togglePage(page: string) {
    if (!site || page === 'Home') return;
    const pages = Array.isArray(site.pages) ? site.pages : ['Home'];
    if (pages.includes(page)) update('pages', pages.filter((p: string) => p !== page));
    else update('pages', [...pages, page]);
  }

  const planKey = useMemo<PlanKey>(() => normalizePlan(site?.plan), [site]);
  const planInfo = plans[planKey];
  const selectedPages = Array.isArray(site?.pages) ? site.pages : ['Home'];
  const neededExtraPages = getExtraPageCount(planKey, selectedPages.length);
  const alreadyPaidExtraPages = Number(site?.extra_page_count || 0);
  const additionalExtraPagesNeeded = Math.max(0, neededExtraPages - alreadyPaidExtraPages);
  const price = getPlanPrice(planKey, selectedPages.length);
  const priceLabel = getBillingLabel(planKey, selectedPages.length);
  const direct = `https://www.${rootDomain}/site/${params.slug}`;
  const subdomain = `https://${params.slug}.${rootDomain}`;

  function buildPendingSite() {
    return {
      slug: params.slug,
      businessName: site?.businessName || site?.business_name || params.slug,
      template: site?.template || 'local',
      plan: planKey,
      headline: site?.headline || '',
      description: site?.description || '',
      phone: site?.phone || '',
      email: site?.email || email,
      primaryColor: site?.primaryColor || '#20172f',
      accentColor: site?.accentColor || '#c46a2d',
      pages: selectedPages,
      billing: 'subscription',
      extraPageCount: neededExtraPages,
      price,
      priceLabel,
      paymentStartedAt: new Date().toISOString()
    };
  }

  async function saveSite(options?: { skipExtraCheckout?: boolean }) {
    if (!site) return;
    const customerEmail = email.trim().toLowerCase();

    if (!options?.skipExtraCheckout && additionalExtraPagesNeeded > 0) {
      if (!extraPageCheckoutUrl) {
        setMessage('Extra page checkout is not connected yet. Add NEXT_PUBLIC_EXTRA_PAGE_SUBSCRIPTION_CHECKOUT_URL in Vercel, then redeploy.');
        return;
      }
      const pendingSite = buildPendingSite();
      localStorage.setItem('cookie-builder-pending-site', JSON.stringify(pendingSite));
      localStorage.setItem('cookie-builder-last-draft', JSON.stringify(pendingSite));
      localStorage.setItem('cookie-customer-email', customerEmail);
      setMessage(`You added ${additionalExtraPagesNeeded} extra page${additionalExtraPagesNeeded > 1 ? 's' : ''}. Opening the $10/month extra page checkout now. After payment, click the Gumroad return link to republish automatically.`);
      window.location.href = extraPageCheckoutUrl;
      return;
    }

    setSaving(true);
    setMessage('Saving your website updates...');
    try {
      const response = await fetch(`/api/customer/sites/${params.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-customer-email': customerEmail },
        body: JSON.stringify({
          ...site,
          customerEmail,
          pages: selectedPages,
          extra_page_count: Math.max(neededExtraPages, alreadyPaidExtraPages),
          monthly_price: price,
          price_label: priceLabel
        })
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'Could not save site.');
      setSite(data.site || site);
      setMessage('Saved and republished. Open your website to review the update. If a browser tab was already open, refresh it to see the newest version.');
    } catch (error: any) {
      setMessage(error.message || 'Could not save site.');
    } finally {
      setSaving(false);
    }
  }

  return <main className="container section">
    <nav className="nav">
      <div className="brand"><span className="logo">C</span> Edit My Website</div>
      <div className="navlinks">
        <Link href="/customer">Customer Dashboard</Link>
        <Link href="/builder">Create Site</Link>
        <Link href="/">Home</Link>
      </div>
    </nav>

    <section className="card">
      <span className="badge">Customer editor</span>
      <h1>Edit {site?.businessName || params.slug}</h1>
      <p>Update the website details, colors, template, and pages. If extra pages are added beyond the subscription limit, the page add-on checkout opens automatically.</p>
      <div className="admin-pin-row">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email used for this website" type="email" />
        <button className="btn secondary" onClick={() => loadSite()} disabled={!email}>Load Site</button>
      </div>
      {message && <div className="notice" style={{marginTop: 14}}>{message}</div>}
    </section>

    {site && <div className="edit-grid">
      <section className="card">
        <h2>Content</h2>
        <div className="field"><label>Business Name</label><input value={site.businessName || ''} onChange={e => update('businessName', e.target.value)} /></div>
        <div className="field"><label>Headline</label><textarea value={site.headline || ''} onChange={e => update('headline', e.target.value)} /></div>
        <div className="field"><label>Description</label><textarea value={site.description || ''} onChange={e => update('description', e.target.value)} /></div>
        <div className="field"><label>Phone</label><input value={site.phone || ''} onChange={e => update('phone', e.target.value)} /></div>
        <div className="field"><label>Email</label><input value={site.email || ''} onChange={e => update('email', e.target.value)} /></div>
      </section>

      <section className="card">
        <h2>Design</h2>
        <div className="field"><label>Template</label><select value={site.template || 'local'} onChange={e => update('template', e.target.value as TemplateKey)}>{Object.entries(templates).map(([key, item]) => <option value={key} key={key}>{item.name}</option>)}</select></div>
        <div className="field"><label>Main Color</label><input type="color" value={site.primaryColor || '#20172f'} onChange={e => update('primaryColor', e.target.value)} /></div>
        <div className="field"><label>Accent Color</label><input type="color" value={site.accentColor || '#c46a2d'} onChange={e => update('accentColor', e.target.value)} /></div>
        <div className="notice"><strong>Current plan:</strong> {planInfo.name}<br />{priceLabel}</div>
      </section>

      <section className="card wide-card">
        <h2>Pages / Sections</h2>
        <p>Home is required. Starter includes 1 page. Business includes up to 3 pages. Premium includes all available pages. Extra pages are $10/month per extra page.</p>
        <div className="pages-grid admin-pages">
          {pageOptions.map(page => {
            const selected = selectedPages.includes(page);
            return <button key={page} onClick={() => togglePage(page)} className={`option ${selected ? 'active' : ''}`}><strong>{page}</strong><br /><span className="small">{page === 'Home' ? 'Required' : selected ? 'Selected' : 'Add page'}</span></button>;
          })}
        </div>
        {additionalExtraPagesNeeded > 0 && <div className="notice danger" style={{marginTop: 18}}>
          <strong>Extra page checkout required:</strong> You added {additionalExtraPagesNeeded} extra page{additionalExtraPagesNeeded > 1 ? 's' : ''} beyond the current subscription. Click below and the $10/month extra page checkout will open automatically.
        </div>}
        <div className="controls">
          <button className="btn gold" onClick={() => saveSite()} disabled={saving}>{saving ? 'Saving...' : additionalExtraPagesNeeded > 0 ? 'Checkout Extra Pages & Republish' : 'Save & Republish'}</button>
          <a className="btn secondary" href={direct} target="_blank" rel="noreferrer">Open Direct Link</a>
          <a className="btn secondary" href={subdomain} target="_blank" rel="noreferrer">Open Subdomain</a>
          <Link className="btn secondary" href="/customer">Back to Dashboard</Link>
        </div>
      </section>

      <section className="card wide-card">
        <h2>Live Preview</h2>
        <p className="small">This preview changes immediately while editing. After saving, refresh the live website link if you already had it open.</p>
        <CustomerPreview site={site} pages={selectedPages} />
      </section>
    </div>}
  </main>;
}

function CustomerPreview({ site, pages }: { site: any; pages: string[] }) {
  const template = templates[(site.template || 'local') as TemplateKey] || templates.local;
  return <div className="site-preview" style={{marginTop: 18, textAlign: 'left'}}>
    <header className="site-header" style={{background: site.primaryColor || '#20172f', color: 'white'}}>
      <strong>{site.businessName || 'My Business Name'}</strong>
      <span className="small" style={{color:'rgba(255,255,255,.82)'}}>{pages.join(' • ')}</span>
    </header>
    <section className="site-hero" style={{background: `linear-gradient(135deg, ${site.primaryColor || '#20172f'}, ${site.accentColor || '#c46a2d'})`, color: 'white'}}>
      <span className="badge" style={{color: site.primaryColor || '#20172f'}}>Preview</span>
      <h1>{site.headline || template.headline}</h1>
      <p style={{color:'rgba(255,255,255,.88)'}}>{site.description || template.description}</p>
      <button className="btn gold">Contact Now</button>
    </section>
    <section className="site-section">
      <h2>What We Offer</h2>
      <div className="service-grid">
        {template.services.map((s: any) => <div className="service-card" key={s.title}><h3>{s.title}</h3><p>{s.text}</p></div>)}
      </div>
    </section>
    {pages.filter((p: string) => p !== 'Home').map((p: string) => <section className="site-section" key={p}><h2>{p}</h2><p>This page is ready to be customized with images, text, products, testimonials, booking details, forms, or customer-specific content.</p></section>)}
    <footer className="site-footer"><strong>{site.businessName || 'My Business Name'}</strong><br />{site.phone || 'Add phone'} • {site.email || 'Add email'}</footer>
  </div>;
}
