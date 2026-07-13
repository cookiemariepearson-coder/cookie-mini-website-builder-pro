import Link from 'next/link';
import { plans, EXTRA_PAGE_PRICE } from '@/lib/templates';

const order = ['free', 'starter', 'business', 'premium'] as const;

export default function PricingPage() {
  return <main className="container section">
    <nav className="nav">
      <div className="brand"><span className="logo">C</span> Cookie Mini Website Builder Pricing</div>
      <div className="navlinks"><Link href="/builder">Create Site</Link><Link href="/customer">Customer Login</Link><Link href="/">Home</Link></div>
    </nav>
    <section className="card admin-hero">
      <span className="badge">Free + subscriptions</span>
      <h1>Pricing designed for small businesses and creators.</h1>
      <p>Start with a free branded page, then upgrade to a monthly plan when the customer needs more pages, more polish, and ongoing editing.</p>
    </section>
    <section className="grid cards4 pricing-grid" style={{marginTop: 22}}>
      {order.map(key => {
        const plan = plans[key];
        return <div className="card pricing-card" key={key}>
          <h2>{plan.name}</h2>
          <div className="price">{plan.priceLabel}</div>
          <p>{plan.description}</p>
          <ul className="list">
            <li>{plan.limitLabel}</li>
            <li>{plan.creditsLabel}</li>
            <li>{plan.branded ? 'Includes Cookie branding' : 'Professional paid plan'}</li>
            {plan.annualPrice > 0 && <li>Suggested annual option: {plan.annualLabel}</li>}
          </ul>
          <Link className="btn gold" href={`/builder?plan=${key}`}>{key === 'free' ? 'Start Free' : 'Start This Plan'}</Link>
        </div>;
      })}
    </section>
    <section className="card" style={{marginTop: 22}}>
      <h2>Extras</h2>
      <p><strong>Extra pages:</strong> ${EXTRA_PAGE_PRICE}/month per extra page for Starter and Business customers.</p>
      <p><strong>Cookie Credits:</strong> Included monthly credits are for AI tools. Later, when real AI video generation is connected, credits will protect your platform from unlimited usage costs.</p>
    </section>
  </main>;
}
