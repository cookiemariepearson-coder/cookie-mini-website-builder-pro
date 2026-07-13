import Link from 'next/link';
import { plans, EXTRA_PAGE_PRICE } from '@/lib/templates';

const pricingOrder = ['free', 'starter', 'business', 'premium'] as const;

export default function HomePage() {
  return (
    <main>
      <div className="container">
        <nav className="nav">
          <div className="brand"><span className="logo">C</span> Cookie Mini Website Builder</div>
          <div className="navlinks">
            <Link href="/builder">Create Site</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/customer">Customer Login</Link>
            <Link href="/video-studio">AI Video Studio</Link>
          </div>
        </nav>

        <section className="hero split-hero freemium-hero">
          <div>
            <span className="badge">Free launch page + paid subscriptions</span>
            <h1>Build a business website first. Upgrade when they need more.</h1>
            <p>Cookie Mini Website Builder helps customers create a free launch page, upgrade to paid website subscriptions, add extra pages, and create AI promo video kits for their business.</p>
            <div className="controls">
              <Link className="btn gold" href="/builder">Start Free Launch Page</Link>
              <Link className="btn secondary" href="#pricing">View Plans</Link>
              <Link className="btn secondary" href="/video-studio">Try AI Video Studio</Link>
            </div>
          </div>
          <div className="mock freemium-mock">
            <div className="mock-inner">
              <div className="mock-hero">
                <strong>customername.cookiesdigitalcreations.com</strong>
                <h3 style={{marginTop:16}}>Start free. Upgrade to unlock pages, templates, and credits.</h3>
                <p>Free launch page • Monthly plans • Extra pages • Cookie Credits • AI Video Studio</p>
              </div>
              <div className="mock-row">
                <div className="mock-tile">Free</div>
                <div className="mock-tile">$19/mo</div>
                <div className="mock-tile">$30/mo</div>
                <div className="mock-tile">$50/mo</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="section" id="pricing">
        <div className="container">
          <span className="badge">Pricing</span>
          <h2>Simple subscriptions with a free first page.</h2>
          <p className="section-lead">Use the free plan to let people try the builder. Paid plans remove the free branding, unlock stronger pages, and include monthly Cookie Credits for AI tools.</p>
          <div className="grid cards4 pricing-grid">
            {pricingOrder.map((key) => {
              const plan = plans[key];
              return <div className={`card pricing-card ${key === 'business' ? 'featured-plan' : ''}`} key={key}>
                {key === 'business' && <span className="badge">Best for small business</span>}
                {key === 'free' && <span className="badge">Try it first</span>}
                <h3>{plan.name}</h3>
                <div className="price">{plan.priceLabel}</div>
                <p>{plan.description}</p>
                <ul className="list">
                  <li>{plan.limitLabel}</li>
                  <li>{plan.creditsLabel}</li>
                  <li>{plan.branded ? 'Cookie branding included' : 'Professional paid website experience'}</li>
                  <li>{plan.allPages ? 'All built-in page options unlocked' : key === 'free' ? 'Upgrade required for extra pages' : `Extra pages are $${EXTRA_PAGE_PRICE}/month per page`}</li>
                  {plan.annualPrice > 0 && <li>Suggested annual option: {plan.annualLabel}</li>}
                </ul>
                <Link className="btn gold" href={`/builder?plan=${key}`}>{key === 'free' ? 'Start Free' : 'Choose Plan'}</Link>
              </div>;
            })}
          </div>
          <div className="notice" style={{marginTop: 18}}>
            <strong>Cookie Credits:</strong> Credits are for AI tools such as AI Video Studio kits now and real AI video generation later. Website pages do not use credits.
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid cards3">
          <div className="card">
            <h3>How it works</h3>
            <p><strong>Choose Template</strong> → <strong>Content</strong> → <strong>Design</strong> → <strong>Pages</strong> → <strong>Publish Free</strong> or <strong>Checkout</strong>.</p>
          </div>
          <div className="card">
            <h3>Extra pages</h3>
            <p>Starter and Business customers can add pages at ${EXTRA_PAGE_PRICE}/month per page. Premium includes all available page and section options.</p>
          </div>
          <div className="card">
            <h3>AI Video Studio</h3>
            <p>Customers can create scripts, captions, storyboard notes, voiceover copy, and AI video prompts for promoting their website.</p>
            <Link className="btn secondary" href="/video-studio">Open AI Video Studio</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
