import Link from 'next/link';

const faqs = [
  ['Can I start for free?', 'Yes. The free first page lets a customer build and publish one basic branded page before upgrading.'],
  ['What happens when I upgrade?', 'Paid subscriptions unlock the plan limits, dashboard access, paid-plan experience, and more Cookie Credits for AI tools.'],
  ['How do customer website links work?', 'Published websites use customer subdomains such as customername.cookiesdigitalcreations.com.'],
  ['Can customers edit their website later?', 'Yes. Customers can use the customer dashboard to open, edit, and republish their website.'],
  ['How do extra pages work?', 'Starter and Business plans have page limits. Extra pages are handled through the $10/month extra page checkout. Premium includes all built-in page options.'],
  ['Does AI Video Studio create real MP4 videos right now?', 'Right now AI Video Studio creates a creative video kit: script, captions, storyboard, voiceover copy, and AI prompts. Real video generation can be connected later with a paid AI video API.'],
  ['What if something goes wrong?', 'Use the Contact Us page or the support button for help. Include the website name/subdomain and the email used in the builder.'],
  ['Can a website be paused?', 'Yes. A website may be paused if payment fails, a subscription is canceled, or the account violates the terms.']
];

export default function FAQPage() {
  return <main className="container section">
    <nav className="nav launch-nav">
      <Link className="brand brand-link" href="/"><span className="logo">C</span> Cookie Mini Website Builder</Link>
      <div className="navlinks"><Link href="/builder">Create Site</Link><Link href="/pricing">Pricing</Link><Link href="/contact">Contact</Link><Link href="/customer">Customer Login</Link></div>
    </nav>
    <section className="card admin-hero">
      <span className="badge">FAQ</span>
      <h1>Common questions before building a website.</h1>
      <p>These answers help customers understand the free page, subscriptions, extra pages, AI video kits, and customer dashboard.</p>
    </section>
    <section className="faq-list" style={{marginTop: 22}}>
      {faqs.map(([q, a]) => <details className="card faq-card" key={q}>
        <summary>{q}</summary>
        <p>{a}</p>
      </details>)}
    </section>
  </main>;
}
