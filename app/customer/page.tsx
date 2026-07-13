'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

function cleanSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\.cookiesdigitalcreations\.com.*$/, '')
    .replace(/^www\.cookiesdigitalcreations\.com\/site\//, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function money(value: any) {
  return `$${Number(value || 0).toLocaleString()}/mo`;
}

function normalizeCheckoutUrl(rawUrl?: string) {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('gumroad.com') && !parsed.searchParams.has('wanted')) parsed.searchParams.set('wanted', 'true');
    return parsed.toString();
  } catch {
    return '';
  }
}

export default function CustomerDashboardPage() {
  const [email, setEmail] = useState('');
  const [slug, setSlug] = useState('');
  const [site, setSite] = useState<any>(null);
  const [message, setMessage] = useState('Enter the email and website name used during setup.');
  const [loading, setLoading] = useState(false);
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cookiesdigitalcreations.com';
  const extraPageCheckoutUrl = normalizeCheckoutUrl(process.env.NEXT_PUBLIC_EXTRA_PAGE_SUBSCRIPTION_CHECKOUT_URL);

  useEffect(() => {
    const savedEmail = localStorage.getItem('cookie-customer-email') || '';
    const savedSlug = localStorage.getItem('cookie-customer-slug') || '';
    setEmail(savedEmail);
    setSlug(savedSlug);
    if (savedEmail && savedSlug) loadSite(savedSlug, savedEmail);
  }, []);

  async function loadSite(slugValue = slug, emailValue = email) {
    const clean = cleanSlug(slugValue);
    const customerEmail = emailValue.trim().toLowerCase();
    if (!clean || !customerEmail) {
      setMessage('Please enter both your website name and email address.');
      return;
    }

    setLoading(true);
    setMessage('Looking up your website...');
    try {
      const response = await fetch(`/api/customer/sites/${clean}?email=${encodeURIComponent(customerEmail)}`, {
        headers: { 'x-customer-email': customerEmail }
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'Could not load your website.');
      setSite(data.site);
      setSlug(clean);
      localStorage.setItem('cookie-customer-email', customerEmail);
      localStorage.setItem('cookie-customer-slug', clean);
      setMessage('Website loaded. You can open it, edit it, republish it, or add extra pages through checkout.');
    } catch (error: any) {
      setSite(null);
      setMessage(error.message || 'Could not load your website.');
    } finally {
      setLoading(false);
    }
  }

  const links = useMemo(() => {
    const liveSlug = site?.slug || cleanSlug(slug);
    return {
      subdomain: liveSlug ? `https://${liveSlug}.${rootDomain}` : '',
      direct: liveSlug ? `https://www.${rootDomain}/site/${liveSlug}` : ''
    };
  }, [site, slug, rootDomain]);

  return <main className="container section">
    <nav className="nav">
      <div className="brand"><span className="logo">C</span> Customer Dashboard</div>
      <div className="navlinks">
        <Link href="/builder">Create Site</Link>
        <Link href="/dashboard">Owner Dashboard</Link>
        <Link href="/">Home</Link>
      </div>
    </nav>

    <section className="card admin-hero">
      <span className="badge">Customer access</span>
      <h1>Manage your published website.</h1>
      <p>Use the email and website name/subdomain from your setup. This lets customers reopen their website, edit basic content, and republish changes while subscribed.</p>
      <div className="edit-grid customer-login-grid">
        <div className="field"><label>Email used for the website</label><input value={email} onChange={e => setEmail(e.target.value)} placeholder="customer@email.com" type="email" /></div>
        <div className="field"><label>Website name / subdomain</label><input value={slug} onChange={e => setSlug(e.target.value)} placeholder="my-business-name" /></div>
      </div>
      <div className="controls">
        <button className="btn gold" onClick={() => loadSite()} disabled={loading}>{loading ? 'Loading...' : 'Open My Website Dashboard'}</button>
        <Link className="btn secondary" href="/builder">Build a New Website</Link>
      </div>
      {message && <div className="notice" style={{marginTop: 14}}>{message}</div>}
    </section>

    {site && <section className="card customer-site-card">
      <div className="admin-table-head">
        <div>
          <span className="badge">Website found</span>
          <h2>{site.businessName || site.business_name || site.slug}</h2>
          <p>{site.slug}.{rootDomain}</p>
        </div>
        <div className="customer-status-pill">{site.status || 'published'}</div>
      </div>

      <div className="admin-stats customer-stats">
        <div className="card mini-stat"><span>Plan</span><strong>{site.plan || 'starter'}</strong></div>
        <div className="card mini-stat"><span>Monthly Price</span><strong>{site.price_label || money(site.monthly_price)}</strong></div>
        <div className="card mini-stat"><span>Pages</span><strong>{Array.isArray(site.pages) ? site.pages.length : 1}</strong></div>
        <div className="card mini-stat"><span>Last Updated</span><strong>{site.updated_at ? new Date(site.updated_at).toLocaleDateString() : 'Saved'}</strong></div>
      </div>

      <div className="notice">
        <strong>Customer website domain:</strong><br />
        {site.slug}.{rootDomain}
      </div>

      <div className="controls">
        <a className="btn gold" href={links.subdomain} target="_blank" rel="noreferrer">Open Live Website</a>
        <a className="btn secondary" href={links.direct} target="_blank" rel="noreferrer">Open Backup Direct Link</a>
        <Link className="btn secondary" href={`/customer/edit/${site.slug}`}>Edit Website Details</Link>
      </div>

      <div className="card" style={{boxShadow: 'none', marginTop: 18}}>
        <h3>Need more pages?</h3>
        <p>Extra pages are $10/month per page. Use the add-on checkout button below to add pages automatically. Any issues, click the Contact Us button for help.</p>
        <div className="controls" style={{marginTop: 12}}>
          {extraPageCheckoutUrl ? <a className="btn gold" href={extraPageCheckoutUrl}>Add Extra Page — $10/mo</a> : <div className="notice danger">Extra page checkout link is not connected yet. Add NEXT_PUBLIC_EXTRA_PAGE_SUBSCRIPTION_CHECKOUT_URL in Vercel.</div>}
          <a className="btn secondary" href="mailto:cookiepearson69@gmail.com?subject=Cookie%20Mini%20Website%20Builder%20Support">Contact Us</a>
        </div>
      </div>
    </section>}
  </main>;
}
