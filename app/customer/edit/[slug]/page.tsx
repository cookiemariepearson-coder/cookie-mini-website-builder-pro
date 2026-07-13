'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  defaultOfferTitle,
  getBillingLabel,
  getExtraPageCount,
  getPlanPrice,
  normalizePageContent,
  normalizePages,
  normalizeServiceCards,
  pageCopy,
  pageOptions,
  plans,
  templates,
  type PageContentMap,
  type PlanKey,
  type ServiceCard,
  type TemplateKey
} from '@/lib/templates';
import { CustomerSiteView } from '@/lib/site-view';

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

function normalizePlan(value: any): PlanKey {
  return value === 'free' || value === 'starter' || value === 'business' || value === 'premium' ? value : 'starter';
}

function isTemplateDefaultText(value: string, field: 'headline' | 'description') {
  const cleaned = String(value || '').trim();
  if (!cleaned) return true;
  return Object.values(templates).some(template => template[field] === cleaned);
}

function friendlyPageLimit(plan: PlanKey) {
  const info = plans[plan];
  if (plan === 'free') return 'Free includes Home only. Upgrade to Starter, Business, or Premium to add more pages.';
  return info.allPages ? 'Premium includes all available pages.' : `${info.name} includes ${info.maxPages} page${info.maxPages > 1 ? 's' : ''}. Extra pages are $10/month per page.`;
}

function cloneServiceCards(cards: ServiceCard[]) {
  const normalized = cards.map(card => ({ title: card.title || '', text: card.text || '' }));
  while (normalized.length < 3) normalized.push({ title: `Offer ${normalized.length + 1}`, text: '' });
  return normalized.slice(0, 3);
}

function getRawContent(value: any) {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    } catch {}
  }
  return {};
}

function buildAllPageContent(value: any): PageContentMap & { _art?: { title?: string; details?: string } } {
  const raw = getRawContent(value);
  const result: any = normalizePageContent(raw, pageOptions);
  const rawArt = raw._art || {};
  if (rawArt.title || rawArt.details) {
    result._art = {
      title: String(rawArt.title || ''),
      details: String(rawArt.details || '')
    };
  }
  return result;
}

function getArtContent(site: any) {
  const raw = getRawContent(site?.pageContent || site?.page_content);
  const templateKey = templates[site?.template as TemplateKey] ? site.template as TemplateKey : 'local';
  return {
    title: String(raw?._art?.title || templates[templateKey].art.label || ''),
    details: String(raw?._art?.details || templates[templateKey].art.details || '')
  };
}

function getPageField(content: any, page: string, field: 'title' | 'body') {
  const normalized = buildAllPageContent(content);
  const fallback = pageCopy[page] || { title: page, body: '' };
  return normalized[page]?.[field] || fallback[field] || '';
}

