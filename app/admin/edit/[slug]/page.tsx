'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { plans, templates, type PlanKey, type TemplateKey } from '@/lib/templates';

const pageOptions = ['Home', 'About', 'Services', 'Products', 'Gallery', 'Testimonials', 'Contact', 'FAQ'];

export default function AdminEditSitePage({ params }: { params: { slug: string } }) {
  const [pin, setPin] = useState('');
  const [site, setSite] = useState<any>(null);
  const [message, setMessage] = useState('Loading site editor...');
  const [saving, setSaving] = useState(false);
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cookiesdigitalcreations.com';

  useEffect(() => {
    const savedPin = localStorage.getItem('cookie-admin-pin') || '';
    setPin(savedPin);
    if (savedPin) loadSite(savedPin);
    else setMessage('Enter your admin PIN to edit this customer website.');
  }, []);

  async function loadSite(pinToUse = pin) {
    try {
      setMessage('Loading website...');
      const response = await fetch(`/api/admin/sites/${params.slug}`, { headers: { 'x-admin-pin': pinToUse } });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'Could not load site.');
      const loaded = data.site;
      setSite({
        ...loaded,
        businessName: loaded.businessName || loaded.business_name || '',
        pages: Array.isArray(loaded.pages) ? loaded.pages : ['Home']
      });
      localStorage.setItem('cookie-admin-pin', pinToUse);
      setMessage('Site loaded. Make changes, then save.');
    } catch (error: any) {
      setMessage(error.message || 'Could not load site.');
    }
  }

  function update(field: string, value: any) {
    setSite((current: any) => ({ ...current, [field]: value }));
  }

  function togglePage(page: string) {
    if (!site) return;
    if (page === 'Home') return;
    const pages = Array.isArray(site.pages) ? site.pages : ['Home'];
    if (pages.includes(page)) update('pages', pages.filter((p: string) => p !== page));
    else update('pages', [...pages, page]);
  }

  const priceLabel = useMemo(() => {
    if (!site) return '';
    return site.price_label || `$${site.monthly_price || plans[site.plan as PlanKey]?.monthlyPrice || 0}/month`;
  }, [site]);

  async function saveSite() {
    if (!site) return;
    setSaving(true);
    setMessage('Saving changes...');
    try {
      const response = await fetch(`/api/admin/sites/${params.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-pin': pin },
        body: JSON.stringify(site)
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'Could not save site.');
      setMessage('Saved. Open the published website to review the update.');
    } catch (error: any) {
      setMessage(error.message || 'Could not save site.');
    } finally {
      setSaving(false);
    }
  }

  const direct = `https://www.${rootDomain}/site/${params.slug}`;
  const subdomain = `https://${params.slug}.${rootDomain}`;

  return <main className="container section">
    <nav className="nav">
      <div className="brand"><span className="logo">C</span> Edit Customer Website</div>
      <div className="navlinks">
        <Link href="/admin">Admin</Link>
        <Link href="/builder">Builder</Link>
      </div>
    </nav>

    <section className="card">
      <span className="badge">Customer website editor</span>
      <h1>Edit {site?.businessName || params.slug}</h1>
      <p>Update the saved Supabase record. Changes show on both the direct link and customer subdomain.</p>
      <div className="admin-pin-row">
        <input value={pin} onChange={e => setPin(e.target.value)} placeholder="ADMIN_PIN" type="password" />
        <button className="btn secondary" onClick={() => loadSite()} disabled={!pin}>Reload Site</button>
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
        <h2>Plan & Status</h2>
        <div className="field"><label>Template</label><select value={site.template || 'local'} onChange={e => update('template', e.target.value as TemplateKey)}>{Object.entries(templates).map(([key, item]) => <option value={key} key={key}>{item.name}</option>)}</select></div>
        <div className="field"><label>Plan</label><select value={site.plan || 'starter'} onChange={e => update('plan', e.target.value as PlanKey)}>{Object.entries(plans).map(([key, item]) => <option value={key} key={key}>{item.name}</option>)}</select></div>
        <div className="field"><label>Status</label><select value={site.status || 'published'} onChange={e => update('status', e.target.value)}><option value="published">Published</option><option value="paused">Paused</option><option value="draft">Draft</option></select></div>
        <div className="field"><label>Monthly Price</label><input type="number" value={site.monthly_price || ''} onChange={e => update('monthly_price', Number(e.target.value))} /></div>
        <div className="field"><label>Price Label</label><input value={site.price_label || priceLabel} onChange={e => update('price_label', e.target.value)} /></div>
        <div className="field"><label>Main Color</label><input type="color" value={site.primaryColor || '#20172f'} onChange={e => update('primaryColor', e.target.value)} /></div>
        <div className="field"><label>Accent Color</label><input type="color" value={site.accentColor || '#c46a2d'} onChange={e => update('accentColor', e.target.value)} /></div>
      </section>

      <section className="card wide-card">
        <h2>Pages / Sections</h2>
        <p>Select what appears on the customer website.</p>
        <div className="pages-grid admin-pages">
          {pageOptions.map(page => {
            const selected = (site.pages || ['Home']).includes(page);
            return <button key={page} onClick={() => togglePage(page)} className={`option ${selected ? 'active' : ''}`}><strong>{page}</strong><br /><span className="small">{page === 'Home' ? 'Required' : selected ? 'Selected' : 'Add page'}</span></button>;
          })}
        </div>
        <div className="controls">
          <button className="btn gold" onClick={saveSite} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          <a className="btn secondary" href={direct} target="_blank" rel="noreferrer">Open Direct Link</a>
          <a className="btn secondary" href={subdomain} target="_blank" rel="noreferrer">Open Subdomain</a>
        </div>
      </section>
    </div>}
  </main>;
}
