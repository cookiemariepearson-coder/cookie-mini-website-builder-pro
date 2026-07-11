'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { type TemplateKey } from '@/lib/templates';
import { CustomerSiteView } from '@/lib/site-view';

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
  const [pathLink, setPathLink] = useState('');
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
      setPathLink(data.pathLink || `/site/${payload.slug}`);
      setDemoWarning(Boolean(data.demo));
      setStatus('Subscription received. The website has been published.');
      localStorage.setItem('cookie-builder-published-site', JSON.stringify({...payload, publishedLink: data.link, pathLink: data.pathLink}));
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

  const directPath = pathLink || (site?.slug ? `https://www.cookiesdigitalcreations.com/site/${site.slug}` : '');

  return <main className="container section">
    <div className="card success-card">
      <span className="badge">Checkout Complete</span>
      <h1 style={{fontSize: 'clamp(40px, 7vw, 72px)'}}>Thank you!</h1>
      <p>{status}</p>

      {link && <div className="notice">
        <strong>Customer website domain:</strong><br />
        <span style={{fontSize: 20}}>{link}</span>
        <p className="small" style={{marginTop: 10}}>If the customer subdomain does not open yet, use the backup direct link below while DNS finishes or while wildcard routing is being checked.</p>
      </div>}

      {demoWarning && <div className="notice danger">
        This app is still in demo publish mode because Supabase is not connected yet. The success page can show the website preview, but new public customer subdomains need Supabase connected to save and open for everyone.
      </div>}

      {site && <CustomerSiteView site={site} previewLabel="Published Website Preview" />}

      <div className="controls">
        {directPath && <a className="btn gold" href={directPath} target="_blank" rel="noreferrer">Open Published Website</a>}
        {link && <a className="btn secondary" href={`https://${link}`} target="_blank" rel="noreferrer">Open Customer Subdomain</a>}
        {site && !link && <button className="btn gold" disabled={isPublishing} onClick={() => publishPaidSite()}>{isPublishing ? 'Publishing...' : 'Publish Website Now'}</button>}
        <Link className="btn secondary" href="/builder">Build Another Website</Link>
      </div>
    </div>
  </main>;
}
