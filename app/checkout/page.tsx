'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { plans, getPlanPrice, getBillingLabel, getExtraPageCount, EXTRA_PAGE_PRICE, isPaidPlan, normalizePlanKey, type PlanKey, type PaidPlanKey } from '@/lib/templates';

type PendingSite = {
  slug: string;
  businessName: string;
  plan: PlanKey;
  pages: string[];
  extraPageCount?: number;
};

const checkoutUrls: Record<PaidPlanKey, string | undefined> = {
  starter: process.env.NEXT_PUBLIC_STARTER_SUBSCRIPTION_CHECKOUT_URL,
  business: process.env.NEXT_PUBLIC_BUSINESS_SUBSCRIPTION_CHECKOUT_URL,
  premium: process.env.NEXT_PUBLIC_PREMIUM_SUBSCRIPTION_CHECKOUT_URL
};

function normalizeCheckoutUrl(rawUrl?: string) {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('gumroad.com') && !parsed.searchParams.has('wanted')) parsed.searchParams.set('wanted', 'true');
    return parsed.toString();
  } catch {
    return '';
  }
}

export default function CheckoutPage() {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cookiesdigitalcreations.com';
  const [site, setSite] = useState<PendingSite | null>(null);
  const [message, setMessage] = useState('');
  const [publishingFree, setPublishingFree] = useState(false);
  const [freeLink, setFreeLink] = useState('');
  const [freePathLink, setFreePathLink] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('cookie-builder-pending-site');
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      setSite({ ...parsed, plan: normalizePlanKey(parsed.plan) });
    } catch {
      setMessage('The checkout draft could not be read. Please go back to the builder and try again.');
    }
  }, []);

  const planKey = useMemo<PlanKey>(() => normalizePlanKey(site?.plan || 'starter'), [site]);
  const plan = plans[planKey];
  const selectedPageCount = site?.pages?.length || plan.maxPages;
  const extraPages = getExtraPageCount(planKey, selectedPageCount);
  const basePrice = plan.monthlyPrice;
  const extraPagesTotal = extraPages * EXTRA_PAGE_PRICE;
  const price = getPlanPrice(planKey, selectedPageCount);
  const priceLabel = getBillingLabel(planKey, selectedPageCount);
  const checkoutUrl = isPaidPlan(planKey) ? normalizeCheckoutUrl(checkoutUrls[planKey]) : '';
  const extraPageCheckoutUrl = normalizeCheckoutUrl(process.env.NEXT_PUBLIC_EXTRA_PAGE_SUBSCRIPTION_CHECKOUT_URL);

  async function publishFreeFromCheckout() {
    if (!site) {
      setMessage('Please go back to the builder and create a website first.');
      return;
    }
    const payload = { ...site, plan: 'free', pages: ['Home'], billing: 'free', price: 0, priceLabel: 'Free' };
    setPublishingFree(true);
    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'Could not publish free page.');
      setFreeLink(data.link);
      setFreePathLink(data.pathLink);
      localStorage.setItem('cookie-builder-published-site', JSON.stringify({ ...payload, publishedLink: data.link, pathLink: data.pathLink }));
      localStorage.removeItem('cookie-builder-pending-site');
      setMessage('Free Launch Page published successfully. Upgrade later to unlock more pages and remove Cookie branding.');
    } catch (error: any) {
      setMessage(error.message || 'Could not publish free page.');
    } finally {
      setPublishingFree(false);
    }
  }

  function payNow() {
    if (!site) {
      setMessage('Please go back to the builder and create a website before checkout.');
      return;
    }

    if (planKey === 'free') {
      publishFreeFromCheckout();
      return;
    }

    if (!checkoutUrl) {
      setMessage(`Checkout is not connected yet for the ${plan.name}. Add NEXT_PUBLIC_${planKey.toUpperCase()}_SUBSCRIPTION_CHECKOUT_URL in Vercel Environment Variables, then redeploy.`);
      return;
    }

    const updatedSite = { ...site, billing: 'subscription', extraPageCount: extraPages, price, priceLabel, paymentStartedAt: new Date().toISOString() };
    localStorage.setItem('cookie-builder-pending-site', JSON.stringify(updatedSite));
    localStorage.setItem('cookie-builder-last-draft', JSON.stringify(updatedSite));
    window.location.href = checkoutUrl;
  }

  function openExtraPageCheckout() {
    if (!extraPageCheckoutUrl) {
      setMessage('Extra page checkout is not connected yet. Add NEXT_PUBLIC_EXTRA_PAGE_SUBSCRIPTION_CHECKOUT_URL in Vercel Environment Variables, then redeploy.');
      return;
    }
    const updatedSite = site ? { ...site, billing: 'subscription', extraPageCount: extraPages, price, priceLabel, paymentStartedAt: new Date().toISOString() } : site;
    if (updatedSite) localStorage.setItem('cookie-builder-pending-site', JSON.stringify(updatedSite));
    window.open(extraPageCheckoutUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <main className="container section">
      <nav className="nav">
        <div className="brand"><span className="logo">C</span> Cookie Mini Website Builder Checkout</div>
        <Link className="btn secondary" href="/builder">Back to Builder</Link>
      </nav>

      <div className="checkout-layout">
        <section className="card">
          <span className="badge">{planKey === 'free' ? 'Free Launch Page' : 'Subscription checkout required before publishing'}</span>
          <h1 style={{fontSize: 'clamp(38px, 6vw, 64px)'}}>{planKey === 'free' ? 'Publish the free page now.' : 'Finish subscription checkout, then return to publish.'}</h1>
          <p>{planKey === 'free' ? 'Free pages publish without Gumroad checkout and include Cookie Mini Website Builder branding.' : 'The website draft is saved in this browser before payment. After payment, Gumroad should return the customer to the success page so the site can publish and show the live subdomain.'}</p>

          {message && <div className={message.includes('successfully') ? 'notice' : 'notice danger'}>{message}</div>}

          {planKey !== 'free' && <div className="notice" style={{marginBottom: 18}}>
            <strong>Return URL for every Gumroad subscription:</strong><br />
            <span className="small">https://www.cookiesdigitalcreations.com/checkout/success?paid=1</span>
          </div>}

          <div className="controls">
            <button className="btn gold" onClick={payNow} disabled={publishingFree}>{publishingFree ? 'Publishing...' : planKey === 'free' ? 'Publish Free Launch Page' : `Pay ${priceLabel} & Return to Publish`}</button>
            <Link className="btn secondary" href="/checkout/cancel">Cancel Checkout</Link>
          </div>

          {freeLink && <div className="notice" style={{marginTop: 18}}>
            <strong>Free website is live:</strong><br />{freeLink}
            <div className="controls" style={{marginTop: 12}}>
              <a className="btn gold" href={`https://${freeLink}`} target="_blank" rel="noreferrer">Open Free Website</a>
              {freePathLink && <a className="btn secondary" href={freePathLink} target="_blank" rel="noreferrer">Open Backup Link</a>}
            </div>
          </div>}

          {extraPages > 0 && planKey !== 'free' && <div className="notice" style={{marginTop: 18}}>
            <strong>Extra page add-on required:</strong> This order includes {extraPages} extra page{extraPages > 1 ? 's' : ''} at {`$${EXTRA_PAGE_PRICE}/month`} each.
            <div className="controls" style={{marginTop: 12}}>
              <button className="btn secondary" onClick={openExtraPageCheckout}>Open Extra Page Add-On</button>
            </div>
            <p className="small" style={{marginTop: 10}}>Use the $10/month add-on for each extra page selected. If Gumroad lets customers choose quantity, set the quantity to {extraPages}.</p>
          </div>}
        </section>

        <aside className="card checkout-card">
          <h2>Order Summary</h2>
          <div className="checkout-row"><span>Website</span><strong>{site?.businessName || 'Pending website'}</strong></div>
          <div className="checkout-row"><span>Plan</span><strong>{plan.name}</strong></div>
          <div className="checkout-row"><span>Included</span><strong>{plan.limitLabel}</strong></div>
          <div className="checkout-row"><span>Pages selected</span><strong>{planKey === 'free' ? 'Home' : site?.pages?.join(', ') || 'Home'}</strong></div>
          <div className="checkout-row"><span>Base subscription</span><strong>{planKey === 'free' ? 'Free' : `$${basePrice}/month`}</strong></div>
          <div className="checkout-row"><span>Extra pages</span><strong>{extraPages > 0 ? `${extraPages} × $${EXTRA_PAGE_PRICE}/month = $${extraPagesTotal}/month` : '$0/month'}</strong></div>
          <div className="checkout-total"><span>Monthly Total</span><strong>{priceLabel}</strong></div>
          <p className="small">After publishing, the link will be: <strong>{site?.slug || 'customer'}.{rootDomain}</strong></p>
        </aside>
      </div>
    </main>
  );
}
