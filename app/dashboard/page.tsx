import Link from 'next/link';
import { demoSites } from '@/lib/demo-sites';

export default function DashboardPage() {
  const sites = Object.values(demoSites);
  return <main className="container section">
    <nav className="nav"><div className="brand"><span className="logo">C</span> Customer Dashboard</div><Link className="btn" href="/builder">Create New Site</Link></nav>
    <h1>Saved Customer Websites</h1>
    <p>This page becomes your admin/customer dashboard after Supabase login is connected.</p>
    <div className="grid cards3">
      {sites.map((site: any) => <div className="card" key={site.slug}>
        <h3>{site.businessName}</h3>
        <p>{site.slug}.cookiesdigitalcreations.com</p>
        <ul className="list"><li>{site.plan} package</li><li>{site.pages.length} page(s)</li><li>Published demo</li></ul>
        <div className="controls"><Link className="btn secondary" href={`/site/${site.slug}`}>View Site</Link><Link className="btn" href="/builder">Edit / Rebuild</Link></div>
      </div>)}
    </div>
  </main>;
}
