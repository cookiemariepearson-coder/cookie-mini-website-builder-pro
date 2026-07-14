import Link from 'next/link';

export default function PrivacyPage() {
  return <main className="container section legal-page">
    <nav className="nav launch-nav"><Link className="brand brand-link" href="/"><span className="logo">C</span> Cookie Mini Website Builder</Link><div className="navlinks"><Link href="/terms">Terms</Link><Link href="/contact">Contact</Link><Link href="/pricing">Pricing</Link></div></nav>
    <section className="card admin-hero"><span className="badge">Privacy Policy</span><h1>Privacy Policy</h1><p>This page explains the basic information collected when customers use Cookie Mini Website Builder.</p></section>
    <section className="card legal-card">
      <h2>Information collected</h2><p>The builder may collect website details entered by customers, such as business name, email, phone number if provided, website content, selected pages, selected template, colors, plan type, and published website slug/subdomain.</p>
      <h2>Payment information</h2><p>Payments are handled through Gumroad or another checkout provider. Cookie Mini Website Builder does not need to store full card numbers inside the website builder.</p>
      <h2>How information is used</h2><p>Information is used to create, publish, display, edit, support, and manage customer websites and subscriptions.</p>
      <h2>Published website content</h2><p>Any content a customer publishes on their website may be publicly visible through the customer website link.</p>
      <h2>Third-party tools</h2><p>The platform may use hosting, database, checkout, and other third-party services to run the builder, process subscriptions, and keep websites online.</p>
      <h2>Contact</h2><p>For privacy questions or support, contact Cookie Digital Creations through the contact page.</p>
    </section>
  </main>;
}
