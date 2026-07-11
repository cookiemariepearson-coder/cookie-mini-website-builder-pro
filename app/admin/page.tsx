'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

function money(value: number) {
  return `$${Number(value || 0).toLocaleString()}/mo`;
}

function getStoredPin() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('cookie-admin-pin') || '';
}

export default function AdminPage() {
  const [pin, setPin] = useState('');
  const [sites, setSites] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [message, setMessage] = useState('Enter your admin PIN to manage customer websites.');
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cookiesdigitalcreations.com';

  useEffect(() => {
    const savedPin = getStoredPin();
    if (savedPin) {
      setPin(savedPin);
      loadSites(savedPin);
    }
  }, []);

  async function loadSites(pinToUse = pin) {
    setLoading(true);
    setMessage('Loading customer websites...');
    try {
      const response = await fetch('/api/admin/sites', { headers: { 'x-admin-pin': pinToUse } });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'Could not load websites.');
      setSites(data.sites || []);
      setStats(data.stats || null);
      localStorage.setItem('cookie-admin-pin', pinToUse);
      setMessage('Admin dashboard loaded.');
    } catch (error: any) {
      setMessage(error.message || 'Could not load websites.');
    } finally {
      setLoading(false);
    }
  }

  async function pauseSite(slug: string) {
    if (!confirm('Pause this website? It will stop opening publicly until you republish it.')) return;
    try {
      const response = await fetch(`/api/admin/sites/${slug}`, { method: 'DELETE', headers: { 'x-admin-pin': pin } });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'Could not pause website.');
      await loadSites(pin);
    } catch (error: any) {
      setMessage(error.message || 'Could not pause website.');
    }
  }

  const filteredSites = useMemo(() => {
    const search = query.toLowerCase().trim();
    if (!search) return sites;
    return sites.filter(site =>
      String(site.slug || '').toLowerCase().includes(search) ||
      String(site.businessName || site.business_name || '').toLowerCase().includes(search) ||
      String(site.email || '').toLowerCase().includes(search)
    );
  }, [sites, query]);

  return <main className="container section">
    <nav className="nav">
      <div className="brand"><span className="logo">C</span> Cookie Admin Control Center</div>
      <div className="navlinks">
        <Link href="/builder">Builder</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/">Home</Link>
      </div>
    </nav>

    <section className="card admin-hero">
      <span className="badge">Owner upgrade</span>
      <h1>Manage published customer websites.</h1>
      <p>Use this private dashboard to review paid websites, open customer links, edit content, and pause websites when needed.</p>
      <div className="admin-pin-row">
        <input value={pin} onChange={e => setPin(e.target.value)} placeholder="Enter ADMIN_PIN from Vercel" type="password" />
        <button className="btn gold" onClick={() => loadSites()} disabled={loading}>{loading ? 'Loading...' : 'Open Admin'}</button>
      </div>
      <p className="small">Set ADMIN_PIN in Vercel Environment Variables first. Keep it private.</p>
      {message && <div className="notice" style={{marginTop: 14}}>{message}</div>}
    </section>

    {stats && <section className="admin-stats">
      <div className="card mini-stat"><span>Total Sites</span><strong>{stats.total}</strong></div>
      <div className="card mini-stat"><span>Published</span><strong>{stats.published}</strong></div>
      <div className="card mini-stat"><span>Paused</span><strong>{stats.paused}</strong></div>
      <div className="card mini-stat"><span>Estimated Active MRR</span><strong>{money(stats.monthlyRevenue)}</strong></div>
    </section>}

    {sites.length > 0 && <section className="card">
      <div className="admin-table-head">
        <div>
          <h2>Customer Websites</h2>
          <p>These records are pulled from Supabase.</p>
        </div>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name, slug, or email" />
      </div>
      <div className="admin-table">
        {filteredSites.map(site => {
          const name = site.businessName || site.business_name || site.slug;
          const subdomain = `https://${site.slug}.${rootDomain}`;
          const direct = `https://www.${rootDomain}/site/${site.slug}`;
          return <div className="admin-row" key={site.id || site.slug}>
            <div>
              <strong>{name}</strong>
              <p className="small">{site.slug}.{rootDomain}</p>
              <p className="small">{site.plan || 'starter'} • {site.price_label || `$${site.monthly_price || 0}/mo`} • status: {site.status || 'published'}</p>
            </div>
            <div className="admin-actions">
              <a className="btn secondary" href={direct} target="_blank" rel="noreferrer">Open Direct</a>
              <a className="btn secondary" href={subdomain} target="_blank" rel="noreferrer">Open Subdomain</a>
              <Link className="btn gold" href={`/admin/edit/${site.slug}`}>Edit</Link>
              <button className="btn danger-btn" onClick={() => pauseSite(site.slug)}>Pause</button>
            </div>
          </div>;
        })}
      </div>
    </section>}
  </main>;
}
