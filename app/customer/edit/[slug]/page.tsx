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
    if (parsed.hostname.includes('gumroad.com') && !parsed.searchParams.has('wanted')) {
      parsed.searchParams.set('wanted', 'true');
    }
    return parsed.toString();
  } catch {
    return '';
  }
}

function normalizePlan(value: any): PlanKey {
  return value === 'free' || value === 'business' || value === 'premium' || value === 'starter' ? value : 'starter';
}

function isTemplateDefaultText(value: string, field: 'headline' | 'description') {
  const cleaned = String(value || '').trim();
  if (!cleaned) return true;
  return Object.values(templates).some(template => template[field] === cleaned);
}

function friendlyPageLimit(plan: PlanKey) {
  const info = plans[plan];
  if (plan === 'free') return 'Free plan includes Home only. Upgrade to Starter, Business, or Premium to add more pages.';
  return info.allPages ? 'Premium includes all available pages.' : `${info.name} includes ${info.maxPages} page${info.maxPages > 1 ? 's' : ''}. Extra pages are $10/month per page.`;
}

function cleanPageContent(content: any, pages: string[]) {
  return normalizePageContent(content, pages);
}

function cloneServiceCards(cards: ServiceCard[]) {
  return cards.map(card => ({ title: card.title || '', text: card.text || '' }));
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
      const templateKey = templates[loaded.template as TemplateKey] ? loaded.template : 'local';
      const pages = normalizePages(loaded.pages);
      const serviceCards = normalizeServiceCards(loaded.serviceCards || loaded.service_cards, templateKey);
      const pageContent = cleanPageContent(loaded.pageContent || loaded.page_content, pages);
      setSite({
        ...loaded,
        businessName: loaded.businessName || loaded.business_name || '',
        business_name: loaded.business_name || loaded.businessName || '',
        plan: normalizePlan(loaded.plan),
        template: templateKey,
        primaryColor: loaded.primaryColor || templates[templateKey as TemplateKey].defaultPrimary,
        accentColor: loaded.accentColor || templates[templateKey as TemplateKey].defaultAccent,
        pages,
        offerTitle: loaded.offerTitle || loaded.offer_title || defaultOfferTitle,
        serviceCards: cloneServiceCards(serviceCards),
        pageContent
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

  function updateServiceCard(index: number, field: keyof ServiceCard, value: string) {
    setSite((current: any) => {
      if (!current) return current;
      const templateKey = templates[current.template as TemplateKey] ? current.template as TemplateKey : 'local';
      const cards = cloneServiceCards(normalizeServiceCards(current.serviceCards || current.service_cards, templateKey));
      while (cards.length < 3) cards.push({ title: `Offer ${cards.length + 1}`, text: '' });
      cards[index] = { ...cards[index], [field]: value };
      return { ...current, serviceCards: cards };
    });
  }

  function updatePageContent(page: string, field: 'title' | 'body', value: string) {
    setSite((current: any) => {
      if (!current) return current;
      const pages = normalizePages(current.pages);
      const content = cleanPageContent(current.pageContent || current.page_content, pages);
      const fallback = pageCopy[page] || { title: page, body: '' };
      content[page] = {
        title: field === 'title' ? value : (content[page]?.title || fallback.title || page),
        body: field === 'body' ? value : (content[page]?.body || fallback.body || '')
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
      const pages = normalizePages(current.pages);
      return {
        ...current,
        template: nextTemplate,
        primaryColor: template.defaultPrimary,
        accentColor: template.defaultAccent,
        headline: isTemplateDefaultText(currentHeadline, 'headline') ? template.headline : currentHeadline,
        description: isTemplateDefaultText(currentDescription, 'description') ? template.description : currentDescription,
        serviceCards: cloneServiceCards(normalizeServiceCards(current.serviceCards || current.service_cards, nextTemplate)),
        pageContent: cleanPageContent(current.pageContent || current.page_content, pages)
      };
    });
    setMessage(`Template changed to ${template.name}. The preview changed immediately. Click Save & Republish to update the live website.`);
  }

  const planKey = useMemo<PlanKey>(() => normalizePlan(site?.plan), [site]);
  const planInfo = plans[planKey];
  const selectedPages = normalizePages(site?.pages || ['Home']);
  const visiblePageContent: PageContentMap = useMemo(() => cleanPageContent(site?.pageContent || site?.page_content, selectedPages), [site?.pageContent, site?.page_content, selectedPages.join('|')]);
  const visibleServiceCards = useMemo(() => cloneServiceCards(normalizeServiceCards(site?.serviceCards || site?.service_cards, site?.template || 'local')), [site?.serviceCards, site?.service_cards, site?.template]);
  const neededExtraPages = planKey === 'free' ? 0 : getExtraPageCount(planKey, selectedPages.length);
  const alreadyPaidExtraPages = Number(site?.extra_page_count || 0);
  const additionalExtraPagesNeeded = Math.max(0, neededExtraPages - alreadyPaidExtraPages);
  const price = getPlanPrice(planKey, selectedPages.length);
  const priceLabel = getBillingLabel(planKey, selectedPages.length);
  const direct = `https://www.${rootDomain}/site/${params.slug}?v=${Date.now()}`;
  const subdomain = `https://${params.slug}.${rootDomain}?v=${Date.now()}`;

  function buildPendingSite(pageOverride?: string[]) {
    const pagesToSave = normalizePages(pageOverride || selectedPages);
    const pendingNeededExtraPages = planKey === 'free' ? 0 : getExtraPageCount(planKey, pagesToSave.length);
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
      offerTitle: site?.offerTitle || defaultOfferTitle,
      serviceCards: visibleServiceCards,
      pageContent: cleanPageContent(site?.pageContent || site?.page_content, pagesToSave),
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
      setMessage('Extra page checkout link is missing. Add NEXT_PUBLIC_EXTRA_PAGE_SUBSCRIPTION_CHECKOUT_URL in Vercel, then redeploy. Any issues, click the Contact Us button for help.');
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

    if (!selected && planKey === 'free') {
      setMessage('Free plan includes Home only. Choose a paid upgrade first to add more pages.');
      return;
    }

    if (!selected && extraNeeded > 0) {
      setMessage(`This adds ${extraNeeded} extra page${extraNeeded > 1 ? 's' : ''}. Extra pages are $10/month per page. Opening checkout now so this page can be unlocked.`);
      startExtraPageCheckout(nextPages);
      return;
    }

    setSite((current: any) => ({
      ...current,
      pages: nextPages,
      pageContent: cleanPageContent(current.pageContent || current.page_content, nextPages)
    }));
    setMessage(selected ? `${page} removed from this website. Click Save & Republish to update the live website.` : `${page} added. Add your own wording below, then click Save & Republish.`);
  }

  function resetPages() {
    setSite((current: any) => ({ ...current, pages: ['Home'], pageContent: {} }));
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
      const pagesToSave = planKey === 'free' ? ['Home'] : selectedPages;
      const contentToSave = cleanPageContent(site.pageContent || site.page_content, pagesToSave);
      const cardsToSave = cloneServiceCards(normalizeServiceCards(site.serviceCards || site.service_cards, site.template || 'local'));
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
        pages: pagesToSave,
        offerTitle: site.offerTitle || defaultOfferTitle,
        offer_title: site.offerTitle || defaultOfferTitle,
        serviceCards: cardsToSave,
        service_cards: cardsToSave,
        pageContent: contentToSave,
        page_content: contentToSave,
        extra_page_count: planKey === 'free' ? 0 : Math.max(neededExtraPages, alreadyPaidExtraPages),
        monthly_price: planKey === 'free' ? 0 : price,
        price_label: planKey === 'free' ? 'Free' : priceLabel,
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
      const savedPages = normalizePages(savedSite.pages);
      const savedTemplate = templates[savedSite.template as TemplateKey] ? savedSite.template as TemplateKey : 'local';
      setSite({
        ...savedSite,
        businessName: savedSite.businessName || savedSite.business_name || payload.businessName,
        business_name: savedSite.business_name || savedSite.businessName || payload.businessName,
        template: savedTemplate,
        pages: savedPages,
        offerTitle: savedSite.offerTitle || savedSite.offer_title || payload.offerTitle,
        serviceCards: cloneServiceCards(normalizeServiceCards(savedSite.serviceCards || savedSite.service_cards || payload.serviceCards, savedTemplate)),
        pageContent: cleanPageContent(savedSite.pageContent || savedSite.page_content || payload.pageContent, savedPages)
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
        <Link href="/video-studio">AI Video Studio</Link>
        <Link href="/">Home</Link>
      </div>
    </nav>

    <section className="card">
      <span className="badge">Customer editor</span>
      <h1>Edit {site?.businessName || params.slug}</h1>
      <p>Edit the wording, template, colors, offer boxes, and page content. The preview stays beside the editor so customers can see changes while they work.</p>
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
          <p className="small">These fields control the Home section of the live website. Longer wording is okay.</p>
          <div className="field"><label>Business Name</label><input value={site.businessName || ''} onChange={e => update('businessName', e.target.value)} /></div>
          <div className="field"><label>Headline</label><textarea className="large-textarea" value={site.headline ?? ''} onChange={e => update('headline', e.target.value)} placeholder="Write the main headline here" /></div>
          <div className="field"><label>Description / Main Website Message</label><textarea className="large-textarea tall-textarea" value={site.description ?? ''} onChange={e => update('description', e.target.value)} placeholder="Write a full business description here. Longer text is okay." /></div>
          <div className="field"><label>Phone</label><input value={site.phone || ''} onChange={e => update('phone', e.target.value)} placeholder="Optional. This will show only in the contact section." /></div>
          <div className="field"><label>Email</label><input value={site.email || ''} onChange={e => update('email', e.target.value)} placeholder="This opens when visitors click Contact Now." /></div>
        </section>

        <section className="card">
          <h2>Offer Boxes</h2>
          <p className="small">Customers can replace the template wording with their own services, products, packages, or offers.</p>
          <div className="field"><label>Section Title</label><input value={site.offerTitle || defaultOfferTitle} onChange={e => update('offerTitle', e.target.value)} placeholder="Example: Services, Packages, What I Offer" /></div>
          {visibleServiceCards.slice(0, 3).map((card, index) => <div className="nested-edit-card" key={index}>
            <h3>Offer Box {index + 1}</h3>
            <div className="field"><label>Title</label><input value={card.title || ''} onChange={e => updateServiceCard(index, 'title', e.target.value)} placeholder="Example: Landing Pages" /></div>
            <div className="field"><label>Description</label><textarea className="large-textarea" value={card.text || ''} onChange={e => updateServiceCard(index, 'text', e.target.value)} placeholder="Describe this service, product, or offer." /></div>
          </div>)}
        </section>

        <section className="card">
          <h2>Design</h2>
          <p className="small">Templates change layout, 3D-style artwork, colors, and the visual style so customers can tell the difference.</p>
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
                <span className="small">{page === 'Home' ? 'Required' : selected ? 'Selected — click to remove' : planKey === 'free' && page !== 'Home' && !selected ? 'Upgrade to unlock' : extraNeeded > 0 ? '+$10/mo extra page checkout' : 'Add page'}</span>
              </button>;
            })}
          </div>
          {planKey === 'free' && <div className="notice" style={{marginTop: 18}}><strong>Free page active:</strong> Upgrade to unlock extra pages, remove the Cookie branding badge, and access paid templates.<div className="controls" style={{marginTop: 12}}>{starterCheckoutUrl && <a className="btn gold" href={starterCheckoutUrl}>Upgrade to Starter — $19/mo</a>}{businessCheckoutUrl && <a className="btn secondary" href={businessCheckoutUrl}>Upgrade to Business — $30/mo</a>}{premiumCheckoutUrl && <a className="btn secondary" href={premiumCheckoutUrl}>Upgrade to Premium — $50/mo</a>}</div></div>}
          {additionalExtraPagesNeeded > 0 && planKey !== 'free' && <div className="notice danger" style={{marginTop: 18}}>
            <strong>Extra page checkout required:</strong> You selected {additionalExtraPagesNeeded} new extra page{additionalExtraPagesNeeded > 1 ? 's' : ''}. Extra pages are $10/month per page.
          </div>}
        </section>

        <section className="card">
          <h2>Page Wording</h2>
          <p className="small">Add the customer’s own information for About, Services, Products, Gallery, Testimonials, Contact, and FAQ. Only selected pages show here.</p>
          {selectedPages.filter(page => page !== 'Home').length === 0 && <div className="notice">Only Home is selected right now. Add another page above to edit more page wording.</div>}
          {selectedPages.filter(page => page !== 'Home').map(page => {
            const copy = visiblePageContent[page] || pageCopy[page] || { title: page, body: '' };
            return <div className="nested-edit-card" key={page}>
              <h3>{page} Page / Section</h3>
              <div className="field"><label>{page} Title</label><input value={copy.title || ''} onChange={e => updatePageContent(page, 'title', e.target.value)} placeholder={`${page} section title`} /></div>
              <div className="field"><label>{page} Wording</label><textarea className="large-textarea tall-textarea" value={copy.body || ''} onChange={e => updatePageContent(page, 'body', e.target.value)} placeholder={`Add the customer's ${page.toLowerCase()} information here.`} /></div>
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
