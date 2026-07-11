import Link from 'next/link';

export default function DashboardPage() {
  return <main className="container section">
    <nav className="nav">
      <div className="brand"><span className="logo">C</span> Cookie Mini Website Builder Dashboard</div>
      <div className="navlinks"><Link href="/builder">Builder</Link><Link href="/customer">Customer</Link><Link href="/admin">Admin</Link><Link href="/">Home</Link></div>
    </nav>
    <section className="card">
      <span className="badge">Control Center</span>
      <h1>Website Builder Dashboard</h1>
      <p>This dashboard is the owner hub for Cookie Digital Creations. Use the builder to create a site, or use the admin center to manage saved customer websites in Supabase.</p>
      <div className="grid cards3">
        <div className="card"><h3>Create Customer Website</h3><p>Build a new website, send the customer to subscription checkout, then publish their live link.</p><Link className="btn gold" href="/builder">Open Builder</Link></div>
        <div className="card"><h3>Customer Dashboard</h3><p>Customers can reopen their website, edit content, update contact details, and republish changes while subscribed.</p><Link className="btn gold" href="/customer">Open Customer Dashboard</Link></div>
        <div className="card"><h3>Admin Control Center</h3><p>Review customer sites, open links, edit content, and pause websites when needed.</p><Link className="btn" href="/admin">Open Admin</Link></div>
        <div className="card"><h3>Debug Site Check</h3><p>Check whether a slug is saved and open the direct or subdomain link.</p><Link className="btn secondary" href="/debug/site-check">Check Site</Link></div>
      </div>
    </section>
  </main>;
}
