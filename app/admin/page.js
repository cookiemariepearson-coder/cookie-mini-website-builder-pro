'use client';
import { useMemo, useState } from 'react';
import Nav from '../../lib/Nav';

const planPrices = { free: 0, starter: 19, business: 30, premium: 50 };
const planNames = { free: 'Free Launch Page', starter: 'Starter Pro', business: 'Business', premium: 'Premium' };
const statuses = ['published', 'paused', 'draft'];

function siteUrl(slug) {
  return `https://${slug}.cookiesdigitalcreations.com`;
}

function directUrl(slug) {
  return `https://www.cookiesdigitalcreations.com/site/${slug}`;
}

function displayDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return '—';
  }
}

export default function Admin() {
  const [pin, setPin] = useState('');
  const [sites, setSites] = useState([]);
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('websites');
  const [loading, setLoading] = useState(false);
  const [savingSlug, setSavingSlug] = useState('');

  async function load() {
    setLoading(true);
    setMsg('Loading admin dashboard...');
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
    } else {
      setMsg(d.error || 'Unable to load admin dashboard.');
    }
  }

  async function update(slug, updates, quiet = false) {
    setSavingSlug(slug);
    const r = await fetch('/api/admin/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, slug, updates })
    });
    const d = await r.json();
    setSavingSlug('');
    if (d.ok) {
      if (!quiet) setMsg('Saved admin change.');
      await load();
    } else {
      setMsg(d.error || 'Unable to update website.');
    }
  }

  function patchLocal(slug, updates) {
    setSites((items) => items.map((site) => (site.slug === slug ? { ...site, ...updates } : site)));
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return sites;
    return sites.filter((s) =>
      [s.slug, s.business_name, s.customer_email, s.plan, s.status, s.admin_notes]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [sites, search]);

  const stats = useMemo(() => {
    const published = sites.filter((s) => s.status === 'published');
    const paused = sites.filter((s) => s.status === 'paused');
    const free = sites.filter((s) => (s.plan || 'free') === 'free');
    const mrr = published.reduce((sum, s) => {
      const base = Number(s.monthly_price ?? planPrices[s.plan] ?? 0);
      const extra = Number(s.extra_pages || 0) * 10;
      return sum + base + extra;
    }, 0);
    return { total: sites.length, published: published.length, paused: paused.length, free: free.length, mrr };
  }, [sites]);

  return (
    <>
      <Nav />
      <main className="wrap dashboard">
        <span className="kicker">Owner dashboard</span>
        <h1>Admin Plan Management</h1>
        <p>Manage customer websites, plans, extra pages, notes, and paused/published status.</p>

        <section className="card">
          <div className="row">
            <div className="field">
              <label>Admin PIN</label>
              <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Enter your ADMIN_PIN" />
            </div>
            <div className="field">
              <label>&nbsp;</label>
              <button className="btn" onClick={load}>{loading ? 'Loading...' : 'Open Admin'}</button>
            </div>
          </div>
          {msg && <div className="notice">{msg}</div>}
        </section>

        <div className="cardGrid">
          <div className="card"><strong>Total Sites</strong><div className="price">{stats.total}</div></div>
          <div className="card"><strong>Published</strong><div className="price">{stats.published}</div></div>
          <div className="card"><strong>Paused</strong><div className="price">{stats.paused}</div></div>
          <div className="card"><strong>Free Sites</strong><div className="price">{stats.free}</div></div>
          <div className="card"><strong>Estimated Active MRR</strong><div className="price">${stats.mrr}/mo</div></div>
        </div>

        <div className="pillTabs">
          <button className={tab === 'websites' ? 'active' : ''} onClick={() => setTab('websites')}>Websites</button>
          <button className={tab === 'plans' ? 'active' : ''} onClick={() => setTab('plans')}>Plans & Status</button>
          <button className={tab === 'notes' ? 'active' : ''} onClick={() => setTab('notes')}>Admin Notes</button>
          <button className={tab === 'help' ? 'active' : ''} onClick={() => setTab('help')}>How to Use</button>
        </div>

        <section className="card">
          <div className="row">
            <h2>Customer Websites</h2>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, slug, email, plan, status, or note" />
          </div>
        </section>

        {tab === 'websites' && (
          <section className="card">
            <h2>Websites</h2>
            <div className="tableWrap">
              <table className="table">
                <thead><tr><th>Website</th><th>Email</th><th>Plan</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>{filtered.map((s) => (
                  <tr key={s.slug}>
                    <td><strong>{s.business_name || s.slug}</strong><br /><small>{s.slug}.cookiesdigitalcreations.com</small><br /><small>Updated: {displayDate(s.updated_at)}</small></td>
                    <td>{s.customer_email || '—'}</td>
                    <td>{planNames[s.plan] || s.plan || 'Free Launch Page'}</td>
                    <td>{s.status || 'published'}</td>
                    <td>
                      <a className="btn dark" target="_blank" rel="noreferrer" href={siteUrl(s.slug)}>Open Site</a>{' '}
                      <a className="btn dark" target="_blank" rel="noreferrer" href={directUrl(s.slug)}>Backup Link</a>{' '}
                      <a className="btn" target="_blank" rel="noreferrer" href={`/customer/edit/${s.slug}`}>Edit</a>{' '}
                      {s.status === 'paused' ? (
                        <button className="btn" onClick={() => update(s.slug, { status: 'published' })}>Reactivate</button>
                      ) : (
                        <button className="btn danger" onClick={() => update(s.slug, { status: 'paused' })}>Pause</button>
                      )}
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </section>
        )}

        {tab === 'plans' && (
          <section className="card">
            <h2>Plans & Status Controls</h2>
            <p>Use this when someone upgrades, cancels, buys an extra page, or needs their site paused/reactivated.</p>
            <div className="tableWrap">
              <table className="table">
                <thead><tr><th>Website</th><th>Plan</th><th>Status</th><th>Extra Pages</th><th>Monthly Price</th><th>Save</th></tr></thead>
                <tbody>{filtered.map((s) => (
                  <tr key={s.slug}>
                    <td><strong>{s.business_name || s.slug}</strong><br /><small>{s.slug}</small></td>
                    <td>
                      <select value={s.plan || 'free'} onChange={(e) => {
                        const plan = e.target.value;
                        patchLocal(s.slug, { plan, monthly_price: planPrices[plan] || 0 });
                        update(s.slug, { plan, monthly_price: planPrices[plan] || 0 }, true);
                      }}>
                        {Object.keys(planNames).map((p) => <option key={p} value={p}>{planNames[p]}</option>)}
                      </select>
                    </td>
                    <td>
                      <select value={s.status || 'published'} onChange={(e) => {
                        patchLocal(s.slug, { status: e.target.value });
                        update(s.slug, { status: e.target.value }, true);
                      }}>
                        {statuses.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </td>
                    <td>
                      <input style={{ width: 90 }} type="number" min="0" value={s.extra_pages || 0} onChange={(e) => patchLocal(s.slug, { extra_pages: Number(e.target.value) })} />
                    </td>
                    <td>
                      <input style={{ width: 110 }} type="number" min="0" value={s.monthly_price ?? planPrices[s.plan] ?? 0} onChange={(e) => patchLocal(s.slug, { monthly_price: Number(e.target.value) })} />
                    </td>
                    <td><button className="btn" onClick={() => update(s.slug, { extra_pages: s.extra_pages || 0, monthly_price: s.monthly_price ?? planPrices[s.plan] ?? 0 })}>{savingSlug === s.slug ? 'Saving...' : 'Save'}</button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </section>
        )}

        {tab === 'notes' && (
          <section className="card">
            <h2>Admin Notes</h2>
            <p>Private notes only you see. Use this for payment issues, support notes, cancellation dates, or extra-page tracking.</p>
            <div className="cardGrid oneCol">
              {filtered.map((s) => (
                <div className="card" key={s.slug}>
                  <h3>{s.business_name || s.slug}</h3>
                  <small>{s.customer_email || 'No email saved'} • {planNames[s.plan] || s.plan || 'Free'} • {s.status || 'published'}</small>
                  <textarea value={s.admin_notes || ''} onChange={(e) => patchLocal(s.slug, { admin_notes: e.target.value })} placeholder="Private admin note..." />
                  <button className="btn" onClick={() => update(s.slug, { admin_notes: s.admin_notes || '' })}>{savingSlug === s.slug ? 'Saving...' : 'Save Note'}</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === 'help' && (
          <section className="card">
            <h2>How to use this admin dashboard</h2>
            <p><strong>Published</strong> websites open publicly. <strong>Paused</strong> websites should not open publicly. Use Pause if someone cancels or payment fails.</p>
            <p><strong>Plan</strong> controls what the customer should have: Free, Starter Pro, Business, or Premium.</p>
            <p><strong>Extra Pages</strong> should match how many $10/month extra page add-ons they purchased.</p>
            <p>Until Gumroad webhooks are connected, plan changes and cancellations are handled manually here.</p>
            <p>The customer-facing dashboard should show the main subdomain link only. The backup link is for you inside admin.</p>
          </section>
        )}
      </main>
    </>
  );
}
