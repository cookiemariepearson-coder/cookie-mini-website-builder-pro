import Link from 'next/link';

export default function LegalHubPage() {
  return <main className="container section">
    <nav className="nav launch-nav"><Link className="brand brand-link" href="/"><span className="logo">C</span> Cookie Mini Website Builder</Link><div className="navlinks"><Link href="/pricing">Pricing</Link><Link href="/contact">Contact</Link></div></nav>
    <section className="card admin-hero"><span className="badge">Policies</span><h1>Legal and customer policy pages.</h1><p>Review the service rules, privacy details, refund policy, and subscription terms.</p></section>
    <section className="grid cards4" style={{marginTop:22}}>
      <Link className="card policy-link-card" href="/terms"><h2>Terms of Service</h2><p>Rules for using the platform.</p></Link>
      <Link className="card policy-link-card" href="/privacy"><h2>Privacy Policy</h2><p>How website data is used.</p></Link>
      <Link className="card policy-link-card" href="/refund-policy"><h2>Refund Policy</h2><p>How refund requests are reviewed.</p></Link>
      <Link className="card policy-link-card" href="/subscription-policy"><h2>Subscription Policy</h2><p>Monthly plans and cancellations.</p></Link>
    </section>
  </main>;
}
