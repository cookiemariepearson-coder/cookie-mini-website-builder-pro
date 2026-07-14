import Link from 'next/link';

const supportEmail = 'support@cookiesdigitalcreations.com';

export default function ContactPage() {
  return <main className="container section">
    <nav className="nav launch-nav">
      <Link className="brand brand-link" href="/"><span className="logo">C</span> Cookie Mini Website Builder</Link>
      <div className="navlinks"><Link href="/builder">Create Site</Link><Link href="/pricing">Pricing</Link><Link href="/faq">FAQ</Link><Link href="/customer">Customer Login</Link></div>
    </nav>
    <section className="card admin-hero">
      <span className="badge">Contact Support</span>
      <h1>Need help with a website, subscription, or checkout?</h1>
      <p>Click the email button below and include the website name/subdomain, customer email, plan, and a short description of the issue.</p>
      <div className="controls">
        <a className="btn gold" href={`mailto:${supportEmail}?subject=Cookie Mini Website Builder Support`}>Email Support</a>
        <Link className="btn secondary" href="/customer">Customer Dashboard</Link>
      </div>
    </section>
    <section className="grid cards3" style={{marginTop: 22}}>
      <div className="card"><h2>For website issues</h2><p>Send the website subdomain, the customer email, and what is not saving or opening.</p></div>
      <div className="card"><h2>For payment issues</h2><p>Send the Gumroad product name, subscription plan, and the email used at checkout.</p></div>
      <div className="card"><h2>For extra pages</h2><p>Use the extra page checkout link first, then return to the dashboard to continue editing.</p></div>
    </section>
  </main>;
}
