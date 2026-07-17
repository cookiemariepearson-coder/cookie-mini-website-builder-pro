'use client';
import { useMemo, useState } from 'react';
import Nav from '../../lib/Nav';

const planPrices = { free: 0, starter: 19, business: 30, premium: 50 };
const planNames = { free: 'Free', starter: 'Starter Pro', business: 'Business', premium: 'Premium' };

function siteUrl(slug) {
  return `https://${slug}.cookiesdigitalcreations.com`;
}

export default function Admin() {
  const [pin, setPin] = useState('');
  const [sites, setSites] = useState([]);
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('websites');
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const r = await fetch('/api/admin/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });
    const d = await r.json();
    setLoading(false);
    if (d.ok) {
      setSites(d.sites || []);
      setMsg('Admin dashboard loaded.');
    } else setMsg(d.error || 'Unable to load admin dashboard.');
  }

  async function update(slug, updates) {
    const r = await fetch('/api/admin/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, slug, updates })
    });
    const d = await r.json();
    if (d.ok) load();
    else setMsg(d.error || 'Unable to update website.');
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return sites;
    return sites.filter(s => [s.slug, s.business_name, s.customer_email, s.plan, s.status].join(' ').toLowerCase().includes(q));
  }, [sites, search]);

  const stats = useMemo(() => {
    const published = sites.filter(s => s.status === 'published');
    const paused = sites.filter(s => s.status === 'paused');
    const mrr = published.reduce((sum, s) => {
      const base = Number(s.monthly_price ?? planPrices[s.plan] ?? 0);
      const extra = Number(s.extra_pages || 0) * 10;
      return sum + base + extra;
    }, 0);
    return { total: sites.length, published: published.length, paused: paused.length, mrr };
  }, [sites]);

  return (
    <>
      <Nav />
      <main className="wrap dashboard">
        <span className="kicker">Owner dashboard</span>
        <h1>Admin Plan Management</h1>
        <p>Manage customer websites, plans, extra pages, and paused/published status.</p>

        <div className="row">
          <div className="field">
            <label>Admin PIN</label>
            <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="Enter your ADMIN_PIN" />
          </div>
          <div className="field">
            <label>&nbsp;</label>
            <button className="btn" onClick={load}>{loading ? 'Loading...' : 'Open Admin'}</button>
          </div>
        </div>
        {msg && <div className="notice">{msg}</div>}

        <div className="cardGrid">
          <div className="card"><strong>Total Sites</strong><div className="price">{stats.total}</div></div>
          <div className="card"><strong>Published</strong><div className="price">{stats.published}</div></div>
          <div className="card"><strong>Paused</strong><div className="price">{stats.paused}</div></div>
          <div className="card"><strong>Estimated Active MRR</strong><div className="price">${stats.mrr}/mo</div></div>
        </div>

        <div className="pillTabs">
          <button className={tab === 'websites' ? 'active' : ''} onClick={() => setTab('websites')}>Websites</button>
          <button className={tab === 'plans' ? 'active' : ''} onClick={() => setTab('plans')}>Plans & Status</button>
          <button className={tab === 'help' ? 'active' : ''} onClick={() => setTab('help')}>Admin Notes</button>
        </div>

        {tab === 'websites' && (
          <section className="card">
            <div className="row">
              <h2>Customer Websites</h2>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, slug, email, plan, or status" />
            </div>
            <table className="table">
              <thead><tr><th>Website</th><th>Email</th><th>Plan</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{filtered.map(s => (
                <tr key={s.slug}>
                  <td><strong>{s.business_name || s.slug}</strong><br /><small>{s.slug}.cookiesdigitalcreations.com</small></td>
                  <td>{s.customer_email || '—'}</td>
                  <td>{planNames[s.plan] || s.plan || 'Free'}</td>
                  <td>{s.status || 'published'}</td>
                  <td>
                    <a className="btn dark" target="_blank" href={siteUrl(s.slug)}>Open Site</a>{' '}
                    <a className="btn" target="_blank" href={`/customer/edit/${s.slug}`}>Edit</a>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </section>
        )}

        {tab === 'plans' && (
          <section className="card">
            <h2>Plans & Status Controls</h2>
            <table className="table">
              <thead><tr><th>Website</th><th>Plan</th><th>Status</th><th>Extra Pages</th><th>Monthly Price</th></tr></thead>
              <tbody>{filtered.map(s => (
                <tr key={s.slug}>
                  <td><strong>{s.slug}</strong></td>
                  <td><select value={s.plan || 'free'} onChange={e => update(s.slug, { plan: e.target.value, monthly_price: planPrices[e.target.value] || 0 })}>{Object.keys(planNames).map(p => <option key={p} value={p}>{planNames[p]}</option>)}</select></td>
                  <td><select value={s.status || 'published'} onChange={e => update(s.slug, { status: e.target.value })}>{['published', 'paused', 'draft'].map(p => <option key={p} value={p}>{p}</option>)}</select></td>
                  <td><input style={{ width: 80 }} type="number" min="0" value={s.extra_pages || 0} onChange={e => update(s.slug, { extra_pages: Number(e.target.value) })} /></td>
                  <td><input style={{ width: 100 }} type="number" min="0" value={s.monthly_price ?? planPrices[s.plan] ?? 0} onChange={e => update(s.slug, { monthly_price: Number(e.target.value) })} /></td>
                </tr>
              ))}</tbody>
            </table>
          </section>
        )}

        {tab === 'help' && (
          <section className="card">
            <h2>How to use this admin dashboard</h2>
            <p><strong>Published</strong> websites open publicly. <strong>Paused</strong> websites will show as not found. Use Pause if someone cancels or payment fails.</p>
            <p>Until Gumroad webhooks are connected, plan changes and cancellations are handled manually here.</p>
            <p>The customer-facing site should show the main subdomain link only. Keep direct backup links for troubleshooting only.</p>
          </section>
        )}
      </main>
    </>
  );
}
