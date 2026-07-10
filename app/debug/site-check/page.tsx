'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SiteCheckPage() {
  const [slug, setSlug] = useState('');
  const clean = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return <main className="container section">
    <div className="card">
      <span className="badge">Site Link Checker</span>
      <h1 style={{fontSize: 'clamp(38px, 6vw, 64px)'}}>Check a published customer site.</h1>
      <p>Use this page to test whether a customer site is saved in Supabase before checking the wildcard subdomain.</p>
      <label className="field">
        Customer slug
        <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="southern-realty-investment-group-llc" />
      </label>
      {clean && <div className="controls">
        <a className="btn gold" href={`/site/${clean}`} target="_blank" rel="noreferrer">Open Direct Site Link</a>
        <a className="btn secondary" href={`https://${clean}.cookiesdigitalcreations.com`} target="_blank" rel="noreferrer">Open Customer Subdomain</a>
      </div>}
      <div className="controls"><Link className="btn secondary" href="/builder">Back to Builder</Link></div>
    </div>
  </main>;
}
