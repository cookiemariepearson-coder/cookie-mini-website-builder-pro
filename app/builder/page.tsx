'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  plans,
  templates,
  templateCatalog,
  templateCategories,
  slugify,
  getPlanPrice,
  getBillingLabel,
  getExtraPageCount,
  EXTRA_PAGE_PRICE,
  normalizePages,
  pageOptions,
  pageSupportsMedia,
  defaultPagesForTemplate,
  safeTemplateKey,
  normalizePageContent,
  normalizeServiceCards,
  defaultOfferTitle,
  pageCopy,
  type PlanKey,
  type TemplateKey,
  type TemplateCategoryKey,
  type ServiceCard,
  type PageMediaItem,
  type PageContentMap
} from '@/lib/templates';
import { CustomerSiteView } from '@/lib/site-view';

function cloneServiceCards(cards: ServiceCard[]) {
  const normalized = cards.map(card => ({ title: card.title || '', text: card.text || '' }));
  while (normalized.length < 3) normalized.push({ title: `Offer ${normalized.length + 1}`, text: '' });
  return normalized.slice(0, 3);
}

function buildStarterPageContent(): PageContentMap {
  return normalizePageContent({}, pageOptions);
}

const MEDIA_UPLOAD_LIMIT_MB = 2;

function mediaTypeFromFile(file: File): PageMediaItem['type'] {
  return file.type.startsWith('video/') ? 'video' : 'image';
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read this file.'));
    reader.readAsDataURL(file);
  });
}

function cleanMediaItems(value: any): PageMediaItem[] {
  return Array.isArray(value) ? value.filter((item: any) => item?.url).slice(0, 12) : [];
}

