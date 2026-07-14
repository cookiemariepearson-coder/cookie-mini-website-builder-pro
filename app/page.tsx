import Link from 'next/link';
import { plans, EXTRA_PAGE_PRICE } from '@/lib/templates';

const pricingOrder = ['free', 'starter', 'business', 'premium'] as const;

export default function HomePage() {
  return (
    <main>
      <div className="container">
        <nav className="nav launch-nav">
          <Link className="brand brand-link" href="/"><span className="logo">C</span> Cookie Mini Website Builder</Link>
          <div className="navlinks">
            <Link href="/builder">Create Site</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/customer">Customer Login</Link>
          </div>
        </nav>

        <section className="hero split-hero freemium-hero launch-hero">
          <div>
            <span className="badge">Free first page • Monthly subscriptions • AI video kits</span>
            <h1>Build a business website customers can publish, edit, and share.</h1>
            <p>Cookie Mini Website Builder helps small businesses, creators, food brands, beauty brands, service providers, and sellers create a live website with a customer subdomain, dashboard editing, and AI promo tools.</p>
            <div className="controls">
              <Link className="btn gold" href="/builder?plan=free">Start Free</Link>
              <Link className="btn secondary" href="/pricing">View Plans</Link>
              <Link className="btn secondary" href="/video-studio">Try AI Video Studio</Link>
            </div>
            <div className="launch-mini-grid">
              <span>✓ customername.cookiesdigitalcreations.com</span>
              <span>✓ Purpose-based templates</span>
              <span>✓ Customer dashboard</span>
              <span>✓ Website + promo kit in one place</span>
            </div>
          </div>
          <div className="mock freemium-mock launch-showcase">
            <div className="mock-inner">
              <div className="mock-hero">
                <strong>Live website preview</strong>
                <h3 style={{marginTop:16}}>Choose the business type. Pick the look. Enter the details. Publish.</h3>
                <p>Food • Beauty • Real Estate • Wellness • Digital Products • Cleaning • Coaching • Shop • Creator</p>
              </div>
              <div className="launch-art-grid" aria-hidden="true">
                <div className="launch-art-card food">🍽️</div>
                <div className="launch-art-card glam">🌸</div>
                <div className="launch-art-card realty">🏢</div>
                <div className="launch-art-card video">🎬</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="section launch-section soft-band">
        <div className="container">
          <span className="badge">What customers can build</span>
          <h2>Templates made around the type of website they need.</h2>
          <p className="section-lead">Customers choose a website purpose first, then pick a visual style like realistic, floral, luxury, cartoon, 3D, bold, cinematic, or minimal.</p>
          <div className="grid cards4 launch-category-grid">
            {[
              ['Food & Restaurant', 'Menus, specials, ordering info, food gallery', '🍽️'],
              ['Beauty & Salon', 'Services, pricing, booking, glam gallery', '🌸'],
              ['Real Estate', 'Investor info, properties, services, resources', '🏢'],
              ['Digital Products', 'Product benefits, FAQ, buy-now sections', '💻'],
              ['Wellness', 'Benefits, products, testimonials, FAQ', '🌿'],
              ['Cleaning Services', 'Packages, service area, before/after, reviews', '✨'],
              ['Coaching', 'Programs, packages, testimonials, booking', '📘'],
              ['Portfolio / Film', 'Projects, gallery, reel, booking/contact', '🎬']
            ].map(([title, text, icon]) => (
              <div className="card launch-category" key={title}>
                <div className="category-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="pricing">
        <div className="container">
          <span className="badge">Plans</span>
          <h2>Start free, then upgrade when the website needs more.</h2>
          <p className="section-lead">Paid subscriptions keep the website hosted and editable. Starter and Business can add extra pages for ${EXTRA_PAGE_PRICE}/month per page. Premium includes all built-in page options.</p>
          <div className="grid cards4 pricing-grid">
            {pricingOrder.map((key) => {
              const plan = plans[key];
              return <div className={`card pricing-card ${key === 'business' ? 'featured-plan' : ''}`} key={key}>
                {key === 'business' && <span className="badge">Popular</span>}
                {key === 'free' && <span className="badge">Try it first</span>}
                <h3>{key === 'free' ? 'Free First Page' : plan.name}</h3>
                <div className="price">{plan.priceLabel}</div>
                <p>{plan.description}</p>
                <ul className="list">
                  <li>{plan.limitLabel}</li>
                  <li>{plan.creditsLabel}</li>
                  <li>{plan.branded ? 'Cookie branding included' : 'Paid website experience'}</li>
                  <li>{plan.allPages ? 'All built-in pages unlocked' : key === 'free' ? 'Upgrade required for extra pages' : `Extra pages are $${EXTRA_PAGE_PRICE}/month per page`}</li>
                  {plan.annualPrice > 0 && <li>Annual option idea: {plan.annualLabel}</li>}
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

      <section className="section launch-section">
        <div className="container grid cards3">
          <div className="card launch-step-card">
            <span className="step-number">1</span>
            <h3>Choose type and look</h3>
            <p>Customers choose what they need: food, beauty, real estate, wellness, digital products, services, shop, portfolio, and more.</p>
          </div>
          <div className="card launch-step-card">
            <span className="step-number">2</span>
            <h3>Enter website details</h3>
            <p>They add their business name, headline, offers, about wording, page wording, colors, and contact email.</p>
          </div>
          <div className="card launch-step-card">
            <span className="step-number">3</span>
            <h3>Publish or checkout</h3>
            <p>Free users can publish one branded page. Paid users checkout through Gumroad and return to publish.</p>
          </div>
        </div>
      </section>

      <section className="section soft-band">
        <div className="container grid cards3">
          <div className="card">
            <h3>AI Video Studio</h3>
            <p>Create scripts, captions, storyboard notes, voiceover copy, and AI video prompts for TikTok, Reels, YouTube Shorts, Facebook ads, and website videos.</p>
            <Link className="btn secondary" href="/video-studio">Open AI Video Studio</Link>
          </div>
          <div className="card">
            <h3>Customer dashboard</h3>
            <p>Customers can return to edit their site, change wording, adjust pages, and open their published website.</p>
            <Link className="btn secondary" href="/customer">Customer Login</Link>
          </div>
          <div className="card">
            <h3>Support and policies</h3>
            <p>Clear support, refund, subscription, privacy, and terms pages are included so customers understand how everything works.</p>
            <Link className="btn secondary" href="/contact">Contact Support</Link>
          </div>
        </div>
      </section>

      <footer className="launch-footer">
        <div className="container footer-grid">
          <div>
            <strong>Cookie Mini Website Builder</strong>
            <p>Build, publish, edit, and promote business websites from one simple platform.</p>
          </div>
          <div className="footer-links">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/refund-policy">Refund Policy</Link>
            <Link href="/subscription-policy">Subscription Policy</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