export default function CustomerEditSitePage({ params }: { params: { slug: string } }) {
  const [email, setEmail] = useState('');
  const [site, setSite] = useState<any>(null);
  const [message, setMessage] = useState('Loading website editor...');
  const [saving, setSaving] = useState(false);
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cookiesdigitalcreations.com';
  const extraPageCheckoutUrl = normalizeCheckoutUrl(process.env.NEXT_PUBLIC_EXTRA_PAGE_SUBSCRIPTION_CHECKOUT_URL);
  const starterCheckoutUrl = normalizeCheckoutUrl(process.env.NEXT_PUBLIC_STARTER_SUBSCRIPTION_CHECKOUT_URL);
  const businessCheckoutUrl = normalizeCheckoutUrl(process.env.NEXT_PUBLIC_BUSINESS_SUBSCRIPTION_CHECKOUT_URL);
  const premiumCheckoutUrl = normalizeCheckoutUrl(process.env.NEXT_PUBLIC_PREMIUM_SUBSCRIPTION_CHECKOUT_URL);
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || `support@${rootDomain}`;

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
      const templateKey = templates[loaded.template as TemplateKey] ? loaded.template as TemplateKey : 'local';
      const pages = normalizePages(loaded.pages);
      const serviceCards = cloneServiceCards(normalizeServiceCards(loaded.serviceCards || loaded.service_cards, templateKey));
      const pageContent = buildAllPageContent(loaded.pageContent || loaded.page_content);
      if (!pageContent._art) {
        pageContent._art = { title: templates[templateKey].art.label, details: templates[templateKey].art.details };
      }
      setSite({
        ...loaded,
        businessName: loaded.businessName || loaded.business_name || '',
        business_name: loaded.business_name || loaded.businessName || '',
        plan: normalizePlan(loaded.plan),
        template: templateKey,
        primaryColor: loaded.primaryColor || templates[templateKey].defaultPrimary,
        accentColor: loaded.accentColor || templates[templateKey].defaultAccent,
        pages,
        offerTitle: loaded.offerTitle || loaded.offer_title || defaultOfferTitle,
        serviceCards,
        pageContent
      });
      localStorage.setItem('cookie-customer-email', customerEmail);
      localStorage.setItem('cookie-customer-slug', params.slug);
      setMessage('Website loaded. Edit any section on the left, preview it on the right, then click Save & Republish.');
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

  function updateServiceCard(index: number, field: keyof ServiceCard, value: string) {
    setSite((current: any) => {
      if (!current) return current;
      const templateKey = templates[current.template as TemplateKey] ? current.template as TemplateKey : 'local';
      const cards = cloneServiceCards(normalizeServiceCards(current.serviceCards || current.service_cards, templateKey));
      cards[index] = { ...cards[index], [field]: value };
      return { ...current, serviceCards: cards };
    });
  }

  function updatePageContent(page: string, field: 'title' | 'body', value: string) {
    setSite((current: any) => {
      if (!current) return current;
      const content = buildAllPageContent(current.pageContent || current.page_content);
      const fallback = pageCopy[page] || { title: page, body: '' };
      content[page] = {
        title: field === 'title' ? value : (content[page]?.title || fallback.title || page),
        body: field === 'body' ? value : (content[page]?.body || fallback.body || '')
      };
      return { ...current, pageContent: content };
    });
  }

  function updateArtContent(field: 'title' | 'details', value: string) {
    setSite((current: any) => {
      if (!current) return current;
      const content = buildAllPageContent(current.pageContent || current.page_content);
      const currentArt = getArtContent(current);
      content._art = {
        title: field === 'title' ? value : currentArt.title,
        details: field === 'details' ? value : currentArt.details
      };
      return { ...current, pageContent: content };
    });
  }

  function applyTemplate(nextTemplate: TemplateKey) {
    const template = templates[nextTemplate];
    setSite((current: any) => {
      if (!current) return current;
      const currentHeadline = String(current?.headline ?? '');
      const currentDescription = String(current?.description ?? '');
      const currentContent = buildAllPageContent(current.pageContent || current.page_content);
      const currentArt = getArtContent(current);
      const artIsDefault = Object.values(templates).some(item => item.art.label === currentArt.title || item.art.details === currentArt.details);
      currentContent._art = artIsDefault || !currentArt.title ? { title: template.art.label, details: template.art.details } : currentArt;
      return {
        ...current,
        template: nextTemplate,
        primaryColor: template.defaultPrimary,
        accentColor: template.defaultAccent,
        headline: isTemplateDefaultText(currentHeadline, 'headline') ? template.headline : currentHeadline,
        description: isTemplateDefaultText(currentDescription, 'description') ? template.description : currentDescription,
        serviceCards: cloneServiceCards(normalizeServiceCards(current.serviceCards || current.service_cards, nextTemplate)),
        pageContent: currentContent
      };
    });
    setMessage(`Template changed to ${template.name}. The preview changed immediately. Click Save & Republish to update the live website.`);
  }

  const planKey = useMemo<PlanKey>(() => normalizePlan(site?.plan), [site]);
  const planInfo = plans[planKey];
  const selectedPages = normalizePages(site?.pages || ['Home']);
  const visiblePageContent: any = useMemo(() => buildAllPageContent(site?.pageContent || site?.page_content), [site?.pageContent, site?.page_content]);
  const visibleServiceCards = useMemo(() => cloneServiceCards(normalizeServiceCards(site?.serviceCards || site?.service_cards, site?.template || 'local')), [site?.serviceCards, site?.service_cards, site?.template]);
  const neededExtraPages = planKey === 'free' ? 0 : getExtraPageCount(planKey, selectedPages.length);
  const alreadyPaidExtraPages = Number(site?.extra_page_count || 0);
  const additionalExtraPagesNeeded = Math.max(0, neededExtraPages - alreadyPaidExtraPages);
  const price = getPlanPrice(planKey, selectedPages.length);
  const priceLabel = getBillingLabel(planKey, selectedPages.length);
  const direct = `https://www.${rootDomain}/site/${params.slug}?v=${Date.now()}`;
  const subdomain = `https://${params.slug}.${rootDomain}?v=${Date.now()}`;
  const artContent = getArtContent(site);

  function buildPayload(pageOverride?: string[]) {
    const pagesToSave = planKey === 'free' ? ['Home'] : normalizePages(pageOverride || selectedPages);
    const contentToSave = buildAllPageContent(site?.pageContent || site?.page_content);
    const cardsToSave = cloneServiceCards(normalizeServiceCards(site?.serviceCards || site?.service_cards, site?.template || 'local'));
    return {
      slug: params.slug,
      businessName: site?.businessName || site?.business_name || params.slug,
      business_name: site?.businessName || site?.business_name || params.slug,
      customerEmail: email.trim().toLowerCase(),
      template: site?.template || 'local',
      plan: planKey,
      headline: site?.headline ?? '',
      description: site?.description ?? '',
      phone: site?.phone || '',
      email: site?.email || email,
      primaryColor: site?.primaryColor || templates[(site?.template || 'local') as TemplateKey]?.defaultPrimary || '#20172f',
      accentColor: site?.accentColor || templates[(site?.template || 'local') as TemplateKey]?.defaultAccent || '#c46a2d',
      pages: pagesToSave,
      offerTitle: site?.offerTitle || defaultOfferTitle,
      offer_title: site?.offerTitle || defaultOfferTitle,
      serviceCards: cardsToSave,
      service_cards: cardsToSave,
      pageContent: contentToSave,
      page_content: contentToSave,
      extra_page_count: alreadyPaidExtraPages,
      monthly_price: price,
      price_label: priceLabel,
      status: 'published'
    };
  }

  function startExtraPageCheckout(pageOverride?: string[]) {
    if (!site) return;
    if (!extraPageCheckoutUrl) {
      setMessage('Extra page checkout link is missing. Add NEXT_PUBLIC_EXTRA_PAGE_SUBSCRIPTION_CHECKOUT_URL in Vercel, then redeploy.');
      return;
    }
    const pagesToSave = normalizePages(pageOverride || selectedPages);
    const pendingNeededExtraPages = getExtraPageCount(planKey, pagesToSave.length);
    const pendingPayload = {
      ...buildPayload(pagesToSave),
      extraPageCount: Math.max(alreadyPaidExtraPages, pendingNeededExtraPages),
      extra_page_count: Math.max(alreadyPaidExtraPages, pendingNeededExtraPages),
      price: getPlanPrice(planKey, pagesToSave.length),
      priceLabel: getBillingLabel(planKey, pagesToSave.length),
      paymentStartedAt: new Date().toISOString()
    };
    localStorage.setItem('cookie-builder-pending-site', JSON.stringify(pendingPayload));
    localStorage.setItem('cookie-builder-last-draft', JSON.stringify(pendingPayload));
    localStorage.setItem('cookie-customer-email', email.trim().toLowerCase());
    localStorage.setItem('cookie-customer-slug', params.slug);
    window.location.href = extraPageCheckoutUrl;
  }

  function startUpgradeCheckout(url: string) {
    if (!url) {
      setMessage('Upgrade checkout link is missing in Vercel.');
      return;
    }
    const payload = buildPayload(['Home']);
    localStorage.setItem('cookie-builder-pending-site', JSON.stringify(payload));
    localStorage.setItem('cookie-builder-last-draft', JSON.stringify(payload));
    window.location.href = url;
  }

  function togglePage(page: string) {
    if (!site || page === 'Home') return;
    if (planKey === 'free') {
      setMessage('Free sites include Home only. Choose an upgrade option to unlock more pages.');
      return;
    }
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
    setMessage('Pages reset to Home only. Click Save & Republish to update the live website. Your saved page wording stays in the editor.');
  }

  async function saveSite() {
    if (!site) return;
    const customerEmail = email.trim().toLowerCase();
    if (!customerEmail) {
      setMessage('Please enter the email used for this website before saving.');
      return;
    }
    if (planKey !== 'free' && additionalExtraPagesNeeded > 0) {
      setMessage(`You selected ${additionalExtraPagesNeeded} new extra page${additionalExtraPagesNeeded > 1 ? 's' : ''}. Opening the $10/month extra page checkout now.`);
      startExtraPageCheckout(selectedPages);
      return;
    }

    setSaving(true);
    setMessage('Saving and republishing your website updates...');
    try {
      const payload = buildPayload(selectedPages);
      const response = await fetch(`/api/customer/sites/${params.slug}?t=${Date.now()}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-customer-email': customerEmail },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'Could not save site.');
      const savedSite = data.site || payload;
      const savedTemplate = templates[savedSite.template as TemplateKey] ? savedSite.template as TemplateKey : 'local';
      setSite({
        ...savedSite,
        businessName: savedSite.businessName || savedSite.business_name || payload.businessName,
        business_name: savedSite.business_name || savedSite.businessName || payload.businessName,
        pages: normalizePages(savedSite.pages),
        plan: normalizePlan(savedSite.plan),
        template: savedTemplate,
        offerTitle: savedSite.offerTitle || savedSite.offer_title || payload.offerTitle,
        serviceCards: cloneServiceCards(normalizeServiceCards(savedSite.serviceCards || savedSite.service_cards || payload.serviceCards, savedTemplate)),
        pageContent: buildAllPageContent(savedSite.pageContent || savedSite.page_content || payload.pageContent)
      });
      localStorage.setItem('cookie-customer-email', customerEmail);
      localStorage.setItem('cookie-customer-slug', params.slug);
      setMessage('Saved and republished. Refresh or reopen the live website to see the newest wording, template, colors, and pages.');
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
      <p>Edit the Home wording, offer boxes, page sections, template artwork, colors, and selected pages. The preview stays beside the editor.</p>
      <div className="admin-pin-row">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email used for this website" type="email" />
        <button className="btn secondary" onClick={() => loadSite()} disabled={!email}>Load Site</button>
      </div>
      {message && <div className="notice" style={{marginTop: 14}}>{message}</div>}
    </section>

    {site && <div className="customer-edit-layout">
      <div className="customer-edit-controls">
        <section className="card">
          <h2>Home Section</h2>
          <p className="small">These fields control the top Home section of the live website. Longer wording is okay.</p>
          <div className="field"><label>Business Name</label><input value={site.businessName || ''} onChange={e => update('businessName', e.target.value)} /></div>
          <div className="field"><label>Headline</label><textarea className="large-textarea" value={site.headline ?? ''} onChange={e => update('headline', e.target.value)} placeholder="Write the main headline here" /></div>
          <div className="field"><label>Description / Main Website Message</label><textarea className="large-textarea tall-textarea" value={site.description ?? ''} onChange={e => update('description', e.target.value)} placeholder="Write a full business description here. Longer text is okay." /></div>
          <div className="field"><label>Phone</label><input value={site.phone || ''} onChange={e => update('phone', e.target.value)} placeholder="Optional. This shows only in the contact section." /></div>
          <div className="field"><label>Email</label><input value={site.email || ''} onChange={e => update('email', e.target.value)} placeholder="This opens when visitors click Contact Now." /></div>
        </section>

        <section className="card">
          <h2>3D Artwork Box</h2>
          <p className="small">This edits the 3D artwork card on the template. Replace the generic template wording with the customer’s own wording.</p>
          <div className="field"><label>Artwork Card Title</label><input value={artContent.title} onChange={e => updateArtContent('title', e.target.value)} placeholder="Example: Signature Services" /></div>
          <div className="field"><label>Artwork Card Details</label><textarea className="large-textarea" value={artContent.details} onChange={e => updateArtContent('details', e.target.value)} placeholder="Example: Booking • Packages • Contact" /></div>
        </section>

        <section className="card">
          <h2>Offer Boxes</h2>
          <p className="small">Change this from generic service wording to what the customer actually offers.</p>
          <div className="field"><label>Section Title</label><input value={site.offerTitle || defaultOfferTitle} onChange={e => update('offerTitle', e.target.value)} placeholder="Example: What I Offer, Packages, Services, Products" /></div>
          {visibleServiceCards.map((card, index) => <div className="nested-edit-card" key={index}>
            <h3>Offer Box {index + 1}</h3>
            <div className="field"><label>Title</label><input value={card.title || ''} onChange={e => updateServiceCard(index, 'title', e.target.value)} placeholder="Example: Landing Pages" /></div>
            <div className="field"><label>Description</label><textarea className="large-textarea" value={card.text || ''} onChange={e => updateServiceCard(index, 'text', e.target.value)} placeholder="Describe this service, product, package, or offer." /></div>
          </div>)}
        </section>

        <section className="card">
          <h2>Design</h2>
          <p className="small">Templates change layout, 3D-style artwork, colors, and the visual style. Colors preview immediately.</p>
          <div className="field"><label>Template</label><select value={site.template || 'local'} onChange={e => applyTemplate(e.target.value as TemplateKey)}>{(Object.entries(templates) as Array<[TemplateKey, any]>).map(([key, item]) => <option value={key} key={key}>{item.name}</option>)}</select></div>
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
          <p>{friendlyPageLimit(planKey)} {planKey === 'free' ? 'Use one of the upgrade buttons below to unlock more pages.' : 'If a selected page goes above the included limit, the builder opens the $10/month extra page checkout automatically.'}</p>
          <div className="pages-grid admin-pages">
            {pageOptions.map(page => {
              const selected = selectedPages.includes(page);
              const nextPages = selected ? selectedPages.filter(item => item !== page) : normalizePages([...selectedPages, page]);
              const extraNeeded = planKey === 'free' && !selected && page !== 'Home' ? 1 : Math.max(0, getExtraPageCount(planKey, nextPages.length) - alreadyPaidExtraPages);
              return <button key={page} onClick={() => togglePage(page)} className={`option ${selected ? 'active' : ''}`} disabled={page === 'Home'}>
                <strong>{page}</strong><br />
                <span className="small">{page === 'Home' ? 'Required' : selected ? 'Selected — click to remove' : planKey === 'free' ? 'Upgrade to unlock' : extraNeeded > 0 ? '+$10/mo extra page checkout' : 'Add page'}</span>
              </button>;
            })}
          </div>
          {planKey === 'free' && <div className="notice" style={{marginTop: 18}}><strong>Free page active:</strong> Upgrade to unlock extra pages and paid features.<div className="controls" style={{marginTop: 12}}>{starterCheckoutUrl && <button className="btn gold" onClick={() => startUpgradeCheckout(starterCheckoutUrl)}>Upgrade to Starter — $19/mo</button>}{businessCheckoutUrl && <button className="btn secondary" onClick={() => startUpgradeCheckout(businessCheckoutUrl)}>Upgrade to Business — $30/mo</button>}{premiumCheckoutUrl && <button className="btn secondary" onClick={() => startUpgradeCheckout(premiumCheckoutUrl)}>Upgrade to Premium — $50/mo</button>}</div></div>}
          {additionalExtraPagesNeeded > 0 && planKey !== 'free' && <div className="notice danger" style={{marginTop: 18}}>
            <strong>Extra page checkout required:</strong> You selected {additionalExtraPagesNeeded} new extra page{additionalExtraPagesNeeded > 1 ? 's' : ''}. Extra pages are $10/month per page.
          </div>}
        </section>

        <section className="card">
          <h2>All Page / Section Wording</h2>
          <p className="small">Customers can edit these now, even if the page is not selected yet. Only selected pages show on the live website.</p>
          {pageOptions.filter(page => page !== 'Home').map(page => {
            const selected = selectedPages.includes(page);
            return <div className="nested-edit-card" key={page}>
              <h3>{page} {selected ? <span className="small">— selected</span> : <span className="small">— saved for later</span>}</h3>
              <div className="field"><label>{page} Title</label><input value={getPageField(visiblePageContent, page, 'title')} onChange={e => updatePageContent(page, 'title', e.target.value)} placeholder={`${page} section title`} /></div>
              <div className="field"><label>{page} Wording</label><textarea className="large-textarea tall-textarea" value={getPageField(visiblePageContent, page, 'body')} onChange={e => updatePageContent(page, 'body', e.target.value)} placeholder={`Add the customer's ${page.toLowerCase()} information here.`} /></div>
            </div>;
          })}
        </section>

        <section className="card">
          <h2>Save / Publish</h2>
          <p className="small">Any issues, click the Contact Us button for help.</p>
          <div className="controls">
            <button className="btn gold" onClick={() => saveSite()} disabled={saving}>{saving ? 'Saving...' : additionalExtraPagesNeeded > 0 && planKey !== 'free' ? 'Checkout Extra Pages & Republish' : 'Save & Republish'}</button>
            {planKey !== 'free' && extraPageCheckoutUrl && <button className="btn secondary" onClick={() => startExtraPageCheckout(selectedPages)}>Add Extra Page — $10/mo</button>}
            <a className="btn secondary" href={`mailto:${supportEmail}?subject=Cookie%20Mini%20Website%20Builder%20Help`}>Contact Us</a>
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
        <CustomerSiteView site={{
          ...site,
          pages: planKey === 'free' ? ['Home'] : selectedPages,
          plan: planKey,
          serviceCards: visibleServiceCards,
          pageContent: visiblePageContent,
          offerTitle: site.offerTitle || defaultOfferTitle
        }} previewLabel="Website Preview" />
      </aside>
    </div>}
  </main>;
}
