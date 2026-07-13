'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  plans,
  templates,
  slugify,
  getPlanPrice,
  getBillingLabel,
  getExtraPageCount,
  EXTRA_PAGE_PRICE,
  normalizePages,
  pageOptions,
  type PlanKey,
  type TemplateKey
} from '@/lib/templates';
import { CustomerSiteView } from '@/lib/site-view';

export default function BuilderPage() {
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState<TemplateKey>('local');
  const [plan, setPlan] = useState<PlanKey>('free');
  const [businessName, setBusinessName] = useState('');
  const [headline, setHeadline] = useState('A beautiful website created in minutes.');
  const [description, setDescription] = useState('Add your business details, services, and contact information so customers know what you offer.');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#20172f');
  const [accentColor, setAccentColor] = useState('#c46a2d');
  const [selectedPages, setSelectedPages] = useState(['Home']);
  const [formError, setFormError] = useState('');
  const [publishingFree, setPublishingFree] = useState(false);
  const [publishedLink, setPublishedLink] = useState('');
  const [pathLink, setPathLink] = useState('');

  const maxPages = plans[plan].maxPages;
  const premiumUnlocksAll = plans[plan].allPages;
  const extraPageCount = getExtraPageCount(plan, selectedPages.length);
  const currentPrice = getPlanPrice(plan, selectedPages.length);
  const currentBillingLabel = getBillingLabel(plan, selectedPages.length);
  const templateData = templates[template];
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cookiesdigitalcreations.com';


  const cleanBusinessName = businessName.trim() || 'My Business Name';
  const slug = useMemo(() => slugify(cleanBusinessName), [cleanBusinessName]);

  function applyTemplate(nextTemplate: TemplateKey) {
    setTemplate(nextTemplate);
    setHeadline(templates[nextTemplate].headline);
    setDescription(templates[nextTemplate].description);
    setPrimaryColor(templates[nextTemplate].defaultPrimary);
    setAccentColor(templates[nextTemplate].defaultAccent);
  }

  function changePlan(nextPlan: PlanKey) {
    setPlan(nextPlan);
    setPublishedLink('');
    setPathLink('');
    setSelectedPages(currentPages => {
      const normalized = normalizePages(currentPages);
      if (nextPlan === 'free') return ['Home'];
      if (plans[nextPlan].allPages) return normalized;
      return normalized;
    });
  }

  function togglePage(page: string) {
    if (page === 'Home') return;
    setFormError('');
    setSelectedPages(currentPages => {
      const normalized = normalizePages(currentPages);
      const isSelected = normalized.includes(page);
      if (isSelected) return normalizePages(normalized.filter(p => p !== page));
      if (plan === 'free') {
        setFormError('Free Launch Page includes Home only. Choose Starter, Business, or Premium to unlock more pages.');
        return normalized;
      }
      return normalizePages([...normalized, page]);
    });
  }

  function buildPayload() {
    return {
      slug,
      businessName: cleanBusinessName,
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
      price: currentPrice,
      priceLabel: currentBillingLabel,
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
      setFormError('Please add the customer email. This email lets the customer reopen their dashboard later.');
      setStep(1);
      return false;
    }
    return true;
  }

  async function publishFreePage() {
    if (!validateBeforePublish()) return;
    const payload = buildPayload();
    const freePayload = { ...payload, pages: ['Home'], plan: 'free' as PlanKey, billing: 'free', price: 0, priceLabel: 'Free' };
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
      setFormError('Free Launch Page published. Upgrade anytime to unlock more pages and remove Cookie branding.');
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

  const steps = ['Choose Template', 'Content', 'Design', 'Sections / Pages', plan === 'free' ? 'Preview & Publish Free' : 'Preview & Checkout'];

  return (
    <main className="builder-shell">
      <aside className="sidebar">
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
            {pathLink && <a className="btn secondary" href={pathLink} target="_blank" rel="noreferrer">Open Backup Link</a>}
          </div>
        </div>}
        {step === 0 && (
          <div>
            <h3>Choose Template</h3>
            <p className="small">Pick the closest website style. Paid templates are more visual. Free publishes one branded launch page.</p>
            <div className="template-grid">
              {Object.entries(templates).map(([key, item]) => (
                <button className={`option ${template === key ? 'active' : ''}`} key={key} onClick={() => applyTemplate(key as TemplateKey)}>
                  <strong>{item.name}</strong><br/><span className="small">{item.art.icon} Use this style</span>
                </button>
              ))}
            </div>
            <div className="field"><label>Plan</label><select value={plan} onChange={e => changePlan(e.target.value as PlanKey)}>
              {Object.entries(plans).map(([key, p]) => <option value={key} key={key}>{p.name} - {p.priceLabel} / {p.limitLabel}</option>)}
            </select></div>
            <div className="notice">Free Launch Page lets customers publish 1 branded page first, similar to a free trial. Paid plans remove the free badge and unlock more features. Extra pages for Starter or Business are {`$${EXTRA_PAGE_PRICE}/month per page`}.</div>
          </div>
        )}
        {step === 1 && (
          <div>
            <h3>Content Next</h3>
            <p className="small">Add the details customers will see on the website. The email is important for the customer dashboard.</p>
            <div className="field"><label>Business / Website Name</label><input value={businessName} onChange={e => { setBusinessName(e.target.value); setFormError(''); }} placeholder="Example: Mary's Cleaning Service" /></div>
            <div className="field"><label>Headline</label><textarea className="large-textarea" value={headline} onChange={e => setHeadline(e.target.value)} /></div>
            <div className="field"><label>Description</label><textarea className="large-textarea tall-textarea" value={description} onChange={e => setDescription(e.target.value)} /></div>
            <div className="field"><label>Phone</label><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Optional. Shows in contact section only." /></div>
            <div className="field"><label>Email</label><input value={email} onChange={e => setEmail(e.target.value)} placeholder="customer@email.com" /></div>
          </div>
        )}
        {step === 2 && (
          <div>
            <h3>Design Next</h3>
            <p className="small">Choose the main colors for the published customer website.</p>
            <div className="field"><label>Main Color</label><input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} /></div>
            <div className="field"><label>Accent Color</label><input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} /></div>
            <div className="notice">Current plan: <strong>{plans[plan].name}</strong><br />{plans[plan].creditsLabel}</div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h3>Sections / Pages Next</h3>
            <p className="small">{plan === 'free' ? 'Free includes Home only. Upgrade to add About, Services, Products, Gallery, Testimonials, Contact, or FAQ.' : premiumUnlocksAll ? 'Premium includes every available page/section option shown here. Select all the customer needs.' : `${plans[plan].name} includes ${maxPages} page${maxPages > 1 ? 's' : ''}. Extra selected pages are $${EXTRA_PAGE_PRICE}/month per page.`}</p>
            <div className="pages-grid">
              {pageOptions.map(page => {
                const selected = selectedPages.includes(page);
                const lockedByFree = plan === 'free' && page !== 'Home';
                return <button key={page} onClick={() => togglePage(page)} className={`option ${selected ? 'active' : ''} ${lockedByFree ? 'locked-option' : ''}`}>
                  <strong>{page}</strong><br/><span className="small">{page === 'Home' ? 'Required' : selected ? 'Selected' : lockedByFree ? 'Upgrade to unlock' : (!premiumUnlocksAll && selectedPages.length >= maxPages) ? `$${EXTRA_PAGE_PRICE}/mo extra` : 'Add page'}</span>
                </button>;
              })}
            </div>
            <div style={{marginTop: 14}} className="notice">{plan === 'free' ? 'Free pages show Cookie branding. Upgrade to Starter, Business, or Premium to unlock a professional paid website.' : premiumUnlocksAll ? 'Premium unlocks all page/section choices in this builder for $50/month.' : `Extra pages selected: ${extraPageCount}. Extra page add-on: $${EXTRA_PAGE_PRICE}/month per page.`}</div>
          </div>
        )}
        {step === 4 && (
          <div>
            <h3>{plan === 'free' ? 'Preview & Publish Free' : 'Preview & Checkout'}</h3>
            <p className="small">Review the website. Free pages publish immediately. Paid plans go to subscription checkout first.</p>
            <div className="checkout-summary">
              <strong>{plans[plan].name}</strong>
              <span>{currentBillingLabel}</span>
              <small>{plans[plan].limitLabel}{extraPageCount > 0 ? ` + ${extraPageCount} extra page${extraPageCount > 1 ? 's' : ''} at $${EXTRA_PAGE_PRICE}/month each` : ''}</small>
            </div>
            <button className="btn gold" onClick={continueToCheckout} disabled={publishingFree}>{publishingFree ? 'Publishing...' : plan === 'free' ? 'Publish Free Launch Page' : `Continue to Checkout — ${currentBillingLabel}`}</button>
            <div style={{marginTop:14}} className="notice">{plan === 'free' ? `After publishing, the free page opens at ${slug}.${rootDomain} with Cookie branding.` : `No customer subdomain is shown until checkout is complete. After payment, the site publishes to ${slug}.${rootDomain}.`}</div>
          </div>
        )}
        <div className="controls">
          <button className="btn secondary" onClick={() => setStep(Math.max(0, step - 1))}>Back</button>
          <button className="btn" onClick={() => setStep(Math.min(4, step + 1))}>{step < 4 ? `${steps[step + 1]} Next` : 'Done'}</button>
        </div>
      </aside>
      <section className="preview-pane">
        <CustomerSiteView businessName={cleanBusinessName} headline={headline} description={description} primaryColor={primaryColor} accentColor={accentColor} template={template} pages={plan === 'free' ? ['Home'] : selectedPages} phone={phone} email={email} plan={plan} previewLabel="Website Preview" />
      </section>
    </main>
  );
}
