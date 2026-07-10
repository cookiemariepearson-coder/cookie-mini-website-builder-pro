'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { templates, type TemplateKey } from '@/lib/templates';

type PaidSite = {
  slug: string;
  businessName: string;
  template: TemplateKey;
  plan: string;
  headline: string;
  description: string;
  phone?: string;
  email?: string;
  primaryColor: string;
  accentColor: string;
  pages: string[];
  priceLabel?: string;
};

export default function CheckoutSuccessPage() {
  const [status, setStatus] = useState('Returning from subscription checkout...');
  const [link, setLink] = useState('');
  const [site, setSite] = useState<PaidSite | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [demoWarning, setDemoWarning] = useState(false);

  async function publishPaidSite(savedSite?: PaidSite) {
    const payload = savedSite || site;
    if (!payload) {
      setStatus('Payment returned successfully, but no website draft was found in this browser. Please go back to the builder or contact Cookie Digital Creations to publish the site manually.');
      return;
    }

    try {
      setIsPublishing(true);
      setStatus('Publishing your paid website now...');
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...payload, paid: true, paidAt: new Date().toISOString()})
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'Publishing failed');
      setLink(data.link);
      setDemoWarning(Boolean(data.demo));
      setStatus('Subscription received. The website has been published.');
      localStorage.setItem('cookie-builder-published-site', JSON.stringify({...payload, publishedLink: data.link}));
      localStorage.removeItem('cookie-builder-pending-site');
    } catch (error) {
      setStatus('Subscription checkout returned, but the site did not publish automatically. Keep this page open and contact Cookie Digital Creations so the site can be published manually.');
    } finally {
      setIsPublishing(false);
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem('cookie-builder-pending-site') || localStorage.getItem('cookie-builder-last-draft');
    if (!saved) {
      setStatus('Payment returned successfully, but no website draft was found in this browser. Please return using the same device and browser used to build the website.');
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      setSite(parsed);
      publishPaidSite(parsed);
    } catch {
      setStatus('Payment returned successfully, but the saved website draft could not be read. Please contact Cookie Digital Creations for manual publishing.');
    }
  }, []);

  return <main className="container section">
    <div className="card success-card">
      <span className="badge">Checkout Complete</span>
      <h1 style={{fontSize: 'clamp(40px, 7vw, 72px)'}}>Thank you!</h1>
      <p>{status}</p>

      {link && <div className="notice">
        <strong>Customer website domain:</strong><br />
        <span style={{fontSize: 20}}>{link}</span>
      </div>}

      {demoWarning && <div className="notice danger">
        This app is still in demo publish mode because Supabase is not connected yet. The success page can show the website preview, but new public customer subdomains need Supabase connected to save and open for everyone.
      </div>}

      {site && <MiniPreview site={site} />}

      <div className="controls">
        {link && <a className="btn gold" href={`https://${link}`} target="_blank" rel="noreferrer">Open Published Website</a>}
        {site && !link && <button className="btn gold" disabled={isPublishing} onClick={() => publishPaidSite()}>{isPublishing ? 'Publishing...' : 'Publish Website Now'}</button>}
        <Link className="btn secondary" href="/builder">Build Another Website</Link>
      </div>
    </div>
  </main>;
}

function MiniPreview({ site }: { site: PaidSite }) {
  const services = templates[site.template]?.services || templates.local.services;
  const pages = site.pages || ['Home'];
  return <div className="site-preview" style={{marginTop: 24, textAlign: 'left'}}>
    <header className="site-header" style={{background: site.primaryColor || '#20172f', color: 'white'}}>
      <strong>{site.businessName}</strong>
      <span className="small" style={{color:'rgba(255,255,255,.82)'}}>{pages.join(' • ')}</span>
    </header>
    <section className="site-hero" style={{background: `linear-gradient(135deg, ${site.primaryColor || '#20172f'}, ${site.accentColor || '#c46a2d'})`, color: 'white'}}>
      <span className="badge" style={{color: site.primaryColor || '#20172f'}}>Published Website Preview</span>
      <h1>{site.headline}</h1>
      <p style={{color:'rgba(255,255,255,.88)'}}>{site.description}</p>
      <button className="btn gold">Contact Now</button>
    </section>
    <section className="site-section">
      <h2>Services</h2>
      <div className="service-grid">
        {services.map((s: any) => <div className="service-card" key={s.title}><h3>{s.title}</h3><p>{s.text}</p></div>)}
      </div>
    </section>
    <footer className="site-footer"><strong>{site.businessName}</strong><br />{site.phone || 'Add phone'} • {site.email || 'Add email'}</footer>
  </div>;
}
