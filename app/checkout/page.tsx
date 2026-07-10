'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { plans, getPlanPrice, getBillingLabel, getExtraPageCount, EXTRA_PAGE_PRICE, type PlanKey } from '@/lib/templates';

type PendingSite = {
  slug: string;
  businessName: string;
  plan: PlanKey;
  pages: string[];
  extraPageCount?: number;
};

const checkoutUrls: Record<PlanKey, string | undefined> = {
  starter: process.env.NEXT_PUBLIC_STARTER_SUBSCRIPTION_CHECKOUT_URL,
  business: process.env.NEXT_PUBLIC_BUSINESS_SUBSCRIPTION_CHECKOUT_URL,
  premium: process.env.NEXT_PUBLIC_PREMIUM_SUBSCRIPTION_CHECKOUT_URL
};

export default function CheckoutPage() {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cookiesdigitalcreations.com';
  const [site, setSite] = useState<PendingSite | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('cookie-builder-pending-site');
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      setSite(parsed);
    } catch {
      setMessage('The checkout draft could not be read. Please go back to the builder and try again.');
    }
  }, []);

  const planKey = useMemo<PlanKey>(() => site?.plan || 'starter', [site]);
  const plan = plans[planKey];
  const selectedPageCount = site?.pages?.length || plan.maxPages;
  const extraPages = getExtraPageCount(planKey, selectedPageCount);
  const basePrice = plan.monthlyPrice;
  const extraPagesTotal = extraPages * EXTRA_PAGE_PRICE;
  const price = getPlanPrice(planKey, selectedPageCount);
  const priceLabel = getBillingLabel(planKey, selectedPageCount);
  const checkoutUrl = checkoutUrls[planKey];

  function payNow() {
    if (!site) {
      setMessage('Please go back to the builder and create a website before checkout.');
      return;
    }

    if (!checkoutUrl) {
      setMessage(`Checkout is not connected yet for the ${plan.name}. Add NEXT_PUBLIC_${planKey.toUpperCase()}_SUBSCRIPTION_CHECKOUT_URL in Vercel Environment Variables, then redeploy.`);
      return;
    }

    const updatedSite = { ...site, billing: 'subscription', extraPageCount: extraPages, price, priceLabel };
    localStorage.setItem('cookie-builder-pending-site', JSON.stringify(updatedSite));
    window.location.href = checkoutUrl;
  }

  return (
    <main className="container section">
      <nav className="nav">
        <div className="brand"><span className="logo">C</span> Cookie Mini Website Builder Checkout</div>
        <Link className="btn secondary" href="/builder">Back to Builder</Link>
      </nav>

      <div className="checkout-layout">
        <section className="card">
          <span className="badge">Subscription checkout required before publishing</span>
          <h1 style={{fontSize: 'clamp(38px, 6vw, 64px)'}}>Finish subscription checkout, then publish the website.</h1>
          <p>The website is saved as a pending draft. After successful subscription checkout, the customer returns to the success page and the site is published to their subdomain.</p>

          {message && <div className="notice danger">{message}</div>}

          <div className="controls">
            <button className="btn gold" onClick={payNow}>Pay {priceLabel} & Publish</button>
            <Link className="btn secondary" href="/checkout/cancel">Cancel Checkout</Link>
          </div>

          {extraPages > 0 && <div className="notice" style={{marginTop: 18}}>
            This order includes {extraPages} extra page{extraPages > 1 ? 's' : ''} at {`$${EXTRA_PAGE_PRICE}/month`} each. Make sure your checkout link collects the correct monthly total or collect the extra-page subscription add-on before publishing.
          </div>}
        </section>

        <aside className="card checkout-card">
          <h2>Order Summary</h2>
          <div className="checkout-row"><span>Website</span><strong>{site?.businessName || 'Pending website'}</strong></div>
          <div className="checkout-row"><span>Subscription</span><strong>{plan.name}</strong></div>
          <div className="checkout-row"><span>Included</span><strong>{plan.limitLabel}</strong></div>
          <div className="checkout-row"><span>Pages selected</span><strong>{site?.pages?.join(', ') || 'Home'}</strong></div>
          <div className="checkout-row"><span>Base subscription</span><strong>${basePrice}/month</strong></div>
          <div className="checkout-row"><span>Extra pages</span><strong>{extraPages > 0 ? `${extraPages} × $${EXTRA_PAGE_PRICE}/month = $${extraPagesTotal}/month` : '$0/month'}</strong></div>
          <div className="checkout-total"><span>Monthly Total</span><strong>{priceLabel}</strong></div>
          <p className="small">After payment, the published link will be: <strong>{site?.slug || 'customer'}.{rootDomain}</strong></p>
        </aside>
      </div>
    </main>
  );
}
