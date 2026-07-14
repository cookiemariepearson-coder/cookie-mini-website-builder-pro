import Link from 'next/link';

export default function RefundPolicyPage() {
  return <main className="container section legal-page">
    <nav className="nav launch-nav"><Link className="brand brand-link" href="/"><span className="logo">C</span> Cookie Mini Website Builder</Link><div className="navlinks"><Link href="/pricing">Pricing</Link><Link href="/subscription-policy">Subscription Policy</Link><Link href="/contact">Contact</Link></div></nav>
    <section className="card admin-hero"><span className="badge">Refund Policy</span><h1>Refund Policy</h1><p>This policy explains how refunds should be handled for website subscriptions and add-ons.</p></section>
    <section className="card legal-card">
      <h2>Subscriptions</h2><p>Monthly subscription payments cover hosted access, editing access, and plan features for the billing period. Because the service is delivered digitally, refunds are not automatic once access has been used.</p>
      <h2>Free first page</h2><p>The free first page lets customers test the platform before choosing a paid subscription.</p>
      <h2>Duplicate or accidental payments</h2><p>If a customer believes they were charged twice or subscribed to the wrong plan, they should contact support with the checkout email and product name.</p>
      <h2>Technical issues</h2><p>If a technical issue prevents a customer from using the service, support should be contacted so the issue can be reviewed and corrected when possible.</p>
      <h2>Cancellation</h2><p>Customers can cancel through the checkout provider or request help. Cancellation stops future billing but does not automatically refund previous billing periods.</p>
    </section>
  </main>;
}
