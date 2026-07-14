import Link from 'next/link';

export default function TermsPage() {
  return <main className="container section legal-page">
    <nav className="nav launch-nav"><Link className="brand brand-link" href="/"><span className="logo">C</span> Cookie Mini Website Builder</Link><div className="navlinks"><Link href="/pricing">Pricing</Link><Link href="/privacy">Privacy</Link><Link href="/contact">Contact</Link></div></nav>
    <section className="card admin-hero"><span className="badge">Terms of Service</span><h1>Cookie Mini Website Builder Terms</h1><p>These terms explain the basic rules for using the website builder and hosted website service.</p></section>
    <section className="card legal-card">
      <h2>1. Service description</h2><p>Cookie Mini Website Builder provides tools to create, publish, edit, and promote customer websites through Cookie Digital Creations. Features may include templates, website hosting, customer dashboards, AI creative kits, and subscription-based website access.</p>
      <h2>2. Customer responsibility</h2><p>Customers are responsible for the information, text, images, offers, claims, prices, and links they add to their websites. Customers should not upload or publish illegal, misleading, harmful, abusive, infringing, or unauthorized content.</p>
      <h2>3. Subscriptions and access</h2><p>Paid plans are subscriptions unless clearly stated otherwise. Subscriptions keep the website hosted and editable while the subscription is active and payment is current.</p>
      <h2>4. Website availability</h2><p>Cookie Digital Creations will make reasonable efforts to keep websites available, but no website platform can guarantee uninterrupted access. Maintenance, third-party outages, payment issues, domain changes, or technical problems may affect availability.</p>
      <h2>5. AI tools</h2><p>AI Video Studio currently creates creative kits such as scripts, captions, storyboards, and prompts. AI outputs may need review and editing before use. Customers are responsible for checking the accuracy and appropriateness of AI-generated content.</p>
      <h2>6. Pausing or removing websites</h2><p>Websites may be paused or removed if payment fails, a subscription is canceled, the website violates these terms, or the account creates risk for the platform.</p>
      <h2>7. Changes</h2><p>Cookie Digital Creations may update plans, features, pricing, terms, templates, and platform rules as the service grows. Continued use of the platform means acceptance of the current terms.</p>
    </section>
  </main>;
}
