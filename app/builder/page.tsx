'use client';

import { useMemo, useState } from 'react';
import { plans, templates, slugify, getPlanPrice, getBillingLabel, getExtraPageCount, EXTRA_PAGE_PRICE, type PlanKey, type TemplateKey } from '@/lib/templates';

const pageOptions = ['Home', 'About', 'Services', 'Products', 'Gallery', 'Testimonials', 'Contact', 'FAQ'];

export default function BuilderPage() {
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState<TemplateKey>('local');
  const [plan, setPlan] = useState<PlanKey>('starter');
  const [businessName, setBusinessName] = useState('');
  const [headline, setHeadline] = useState('A beautiful website created in minutes.');
  const [description, setDescription] = useState('Add your business details, services, and contact information so customers know what you offer.');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#20172f');
  const [accentColor, setAccentColor] = useState('#c46a2d');
  const [selectedPages, setSelectedPages] = useState(['Home']);
  const [formError, setFormError] = useState('');
  const maxPages = plans[plan].maxPages;
  const premiumUnlocksAll = plans[plan].allPages;
  const extraPageCount = getExtraPageCount(plan, selectedPages.length);
  const currentPrice = getPlanPrice(plan, selectedPages.length);
  const currentBillingLabel = getBillingLabel(plan, selectedPages.length);
  const templateData = templates[template];

  const cleanBusinessName = businessName.trim() || 'My Business Name';
  const slug = useMemo(() => slugify(cleanBusinessName), [cleanBusinessName]);

  function applyTemplate(nextTemplate: TemplateKey) {
    setTemplate(nextTemplate);
    setHeadline(templates[nextTemplate].headline);
    setDescription(templates[nextTemplate].description);
  }

  function changePlan(nextPlan: PlanKey) {
    setPlan(nextPlan);
    // Keep the customer's selected pages when switching plans. Starter and Business
    // may include extra pages at $10/month per page; Premium includes all available pages.
    setSelectedPages(currentPages => {
      const orderedPages = pageOptions.filter(page => currentPages.includes(page));
      return orderedPages.includes('Home') ? orderedPages : ['Home', ...orderedPages];
    });
  }

  function togglePage(page: string) {
    if (page === 'Home') return;
    if (selectedPages.includes(page)) {
      setSelectedPages(selectedPages.filter(p => p !== page));
    } else {
      setSelectedPages([...selectedPages, page]);
    }
  }

  function continueToCheckout() {
    if (!businessName.trim()) {
      setFormError('Please add the customer business name before checkout.');
      setStep(1);
      return;
    }

    const payload = {
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
      pages: selectedPages,
      billing: 'subscription',
      extraPageCount,
      price: currentPrice,
      priceLabel: currentBillingLabel,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('cookie-builder-pending-site', JSON.stringify(payload));
    window.location.href = `/checkout?plan=${plan}&slug=${slug}`;
  }

  const steps = ['Choose Template', 'Content', 'Design', 'Sections / Pages', 'Preview & Checkout'];

  return (
    <main className="builder-shell">
      <aside className="sidebar">
        <div className="brand"><span className="logo">C</span> Cookie Mini Website Builder Pro</div>
        <div className="stepper">
          {steps.map((s, i) => <button key={s} onClick={() => setStep(i)} className={`step ${step === i ? 'active' : ''}`}>{i + 1}. {s}</button>)}
        </div>
        {formError && <div className="notice danger">{formError}</div>}
        {step === 0 && (
          <div>
            <h3>Choose Template</h3>
            <p className="small">Pick the closest website style. The services and sections will change to match that type.</p>
            <div className="template-grid">
              {Object.entries(templates).map(([key, item]) => (
                <button className={`option ${template === key ? 'active' : ''}`} key={key} onClick={() => applyTemplate(key as TemplateKey)}>
                  <strong>{item.name}</strong><br/><span className="small">Use this style</span>
                </button>
              ))}
            </div>
            <div className="field"><label>Subscription</label><select value={plan} onChange={e => changePlan(e.target.value as PlanKey)}>
              {Object.entries(plans).map(([key, p]) => <option value={key} key={key}>{p.name} - {p.priceLabel} / {p.limitLabel}</option>)}
            </select></div>
            <div className="notice">All plans are subscriptions. Starter is $19/month, Business is $30/month, and Premium is $50/month. Extra pages for Starter or Business are {`$${EXTRA_PAGE_PRICE}/month per page`}.</div>
          </div>
        )}
        {step === 1 && (
          <div>
            <h3>Content Next</h3>
            <p className="small">Add the details customers will see on the website.</p>
            <div className="field"><label>Business / Website Name</label><input value={businessName} onChange={e => { setBusinessName(e.target.value); setFormError(''); }} placeholder="Example: Mary's Cleaning Service" /></div>
            <div className="field"><label>Headline</label><textarea value={headline} onChange={e => setHeadline(e.target.value)} /></div>
            <div className="field"><label>Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} /></div>
            <div className="field"><label>Phone</label><input value={phone} onChange={e => setPhone(e.target.value)} /></div>
            <div className="field"><label>Email</label><input value={email} onChange={e => setEmail(e.target.value)} /></div>
          </div>
        )}
        {step === 2 && (
          <div>
            <h3>Design Next</h3>
            <p className="small">Choose the main colors for the published customer website.</p>
            <div className="field"><label>Main Color</label><input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} /></div>
            <div className="field"><label>Accent Color</label><input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} /></div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h3>Sections / Pages Next</h3>
            <p className="small">{premiumUnlocksAll ? 'Premium includes every available page/section option shown here. Select all the customer needs.' : `${plans[plan].name} includes ${maxPages} page${maxPages > 1 ? 's' : ''}. Extra selected pages are $${EXTRA_PAGE_PRICE}/month per page.`}</p>
            <div className="pages-grid">
              {pageOptions.map(page => (
                <button key={page} onClick={() => togglePage(page)} className={`option ${selectedPages.includes(page) ? 'active' : ''}`}>
                  <strong>{page}</strong><br/><span className="small">{page === 'Home' ? 'Required' : selectedPages.includes(page) ? 'Selected' : (!premiumUnlocksAll && selectedPages.length >= maxPages) ? `$${EXTRA_PAGE_PRICE}/mo extra` : 'Add page'}</span>
                </button>
              ))}
            </div>
            <div style={{marginTop: 14}} className="notice">{premiumUnlocksAll ? 'Premium unlocks all page/section choices in this builder for $50/month.' : `Extra pages selected: ${extraPageCount}. Extra page add-on: $${EXTRA_PAGE_PRICE}/month per page.`}</div>
          </div>
        )}
        {step === 4 && (
          <div>
            <h3>Preview & Checkout</h3>
            <p className="small">Review the website. When the customer is ready, send them to checkout before the site is published.</p>
            <div className="checkout-summary">
              <strong>{plans[plan].name} Website</strong>
              <span>{currentBillingLabel}</span>
              <small>{plans[plan].limitLabel}{extraPageCount > 0 ? ` + ${extraPageCount} extra page${extraPageCount > 1 ? 's' : ''} at $${EXTRA_PAGE_PRICE}/month each` : ''}</small>
            </div>
            <button className="btn gold" onClick={continueToCheckout}>Continue to Checkout — {currentBillingLabel}</button>
            <div style={{marginTop:14}} className="notice">No customer subdomain is shown until checkout is complete. After payment, the site publishes to <strong>{slug}.cookiesdigitalcreations.com</strong>.</div>
          </div>
        )}
        <div className="controls">
          <button className="btn secondary" onClick={() => setStep(Math.max(0, step - 1))}>Back</button>
          <button className="btn" onClick={() => setStep(Math.min(4, step + 1))}>{step < 4 ? `${steps[step + 1]} Next` : 'Done'}</button>
        </div>
      </aside>
      <section className="preview-pane">
        <SitePreview businessName={cleanBusinessName} headline={headline} description={description} primaryColor={primaryColor} accentColor={accentColor} template={template} pages={selectedPages} phone={phone} email={email} />
      </section>
    </main>
  );
}

