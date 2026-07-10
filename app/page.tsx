import Link from 'next/link';
import { plans, EXTRA_PAGE_PRICE } from '@/lib/templates';

export default function HomePage() {
  return (
    <main>
      <div className="container">
        <nav className="nav">
          <div className="brand"><span className="logo">C</span> Cookie Mini Website Builder</div>
          <div className="navlinks">
            <Link href="/builder">Create Site</Link>
            <Link href="/dashboard">Dashboard</Link>
            <a href="#pricing">Subscriptions</a>
          </div>
        </nav>
        <section className="hero">
          <div>
            <span className="badge">Advanced multi-customer website platform</span>
            <h1>Let customers build, subscribe, and publish websites on your domain.</h1>
            <p>Customers can create a website, go to subscription checkout, pay for the plan they selected, and receive a live link like <strong>customername.cookiesdigitalcreations.com</strong>. You can also build websites for customers yourself.</p>
            <div className="controls">
              <Link className="btn gold" href="/builder">Start Building</Link>
              <Link className="btn secondary" href="/site/maryscleaning">View Demo Site</Link>
            </div>
          </div>
          <div className="mock">
            <div className="mock-inner">
              <div className="mock-hero">
                <strong>maryscleaning.cookiesdigitalcreations.com</strong>
                <h3 style={{marginTop:16}}>Sparkling clean homes without the stress.</h3>
                <p>Live website preview with pages, services, contact, checkout, and branded design.</p>
              </div>
              <div className="mock-row">
                <div className="mock-tile">Build</div>
                <div className="mock-tile">Subscribe</div>
                <div className="mock-tile">Publish</div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <section className="section" id="pricing">
        <div className="container">
          <h2>Subscription pricing that matches what the customer receives</h2>
          <div className="grid cards3">
            {Object.entries(plans).map(([key, plan]) => (
              <div className="card" key={key}>
                <h3>{plan.name}</h3>
                <div className="price">{plan.priceLabel}</div>
                <p>{plan.description}</p>
                <ul className="list">
                  <li>{plan.limitLabel}</li>
                  <li>Subscription checkout required before publishing</li>
                  <li>Live customer subdomain link</li>
                  <li>{plan.allPages ? 'All current page options unlocked' : `Extra pages are $${EXTRA_PAGE_PRICE}/month per page`}</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container card">
          <h2>How customers use it</h2>
          <p><strong>Choose Template</strong> → <strong>Content Next</strong> → <strong>Design Next</strong> → <strong>Sections / Pages Next</strong> → <strong>Preview & Checkout</strong> → <strong>Subscribe</strong> → <strong>Publish Website</strong>.</p>
          <p>Starter is $19/month and best for one-page sites. Business is $30/month and includes up to 3 pages. Premium is $50/month and unlocks all available page and section options. Extra pages for Starter or Business are {`$${EXTRA_PAGE_PRICE}/month per page`}.</p>
        </div>
      </section>
    </main>
  );
}
