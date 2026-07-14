import Link from 'next/link';
import { plans, EXTRA_PAGE_PRICE } from '@/lib/templates';

const order = ['free', 'starter', 'business', 'premium'] as const;

export default function PricingPage() {
  return <main>
    <div className="container section">
      <nav className="nav launch-nav">
        <Link className="brand brand-link" href="/"><span className="logo">C</span> Cookie Mini Website Builder Pricing</Link>
        <div className="navlinks"><Link href="/builder">Create Site</Link><Link href="/how-it-works">How It Works</Link><Link href="/faq">FAQ</Link><Link href="/customer">Customer Login</Link></div>
      </nav>
      <section className="card admin-hero launch-pricing-hero">
        <span className="badge">Free first page + subscriptions</span>
        <h1>Simple pricing for small businesses and creators.</h1>
        <p>Start free with one branded page. Upgrade when the customer needs more pages, stronger features, ongoing editing, and more Cookie Credits for AI tools.</p>
      </section>
      <section className="grid cards4 pricing-grid" style={{marginTop: 22}}>
        {order.map(key => {
          const plan = plans[key];
          const title = key === 'free' ? 'Free First Page' : plan.name;
          return <div className={`card pricing-card ${key === 'business' ? 'featured-plan' : ''}`} key={key}>
            {key === 'business' && <span className="badge">Popular</span>}
            {key === 'free' && <span className="badge">No checkout to start</span>}
            <h2>{title}</h2>
            <div className="price">{plan.priceLabel}</div>
            <p>{plan.description}</p>
            <ul className="list">
              <li>{plan.limitLabel}</li>
              <li>{plan.creditsLabel}</li>
              <li>{plan.branded ? 'Cookie branding appears on the free website' : 'Paid website experience'}</li>
              <li>{plan.allPages ? 'All built-in pages and sections included' : key === 'free' ? 'One page only' : `Extra pages available for $${EXTRA_PAGE_PRICE}/month each`}</li>
              {plan.annualPrice > 0 && <li>Annual option idea: {plan.annualLabel}</li>}
            </ul>
            <Link className="btn gold" href={`/builder?plan=${key}`}>{key === 'free' ? 'Start Free' : 'Start This Plan'}</Link>
          </div>;
        })}
      </section>
      <section className="grid cards3" style={{marginTop: 22}}>
        <div className="card">
          <h2>Extra pages</h2>
          <p><strong>${EXTRA_PAGE_PRICE}/month per extra page</strong> for Starter and Business customers who need more pages than their plan includes.</p>
        </div>
        <div className="card">
          <h2>Cookie Credits</h2>
          <p>Cookie Credits are for AI tools such as AI Video Studio kits now and real AI video generation later. Website pages do not use credits.</p>
        </div>
        <div className="card">
          <h2>Annual pricing idea</h2>
          <p>Annual options can be offered later as a discount for customers who want to pay ahead. Monthly subscriptions should stay as the main setup.</p>
        </div>
      </section>
      <section className="notice" style={{marginTop: 22}}>
        <strong>Subscription note:</strong> Subscriptions keep the website hosted and editable. If a subscription is canceled, unpaid, or disputed, the website may be paused according to the subscription policy.
      </section>
    </div>
  </main>;
}