function SitePreview(props: any) {
  const services = templates[props.template as TemplateKey].services;
  return <div className="site-preview">
    <header className="site-header" style={{background: props.primaryColor, color: 'white'}}>
      <strong>{props.businessName}</strong>
      <span className="small" style={{color:'rgba(255,255,255,.82)'}}>{props.pages.join(' • ')}</span>
    </header>
    <section className="site-hero" style={{background: `linear-gradient(135deg, ${props.primaryColor}, ${props.accentColor})`, color: 'white'}}>
      <span className="badge" style={{color: props.primaryColor}}>Website Preview</span>
      <h1>{props.headline}</h1>
      <p style={{color:'rgba(255,255,255,.88)'}}>{props.description}</p>
      <button className="btn gold">Contact Now</button>
    </section>
    <section className="site-section">
      <h2>Services</h2>
      <div className="service-grid">
        {services.map((s: any) => <div className="service-card" key={s.title}><h3>{s.title}</h3><p>{s.text}</p></div>)}
      </div>
    </section>
    {props.pages.filter((p: string) => p !== 'Home').map((p: string) => <section className="site-section" key={p}><h2>{p}</h2><p>This page is included in the selected subscription or added as an extra-page upgrade and can be customized for the customer.</p></section>)}
    <footer className="site-footer"><strong>{props.businessName}</strong><br/>{props.phone || 'Add phone'} • {props.email || 'Add email'}</footer>
  </div>;
}