export default function BuilderPage() {
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState<TemplateKey>('food_realistic');
  const [purpose, setPurpose] = useState<TemplateCategoryKey>('food');
  const [plan, setPlan] = useState<PlanKey>('free');
  const [businessName, setBusinessName] = useState('');
  const [headline, setHeadline] = useState(templates.food_realistic.headline);
  const [description, setDescription] = useState(templates.food_realistic.description);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [primaryColor, setPrimaryColor] = useState(templates.food_realistic.defaultPrimary);
  const [accentColor, setAccentColor] = useState(templates.food_realistic.defaultAccent);
  const [selectedPages, setSelectedPages] = useState(['Home']);
  const [offerTitle, setOfferTitle] = useState(defaultOfferTitle);
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>(cloneServiceCards(templates.food_realistic.services));
  const [pageContent, setPageContent] = useState<PageContentMap>(buildStarterPageContent());
  const [artTitle, setArtTitle] = useState(templates.food_realistic.art.label);
  const [artDetails, setArtDetails] = useState(templates.food_realistic.art.details);
  const [formError, setFormError] = useState('');
  const [publishingFree, setPublishingFree] = useState(false);
  const [publishedLink, setPublishedLink] = useState('');
  const [pathLink, setPathLink] = useState('');

  const maxPages = plans[plan].maxPages;
  const premiumUnlocksAll = plans[plan].allPages;
  const extraPageCount = getExtraPageCount(plan, selectedPages.length);
  const currentPrice = getPlanPrice(plan, selectedPages.length);
  const currentBillingLabel = getBillingLabel(plan, selectedPages.length);
  const templateData = templates[safeTemplateKey(template)];
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cookiesdigitalcreations.com';
  const cleanBusinessName = businessName.trim() || 'My Business Name';
  const slug = useMemo(() => slugify(cleanBusinessName), [cleanBusinessName]);

  const visibleTemplates = templateCatalog.filter(item => item.category === purpose);
  const selectedCategory = templateCategories.find(item => item.key === purpose) || templateCategories[0];
  const previewPageContent = useMemo(() => ({
    ...pageContent,
    _art: { title: artTitle, details: artDetails }
  }), [pageContent, artTitle, artDetails]);

  function applyTemplate(nextTemplate: TemplateKey) {
    const safeKey = safeTemplateKey(nextTemplate);
    const item = templates[safeKey];
    setTemplate(safeKey);
    setPurpose(item.category);
    setHeadline(item.headline);
    setDescription(item.description);
    setPrimaryColor(item.defaultPrimary);
    setAccentColor(item.defaultAccent);
    setSelectedPages(defaultPagesForTemplate(safeKey, plan));
    setOfferTitle(defaultOfferTitle);
    setServiceCards(cloneServiceCards(normalizeServiceCards(null, safeKey)));
    setPageContent(buildStarterPageContent());
    setArtTitle(item.art.label);
    setArtDetails(item.art.details);
    setPublishedLink('');
    setPathLink('');
    setFormError('');
  }

  function changePurpose(nextPurpose: TemplateCategoryKey) {
    setPurpose(nextPurpose);
    const first = templateCatalog.find(item => item.category === nextPurpose);
    if (first) applyTemplate(first.key);
  }

  function changePlan(nextPlan: PlanKey) {
    setPlan(nextPlan);
    setPublishedLink('');
    setPathLink('');
    setSelectedPages(defaultPagesForTemplate(template, nextPlan));
  }

  function updateServiceCard(index: number, field: keyof ServiceCard, value: string) {
    setServiceCards(current => {
      const next = cloneServiceCards(current);
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function updatePageContent(page: string, field: 'title' | 'body', value: string) {
    setPageContent(current => {
      const fallback = pageCopy[page] || { title: page, body: '' };
      const existing = current[page] || fallback;
      return {
        ...current,
        [page]: {
          ...existing,
          title: field === 'title' ? value : (existing.title || fallback.title || page),
          body: field === 'body' ? value : (existing.body || fallback.body || '')
        }
      };
    });
  }


  function updatePageMedia(page: string, media: PageMediaItem[]) {
    setPageContent(current => {
      const fallback = pageCopy[page] || { title: page, body: '' };
      const existing = current[page] || fallback;
      return {
        ...current,
        [page]: {
          ...existing,
          title: existing.title || fallback.title || page,
          body: existing.body || fallback.body || '',
          media: cleanMediaItems(media)
        }
      };
    });
  }

  async function addMediaFiles(page: string, files: FileList | null) {
    const selected = Array.from(files || []);
    if (!selected.length) return;
    const tooLarge = selected.find(file => file.size > MEDIA_UPLOAD_LIMIT_MB * 1024 * 1024);
    if (tooLarge) {
      setFormError(`${tooLarge.name} is too large. Use files under ${MEDIA_UPLOAD_LIMIT_MB}MB for now, or add a video/photo link instead.`);
      return;
    }
    try {
      const nextItems: PageMediaItem[] = [];
      for (const file of selected.slice(0, 6)) {
        nextItems.push({ type: mediaTypeFromFile(file), url: await readFileAsDataUrl(file), name: file.name });
      }
      const currentMedia = cleanMediaItems(pageContent[page]?.media);
      updatePageMedia(page, [...currentMedia, ...nextItems].slice(0, 12));
      setFormError(`${nextItems.length} media item${nextItems.length > 1 ? 's' : ''} added to ${page}.`);
    } catch {
      setFormError('Something went wrong while adding media. Try a smaller image/video or use a media link.');
    }
  }

  function addMediaLink(page: string) {
    const url = window.prompt('Paste a YouTube, TikTok, Instagram, Vimeo, image, or video link:')?.trim();
    if (!url) return;
    const currentMedia = cleanMediaItems(pageContent[page]?.media);
    updatePageMedia(page, [...currentMedia, { type: 'link', url, name: 'Media link' }].slice(0, 12));
    setFormError(`Media link added to ${page}.`);
  }

  function removePageMedia(page: string, index: number) {
    const currentMedia = cleanMediaItems(pageContent[page]?.media);
    updatePageMedia(page, currentMedia.filter((_, i) => i !== index));
  }

  function togglePage(page: string) {
    if (page === 'Home') return;
    setFormError('');
    setSelectedPages(currentPages => {
      const normalized = normalizePages(currentPages);
      const isSelected = normalized.includes(page);
      if (isSelected) return normalizePages(normalized.filter(p => p !== page));
      if (plan === 'free') {
        setFormError('Free includes Home only. Choose Starter, Business, or Premium to unlock more pages.');
        return normalized;
      }
      return normalizePages([...normalized, page]);
    });
  }

  function buildPayload() {
    const contentToSave = { ...pageContent, _art: { title: artTitle, details: artDetails } };
    const cardsToSave = cloneServiceCards(serviceCards);
    return {
      slug,
      businessName: cleanBusinessName,
      business_name: cleanBusinessName,
      template,
      plan,
      headline,
      description,
      phone,
      email,
      primaryColor,
      accentColor,
      pages: plan === 'free' ? ['Home'] : normalizePages(selectedPages),
      billing: plan === 'free' ? 'free' : 'subscription',
      extraPageCount,
      extra_page_count: extraPageCount,
      price: currentPrice,
      monthly_price: currentPrice,
      priceLabel: currentBillingLabel,
      price_label: currentBillingLabel,
      offerTitle,
      offer_title: offerTitle,
      serviceCards: cardsToSave,
      service_cards: cardsToSave,
      pageContent: contentToSave,
      page_content: contentToSave,
      createdAt: new Date().toISOString()
    };
  }

  function validateBeforePublish() {
    if (!businessName.trim()) {
      setFormError('Please add the business name before publishing or checkout.');
      setStep(1);
      return false;
    }
    if (!email.trim()) {
      setFormError('Please add the customer email. This email is used for Contact Now and customer dashboard access.');
      setStep(1);
      return false;
    }
    return true;
  }

  async function publishFreePage() {
    if (!validateBeforePublish()) return;
    const payload = buildPayload();
    const freePayload = { ...payload, pages: ['Home'], plan: 'free' as PlanKey, billing: 'free', price: 0, monthly_price: 0, priceLabel: 'Free', price_label: 'Free' };
    localStorage.setItem('cookie-builder-pending-site', JSON.stringify(freePayload));
    localStorage.setItem('cookie-builder-last-draft', JSON.stringify(freePayload));
    setPublishingFree(true);
    setPublishedLink('');
    setPathLink('');
    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...freePayload, free: true, publishedAt: new Date().toISOString() })
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'Could not publish the free page.');
      setPublishedLink(data.link);
      setPathLink(data.pathLink);
      localStorage.setItem('cookie-builder-published-site', JSON.stringify({...freePayload, publishedLink: data.link, pathLink: data.pathLink}));
      setFormError('Free page published. Upgrade anytime to unlock more pages and remove Cookie branding.');
    } catch (error: any) {
      setFormError(error.message || 'Could not publish the free page. Check Supabase and try again.');
    } finally {
      setPublishingFree(false);
    }
  }

  function continueToCheckout() {
    if (!validateBeforePublish()) return;
    if (plan === 'free') {
      publishFreePage();
      return;
    }

    const payload = buildPayload();
    localStorage.setItem('cookie-builder-pending-site', JSON.stringify(payload));
    localStorage.setItem('cookie-builder-last-draft', JSON.stringify(payload));
    window.location.href = `/checkout?plan=${plan}&slug=${slug}`;
  }

  const steps = ['Choose Type & Look', 'Website Info', 'Design', 'Pages & Wording', plan === 'free' ? 'Preview & Publish Free' : 'Preview & Checkout'];

  return (
    <main className="builder-shell">
      <aside className="sidebar purpose-sidebar">
        <div className="brand"><span className="logo">C</span> Cookie Mini Website Builder Pro</div>
        <div className="video-studio-callout">
          <strong>🎬 AI Video Generator</strong>
          <p>Create promo scripts, captions, and AI video prompts for the website they are building.</p>
          <Link className="btn gold" href="/video-studio">Open AI Video Studio</Link>
        </div>
        <div className="stepper">
          {steps.map((s, i) => <button key={s} onClick={() => setStep(i)} className={`step ${step === i ? 'active' : ''}`}>{i + 1}. {s}</button>)}
        </div>
        {formError && <div className={formError.includes('published') ? 'notice' : 'notice danger'}>{formError}</div>}
        {publishedLink && <div className="notice success-notice">
          <strong>Free page is live:</strong><br />{publishedLink}
          <div className="controls" style={{marginTop: 12}}>
            <a className="btn gold" href={`https://${publishedLink}`} target="_blank" rel="noreferrer">Open Free Website</a>
          </div>
        </div>}
        {step === 0 && (
          <div className="setup-step-card">
            <h3>1. What type of website are they building?</h3>
            <p className="small">The customer starts by choosing the purpose of the website. This loads the right pages, wording prompts, artwork, and service boxes.</p>
            <div className="purpose-grid purpose-grid-wide">
              {templateCategories.map(item => (
                <button className={`option purpose-option ${purpose === item.key ? 'active' : ''}`} key={item.key} onClick={() => changePurpose(item.key)}>
                  <strong>{item.name}</strong><br/><span className="small">{item.description}</span>
                </button>
              ))}
            </div>
            <h3 style={{marginTop: 18}}>2. Choose their website look/design</h3>
            <p className="small">These are the visual styles for <strong>{selectedCategory.name}</strong>. Click one and the preview changes right away.</p>
            <div className="visual-style-gallery">
              {visibleTemplates.map(item => (
                <button className={`visual-style-card ${template === item.key ? 'active' : ''}`} key={item.key} onClick={() => applyTemplate(item.key)}>
                  <span className="visual-style-image"><img src={item.art.image} alt="" /></span>
                  <span className="visual-style-meta">
                    <strong>{item.styleName}</strong>
                    <small>{item.name}</small>
                    <em style={{background: `linear-gradient(135deg, ${item.defaultPrimary}, ${item.defaultAccent})`}} />
                  </span>
                </button>
              ))}
            </div>
            <div className="field"><label>Plan</label><select value={plan} onChange={e => changePlan(e.target.value as PlanKey)}>
              {Object.entries(plans).map(([key, p]) => <option value={key} key={key}>{p.name} - {p.priceLabel} / {p.limitLabel}</option>)}
            </select></div>
            <div className="notice"><strong>Next:</strong> click <em>Website Info Next</em> and enter the customer’s business name, email, headline, description, offers, and page wording.</div>
          </div>
        )}
        {step === 1 && (
          <div className="setup-step-card">
            <h3>Website Info</h3>
            <p className="small">This is where customers enter the information that builds the site. They can replace every example with their own business wording.</p>
            <div className="field"><label>Business / Website Name</label><input value={businessName} onChange={e => { setBusinessName(e.target.value); setFormError(''); }} placeholder="Example: Mary's Cleaning Service" /></div>
            <div className="field"><label>Email for Contact Button + Dashboard</label><input value={email} onChange={e => setEmail(e.target.value)} placeholder="customer@email.com" /></div>
            <div className="field"><label>Phone</label><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Optional. Shows in contact section only." /></div>
            <div className="field"><label>Homepage Headline</label><textarea className="large-textarea" value={headline} onChange={e => setHeadline(e.target.value)} /></div>
            <div className="field"><label>Homepage Description / Main Message</label><textarea className="large-textarea tall-textarea" value={description} onChange={e => setDescription(e.target.value)} /></div>
            <div className="field"><label>Offer Section Title</label><input value={offerTitle} onChange={e => setOfferTitle(e.target.value)} placeholder="Example: What I Offer, My Menu, Packages, Services" /></div>
            {serviceCards.map((card, index) => <div className="nested-edit-card" key={index}>
              <h3>Offer Box {index + 1}</h3>
              <div className="field"><label>Offer Title</label><input value={card.title} onChange={e => updateServiceCard(index, 'title', e.target.value)} placeholder="Example: Landing Pages" /></div>
              <div className="field"><label>Offer Description</label><textarea className="large-textarea" value={card.text} onChange={e => updateServiceCard(index, 'text', e.target.value)} placeholder="Describe this product, service, menu item, package, or offer." /></div>
            </div>)}
          </div>
        )}
        {step === 2 && (
          <div className="setup-step-card">
            <h3>Design</h3>
            <p className="small">Customers can change their website type/look here too. The preview updates while they click.</p>
            <div className="field"><label>Website Type</label><select value={purpose} onChange={e => changePurpose(e.target.value as TemplateCategoryKey)}>
              {templateCategories.map(item => <option key={item.key} value={item.key}>{item.name}</option>)}
            </select></div>
            <div className="visual-style-gallery compact-style-gallery">
              {visibleTemplates.map(item => <button type="button" className={`visual-style-card ${template === item.key ? 'active' : ''}`} key={item.key} onClick={() => applyTemplate(item.key)}>
                <span className="visual-style-image"><img src={item.art.image} alt="" /></span>
                <span className="visual-style-meta"><strong>{item.styleName}</strong><small>{item.name}</small></span>
              </button>)}
            </div>
            <div className="selected-template-card">
              <img src={templateData.art.image} alt="" />
              <div><strong>{templateData.name}</strong><br/><span className="small">{templateData.styleName} • {templateData.categoryName}</span></div>
            </div>
            <div className="field"><label>Main Color</label><input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} /></div>
            <div className="field"><label>Accent Color</label><input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} /></div>
            <div className="field"><label>Artwork Card Title</label><input value={artTitle} onChange={e => setArtTitle(e.target.value)} /></div>
            <div className="field"><label>Artwork Card Details</label><textarea className="large-textarea" value={artDetails} onChange={e => setArtDetails(e.target.value)} /></div>
            <div className="notice">Current plan: <strong>{plans[plan].name}</strong><br />{plans[plan].creditsLabel}</div>
          </div>
        )}
        {step === 3 && (
          <div className="setup-step-card">
            <h3>Pages & Wording</h3>
            <p className="small">Choose pages, then type the customer’s information for each selected section. {plan === 'free' ? 'Free includes Home only.' : premiumUnlocksAll ? 'Premium includes all available pages/sections.' : `${plans[plan].name} includes ${maxPages} page${maxPages > 1 ? 's' : ''}. Extra pages are $${EXTRA_PAGE_PRICE}/month per page.`}</p>
            <div className="pages-grid">
              {pageOptions.map(page => {
                const selected = selectedPages.includes(page);
                const lockedByFree = plan === 'free' && page !== 'Home';
                const nextCount = selected ? selectedPages.length - 1 : selectedPages.length + 1;
                const extra = plan !== 'free' && !plans[plan].allPages ? getExtraPageCount(plan, nextCount) : 0;
                return <button key={page} onClick={() => togglePage(page)} className={`option ${selected ? 'active' : ''} ${lockedByFree ? 'locked-option' : ''}`}>
                  <strong>{page}</strong><br/><span className="small">{page === 'Home' ? 'Required' : selected ? 'Selected — click to remove' : lockedByFree ? 'Upgrade to unlock' : extra > 0 ? `$${EXTRA_PAGE_PRICE}/mo extra` : 'Add page'}</span>
                </button>;
              })}
            </div>
            <div style={{marginTop: 14}} className="notice">{plan === 'free' ? 'Free pages show Cookie branding. Upgrade to unlock more pages.' : premiumUnlocksAll ? 'Premium unlocks all page/section choices in this builder for $50/month.' : `Extra pages selected: ${extraPageCount}. Extra page add-on: $${EXTRA_PAGE_PRICE}/month per page.`}</div>
            {selectedPages.filter(page => page !== 'Home').map(page => {
              const media = cleanMediaItems(pageContent[page]?.media);
              return <div className="nested-edit-card" key={page}>
                <h3>{page} Wording</h3>
                <div className="field"><label>{page} Title</label><input value={pageContent[page]?.title || pageCopy[page]?.title || page} onChange={e => updatePageContent(page, 'title', e.target.value)} /></div>
                <div className="field"><label>{page} Details</label><textarea className="large-textarea tall-textarea" value={pageContent[page]?.body || pageCopy[page]?.body || ''} onChange={e => updatePageContent(page, 'body', e.target.value)} placeholder={`Add the customer's ${page.toLowerCase()} information here.`} /></div>
                {pageSupportsMedia(page) && <div className="media-editor-box">
                  <h4>Add images, videos, or media links</h4>
                  <p className="small">Use this for gallery-style pages. Upload small images/videos or paste a video/photo link.</p>
                  <div className="controls">
                    <label className="btn secondary upload-button">Upload Media<input type="file" accept="image/*,video/*" multiple onChange={e => { addMediaFiles(page, e.currentTarget.files); e.currentTarget.value = ''; }} /></label>
                    <button type="button" className="btn secondary" onClick={() => addMediaLink(page)}>Add Media Link</button>
                  </div>
                  {media.length > 0 && <div className="media-editor-grid">{media.map((item, index) => <div className="media-editor-item" key={`${item.url}-${index}`}><strong>{item.name || item.type}</strong><span>{item.type}</span><button type="button" onClick={() => removePageMedia(page, index)}>Remove</button></div>)}</div>}
                </div>}
              </div>;
            })}
          </div>
        )}
        {step === 4 && (
          <div className="setup-step-card">
            <h3>{plan === 'free' ? 'Preview & Publish Free' : 'Preview & Checkout'}</h3>
            <p className="small">Review the website. Free pages publish immediately. Paid plans go to subscription checkout first.</p>
            <div className="checkout-summary">
              <strong>{plans[plan].name}</strong>
              <span>{currentBillingLabel}</span>
              <small>{plans[plan].limitLabel}{extraPageCount > 0 ? ` + ${extraPageCount} extra page${extraPageCount > 1 ? 's' : ''} at $${EXTRA_PAGE_PRICE}/month each` : ''}</small>
            </div>
            <button className="btn gold" onClick={continueToCheckout} disabled={publishingFree}>{publishingFree ? 'Publishing...' : plan === 'free' ? 'Publish Free Page' : `Continue to Checkout — ${currentBillingLabel}`}</button>
            <div style={{marginTop:14}} className="notice">{plan === 'free' ? `After publishing, the free page opens at ${slug}.${rootDomain} with Cookie branding.` : `No customer subdomain is shown until checkout is complete. After payment, the site publishes to ${slug}.${rootDomain}.`}</div>
          </div>
        )}
        <div className="controls">
          <button className="btn secondary" onClick={() => setStep(Math.max(0, step - 1))}>Back</button>
          <button className="btn" onClick={() => setStep(Math.min(4, step + 1))}>{step < 4 ? `${steps[step + 1]} Next` : 'Done'}</button>
        </div>
      </aside>
      <section className="preview-pane">
        <CustomerSiteView businessName={cleanBusinessName} headline={headline} description={description} primaryColor={primaryColor} accentColor={accentColor} template={template} pages={plan === 'free' ? ['Home'] : selectedPages} phone={phone} email={email} plan={plan} serviceCards={serviceCards} offerTitle={offerTitle} pageContent={previewPageContent} previewLabel="Website Preview" />
      </section>
    </main>
  );
}
