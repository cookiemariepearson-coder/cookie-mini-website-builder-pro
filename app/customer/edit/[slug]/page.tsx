'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { plans, templates, type TemplateKey } from '@/lib/templates';

const pageOptions = ['Home', 'About', 'Services', 'Products', 'Gallery', 'Testimonials', 'Contact', 'FAQ'];

export default function CustomerEditSitePage({ params }: { params: { slug: string } }) {
  const [email, setEmail] = useState('');
  const [site, setSite] = useState<any>(null);
  const [message, setMessage] = useState('Loading website editor...');
  const [saving, setSaving] = useState(false);
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cookiesdigitalcreations.com';

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
      const response = await fetch(`/api/customer/sites/${params.slug}?email=${encodeURIComponent(customerEmail)}`, {
        headers: { 'x-customer-email': customerEmail }
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'Could not load site.');
      const loaded = data.site;
      setSite({
        ...loaded,
        businessName: loaded.businessName || loaded.business_name || '',
        pages: Array.isArray(loaded.pages) ? loaded.pages : ['Home']
      });
      localStorage.setItem('cookie-customer-email', customerEmail);
      localStorage.setItem('cookie-customer-slug', params.slug);
      setMessage('Website loaded. Make changes, then save.');
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

  const planInfo = useMemo(() => plans[(site?.plan || 'starter') as keyof typeof plans] || plans.starter, [site]);
  const direct = `https://www.${rootDomain}/site/${params.slug}`;
  const subdomain = `https://${params.slug}.${rootDomain}`;

  async function saveSite() {
    if (!site) return;
    const customerEmail = email.trim().toLowerCase();
    setSaving(true);
    setMessage('Saving your website updates...');
    try {
      const response = await fetch(`/api/customer/sites/${params.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-customer-email': customerEmail },
        body: JSON.stringify({ ...site, customerEmail })
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'Could not save site.');
      setSite(data.site || site);
      setMessage('Saved. Open your website to review the update.');
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
      <p>Update your business details, contact information, colors, template, and selected pages. Plan changes and billing changes are handled through Cookie Digital Creations.</p>
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
        <div className="notice"><strong>Current plan:</strong> {planInfo.name}<br />{site.price_label || `$${site.monthly_price || planInfo.monthlyPrice}/month`}</div>
      </section>

      <section className="card wide-card">
        <h2>Pages / Sections</h2>
        <p>Home is required. Premium includes all available builder pages. Starter and Business may need the $10/month extra-page add-on for extra pages.</p>
        <div className="pages-grid admin-pages">
          {pageOptions.map(page => {
            const selected = (site.pages || ['Home']).includes(page);
            return <button key={page} onClick={() => togglePage(page)} className={`option ${selected ? 'active' : ''}`}><strong>{page}</strong><br /><span className="small">{page === 'Home' ? 'Required' : selected ? 'Selected' : 'Add page'}</span></button>;
          })}
        </div>
        <div className="controls">
          <button className="btn gold" onClick={saveSite} disabled={saving}>{saving ? 'Saving...' : 'Save & Republish'}</button>
          <a className="btn secondary" href={direct} target="_blank" rel="noreferrer">Open Direct Link</a>
          <a className="btn secondary" href={subdomain} target="_blank" rel="noreferrer">Open Subdomain</a>
          <Link className="btn secondary" href="/customer">Back to Dashboard</Link>
        </div>
      </section>
    </div>}
  </main>;
}
