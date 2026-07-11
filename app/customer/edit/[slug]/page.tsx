'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  getBillingLabel,
  getExtraPageCount,
  getPlanPrice,
  normalizePages,
  pageOptions,
  plans,
  templates,
  type PlanKey,
  type TemplateKey
} from '@/lib/templates';
import { CustomerSiteView } from '@/lib/site-view';

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

function isTemplateDefaultText(value: string, field: 'headline' | 'description') {
  const cleaned = String(value || '').trim();
  if (!cleaned) return true;
  return Object.values(templates).some(template => template[field] === cleaned);
}

function friendlyPageLimit(plan: PlanKey) {
  const info = plans[plan];
  return info.allPages ? 'Premium includes all available pages.' : `${info.name} includes ${info.maxPages} page${info.maxPages > 1 ? 's' : ''}. Extra pages are $10/month per page.`;
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const templateKey = templates[loaded.template as TemplateKey] ? loaded.template : 'local';
      setSite({
        ...loaded,
        businessName: loaded.businessName || loaded.business_name || '',
        business_name: loaded.business_name || loaded.businessName || '',
        plan: normalizePlan(loaded.plan),
        template: templateKey,
        primaryColor: loaded.primaryColor || templates[templateKey as TemplateKey].defaultPrimary,
        accentColor: loaded.accentColor || templates[templateKey as TemplateKey].defaultAccent,
        pages: normalizePages(loaded.pages)
      });
      localStorage.setItem('cookie-customer-email', customerEmail);
      localStorage.setItem('cookie-customer-slug', params.slug);
      setMessage('Website loaded. Edit on the left and watch the preview update on the right. Click Save & Republish when finished.');
    } catch (error: any) {
      setMessage(error.message || 'Could not load site.');
    }
  }

  function update(field: string, value: any) {
    setSite((current: any) => {
      if (!current) return current;
      const next = { ...current, [field]: value };
      if (field === 'businessName') next.business_name = value;
      if (field === 'business_name') next.businessName = value;
      return next;
    });
  }

  function applyTemplate(nextTemplate: TemplateKey) {
    const template = templates[nextTemplate];
    setSite((current: any) => {
      if (!current) return current;
      const currentHeadline = String(current?.headline ?? '');
      const currentDescription = String(current?.description ?? '');
      return {
        ...current,
        template: nextTemplate,
        primaryColor: template.defaultPrimary,
        accentColor: template.defaultAccent,
        headline: isTemplateDefaultText(currentHeadline, 'headline') ? template.headline : currentHeadline,
        description: isTemplateDefaultText(currentDescription, 'description') ? template.description : currentDescription
      };
    });
    setMessage(`Template changed to ${template.name}. The preview changed immediately. Click Save & Republish to update the live website.`);
  }

  const planKey = useMemo<PlanKey>(() => normalizePlan(site?.plan), [site]);
  const planInfo = plans[planKey];
  const selectedPages = normalizePages(site?.pages || ['Home']);
  const neededExtraPages = getExtraPageCount(planKey, selectedPages.length);
  const alreadyPaidExtraPages = Number(site?.extra_page_count || 0);
  const additionalExtraPagesNeeded = Math.max(0, neededExtraPages - alreadyPaidExtraPages);
  const price = getPlanPrice(planKey, selectedPages.length);
  const priceLabel = getBillingLabel(planKey, selectedPages.length);
  const direct = `https://www.${rootDomain}/site/${params.slug}?v=${Date.now()}`;
  const subdomain = `https://${params.slug}.${rootDomain}?v=${Date.now()}`;

  function buildPendingSite(pageOverride?: string[]) {
    const pagesToSave = normalizePages(pageOverride || selectedPages);
    const pendingNeededExtraPages = getExtraPageCount(planKey, pagesToSave.length);
    const pendingPrice = getPlanPrice(planKey, pagesToSave.length);
    const pendingPriceLabel = getBillingLabel(planKey, pagesToSave.length);
    return {
      slug: params.slug,
      businessName: site?.businessName || site?.business_name || params.slug,
      template: site?.template || 'local',
      plan: planKey,
      headline: site?.headline ?? '',
      description: site?.description ?? '',
      phone: site?.phone || '',
      email: site?.email || email,
      primaryColor: site?.primaryColor || templates[(site?.template || 'local') as TemplateKey]?.defaultPrimary || '#20172f',
      accentColor: site?.accentColor || templates[(site?.template || 'local') as TemplateKey]?.defaultAccent || '#c46a2d',
      pages: pagesToSave,
      billing: 'subscription',
      extraPageCount: Math.max(pendingNeededExtraPages, alreadyPaidExtraPages + Math.max(0, pendingNeededExtraPages - alreadyPaidExtraPages)),
      price: pendingPrice,
      priceLabel: pendingPriceLabel,
      paymentStartedAt: new Date().toISOString()
    };
  }

  function startExtraPageCheckout(pageOverride?: string[]) {
    if (!site) return;
    const customerEmail = email.trim().toLowerCase();
    if (!extraPageCheckoutUrl) {
      setMessage('Extra page checkout link is missing. Add NEXT_PUBLIC_EXTRA_PAGE_SUBSCRIPTION_CHECKOUT_URL in Vercel, then redeploy.');
      return;
    }
    const pendingSite = buildPendingSite(pageOverride);
    localStorage.setItem('cookie-builder-pending-site', JSON.stringify(pendingSite));
    localStorage.setItem('cookie-builder-last-draft', JSON.stringify(pendingSite));
    localStorage.setItem('cookie-customer-email', customerEmail);
    localStorage.setItem('cookie-customer-slug', params.slug);
    window.location.href = extraPageCheckoutUrl;
  }

  function togglePage(page: string) {
    if (!site || page === 'Home') return;
    const currentPages = normalizePages(site.pages);
    const selected = currentPages.includes(page);
    const nextPages = selected ? currentPages.filter((item: string) => item !== page) : normalizePages([...currentPages, page]);
    const nextNeededExtraPages = getExtraPageCount(planKey, nextPages.length);
    const extraNeeded = Math.max(0, nextNeededExtraPages - alreadyPaidExtraPages);

    if (!selected && extraNeeded > 0) {
      setMessage(`This adds ${extraNeeded} extra page${extraNeeded > 1 ? 's' : ''}. Extra pages are $10/month per page. Opening checkout now so this page can be unlocked.`);
      startExtraPageCheckout(nextPages);
      return;
    }

    setSite((current: any) => ({ ...current, pages: nextPages }));
    setMessage(selected ? `${page} removed from this website. Click Save & Republish to update the live website.` : `${page} added. Click Save & Republish to update the live website.`);
  }

  function resetPages() {
    setSite((current: any) => ({ ...current, pages: ['Home'] }));
    setMessage('Pages reset to Home only. Click Save & Republish to update the live website.');
  }

  async function saveSite(options?: { skipExtraCheckout?: boolean }) {
    if (!site) return;
    const customerEmail = email.trim().toLowerCase();

    if (!customerEmail) {
      setMessage('Please enter the email used for this website before saving.');
      return;
    }

    if (!options?.skipExtraCheckout && additionalExtraPagesNeeded > 0) {
      setMessage(`You selected ${additionalExtraPagesNeeded} new extra page${additionalExtraPagesNeeded > 1 ? 's' : ''}. Opening the $10/month extra page checkout now.`);
      startExtraPageCheckout(selectedPages);
      return;
    }

    setSaving(true);
    setMessage('Saving and republishing your website updates...');
    try {
      const payload = {
        slug: params.slug,
        businessName: site.businessName || site.business_name || params.slug,
        business_name: site.businessName || site.business_name || params.slug,
        customerEmail,
        template: site.template || 'local',
        plan: planKey,
        headline: site.headline ?? '',
        description: site.description ?? '',
        phone: site.phone || '',
        email: site.email || customerEmail,
        primaryColor: site.primaryColor || templates[(site.template || 'local') as TemplateKey]?.defaultPrimary || '#20172f',
        accentColor: site.accentColor || templates[(site.template || 'local') as TemplateKey]?.defaultAccent || '#c46a2d',
        pages: selectedPages,
        extra_page_count: Math.max(neededExtraPages, alreadyPaidExtraPages),
        monthly_price: price,
        price_label: priceLabel,
        status: 'published'
      };
      const response = await fetch(`/api/customer/sites/${params.slug}?t=${Date.now()}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-customer-email': customerEmail },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'Could not save site.');
      const savedSite = data.site || payload;
      setSite({
        ...savedSite,
        businessName: savedSite.businessName || savedSite.business_name || payload.businessName,
        business_name: savedSite.business_name || savedSite.businessName || payload.businessName,
        pages: normalizePages(savedSite.pages)
      });
      localStorage.setItem('cookie-customer-email', customerEmail);
      localStorage.setItem('cookie-customer-slug', params.slug);
      setMessage('Saved and republished. Refresh or reopen the live website to see the newest wording, template, and pages.');
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
      <p>Edit the wording, template, colors, and pages. The preview stays beside the editor so customers can see changes while they work.</p>
      <div className="admin-pin-row">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email used for this website" type="email" />
        <button className="btn secondary" onClick={() => loadSite()} disabled={!email}>Load Site</button>
      </div>
      {message && <div className="notice" style={{marginTop: 14}}>{message}</div>}
    </section>

    {site && <div className="customer-edit-layout">
      <div className="customer-edit-controls">
        <section className="card">
          <h2>Content</h2>
          <p className="small">Type as much wording as needed. The preview updates right away, then Save & Republish makes it live.</p>
          <div className="field"><label>Business Name</label><input value={site.businessName || ''} onChange={e => update('businessName', e.target.value)} /></div>
          <div className="field"><label>Headline</label><textarea className="large-textarea" value={site.headline ?? ''} onChange={e => update('headline', e.target.value)} placeholder="Write the main headline here" /></div>
          <div className="field"><label>Description / Main Website Message</label><textarea className="large-textarea tall-textarea" value={site.description ?? ''} onChange={e => update('description', e.target.value)} placeholder="Write a full business description here. Longer text is okay." /></div>
          <div className="field"><label>Phone</label><input value={site.phone || ''} onChange={e => update('phone', e.target.value)} placeholder="Optional. This will show in the contact section, not the top hero." /></div>
          <div className="field"><label>Email</label><input value={site.email || ''} onChange={e => update('email', e.target.value)} placeholder="This opens when visitors click Contact Now." /></div>
        </section>

        <section className="card">
          <h2>Design</h2>
          <p className="small">Templates now change layout, artwork, colors, and the visual style so customers can tell the difference.</p>
          <div className="field"><label>Template</label><select value={site.template || 'local'} onChange={e => applyTemplate(e.target.value as TemplateKey)}>{(Object.entries(templates) as Array<[TemplateKey, any]>).map(([key, item]) => <option value={key} key={key}>{item.name} — {item.tone}</option>)}</select></div>
          <div className="template-mini-grid">
            {(Object.entries(templates) as Array<[TemplateKey, any]>).map(([key, item]) => <button type="button" key={key} onClick={() => applyTemplate(key)} className={`template-mini ${site.template === key ? 'active' : ''}`}>
              <span style={{background: `linear-gradient(135deg, ${item.defaultPrimary}, ${item.defaultAccent})`}}>{item.art.icon}</span>
              <strong>{item.name}</strong>
            </button>)}
          </div>
          <div className="field"><label>Main Color</label><input type="color" value={site.primaryColor || '#20172f'} onChange={e => update('primaryColor', e.target.value)} /></div>
          <div className="field"><label>Accent Color</label><input type="color" value={site.accentColor || '#c46a2d'} onChange={e => update('accentColor', e.target.value)} /></div>
          <div className="notice"><strong>Current plan:</strong> {planInfo.name}<br />{priceLabel}<br /><span className="small">{friendlyPageLimit(planKey)}</span></div>
        </section>

        <section className="card">
          <h2>Pages / Sections</h2>
          <p>{friendlyPageLimit(planKey)} If a selected page goes above the included limit, the builder opens the $10/month extra page checkout automatically.</p>
          <div className="pages-grid admin-pages">
            {pageOptions.map(page => {
              const selected = selectedPages.includes(page);
              const nextPages = selected ? selectedPages.filter(item => item !== page) : normalizePages([...selectedPages, page]);
              const extraNeeded = Math.max(0, getExtraPageCount(planKey, nextPages.length) - alreadyPaidExtraPages);
              return <button key={page} onClick={() => togglePage(page)} className={`option ${selected ? 'active' : ''}`} disabled={page === 'Home'}>
                <strong>{page}</strong><br />
                <span className="small">{page === 'Home' ? 'Required' : selected ? 'Selected — click to remove' : extraNeeded > 0 ? '+$10/mo extra page checkout' : 'Add page'}</span>
              </button>;
            })}
          </div>
          {additionalExtraPagesNeeded > 0 && <div className="notice danger" style={{marginTop: 18}}>
            <strong>Extra page checkout required:</strong> You selected {additionalExtraPagesNeeded} new extra page{additionalExtraPagesNeeded > 1 ? 's' : ''}. Extra pages are $10/month per page.
          </div>}
          <div className="controls">
            <button className="btn gold" onClick={() => saveSite()} disabled={saving}>{saving ? 'Saving...' : additionalExtraPagesNeeded > 0 ? 'Checkout Extra Pages & Republish' : 'Save & Republish'}</button>
            {extraPageCheckoutUrl && <button className="btn secondary" onClick={() => startExtraPageCheckout(selectedPages)}>Add Extra Page — $10/mo</button>}
            <button className="btn secondary" onClick={resetPages}>Reset Pages</button>
            <a className="btn secondary" href={direct} target="_blank" rel="noreferrer">Open Direct Link</a>
            <a className="btn secondary" href={subdomain} target="_blank" rel="noreferrer">Open Subdomain</a>
            <Link className="btn secondary" href="/customer">Back to Dashboard</Link>
          </div>
        </section>
      </div>

      <aside className="customer-edit-preview card">
        <div className="preview-headline-row">
          <div>
            <h2>Live Preview</h2>
            <p className="small">Keep this open while editing. After saving, refresh the published site tab.</p>
          </div>
          <button className="btn gold" onClick={() => saveSite()} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
        <CustomerSiteView site={{...site, pages: selectedPages}} previewLabel="Live Editing Preview" />
      </aside>
    </div>}
  </main>;
}
