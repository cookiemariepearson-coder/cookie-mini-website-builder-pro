'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CheckoutSuccessPage() {
  const [status, setStatus] = useState('Publishing your paid website...');
  const [link, setLink] = useState('');

  useEffect(() => {
    async function publishPaidSite() {
      const saved = localStorage.getItem('cookie-builder-pending-site');
      if (!saved) {
        setStatus('Payment was completed, but no website draft was found on this device. Please contact Cookie Digital Creations to publish the site manually.');
        return;
      }

      try {
        const payload = JSON.parse(saved);
        const response = await fetch('/api/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({...payload, paid: true})
        });
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.error || 'Publishing failed');
        setLink(data.link);
        setStatus('Payment received. The website has been published.');
        localStorage.removeItem('cookie-builder-pending-site');
      } catch (error) {
        setStatus('Payment was completed, but the site did not publish automatically. Please contact Cookie Digital Creations so the site can be published manually.');
      }
    }
    publishPaidSite();
  }, []);

  return <main className="container section">
    <div className="card success-card">
      <span className="badge">Checkout Complete</span>
      <h1 style={{fontSize: 'clamp(40px, 7vw, 72px)'}}>Thank you!</h1>
      <p>{status}</p>
      {link && <div className="notice">Published website link: <strong>{link}</strong></div>}
      <div className="controls">
        {link && <a className="btn gold" href={`https://${link}`}>Open Published Website</a>}
        <Link className="btn secondary" href="/builder">Build Another Website</Link>
      </div>
    </div>
  </main>;
}
