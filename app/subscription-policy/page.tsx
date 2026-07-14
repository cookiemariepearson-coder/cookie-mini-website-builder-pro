import Link from 'next/link';

export default function SubscriptionPolicyPage() {
  return <main className="container section legal-page">
    <nav className="nav launch-nav"><Link className="brand brand-link" href="/"><span className="logo">C</span> Cookie Mini Website Builder</Link><div className="navlinks"><Link href="/pricing">Pricing</Link><Link href="/refund-policy">Refund Policy</Link><Link href="/contact">Contact</Link></div></nav>
    <section className="card admin-hero"><span className="badge">Subscription & Cancellation Policy</span><h1>Subscriptions keep websites hosted and editable.</h1><p>This page explains what monthly plans, extra pages, cancellations, and paused websites mean.</p></section>
    <section className="card legal-card">
      <h2>Monthly plans</h2><p>Starter, Business, and Premium are monthly subscriptions. The subscription keeps the customer website hosted, editable, and connected to the customer dashboard while the subscription is active.</p>
      <h2>Extra pages</h2><p>Starter and Business plans include page limits. Additional pages are available through the extra page add-on at $10/month per extra page. Premium includes all built-in page options.</p>
      <h2>Failed or canceled payments</h2><p>If payment fails or a subscription is canceled, the website may be paused, limited, or unpublished until the subscription is active again.</p>
      <h2>Changing plans</h2><p>Customers may upgrade to a higher plan if they need more pages, more features, or more Cookie Credits. Plan changes may require a new checkout link.</p>
      <h2>Customer content</h2><p>Customers should save a copy of important wording, images, and business information they add to their website.</p>
    </section>
  </main>;
}
